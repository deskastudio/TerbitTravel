'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Construction } from 'lucide-react'

const categories: string[] = ["Semua", "Wisata Sekolah", "Wisata Keluarga", "Wisata Kampus", "Wisata Alam"]

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentCategory, setCurrentCategory] = useState<string>('Semua')

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4A4947] px-2">
          Pustaka Artikel Travedia
        </h1>
        <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base px-4">
          Menghadirkan informasi terbaru seputar wisata, dan hal menarik lainnya.
        </p>
      </div>

      <div className="flex justify-center px-4">
        <Input
          type="text"
          placeholder="Cari artikel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl bg-white"
        />
      </div>

      <div className="w-full overflow-x-auto px-4">
        <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="min-w-full">
          <TabsList className="flex justify-start md:justify-center bg-transparent p-1 gap-2 md:gap-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg mx-4">
        <Construction className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mb-3 md:mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
          Sedang Dalam Pengembangan
        </h2>
        <p className="text-gray-600 text-center text-sm md:text-base max-w-md">
          Terima kasih telah mengunjungi, dan kami sedang mempersiapkan sesuatu yang lebih baik untuk Anda.
        </p>
      </div>
    </div>
  )
}

export default ArticlesPage;