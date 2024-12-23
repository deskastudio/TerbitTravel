import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTablePagination } from "./data-table-pagination"

type TourPackage = {
  id: string
  name: string
  destination: string
  duration: string
  price: number
  description: string
  availability: "Available" | "Limited" | "Sold Out"
  category: "Popular" | "Promo" | "Flash Sale"
}

const allTourPackages: TourPackage[] = [
  {
    id: "1",
    name: "Paris Getaway",
    destination: "Paris, France",
    duration: "7 days",
    price: 1299,
    description: "Experience the magic of Paris with this 7-day tour package.",
    availability: "Available",
    category: "Popular",
  },
  {
    id: "2",
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    duration: "10 days",
    price: 2499,
    description: "Immerse yourself in Japanese culture with this 10-day Tokyo adventure.",
    availability: "Limited",
    category: "Promo",
  },
  {
    id: "3",
    name: "New York City Explorer",
    destination: "New York, USA",
    duration: "5 days",
    price: 999,
    description: "Discover the Big Apple with this action-packed 5-day tour.",
    availability: "Available",
    category: "Flash Sale",
  },
  {
    id: "4",
    name: "Rome & Vatican Tour",
    destination: "Rome, Italy",
    duration: "6 days",
    price: 1199,
    description: "Explore the Eternal City and Vatican with this 6-day Italian adventure.",
    availability: "Sold Out",
    category: "Popular",
  },
  {
    id: "5",
    name: "Bali Beach Retreat",
    destination: "Bali, Indonesia",
    duration: "8 days",
    price: 1599,
    description: "Relax on beautiful beaches and explore Balinese culture in this 8-day package.",
    availability: "Available",
    category: "Promo",
  },
  // Add more tour packages here...
]

export default function TourPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>(allTourPackages)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("all")
  const packagesPerPage = 6
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const destination = searchParams.get('destination')
    const date = searchParams.get('date')
    const travelers = searchParams.get('travelers')

    let filteredPackages = allTourPackages

    if (destination) {
      filteredPackages = filteredPackages.filter(pkg =>
        pkg.destination.toLowerCase().includes(destination.toLowerCase())
      )
    }

    // Add complex filtering logic if needed
    console.log('Selected date:', date)
    console.log('Number of travelers:', travelers)

    setPackages(filteredPackages)
  }, [location.search])

  const filterPackages = (packages: TourPackage[]) => {
    return packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const sortPackages = (packages: TourPackage[]) => {
    return [...packages].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
  }

  const getPagedPackages = (packages: TourPackage[]) => {
    const startIndex = (currentPage - 1) * packagesPerPage
    return packages.slice(startIndex, startIndex + packagesPerPage)
  }

  const filteredPackages = filterPackages(packages)
  const sortedPackages = sortPackages(filteredPackages)
  const pagedPackages = getPagedPackages(sortedPackages)

  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)

  return (
    <div className="space-y-6 mx-2">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Paket Wisata</h1>
        <p className="text-xl text-gray-600">Discover the world's most breathtaking locations and unforgettable experiences</p>
      </div>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white"
        />
        <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="promo">Promo</TabsTrigger>
          <TabsTrigger value="flash-sale">Flash Sale</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PackageGrid packages={pagedPackages} />
        </TabsContent>
        <TabsContent value="popular">
          <PackageGrid packages={pagedPackages.filter(pkg => pkg.category === "Popular")} />
        </TabsContent>
        <TabsContent value="promo">
          <PackageGrid packages={pagedPackages.filter(pkg => pkg.category === "Promo")} />
        </TabsContent>
        <TabsContent value="flash-sale">
          <PackageGrid packages={pagedPackages.filter(pkg => pkg.category === "Flash Sale")} />
        </TabsContent>
      </Tabs>

      <DataTablePagination
        table={{
          getState: () => ({ pagination: { pageIndex: currentPage - 1, pageSize: packagesPerPage } }),
          setPageIndex: (index: number) => setCurrentPage(index + 1),
          getPageCount: () => totalPages,
          getCanPreviousPage: () => currentPage > 1,
          getCanNextPage: () => currentPage < totalPages,
          previousPage: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
          nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
        }}
      />
    </div>
  )
}

function PackageGrid({ packages }: { packages: TourPackage[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
            <CardDescription>{pkg.destination}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{pkg.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold">${pkg.price}</span>
              <Badge variant={pkg.availability === "Available" ? "default" : pkg.availability === "Limited" ? "secondary" : "destructive"}>
                {pkg.availability}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-muted-foreground">{pkg.duration}</span>
            <Button variant="outline" asChild>
              <Link to={`/tour-packages/${pkg.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
