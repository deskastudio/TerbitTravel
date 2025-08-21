// components/partials/adminPartials/banner/Form.tsx - Fixed version
'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  Loader2, 
  Upload, 
  X, 
  ArrowLeft, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBanner } from '@/hooks/use-banner';
import { BannerFormData } from '@/types/banner.types';

// Enhanced form schema with better validation
const formSchema = z.object({
  judul: z.string()
    .min(1, 'Judul wajib diisi')
    .max(100, 'Judul maksimal 100 karakter')
    .refine(val => val.trim().length > 0, 'Judul tidak boleh hanya spasi'),
  
  deskripsi: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
  
  link: z.string()
    .optional()
    .refine(val => {
      if (!val || val.trim() === '') return true;
      return /^https?:\/\/.+/.test(val);
    }, 'Link harus berupa URL yang valid (dimulai dengan http:// atau https://)')
    .or(z.literal('')),
  
  isActive: z.boolean(),
  
  urutan: z.number()
    .int('Urutan harus berupa angka bulat')
    .min(0, 'Urutan minimal 0')
    .max(99, 'Urutan maksimal 99'),
  
  gambar: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BannerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const {
    addBanner,
    updateBanner,
    getBannerById,
    getImageUrl,
    isLoading,
    isAdding,
    isUpdating,
    uploadProgress,
    hasPermission,
    banners
  } = useBanner();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: '',
      deskripsi: '',
      link: '',
      isActive: true,
      urutan: 0,
    },
  });

  // Check permissions
  const canCreate = hasPermission('create');
  const canUpdate = hasPermission('update');

  // Redirect if no permission
  useEffect(() => {
    if (!isEdit && !canCreate) {
      navigate('/admin/banner');
      return;
    }
    if (isEdit && !canUpdate) {
      navigate('/admin/banner');
      return;
    }
  }, [isEdit, canCreate, canUpdate, navigate]);

  // Load banner data for edit
  useEffect(() => {
    const loadBannerForEdit = async () => {
      if (isEdit && id) {
        try {
          const banner = await getBannerById(id);
          if (banner) {
            form.reset({
              judul: banner.judul,
              deskripsi: banner.deskripsi || '',
              link: banner.link || '',
              isActive: banner.isActive,
              urutan: banner.urutan,
            });
            
            if (banner.gambar) {
              setPreviewUrl(getImageUrl(banner.gambar));
            }
          } else {
            throw new Error('Banner tidak ditemukan');
          }
        } catch (error) {
          console.error('Error loading banner for edit:', error);
          navigate('/admin/banner');
        }
      }
    };

    loadBannerForEdit();
  }, [isEdit, id, getBannerById, getImageUrl, form, navigate]);

  // Auto-set urutan for new banner
  useEffect(() => {
    if (!isEdit && banners.length > 0) {
      const maxUrutan = Math.max(...banners.map(b => b.urutan));
      form.setValue('urutan', maxUrutan + 1);
    }
  }, [isEdit, banners, form]);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP';
    }

    // Check file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Ukuran file maksimal 2MB';
    }

    // Check file name length
    if (file.name.length > 100) {
      return 'Nama file terlalu panjang (maksimal 100 karakter)';
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    setSelectedFile(file);
    setFileError('');
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Clear form errors
    form.clearErrors('gambar');
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFileError('');
    
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    
    // Reset file input
    const fileInput = document.getElementById('gambar') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Validate image for new banner
      if (!isEdit && !selectedFile) {
        setFileError('Gambar wajib diunggah untuk banner baru');
        return;
      }

      const formData: BannerFormData = {
        judul: data.judul.trim(),
        deskripsi: data.deskripsi?.trim() || undefined,
        link: data.link?.trim() || undefined,
        isActive: data.isActive,
        urutan: data.urutan,
        gambar: selectedFile || undefined,
      };

      let success = false;
      if (isEdit && id) {
        success = await updateBanner(id, formData);
      } else {
        success = await addBanner(formData);
      }

      if (success) {
        navigate('/admin/banner');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Show loading while checking permissions or loading data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSubmitting = isAdding || isUpdating;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/banner')}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Banner' : 'Tambah Banner Baru'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Perbarui informasi banner' : 'Buat banner baru untuk website'}
          </p>
        </div>
      </div>

      {/* Permission check alert */}
      {((isEdit && !canUpdate) || (!isEdit && !canCreate)) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Anda tidak memiliki akses untuk {isEdit ? 'mengubah' : 'menambah'} banner.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="gambar">
                  Gambar Banner {!isEdit && <span className="text-destructive">*</span>}
                </Label>
                
                {/* Upload Progress */}
                {uploadProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading... {uploadProgress.percentage}%
                    </div>
                    <Progress value={uploadProgress.percentage} className="h-2" />
                  </div>
                )}
                
                {/* File Error */}
                {fileError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col gap-4">
                  {previewUrl ? (
                    <div className="relative">
                      <div className="w-full h-48 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            setPreviewUrl('');
                            setFileError('Gagal memuat preview gambar');
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeFile}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {selectedFile && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className={`w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed transition-colors ${
                        dragOver ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          {dragOver ? 'Lepas file di sini' : 'Belum ada gambar dipilih'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Drag & drop atau klik tombol di bawah
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      id="gambar"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('gambar')?.click()}
                      disabled={isSubmitting}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {previewUrl ? 'Ganti Gambar' : 'Pilih Gambar'}
                    </Button>
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={removeFile}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Format: JPG, JPEG, PNG, WebP</p>
                    <p>• Maksimal ukuran: 2MB</p>
                    <p>• Disarankan rasio: 16:9 untuk hasil terbaik</p>
                    <p>• Dimensi minimal: 800x450 piksel</p>
                  </div>
                </div>
              </div>

              {/* Judul */}
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Judul Banner <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan judul banner" 
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Judul yang akan ditampilkan pada banner (3-100 karakter)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deskripsi */}
              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan deskripsi banner (opsional)"
                        className="resize-none"
                        rows={3}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Deskripsi singkat tentang banner (maksimal 500 karakter)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Tujuan</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com (opsional)"
                        type="url"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL yang akan dibuka ketika banner diklik (opsional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Urutan */}
              <FormField
                control={form.control}
                name="urutan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urutan Tampil</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        max="99"
                        placeholder="0"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Urutan banner ditampilkan (0-99, semakin kecil akan tampil lebih awal)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Aktif */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Banner</FormLabel>
                      <FormDescription>
                        Banner aktif akan ditampilkan di website
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/banner')}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      {isEdit ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Perbarui Banner
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Simpan Banner
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}