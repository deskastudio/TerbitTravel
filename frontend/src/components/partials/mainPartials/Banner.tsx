import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Banner = () => {
  // Data banner untuk di-mapping
  const banners = [
    { id: 1, src: "src/assets/Banner/banner1.jpg", alt: "Banner 1" },
    { id: 2, src: "src/assets/Banner/banner2.jpg", alt: "Banner 2" },
    { id: 3, src: "src/assets/Banner/banner3.jpg", alt: "Banner 3" },
    { id: 4, src: "src/assets/Banner/banner2.jpg", alt: "Banner 4" },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Informasi
            </h2>
            <p className="text-gray-600 mt-2">
              Here are lots of interesting destinations to visit, but don’t be
              confused—they’re already grouped by category.
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        <Carousel className="w-full mt-16 lg:mt-8 relative">
          {/* Navigation Buttons */}
          <div className="absolute z-20 -top-8 left-50 right-20 lg:-top-12 lg:left-200 lg:right-20 flex justify-between px-4">
            <CarouselPrevious className="bg-gray-200 text-gray-800 p-5 rounded-full hover:bg-gray-800 hover:text-gray-100" />
            <CarouselNext className="bg-gray-200 text-gray-800 p-5 rounded-full hover:bg-gray-800 hover:text-gray-100" />
          </div>

          {/* Carousel Content */}
          <CarouselContent className="flex space-x-6">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="w-[300px] flex-shrink-0">
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="w-full h-[300px] object-cover rounded-xl"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Banner;
