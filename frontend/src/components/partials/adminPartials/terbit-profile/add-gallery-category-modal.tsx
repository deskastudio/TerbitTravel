import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  onAddCategory: (category: CategoryFormData) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onAddCategory }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: CategoryFormData) => {
    onAddCategory(data);
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input id="categoryName" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <Button type="submit">Add Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;

