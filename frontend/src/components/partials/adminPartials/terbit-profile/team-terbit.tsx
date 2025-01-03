import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

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
});

type TeamMember = z.infer<typeof teamMemberSchema>;

const TeamTerbitPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const itemsPerPage = 5;

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TeamMember>({
    resolver: zodResolver(teamMemberSchema),
  });

  const onSubmit = (data: TeamMember) => {
    if (editingMember) {
      setTeamMembers(members => members.map(m => m.id === editingMember.id ? { ...data, id: editingMember.id } : m));
      toast({ title: "Team member updated", description: "The team member has been updated successfully." });
    } else {
      const newMember = { ...data, id: Date.now().toString() };
      setTeamMembers([...teamMembers, newMember]);
      toast({ title: "Team member added", description: "A new team member has been added successfully." });
    }
    setIsAddModalOpen(false);
    setEditingMember(null);
    reset();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(members => members.filter(member => member.id !== id));
    toast({ title: "Team member deleted", description: "The team member has been deleted successfully." });
  };

  const handleViewDetails = (member: TeamMember) => {
    setViewingMember(member);
  };

  const toggleDisplay = (id: string) => {
    setTeamMembers(members => members.map(member => 
      member.id === id ? { ...member, isDisplayed: !member.isDisplayed } : member
    ));
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
         <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input id="name" {...register('name')} defaultValue={editingMember?.name} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className="col-span-1">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                  <Input id="position" {...register('position')} defaultValue={editingMember?.position} />
                  {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea id="description" {...register('description')} defaultValue={editingMember?.description} rows={3} />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
                <div className="col-span-1">
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                  <Input id="photo" type="file" accept="image/*" {...register('photo')} />
                  {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                  <Input id="twitter" {...register('twitter')} defaultValue={editingMember?.twitter} />
                  {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter.message}</p>}
                </div>
                <div className="col-span-1">
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
                  <Input id="facebook" {...register('facebook')} defaultValue={editingMember?.facebook} />
                  {errors.facebook && <p className="text-red-500 text-sm mt-1">{errors.facebook.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input id="email" type="email" {...register('email')} defaultValue={editingMember?.email} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
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
              <div className="mt-4 flex justify-end">
                <Button type="submit">{editingMember ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <img src={URL.createObjectURL(member.photo)} alt={member.name} className="w-16 h-16 object-cover rounded-full" />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.position}</TableCell>
              <TableCell>
                <Switch
                  checked={member.isDisplayed}
                  onCheckedChange={() => toggleDisplay(member.id)}
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(member)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(member.id)} variant="destructive" className="mr-2">Delete</Button>
                <Button onClick={() => handleViewDetails(member)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2 mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4 border rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
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
  );
};

export default TeamTerbitPage;

