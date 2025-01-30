// TourPackageEditForm.tsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Minus, CalendarPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Card, CardContent } from "@/components/ui/card";
import { TourPackageService } from "@/services/tour-package.service";
import { useTourPackage } from "@/hooks/use-tour-package";
import { tourPackageSchema } from "@/lib/schemas";
import type { ITourPackageInput } from "@/types/tour-package.types";

const TourPackageEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { destinations, hotels, armada, consumptions } = useTourPackage();

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
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, form]);

  const onSubmit = async (data: ITourPackageInput) => {
    try {
      await TourPackageService.updatePackage(id!, data);
      navigate(`/admin/paket-wisata/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Paket</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama paket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinasi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih destinasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.map((destination) => (
                          <SelectItem key={destination._id} value={destination._id}>
                            {destination.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan deskripsi paket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Termasuk</FormLabel>
              {includeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`include.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Tambahkan item termasuk" {...field} />
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
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendInclude("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item
             </Button>
           </div>

           <div className="space-y-4">
             <FormLabel>Tidak Termasuk</FormLabel>
             {excludeFields.map((field, index) => (
               <div key={field.id} className="flex gap-2">
                 <FormField
                   control={form.control}
                   name={`exclude.${index}`}
                   render={({ field }) => (
                     <FormItem className="flex-1">
                       <FormControl>
                         <Input placeholder="Tambahkan item tidak termasuk" {...field} />
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
                 >
                   <Minus className="h-4 w-4" />
                 </Button>
               </div>
             ))}
             <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => appendExclude("")}
             >
               <Plus className="h-4 w-4 mr-2" />
               Tambah Item
             </Button>
           </div>

           <div className="space-y-4">
             <FormLabel>Jadwal</FormLabel>
             {scheduleFields.map((field, index) => (
               <div key={field.id} className="grid grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name={`jadwal.${index}.tanggalAwal`}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Tanggal Mulai</FormLabel>
                       <FormControl>
                         <Input type="date" {...field} />
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
                       <FormLabel>Tanggal Selesai</FormLabel>
                       <FormControl>
                         <Input type="date" {...field} />
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
                       <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                         <FormControl>
                           <SelectTrigger>
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
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => removeSchedule(index)}
                   className="mt-8"
                 >
                   <Minus className="h-4 w-4 mr-2" />
                   Hapus Jadwal
                 </Button>
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
             >
               <CalendarPlus className="h-4 w-4 mr-2" />
               Tambah Jadwal
             </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
               control={form.control}
               name="hotel"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Hotel</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Pilih hotel" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {hotels.map((hotel) => (
                         <SelectItem key={hotel._id} value={hotel._id}>
                           {hotel.nama}
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
                   <FormLabel>Transportasi</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Pilih transportasi" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {armada.map((item) => (
                         <SelectItem key={item._id} value={item._id}>
                           {item.nama}
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
                   <FormLabel>Konsumsi</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Pilih konsumsi" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {consumptions.map((consumption) => (
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

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
               control={form.control}
               name="harga"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Harga</FormLabel>
                   <FormControl>
                     <Input
                       type="number"
                       placeholder="Masukkan harga"
                       {...field}
                       onChange={(e) => field.onChange(Number(e.target.value))}
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="durasi"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Durasi</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., 3 hari 2 malam" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
           </div>

           <FormField
             control={form.control}
             name="status"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Status</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih status" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="available">Tersedia</SelectItem>
                     <SelectItem value="booked">Dipesan</SelectItem>
                     <SelectItem value="in_progress">Dalam Perjalanan</SelectItem>
                     <SelectItem value="completed">Selesai</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
           />

           <div className="flex justify-end gap-4">
             <Button type="button" variant="outline" onClick={() => navigate(-1)}>
               Batal
             </Button>
             <Button type="submit">Perbarui Paket</Button>
           </div>
         </form>
       </Form>
     </CardContent>
   </Card>
 );
};

export default TourPackageEditForm;