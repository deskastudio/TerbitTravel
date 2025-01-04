'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { CalendarIcon } from 'lucide-react'

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  agency: z.string().min(1, "Agency is required"),
  description: z.string().min(1, "Description is required"),
  uploadDate: z.string(),
  status: z.enum(['uploaded', 'not uploaded']),
  displayed: z.boolean(),
})

type Testimonial = z.infer<typeof testimonialSchema>

const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    agency: 'Tech Solutions Inc.',
    description: 'Great service, highly recommended!',
    uploadDate: '2023-06-15',
    status: 'uploaded',
    displayed: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    agency: 'Creative Designs Co.',
    description: 'Excellent work and communication.',
    uploadDate: '2023-06-14',
    status: 'uploaded',
    displayed: false,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    agency: 'Marketing Experts LLC',
    description: 'Outstanding results, will use again!',
    uploadDate: '2023-06-13',
    status: 'not uploaded',
    displayed: false,
  },
]

const ReviewPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [searchTerm, setSearchTerm] = useState('')
  const [date, setDate] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Testimonial>({
    resolver: zodResolver(testimonialSchema),
  })

  const onSubmit = (data: Testimonial) => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? { ...data, id: editingTestimonial.id } : t))
      toast({ title: "Testimonial updated", description: "The testimonial has been updated successfully." })
    } else {
      const newTestimonial = { ...data, id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0] }
      setTestimonials([...testimonials, newTestimonial])
      toast({ title: "Testimonial added", description: "A new testimonial has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingTestimonial(null)
    reset()
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setTestimonials(testimonials.filter(testimonial => testimonial.id !== id))
    toast({ title: "Testimonial deleted", description: "The testimonial has been deleted successfully." })
  }

  const filteredTestimonials = testimonials
    .filter(testimonial => 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(testimonial => date ? testimonial.uploadDate === format(date, 'yyyy-MM-dd') : true)

  const paginatedTestimonials = filteredTestimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage)

  const getStatusBadge = (status: Testimonial['status']) => {
    const statusClasses = {
      uploaded: "bg-green-100 text-green-800",
      'not uploaded': "bg-yellow-100 text-yellow-800",
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status]
        }`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Testimonial</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Filter by date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>{testimonial.agency}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.description}</TableCell>
                <TableCell>{testimonial.uploadDate}</TableCell>
                <TableCell>{getStatusBadge(testimonial.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(testimonial.id)}>
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
            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            <DialogDescription>
              {editingTestimonial ? 'Edit the testimonial details below.' : 'Add a new testimonial by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue={editingTestimonial?.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="agency">Agency</Label>
              <Input id="agency" {...register('agency')} defaultValue={editingTestimonial?.agency} />
              {errors.agency && <p className="text-red-500 text-sm mt-1">{errors.agency.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} defaultValue={editingTestimonial?.description} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value as 'uploaded' | 'not uploaded')} defaultValue={editingTestimonial?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="not uploaded">Not Uploaded</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="displayed"
                checked={editingTestimonial?.displayed}
                onCheckedChange={(checked) => setValue('displayed', checked)}
              />
              <Label htmlFor="displayed">Display on website</Label>
            </div>
            <Button type="submit">{editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReviewPage;