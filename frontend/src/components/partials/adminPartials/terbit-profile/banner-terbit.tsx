import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const bannerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
});

type Banner = z.infer<typeof bannerSchema>;

const BannerTerbitPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [viewingBanner, setViewingBanner] = useState<Banner | null>(null);
  const itemsPerPage = 5;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Banner>({
    resolver: zodResolver(bannerSchema),
  });

  const onSubmit = (data: Banner) => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...data, id: editingBanner.id } : b));
      toast({ title: "Banner updated", description: "The banner has been updated successfully." });
    } else {
      const newBanner = { ...data, id: Date.now().toString() };
      setBanners([...banners, newBanner]);
      toast({ title: "Banner added", description: "A new banner has been added successfully." });
    }
    setIsAddModalOpen(false);
    setEditingBanner(null);
    reset();
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
    toast({ title: "Banner deleted", description: "The banner has been deleted successfully." });
  };

  const handleViewDetails = (banner: Banner) => {
    setViewingBanner(banner);
  };

  const filteredBanners = banners.filter(banner => 
    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBanners = filteredBanners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banners</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search banners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>{editingBanner ? 'Edit Banner' : 'Add Banner'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input id="name" {...register('name')} defaultValue={editingBanner?.name} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <Input id="image" type="file" accept="image/*" {...register('image')} />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
              </div>
              <Button type="submit">{editingBanner ? 'Update Banner' : 'Add Banner'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBanners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <img src={URL.createObjectURL(banner.image)} alt={banner.name} className="w-32 h-16 object-cover" />
              </TableCell>
              <TableCell>{banner.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(banner)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(banner.id)} variant="destructive" className="mr-2">Delete</Button>
                <Button onClick={() => handleViewDetails(banner)}>View Details</Button>
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
      {viewingBanner && (
        <Dialog open={!!viewingBanner} onOpenChange={() => setViewingBanner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Banner Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img src={URL.createObjectURL(viewingBanner.image)} alt={viewingBanner.name} className="w-full h-48 object-cover" />
              <h2 className="text-xl font-bold">{viewingBanner.name}</h2>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BannerTerbitPage;

