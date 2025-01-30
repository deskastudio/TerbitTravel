//pages/destination/edit/[id].tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react';
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
        foto: destination.foto, // Set existing images
      });
      setImageFiles(destination.foto); // Set existing image URLs
    }
  }, [destination, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check total images (existing + new)
    if (files.length + imageFiles.length > 5) {
      form.setError("foto", {
        message: "Maksimal 5 gambar dapat diunggah.",
      });
      return;
    }

    // Validate file sizes and types
    const invalidFiles = files.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      form.setError("foto", {
        message: "Beberapa file tidak memenuhi persyaratan ukuran atau format yang diizinkan.",
      });
      return;
    }

    // Create preview URLs for new files
    const newFiles = files.map(file => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview });
    });

    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Update form value with all files (existing + new)
    const currentFiles = form.getValues("foto") || [];
    form.setValue("foto", [...currentFiles, ...files], { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    // Remove from imageFiles state
    setImageFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      
      // If it's a new file with preview URL, revoke it
      if (typeof removed !== 'string' && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return newFiles;
    });

    // Update form value
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
        // Filter out new files from form data
        const newImages = data.foto.filter(file => file instanceof File) as File[];
        
        await updateDestination(id, {
          nama: data.nama,
          lokasi: data.lokasi,
          deskripsi: data.deskripsi,
          category: data.category
        }, newImages.length > 0 ? newImages : undefined);

        // Cleanup preview URLs
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

  // Cleanup preview URLs when component unmounts
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/destination")}
              className="p-0"
            >
              Destinasi
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Destinasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Destinasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama destinasi" {...field} />
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
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan lokasi destinasi" {...field} />
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
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi destinasi"
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foto"
                render={() => (
                  <FormItem>
                    <FormLabel>Foto Destinasi</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                          {imageFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={typeof file === 'string' ? getImageUrl(file) : file.preview}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/200x200?text=Error';
                                }}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {imageFiles.length < 5 && (
                            <div
                              className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg border-gray-300 hover:border-primary cursor-pointer transition-colors"
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              <Plus className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={handleImageUpload}
                          className="hidden"
                          multiple
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Unggah minimal 1 dan maksimal 5 gambar (maks. 2MB per gambar)
                      Format yang didukung: JPG, JPEG, PNG, WEBP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isUpdating}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}