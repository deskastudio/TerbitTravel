import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Banner = () => {
  const banners = [
    { id: 1, src: "src/assets/Banner/banner3.png", alt: "Banner 1" },
    { id: 2, src: "src/assets/Banner/banner4.png", alt: "Banner 2" },
    { id: 3, src: "src/assets/Banner/banner5.png", alt: "Banner 3" },
    { id: 4, src: "src/assets/Banner/banner6.png", alt: "Banner 4" },
  ];

  return (
    <section className="py-6 md:py-10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-4 md:left-10 w-16 md:w-24 h-16 md:h-24 bg-blue-400 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-0 right-8 md:right-20 w-32 md:w-48 h-32 md:h-48 bg-pink-400 rounded-full opacity-30 blur-xl"></div>

      <div className="container mx-auto max-w-[1280px] px-4 relative z-10">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#4A4947]">
              Informasi
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Dapatkan informasi terkini dan temukan berbagai pilihan destinasi menarik yang telah kami siapkan untuk pengalaman perjalanan Anda.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {banners.map((banner) => (
                <CarouselItem key={banner.id} className="pl-2 md:pl-4">
                  <div className="relative aspect-[16/9] w-full">
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      className="w-full h-full object-cover rounded-lg md:rounded-xl"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 border-0" />
            <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 border-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Banner;