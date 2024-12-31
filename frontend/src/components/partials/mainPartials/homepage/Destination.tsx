import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import MaintenanceModal from "../MaintananceModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const Destination = () => {
  const destinations = [
    { name: "Candi Prambanan", image: "./Beranda/Destinasi/candiprambanan.jpg", places: "Jogjakarta, Indonesia" },
    { name: "Dieng", image: "./Beranda/Destinasi/dieng.jpg", places: "Wonosobo, Indonesia" },
    { name: "Lawang Sewu", image: "./Beranda/Destinasi/lawangsewu.jpg", places: "Semarang, Indonesia" },
    { name: "Pantai Melasti", image: "./Beranda/Destinasi/pantai melasti.jpg", places: "Bali, Indonesia" },
    { name: "Pantai Pandawa", image: "./Beranda/Destinasi/pantaipandawa.png", places: "Bali, Inggris" },
    { name: "Pasir Berbisik", image: "./Beranda/Destinasi/pasirberbisik.jpg", places: "Bromo, Indonesia" },
    { name: "Tanah Lot", image: "./Beranda/Destinasi/tanahlot.jpg", places: "Bali, Indonesia" },
    { name: "Tebing Breksi", image: "./Beranda/Destinasi/tebingbreksi.jpg", places: "Jogjakarta, Indonesia" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <>
      <section className="py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-[#4A4947]">
            Destinasi Populer
          </h2>
          <p className="text-[#4A4947]/70 mb-8 max-w-2xl mx-auto">
            Temukan destinasi favorit yang paling diminati untuk perjalanan tak terlupakan.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="relative w-full px-4">
          <Carousel opts={{ align: "start" }} className="w-full" setApi={setCarouselApi}>
            <CarouselContent>
              {destinations.map((destination, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group h-full">
                    <CardHeader className="p-0 overflow-hidden">
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 text-left">
                      <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-amber-800 transition-colors duration-300">
                        {destination.name}
                      </CardTitle>
                      <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardDescription className="text-xs md:text-sm text-gray-900">
                          {destination.places}
                        </CardDescription>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-xs md:text-sm border-amber-700 text-amber-700 hover:bg-amber-800 hover:text-[#EEEEEE] transition-colors duration-300 px-2 py-1 md:px-3 md:py-2"
                          onClick={openModal}
                        >
                          Pesan Sekarang
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-full shadow-md" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-full shadow-md" />
          </Carousel>
          {/* Indikator Carousel */}
          <div className="mt-4 flex justify-center md:hidden">
            {destinations.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentSlide ? 'bg-amber-800' : 'bg-gray-400'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Modal */}
      {isModalOpen && <MaintenanceModal handleClose={closeModal} />}
    </>
  );
}

export default Destination;