//pages/destination/[id].tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag } from 'lucide-react';
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!destination) {
    return <div className="flex items-center justify-center h-screen">Destinasi tidak ditemukan</div>;
  }

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
            <BreadcrumbPage>Detail Destinasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Image Gallery */}
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Carousel className="w-full">
                <CarouselContent>
                  {destination.foto.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex aspect-square items-center justify-center p-2">
                        <img
                          src={getImageUrl(image)}
                          alt={`${destination.nama} image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image';
                          }}
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {destination.foto.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            </div>
            <div className="flex gap-2 overflow-x-auto py-2 mt-4">
              {destination.foto.map((image, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 relative group cursor-pointer"
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md transition-opacity group-hover:opacity-90"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Destination Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{destination.nama}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {destination.lokasi}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {destination.category.title}
              </Badge>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
              <p className="text-gray-600 whitespace-pre-line">{destination.deskripsi}</p>
            </div>

            <div className="pt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/destination/${destination._id}/edit`)}
              >
                Edit Destinasi
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailDestinationPage;