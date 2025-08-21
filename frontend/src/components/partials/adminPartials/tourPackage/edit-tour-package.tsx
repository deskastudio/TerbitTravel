import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, CalendarPlus, Loader2, ArrowLeft, Eye, Clock, Package, PlusCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TourPackageService } from "@/services/tour-package.service";
import { useTourPackage } from "@/hooks/use-tour-package";
import { tourPackageSchema } from "@/schemas/tour-package.schema";
import type { ITourPackageInput, ITourPackage } from "@/types/tour-package.types";
import * as z from "zod";

// Category schema for the modal
const categorySchema = z.object({
  title: z.string().min(2, "Nama kategori harus memiliki minimal 2 karakter."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const EditTourPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageData, setPackageData] = useState<ITourPackage | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const { 
    destinations, 
    hotels, 
    armada, 
    consumptions, 
    categories,
    createCategory,
    isLoadingDestinations,
    isLoadingHotels,
    isLoadingArmada,
    isLoadingConsumptions 
  } = useTourPackage();

  const isLoadingReferenceData = isLoadingDestinations || isLoadingHotels || isLoadingArmada || isLoadingConsumptions;

  const form = useForm<ITourPackageInput>({
    resolver: zodResolver(tourPackageSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      include: [],
      exclude: [],
      jadwal: [],
      status: "available",
      durasi: "",
      harga: 0,
      destination: "",
      hotel: "",
      armada: "",
      consume: "",
      kategori: "",
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
    },
  });

  const { fields: includeFields, append: appendInclude, remove: removeInclude } =
    useFieldArray({
      control: form.control,
      name: "include",
    });

  const { fields: excludeFields, append: appendExclude, remove: removeExclude } =
    useFieldArray({
      control: form.control,
      name: "exclude",
    });

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } =
    useFieldArray({
      control: form.control,
      name: "jadwal",
    });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const packageData = await TourPackageService.getPackageById(id!);
        setPackageData(packageData);
        
        form.reset({
          nama: packageData.nama,
          deskripsi: packageData.deskripsi,
          include: packageData.include,
          exclude: packageData.exclude,
          jadwal: packageData.jadwal.map(schedule => ({
            tanggalAwal: new Date(schedule.tanggalAwal).toISOString().split('T')[0],
            tanggalAkhir: new Date(schedule.tanggalAkhir).toISOString().split('T')[0],
            status: schedule.status
          })),
          status: packageData.status,
          durasi: packageData.durasi,
          harga: packageData.harga,
          destination: packageData.destination._id,
          hotel: packageData.hotel._id,
          armada: packageData.armada._id,
          consume: packageData.consume._id,
          kategori: packageData.kategori?._id || "",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Gagal mengambil data paket wisata",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, form, toast]);

  const onSubmit = async (data: ITourPackageInput) => {
    try {
      setIsSubmitting(true);
      await TourPackageService.updatePackage(id!, data);
      toast({
        title: "Sukses",
        description: "Paket wisata berhasil diperbarui!"
      });
      navigate(`/admin/paket-wisata/${id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui paket wisata.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitCategory = async (data: CategoryFormValues) => {
    try {
      setIsSubmittingCategory(true);
      await createCategory(data.title);
      categoryForm.reset();
      setIsCategoryModalOpen(false);
      toast({
        title: "Sukses",
        description: "Kategori berhasil ditambahkan!"
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan kategori.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  if (isLoading || isLoadingReferenceData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data paket wisata...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-lg font-semibold mb-2">Paket Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Paket wisata yang ingin Anda edit tidak tersedia.</p>
            <Button onClick={() => navigate("/admin/paket-wisata")}>
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
              onClick={() => navigate("/admin/paket-wisata")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Paket Wisata
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Edit Paket</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Paket Wisata</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi paket wisata "{packageData.nama}"</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/paket-wisata/${packageData._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/paket-wisata")}
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
                    Informasi Paket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nama Paket</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan nama paket" 
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
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Deskripsi</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Masukkan deskripsi paket" 
                            {...field} 
                            className="resize-none h-24 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="durasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Durasi</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="contoh: 4 hari 3 malam" 
                                {...field} 
                                className="focus:ring-2 focus:ring-blue-500"
                              />
                              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Format: X hari Y malam
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
                          <FormLabel className="text-sm font-medium">Harga per Orang</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                              <Input
                                type="number"
                                placeholder="Masukkan harga"
                                className="pl-10 focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Harga dalam Rupiah per orang
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end gap-4">
                      <FormField
                        control={form.control}
                        name="kategori"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                                  <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category) => (
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
                        Tambah Kategori
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Destinations & Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded"></div>
                    Destinasi & Layanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Destinasi</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                                <SelectValue placeholder="Pilih destinasi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {destinations?.map((destination) => (
                                <SelectItem key={destination._id} value={destination._id}>
                                  {destination.nama} - {destination.lokasi}
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
                      name="hotel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Hotel</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                                <SelectValue placeholder="Pilih hotel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hotels?.map((hotel) => (
                                <SelectItem key={hotel._id} value={hotel._id}>
                                  {hotel.nama} - {hotel.bintang} Bintang
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
                      name="armada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Transportasi</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                                <SelectValue placeholder="Pilih transportasi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {armada?.map((item) => (
                                <SelectItem key={item._id} value={item._id}>
                                  {item.nama} - Kapasitas: {item.kapasitas}
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
                      name="consume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Konsumsi</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-green-500">
                                <SelectValue placeholder="Pilih konsumsi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {consumptions?.map((consumption) => (
                                <SelectItem key={consumption._id} value={consumption._id}>
                                  {consumption.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Include & Exclude */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    Yang Termasuk & Tidak Termasuk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Include Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium text-green-700">Yang Termasuk</FormLabel>
                    {includeFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`include.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  placeholder="Tambahkan item yang termasuk" 
                                  {...field} 
                                  className="focus:ring-2 focus:ring-green-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeInclude(index)}
                          disabled={includeFields.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendInclude("")}
                      className="w-full flex items-center gap-2 mt-3"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Item Yang Termasuk
                    </Button>
                  </div>

                  {/* Exclude Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium text-red-700">Yang Tidak Termasuk</FormLabel>
                    {excludeFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`exclude.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  placeholder="Tambahkan item yang tidak termasuk" 
                                  {...field} 
                                  className="focus:ring-2 focus:ring-red-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeExclude(index)}
                          disabled={excludeFields.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendExclude("")}
                      className="w-full flex items-center gap-2 mt-3"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Item Yang Tidak Termasuk
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-orange-600 rounded"></div>
                    Jadwal Keberangkatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduleFields.map((field, index) => (
                      <div key={field.id} className="grid md:grid-cols-3 gap-4 border p-4 rounded-lg relative bg-gray-50">
                        <FormField
                          control={form.control}
                          name={`jadwal.${index}.tanggalAwal`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Tanggal Mulai</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="focus:ring-2 focus:ring-orange-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`jadwal.${index}.tanggalAkhir`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Tanggal Selesai</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="focus:ring-2 focus:ring-orange-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`jadwal.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="focus:ring-2 focus:ring-orange-500">
                                    <SelectValue placeholder="Pilih status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="tersedia">Tersedia</SelectItem>
                                  <SelectItem value="tidak tersedia">Tidak Tersedia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {scheduleFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute -top-2 -right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeSchedule(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendSchedule({
                        tanggalAwal: "",
                        tanggalAkhir: "",
                        status: "tersedia"
                      })}
                      className="w-full flex items-center gap-2 mt-3"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Tambah Jadwal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-indigo-600 rounded"></div>
                    Status Paket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Tersedia</SelectItem>
                            <SelectItem value="booked">Dipesan</SelectItem>
                            <SelectItem value="in_progress">Dalam Perjalanan</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            <SelectItem value="pending_review">Menunggu Review</SelectItem>
                            <SelectItem value="archived">Diarsipkan</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
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
                      onClick={() => navigate("/admin/paket-wisata")}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                <p className="text-sm text-gray-600">Data existing akan tetap tersimpan jika tidak diubah</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Jadwal dapat ditambah atau dikurangi sesuai kebutuhan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pastikan informasi include/exclude tetap akurat</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Update status sesuai kondisi paket saat ini</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview Perubahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Paket</label>
                  <p className="text-sm font-medium">
                    {form.watch("nama") || packageData.nama}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</label>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{form.watch("durasi") || packageData.durasi}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</label>
                  <p className="text-sm">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR' 
                    }).format(form.watch("harga") || packageData.harga)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Yang Termasuk</label>
                  <p className="text-sm">
                    {form.watch("include").filter(item => item).length} item
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Yang Tidak Termasuk</label>
                  <p className="text-sm">
                    {form.watch("exclude").filter(item => item).length} item
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</label>
                  <p className="text-sm">
                    {form.watch("jadwal").length} jadwal keberangkatan
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <Badge variant={form.watch("status") === "available" ? "default" : "secondary"}>
                    {form.watch("status") || packageData.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Paket</label>
                  <p className="text-sm text-gray-700">{packageData.nama}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destinasi</label>
                  <p className="text-sm text-gray-700">{packageData.destination?.nama}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">{packageData.hotel?.nama}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: packageData.hotel?.bintang || 0 }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Original</label>
                  <Badge variant="outline">{packageData.status}</Badge>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Original</label>
                  <p className="text-sm text-gray-700">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR' 
                    }).format(packageData.harga)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{packageData.include?.length || 0}</div>
                  <div className="text-sm text-gray-600">Fasilitas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{packageData.jadwal?.length || 0}</div>
                  <div className="text-sm text-gray-600">Jadwal</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{packageData.armada?.kapasitas || 0}</div>
                  <div className="text-sm text-gray-600">Kapasitas</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{packageData.hotel?.bintang || 0}</div>
                  <div className="text-sm text-gray-600">Bintang Hotel</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/paket-wisata/${packageData._id}`)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Detail
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Sukses",
                      description: "Link berhasil disalin ke clipboard!"
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const confirmed = window.confirm('Apakah Anda yakin ingin mereset form ke data original?');
                    if (confirmed) {
                      form.reset({
                        nama: packageData.nama,
                        deskripsi: packageData.deskripsi,
                        include: packageData.include,
                        exclude: packageData.exclude,
                        jadwal: packageData.jadwal.map(schedule => ({
                          tanggalAwal: new Date(schedule.tanggalAwal).toISOString().split('T')[0],
                          tanggalAkhir: new Date(schedule.tanggalAkhir).toISOString().split('T')[0],
                          status: schedule.status
                        })),
                        status: packageData.status,
                        durasi: packageData.durasi,
                        harga: packageData.harga,
                        destination: packageData.destination._id,
                        hotel: packageData.hotel._id,
                        armada: packageData.armada._id,
                        consume: packageData.consume._id,
                        kategori: packageData.kategori?._id || "",
                      });
                      toast({
                        title: "Form Reset",
                        description: "Form berhasil direset ke data original"
                      });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>Masukkan nama untuk kategori paket wisata baru.</DialogDescription>
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
};

export default EditTourPackage;