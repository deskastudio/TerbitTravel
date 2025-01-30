import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, ArrowLeft } from "lucide-react";
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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
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
  })
});

type ArmadaFormValues = z.infer<typeof armadaSchema>;

export default function EditArmada() {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const { useArmadaDetail, updateArmada, isUpdating } = useArmada();
  const { armada, isLoading } = useArmadaDetail(id || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const form = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      nama: "",
      kapasitas: 1,
      harga: 0,
      merek: "",
    },
  });

  useEffect(() => {
    if (armada) {
      form.reset({
        nama: armada.nama,
        kapasitas: armada.kapasitas,
        harga: armada.harga,
        merek: armada.merek,
      });
      if (armada.gambar && armada.gambar.length > 0) {
        setCurrentImage(armada.gambar[0]);
      }
    }
  }, [armada, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageFile(file);
        setCurrentImage(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: file.size > MAX_FILE_SIZE 
            ? "Ukuran gambar terlalu besar (maksimum 2MB)" 
            : "Format file tidak didukung"
        });
      }
    }
  };

  const handleRemoveImage = () => {
    toast({
      variant: "destructive",
      title: "Peringatan",
      description: "Gambar tidak boleh dikosongkan"
    });
  };

  const onSubmit = async (data: ArmadaFormValues) => {
    try {
      if (!id) return;

      // Check if there's no image (both new and current)
      if (!imageFile && !currentImage) {
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
      }, imageFile ? [imageFile] : []);

      toast({
        title: "Sukses",
        description: "Data armada berhasil diperbarui"
      });

      navigate("/admin/armada");
    } catch (error) {
      console.error("Error updating armada:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data armada"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/armada">Armada</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Armada</h1>
        <Link to="/admin/armada">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Detail Armada</CardTitle>
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
                      <FormLabel>Nama Armada</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama armada" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama ini akan ditampilkan untuk armada Anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kapasitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Penumpang</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan kapasitas penumpang"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan jumlah maksimal penumpang.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="harga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga armada"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan harga sewa armada (contoh: Rp 500.000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="merek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merek</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan merek armada" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan merek kendaraan armada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Gambar Armada</FormLabel>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {imageFile ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="h-24 w-24 rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : currentImage ? (
                      <div className="relative">
                        <img
                          src={`http://localhost:5000/${currentImage}`}
                          alt="Current"
                          className="h-24 w-24 rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-24 w-24"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {!imageFile && !currentImage && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Unggah Gambar
                    </Button>
                  )}
                  <FormDescription>
                    Unggah gambar armada. Ukuran maksimum 2MB.
                    Format yang didukung: JPG, PNG, WebP.
                  </FormDescription>
                </div>
              </div>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}