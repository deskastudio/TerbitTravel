//pages/destination/[id].tsx - IMPROVED VERSION
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Edit } from 'lucide-react';
import { useDestination } from '@/hooks/use-destination';

import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { getImageUrl } from '@/utils/image-helper';

const DetailDestinationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useDestinationDetail } = useDestination();
  const { destination, isLoading } = useDestinationDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail destinasi...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-lg font-semibold mb-2">Destinasi Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Destinasi yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => navigate("/admin/destination")}>
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
              onClick={() => navigate("/admin/destination")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Destinasi
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{destination.nama}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {destination.lokasi}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {destination.category?.title || "Tidak Ada Kategori"}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/destination/${destination._id}/edit`)}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery Section */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Galeri Foto</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {/* Main Carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {destination.foto.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <img
                          src={getImageUrl(image)}
                          alt={`${destination.nama} - Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => {
                            // No fallback image
                          }}
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {index + 1} / {destination.foto.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {destination.foto.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
              
              {/* Thumbnail Gallery */}
              {destination.foto.length > 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {destination.foto.map((image, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                          src={getImageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
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
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Informasi Destinasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Nama Destinasi</label>
                  <p className="text-gray-900 font-medium">{destination.nama}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Lokasi</label>
                  <p className="text-gray-900 font-medium">{destination.lokasi}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Kategori</label>
                  <Badge variant="secondary" className="w-fit">
                    {destination.category?.title || "Tidak Ada Kategori"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Deskripsi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {destination.deskripsi}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics or Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{destination.foto.length}</div>
                  <div className="text-sm text-gray-600">Total Foto</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-gray-600">Tersedia</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailDestinationPage;