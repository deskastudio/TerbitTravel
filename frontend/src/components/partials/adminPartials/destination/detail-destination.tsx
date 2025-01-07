import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ClockIcon, MapPinIcon, Settings2, UsersIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const DetailDestinationPage = () => {
  const [activeTab, setActiveTab] = useState('itinerary'); // Menyimpan tab yang aktif

  const tourPackage = {
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    duration: "10 days",
    availability: "Limited",
    price: "$2499",
    itinerary: [
      "Day 1: Arrival in Tokyo and orientation",
      "Day 2: Visit to Asakusa and Tokyo Skytree",
      "Day 3: Day trip to Mt. Fuji",
      "Day 4: Explore Akihabara and Shibuya",
      "Day 5: Traditional tea ceremony experience",
      "Day 6: Tour of Kyoto temples",
      "Day 7: Nara deer park visit",
      "Day 8: Osaka castle tour",
      "Day 9: Shopping in Ginza",
    ],
    included: [
      "Hotel accommodations for 9 nights",
      "Daily breakfast and dinner",
      "Transportation during the tour",
      "English-speaking tour guide",
    ],
    notIncluded: [
      "International airfare",
      "Lunches and personal expenses",
      "Travel insurance",
      "Optional activities",
    ],
  };

  const images = [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ];

  const thumbnails = images.map((image) => image.replace('400', '100').replace('600', '100'));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'itinerary':
        return (
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {tourPackage.itinerary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      case 'included':
        return (
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {tourPackage.included.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      case 'notIncluded':
        return (
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {tourPackage.notIncluded.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square border rounded-lg shadow-lg overflow-hidden">
            <Carousel className="w-full relative">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover border border-gray-300 rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-40 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer" />
              <CarouselNext className="absolute top-40 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer" />
            </Carousel>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="rounded-md border-2 border-gray-300 cursor-pointer hover:border-primary transition-all"
                width={80}
                height={80}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Tour Details */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tourPackage.title}</h1>
            <p className="text-base md:text-lg text-gray-600">{tourPackage.destination}</p>
            <div className="flex items-center flex-wrap gap-2 mt-4">
              <Badge className="text-sm flex items-center gap-1">
                <ClockIcon size={16} />
                {tourPackage.duration}
              </Badge>
              <Badge variant="outline" className="text-sm flex items-center gap-1">
                <MapPinIcon size={16} />
                {tourPackage.destination}
              </Badge>
              <Badge variant="outline" className="text-sm flex items-center gap-1">
                <UsersIcon size={16} />
                Group tour
              </Badge>
              <Badge
                variant={
                  tourPackage.availability === "Available"
                    ? "default"
                    : tourPackage.availability === "Limited"
                    ? "secondary"
                    : "destructive"
                }
              >
                {tourPackage.availability}
              </Badge>
            </div>
            <p className="mt-4 text-gray-700">
              Immerse yourself in Japanese culture with this {tourPackage.duration} Tokyo adventure. Explore the vibrant city, visit historical sites, and savor authentic Japanese cuisine.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xl md:text-2xl font-bold text-gray-900">Price: {tourPackage.price}</p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center gap-4 border-b pb-2">
              {['itinerary', 'included', 'notIncluded'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm md:text-lg font-semibold pb-2 ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {tab === "itinerary"
                    ? "Itinerary"
                    : tab === "included"
                    ? "What's Included"
                    : "Not Included"}
                </button>
              ))}
            </div>
            <div className="mt-4">{renderTabContent()}</div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full bg-gray-700 text-white"
      >
        <Settings2 className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default DetailDestinationPage;
