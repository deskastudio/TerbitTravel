"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft, PlusCircle } from 'lucide-react'
import { Link } from "react-router-dom"

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
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddArmadaCategoryModal } from "./add-armada-category-modal"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const armadaSchema = z.object({
  name: z.string().min(2, {
    message: "Nama armada harus memiliki minimal 2 karakter.",
  }),
  capacity: z
    .preprocess((val) => Number(val), z.number().int().min(1, {
      message: "Kapasitas penumpang harus minimal 1.",
    })),
  price: z
    .preprocess((val) => Number(val), z.number().positive({
      message: "Harga harus berupa angka positif.",
    })),
  brand: z.string().min(2, {
    message: "Merek harus memiliki minimal 2 karakter.",
  }),
  category: z.string().min(1, "Pilih kategori untuk armada ini."),
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
})

type ArmadaFormValues = z.infer<typeof armadaSchema>

interface Category {
  id: string;
  name: string;
}

export default function ArmadaInputPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      price: 0,
      brand: "",
      category: "",
      images: [],
    },
  })

  function onSubmit(data: ArmadaFormValues) {
    toast({
      title: "Armada berhasil ditambahkan!",
      description: "Detail armada telah berhasil disimpan.",
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

  const handleAddCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory])
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin-all-armada">Armada</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Armada Baru</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
          <Link to="/admin-all-armada">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Detail Armada</CardTitle>
          <CardDescription>Masukkan detail armada baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Armada</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama armada" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama ini akan ditampilkan untuk armada Anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Penumpang</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan kapasitas penumpang"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan jumlah maksimal penumpang.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Masukkan harga armada" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan harga sewa armada (contoh: Rp 500,000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merek</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan merek armada" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan merek kendaraan armada.
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
                        Pilih kategori untuk armada ini.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Armada</FormLabel>
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
                Tambahkan Armada
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AddArmadaCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  )
}

