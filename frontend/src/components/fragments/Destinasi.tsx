import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PopularDestinationsCarousel() {
  const destinations = [
    { name: "Great Barrier", image: "/assets/images/great-barrier.jpg", places: 22, activities: 3, price: "$895.50" },
    { name: "Swiss Alps", image: "/assets/images/swiss-alps.jpg", places: 12, activities: 2, price: "$769.99" },
    { name: "Santorini", image: "/assets/images/santorini.jpg", places: 34, activities: 3, price: "$39.80" },
    { name: "Venice", image: "/assets/images/venice.jpg", places: 10, activities: 1, price: "$939.60" },
    { name: "Venice", image: "/assets/images/venice.jpg", places: 10, activities: 1, price: "$939.60" },
  ];

  return (
    <section className="text-center py-16 bg-white w-full">
      <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
      <p className="text-gray-600 mb-8">
        Sost Brilliant reasons Entrada should be your one-stop-shop!
      </p>

      <div className="relative w-full">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="flex gap-4 px-4">
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
                      <CardDescription className="text-sm text-gray-500">
                        {destination.places} Places | {destination.activities} Activities
                      </CardDescription>
                      <p className="text-xl font-bold mt-4">{destination.price}</p>
                    </CardContent>
                    <CardFooter className="p-4">
                      <Button variant="default" className="w-full">
                        Book Now
                      </Button>
                    </CardFooter>
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
  );
}

export default PopularDestinationsCarousel;
