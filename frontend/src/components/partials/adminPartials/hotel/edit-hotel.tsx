import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import axios from "@/lib/axios"

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const hotelSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama hotel harus memiliki minimal 2 karakter.",
  }),
  alamat: z.string().min(5, {
    message: "Alamat harus memiliki minimal 5 karakter.",
  }),
  bintang: z.number().min(1).max(5),
  harga: z.number().positive({
    message: "Harga harus berupa angka positif.",
  }),
  fasilitas: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "Fasilitas harus memiliki minimal 2 karakter.",
        }),
      })
    )
    .min(1, "Minimal satu fasilitas diperlukan."),
  newImage: z.instanceof(File).optional().nullable(),
  existingImage: z.string().optional().nullable(),
});

type HotelFormValues = z.infer<typeof hotelSchema>

const EditHotel = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      bintang: 1,
      harga: 0,
      fasilitas: [{ name: "" }],
      existingImage: undefined,
      newImage: undefined
    },
  })

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control: form.control,
    name: "fasilitas",
  })

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`/hotel/get/${id}`)
        const hotel = response.data

        form.reset({
          nama: hotel.nama,
          alamat: hotel.alamat,
          bintang: hotel.bintang,
          harga: hotel.harga,
          fasilitas: hotel.fasilitas.map((name: string) => ({ name })),
          existingImage: hotel.gambar[0],
          newImage: undefined
        })
      } catch (error) {
        console.error('Error fetching hotel:', error)
        toast({
          title: "Error",
          description: "Gagal mengambil data hotel",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHotelData()
  }, [id, form, toast])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Ukuran gambar terlalu besar (maksimum 2MB)",
          variant: "destructive",
        })
        return
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Format file tidak didukung",
          variant: "destructive",
        })
        return
      }
      form.setValue('newImage', file)
      form.setValue('existingImage', undefined)
    }
  }

  const handleRemoveImage = () => {
    const hasNewImage = form.getValues('newImage')
    if (!hasNewImage) {
      toast({
        title: "Peringatan",
        description: "Hotel harus memiliki minimal satu gambar!",
        variant: "destructive",
      })
      return
    }
    form.setValue('existingImage', undefined)
  }

  async function onSubmit(data: HotelFormValues) {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('alamat', data.alamat);
      formData.append('bintang', data.bintang.toString());
      formData.append('harga', data.harga.toString());
      
      // Append fasilitas
      data.fasilitas.forEach((facility, index) => {
        formData.append(`fasilitas[${index}]`, facility.name);
      });
  
      // Handle single image
      if (data.newImage) {
        formData.append('gambar', data.newImage);
      } else if (data.existingImage) {
        formData.append('existingImage', data.existingImage);
      }
  
      await axios.put(`/hotel/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast({
        title: "Sukses",
        description: "Hotel berhasil diupdate!"
      });
  
      navigate("/admin/hotel");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengupdate data hotel.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/hotel">Hotel</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Hotel</h1>
        <Link to="/admin/hotel">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Hotel</CardTitle>
          <CardDescription>Edit informasi hotel yang sudah ada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Hotel</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alamat hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bintang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bintang</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={5} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="harga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga per malam"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Fasilitas</FormLabel>
                <div className="space-y-4">
                  {facilityFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`fasilitas.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Masukkan nama fasilitas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFacility(index)}
                        disabled={index === 0}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => appendFacility({ name: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Fasilitas
                </Button>
              </div>

              <div>
                <FormLabel>Gambar Hotel</FormLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {form.watch('newImage') ? (
                      <div className="relative">
                        <img
                          // Tambahkan pengecekan untuk newImage
                          src={form.watch('newImage') ? URL.createObjectURL(form.watch('newImage') as Blob) : ''}
                          alt="New"
                          className="h-24 w-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2"
                          onClick={() => form.setValue('newImage', undefined)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : form.watch('existingImage') ? (
                      <div className="relative">
                        <img
                          src={`http://localhost:5000/${form.watch('existingImage')}`}
                          alt="Current"
                          className="h-24 w-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Format yang didukung: JPG, JPEG, PNG, WEBP. Ukuran maksimum: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/hotel")}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Hotel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditHotel;