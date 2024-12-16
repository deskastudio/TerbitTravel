import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MaintenanceModal from "../MaintananceModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Destination = () => {
  const destinations = [
    { name: "Great Barrier", image: "src/assets/Banner/gambar1.jpg", places: "Jakarta, Indonesia" },
    { name: "Swiss Alps", image: "src/assets/Banner/gambar2.jpg", places: "Kalimantan, Indonesia" },
    { name: "Santorini", image: "src/assets/Banner/gambar3.jpg", places: "Lampung, Indonesia" },
    { name: "Venice", image: "src/assets/Banner/gambar4.jpg", places: "Bali, Indonesia" },
    { name: "Venice", image: "src/assets/Banner/gambar2.jpg", places: "London, Ingrris" },
    { name: "Venice", image: "src/assets/Banner/gambar3.jpg", places: "Paris, Prancis" },
    { name: "Swiss Alps", image: "src/assets/Banner/gambar2.jpg", places: "Kalimantan, Indonesia" },
    { name: "Great Barrier", image: "src/assets/Banner/gambar1.jpg", places: "Jakarta, Indonesia" },
    { name: "Venice", image: "src/assets/Banner/gambar4.jpg", places: "Bali, Indonesia" },
    { name: "Santorini", image: "src/assets/Banner/gambar3.jpg", places: "Lampung, Indonesia" },

  ];

  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const openModal = () => setIsModalOpen(true); // Fungsi untuk membuka modal
  const closeModal = () => setIsModalOpen(false); // Fungsi untuk menutup modal

  return (
    <>
    <section className="text-center py-2 w-full">
      <h2 className="text-3xl font-bold mb-4 mx-2">Destinasi Populer</h2>
      <p className="text-gray-600 mb-8 mx-2">
        Temukan destinasi favorit yang paling diminati untuk perjalanan tak terlupakan.
      </p>

      <div className="relative w-full">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="flex gap-1 px-4">
            {destinations.map((destination, index) => (
              <CarouselItem key={index} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%]">
                <div className="p-2">
                  <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4 text-left">
                      <CardTitle className="text-lg font-semibold">{destination.name}</CardTitle>
                      <div className="mt-2 flex justify-between items-center gap-1">
                        <CardDescription className="text-sm text-gray-500">
                          {destination.places}
                        </CardDescription>
                        <Button variant="outline" className="w-1/2" onClick={openModal}>
                          Pesan Sekarang
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10">
            &lt;
          </CarouselPrevious>
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10">
            &gt;
          </CarouselNext>
        </Carousel>
      </div>
    </section>

    {/* Maintenance Modal */}
    {isModalOpen && <MaintenanceModal handleClose={closeModal} />}
    </>
  );
}

export default Destination;
