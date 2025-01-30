// TourPackageDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Calendar, Clock, Utensils, Car, Hotel, CheckCircle, XCircle 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TourPackageService } from "@/services/tour-package.service";
import { ITourPackage } from "@/types/tour-package.types";

const TourPackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tourPackage, setTourPackage] = useState<ITourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await TourPackageService.getPackageById(id!);
        setTourPackage(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchPackage();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!tourPackage) return <div>Paket tidak ditemukan</div>;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "unavailable":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={tourPackage.imageUrl || "/placeholder.jpg"}
          alt={tourPackage.nama}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{tourPackage.nama}</h1>
            <div className="flex items-center text-white">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{tourPackage.destination?.nama}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Paket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{tourPackage.deskripsi}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>Durasi:</strong> {tourPackage.durasi}
                  </span>
                </div>
                <div className="flex items-center">
                  <Hotel className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>Hotel:</strong> {tourPackage.hotel?.nama}
                  </span>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>Transportasi:</strong> {tourPackage.armada?.nama}
                  </span>
                </div>
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>Konsumsi:</strong> {tourPackage.consume?.nama}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termasuk & Tidak Termasuk</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Termasuk:
                </h3>
                <ul className="space-y-1">
                  {tourPackage.include.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                  Tidak Termasuk:
                </h3>
                <ul className="space-y-1">
                  {tourPackage.exclude.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jadwal Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tourPackage.jadwal.map((schedule, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="font-semibold">Perjalanan {index + 1}</span>
                    </div>
                    <div className="text-sm">
                      {new Date(schedule.tanggalAwal).toLocaleDateString()} - 
                      {new Date(schedule.tanggalAkhir).toLocaleDateString()}
                    </div>
                    <Badge variant={schedule.status === "tersedia" ? "default" : "destructive"}>
                      {schedule.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pemesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                {tourPackage.harga.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>
              <Badge variant={getStatusVariant(tourPackage.status)}>
                {tourPackage.status}
              </Badge>
              <Separator />
              <Button className="w-full">Pesan Sekarang</Button>
              <p className="text-sm text-muted-foreground text-center">
                atau hubungi kami di +62 123 456 7890
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate("/admin/paket-wisata")}>
          Kembali ke Semua Paket
        </Button>
        <Button onClick={() => navigate(`/admin/paket-wisata/${tourPackage._id}/edit`)}>
          Edit Paket
        </Button>
      </div>
    </div>
  );
};

export default TourPackageDetailPage;