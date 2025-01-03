import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { MoreHorizontal, Pencil, Trash, Search } from 'lucide-react';
import { Partner, partnerSchema } from '@/types/partner';
import { getPartners, addPartner, updatePartner, deletePartner } from '@/lib/api';

const PartnerTerbitPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Partner>({
    resolver: zodResolver(partnerSchema),
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const data = await getPartners();
    setPartners(data);
  };

  const onSubmit = async (data: Partner) => {
    try {
      if (editingPartner) {
        if (editingPartner.id) {
          await updatePartner(editingPartner.id, data);
          toast({ title: "Partner updated", description: "The partner has been updated successfully." });
        } else {
          throw new Error("Partner ID is not defined");
        }
      } else {
        await addPartner(data);
        toast({ title: "Partner added", description: "A new partner has been added successfully." });
      }
      fetchPartners();
      setIsAddModalOpen(false);
      setEditingPartner(null);
      reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save partner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePartner(id);
      fetchPartners();
      toast({ title: "Partner deleted", description: "The partner has been deleted successfully." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete partner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPartners = partners
    .filter(partner => partner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(partner => statusFilter === 'all' || partner.status === statusFilter);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Partners</h1>
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>{editingPartner ? 'Edit Partner' : 'Add Partner'}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input id="name" {...register('name')} defaultValue={editingPartner?.name} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                  <Input id="image" {...register('image')} defaultValue={editingPartner?.image} />
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <Select onValueChange={(value) => register('status').onChange({ target: { value } })} defaultValue={editingPartner?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">{editingPartner ? 'Update Partner' : 'Add Partner'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <img src={partner.image} alt={partner.name} className="w-16 h-16 object-cover" />
                </TableCell>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>{partner.status}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(partner)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => partner.id && handleDelete(partner.id)}>
                        <Trash className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default PartnerTerbitPage;

