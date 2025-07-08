import { useParams, Link } from "react-router-dom";
import { useArmada } from "@/hooks/use-armada";
import { Pencil, ArrowLeft, Loader2, Truck, Users, DollarSign, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ArmadaDetail() {
  const { id } = useParams();
  const { useArmadaDetail } = useArmada();
  const { armada, isLoading } = useArmadaDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail armada...</p>
        </div>
      </div>
    );
  }

  if (!armada) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🚐</div>
            <h3 className="text-lg font-semibold mb-2">Armada Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Armada yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => window.history.back()}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Armada
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{armada.nama}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {armada.merek}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" />
              {armada.kapasitas} Penumpang
            </Badge>
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <DollarSign className="w-3 h-3" />
              {formatPrice(armada.harga)}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/admin/armada/${armada._id}/edit`}>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link to="/admin/armada">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery Section */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded"></div>
              Foto Armada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gray-100">
                {armada.gambar && armada.gambar[0] ? (
                  <img
                    src={`http://localhost:5000/${armada.gambar[0]}`}
                    alt={`${armada.nama} - Foto Utama`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Gambar+Armada';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Truck className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Tidak ada foto</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Images */}
              {armada.gambar && armada.gambar.length > 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {armada.gambar.slice(1).map((image, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                          src={`http://localhost:5000/${image}`}
                          alt={`Armada ${index + 2}`}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Informasi Armada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Nama Armada</label>
                  <p className="text-gray-900 font-medium text-lg">{armada.nama}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Merek Kendaraan</label>
                  <p className="text-gray-700">{armada.merek}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Kapasitas</label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-600">{armada.kapasitas}</span>
                      <span className="text-sm text-gray-600">penumpang</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Harga Sewa per Hari</label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatPrice(armada.harga)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Spesifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-purple-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Jenis Kendaraan</span>
                    <p className="text-sm text-gray-600">{armada.merek}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-purple-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Kapasitas Maksimal</span>
                    <p className="text-sm text-gray-600">{armada.kapasitas} penumpang dewasa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-purple-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Tarif Harian</span>
                    <p className="text-sm text-gray-600">{formatPrice(armada.harga)} per hari</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-600 rounded"></div>
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{armada.gambar?.length || 0}</div>
                  <div className="text-sm text-gray-600">Foto</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(armada.harga / armada.kapasitas).toLocaleString('id-ID')}
                  </div>
                  <div className="text-sm text-gray-600">Harga per Orang</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-gray-600 rounded"></div>
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {armada.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Dibuat pada</div>
                      <div className="text-sm text-gray-600">
                        {new Date(armada.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {armada.updatedAt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Terakhir diupdate</div>
                      <div className="text-sm text-gray-600">
                        {new Date(armada.updatedAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}