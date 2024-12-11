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
    <section className="py-10 relative bg-gray-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-10 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-0 right-20 w-48 h-48 bg-pink-400 rounded-full opacity-30 blur-xl"></div>

      <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 relative z-10">
        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Informasi
            </h2>
            <p className="text-gray-600 mt-2">
              Dapatkan informasi terkini dan temukan berbagai pilihan destinasi menarik yang telah kami siapkan untuk pengalaman perjalanan Anda.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <Carousel className="w-full mt-16 lg:mt-8 relative">
          {/* Navigation Buttons */}
          <div className="absolute z-20 -top-8 left-50 right-20 lg:-top-12 lg:left-200 lg:right-20 flex justify-between px-4">
            <CarouselPrevious className="bg-gray-200 text-gray-800 p-5 rounded-full hover:bg-gray-800 hover:text-gray-100" />
            <CarouselNext className="bg-gray-200 text-gray-800 p-5 rounded-full hover:bg-gray-800 hover:text-gray-100" />
          </div>

          {/* Carousel Content */}
          <CarouselContent className="flex space-x-6">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="flex-shrink-0 w-full">
                <div className="w-full aspect-[16/9]">
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Banner;
