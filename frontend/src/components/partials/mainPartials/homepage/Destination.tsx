import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDestination } from "@/hooks/use-destination";
import { IDestination } from "@/types/destination.types";
import { getImageUrl } from "@/utils/image-helper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const Destination = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined);

  const navigate = useNavigate();
  const { destinations, isLoadingDestinations } = useDestination();
  // show up to 8 destinations on homepage
  const [homeDestinations, setHomeDestinations] = useState<IDestination[]>([]);

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

  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setHomeDestinations(destinations.slice(0, 8));
    }
  }, [destinations]);

  // Helper to remove leading numeric prefixes like "1.", "01)", "9137 -", etc.
  // This will remove an initial run of digits and common separators so the visible
  // name/location doesn't start with unrelated numbers from seeded data.
  const stripLeadingNumber = (text?: string) => {
    if (!text) return "";
  // remove leading digits followed by common separators (., -, ), comma, spaces)
  return text.replace(/^\s*\d+[0-9.\-\s,#)]*\s*/u, "");
  };

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
              {(isLoadingDestinations ? Array(8).fill(null) : homeDestinations).map((destination, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group h-full">
                    <CardHeader className="p-0 overflow-hidden">
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        {destination ? (
                          <img
                            src={
                              destination.foto && destination.foto.length > 0
                                ? getImageUrl(destination.foto[0])
                                : "/placeholder.svg"
                            }
                            alt={stripLeadingNumber(destination.nama)}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-gray-100 animate-pulse" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 text-left">
                      <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-amber-800 transition-colors duration-300">
                        {destination ? stripLeadingNumber(destination.nama) : <span className="block h-5 w-48 bg-gray-200 rounded animate-pulse" />}
                      </CardTitle>
                      <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardDescription className="text-xs md:text-sm text-gray-900">
                          {destination ? stripLeadingNumber(destination.lokasi) : <span className="block h-4 w-32 bg-gray-200 rounded animate-pulse" />}
                        </CardDescription>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-xs md:text-sm border-amber-700 text-amber-700 hover:bg-amber-800 hover:text-[#EEEEEE] transition-colors duration-300 px-2 py-1 md:px-3 md:py-2"
                          onClick={() => {
                            if (!destination) return;
                            navigate(`/destination/${destination._id}`);
                          }}
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
            {(isLoadingDestinations ? Array(8).fill(null) : homeDestinations).map((_, index) => (
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

    </>
  );
}

export default Destination;