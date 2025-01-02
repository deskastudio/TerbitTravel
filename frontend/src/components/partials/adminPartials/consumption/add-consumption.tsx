"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { AddConsumptionCategoryModal } from "./add-cosumption-category-modal"

const consumptionSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus memiliki minimal 2 karakter.",
  }),
  price: z
    .preprocess((val) => Number(val), z.number().positive({
      message: "Harga harus berupa angka positif.",
    })),
  category: z.string().min(1, "Pilih kategori untuk konsumsi ini."),
  menu: z
    .array(
      z.object({
        item: z.string().min(2, {
          message: "Nama menu harus memiliki minimal 2 karakter.",
        }),
      })
    )
    .min(1, "Minimal satu item menu harus ditambahkan."),
})

type ConsumptionFormValues = z.infer<typeof consumptionSchema>

interface Category {
  id: string;
  name: string;
}

export default function ConsumptionInputPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)

  const form = useForm<ConsumptionFormValues>({
    resolver: zodResolver(consumptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      menu: [{ item: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "menu",
  })

  function onSubmit(data: ConsumptionFormValues) {
    toast({
      title: "Konsumsi berhasil ditambahkan!",
      description: "Detail konsumsi telah berhasil disimpan.",
    })
    console.log(data)
    // Kirim data ke backend di sini
  }

  const handleAddCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory])
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin-all-consumption">Konsumsi</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Konsumsi Baru</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
          <Link to="/admin-all-consumption">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Detail Konsumsi</CardTitle>
          <CardDescription>Masukkan detail konsumsi baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Konsumsi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama konsumsi" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nama ini akan ditampilkan untuk konsumsi Anda.
                    </FormDescription>
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
                        placeholder="Masukkan harga konsumsi"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan harga total konsumsi (contoh: Rp 500.000).
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
                      Pilih kategori untuk konsumsi ini.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Menu</FormLabel>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <Input
                        placeholder="Masukkan nama menu"
                        {...form.register(`menu.${index}.item` as const)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
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
                  onClick={() => append({ item: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambahkan Menu
                </Button>
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tambahkan Konsumsi
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AddConsumptionCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  )
}
