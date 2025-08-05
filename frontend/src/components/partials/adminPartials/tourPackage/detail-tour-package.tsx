import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Utensils,
  Car,
  Hotel,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit,
  Eye,
  Star,
  DollarSign,
  Package,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TourPackageService } from "@/services/tour-package.service";
import { ITourPackage } from "@/types/tour-package.types";

const DetailTourPackage = () => {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScheduleStatusVariant = (status: string) => {
    return status === "tersedia"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail paket wisata...</p>
        </div>
      </div>
    );
  }

  if (!tourPackage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-lg font-semibold mb-2">
              Paket Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Paket wisata yang Anda cari tidak tersedia atau telah dihapus.
            </p>
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
            <BreadcrumbPage className="text-gray-600">
              Detail Paket
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {tourPackage.nama}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {tourPackage.destination?.nama}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              {tourPackage.durasi}
            </Badge>
            <Badge
              variant="default"
              className={`flex items-center gap-1 ${getStatusVariant(
                tourPackage.status
              )}`}
            >
              <Package className="w-3 h-3" />
              {tourPackage.status}
            </Badge>
            <Badge
              variant="default"
              className="flex items-center gap-1 bg-green-600"
            >
              <DollarSign className="w-3 h-3" />
              {formatPrice(tourPackage.harga)}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/admin/paket-wisata/${tourPackage._id}/edit`)
            }
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-purple-600">
                  {tourPackage.destination &&
                  tourPackage.destination.foto &&
                  tourPackage.destination.foto.length > 0 ? (
                    <img
                      src={tourPackage.destination.foto[0]}
                      alt={tourPackage.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          {tourPackage.nama}
                        </p>
                        <p className="text-sm opacity-75">
                          Paket Wisata Premium
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusVariant(tourPackage.status)}`}>
                    {tourPackage.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Detail Paket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">
                  {tourPackage.deskripsi}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Durasi
                      </p>
                      <p className="text-blue-700 font-semibold">
                        {tourPackage.durasi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Hotel className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Hotel</p>
                      <p className="text-green-700 font-semibold">
                        {tourPackage.hotel?.nama}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({
                          length: tourPackage.hotel?.bintang || 0,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Transportasi
                      </p>
                      <p className="text-purple-700 font-semibold">
                        {tourPackage.armada?.nama}
                      </p>
                      <p className="text-sm text-gray-600">
                        Kapasitas:{" "}
                        {Array.isArray(tourPackage.armada?.kapasitas)
                          ? tourPackage.armada.kapasitas[0]
                          : tourPackage.armada?.kapasitas}{" "}
                        orang
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Utensils className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Konsumsi
                      </p>
                      <p className="text-orange-700 font-semibold">
                        {tourPackage.consume?.nama}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Include & Exclude */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Yang Termasuk & Tidak Termasuk
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Yang Termasuk
                </h3>
                <div className="space-y-2">
                  {tourPackage.include.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center text-red-700">
                  <XCircle className="w-5 h-5 mr-2" />
                  Tidak Termasuk
                </h3>
                <div className="space-y-2">
                  {tourPackage.exclude.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-red-50 rounded-lg"
                    >
                      <XCircle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Jadwal Keberangkatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tourPackage.jadwal.map((schedule, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-gray-900">
                          Jadwal {index + 1}
                        </span>
                      </div>
                      <Badge
                        className={getScheduleStatusVariant(schedule.status)}
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Keberangkatan
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(schedule.tanggalAwal).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Kepulangan
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(schedule.tanggalAkhir).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Informasi Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(tourPackage.harga)}
                </div>
                <p className="text-sm text-gray-600">per orang</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusVariant(tourPackage.status)}>
                    {tourPackage.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jadwal Tersedia</span>
                  <span className="text-sm font-medium">
                    {
                      tourPackage.jadwal.filter((j) => j.status === "tersedia")
                        .length
                    }{" "}
                    dari {tourPackage.jadwal.length}
                  </span>
                </div>
              </div>

              <Separator />

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Eye className="mr-2 h-4 w-4" />
                Lihat Pemesanan
              </Button>
              <p className="text-sm text-gray-500 text-center">
                atau hubungi kami di +62 123 456 7890
              </p>
            </CardContent>
          </Card>

          {/* Package Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Statistik Paket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {tourPackage.include.length}
                  </div>
                  <div className="text-sm text-gray-600">Fasilitas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {tourPackage.jadwal.length}
                  </div>
                  <div className="text-sm text-gray-600">Jadwal</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Array.isArray(tourPackage.armada?.kapasitas)
                      ? tourPackage.armada.kapasitas[0]
                      : tourPackage.armada?.kapasitas || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kapasitas</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {tourPackage.hotel?.bintang || 0}
                  </div>
                  <div className="text-sm text-gray-600">Bintang Hotel</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destination Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Informasi Destinasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinasi
                  </label>
                  <p className="text-gray-900 font-medium">
                    {tourPackage.destination?.nama}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi
                  </label>
                  <p className="text-gray-700">
                    {tourPackage.destination?.lokasi}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <Badge variant="outline">
                    {tourPackage.kategori?.title || "Tidak ada kategori"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-600 rounded"></div>
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/paket-wisata/${tourPackage._id}/edit`)
                  }
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Paket
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailTourPackage;
