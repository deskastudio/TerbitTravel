"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar, Clock, Eye, Bookmark, Facebook, Twitter, Linkedin, Copy, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// Format date
const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, "d MMMM yyyy", { locale: id })
}

// Sample article data
const artikelData = {
  id: "1",
  judul: "10 Pantai Tersembunyi di Bali yang Belum Banyak Dikunjungi Wisatawan",
  slug: "pantai-tersembunyi-bali",
  ringkasan:
    "Jelajahi keindahan pantai-pantai tersembunyi di Bali yang masih alami dan belum terjamah oleh keramaian wisatawan.",
  isi: `<p>Bali, pulau yang terkenal dengan keindahan alamnya, memiliki banyak pantai tersembunyi yang belum banyak dikunjungi wisatawan. Pantai-pantai ini menawarkan keindahan alam yang masih alami dan jauh dari keramaian.</p>
  
  <h2>1. Pantai Nyang Nyang</h2>
  <p>Terletak di Pecatu, Bali Selatan, Pantai Nyang Nyang menawarkan pemandangan laut yang spektakuler. Untuk mencapai pantai ini, Anda harus menuruni sekitar 500 anak tangga, tetapi pemandangan yang ditawarkan sepadan dengan usaha Anda.</p>
  
  <h2>2. Pantai Gunung Payung</h2>
  <p>Pantai ini terletak di Kutuh, Bali Selatan. Pantai Gunung Payung menawarkan pemandangan tebing karang yang menakjubkan dan air laut yang jernih. Pantai ini cocok untuk berenang dan snorkeling.</p>
  
  <h2>3. Pantai Green Bowl</h2>
  <p>Terletak di Ungasan, Bali Selatan, Pantai Green Bowl mendapatkan namanya dari bentuk cekungan di tebing karang yang menyerupai mangkuk hijau. Pantai ini memiliki gua-gua kecil yang dihuni oleh kelelawar.</p>
  
  <h2>4. Pantai Bias Tugel</h2>
  <p>Pantai Bias Tugel terletak di Padangbai, Bali Timur. Pantai ini menawarkan pasir putih yang lembut dan air laut yang jernih. Pantai ini cocok untuk berenang dan snorkeling.</p>
  
  <h2>5. Pantai Pasir Putih</h2>
  <p>Terletak di Karangasem, Bali Timur, Pantai Pasir Putih menawarkan pasir putih yang lembut dan air laut yang jernih. Pantai ini cocok untuk berenang dan snorkeling.</p>
  
  <h2>6. Pantai Soka</h2>
  <p>Pantai Soka terletak di Tabanan, Bali Barat. Pantai ini menawarkan pemandangan matahari terbenam yang spektakuler dan pasir hitam yang unik.</p>
  
  <h2>7. Pantai Balangan</h2>
  <p>Terletak di Jimbaran, Bali Selatan, Pantai Balangan menawarkan pemandangan tebing karang yang menakjubkan dan ombak yang cocok untuk berselancar.</p>
  
  <h2>8. Pantai Suluban</h2>
  <p>Pantai Suluban terletak di Uluwatu, Bali Selatan. Pantai ini terkenal di kalangan peselancar karena ombaknya yang besar dan konsisten.</p>
  
  <h2>9. Pantai Bingin</h2>
  <p>Terletak di Pecatu, Bali Selatan, Pantai Bingin menawarkan pemandangan tebing karang yang menakjubkan dan ombak yang cocok untuk berselancar.</p>
  
  <h2>10. Pantai Karma Kandara</h2>
  <p>Pantai Karma Kandara terletak di Ungasan, Bali Selatan. Pantai ini menawarkan pasir putih yang lembut dan air laut yang jernih. Pantai ini cocok untuk berenang dan snorkeling.</p>
  
  <p>Itulah 10 pantai tersembunyi di Bali yang belum banyak dikunjungi wisatawan. Semoga artikel ini bermanfaat untuk Anda yang ingin menjelajahi keindahan alam Bali yang masih alami dan jauh dari keramaian.</p>`,
  gambar: "/placeholder.svg?height=600&width=1200",
  gambarThumbnail: "/placeholder.svg?height=400&width=600",
  kategori: ["wisata-alam", "pantai", "bali"],
  penulis: {
    nama: "Andi Wijaya",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Travel blogger dan fotografer yang telah menjelajahi lebih dari 50 destinasi wisata di Indonesia.",
  },
  tanggalPublikasi: "2023-06-15",
  waktuBaca: 5,
  dilihat: 1250,
  isTrending: true,
  isPopular: true,
  isFeatured: true,
  komentar: [
    {
      id: "k1",
      nama: "Budi Santoso",
      avatar: "/placeholder.svg?height=40&width=40",
      isi: "Artikel yang sangat informatif! Saya jadi ingin mengunjungi Pantai Nyang Nyang.",
      tanggal: "2023-06-16",
      likes: 5,
    },
    {
      id: "k2",
      nama: "Siti Nurbaya",
      avatar: "/placeholder.svg?height=40&width=40",
      isi: "Terima kasih infonya. Pantai Green Bowl memang sangat indah, saya pernah ke sana tahun lalu.",
      tanggal: "2023-06-17",
      likes: 3,
    },
    {
      id: "k3",
      nama: "Rudi Hartono",
      avatar: "/placeholder.svg?height=40&width=40",
      isi: "Boleh minta rekomendasi penginapan di sekitar Pantai Bias Tugel?",
      tanggal: "2023-06-18",
      likes: 1,
    },
  ],
  artikelTerkait: [
    {
      id: "2",
      judul: "5 Aktivitas Seru yang Bisa Dilakukan di Pantai Kuta Bali",
      slug: "aktivitas-pantai-kuta-bali",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["wisata-alam", "pantai", "bali"],
      tanggalPublikasi: "2023-05-20",
    },
    {
      id: "3",
      judul: "Panduan Lengkap Berwisata ke Bali untuk Pemula",
      slug: "panduan-wisata-bali-pemula",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["tips-travel", "bali"],
      tanggalPublikasi: "2023-04-10",
    },
    {
      id: "4",
      judul: "7 Kuliner Khas Bali yang Wajib Dicoba",
      slug: "kuliner-khas-bali",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["wisata-kuliner", "bali"],
      tanggalPublikasi: "2023-07-05",
    },
  ],
}

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [artikel, setArtikel] = useState<typeof artikelData | null>(null)
  const [komentarBaru, setKomentarBaru] = useState("")
  const [namaKomentar, setNamaKomentar] = useState("")
  const [emailKomentar, setEmailKomentar] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setTimeout(() => {
      // In a real app, you would fetch the article data based on the slug
      setArtikel(artikelData)
      setIsLoading(false)
    }, 1000)
  }, [slug])

  const handleSubmitKomentar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!komentarBaru.trim() || !namaKomentar.trim() || !emailKomentar.trim()) return

    setIsSubmitting(true)
    // Simulate submitting comment
    setTimeout(() => {
      // In a real app, you would send the comment to the server
      setKomentarBaru("")
      setNamaKomentar("")
      setEmailKomentar("")
      setIsSubmitting(false)
      // Show success message or update comments list
      alert("Komentar berhasil dikirim dan sedang menunggu moderasi.")
    }, 1000)
  }

  const handleShare = (platform: string) => {
    // In a real app, you would implement sharing functionality
    alert(`Berbagi artikel ke ${platform}`)
  }

  const handleCopyLink = () => {
    // In a real app, you would copy the article URL to clipboard
    alert("Link artikel berhasil disalin ke clipboard")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!artikel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button onClick={handleGoBack}>Kembali</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb dan Tombol Kembali */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-1 p-0 hover:bg-transparent" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Artikel</span>
          </Button>
        </div>

        {/* Kategori */}
        <div className="flex flex-wrap gap-2 mb-4">
          {artikel.kategori.map((kategori) => (
            <Badge key={kategori} variant="outline" className="bg-muted/50">
              {kategori.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>

        {/* Judul Artikel */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{artikel.judul}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={artikel.penulis.avatar || "/placeholder.svg"} alt={artikel.penulis.nama} />
              <AvatarFallback>{artikel.penulis.nama.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{artikel.penulis.nama}</div>
              <div className="text-xs">Penulis</div>
            </div>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatTanggal(artikel.tanggalPublikasi)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {artikel.waktuBaca} menit baca
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {artikel.dilihat.toLocaleString()} dilihat
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative mb-8 overflow-hidden rounded-xl">
          <img src={artikel.gambar || "/placeholder.svg"} alt={artikel.judul} className="w-full object-cover" />
        </div>

        {/* Share Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
              <Facebook className="h-4 w-4 mr-1" /> Bagikan
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
              <Twitter className="h-4 w-4 mr-1" /> Tweet
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>
              <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-1" /> Salin Link
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-1" /> Simpan
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: artikel.isi }} />

        {/* Author Bio */}
        <div className="bg-muted/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={artikel.penulis.avatar || "/placeholder.svg"} alt={artikel.penulis.nama} />
              <AvatarFallback>{artikel.penulis.nama.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold mb-1">Tentang Penulis</h3>
              <h4 className="font-medium mb-2">{artikel.penulis.nama}</h4>
              <p className="text-muted-foreground">{artikel.penulis.bio}</p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artikel.artikelTerkait.map((terkait) => (
              <Card key={terkait.id} className="overflow-hidden">
                <div className="relative">
                  <img src={terkait.gambar || "/placeholder.svg"} alt={terkait.judul} className="h-40 w-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {terkait.kategori[0].replace(/-/g, " ")}
                  </Badge>
                  <h3 className="font-bold line-clamp-2 mb-2 hover:text-primary cursor-pointer">{terkait.judul}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatTanggal(terkait.tanggalPublikasi)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Komentar */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Komentar ({artikel.komentar.length})</h2>
          <div className="space-y-6">
            {artikel.komentar.map((komen) => (
              <div key={komen.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={komen.avatar || "/placeholder.svg"} alt={komen.nama} />
                  <AvatarFallback>{komen.nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{komen.nama}</div>
                  <div className="text-sm text-muted-foreground mb-2">{formatTanggal(komen.tanggal)}</div>
                  <p>{komen.isi}</p>
                  <div className="text-sm text-muted-foreground mt-1">{komen.likes} suka</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Komentar */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tulis Komentar</h2>
          <form onSubmit={handleSubmitKomentar} className="space-y-4">
            <div>
              <label htmlFor="nama" className="block font-medium mb-1">Nama</label>
              <Input
                id="nama"
                type="text"
                value={namaKomentar}
                onChange={(e) => setNamaKomentar(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={emailKomentar}
                onChange={(e) => setEmailKomentar(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="komentar" className="block font-medium mb-1">Komentar</label>
              <textarea
                id="komentar"
                className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                value={komentarBaru}
                onChange={(e) => setKomentarBaru(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

