import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AddGalleryCategoryModal from './add-gallery-category-modal';

// Define schemas and types
const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
});

const galleryItemSchema = z.object({
  id: z.string(),
  image: z.instanceof(File, { message: "Image is required" }),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: categorySchema,
});


type Category = z.infer<typeof categorySchema>;
type GalleryItem = z.infer<typeof galleryItemSchema>;

const GalleryTerbitPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

  const { register: registerGallery, handleSubmit: handleSubmitGallery, formState: { errors: galleryErrors }, reset: resetGallery } = useForm<GalleryItem>({
    resolver: zodResolver(galleryItemSchema),
  });

  const onSubmitGallery = (data: GalleryItem) => {
    const newItem = {
      ...data,
      id: Date.now().toString(),
      image: data.image,
    };
    setGalleryItems([...galleryItems, newItem]);
    setIsAddGalleryModalOpen(false);
    resetGallery();
  };

  const onAddCategory = (data: { name: string }) => {
    const newCategory = { ...data, id: Date.now().toString() };
    setCategories([...categories, newCategory]);
  };

  const filteredItems = galleryItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => !selectedCategory || item.category.id === selectedCategory);

  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search gallery items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Dialog open={isAddGalleryModalOpen} onOpenChange={setIsAddGalleryModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Gallery Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Gallery Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitGallery(onSubmitGallery)} className="space-y-4">
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...registerGallery('image')}
                    ref={fileInputRef}
                  />
                  {galleryErrors.image && <p className="text-red-500 text-sm">{galleryErrors.image.message}</p>}
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...registerGallery('name')} />
                  {galleryErrors.name && <p className="text-red-500 text-sm">{galleryErrors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...registerGallery('description')} />
                  {galleryErrors.description && <p className="text-red-500 text-sm">{galleryErrors.description.message}</p>}
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => registerGallery('category', { value: { id: value, name: categories.find(category => category.id === value)?.name || 'Unknown' } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Add Item</Button>
              </form>
            </DialogContent>
          </Dialog>
          <AddGalleryCategoryModal onAddCategory={onAddCategory} />
        </div>
      </div>
      <Select onValueChange={(value) => setSelectedCategory(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img src={typeof item.image === 'string' ? item.image : ''} alt={item.name} className="w-16 h-16 object-cover" />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>
                <Button onClick={() => {/* Implement edit functionality */}}>Edit</Button>
                <Button onClick={() => {/* Implement delete functionality */}} variant="destructive">Delete</Button>
                <Button onClick={() => {/* Implement view detail functionality */}}>View</Button>
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
    </div>
  );
};

export default GalleryTerbitPage;

