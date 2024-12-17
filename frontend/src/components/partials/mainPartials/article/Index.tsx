'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Define interfaces
interface Article {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  tags: string[]
  category: string
  content: string
  image: string
}

interface ArticleCardProps {
  article: Article
}

interface ArticleDialogProps {
  article: Article
}

// Mock data for articles
const articles = [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      excerpt: "Exploring how artificial intelligence is shaping the landscape of web development and its potential impact on developers.",
      author: "Alex Johnson",
      date: "2024-03-15",
      tags: ["AI", "Web Development", "Technology"],
      category: "AI",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image: "/placeholder.svg?height=400&width=600"
    },
    {
      id: 2,
      title: "Optimizing React Performance",
      excerpt: "Learn advanced techniques to boost the performance of your React applications and improve user experience.",
      author: "Sarah Lee",
      date: "2024-03-10",
      tags: ["React", "Performance", "JavaScript"],
      category: "React",
      content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      image: "/placeholder.svg?height=400&width=600"
    },
    {
      id: 3,
      title: "The Rise of Serverless Architecture",
      excerpt: "Discover how serverless architecture is revolutionizing cloud computing and simplifying application deployment.",
      author: "Michael Chen",
      date: "2024-03-05",
      tags: ["Serverless", "Cloud Computing", "Architecture"],
      category: "Cloud",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
      image: "/placeholder.svg?height=400&width=600"
    },
    {
      id: 4,
      title: "Mastering CSS Grid Layout",
      excerpt: "A comprehensive guide to using CSS Grid for creating complex and responsive layouts with ease.",
      author: "Emily Wong",
      date: "2024-02-28",
      tags: ["CSS", "Web Design", "Layout"],
      category: "Web Design",
      content: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
      image: "/placeholder.svg?height=400&width=600"
    },
    {
      id: 5,
      title: "The Impact of 5G on Web Applications",
      excerpt: "Exploring how 5G technology will transform web applications and create new possibilities for developers.",
      author: "David Kim",
      date: "2024-02-20",
      tags: ["5G", "Web Applications", "Technology"],
      category: "Technology",
      content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      image: "/placeholder.svg?height=400&width=600"
    },
  ]

const categories: string[] = ["All", ...new Set(articles.map(article => article.category))]

export default function AttractiveArticlesPage() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentCategory, setCurrentCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const articlesPerPage: number = 4

  const filteredArticles = articles.filter(article =>
    (currentCategory === 'All' || article.category === currentCategory) &&
    (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [currentCategory, searchTerm])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">TechNova Articles</h1>
      
      <div className="mb-8 flex justify-center">
        <Input
          type="text"
          placeholder="Search articles by title or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl"
        />
      </div>

      <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="mb-8">
        <TabsList className="flex flex-wrap justify-center">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="px-4 py-2">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-8 md:grid-cols-2">
        {currentArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{article.excerpt}</p>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`} />
            <AvatarFallback>{article.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{article.author}</p>
            <p className="text-sm text-muted-foreground">{article.date}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <ArticleDialog article={article} />
      </CardFooter>
    </Card>
  )
}

function ArticleDialog({ article }: ArticleDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Read More</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>
            By {article.author} | {article.date}
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-64 mb-4">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <ScrollArea className="max-h-[60vh]">
          <p className="text-muted-foreground">{article.content}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
