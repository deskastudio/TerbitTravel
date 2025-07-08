import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, X, ArrowLeft, Upload, Eye, Users } from "lucide-react";
import { useArmada } from "@/hooks/use-armada";
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
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const armadaSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama armada harus memiliki minimal 2 karakter.",
  }),
  kapasitas: z
    .number({
      required_error: "Kapasitas harus diisi",
      invalid_type_error: "Kapasitas harus berupa angka",
    })
    .int()
    .min(1, {
      message: "Kapasitas penumpang harus minimal 1.",
    }),
  harga: z
    .number({
      required_error: "Harga harus diisi",
      invalid_type_error: "Harga harus berupa angka",
    })
    .positive({
      message: "Harga harus berupa angka positif.",
    }),
  merek: z.string().min(2, {
    message: "Merek harus memiliki minimal 2 karakter.",
  }),
  newImage: z.instanceof(File).optional().nullable(),
  existingImage: z.string().optional().nullable(),
});

type ArmadaFormValues = z.infer<typeof armadaSchema>;

export default function EditArmada() {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const { useArmadaDetail, updateArmada, isUpdating } = useArmada();
  const { armada, isLoading } = useArmadaDetail(id || "");
  const [armadaData, setArmadaData] = useState(null);

  const form = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      nama: "",
      kapasitas: 1,
      harga: 0,
      merek: "",
      existingImage: undefined,
      newImage: undefined
    },
  });

  useEffect(() => {
    if (armada) {
      setArmadaData(armada);
      form.reset({
        nama: armada.nama,
        kapasitas: armada.kapasitas,
        harga: armada.harga,
        merek: armada.merek,
        existingImage: armada.gambar?.[0],
        newImage: undefined
      });
    }
  }, [armada, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Ukuran gambar terlalu besar (maksimum 2MB)",
          variant: "destructive",
        });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Format file tidak didukung",
          variant: "destructive",
        });
        return;
      }
      form.setValue('newImage', file);
      form.setValue('existingImage', undefined);
    }
  };

  const handleRemoveImage = () => {
    const hasNewImage = form.getValues('newImage');
    if (!hasNewImage) {
      toast({
        title: "Peringatan",
        description: "Armada harus memiliki minimal satu gambar!",
        variant: "destructive",
      });
      return;
    }
    form.setValue('existingImage', undefined);
  };

  const onSubmit = async (data: ArmadaFormValues) => {
    try {
      if (!id) return;

      // Check if there's no image (both new and current)
      if (!data.newImage && !data.existingImage) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gambar armada wajib diisi"
        });
        return;
      }
      
      await updateArmada(id, {
        nama: data.nama,
        kapasitas: data.kapasitas,
        harga: data.harga,
        merek: data.merek,
      }, data.newImage ? [data.newImage] : []);

      toast({
        title: "Sukses",
        description: "Armada berhasil diperbarui!"
      });

      navigate("/admin/armada");
    } catch (error) {
      console.error("Error updating armada:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui data armada."
      });
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
          <p className="text-gray-600">Memuat data armada...</p>
        </div>
      </div>
    )
  }

  if (!armadaData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🚐</div>
            <h3 className="text-lg font-semibold mb-2">Armada Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Armada yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/armada")}>
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
              onClick={() => navigate("/admin/armada")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Armada
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Edit Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Armada</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi armada "{armadaData.nama}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/armada/${armadaData._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/armada")}
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
                    Informasi Armada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nama Armada</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan nama armada" 
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
                    name="merek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Merek Kendaraan</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan merek kendaraan" 
                            {...field} 
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="kapasitas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Kapasitas Penumpang</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                min={1} 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
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
                          <FormLabel className="text-sm font-medium">Harga Sewa per Hari</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                              <Input
                                type="number"
                                placeholder="Masukkan harga sewa per hari"
                                className="pl-10 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Kelola Foto Armada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current/New Image Display */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-700">Foto Saat Ini</h4>
                      
                      {form.watch('newImage') ? (
                        <div className="relative inline-block">
                          <div className="aspect-square w-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-green-500">
                            <img
                              src={form.watch('newImage') ? URL.createObjectURL(form.watch('newImage') as Blob) : ''}
                              alt="Foto Baru"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge variant="default" className="absolute -top-2 -right-2">
                            Baru
                          </Badge>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -bottom-2 h-6 w-6"
                            onClick={() => form.setValue('newImage', undefined)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : form.watch('existingImage') ? (
                        <div className="relative inline-block">
                          <div className="aspect-square w-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={`http://localhost:5000/${form.watch('existingImage')}`}
                              alt="Foto Saat Ini"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/200x200?text=Error';
                              }}
                            />
                          </div>
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            Lama
                          </Badge>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -bottom-2 h-6 w-6"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-square w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Tidak ada foto</span>
                        </div>
                      )}
                    </div>

                    {/* Upload New Image */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-gray-700">Upload Foto Baru</h4>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Pilih Gambar
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="text-sm text-gray-500">
                          JPG, PNG, WEBP (maks. 2MB)
                        </span>
                      </div>
                    </div>
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
                      onClick={() => navigate("/admin/armada")}
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
                <p className="text-sm text-gray-600">Foto lama akan tetap tersimpan jika tidak diganti</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan kapasitas sesuai dengan kondisi kendaraan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload foto baru untuk mengganti foto lama</p>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Armada</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || armadaData.nama}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Merek</label>
                  <p className="text-sm">
                    {form.watch("merek") || armadaData.merek}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</label>
                  <p className="text-sm">
                    {form.watch("kapasitas") || armadaData.kapasitas} orang
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</label>
                  <p className="text-sm">
                    {formatPrice(form.watch("harga") || armadaData.harga)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Foto</label>
                  <Badge variant={form.watch("newImage") ? "default" : "secondary"}>
                    {form.watch("newImage") ? "Foto Baru" : "Foto Lama"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}