"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const hotelSchema = z.object({
  name: z.string().min(2, {
    message: "Nama hotel harus memiliki minimal 2 karakter.",
  }),
  address: z.string().min(5, {
    message: "Alamat harus memiliki minimal 5 karakter.",
  }),
  stars: z.string().regex(/^[1-5]$/, { message: "Bintang harus berupa angka antara 1 hingga 5." }),
  price: z
    .preprocess((val) => Number(val), z.number().positive({
      message: "Harga harus berupa angka positif.",
    })),
  facilities: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "Fasilitas harus memiliki minimal 2 karakter.",
        }),
      })
    )
    .min(1, "Minimal satu fasilitas diperlukan."),
  images: z
    .array(
      z.object({
        file: z
          .any()
          .refine((file) => file?.size <= MAX_FILE_SIZE, `Ukuran maksimum gambar adalah 2MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
          ),
      })
    )
    .min(1, "Minimal satu gambar diperlukan.")
    .max(5, "Maksimal 5 gambar dapat diunggah."),
})

type HotelFormValues = z.infer<typeof hotelSchema>

export default function HotelInputPage() {
  const { toast } = useToast()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedStars, setSelectedStars] = useState<string>("1") // Default value for stars

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      address: "",
      stars: "1",
      price: 0,
      facilities: [{ name: "" }],
      images: [],
    },
  })

  const { fields: facilityFields, append: appendFacility, remove: removeFacility } = useFieldArray({
    control: form.control,
    name: "facilities",
  })

  function onSubmit(data: HotelFormValues) {
    toast({
      title: "Hotel berhasil ditambahkan!",
      description: "Detail hotel telah berhasil disimpan.",
    })
    console.log(data)
    // Kirim data ke backend di sini
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map((file) => ({ file }))
    form.setValue("images", [...form.getValues("images"), ...newImages])
    setImageFiles((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    const newImages = form.getValues("images").filter((_, i) => i !== index)
    form.setValue("images", newImages)
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin-all-hotel">Hotel</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Hotel Baru</h1>
        <Link to="/admin-all-hotel">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Detail Hotel</CardTitle>
          <CardDescription>Masukkan detail hotel baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
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
                name="address"
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
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bintang</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {selectedStars} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {["1", "2", "3", "4", "5"].map((star) => (
                              <DropdownMenuItem
                                key={star}
                                onClick={() => {
                                  setSelectedStars(star)
                                  field.onChange(star) // Update form value
                                }}
                              >
                                {star}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga per malam (Rp)"
                          {...field}
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
                      <Input
                        placeholder="Masukkan nama fasilitas"
                        {...form.register(`facilities.${index}.name` as const)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFacility(index)}
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
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Hotel</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {imageFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Uploaded image ${index + 1}`}
                                className="h-24 w-24 rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={handleImageUpload}
                          className="hidden"
                          multiple
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          Unggah Gambar
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tambahkan Hotel
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
