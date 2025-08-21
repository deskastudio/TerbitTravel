//pages/destination/add.tsx - IMPROVED VERSION
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, X, ArrowLeft, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useDestination } from "@/hooks/use-destination";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    .array(z.instanceof(File))
    .min(1, "Minimal satu gambar diperlukan.")
    .max(5, "Maksimal 5 gambar dapat diunggah.")
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Ukuran maksimum gambar adalah 2MB."
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Hanya format .jpg, .jpeg, .png dan .webp yang didukung."
    ),
});

const categorySchema = z.object({
  title: z.string().min(2, "Nama kategori harus memiliki minimal 2 karakter."),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AddDestinationPage() {
  const navigate = useNavigate();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { createDestination, categories, isCreating, createCategory } = useDestination();

  const destinationForm = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      nama: "",
      lokasi: "",
      deskripsi: "",
      category: "",
      foto: [],
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
    },
  });

  const handleImageUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length + previewUrls.length > 5) {
      destinationForm.setError("foto", {
        message: "Maksimal 5 gambar dapat diunggah.",
      });
      return;
    }

    // Validate file sizes and types
    const invalidFiles = fileArray.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      destinationForm.setError("foto", {
        message: "Beberapa file tidak memenuhi persyaratan ukuran atau format yang diizinkan.",
      });
      return;
    }

    const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    const currentFoto = destinationForm.getValues("foto");
    destinationForm.setValue("foto", [...currentFoto, ...fileArray], { shouldValidate: true });
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
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    const currentFoto = destinationForm.getValues("foto");
    destinationForm.setValue(
      "foto",
      currentFoto.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: DestinationFormValues) => {
    try {
      await createDestination({
        nama: data.nama,
        lokasi: data.lokasi,
        deskripsi: data.deskripsi,
        category: data.category
      }, data.foto);
      
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      navigate("/admin/destination");
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  const onSubmitCategory = async (data: CategoryFormValues) => {
    try {
      setIsSubmittingCategory(true);
      await createCategory(data.title);
      categoryForm.reset();
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
            <BreadcrumbPage className="text-gray-600">Tambah Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Destinasi Baru</h1>
          <p className="text-gray-600 mt-1">Lengkapi informasi destinasi wisata yang akan ditambahkan</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/destination")}
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
          <Form {...destinationForm}>
            <form onSubmit={destinationForm.handleSubmit(onSubmit)} className="space-y-6">
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
                      control={destinationForm.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Nama Destinasi</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="contoh: Pantai Kuta" 
                              {...field} 
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={destinationForm.control}
                      name="lokasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Lokasi</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="contoh: Bali, Indonesia" 
                              {...field} 
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 items-end">
                    <FormField
                      control={destinationForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Kategori Baru
                    </Button>
                  </div>

                  <FormField
                    control={destinationForm.control}
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsikan destinasi ini secara detail..."
                            className="resize-none h-32 focus:ring-2 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Jelaskan keunikan dan daya tarik destinasi ini (minimal 10 karakter)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Foto Destinasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={destinationForm.control}
                    name="foto"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Upload Area */}
                            <div
                              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : previewUrls.length < 5 
                                    ? 'border-gray-300 hover:border-gray-400' 
                                    : 'border-gray-200 bg-gray-50'
                              }`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              {previewUrls.length < 5 ? (
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
                                    multiple
                                  />
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                  <ImageIcon className="h-8 w-8" />
                                  <p>Maksimal 5 gambar telah tercapai</p>
                                </div>
                              )}
                            </div>

                            {/* Preview Images */}
                            {previewUrls.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {previewUrls.map((url, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                      <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={() => {
                                          // No fallback image
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
                                      variant="secondary" 
                                      className="absolute bottom-1 left-1 text-xs"
                                    >
                                      {index + 1}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Unggah 1-5 gambar berkualitas tinggi (maks. 2MB per gambar, format: JPG, PNG, WEBP)
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
                      Simpan Destinasi
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
              <CardTitle className="text-lg">Tips Upload Gambar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Gunakan gambar dengan resolusi tinggi untuk hasil terbaik</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload gambar utama sebagai foto pertama</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Maksimal ukuran file 2MB per gambar</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Format yang didukung: JPG, PNG, WEBP</p>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</label>
                  <p className="text-sm font-medium">
                    {destinationForm.watch("nama") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</label>
                  <p className="text-sm">
                    {destinationForm.watch("lokasi") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</label>
                  <p className="text-sm">
                    {previewUrls.length} dari 5 gambar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Buat kategori baru untuk mengelompokkan destinasi wisata.
            </DialogDescription>
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
                      <Input placeholder="contoh: Pantai, Gunung, Budaya" {...field} />
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
                  Simpan Kategori
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}