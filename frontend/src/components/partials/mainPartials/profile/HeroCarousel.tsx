'use client'

import { motion } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ChevronDown } from 'lucide-react'
import { HERO_SLIDES } from '@/lib/constants'

const HeroSection = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    aboutSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full -mt-10">
      <Carousel className="w-full">
        <CarouselContent>
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="relative">
              <div className="relative w-full flex justify-center items-center">
                <div className="w-[1200px] h-[600px]"> {/* Fixed width and height */}
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute" />
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-[800px] px-8"
                    >
                      {/* Content can be added here */}
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Carousel Controls */}
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 z-10" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 z-10" />
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={scrollToAbout}
        >
          <ChevronDown className="w-10 h-10 text-white" />
        </motion.div>
      </Carousel>
    </section>
  )
}

export default HeroSection;