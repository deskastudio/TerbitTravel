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
import { MoreHorizontal, Pencil, Trash, Eye, Search, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

type Article = {
  id: string;
  author: string;
  title: string;
  images: string[];
  content: string;
  category: string;
  hashtags: string[];
};

const articleData: Article[] = [
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
  {
    id: "4",
    author: "Sarah Lee",
    title: "Sustainable Tourism in Indonesia",
    images: ["/placeholder.svg?height=100&width=100"],
    content: "Sustainable tourism is becoming increasingly important in Indonesia...",
    category: "Environment",
    hashtags: ["Sustainable Tourism", "Eco-friendly", "Indonesia"],
  },
  {
    id: "5",
    author: "David Chen",
    title: "Indonesian Traditional Arts",
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    content: "Indonesia has a rich tradition of arts, including batik, wayang, and more...",
    category: "Culture",
    hashtags: ["Indonesian Art", "Culture", "Tradition"],
  },
];

const ArticlePage = () => {
  const [articles, setArticles] = useState(articleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  const categories = ["all", ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === "all" || article.category === categoryFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteArticle = (id: string) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex space-x-2">
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
          <Button onClick={() => navigate("/admin-add-article")}>
            <Plus className="mr-2 h-4 w-4" /> Add Article
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Hashtags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((article) => (
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
                      <DropdownMenuItem onClick={() => navigate(`/articles/${article.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/articles/${article.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteArticle(article.id)}>
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
      <div className="flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredArticles.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ArticlePage;

