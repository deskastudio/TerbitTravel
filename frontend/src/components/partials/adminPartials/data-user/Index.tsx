import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash, Eye, Search, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddUserForm from "./add-user";
import EditUserForm from "./edit-user";
import UserDetails from "./detail-user";
import { User, UserStatus, UserFilter, AddUserFormData, EditUserFormData } from '@/types/User';

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", instansi: "ABC Corp", status: "verified" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", instansi: "XYZ Inc", status: "unverified" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", instansi: "123 Ltd", status: "incomplete_profile" },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filter, setFilter] = useState<UserFilter>({
    searchTerm: "",
    statusFilter: "all"
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        user.instansi.toLowerCase().includes(filter.searchTerm.toLowerCase())
    )
    .filter((user) => (filter.statusFilter === "all" ? true : user.status === filter.statusFilter));

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const updateUserStatus = (id: string, newStatus: UserStatus) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    );
  };

  const addUser = (newUser: AddUserFormData) => {
    const id = (users.length + 1).toString();
    setUsers([...users, { ...newUser, id }]);
  };

  const editUser = (updatedUser: EditUserFormData & { id: string }) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
    setEditingUser(null);
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusClasses = {
      verified: "bg-green-100 text-green-800",
      unverified: "bg-yellow-100 text-yellow-800",
      incomplete_profile: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusClasses[status]
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={filter.searchTerm}
            onChange={(e) => setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Select 
            value={filter.statusFilter} 
            onValueChange={(value) => setFilter((prev) => ({ ...prev, statusFilter: value as UserStatus | 'all' }))}
          >
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <AddUserForm onSubmit={addUser} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Instansi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
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
                      <DropdownMenuItem onClick={() => setViewingUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteUser(user.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Select
                          value={user.status}
                          onValueChange={(newStatus) => updateUserStatus(user.id, newStatus as UserStatus)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="unverified">Unverified</SelectItem>
                            <SelectItem value="incomplete_profile">Incomplete Profile</SelectItem>
                          </SelectContent>
                        </Select>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <EditUserForm user={editingUser} onSubmit={editUser} />
          </DialogContent>
        </Dialog>
      )}
      {viewingUser && (
        <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <UserDetails user={viewingUser} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagementPage;

