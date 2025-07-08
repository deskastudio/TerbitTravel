import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, X, ArrowLeft, Upload,  Users, ImageIcon } from 'lucide-react'
import { useNavigate } from "react-router-dom"
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
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

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
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran maksimum gambar adalah 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
    ),
})

type ArmadaFormValues = z.infer<typeof armadaSchema>

export default function AddArmadaPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { createArmada, isCreating } = useArmada()
  const [dragActive, setDragActive] = useState(false)

  const form = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      nama: "",
      kapasitas: 1,
      harga: 0,
      merek: "",
    },
  })

  const handleImageUpload = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      form.setError("image", {
        message: "Ukuran gambar terlalu besar (maksimum 2MB)",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("image", {
        message: "Format file tidak didukung"
      });
      return;
    }

    form.setValue("image", file);
    form.clearErrors("image");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined as any);
  }

  async function onSubmit(data: ArmadaFormValues) {
    try {
      if (!data.image) {
        form.setError("image", { message: "Gambar armada wajib diunggah." });
        return;
      }
      
      const armadaData = {
        nama: data.nama,
        kapasitas: data.kapasitas,
        harga: data.harga,
        merek: data.merek
      };

      await createArmada(armadaData, [data.image]);

      toast({
        title: "Sukses",
        description: "Armada berhasil ditambahkan!"
      })

      navigate("/admin/armada")
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data armada.",
        variant: "destructive",
      })
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
              onClick={() => navigate("/admin/armada")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Armada
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Tambah Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Armada Baru</h1>
          <p className="text-gray-600 mt-1">Lengkapi informasi kendaraan armada yang akan ditambahkan</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/armada")}
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
                            placeholder="contoh: Bus Pariwisata Luxury" 
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
                            placeholder="contoh: Mercedes-Benz, Toyota, Isuzu" 
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
                                placeholder="20" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Jumlah maksimal penumpang
                          </FormDescription>
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
                                placeholder="500000"
                                className="pl-10 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Harga dalam Rupiah per hari
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Foto Armada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Upload Area */}
                            <div
                              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : !field.value 
                                    ? 'border-gray-300 hover:border-gray-400' 
                                    : 'border-gray-200 bg-gray-50'
                              }`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              {!field.value ? (
                                <>
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="mb-2"
                                      >
                                        Pilih Gambar
                                      </Button>
                                      <p className="text-sm text-gray-600">
                                        atau seret dan lepas gambar di sini
                                      </p>
                                    </div>
                                  </div>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                  />
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <ImageIcon className="h-8 w-8" />
                                  <p>Gambar telah dipilih</p>
                                </div>
                              )}
                            </div>

                            {/* Preview Image */}
                            {field.value && (
                              <div className="relative group inline-block">
                                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={URL.createObjectURL(field.value)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={removeImage}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Badge 
                                  variant="secondary" 
                                  className="absolute bottom-1 left-1 text-xs"
                                >
                                  Preview
                                </Badge>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Unggah 1 gambar berkualitas tinggi (maks. 2MB, format: JPG, PNG, WEBP)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      Simpan Armada
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
              <CardTitle className="text-lg">Tips Armada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Gunakan nama yang mencerminkan jenis dan kelas armada</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan kapasitas sesuai dengan kondisi nyata kendaraan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload foto yang menampilkan kondisi armada terbaik</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Harga kompetitif akan meningkatkan daya tarik</p>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Armada</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Merek</label>
                  <p className="text-sm">
                    {form.watch("merek") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</label>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-600" />
                    <span className="text-sm">{form.watch("kapasitas") || 0} orang</span>
                  </div>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</label>
                  <p className="text-sm">
                    {form.watch("image") ? "1 gambar" : "Belum ada foto"}
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