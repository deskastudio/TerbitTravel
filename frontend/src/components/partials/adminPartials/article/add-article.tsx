"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, X, ArrowLeft } from "lucide-react"
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

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const articleSchema = z.object({
  name: z.string().min(2, {
    message: "Nama artikel harus memiliki minimal 2 karakter.",
  }),
  author: z.string().min(2, {
    message: "Nama penulis harus memiliki minimal 2 karakter.",
  }),
  description: z.string().min(10, {
    message: "Isi artikel harus memiliki minimal 10 karakter.",
  }),
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

type ArticleFormValues = z.infer<typeof articleSchema>

export default function ArticleInputPage() {
  const { toast } = useToast()
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      name: "",
      author: "",
      description: "",
      images: [],
    },
  })

  function onSubmit(data: ArticleFormValues) {
    toast({
      title: "Artikel berhasil ditambahkan!",
      description: "Detail artikel telah berhasil disimpan.",
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
            <Link to="/admin-all-articles">Artikel</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Artikel Baru</h1>
        <Link to="/admin-all-articles">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Detail Artikel</CardTitle>
          <CardDescription>Masukkan detail artikel baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Artikel</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul artikel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penulis</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama penulis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Artikel</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan isi artikel"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Artikel</FormLabel>
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
                Tambahkan Artikel
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
