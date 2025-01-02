"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft, PlusCircle } from 'lucide-react'
import { Link } from "react-router-dom" // Import dari react-router-dom

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddDestinationCategoryModal } from "./add-destination-category-modal"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const destinationSchema = z.object({
  name: z.string().min(2, {
    message: "Nama destinasi harus memiliki minimal 2 karakter.",
  }),
  location: z.string().min(5, {
    message: "Lokasi harus memiliki minimal 5 karakter.",
  }),
  description: z.string().min(10, {
    message: "Deskripsi harus memiliki minimal 10 karakter.",
  }),
  images: z
    .array(
      z.object({
        file: z
          .any()
          .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `Ukuran maksimum gambar adalah 2MB.`)
          .refine(
            (file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
          ),
      })
    )
    .min(1, "Minimal satu gambar diperlukan.")
    .max(5, "Maksimal 5 gambar dapat diunggah."),
  category: z.string().min(1, "Pilih kategori untuk destinasi ini."),
})

type DestinationFormValues = z.infer<typeof destinationSchema>

interface Category {
  id: string;
  name: string;
}

export default function DestinationInputPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      images: [],
      category: "",
    },
  })

  function onSubmit(data: DestinationFormValues) {
    toast({
      title: "Destinasi berhasil ditambahkan!",
      description: "Detail destinasi telah berhasil disimpan.",
    })
    console.log(data)
    // Di sini Anda biasanya akan mengirim data ke backend
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

  const handleAddCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory])
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin-all-destination">Destinasi</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Destinasi Baru</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
          <Link to="/admin-all-destination">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Detail Destinasi</CardTitle>
          <CardDescription>Masukkan detail destinasi baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Destinasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama destinasi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama ini akan ditampilkan untuk destinasi Anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan lokasi destinasi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan lokasi spesifik dari destinasi ini.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih kategori untuk destinasi ini.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi destinasi"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Berikan deskripsi lengkap tentang destinasi ini.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Destinasi</FormLabel>
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
                                className="absolute -right-2 -top-2"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {imageFiles.length < 5 && (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-24 w-24"
                              onClick={() => document.getElementById("image-upload")?.click()}
                            >
                              <Plus className="h-6 w-6" />
                            </Button>
                          )}
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
                    <FormDescription>
                      Unggah hingga 5 gambar. Ukuran masing-masing gambar tidak boleh lebih dari 2MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tambahkan Destinasi
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AddDestinationCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  )
}

