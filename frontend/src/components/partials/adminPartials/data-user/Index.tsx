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

const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  instansi: z.string().min(1, "Instansi is required"),
  status: z.enum(['verified', 'unverified', 'incomplete_profile']),
})

type User = z.infer<typeof userSchema>

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", instansi: "ABC Corp", status: "verified" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", instansi: "XYZ Inc", status: "unverified" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", instansi: "123 Ltd", status: "incomplete_profile" },
]

const DataUserPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset } = useForm<User>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = (data: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...data, id: editingUser.id } : u))
      toast({ title: "User updated", description: "The user has been updated successfully." })
    } else {
      const newUser = { ...data, id: Date.now().toString() }
      setUsers([...users, newUser])
      toast({ title: "User added", description: "A new user has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingUser(null)
    reset()
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
    toast({ title: "User deleted", description: "The user has been deleted successfully." })
  }

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.instansi.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => statusFilter === 'all' ? true : user.status === statusFilter)

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getStatusBadge = (status: User['status']) => {
    const statusClasses = {
      verified: "bg-green-100 text-green-800",
      unverified: "bg-yellow-100 text-yellow-800",
      incomplete_profile: "bg-red-100 text-red-800",
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status]
        }`}
      >
        {status.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add User</Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
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
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="incomplete_profile">Incomplete Profile</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Instansi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.instansi}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => console.log('View details', user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Edit the user details below.' : 'Add a new user by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue={editingUser?.name} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} defaultValue={editingUser?.email} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="instansi">Instansi</Label>
              <Input id="instansi" {...register('instansi')} defaultValue={editingUser?.instansi} />
              {errors.instansi && <p className="text-red-500 text-sm mt-1">{errors.instansi.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => register('status').onChange({ target: { value } })} defaultValue={editingUser?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="incomplete_profile">Incomplete Profile</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
            <Button type="submit">{editingUser ? 'Update User' : 'Add User'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataUserPage;