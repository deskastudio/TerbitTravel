'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { MoreHorizontal, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const tourPackageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  destination: z.string().min(1, "Destination is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.string().min(1, "Duration is required"),
  status: z.enum(['available', 'booked', 'in_progress', 'completed']),
})

type TourPackage = z.infer<typeof tourPackageSchema>

const tourPackages: TourPackage[] = [
  { id: "1", name: "Bali Adventure", destination: "Bali", price: 1000000, duration: "3 days", status: "available" },
  { id: "2", name: "Jakarta City Tour", destination: "Jakarta", price: 500000, duration: "1 day", status: "booked" },
  { id: "3", name: "Yogyakarta Cultural Experience", destination: "Yogyakarta", price: 750000, duration: "2 days", status: "available" },
  { id: "4", name: "Lombok Beach Getaway", destination: "Lombok", price: 1200000, duration: "4 days", status: "in_progress" },
  { id: "5", name: "Bandung Highland Tour", destination: "Bandung", price: 600000, duration: "2 days", status: "completed" },
]

const TourPackagePage = () => {
  const [packages, setPackages] = useState<TourPackage[]>(tourPackages)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TourPackage>({
    resolver: zodResolver(tourPackageSchema),
  })

  const onSubmit = (data: TourPackage) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...data, id: editingPackage.id } : p))
      toast({ title: "Tour package updated", description: "The tour package has been updated successfully." })
    } else {
      const newPackage = { ...data, id: Date.now().toString() }
      setPackages([...packages, newPackage])
      toast({ title: "Tour package added", description: "A new tour package has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingPackage(null)
    reset()
  }

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id))
    toast({ title: "Tour package deleted", description: "The tour package has been deleted successfully." })
  }

  const filteredPackages = packages
    .filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(pkg => statusFilter === 'all' ? true : pkg.status === statusFilter)

  const paginatedPackages = filteredPackages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      available: "bg-green-100 text-green-800",
      booked: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status as keyof typeof statusClasses]
        }`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tour Packages</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Tour Package</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search tour packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>
                  {pkg.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => console.log('View details', pkg.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex-1 text-center text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Tour Package' : 'Add New Tour Package'}</DialogTitle>
            <DialogDescription>
              {editingPackage ? 'Edit the tour package details below.' : 'Add a new tour package by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue={editingPackage?.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...register('destination')} defaultValue={editingPackage?.destination} />
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                {...register('price', { valueAsNumber: true })} 
                defaultValue={editingPackage?.price} 
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...register('duration')} defaultValue={editingPackage?.duration} />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => register('status').onChange({ target: { value } })} defaultValue={editingPackage?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
            <Button type="submit">{editingPackage ? 'Update Tour Package' : 'Add Tour Package'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TourPackagePage;