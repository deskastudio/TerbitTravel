'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from 'lucide-react';
import { useCategory } from '@/hooks/use-article';

// Schema validasi untuk kategori
const categorySchema = z.object({
  title: z.string().min(1, "Judul kategori wajib diisi").max(50, "Judul kategori maksimal 50 karakter"),
});

type FormData = z.infer<typeof categorySchema>;

interface AddCategoryProps {
  onSuccess?: () => void;
  variant?: 'button' | 'inline';
  className?: string;
}

export default function AddCategory({ onSuccess, variant = 'button', className = '' }: AddCategoryProps) {
  const [open, setOpen] = useState(false);
  const { createCategory, isCreating } = useCategory();

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
    },
  });

  // Proses submit form
  const onSubmit = async (data: FormData) => {
    const success = await createCategory(data);
    if (success) {
      setOpen(false);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <Button size="sm" className={className}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
          </Button>
        ) : (
          <Button variant="link" size="sm" className={`px-0 ${className}`}>
            <Plus className="h-4 w-4 mr-1" /> Tambah Kategori Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
          <DialogDescription>
            Tambahkan kategori baru untuk artikel blog Anda.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul kategori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : 'Simpan Kategori'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}