"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Star, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Menggunakan tipe data yang diberikan
export interface IDestination {
  _id: string
  nama: string
  lokasi: string
}

// Contoh data destinasi yang diperluas untuk UI
const destinationData: IDestination & {
  deskripsiLengkap: string
  alamatLengkap: string
  jamOperasional: string
  hargaTiket: string
  fasilitas: string[]
  tips: string[]
  ulasan: {
    id: string
    nama: string
    foto: string
    rating: number
    tanggal: string
    komentar: string
  }[]
  ratingStats: {
    total: number
    average: number
    distribution: number[]
  }
  galeri: string[]
  deskripsi: string
} = {
  _id: "dest1",
  nama: "Danau Toba",
  lokasi: "Sumatera Utara, Indonesia",
  deskripsi: "Danau vulkanik terbesar di Indonesia dan Asia Tenggara",
  deskripsiLengkap: `Danau Toba adalah danau vulkanik dengan ukuran panjang 100 kilometer dan lebar 30 kilometer yang terletak di Provinsi Sumatera Utara, Indonesia. Danau ini merupakan danau vulkanik terbesar di dunia dan danau terbesar di Indonesia.

  Danau Toba terbentuk dari letusan supervolcano (gunung berapi super) sekitar 74.000 tahun yang lalu. Letusan ini adalah salah satu letusan paling dahsyat dalam sejarah yang diketahui, dengan skala VEI 8. Letusan ini menyebabkan perubahan iklim global dan diduga telah menyebabkan musim dingin vulkanik selama 6-10 tahun.
  
  Di tengah Danau Toba terdapat sebuah pulau vulkanik bernama Pulau Samosir. Pulau ini memiliki luas sekitar 630 km² dan merupakan pulau vulkanik terbesar di dunia yang berada di tengah danau. Pulau Samosir terhubung dengan daratan Sumatera melalui sebuah tanah genting di Pangururan.
  
  Danau Toba merupakan destinasi wisata populer di Indonesia yang menawarkan pemandangan alam yang spektakuler, udara yang sejuk, dan kekayaan budaya Batak. Pengunjung dapat menikmati berbagai aktivitas seperti berenang, berperahu, mengunjungi desa-desa tradisional Batak, dan menikmati kuliner lokal.`,
  alamatLengkap: "Danau Toba, Kabupaten Samosir, Sumatera Utara, Indonesia",
  jamOperasional: "Buka 24 jam (beberapa atraksi memiliki jam operasional tersendiri)",
  hargaTiket: "Gratis (beberapa atraksi mungkin memerlukan tiket masuk)",
  fasilitas: [
    "Area Parkir",
    "Toilet Umum",
    "Penginapan",
    "Restoran",
    "Toko Suvenir",
    "Dermaga",
    "Penyewaan Perahu",
    "Pemandu Wisata",
  ],
  tips: [
    "Kunjungi pada musim kemarau (Mei-September) untuk cuaca yang lebih baik",
    "Sewa kendaraan untuk menjelajahi area sekitar danau",
    "Bawa pakaian hangat karena suhu bisa turun di malam hari",
    "Coba kuliner khas Batak seperti Arsik dan Saksang",
    "Luangkan waktu minimal 2-3 hari untuk menjelajahi Danau Toba dan Pulau Samosir",
  ],
  ulasan: [
    {
      id: "u1",
      nama: "Budi Santoso",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 5,
      tanggal: "15 Maret 2023",
      komentar:
        "Pemandangan yang luar biasa! Danau Toba adalah salah satu keajaiban alam Indonesia yang wajib dikunjungi. Airnya jernih dan suasananya sangat tenang dan damai.",
    },
    {
      id: "u2",
      nama: "Siti Rahma",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 4,
      tanggal: "22 April 2023",
      komentar:
        "Pengalaman yang menyenangkan mengunjungi Danau Toba. Budaya Batak yang kental dan pemandangan yang indah. Sayang beberapa area masih kurang terawat.",
    },
    {
      id: "u3",
      nama: "Agus Wijaya",
      foto: "/placeholder.svg?height=40&width=40",
      rating: 5,
      tanggal: "10 Juni 2023",
      komentar:
        "Tempat yang sempurna untuk liburan keluarga. Anak-anak sangat menikmati naik perahu mengelilingi danau. Penduduk lokalnya juga sangat ramah dan membantu.",
    },
  ],
  ratingStats: {
    total: 256,
    average: 4.7,
    distribution: [5, 10, 15, 86, 140],
  },
  galeri: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
}

export default function DestinationDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === destinationData.galeri.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? destinationData.galeri.length - 1 : prev - 1))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb dan Tombol Kembali */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="gap-1 p-0 hover:bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Destinasi</span>
        </Button>
        <h1 className="mt-4 text-3xl font-bold">{destinationData.nama}</h1>
        <div className="mt-2 flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{destinationData.lokasi}</span>
          <div className="ml-4 flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span>
              {destinationData.ratingStats.average} ({destinationData.ratingStats.total} ulasan)
            </span>
          </div>
        </div>
      </div>

      {/* Galeri Foto */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={destinationData.galeri[currentImageIndex] || "/placeholder.svg"}
            alt={`${destinationData.nama} - Foto ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Navigasi Galeri */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Indikator Foto */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {destinationData.galeri.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              } transition-all`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="absolute right-4 top-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 hover:bg-white">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Informasi dan Tab */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Konten Utama */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
              <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 text-xl font-semibold">Tentang {destinationData.nama}</h2>
                  <div className="text-muted-foreground whitespace-pre-line">{destinationData.deskripsiLengkap}</div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Tips Berkunjung</h2>
                  <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                    {destinationData.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="facilities">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Fasilitas yang Tersedia</h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {destinationData.fasilitas.map((fasilitas, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-lg">✓</span>
                        </div>
                        <span>{fasilitas}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Informasi Tambahan</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Alamat</div>
                      <div className="text-muted-foreground">{destinationData.alamatLengkap}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Jam Operasional</div>
                      <div className="text-muted-foreground">{destinationData.jamOperasional}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Harga Tiket</div>
                      <div className="text-muted-foreground">{destinationData.hargaTiket}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Rating Summary */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 text-center text-4xl font-bold">{destinationData.ratingStats.average}</div>
                      <div className="mb-4 flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(destinationData.ratingStats.average)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Berdasarkan {destinationData.ratingStats.total} ulasan
                      </div>

                      <div className="mt-4 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="w-8 text-sm">{rating} ★</div>
                            <Progress
                              value={
                                (destinationData.ratingStats.distribution[5 - rating] /
                                  destinationData.ratingStats.total) *
                                100
                              }
                              className="h-2"
                            />
                            <div className="w-8 text-right text-sm text-muted-foreground">
                              {destinationData.ratingStats.distribution[5 - rating]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:w-2/3">
                    <h2 className="mb-4 text-xl font-semibold">Ulasan Pengunjung</h2>
                    <div className="space-y-4">
                      {destinationData.ulasan.map((ulasan) => (
                        <Card key={ulasan.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={ulasan.foto || "/placeholder.svg"} alt={ulasan.nama} />
                                  <AvatarFallback>{ulasan.nama.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{ulasan.nama}</div>
                                  <div className="text-sm text-muted-foreground">{ulasan.tanggal}</div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < ulasan.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 text-muted-foreground">{ulasan.komentar}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline">Lihat Semua Ulasan</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Informasi Destinasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Lokasi</div>
                      <div className="text-sm text-muted-foreground">{destinationData.lokasi}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Jam Operasional</div>
                      <div className="text-sm text-muted-foreground">{destinationData.jamOperasional}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Waktu Terbaik untuk Berkunjung</div>
                      <div className="text-sm text-muted-foreground">Mei - September</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Cocok Untuk</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">Keluarga</Badge>
                      <Badge variant="secondary">Pasangan</Badge>
                      <Badge variant="secondary">Solo Traveler</Badge>
                      <Badge variant="secondary">Fotografer</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full">Lihat Paket Wisata</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Destinasi Terdekat</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt={`Destinasi Terdekat ${i}`}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">Destinasi Terdekat {i}</div>
                        <div className="text-sm text-muted-foreground">15 km dari sini</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
