'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { MoreHorizontal, Pencil, Trash2, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

const licenseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
  pdf: z.instanceof(File).refine((file) => file.size <= 10000000, `Max PDF size is 10MB.`),
})

type License = z.infer<typeof licenseSchema>

const LicencesTerbitPage = () => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLicense, setEditingLicense] = useState<License | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset } = useForm<License>({
    resolver: zodResolver(licenseSchema),
  })

  const onSubmit = (data: License) => {
    if (editingLicense) {
      setLicenses(licenses.map(l => l.id === editingLicense.id ? { ...data, id: editingLicense.id } : l))
      toast({ title: "License updated", description: "The license has been updated successfully." })
    } else {
      const newLicense = { ...data, id: Date.now().toString() }
      setLicenses([...licenses, newLicense])
      toast({ title: "License added", description: "A new license has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingLicense(null)
    reset()
  }

  const handleEdit = (license: License) => {
    setEditingLicense(license)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id))
    toast({ title: "License deleted", description: "The license has been deleted successfully." })
  }

  const handleViewDetails = (license: License) => {
    // Implement view details functionality
    console.log('View license details', license)
  }

  const filteredLicenses = licenses.filter(license => 
    license.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedLicenses = filteredLicenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Licenses</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add License</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search licenses..."
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
              <TableHead>Screenshot</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLicenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell>
                  <img src={URL.createObjectURL(license.image)} alt={license.title} className="w-16 h-16 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{license.title}</TableCell>
                <TableCell>{license.description}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(license)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(license)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(URL.createObjectURL(license.pdf), '_blank')}>
                        <FileText className="mr-2 h-4 w-4" />
                        View PDF
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(license.id)}>
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
            <DialogTitle>{editingLicense ? 'Edit License' : 'Add New License'}</DialogTitle>
            <DialogDescription>
              {editingLicense ? 'Edit the license details below.' : 'Add a new license by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} defaultValue={editingLicense?.title} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} defaultValue={editingLicense?.description} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>
            <div>
              <Label htmlFor="pdf">PDF</Label>
              <Input id="pdf" type="file" accept=".pdf" {...register('pdf')} />
              {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf.message}</p>}
            </div>
            <Button type="submit">{editingLicense ? 'Update License' : 'Add License'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LicencesTerbitPage;