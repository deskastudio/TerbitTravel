import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center">
        <p>Hotel tidak ditemukan</p>
        <Button onClick={() => navigate('/admin/hotel')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Hotel</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/hotel')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button onClick={() => navigate(`/admin/hotel/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Hotel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{hotel.nama}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informasi Umum</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Alamat:</span> {hotel.alamat}</p>
                <p><span className="font-medium">Bintang:</span> {'⭐'.repeat(hotel.bintang)}</p>
                <p>
                  <span className="font-medium">Harga:</span>{' '}
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(hotel.harga)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fasilitas</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.fasilitas.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Galeri</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.gambar.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${img}`}
                  alt={`${hotel.nama} - ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DetailHotel;