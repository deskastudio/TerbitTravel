import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
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
        description: "Konsumsi berhasil ditambahkan"
      })

      navigate('/admin/consumption')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan konsumsi"
      })
      console.error('Error creating consumption:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/consumption">Konsumsi</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Konsumsi Baru</h1>
        <Link to="/admin/consumption">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Konsumsi</CardTitle>
          <CardDescription>Masukkan detail konsumsi baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="nama"
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

                <Separator />

                <FormField
                  control={form.control}
                  name="harga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga konsumsi"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan harga total konsumsi (contoh: Rp 500.000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div>
                  <FormLabel>Menu</FormLabel>
                  <div className="space-y-4 mt-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-4">
                        <Input
                          placeholder="Masukkan nama menu"
                          {...form.register(`lauk.${index}.item` as const)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={index === 0 && fields.length === 1}
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
                    Tambah Menu
                  </Button>
                </div>
              </div>

              <Separator />

              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  'Tambah Konsumsi'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddConsumption;