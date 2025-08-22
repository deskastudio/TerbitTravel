"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ChevronRight, TrendingUp } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { useArticle, useCategory } from "@/hooks/use-article"
import { ArticleCard } from "./ArticleCard"

// Featured Article Component
const FeaturedArticle = ({ article }) => {
  if (!article) return null;
  return <ArticleCard article={article} isFeatured={true} />;
};

// Loading Skeleton
const ArticleCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 pb-2">
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-full mb-1" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    <div className="p-4 pt-0">
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="p-4 pt-0 flex justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </Card>
);

// Main Component
export default function ArticlePage() {
  // Get articles from the hook
  const { 
    articles, 
    isLoadingArticles, 
    searchTerm, 
    handleSearch, 
    categoryFilter, 
    handleCategoryFilter,
    pagination, 
    setPage,
    refreshArticles
  } = useArticle();

  // Get categories from the hook
  const { categories, isLoadingCategories } = useCategory();

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("terbaru")
  const [isLoading, setIsLoading] = useState(true)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    handleCategoryFilter(value);
  }

  // Handle sorting change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    const currentPage = pagination.currentPage;
    const limit = pagination.itemsPerPage;
    
    // Call refresh with sort parameter
    refreshArticles(currentPage, limit, searchTerm, categoryFilter, value);
  }

  // Get featured articles
  const featuredArticles = articles
    .filter(article => article.isFeatured || article.featured)
    .slice(0, 3);

  // Get trending articles
  const trendingArticles = articles
    .filter(article => article.isTrending || article.trending)
    .sort((a, b) => (b.dilihat || 0) - (a.dilihat || 0))
    .slice(0, 4);

  // Simulate loading effect when first loading or changing filters
  useEffect(() => {
    if (isLoadingArticles) {
      setIsLoading(true);
    } else {
      // Add a small delay to make the loading state visible
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoadingArticles]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setPage(page);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pustaka Artikel Travedia</h1>
        <p className="text-muted-foreground">Menghadirkan informasi terbaru seputar wisata, dan hal menarik lainnya.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari artikel..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Featured Articles - Show only on first page with no filters */}
      {pagination.currentPage === 1 && !searchTerm && categoryFilter === "all" && featuredArticles.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {featuredArticles.length > 0 && <FeaturedArticle article={featuredArticles[0]} />}
            </div>
            <div className="flex flex-col gap-3">
              {featuredArticles.slice(1, 3).map((article) => (
                <Card key={article._id || article.id} className="overflow-hidden h-1/2">
                  <div className="flex h-full">
                    <div className="w-1/3">
                      <img
                        src={article.gambarUtama || article.gambar || "/placeholder.svg"}
                        alt={article.judul}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <div className="mb-2">
                        {article.kategori && Array.isArray(article.kategori) && article.kategori[0] ? (
                          <span className="text-xs bg-muted/80 px-2 py-1 rounded-full">
                            {typeof article.kategori[0] === 'string' 
                              ? article.kategori[0].replace(/-/g, " ") 
                              : article.kategori[0].title || 'Kategori'}
                          </span>
                        ) : article.category ? (
                          <span className="text-xs bg-muted/80 px-2 py-1 rounded-full">
                            {typeof article.category === 'string' 
                              ? article.category 
                              : article.category.title || 'Kategori'}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="font-bold line-clamp-2 text-sm mb-1 hover:text-primary cursor-pointer">
                        {article.judul}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {article.tanggalPublikasi || article.createdAt ? (
                          <span>
                            {new Date(article.tanggalPublikasi || article.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={handleCategoryChange} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            {!isLoadingCategories && categories.map((category) => (
              <TabsTrigger key={category._id || category.id} value={category._id || category.id}>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terpopuler">Terpopuler</SelectItem>
              <SelectItem value="waktu-baca">Waktu Baca Tercepat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          {/* Trending Section */}
          {pagination.currentPage === 1 && !searchTerm && trendingArticles.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-red-500" /> Trending Saat Ini
                </h2>
                <Button variant="link" className="flex items-center">
                  Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {trendingArticles.map((article) => (
                  <Card key={article._id || article.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={article.gambarUtama || article.gambar || "/placeholder.svg"}
                        alt={article.judul}
                        className="h-36 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="font-bold line-clamp-2 text-sm hover:text-primary/90 cursor-pointer">
                          {article.judul}
                        </h3>
                        <div className="flex items-center text-xs text-gray-300 mt-1">
                          {article.dilihat && (
                            <span>
                              {typeof article.dilihat === 'number' 
                                ? article.dilihat.toLocaleString() 
                                : article.dilihat} dilihat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ArticleCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id || article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada artikel yang sesuai dengan pencarian Anda. Coba kata kunci lain atau filter yang berbeda.
              </p>
              <Button
                onClick={() => {
                  handleSearch("");
                  handleCategoryFilter("all");
                  handleSortChange("terbaru");
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage > 1) handlePageChange(pagination.currentPage - 1);
                    }}
                    className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const page = index + 1;

                  // Show first page, last page, current page, and pages around current page
                  if (page === 1 || page === pagination.totalPages || 
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === pagination.currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (page === 2 || page === pagination.totalPages - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage < pagination.totalPages) 
                        handlePageChange(pagination.currentPage + 1);
                    }}
                    className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>

      {/* "Under Development" Section for empty states */}
      {articles.length === 0 && !isLoading && !searchTerm && categoryFilter === "all" && (
        <div className="bg-blue-50 rounded-xl p-8 text-center my-8">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Sedang Dalam Pengembangan</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Kami sedang bekerja keras untuk menyiapkan artikel yang menarik untuk Anda. Silakan kembali lagi nanti untuk
            melihat konten terbaru kami!
          </p>
        </div>
      )}
    </div>
  )
}