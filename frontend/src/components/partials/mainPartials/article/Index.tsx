'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import ArticleCard from "./ArticleCard"

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
    image: "src/assets/Banner/banner2.png"
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
    image: "src/assets/Banner/banner2.png"
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
    image: "src/assets/Banner/banner2.png"
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

const ArticlesPage= () => {
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
          className="w-full max-w-xl bg-white"
        />
      </div>

      <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="mb-8">
        <TabsList className="flex flex-wrap justify-center bg-transparent">
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

export default ArticlesPage;
