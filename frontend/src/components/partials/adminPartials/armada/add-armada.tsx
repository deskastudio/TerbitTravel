import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { useArmada } from "@/hooks/use-armada"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const armadaSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama armada harus memiliki minimal 2 karakter.",
  }),
  kapasitas: z
    .preprocess((val) => Number(val), z.number().int().min(1, {
      message: "Kapasitas penumpang harus minimal 1.",
    })),
  harga: z
    .preprocess((val) => Number(val), z.number().positive({
      message: "Harga harus berupa angka positif.",
    })),
  merek: z.string().min(2, {
    message: "Merek harus memiliki minimal 2 karakter.",
  }),
  image: z
    .object({
      file: z
        .any()
        .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `Ukuran maksimum gambar adalah 2MB.`)
        .refine(
          (file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
        ),
    })
    .optional()
    .refine((data) => data !== undefined, "Gambar armada wajib diunggah.")
})

type ArmadaFormValues = z.infer<typeof armadaSchema>

export default function ArmadaInputPage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { createArmada, isCreating } = useArmada();

  const form = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      nama: "",
      kapasitas: 1,
      harga: 0,
      merek: "",
    },
  })

  const onSubmit = async (data: ArmadaFormValues) => {
    try {
      if (!imageFile) {
        return;
      }
      
      // Prepare armada data
      const armadaData = {
        nama: data.nama,
        kapasitas: data.kapasitas,
        harga: data.harga,
        merek: data.merek
      };

      await createArmada(armadaData, [imageFile]);
      navigate('/admin/armada');
    } catch (error) {
      console.error('Error creating armada:', error);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageFile(file)
        form.setValue("image", { file })
      } else {
        form.setError("image", {
          message: file.size > MAX_FILE_SIZE 
            ? "Ukuran gambar terlalu besar (maksimum 2MB)" 
            : "Format file tidak didukung"
        })
      }
    }
  }

  const removeImage = () => {
    setImageFile(null)
    form.setValue("image", { file: undefined })
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/armada">Armada</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Armada Baru</h1>
        <Link to="/admin/armada">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
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
                  name="nama"
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
                  name="kapasitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Penumpang</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan kapasitas penumpang"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="harga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga armada"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan harga sewa armada (contoh: Rp 500.000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="merek"
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
              </div>

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Armada</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          {imageFile ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="h-24 w-24 rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
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
                        />
                        {!imageFile && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            Unggah Gambar
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Unggah gambar armada. Ukuran maksimum 2MB.
                      Format yang didukung: JPG, PNG, WebP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  'Tambahkan Armada'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}