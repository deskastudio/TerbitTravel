import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Construction } from 'lucide-react'

export default function TourPackagesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4A4947] px-2">
          Jelajahi Paket Wisata Kami
        </h1>
        <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base px-4">
          Temukan berbagai paket wisata dan persiapkan petualangan Anda berikutnya!
        </p>
      </div>

      <div className="flex justify-center px-4">
        <Input
          type="text"
          placeholder="Cari paket wisata..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl bg-white"
        />
      </div>

      <div className="w-full overflow-x-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-full">
          <TabsList className="flex justify-start md:justify-center bg-transparent p-1">
            <TabsTrigger value="all" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap">
              Semua
            </TabsTrigger>
            <TabsTrigger value="popular" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap">
              Populer
            </TabsTrigger>
            <TabsTrigger value="promo" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap">
              Promo
            </TabsTrigger>
            <TabsTrigger value="flash-sale" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap">
              Flash Sale
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg mx-auto">
        <Construction className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mb-3 md:mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
          Sedang Dalam Pengembangan
        </h2>
        <p className="text-gray-600 text-center text-sm md:text-base max-w-md">
          Kami sedang bekerja keras untuk menyiapkan paket wisata yang luar biasa untuk Anda. 
          Silakan kembali lagi nanti untuk melihat penawaran terbaru kami!
        </p>
      </div>
    </div>
  )
}