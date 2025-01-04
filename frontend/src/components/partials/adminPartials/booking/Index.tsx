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

const bookingSchema = z.object({
  id: z.string(),
  customerName: z.string().min(1, "Customer name is required"),
  tourPackage: z.string().min(1, "Tour package is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
})

type Booking = z.infer<typeof bookingSchema>

const bookings: Booking[] = [
  { id: "1", customerName: "John Doe", tourPackage: "Bali Adventure", bookingDate: "2023-07-15", status: "confirmed", totalPrice: 1000000 },
  { id: "2", customerName: "Jane Smith", tourPackage: "Jakarta City Tour", bookingDate: "2023-07-16", status: "pending", totalPrice: 500000 },
  { id: "3", customerName: "Alice Johnson", tourPackage: "Yogyakarta Cultural Experience", bookingDate: "2023-07-17", status: "cancelled", totalPrice: 750000 },
  { id: "4", customerName: "Bob Williams", tourPackage: "Lombok Beach Getaway", bookingDate: "2023-07-18", status: "confirmed", totalPrice: 1200000 },
  { id: "5", customerName: "Charlie Brown", tourPackage: "Bandung Highland Tour", bookingDate: "2023-07-19", status: "pending", totalPrice: 600000 },
]

const BookingsPage = () => {
  const [bookingsList, setBookingsList] = useState<Booking[]>(bookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Booking>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = (data: Booking) => {
    if (editingBooking) {
      setBookingsList(bookingsList.map(b => b.id === editingBooking.id ? { ...data, id: editingBooking.id } : b))
      toast({ title: "Booking updated", description: "The booking has been updated successfully." })
    } else {
      const newBooking = { ...data, id: Date.now().toString() }
      setBookingsList([...bookingsList, newBooking])
      toast({ title: "Booking added", description: "A new booking has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingBooking(null)
    reset()
  }

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setBookingsList(bookingsList.filter(booking => booking.id !== id))
    toast({ title: "Booking deleted", description: "The booking has been deleted successfully." })
  }

  const filteredBookings = bookingsList
    .filter(booking => 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourPackage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(booking => statusFilter === 'all' ? true : booking.status === statusFilter)

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
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
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Booking</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search bookings..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Tour Package</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.customerName}</TableCell>
                <TableCell>{booking.tourPackage}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>
                  {booking.totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => console.log('View details', booking.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(booking)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(booking.id)}>
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
            <DialogTitle>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</DialogTitle>
            <DialogDescription>
              {editingBooking ? 'Edit the booking details below.' : 'Add a new booking by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" {...register('customerName')} defaultValue={editingBooking?.customerName} />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <Label htmlFor="tourPackage">Tour Package</Label>
              <Input id="tourPackage" {...register('tourPackage')} defaultValue={editingBooking?.tourPackage} />
              {errors.tourPackage && <p className="text-red-500 text-sm mt-1">{errors.tourPackage.message}</p>}
            </div>
            <div>
              <Label htmlFor="bookingDate">Booking Date</Label>
              <Input id="bookingDate" type="date" {...register('bookingDate')} defaultValue={editingBooking?.bookingDate} />
              {errors.bookingDate && <p className="text-red-500 text-sm mt-1">{errors.bookingDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="totalPrice">Total Price</Label>
              <Input 
                id="totalPrice" 
                type="number" 
                {...register('totalPrice', { valueAsNumber: true })} 
                defaultValue={editingBooking?.totalPrice} 
              />
              {errors.totalPrice && <p className="text-red-500 text-sm mt-1">{errors.totalPrice.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => register('status').onChange({ target: { value } })} defaultValue={editingBooking?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
            <Button type="submit">{editingBooking ? 'Update Booking' : 'Add Booking'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingsPage;