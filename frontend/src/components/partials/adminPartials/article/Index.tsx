'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { MoreHorizontal, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const articleSchema = z.object({
  id: z.string(),
  author: z.string().min(1, "Author is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  hashtags: z.array(z.string()),
  images: z.array(z.string()),
})

type Article = z.infer<typeof articleSchema>

const initialArticles: Article[] = [
  {
    id: "1",
    author: "John Doe",
    title: "The Beauty of Bali",
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    content: "Bali is a beautiful island with rich culture and stunning landscapes...",
    category: "Travel",
    hashtags: ["Bali", "Indonesia", "Travel"],
  },
  {
    id: "2",
    author: "Jane Smith",
    title: "Indonesian Culinary Delights",
    images: ["/placeholder.svg?height=100&width=100"],
    content: "Indonesian cuisine is known for its rich flavors and diverse ingredients...",
    category: "Food",
    hashtags: ["Indonesian Food", "Culinary", "Recipes"],
  },
  {
    id: "3",
    author: "Mike Johnson",
    title: "Exploring Jakarta's Nightlife",
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    content: "Jakarta comes alive at night with its vibrant clubs and bars...",
    category: "Lifestyle",
    hashtags: ["Jakarta", "Nightlife", "City Life"],
  },
]

const ArticlePage = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const itemsPerPage = 5

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Article>({
    resolver: zodResolver(articleSchema),
  })

  const onSubmit = (data: Article) => {
    if (editingArticle) {
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...data, id: editingArticle.id } : a))
      toast({ title: "Article updated", description: "The article has been updated successfully." })
    } else {
      const newArticle = { ...data, id: Date.now().toString() }
      setArticles([...articles, newArticle])
      toast({ title: "Article added", description: "A new article has been added successfully." })
    }
    setIsAddModalOpen(false)
    setEditingArticle(null)
    reset()
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setArticles(articles.filter(article => article.id !== id))
    toast({ title: "Article deleted", description: "The article has been deleted successfully." })
  }

  const categories = ["all", ...new Set(articles.map(article => article.category))]

  const filteredArticles = articles
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(article => categoryFilter === "all" ? true : article.category === categoryFilter)

  const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Article
        </Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Hashtags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {article.images.map((image, index) => (
                      <img key={index} src={image} alt={`Article image ${index + 1}`} className="w-10 h-10 object-cover rounded" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.hashtags.join(", ")}</TableCell>
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
                      <DropdownMenuItem onClick={() => console.log('View details', article.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(article)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(article.id)}>
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
            <DialogTitle>{editingArticle ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Edit the article details below.' : 'Add a new article by filling out the form below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} defaultValue={editingArticle?.title} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...register('author')} defaultValue={editingArticle?.author} />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" {...register('content')} defaultValue={editingArticle?.content} />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register('category')} defaultValue={editingArticle?.category} />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="hashtags">Hashtags (comma-separated)</Label>
              <Input 
                id="hashtags" 
                {...register('hashtags')} 
                defaultValue={editingArticle?.hashtags.join(', ')}
                onChange={(e) => setValue('hashtags', e.target.value.split(',').map(tag => tag.trim()))}
              />
            </div>
            <Button type="submit">{editingArticle ? 'Update Article' : 'Add Article'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ArticlePage;