import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, ClockIcon, MapPinIcon, UsersIcon, DollarSignIcon } from "lucide-react"
import { tourPackages } from "@/lib/tour-package"
import { TourPackage } from "@/types/tour-package"

export default function TourPackageDetails() {
  const { id } = useParams<{ id: string }>()
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const packageData = tourPackages.find((p) => p.id === id)
    setTourPackage(packageData || null)
  }, [id])

  if (!tourPackage) {
    return <div className="container mx-auto text-center py-12">Paket tidak ditemukan</div>
  }

  const handleBookNowClick = () => {
    navigate(`/booking/${id}`, { state: { tourPackage } }) // Pass the tour package data
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tombol Kembali */}
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon size={18} />
        Kembali ke Paket
      </Button>

      {/* Detail Paket Utama */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Gambar dan Ikhtisar */}
        <div>
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
            <img
              src={tourPackage.image}
              alt={tourPackage.name}
              className="w-full h-96 object-cover"
            />
            <Badge 
              variant={ 
                tourPackage.availability === "Tersedia"
                  ? "default" 
                  : tourPackage.availability === "Terbatas"
                  ? "secondary" 
                  : "destructive"
              }
              className="absolute top-4 right-4"
            >
              {tourPackage.availability}
            </Badge>
          </div>

          {/* Badge Informasi Cepat */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="outline" className="flex items-center gap-2">
              <ClockIcon size={16} />
              {tourPackage.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <MapPinIcon size={16} />
              {tourPackage.destination}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <UsersIcon size={16} />
              {tourPackage.type.join(", ")}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <DollarSignIcon size={16} />
              {tourPackage.category}
            </Badge>
          </div>
        </div>

        {/* Deskripsi Detail */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-3xl">{tourPackage.name}</CardTitle>
            <CardDescription>{tourPackage.destination}</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 mb-6">
            <p className="text-muted-foreground mb-4">{tourPackage.description}</p>
            <div className="text-2xl font-bold text-primary">
              Rp {tourPackage.price.toLocaleString("id-ID")}
            </div>
          </CardContent>

          <CardFooter className="p-0">
            <Button 
              size="lg" 
              className="w-full"
              disabled={tourPackage.availability !== "Tersedia"}
              onClick={handleBookNowClick}
            >
              {tourPackage.availability !== "Terbatas"
                ? "Pesan Sekarang" 
                : "Tidak Tersedia"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tab Detail */}
      <Tabs defaultValue="itinerary" className="mt-8">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="included">Yang Termasuk</TabsTrigger>
          <TabsTrigger value="not-included">Yang Tidak Termasuk</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          <Card>
            <CardHeader>
              <CardTitle>Rencana Perjalanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {tourPackage.itinerary.map((item, index) => (
                  <li 
                    key={index} 
                    className="border-b last:border-b-0 py-3 flex items-start"
                  >
                    <span className="mr-4 font-semibold text-primary min-w-[60px]">
                      Hari {index + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="included">
          <Card>
            <CardHeader>
              <CardTitle>Yang Termasuk</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tourPackage.included.map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="not-included">
          <Card>
            <CardHeader>
              <CardTitle>Yang Tidak Termasuk</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tourPackage.notIncluded.map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="text-red-500">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
