'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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

const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().min(1, "Description is required"),
  photo: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
  twitter: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  email: z.string().email(),
  instagram: z.string().url().optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  isDisplayed: z.boolean(),
})

type TeamMember = z.infer<typeof teamMemberSchema>

const TeamTerbitPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TeamMember>({
    resolver: zodResolver(teamMemberSchema),
  })

  const onSubmit = (data: TeamMember) => {
    if (editingMember) {
      setTeamMembers(members => members.map(m => m.id === editingMember.id ? { ...data, id: editingMember.id } : m))
      toast({ title: "Team member updated", description: "The team member has been updated successfully." })
    } else {
      const newMember = { ...data, id: Date.now().toString() }
      setTeamMembers([...teamMembers, newMember])
      toast({ title: "Team member added", description: "A new team member has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingMember(null)
    reset()
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setTeamMembers(members => members.filter(member => member.id !== id))
    toast({ title: "Team member deleted", description: "The team member has been deleted successfully." })
  }

  const handleViewDetails = (member: TeamMember) => {
    setViewingMember(member)
  }

  const toggleDisplay = (id: string) => {
    setTeamMembers(members => members.map(member => 
      member.id === id ? { ...member, isDisplayed: !member.isDisplayed } : member
    ))
  }

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Team Member</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search team members..."
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
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <img src={URL.createObjectURL(member.photo)} alt={member.name} className="w-16 h-16 object-cover rounded-full" />
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>
                  <Switch
                    checked={member.isDisplayed}
                    onCheckedChange={() => toggleDisplay(member.id)}
                  />
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(member)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(member)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(member.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            <DialogDescription>
              {editingMember ? 'Edit the team member details below.' : 'Add a new team member by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} defaultValue={editingMember?.name} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="col-span-1">
                <Label htmlFor="position">Position</Label>
                <Input id="position" {...register('position')} defaultValue={editingMember?.position} />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} defaultValue={editingMember?.description} rows={3} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div className="col-span-1">
                <Label htmlFor="photo">Photo</Label>
                <Input id="photo" type="file" accept="image/*" {...register('photo')} />
                {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" {...register('twitter')} defaultValue={editingMember?.twitter} />
                {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter.message}</p>}
              </div>
              <div className="col-span-1">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" {...register('facebook')} defaultValue={editingMember?.facebook} />
                {errors.facebook && <p className="text-red-500 text-sm mt-1">{errors.facebook.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} defaultValue={editingMember?.email} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} defaultValue={editingMember?.phone} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="isDisplayed"
                control={control}
                defaultValue={editingMember?.isDisplayed || false}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <span className="text-sm">Display on Website</span>
            </div>
            <Button type="submit">{editingMember ? 'Update' : 'Add'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {viewingMember && (
        <Dialog open={!!viewingMember} onOpenChange={() => setViewingMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Team Member Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img src={URL.createObjectURL(viewingMember.photo)} alt={viewingMember.name} className="w-32 h-32 object-cover rounded-full mx-auto" />
              <h2 className="text-xl font-bold text-center">{viewingMember.name}</h2>
              <p className="text-center text-gray-600">{viewingMember.position}</p>
              <p className="text-sm">{viewingMember.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{viewingMember.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{viewingMember.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Twitter:</p>
                  <p>{viewingMember.twitter || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Facebook:</p>
                  <p>{viewingMember.facebook || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Instagram:</p>
                  <p>{viewingMember.instagram || 'N/A'}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default TeamTerbitPage;