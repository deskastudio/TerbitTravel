'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  X, 
  Eye, 
  Plus, 
  Loader2,
  FileText,
  ImageIcon
} from 'lucide-react';
import { useArticle, useCategory } from '@/hooks/use-article';
import { IArticleInput, ICategory } from '@/types/article.types';
import AddCategory from './AddCategory';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Schema validasi untuk artikel
const articleSchema = z.object({
  judul: z.string().min(1, "Judul artikel wajib diisi"),
  penulis: z.string().min(1, "Nama penulis wajib diisi"),
  isi: z.string().min(100, "Konten artikel minimal 100 karakter"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
});

type FormData = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateArticle, isUpdating, useArticleDetail } = useArticle();
  const { categories, isLoadingCategories, refreshCategories } = useCategory();
  const { toast } = useToast();
  
  // Get article data using the hook
  const { article, isLoading, error, refetch } = useArticleDetail(id || '');
  
  // State untuk gambar
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      judul: '',
      penulis: '',
      isi: '',
      kategori: '',
    },
  });

  // Load article data into form when article is fetched
  useEffect(() => {
    if (article) {
      // Get category ID - handle both string and object cases
      let categoryId = '';
      if (article.category) {
        categoryId = typeof article.category === 'string' ? article.category : article.category._id;
      } else if (article.kategori) {
        if (Array.isArray(article.kategori) && article.kategori.length > 0) {
          const firstCategory = article.kategori[0];
          categoryId = typeof firstCategory === 'string' ? firstCategory : firstCategory._id;
        } else if (typeof article.kategori === 'string') {
          categoryId = article.kategori;
        } else if (typeof article.kategori === 'object' && '_id' in article.kategori) {
          categoryId = (article.kategori as ICategory)._id;
        }
      }

      form.reset({
        judul: article.judul,
        penulis: typeof article.penulis === 'string' ? article.penulis : article.penulis?.nama || '',
        isi: article.isi,
        kategori: categoryId,
      });

      // Set existing additional images
      if (article.gambarTambahan) {
        setExistingAdditionalImages(article.gambarTambahan);
      }
    }
  }, [article, form]);

  // Load categories on mount
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Handle main image upload
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Ukuran gambar maksimal 5MB",
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
      
      setNewMainImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMainImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewMainImage = () => {
    setNewMainImage(null);
    setMainImagePreview('');
  };

  // Handle additional images
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const validFiles = filesArray.filter(file => {
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
      
      setAdditionalImages(prev => [...prev, ...validFiles]);
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAdditionalImagePreviews(prev => [
              ...prev, 
              event.target!.result as string
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingAdditionalImage = (index: number) => {
    setExistingAdditionalImages(existingAdditionalImages.filter((_, i) => i !== index));
  };

  // Handle category added
  const handleCategoryAdded = () => {
    refreshCategories();
  };

  // Submit form
  const onSubmit = async (data: FormData) => {
    try {
      if (!article) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Data artikel tidak tersedia",
        });
        return;
      }

      // Prepare update data
      const updateData: IArticleInput = {
        judul: data.judul,
        penulis: data.penulis,
        isi: data.isi,
        kategori: data.kategori,
        gambarUtama: newMainImage || undefined,
        gambarTambahan: additionalImages.length > 0 ? additionalImages : undefined,
      };

      const success = await updateArticle(id!, updateData);
      
      if (success) {
        toast({
          title: "Sukses!",
          description: "Artikel berhasil diperbarui.",
        });
        navigate('/admin/article');
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui artikel: ${(error as Error).message || "Terjadi kesalahan"}`,
      });
    }
  };

  // Get category name for display
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(c => c._id === categoryId);
    return category?.title || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Artikel yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/article")}>
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
              onClick={() => navigate("/admin/article")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Artikel
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Edit Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Artikel</h1>
          <p className="text-gray-600 mt-1">Perbarui konten artikel "{article.judul}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/article/${article._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/article")}
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
                    Informasi Artikel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="judul"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Judul Artikel</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan judul artikel" 
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
                          <FormLabel className="text-sm font-medium">Nama Penulis</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Masukkan nama penulis" 
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
                            <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                            <AddCategory 
                              variant="inline" 
                              onSuccess={handleCategoryAdded} 
                            />
                          </div>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
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
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="text-center p-2 text-muted-foreground">
                                  Tidak ada kategori. Klik "Tambah Kategori Baru".
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
                        <FormLabel className="text-sm font-medium">Isi Artikel</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tulis konten artikel yang menarik dan informatif..." 
                            rows={12} 
                            {...field} 
                            className="focus:ring-2 focus:ring-green-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Minimal 100 karakter. Saat ini: {field.value?.length || 0} karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Image Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Kelola Gambar Artikel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Image */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-700">Gambar Utama</h4>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      {/* Show existing main image */}
                      {!newMainImage && (article.gambarUtama || article.gambar) && (
                        <div className="relative inline-block">
                          <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={article.gambarUtama || article.gambar}
                              alt="Gambar saat ini"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/300x200?text=Error';
                              }}
                            />
                          </div>
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            Lama
                          </Badge>
                        </div>
                      )}

                      {/* Show new main image */}
                      {newMainImage && (
                        <div className="relative inline-block">
                          <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-green-500">
                            <img
                              src={mainImagePreview}
                              alt="Gambar baru"
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
                            onClick={removeNewMainImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('main-image-upload')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {newMainImage ? 'Ganti Gambar' : 'Upload Gambar Baru'}
                      </Button>
                      <input
                        id="main-image-upload"
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG, WEBP (maks. 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-700">Gambar Tambahan</h4>
                    
                    {/* Existing Additional Images */}
                    {existingAdditionalImages.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Gambar Lama</h5>
                        <div className="flex flex-wrap gap-4">
                          {existingAdditionalImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={image}
                                  alt={`Existing ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/100x100?text=Error';
                                  }}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingAdditionalImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Badge 
                                variant="secondary" 
                                className="absolute bottom-1 left-1 text-xs"
                              >
                                Lama
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Additional Images */}
                    <div className="flex flex-wrap gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('additional-images')?.click()}
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
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      />
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
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
                            variant="default" 
                            className="absolute bottom-1 left-1 text-xs"
                          >
                            Baru
                          </Badge>
                        </div>
                      ))}
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
                      onClick={() => navigate("/admin/article")}
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
                <p className="text-sm text-gray-600">Gambar lama akan tetap tersimpan jika tidak diganti</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Konten dapat diubah sesuai kebutuhan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Upload gambar baru untuk mengganti yang lama</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Pratinjau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</label>
                  <p className="text-sm font-medium">
                    {form.watch("judul") || article.judul}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</label>
                  <p className="text-sm">
                    {form.watch("penulis") || (typeof article.penulis === 'string' ? article.penulis : article.penulis?.nama)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</label>
                  <p className="text-sm">
                    {form.watch("kategori") 
                      ? getCategoryName(form.watch("kategori"))
                      : "Belum dipilih"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Konten</label>
                  <p className="text-sm">
                    {form.watch("isi")?.length || article.isi?.length || 0} karakter
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Gambar</label>
                  <div className="flex flex-col gap-1">
                    <Badge variant={newMainImage ? "default" : (article.gambarUtama || article.gambar) ? "secondary" : "destructive"}>
                      Utama: {newMainImage ? "Baru" : (article.gambarUtama || article.gambar) ? "Lama" : "Tidak ada"}
                    </Badge>
                    <Badge variant="outline">
                      Tambahan: {existingAdditionalImages.length + additionalImages.length}
                    </Badge>
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