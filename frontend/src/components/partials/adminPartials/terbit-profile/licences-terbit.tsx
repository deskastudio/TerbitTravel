import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const licenseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File).refine((file) => file.size <= 5000000, `Max image size is 5MB.`),
  pdf: z.instanceof(File).refine((file) => file.size <= 10000000, `Max PDF size is 10MB.`),
});

type License = z.infer<typeof licenseSchema>;

const LicensesTerbitPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<License>({
    resolver: zodResolver(licenseSchema),
  });

  const onSubmit = (data: License) => {
    const newLicense = { ...data, id: Date.now().toString() };
    setLicenses([...licenses, newLicense]);
    setIsAddModalOpen(false);
    reset();
    toast({
      title: "License added",
      description: "Your new license has been added successfully.",
    });
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log('Edit license', id);
  };

  const handleDelete = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id));
    toast({
      title: "License deleted",
      description: "The license has been deleted successfully.",
    });
  };

  const handleViewDetails = (id: string) => {
    // Implement view details functionality
    console.log('View license details', id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Licenses</h1>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add License</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New License</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <Input id="image" type="file" accept="image/*" {...register('image')} />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>
            <div>
              <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">PDF</label>
              <Input id="pdf" type="file" accept=".pdf" {...register('pdf')} />
              {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf.message}</p>}
            </div>
            <Button type="submit">Add License</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Screenshot</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((license) => (
            <TableRow key={license.id}>
              <TableCell>
                <img src={URL.createObjectURL(license.image)} alt={license.title} className="w-16 h-16 object-cover" />
              </TableCell>
              <TableCell>{license.title}</TableCell>
              <TableCell>{license.description}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(license.id)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(license.id)} variant="destructive" className="mr-2">Delete</Button>
                <Button onClick={() => handleViewDetails(license.id)}>View PDF</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LicensesTerbitPage;

