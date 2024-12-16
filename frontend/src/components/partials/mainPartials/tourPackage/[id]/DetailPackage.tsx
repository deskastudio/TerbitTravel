import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'

type TourPackage = {
  id: string
  name: string
  destination: string
  duration: string
  price: number
  description: string
  availability: "Available" | "Limited" | "Sold Out"
  category: "Popular" | "Promo" | "Flash Sale"
  itinerary: string[]
  included: string[]
  notIncluded: string[]
}

const tourPackages: TourPackage[] = [
    {
      id: "1",
      name: "Paris Getaway",
      destination: "Paris, France",
      duration: "7 days",
      price: 1299,
      description: "Experience the magic of Paris with this 7-day tour package. Visit iconic landmarks, indulge in exquisite cuisine, and immerse yourself in the romantic atmosphere of the City of Light.",
      availability: "Available",
      category: "Popular",
      itinerary: [
        "Day 1: Arrival and welcome dinner",
        "Day 2: Eiffel Tower and Seine River cruise",
        "Day 3: Louvre Museum and Montmartre",
        "Day 4: Versailles Palace day trip",
        "Day 5: Notre-Dame Cathedral and Latin Quarter",
        "Day 6: Free day for shopping and exploration",
        "Day 7: Departure"
      ],
      included: [
        "6 nights accommodation",
        "Daily breakfast",
        "Welcome dinner",
        "Guided tours",
        "Skip-the-line tickets to major attractions",
        "Seine River cruise",
        "Transportation for scheduled activities"
      ],
      notIncluded: [
        "Flights to/from Paris",
        "Travel insurance",
        "Personal expenses",
        "Optional activities",
        "Meals not mentioned in the itinerary"
      ]
    },
    {
      id: "2",
      name: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      duration: "10 days",
      price: 2499,
      description: "Immerse yourself in Japanese culture with this 10-day Tokyo adventure. Explore the vibrant city, visit historical sites, and savor authentic Japanese cuisine.",
      availability: "Limited",
      category: "Promo",
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
        "Day 10: Departure"
      ],
      included: [
        "9 nights accommodation",
        "Daily breakfast",
        "Professional guide",
        "Local transportation",
        "Mt. Fuji day trip",
        "Entry tickets to attractions"
      ],
      notIncluded: [
        "Flights to/from Tokyo",
        "Travel insurance",
        "Meals other than breakfast",
        "Personal expenses"
      ]
    },
    {
      id: "3",
      name: "New York City Explorer",
      destination: "New York, USA",
      duration: "5 days",
      price: 999,
      description: "Discover the Big Apple with this action-packed 5-day tour. Visit iconic landmarks, enjoy Broadway shows, and explore diverse neighborhoods.",
      availability: "Available",
      category: "Flash Sale",
      itinerary: [
        "Day 1: Arrival and Times Square",
        "Day 2: Statue of Liberty and Ellis Island",
        "Day 3: Central Park and Museum Mile",
        "Day 4: Broadway show and 5th Avenue shopping",
        "Day 5: Departure"
      ],
      included: [
        "4 nights accommodation",
        "Daily breakfast",
        "Entry tickets to landmarks",
        "Broadway show ticket",
        "Local guide services"
      ],
      notIncluded: [
        "Flights to/from New York",
        "Travel insurance",
        "Meals not mentioned in the itinerary",
        "Optional tours"
      ]
    },
    {
      id: "4",
      name: "Rome & Vatican Tour",
      destination: "Rome, Italy",
      duration: "6 days",
      price: 1199,
      description: "Explore the Eternal City and Vatican with this 6-day Italian adventure. Discover historical landmarks, art, and world-famous Italian cuisine.",
      availability: "Sold Out",
      category: "Popular",
      itinerary: [
        "Day 1: Arrival and welcome dinner",
        "Day 2: Colosseum and Roman Forum tour",
        "Day 3: Vatican Museums and St. Peter's Basilica",
        "Day 4: Day trip to Florence",
        "Day 5: Free day for exploration",
        "Day 6: Departure"
      ],
      included: [
        "5 nights accommodation",
        "Daily breakfast",
        "Welcome dinner",
        "Professional guide",
        "Vatican Museums entry",
        "Day trip transportation"
      ],
      notIncluded: [
        "Flights to/from Rome",
        "Travel insurance",
        "Meals other than breakfast",
        "Optional tours"
      ]
    },
    {
      id: "5",
      name: "Bali Beach Retreat",
      destination: "Bali, Indonesia",
      duration: "8 days",
      price: 1599,
      description: "Relax on beautiful beaches and explore Balinese culture in this 8-day package. Enjoy serene landscapes, vibrant markets, and delicious food.",
      availability: "Available",
      category: "Promo",
      itinerary: [
        "Day 1: Arrival and beach relaxation",
        "Day 2: Ubud cultural tour",
        "Day 3: Tanah Lot and Uluwatu temples",
        "Day 4: Snorkeling and water activities",
        "Day 5: Day trip to Nusa Penida",
        "Day 6: Balinese cooking class",
        "Day 7: Spa and wellness day",
        "Day 8: Departure"
      ],
      included: [
        "7 nights accommodation",
        "Daily breakfast",
        "Cultural tours",
        "Water activities",
        "Cooking class",
        "Airport transfers"
      ],
      notIncluded: [
        "Flights to/from Bali",
        "Travel insurance",
        "Lunch and dinner",
        "Personal expenses"
      ]
    }
  ];
  

export default function TourPackageDetails() {
  const { id } = useParams<{ id: string }>()
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const packageData = tourPackages.find(p => p.id === id)
    setTourPackage(packageData || null)
  }, [id])

  if (!tourPackage) {
    return <div>Tour package not found</div>
  }

  return (
    <>
      {/* Back Button */}
      <div className="flex items-center mb-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon size={18} />
          Back
        </Button>
      </div>

      {/* Tour Package Details */}
      <Card className="mb-8 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{tourPackage.name}</CardTitle>
          <CardDescription className="text-xl text-gray-600">{tourPackage.destination}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Badge variant="outline" className="text-sm flex items-center gap-1">
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
          <p className="text-lg text-gray-700 mb-4">{tourPackage.description}</p>
          <div className="text-3xl font-semibold text-primary mb-4">Price: ${tourPackage.price}</div>
        </CardContent>
        <CardFooter>
        <Button size="lg">Book Now</Button>
        </CardFooter>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="included">What's Included</TabsTrigger>
          <TabsTrigger value="not-included">Not Included</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {tourPackage.itinerary.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="included">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {tourPackage.included.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="not-included">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Not Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {tourPackage.notIncluded.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
