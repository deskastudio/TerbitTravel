'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@heroicons/react/24/solid"
import useEmblaCarousel from 'embla-carousel-react'

const galleryImages = [
  { src: "./Profile/Galeri/tim1.jpg", category: "Tim Terbit" },
  { src: "./Profile/Galeri/tim2.jpg", category: "Tim Terbit" },
  { src: "./Profile/Galeri/tim3.jpg", category: "Tim Terbit" },
  { src: "./Profile/Galeri/tim4.jpg", category: "Tim Terbit" },
  { src: "./Profile/Galeri/galeri5.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri6.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri7.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri8.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri9.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri10.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri11.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri12.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri13.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri14.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri15.JPG", category: "Sekolah" },
  { src: "./Profile/Galeri/galeri16.JPG", category: "Sekolah" },
]

const categories = ["Semua", "Tim Terbit", "Sekolah"]

const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [api] = useEmblaCarousel({ loop: true, align: 'start' })

  const filteredImages = selectedCategory === "Semua" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <section id="gallery" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">Galeri Kami</h2>
          <p className="text-gray-500 mt-4">
            Jelajahi momen-momen berkesan dalam perjalanan kami membangun inovasi
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-amber-700 text-white hover:bg-amber-800' 
                  : 'border-amber-700 text-amber-700 hover:bg-amber-700/10'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <Carousel className="w-full relative" ref={api}>
          <CarouselContent className="-ml-4">
            {filteredImages.map((image, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 p-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group h-72"
                >
                  <div className="overflow-hidden rounded-2xl shadow-lg h-full">
                    <img
                      src={image.src}
                      // alt={image.alt}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-700/90 via-amber-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium mb-1 opacity-90">{image.category}</p>
                        {/* <h3 className="text-xl font-bold">{image.alt}</h3> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-amber-700 text-amber-700 shadow-lg" />
          <CarouselNext className="right-4 bg-white/90 hover:bg-white border-amber-700 text-amber-700 shadow-lg" />
        </Carousel>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="bg-amber-700 hover:bg-amber-800 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Lihat Semua Galeri
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default GallerySection;