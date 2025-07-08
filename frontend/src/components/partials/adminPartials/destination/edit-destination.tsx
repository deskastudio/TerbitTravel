//pages/destination/edit/[id].tsx - IMPROVED VERSION
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, X, ArrowLeft, Upload } from 'lucide-react';
import { useDestination } from "@/hooks/use-destination";
import { getImageUrl } from "@/utils/image-helper";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const destinationSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama destinasi harus memiliki minimal 2 karakter.",
  }),
  lokasi: z.string().min(5, {
    message: "Lokasi harus memiliki minimal 5 karakter.",
  }),
  deskripsi: z.string().min(10, {
    message: "Deskripsi harus memiliki minimal 10 karakter.",
  }),
  category: z.string().min(1, "Pilih kategori untuk destinasi ini."),
  foto: z
    .array(z.any())
    .min(1, "Minimal satu gambar diperlukan.")
    .max(5, "Maksimal 5 gambar dapat diunggah."),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

interface ImageFile extends File {
  preview?: string;
}

export default function EditDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<(ImageFile | string)[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const {
    categories,
    useDestinationDetail,
    updateDestination,
    isUpdating
  } = useDestination();

  const { destination, isLoading: isLoadingDestination } = useDestinationDetail(id || '');

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      nama: "",
      lokasi: "",
      deskripsi: "",
      category: "",
      foto: [],
    },
  });

  // Initialize form and images when destination data is loaded
  useEffect(() => {
    if (destination) {
      form.reset({
        nama: destination.nama,
        lokasi: destination.lokasi,
        deskripsi: destination.deskripsi,
        category: destination.category._id,
        foto: destination.foto,
      });
      setImageFiles(destination.foto);
    }
  }, [destination, form]);

  const handleImageUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length + imageFiles.length > 5) {
      form.setError("foto", {
        message: "Maksimal 5 gambar dapat diunggah.",
      });
      return;
    }

    const invalidFiles = fileArray.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      form.setError("foto", {
        message: "Beberapa file tidak memenuhi persyaratan ukuran atau format yang diizinkan.",
      });
      return;
    }

    const newFiles = fileArray.map(file => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview });
    });

    setImageFiles(prev => [...prev, ...newFiles]);
    
    const currentFiles = form.getValues("foto") || [];
    form.setValue("foto", [...currentFiles, ...fileArray], { shouldValidate: true });
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

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      
      if (typeof removed !== 'string' && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return newFiles;
    });

    const currentFiles = form.getValues("foto");
    if (currentFiles) {
      form.setValue("foto", 
        currentFiles.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = async (data: DestinationFormValues) => {
    try {
      if (id) {
        const newImages = data.foto.filter(file => file instanceof File) as File[];
        
        await updateDestination(id, {
          nama: data.nama,
          lokasi: data.lokasi,
          deskripsi: data.deskripsi,
          category: data.category
        }, newImages.length > 0 ? newImages : undefined);

        imageFiles.forEach(file => {
          if (typeof file !== 'string' && file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        
        navigate("/admin/destination");
      }
    } catch (error) {
      console.error("Error updating destination:", error);
    }
  };

  useEffect(() => {
    return () => {
      imageFiles.forEach(file => {
        if (typeof file !== 'string' && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [imageFiles]);

  if (isLoadingDestination) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data destinasi...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-lg font-semibold mb-2">Destinasi Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Destinasi yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/destination")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/destination")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Destinasi
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Edit Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Destinasi</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi destinasi "{destination.nama}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/destination/${destination._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/destination")}
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
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Nama Destinasi</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Masukkan nama destinasi" 
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
                      name="lokasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Lokasi</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Masukkan lokasi destinasi" 
                              {...field} 
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Pilih kategori destinasi" />
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

                  <FormField
                    control={form.control}
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan deskripsi destinasi"
                            className="resize-none h-32 focus:ring-2 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Jelaskan keunikan dan daya tarik destinasi ini
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Current Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Kelola Foto Destinasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="foto"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-6">
                            {/* Current Images */}
                            {imageFiles.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 text-gray-700">Foto Saat Ini ({imageFiles.length}/5)</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                  {imageFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                                        <img
                                          src={typeof file === 'string' ? getImageUrl(file) : file.preview}
                                          alt={`Foto ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/200x200?text=Error';
                                          }}
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                      <Badge 
                                        variant={typeof file === 'string' ? "secondary" : "default"}
                                        className="absolute bottom-1 left-1 text-xs"
                                      >
                                        {typeof file === 'string' ? 'Lama' : 'Baru'}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Upload New Images */}
                            {imageFiles.length < 5 && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 text-gray-700">Tambah Foto Baru</h4>
                                <div
                                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    dragActive 
                                      ? 'border-blue-500 bg-blue-50' 
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                  onDragEnter={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDragOver={handleDrag}
                                  onDrop={handleDrop}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="mb-2"
                                      >
                                        Pilih Gambar Baru
                                      </Button>
                                      <p className="text-sm text-gray-600">
                                        atau seret dan lepas gambar di sini
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Dapat menambah {5 - imageFiles.length} foto lagi
                                      </p>
                                    </div>
                                  </div>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                    multiple
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Foto lama akan tetap tersimpan. Tambahkan foto baru jika diperlukan (maks. 2MB per gambar)
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
                      onClick={() => navigate("/admin/destination")}
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
                <p className="text-sm text-gray-600">Foto lama akan tetap tersimpan kecuali dihapus manual</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Tambahkan foto baru untuk melengkapi galeri</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Maksimal total 5 foto per destinasi</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Foto:</span>
                  <Badge variant="outline">{imageFiles.length}/5</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Foto Lama:</span>
                  <Badge variant="secondary">
                    {imageFiles.filter(file => typeof file === 'string').length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Foto Baru:</span>
                  <Badge variant="default">
                    {imageFiles.filter(file => typeof file !== 'string').length}
                  </Badge>
                </div>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || destination.nama}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</label>
                  <p className="text-sm">
                    {form.watch("lokasi") || destination.lokasi}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</label>
                  <p className="text-sm">
                    {categories.find(cat => cat._id === form.watch("category"))?.title || destination.category.title}
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

// Import yang hilang
import { Eye } from 'lucide-react';