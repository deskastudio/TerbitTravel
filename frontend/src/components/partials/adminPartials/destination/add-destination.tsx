//pages/destination/add.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, ArrowLeft, PlusCircle } from 'lucide-react';
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previewUrls.length > 5) {
      destinationForm.setError("foto", {
        message: "Maksimal 5 gambar dapat diunggah.",
      });
      return;
    }

    // Validate file sizes and types
    const invalidFiles = files.filter(
      file => file.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      destinationForm.setError("foto", {
        message: "Beberapa file tidak memenuhi persyaratan ukuran atau format yang diizinkan.",
      });
      return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    const currentFoto = destinationForm.getValues("foto");
    destinationForm.setValue("foto", [...currentFoto, ...files], { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); // Cleanup URL object
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
      // Cleanup preview URLs before navigating
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
  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
            <BreadcrumbPage>Tambah Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tambah Destinasi Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...destinationForm}>
            <form onSubmit={destinationForm.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={destinationForm.control}
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
                  control={destinationForm.control}
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

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormField
                    control={destinationForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex-1 mr-4">
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="mt-8"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Kategori
                  </Button>
                </div>
              </div>

              <FormField
                control={destinationForm.control}
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
                control={destinationForm.control}
                name="foto"
                render={() => (
                  <FormItem>
                    <FormLabel>Foto Destinasi</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/200x200?text=Error+Loading+Image';
                                }}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {previewUrls.length < 5 && (
                            <div
                              className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg border-gray-300 hover:border-primary cursor-pointer"
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
                  disabled={isCreating}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tambah Destinasi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Masukkan nama untuk kategori destinasi baru.
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
                      <Input placeholder="Masukkan nama kategori" {...field} />
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
                  Tambah Kategori
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}