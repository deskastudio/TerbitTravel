"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Minus, CalendarPlus, Loader2, ArrowLeft, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTourPackage } from "@/hooks/use-tour-package"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { ITourPackageInput } from "@/types/tour-package.types"
import { tourPackageSchema } from "@/schemas/tour-package.schema"

// Add this new schema for the category form
const categorySchema = z.object({
  title: z.string().min(2, "Nama kategori harus memiliki minimal 2 karakter."),
})

type CategoryFormValues = z.infer<typeof categorySchema>

const AddTourPackage = () => {
  const navigate = useNavigate()
  const {
    destinations,
    hotels,
    armada,
    consumptions,
    createPackage,
    isLoading,
    isLoadingDestinations,
    isLoadingHotels,
    isLoadingArmada,
    isLoadingConsumptions,
    categories,
    createCategory,
  } = useTourPackage()

  const isLoadingReferenceData = isLoadingDestinations || isLoadingHotels || isLoadingArmada || isLoadingConsumptions

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  const form = useForm<ITourPackageInput>({
    resolver: zodResolver(tourPackageSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      include: [""],
      exclude: [""],
      jadwal: [
        {
          tanggalAwal: "",
          tanggalAkhir: "",
          status: "tersedia",
        },
      ],
      status: "available",
      durasi: "",
      harga: 0,
      destination: "",
      hotel: "",
      armada: "",
      consume: "",
      kategori: "",
    },
  })

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
    },
  })

  const {
    fields: includeFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({
    control: form.control,
    name: "include",
  })

  const {
    fields: excludeFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({
    control: form.control,
    name: "exclude",
  })

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control: form.control,
    name: "jadwal",
  })

  const onSubmit = async (data: ITourPackageInput) => {
    try {
      await createPackage(data)
      navigate("/admin/paket-wisata")
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const onSubmitCategory = async (data: CategoryFormValues) => {
    try {
      setIsSubmittingCategory(true)
      await createCategory(data.title)
      categoryForm.reset()
      setIsCategoryModalOpen(false)
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  if (isLoadingReferenceData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading reference data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button variant="link" onClick={() => navigate("/admin/paket-wisata")} className="p-0">
              Paket Wisata
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Paket Wisata</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tambah Paket Wisata Baru</CardTitle>
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
                      <FormLabel>Nama Paket</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama paket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 3 hari 2 malam" {...field} />
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
                          placeholder="Masukkan harga"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormField
                      control={form.control}
                      name="kategori"
                      render={({ field }) => (
                        <FormItem className="flex-1 mr-4">
                          <FormLabel>Kategori</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="mt-8"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah Kategori
                    </Button>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan deskripsi paket" className="resize-none h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Yang Termasuk</FormLabel>
                {includeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`include.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Tambahkan item yang termasuk" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeInclude(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendInclude("")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                <FormLabel>Yang Tidak Termasuk</FormLabel>
                {excludeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`exclude.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Tambahkan item yang tidak termasuk" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeExclude(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendExclude("")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                <FormLabel>Jadwal</FormLabel>
                {scheduleFields.map((field, index) => (
                  <div key={field.id} className="grid md:grid-cols-2 gap-4 border p-4 rounded-lg relative">
                    <FormField
                      control={form.control}
                      name={`jadwal.${index}.tanggalAwal`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Mulai</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`jadwal.${index}.tanggalAkhir`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Selesai</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => removeSchedule(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSchedule({
                      tanggalAwal: "",
                      tanggalAkhir: "",
                      status: "tersedia",
                    })
                  }
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Tambah Jadwal
                </Button>
              </div>

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinasi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih destinasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.map((destination) => (
                          <SelectItem key={destination._id} value={destination._id}>
                            {destination.nama} - {destination.lokasi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hotel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel._id} value={hotel._id}>
                            {hotel.nama} - {hotel.bintang} Bintang
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="armada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportasi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih transportasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {armada.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.nama} - Kapasitas: {item.kapasitas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konsumsi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih konsumsi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consumptions.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Tersedia</SelectItem>
                        <SelectItem value="booked">Dipesan</SelectItem>
                        <SelectItem value="in_progress">Dalam Perjalanan</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        <SelectItem value="pending_review">Menunggu Review</SelectItem>
                        <SelectItem value="archived">Diarsipkan</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tambah Paket Wisata
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>Masukkan nama untuk kategori paket wisata baru.</DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama kategori" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isSubmittingCategory}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmittingCategory}>
                  {isSubmittingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tambah Kategori
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddTourPackage;

