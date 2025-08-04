"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  User,
  ImageIcon,
  X,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";
import { IArticleInput } from "@/types/article.types";
import { useArticle, useCategory } from "@/hooks/use-article";
import AddCategory from "./AddCategory";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Schema validasi untuk artikel
const articleSchema = z.object({
  judul: z.string().min(1, "Judul artikel wajib diisi"),
  penulis: z.string().min(1, "Nama penulis wajib diisi"),
  isi: z.string().min(100, "Konten artikel minimal 100 karakter"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  gambarUtama: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran gambar maksimal 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Hanya format JPG, PNG, WEBP yang didukung"
    ),
});

type FormData = z.infer<typeof articleSchema>;

export default function ArticleAddPage() {
  const navigate = useNavigate();
  const { createArticle, isCreating } = useArticle();
  const { categories, isLoadingCategories, refreshCategories } = useCategory();
  const { toast } = useToast();

  // State untuk gambar
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const [dragActive, setDragActive] = useState(false);

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      judul: "",
      penulis: "",
      isi: "",
      kategori: "",
    },
  });

  // Handle main image upload
  const handleMainImageUpload = (files: FileList | File[]) => {
    const file = Array.from(files)[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      form.setError("gambarUtama", {
        message: "Ukuran gambar maksimal 5MB",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("gambarUtama", {
        message: "Format file tidak didukung",
      });
      return;
    }

    form.setValue("gambarUtama", file);
    form.clearErrors("gambarUtama");

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMainImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleMainImageUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleMainImageUpload(e.dataTransfer.files);
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

  // Handle additional images
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const validFiles = filesArray.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: `File ${file.name} melebihi ukuran maksimal 5MB`,
          });
          return false;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: `File ${file.name} bukan gambar`,
          });
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      setAdditionalImages((prev) => [...prev, ...validFiles]);

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAdditionalImagePreviews((prev) => [
              ...prev,
              event.target!.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMainImage = () => {
    form.setValue("gambarUtama", undefined as any);
    setMainImagePreview("");
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setAdditionalImagePreviews(
      additionalImagePreviews.filter((_, i) => i !== index)
    );
  };

  // Handle category added
  const handleCategoryAdded = () => {
    refreshCategories();
  };

  // Load categories on mount
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Submit form
  const onSubmit = async (data: FormData) => {
    try {
      if (!data.gambarUtama) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Gambar utama wajib diunggah",
        });
        return;
      }

      const articleData: IArticleInput = {
        ...data,
        gambarUtama: data.gambarUtama,
        gambarTambahan:
          additionalImages.length > 0 ? additionalImages : undefined,
      };

      const success = await createArticle(articleData);

      if (success) {
        toast({
          title: "Sukses!",
          description: "Artikel berhasil ditambahkan.",
        });
        navigate("/admin/article");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan artikel: ${
          error.message || "Terjadi kesalahan"
        }`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate("/admin/article")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Artikel
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">
              Tambah Artikel
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tambah Artikel Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Buat artikel blog dan konten menarik untuk website
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/article")}
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
                    Informasi Artikel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="judul"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Judul Artikel
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="contoh: Tips Traveling ke Bali yang Menarik"
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
                      name="penulis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Nama Penulis
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="contoh: John Doe"
                                {...field}
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="kategori"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-sm font-medium">
                              Kategori
                            </FormLabel>
                            <AddCategory
                              variant="inline"
                              onSuccess={handleCategoryAdded}
                            />
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoadingCategories}
                          >
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Pilih kategori artikel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCategories ? (
                                <div className="flex items-center justify-center p-2">
                                  <span>Memuat kategori...</span>
                                </div>
                              ) : categories && categories.length > 0 ? (
                                categories.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="text-center p-2 text-muted-foreground">
                                  Tidak ada kategori. Klik "Tambah Kategori
                                  Baru".
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Konten Artikel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Isi Artikel
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tulis konten artikel yang menarik dan informatif..."
                            rows={12}
                            {...field}
                            className="focus:ring-2 focus:ring-green-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Minimal 100 karakter. Saat ini:{" "}
                          {field.value?.length || 0} karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Gambar Artikel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Image */}
                  <div>
                    <FormField
                      control={form.control}
                      name="gambarUtama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Gambar Utama <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {/* Upload Area */}
                              <div
                                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                  dragActive
                                    ? "border-purple-500 bg-purple-50"
                                    : !field.value
                                    ? "border-gray-300 hover:border-gray-400"
                                    : "border-gray-200 bg-gray-50"
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
                                          onClick={() =>
                                            document
                                              .getElementById(
                                                "main-image-upload"
                                              )
                                              ?.click()
                                          }
                                          className="mb-2"
                                        >
                                          Pilih Gambar Utama
                                        </Button>
                                        <p className="text-sm text-gray-600">
                                          atau seret dan lepas gambar di sini
                                        </p>
                                      </div>
                                    </div>
                                    <input
                                      id="main-image-upload"
                                      type="file"
                                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                      onChange={handleFileInputChange}
                                      className="hidden"
                                    />
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <ImageIcon className="h-8 w-8" />
                                    <p>Gambar utama telah dipilih</p>
                                  </div>
                                )}
                              </div>

                              {/* Preview Main Image */}
                              {mainImagePreview && (
                                <div className="relative group inline-block">
                                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                      src={mainImagePreview}
                                      alt="Preview gambar utama"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={removeMainImage}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <Badge
                                    variant="secondary"
                                    className="absolute bottom-1 left-1 text-xs"
                                  >
                                    Utama
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Gambar utama wajib (maks. 5MB, format: JPG, PNG,
                            WEBP)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Gambar Tambahan (Opsional)
                    </FormLabel>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("additional-images")?.click()
                        }
                        className="h-24 w-24 flex flex-col items-center justify-center border-dashed"
                      >
                        <Plus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Tambah</span>
                      </Button>
                      <input
                        type="file"
                        id="additional-images"
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                        multiple
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      />
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Badge
                            variant="outline"
                            className="absolute bottom-1 left-1 text-xs"
                          >
                            {index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Gambar pendukung untuk artikel (maks. 5MB per gambar)
                    </p>
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
                      onClick={() => navigate("/admin/article")}
                      disabled={isCreating}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating || !form.watch("gambarUtama")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isCreating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Simpan Artikel
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
              <CardTitle className="text-lg">Tips Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">
                  Gunakan judul yang menarik dan SEO-friendly
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">
                  Tulis konten yang informatif dan engaging
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">
                  Pilih gambar berkualitas tinggi yang relevan
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">
                  Kategorikan artikel dengan tepat
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </label>
                  <p className="text-sm font-medium">
                    {form.watch("judul") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penulis
                  </label>
                  <p className="text-sm">
                    {form.watch("penulis") || "Belum diisi"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </label>
                  <p className="text-sm">
                    {form.watch("kategori")
                      ? categories?.find(
                          (c) => c._id === form.watch("kategori")
                        )?.title
                      : "Belum dipilih"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konten
                  </label>
                  <p className="text-sm">
                    {form.watch("isi")?.length || 0} karakter
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gambar
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        form.watch("gambarUtama") ? "default" : "secondary"
                      }
                    >
                      Utama: {form.watch("gambarUtama") ? "✓" : "✗"}
                    </Badge>
                    <Badge variant="outline">+{additionalImages.length}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
