import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Banner = () => {
  return (
    <Carousel className="w-full h-72 md:h-96 lg:h-[500px] overflow-hidden">
      <CarouselContent className="flex">
        <CarouselItem className="w-full h-full flex-shrink-0">
          <img
            src="./src/assets/Banner/banner1.jpg" // Gunakan path absolut dari public
            alt="Slide 1"
            className="w-full h-full object-cover"
          />
        </CarouselItem>
        <CarouselItem className="w-full h-full flex-shrink-0">
          <img
            src="./src/assets/Banner/banner2.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover"
          />
        </CarouselItem>
        <CarouselItem className="w-full h-full flex-shrink-0">
          <img
            src="./src/assets/Banner/banner3.jpg"
            alt="Slide 3"
            className="w-full h-full object-cover"
          />
        </CarouselItem>
      </CarouselContent>

      {/* Tombol Previous */}
      <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 text-xl rounded-full hover:bg-gray-700">
        Prev
      </CarouselPrevious>

      {/* Tombol Next */}
      <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 text-xl rounded-full hover:bg-gray-700">
        Next
      </CarouselNext>
    </Carousel>
  );
};

export default Banner;
