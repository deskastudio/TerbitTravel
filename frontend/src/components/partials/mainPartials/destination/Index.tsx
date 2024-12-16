"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, DollarSign, Star, Globe } from 'lucide-react'
import { Link } from "react-router-dom"

type Tour = {
  id: string
  name: string
  destination: string
  duration: string
  price: number
  rating: number
  image: string
  continent: "Europe" | "Asia" | "North America" | "South America" | "Africa" | "Oceania"
}

const tours: Tour[] = [
  {
    id: "1",
    name: "Parisian Wonders",
    destination: "Paris, France",
    duration: "7 days",
    price: 1299,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    continent: "Europe",
  },
  {
    id: "2",
    name: "Tokyo Odyssey",
    destination: "Tokyo, Japan",
    duration: "10 days",
    price: 2499,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    continent: "Asia",
  },
  {
    id: "3",
    name: "New York Adventure",
    destination: "New York, USA",
    duration: "5 days",
    price: 999,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    continent: "North America",
  },
  {
    id: "4",
    name: "Roman Holiday",
    destination: "Rome, Italy",
    duration: "6 days",
    price: 1199,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    continent: "Europe",
  },
  {
    id: "5",
    name: "Bali Bliss",
    destination: "Bali, Indonesia",
    duration: "8 days",
    price: 1599,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    continent: "Asia",
  },
  {
    id: "6",
    name: "Greek Island Hopping",
    destination: "Greek Islands, Greece",
    duration: "12 days",
    price: 2199,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    continent: "Europe",
  },
]

export default function DestinationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [activeContinent, setActiveContinent] = useState<string>("all")

  const filteredTours = tours.filter(
    (tour) =>
      (tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase())) &&
      tour.price >= priceRange[0] && tour.price <= priceRange[1] &&
      (activeContinent === "all" || tour.continent === activeContinent)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Amazing Destinations</h1>
        <p className="text-xl text-gray-600">Discover the world's most breathtaking locations and unforgettable experiences</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search tours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <div className="flex-1 space-y-2">
          <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
          <Slider
            min={0}
            max={3000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
      </div>

      <Tabs value={activeContinent} onValueChange={setActiveContinent} className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Destinations</TabsTrigger>
          <TabsTrigger value="Europe">Europe</TabsTrigger>
          <TabsTrigger value="Asia">Asia</TabsTrigger>
          <TabsTrigger value="North America">North America</TabsTrigger>
          <TabsTrigger value="South America">South America</TabsTrigger>
          <TabsTrigger value="Africa">Africa</TabsTrigger>
          <TabsTrigger value="Oceania">Oceania</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No tours found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find more tours.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden">
              <img src={tour.image} alt={tour.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{tour.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.destination}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>${tour.price}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{tour.rating.toFixed(1)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/tour-packages/${tour.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
