import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori destinasi harus memiliki minimal 2 karakter."),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
  id: string;
  name: string;
}

interface AddDestinationCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCategory: (category: Category) => void
}

export function AddDestinationCategoryModal({ isOpen, onClose, onAddCategory }: AddDestinationCategoryModalProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CategoryFormValues) => {
    const newCategory: Category = {
      id: Date.now().toString(), // Simple ID generation, replace with proper ID generation in production
      name: data.name,
    }
    onAddCategory(newCategory)
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Destinasi Baru</DialogTitle>
          <DialogDescription>
            Masukkan nama untuk kategori baru destinasi.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori Destinasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kategori destinasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Tambah Kategori Destinasi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

