import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { useConsumption } from "@/hooks/use-consumption"
import { IConsumptionInput } from "@/types/consumption.types"
import { useToast } from "@/hooks/use-toast"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { zodResolver } from "@hookform/resolvers/zod"

const consumptionSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama harus memiliki minimal 2 karakter.",
  }),
  harga: z
    .number({
      required_error: "Harga harus diisi",
      invalid_type_error: "Harga harus berupa angka",
    })
    .positive({
      message: "Harga harus berupa angka positif.",
    }),
  lauk: z
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

const AddConsumption = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createConsumption, isCreating } = useConsumption()

  const form = useForm<ConsumptionFormValues>({
    resolver: zodResolver(consumptionSchema),
    defaultValues: {
      nama: "",
      harga: 0,
      lauk: [{ item: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lauk",
  })

  const onSubmit = async (data: ConsumptionFormValues) => {
    try {
      const consumptionData: IConsumptionInput = {
        nama: data.nama,
        harga: data.harga,
        lauk: data.lauk.map(item => item.item),
      }

      await createConsumption(consumptionData)
      
      toast({
        title: "Sukses",
        description: "Konsumsi berhasil ditambahkan!"
      })

      navigate('/admin/consumption')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data konsumsi."
      })
      console.error('Error creating consumption:', error)
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/consumption")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Konsumsi
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Tambah Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Konsumsi Baru</h1>
          <p className="text-gray-600 mt-1">Lengkapi informasi paket konsumsi yang akan ditambahkan</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/consumption")}
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
                    Informasi Konsumsi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nama Konsumsi</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="contoh: Paket Makan Siang Premium" 
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
                    name="harga"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Harga per Porsi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                            <Input
                              type="number"
                              placeholder="50000"
                              className="pl-10 focus:ring-2 focus:ring-blue-500"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Harga dalam Rupiah per porsi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Menu Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Daftar Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`lauk.${index}.item`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="contoh: Nasi Gudeg, Ayam Goreng, Tempe Orek"
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
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ item: "" })}
                      className="w-full flex items-center gap-2 mt-3"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Menu
                    </Button>
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
                      onClick={() => navigate("/admin/consumption")}
                      disabled={isCreating}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isCreating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Simpan Konsumsi
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
              <CardTitle className="text-lg">Tips Konsumsi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Gunakan nama yang menarik dan mudah diingat</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Sertakan menu yang beragam dan lengkap</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan harga kompetitif dengan kualitas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Detail menu yang jelas meningkatkan minat</p>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Konsumsi</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</label>
                  <p className="text-sm">
                    {form.watch("harga") 
                      ? formatPrice(form.watch("harga"))
                      : "Belum diisi"
                    }
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</label>
                  <p className="text-sm">
                    {form.watch("lauk").filter(f => f.item).length} menu
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga per Menu</label>
                  <p className="text-sm">
                    {form.watch("harga") && form.watch("lauk").filter(f => f.item).length > 0
                      ? formatPrice(form.watch("harga") / form.watch("lauk").filter(f => f.item).length)
                      : "Belum diisi"
                    }
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

export default AddConsumption;