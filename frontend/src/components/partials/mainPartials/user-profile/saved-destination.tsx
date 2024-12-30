import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Trash2 } from 'lucide-react'

const savedDestinations = [
  { id: 1, name: "Paris, France", description: "City of Love", image: "/placeholder.svg?height=100&width=200&text=Paris" },
  { id: 2, name: "Tokyo, Japan", description: "Land of the Rising Sun", image: "/placeholder.svg?height=100&width=200&text=Tokyo" },
  { id: 3, name: "New York, USA", description: "The Big Apple", image: "/placeholder.svg?height=100&width=200&text=New+York" },
]

const SavedDestinations = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Saved Destinations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedDestinations.map((destination) => (
          <Card key={destination.id}>
            <CardHeader>
              <CardTitle>{destination.name}</CardTitle>
              <CardDescription>{destination.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={destination.image} alt={destination.name} className="w-full h-32 object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                View on Map
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SavedDestinations;

