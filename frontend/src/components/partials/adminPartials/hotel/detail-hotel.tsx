import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Loader2, 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Star, 
  Building, 
  DollarSign,
  Wifi,
  Car,
  Utensils,
  Waves
} from "lucide-react";
import { getImageUrl } from "@/utils/image-helper";
import axios from "@/lib/axios";

interface Hotel {
  _id: string;
  nama: string;
  alamat: string;
  bintang: number;
  harga: number;
  fasilitas: string[];
  gambar: string[];
}

const DetailHotel = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        const response = await axios.get(`/hotel/get/${id}`);
        setHotel(response.data);
      } catch (error) {
        console.error('Failed to fetch hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [id]);

  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase();
    if (facilityLower.includes('wifi') || facilityLower.includes('internet')) {
      return <Wifi className="h-4 w-4" />;
    } else if (facilityLower.includes('parkir') || facilityLower.includes('parking')) {
      return <Car className="h-4 w-4" />;
    } else if (facilityLower.includes('restaurant') || facilityLower.includes('restoran') || facilityLower.includes('makan')) {
      return <Utensils className="h-4 w-4" />;
    } else if (facilityLower.includes('kolam') || facilityLower.includes('pool')) {
      return <Waves className="h-4 w-4" />;
    } else {
      return <Building className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail hotel...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-semibold mb-2">Hotel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">Hotel yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => navigate("/admin/hotel")}>
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
              onClick={() => navigate("/admin/hotel")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Hotel
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail Hotel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{hotel.nama}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {hotel.alamat}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              {hotel.bintang} Bintang
            </Badge>
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <DollarSign className="w-3 h-3" />
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(hotel.harga)}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/hotel/${hotel._id}/edit`)}
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
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={getImageUrl(hotel.gambar[0])}
                  alt={`${hotel.nama} - Foto Utama`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Gambar+Hotel';
                  }}
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {hotel.gambar.length > 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {hotel.gambar.map((image, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                          src={getImageUrl(image)}
                          alt={`Hotel ${index + 1}`}
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
                Informasi Hotel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Nama Hotel</label>
                  <p className="text-gray-900 font-medium text-lg">{hotel.nama}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Alamat</label>
                  <p className="text-gray-700">{hotel.alamat}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < hotel.bintang 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({hotel.bintang}/5)</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Harga per Malam</label>
                    <p className="text-lg font-semibold text-green-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(hotel.harga)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.fasilitas.map((facility, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-green-600">
                      {getFacilityIcon(facility)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{hotel.gambar.length}</div>
                  <div className="text-sm text-gray-600">Foto</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{hotel.fasilitas.length}</div>
                  <div className="text-sm text-gray-600">Fasilitas</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{hotel.bintang}</div>
                  <div className="text-sm text-gray-600">Bintang</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DetailHotel;