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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { MoreHorizontal, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const bannerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
})

type Banner = z.infer<typeof bannerSchema>

const BannerTerbitPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [viewingBanner, setViewingBanner] = useState<Banner | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Banner>({
    resolver: zodResolver(bannerSchema),
  })

  const onSubmit = (data: Banner) => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...data, id: editingBanner.id } : b))
      toast({ title: "Banner updated", description: "The banner has been updated successfully." })
    } else {
      const newBanner = { ...data, id: Date.now().toString() }
      setBanners([...banners, newBanner])
      toast({ title: "Banner added", description: "A new banner has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingBanner(null)
    reset()
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id))
    toast({ title: "Banner deleted", description: "The banner has been deleted successfully." })
  }

  const handleViewDetails = (banner: Banner) => {
    setViewingBanner(banner)
  }

  const filteredBanners = banners.filter(banner => 
    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Banner</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img src={URL.createObjectURL(banner.image)} alt={banner.name} className="w-32 h-16 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{banner.name}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(banner)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(banner)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(banner.id)}>
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
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            <DialogDescription>
              {editingBanner ? 'Edit the banner details below.' : 'Add a new banner by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue={editingBanner?.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>
            <Button type="submit">{editingBanner ? 'Update Banner' : 'Add Banner'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {viewingBanner && (
        <Dialog open={!!viewingBanner} onOpenChange={() => setViewingBanner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Banner Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img src={URL.createObjectURL(viewingBanner.image)} alt={viewingBanner.name} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-bold">{viewingBanner.name}</h2>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default BannerTerbitPage;