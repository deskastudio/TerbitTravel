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

const galleryItemSchema = z.object({
  id: z.string(),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
})

type GalleryItem = z.infer<typeof galleryItemSchema>

const categories = [
  { id: '1', name: 'Category 1' },
  { id: '2', name: 'Category 2' },
  { id: '3', name: 'Category 3' },
]

const GalleryTerbitPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const itemsPerPage = 10

  const { register, handleSubmit, formState: { errors }, reset } = useForm<GalleryItem>({
    resolver: zodResolver(galleryItemSchema),
  })

  const onSubmit = (data: GalleryItem) => {
    if (editingItem) {
      setGalleryItems(items => items.map(item => item.id === editingItem.id ? { ...data, id: editingItem.id } : item))
      toast({ title: "Gallery item updated", description: "The gallery item has been updated successfully." })
    } else {
      const newItem = { ...data, id: Date.now().toString() }
      setGalleryItems([...galleryItems, newItem])
      toast({ title: "Gallery item added", description: "A new gallery item has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingItem(null)
    reset()
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setGalleryItems(items => items.filter(item => item.id !== id))
    toast({ title: "Gallery item deleted", description: "The gallery item has been deleted successfully." })
  }

  const handleViewDetails = (item: GalleryItem) => {
    // Implement view details functionality
    console.log('View gallery item details', item)
  }

  const filteredItems = galleryItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => !selectedCategory || item.category === selectedCategory)

  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Gallery Item</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={URL.createObjectURL(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{categories.find(c => c.id === item.category)?.name}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Edit the gallery item details below.' : 'Add a new gallery item by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue={editingItem?.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} defaultValue={editingItem?.description} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => register('category').onChange({ target: { value } })} defaultValue={editingItem?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>
            <Button type="submit">{editingItem ? 'Update Gallery Item' : 'Add Gallery Item'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GalleryTerbitPage;