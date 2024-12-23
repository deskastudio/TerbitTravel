'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const HeroCarousel = () => {
  const slides = [
    { image: "src/assets/Banner/banner3.png", alt:"Banner2" },
    { image: "src/assets/Banner/banner2.png", alt:"Banner2"},
    { image: "src/assets/Banner/banner1.png", alt:"Banner1" },
  ]

  return (
    <Carousel className="w-full max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="carousel-item">
            <div className="relative h-[400px] w-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800/70 p-2 rounded-full">
        <span className="text-white">&larr;</span>
      </CarouselPrevious>
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800/70 p-2 rounded-full">
        <span className="text-white">&rarr;</span>
      </CarouselNext>
    </Carousel>
  )
}

export default HeroCarousel
