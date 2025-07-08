import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft, Upload, Star, Eye } from 'lucide-react'

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
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/utils/image-helper"
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

interface Hotel {
  _id: string;
  nama: string;
  alamat: string;
  bintang: number;
  harga: number;
  fasilitas: string[];
  gambar: string[];
}

const EditHotel = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hotelData, setHotelData] = useState<Hotel | null>(null)

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
        setHotelData(hotel)

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
      
      data.fasilitas.forEach((facility, index) => {
        formData.append(`fasilitas[${index}]`, facility.name);
      });
  
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data hotel...</p>
        </div>
      </div>
    )
  }

  if (!hotelData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-semibold mb-2">Hotel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Hotel yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/hotel")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/hotel")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Hotel
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Edit Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi hotel "{hotelData.nama}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/hotel/${hotelData._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/hotel")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-600 rounded"></div>
                    Informasi Hotel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nama Hotel</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan nama hotel" 
                            {...field} 
                            className="focus:ring-2 focus:ring-blue-500"
                          />
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
                        <FormLabel className="text-sm font-medium">Alamat</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Masukkan alamat hotel" 
                            {...field} 
                            className="resize-none h-24 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bintang"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Rating Bintang</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                min={1} 
                                max={5} 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
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
                          <FormLabel className="text-sm font-medium">Harga per Malam</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                              <Input
                                type="number"
                                placeholder="Masukkan harga per malam"
                                className="pl-10 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Facilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Fasilitas Hotel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facilityFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`fasilitas.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    placeholder="Masukkan nama fasilitas" 
                                    {...field} 
                                    className="focus:ring-2 focus:ring-green-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFacility(index)}
                          disabled={index === 0}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendFacility({ name: "" })}
                      className="w-full flex items-center gap-2 mt-3"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Fasilitas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Image Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Kelola Foto Hotel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current/New Image Display */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-700">Foto Saat Ini</h4>
                      
                      {form.watch('newImage') ? (
                        <div className="relative inline-block">
                          <div className="aspect-square w-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-green-500">
                            <img
                              src={form.watch('newImage') ? URL.createObjectURL(form.watch('newImage') as Blob) : ''}
                              alt="Foto Baru"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge variant="default" className="absolute -top-2 -right-2">
                            Baru
                          </Badge>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -bottom-2 h-6 w-6"
                            onClick={() => form.setValue('newImage', undefined)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : form.watch('existingImage') ? (
                        <div className="relative inline-block">
                          <div className="aspect-square w-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={getImageUrl(form.watch('existingImage')!)}
                              alt="Foto Saat Ini"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/200x200?text=Error';
                              }}
                            />
                          </div>
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            Lama
                          </Badge>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -bottom-2 h-6 w-6"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-square w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Tidak ada foto</span>
                        </div>
                      )}
                    </div>

                    {/* Upload New Image */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-700">Upload Foto Baru</h4>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Pilih Gambar
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="text-sm text-gray-500">
                          JPG, PNG, WEBP (maks. 2MB)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/hotel")}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Simpan Perubahan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Edit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Foto lama akan tetap tersimpan jika tidak diganti</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Fasilitas dapat ditambah atau dikurangi sesuai kebutuhan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload foto baru untuk mengganti foto lama</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pratinjau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Hotel</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || hotelData.nama}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < (form.watch("bintang") || hotelData.bintang) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</label>
                  <p className="text-sm">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR' 
                    }).format(form.watch("harga") || hotelData.harga)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fasilitas</label>
                  <p className="text-sm">
                    {form.watch("fasilitas").filter(f => f.name).length} fasilitas
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Foto</label>
                  <Badge variant={form.watch("newImage") ? "default" : "secondary"}>
                    {form.watch("newImage") ? "Foto Baru" : "Foto Lama"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditHotel;