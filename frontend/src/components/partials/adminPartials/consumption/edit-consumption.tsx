import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, ArrowLeft, Eye } from "lucide-react";
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
        description: "Konsumsi berhasil diperbarui!"
      });

      navigate('/admin/consumption');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui data konsumsi."
      });
      console.error('Error updating consumption:', error);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data konsumsi...</p>
        </div>
      </div>
    )
  }

  if (!consumption) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold mb-2">Konsumsi Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Konsumsi yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/consumption")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <BreadcrumbPage className="text-gray-600">Edit Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Konsumsi</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi konsumsi "{consumption.nama}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/consumption/${consumption._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/consumption")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
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
                            placeholder="Masukkan nama konsumsi" 
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
                              placeholder="Masukkan harga per porsi"
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
                                    placeholder="Masukkan nama menu" 
                                    {...field} 
                                    className="focus:ring-2 focus:ring-green-500"
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
                      disabled={isUpdating}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Simpan Perubahan
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
              <CardTitle className="text-lg">Informasi Edit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Data lama akan tersimpan jika tidak diubah</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Menu dapat ditambah atau dikurangi sesuai kebutuhan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan harga sesuai dengan menu yang disediakan</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pratinjau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Konsumsi</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || consumption.nama}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</label>
                  <p className="text-sm">
                    {formatPrice(form.watch("harga") || consumption.harga)}
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
                    {form.watch("lauk").filter(f => f.item).length > 0
                      ? formatPrice((form.watch("harga") || consumption.harga) / form.watch("lauk").filter(f => f.item).length)
                      : "Belum ada menu"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}