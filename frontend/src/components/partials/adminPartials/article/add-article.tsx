'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react';
import { IArticleInput } from '@/types/article.types';
import { useArticle, useCategory } from '@/hooks/use-article';

// Schema validasi untuk artikel
const articleSchema = z.object({
  judul: z.string().min(1, "Judul artikel wajib diisi"),
  penulis: z.string().min(1, "Nama penulis wajib diisi"),
  isi: z.string().min(1, "Konten artikel wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  hashtags: z.array(z.string()).optional().default([]),
});

type FormData = z.infer<typeof articleSchema>;

export default function ArticleAddPage() {
  const navigate = useNavigate();
  const { createArticle, isCreating } = useArticle();
  const { categories, isLoadingCategories } = useCategory();
  
  // State untuk gambar
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      judul: '',
      penulis: '',
      isi: '',
      kategori: '',
      hashtags: [],
    },
  });

  // Proses submit form
  const onSubmit = async (data: FormData) => {
    const articleData: IArticleInput = {
      ...data,
      gambarUtama: mainImage,
      gambarTambahan: additionalImages,
    };

    const success = await createArticle(articleData);
    if (success) {
      navigate('/admin/article');
    }
  };

  // Handler untuk upload gambar utama
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      
      // Membuat preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMainImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk upload gambar tambahan
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAdditionalImages(prev => [...prev, ...filesArray]);
      
      // Membuat preview untuk semua gambar
      filesArray.forEach(file => {
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

  // Handler untuk mengkonversi string hashtags menjadi array
  const handleHashtagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagsString = e.target.value;
    const hashtagsArray = hashtagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    form.setValue('hashtags', hashtagsArray);
  };

  // Hapus gambar tambahan
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index));
  };

  // Komponen untuk preview gambar
  const ImagePreview = ({ 
    src, 
    alt, 
    onRemove 
  }: { 
    src: string; 
    alt: string;
    onRemove?: () => void;
  }) => {
    return (
      <div className="relative group">
        <div className="w-24 h-24 border rounded-md overflow-hidden">
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1
                      opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // Mengenerate string hashtags dari array untuk ditampilkan di input
  const hashtagsValue = form.watch("hashtags")?.join(", ") || "";

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin/article')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Tambah Artikel Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Artikel</CardTitle>
          <CardDescription>
            Isi semua informasi artikel di bawah ini. Pastikan gambar utama disertakan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Artikel</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul artikel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penulis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penulis</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama penulis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori artikel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Memuat kategori...</span>
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.nama}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Hashtags</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Pisahkan hashtags dengan koma (contoh: travel, pantai, liburan)" 
                    value={hashtagsValue}
                    onChange={handleHashtagsChange}
                  />
                </FormControl>
                <FormDescription>
                  Hashtags akan mempermudah pencarian artikel
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="isi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Artikel</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tulis isi artikel di sini" 
                        rows={10} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Gambar Utama</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('mainImage')?.click()}
                        className="h-24 w-24 flex flex-col items-center justify-center"
                      >
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Pilih Gambar</span>
                      </Button>
                      <input
                        type="file"
                        id="mainImage"
                        onChange={handleMainImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      {mainImagePreview && (
                        <ImagePreview 
                          src={mainImagePreview} 
                          alt="Gambar utama" 
                          onRemove={() => {
                            setMainImage(null);
                            setMainImagePreview('');
                          }}
                        />
                      )}
                    </div>
                    {!mainImage && (
                      <p className="text-sm text-muted-foreground">
                        Gambar utama wajib diunggah
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gambar Tambahan</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('additionalImages')?.click()}
                        className="h-24 w-24 flex flex-col items-center justify-center"
                      >
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Tambahkan</span>
                      </Button>
                      <input
                        type="file"
                        id="additionalImages"
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                        multiple
                        accept="image/*"
                      />
                      {additionalImagePreviews.map((preview, index) => (
                        <ImagePreview 
                          key={index} 
                          src={preview} 
                          alt={`Gambar tambahan ${index + 1}`} 
                          onRemove={() => removeAdditionalImage(index)}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bisa menambahkan beberapa gambar (opsional)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/article')}
                  disabled={isCreating}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating || !mainImage}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : 'Simpan Artikel'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}