import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, ArrowLeft } from "lucide-react";
import { useConsumption } from "@/hooks/use-consumption";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

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
});

type ConsumptionFormValues = z.infer<typeof consumptionSchema>;

export default function EditConsumption() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useConsumptionDetail, updateConsumption, isUpdating } = useConsumption();
  const { consumption, isLoading } = useConsumptionDetail(id || "");

  const form = useForm<ConsumptionFormValues>({
    resolver: zodResolver(consumptionSchema),
    defaultValues: {
      nama: "",
      harga: 0,
      lauk: [{ item: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lauk",
  });

  useEffect(() => {
    if (consumption) {
      form.reset({
        nama: consumption.nama,
        harga: consumption.harga,
        lauk: consumption.lauk.map(item => ({ item })),
      });
    }
  }, [consumption, form]);

  const onSubmit = async (data: ConsumptionFormValues) => {
    if (!id) return;

    try {
      await updateConsumption(id, {
        nama: data.nama,
        harga: data.harga,
        lauk: data.lauk.map(item => item.item),
      });

      toast({
        title: "Sukses",
        description: "Data konsumsi berhasil diperbarui",
      });

      navigate('/admin/consumption');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data konsumsi"
      });
      console.error('Error updating consumption:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!consumption) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Konsumsi tidak ditemukan</p>
      </div>
    );
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
            <BreadcrumbPage>Edit Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Konsumsi</h1>
        <Link to="/admin/consumption">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Detail Konsumsi</CardTitle>
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

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}