import { useParams, Link } from "react-router-dom";
import { useConsumption } from "@/hooks/use-consumption";
import { Pencil, ArrowLeft, Loader2, UtensilsCrossed, DollarSign, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ConsumptionDetail() {
  const { id } = useParams();
  const { useConsumptionDetail } = useConsumption();
  const { consumption, isLoading, error } = useConsumptionDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail konsumsi...</p>
        </div>
      </div>
    );
  }

  if (error || !consumption) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold mb-2">Konsumsi Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Konsumsi yang Anda cari tidak tersedia atau telah dihapus.</p>
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
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link 
              to="/admin/consumption"
              className="text-blue-600 hover:text-blue-800"
            >
              Konsumsi
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{consumption.nama}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <DollarSign className="w-3 h-3" />
              {formatPrice(consumption.harga)}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <UtensilsCrossed className="w-3 h-3" />
              {consumption.lauk.length} Menu
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/admin/consumption/${consumption._id}/edit`}>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link to="/admin/consumption">
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
        {/* Menu Display Section */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded"></div>
              Daftar Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consumption.lauk.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{item}</span>
                  </div>
                  <UtensilsCrossed className="h-4 w-4 text-blue-600" />
                </div>
              ))}
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
                Informasi Konsumsi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Nama Paket</label>
                  <p className="text-gray-900 font-medium text-lg">{consumption.nama}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Harga per Porsi</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(consumption.harga)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Jumlah Menu</label>
                  <p className="text-gray-700">{consumption.lauk.length} item menu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Ringkasan Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {consumption.lauk.map((menu, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                    <div className="text-purple-600">
                      <UtensilsCrossed className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{menu}</span>
                  </div>
                ))}
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
                  <div className="text-2xl font-bold text-blue-600">{consumption.lauk.length}</div>
                  <div className="text-sm text-gray-600">Total Menu</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(consumption.harga / consumption.lauk.length).toLocaleString('id-ID', {
                      maximumFractionDigits: 0
                    })}
                  </div>
                  <div className="text-sm text-gray-600">Harga per Menu</div>
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
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Dibuat pada</div>
                    <div className="text-sm text-gray-600">
                      {new Date(consumption.createdAt || "").toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Terakhir diupdate</div>
                    <div className="text-sm text-gray-600">
                      {new Date(consumption.updatedAt || "").toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}