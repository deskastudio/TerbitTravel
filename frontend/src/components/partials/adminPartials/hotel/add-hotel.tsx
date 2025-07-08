import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft, Upload, Star, ImageIcon } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { useHotel } from "@/hooks/use-hotel"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
  const [dragActive, setDragActive] = useState(false)

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

  const handleImageUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length + form.getValues("images").length > 5) {
      form.setError("images", {
        message: "Maksimal 5 gambar dapat diunggah.",
      });
      return;
    }

    const invalidFiles = fileArray.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      form.setError("images", {
        message: "Beberapa file tidak memenuhi persyaratan ukuran atau format yang diizinkan.",
      });
      return;
    }

    form.setValue("images", [...form.getValues("images"), ...fileArray]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images")
    form.setValue("images", currentImages.filter((_, i) => i !== index))
  }

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
        title: "Sukses",
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
            <BreadcrumbPage className="text-gray-600">Tambah Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Hotel Baru</h1>
          <p className="text-gray-600 mt-1">Lengkapi informasi hotel yang akan ditambahkan</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/hotel")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
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
                            placeholder="contoh: Hotel Santika Premiere" 
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
                            placeholder="Masukkan alamat lengkap hotel" 
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
                                placeholder="1-5" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Rating 1-5 bintang
                          </FormDescription>
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
                                placeholder="500000"
                                className="pl-10 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Harga dalam Rupiah per malam
                          </FormDescription>
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
                                    placeholder="contoh: WiFi Gratis, Kolam Renang, Spa"
                                    className="focus:ring-2 focus:ring-green-500"
                                    {...field}
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
                          disabled={facilityFields.length === 1}
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

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Foto Hotel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Upload Area */}
                            <div
                              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : field.value.length < 5 
                                    ? 'border-gray-300 hover:border-gray-400' 
                                    : 'border-gray-200 bg-gray-50'
                              }`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              {field.value.length < 5 ? (
                                <>
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="mb-2"
                                      >
                                        Pilih Gambar
                                      </Button>
                                      <p className="text-sm text-gray-600">
                                        atau seret dan lepas gambar di sini
                                      </p>
                                    </div>
                                  </div>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                    multiple
                                  />
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <ImageIcon className="h-8 w-8" />
                                  <p>Maksimal 5 gambar telah tercapai</p>
                                </div>
                              )}
                            </div>

                            {/* Preview Images */}
                            {field.value.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {field.value.map((file, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => removeImage(index)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                    <Badge 
                                      variant="secondary" 
                                      className="absolute bottom-1 left-1 text-xs"
                                    >
                                      {index + 1}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Unggah 1-5 gambar berkualitas tinggi (maks. 2MB per gambar, format: JPG, PNG, WEBP)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      Simpan Hotel
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
              <CardTitle className="text-lg">Tips Hotel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Gunakan nama hotel yang mudah diingat dan mencerminkan brand</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Sertakan semua fasilitas utama yang tersedia</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload foto yang menampilkan keunggulan hotel</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan harga kompetitif sesuai dengan fasilitas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Hotel</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < (form.watch("bintang") || 0) 
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
                    {form.watch("harga") 
                      ? new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR' 
                        }).format(form.watch("harga"))
                      : "Belum diisi"
                    }
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fasilitas</label>
                  <p className="text-sm">
                    {form.watch("fasilitas").filter(f => f.name).length} fasilitas
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</label>
                  <p className="text-sm">
                    {form.watch("images").length} dari 5 gambar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}