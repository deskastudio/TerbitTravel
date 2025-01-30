import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { useHotel } from "@/hooks/use-hotel"

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
  images: z
    .array(z.instanceof(File))
    .min(1, "Minimal satu gambar diperlukan.")
    .max(5, "Maksimal 5 gambar dapat diunggah.")
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Ukuran maksimum gambar adalah 2MB."
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
    ),
})

type HotelFormValues = z.infer<typeof hotelSchema>

export default function AddHotelPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { createHotel } = useHotel()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      bintang: 1,
      harga: 0,
      fasilitas: [{ name: "" }],
      images: [],
    },
  })

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control: form.control,
    name: "fasilitas",
  })

  async function onSubmit(data: HotelFormValues) {
    try {
      setIsSubmitting(true)
      
      await createHotel({
        nama: data.nama,
        alamat: data.alamat,
        bintang: data.bintang,
        harga: data.harga,
        fasilitas: data.fasilitas.map(f => f.name),
        gambar: data.images
      })

      toast({
        title: "Success",
        description: "Hotel berhasil ditambahkan!"
      })

      navigate("/admin/hotel")
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data hotel.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    form.setValue("images", [...form.getValues("images"), ...files])
  }

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images")
    form.setValue("images", currentImages.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/hotel">Hotel</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hotel Baru</h1>
        <div className="flex items-center space-x-2">
          <Link to="/admin/hotel">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Hotel</CardTitle>
          <CardDescription>Masukkan detail hotel baru Anda.</CardDescription>
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
                          placeholder="1-5" 
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
                          placeholder="Masukkan harga per malam (Rp)"
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
                <FormLabel className="block mb-4">Fasilitas</FormLabel>
                <div className="space-y-4">
                  {facilityFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`fasilitas.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama fasilitas"
                                {...field}
                              />
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
                        disabled={facilityFields.length === 1}
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
                  Tambahkan Fasilitas
                </Button>
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar Hotel</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {field.value.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-24 rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            id="image-upload"
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                            multiple
                            max={5}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Maksimum 5 gambar. Format yang didukung: JPG, JPEG, PNG, WEBP. Ukuran maksimum: 2MB per gambar.
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/hotel')}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tambahkan Hotel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}