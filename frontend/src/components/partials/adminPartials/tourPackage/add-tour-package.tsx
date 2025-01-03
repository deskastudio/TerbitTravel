'use client'

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Minus, CalendarPlus } from "lucide-react";

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

import { tourPackageSchema, type TourPackage } from "@/lib/schemas";
import { destinations, hotels, fleets } from "@/lib/data";

const TourPackageAddForm: React.FC = () => {
    const form = useForm<TourPackage>({
        resolver: zodResolver(tourPackageSchema),
        defaultValues: {
          includes: [""],
          excludes: [""],
          schedules: [{ startDate: "", endDate: "" }],
          status: "available",
          duration: "",
          price: 0,
        },
      });

  const { fields: includeFields, append: appendInclude, remove: removeInclude } =
    useFieldArray({
      control: form.control,
      name: "schedules",
    });

  const { fields: excludeFields, append: appendExclude, remove: removeExclude } =
    useFieldArray({
      control: form.control,
      name: "schedules",
    });

  const { fields: scheduleFields, append: appendSchedule } =
    useFieldArray({
      control: form.control,
      name: "schedules",
    });

  const onSubmit = async (data: TourPackage) => {
    try {
      console.log(data);
      // Kirim data ke API di sini
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi paket"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan durasi (contoh: 3 hari 2 malam)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga (contoh: 1000000)"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel>Termasuk</FormLabel>
                {includeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`includes.${index}`}
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
                  onClick={() => appendInclude({ startDate: "", endDate: "" })}
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
                      name={`excludes.${index}`}
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
                  onClick={() => appendExclude({ startDate: "", endDate: "" })}
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
                      name={`schedules.${index}.startDate`}
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
                      name={`schedules.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Pulang</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSchedule({ startDate: "", endDate: "" })
                  }
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Tambah Jadwal
                </Button>
              </div>

              {/* Destinasi, Hotel, Transportasi, dan Konsumsi */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinasi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih destinasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.map((destination) => (
                          <SelectItem key={destination.id} value={destination.name}>
                            {destination.name}
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
                    <FormLabel>Hotel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.name}>
                            {hotel.name}
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
                name="fleet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportasi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih transportasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fleets.map((fleet) => (
                          <SelectItem key={fleet.id} value={fleet.name}>
                            {fleet.name}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih konsumsi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Sarapan</SelectItem>
                        <SelectItem value="full_board">Penuh</SelectItem>
                        <SelectItem value="none">Tidak Ada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Batal
              </Button>
              <Button type="submit">Buat Paket</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TourPackageAddForm;
