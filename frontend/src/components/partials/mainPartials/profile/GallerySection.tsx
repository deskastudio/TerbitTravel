"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Gambar galeri
const galleryImages = [
  { src: "/placeholder.svg?height=400&width=600", alt: "Office space" },
  { src: "/placeholder.svg?height=400&width=600", alt: "Team meeting" },
  { src: "/placeholder.svg?height=400&width=600", alt: "Product showcase" },
  { src: "/placeholder.svg?height=400&width=600", alt: "Company event" },
  { src: "/placeholder.svg?height=400&width=600", alt: "Awards ceremony" },
  { src: "/placeholder.svg?height=400&width=600", alt: "Innovation lab" },
]

const GallerySection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={400}
                        className="rounded-lg object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

export default GallerySection;
