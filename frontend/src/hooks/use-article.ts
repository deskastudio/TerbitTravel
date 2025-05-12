// hooks/use-article.ts

import { useState, useEffect, useCallback } from "react";
import { ArticleService } from "@/services/article.service";
import { 
  IArticle, 
  IArticleInput, 
  ICategory,
  PaginationMeta
} from "@/types/article.types";
import { useToast } from "@/hooks/use-toast";

export const useArticle = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articlesError, setArticlesError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination, search and filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('terbaru');
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  const { toast } = useToast();

  // Fetch all articles with pagination, search and filter
  const fetchArticles = useCallback(async (
    page = pagination.currentPage,
    limit = pagination.itemsPerPage,
    search = searchTerm,
    category = categoryFilter,
    sort = sortBy
  ) => {
    try {
      setIsLoadingArticles(true);
      console.log('Fetching articles with params:', { page, limit, search, category, sort });
      const response = await ArticleService.getAllArticles(page, limit, search, category);
      console.log('Articles response:', response);
      
      // Update articles and pagination
      if (response && response.data) {
        setArticles(response.data);
        
        // Update pagination if we have meta information
        if (response.meta) {
          setPagination({
            currentPage: response.meta.currentPage || page,
            totalPages: response.meta.totalPages || Math.ceil((response.data.length || 0) / limit),
            totalItems: response.meta.totalItems || response.data.length,
            itemsPerPage: response.meta.itemsPerPage || limit
          });
        } else {
          // If no meta data is provided, calculate pagination based on the data
          setPagination({
            currentPage: page,
            totalPages: Math.ceil((response.data.length || 0) / limit),
            totalItems: response.data.length,
            itemsPerPage: limit
          });
        }
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', response);
        setArticles([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        });
      }
      
      // Clear any previous errors
      setArticlesError(null);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticlesError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Gagal mengambil data artikel.",
      });
      
      // Set empty articles in case of error
      setArticles([]);
    } finally {
      setIsLoadingArticles(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, categoryFilter, sortBy, toast]);

  // Load articles on mount and when dependencies change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Get article detail by ID or slug
  const useArticleDetail = (idOrSlug: string) => {
    const [article, setArticle] = useState<IArticle | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      const fetchArticle = async () => {
        if (!idOrSlug) {
          console.warn("Cannot fetch article: ID or slug is empty");
          return;
        }
        
        try {
          setIsLoading(true);
          console.log(`Fetching article with ID/slug: ${idOrSlug}`);
          
          const data = await ArticleService.getArticleById(idOrSlug);
          console.log('Article detail response:', data);
          
          setArticle(data);
          setError(null);
        } catch (error) {
          console.error(`Error fetching article with ID/slug ${idOrSlug}:`, error);
          setError(error as Error);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Gagal mengambil detail artikel.",
          });
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      };

      fetchArticle();
    }, [idOrSlug]);

    // Function to manually refetch article data
    const refetch = useCallback(async () => {
      if (!idOrSlug) return;
      
      try {
        setIsLoading(true);
        const data = await ArticleService.getArticleById(idOrSlug);
        setArticle(data);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Gagal memuat ulang detail artikel.",
        });
      } finally {
        setIsLoading(false);
      }
    }, [idOrSlug, toast]);

    return { article, isLoading, error, isInitialized, refetch };
  };

  // Create new article
  const createArticle = async (data: IArticleInput) => {
    try {
      setIsCreating(true);
      console.log('Creating article with data:', data);
      await ArticleService.createArticle(data);
      await fetchArticles();
      toast({
        title: "Sukses!",
        description: "Artikel berhasil ditambahkan.",
      });
      return true;
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan artikel: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Update article
  const updateArticle = async (id: string, data: IArticleInput) => {
    try {
      setIsUpdating(true);
      console.log(`Updating article with ID ${id}:`, data);
      await ArticleService.updateArticle(id, data);
      await fetchArticles();
      toast({
        title: "Sukses!",
        description: "Artikel berhasil diperbarui.",
      });
      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui artikel: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete article
  const deleteArticle = async (id: string) => {
    try {
      setIsDeleting(true);
      console.log(`Deleting article with ID ${id}`);
      await ArticleService.deleteArticle(id);
      await fetchArticles();
      toast({
        title: "Sukses!",
        description: "Artikel berhasil dihapus.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menghapus artikel: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Set page for pagination
  const setPage = (page: number) => {
    const newPagination = { ...pagination, currentPage: page };
    setPagination(newPagination);
    
    // Fetch articles with new page
    fetchArticles(page, pagination.itemsPerPage, searchTerm, categoryFilter, sortBy);
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Fetch articles with search term
    fetchArticles(1, pagination.itemsPerPage, term, categoryFilter, sortBy);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Fetch articles with category filter
    fetchArticles(1, pagination.itemsPerPage, searchTerm, category, sortBy);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    
    // Fetch articles with new sort parameter
    fetchArticles(pagination.currentPage, pagination.itemsPerPage, searchTerm, categoryFilter, sort);
  };

  return {
    // Data & States
    articles,
    isLoadingArticles,
    articlesError,
    pagination,
    searchTerm,
    categoryFilter,
    sortBy,
    useArticleDetail,

    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    refreshArticles: fetchArticles,
    setPage,
    handleSearch,
    handleCategoryFilter,
    handleSortChange,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export const useCategory = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      console.log('Fetching categories...');
      
      // Add safety in case of timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = ArticleService.getAllCategories();
      
      // Race between data and timeout
      const data = await Promise.race([dataPromise, timeoutPromise]) as ICategory[];
      
      console.log('Categories data:', data);
      // Ensure we have an array of categories
      const categoriesArray = Array.isArray(data) ? data : [];
      setCategories(categoriesArray);
      setCategoriesError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error message:', (error as Error).message);
      
      // Log detailed error response if available
      if ((error as any).response) {
        console.error('Error status:', (error as any).response.status);
        console.error('Error data:', (error as any).response.data);
      }
      
      setCategoriesError(error as Error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal mengambil data kategori: ${(error as Error).message}`,
      });
      
      // Default to empty array to prevent UI errors
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [toast]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Get category detail by ID
  const useCategoryDetail = (id: string) => {
    const [category, setCategory] = useState<ICategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchCategory = async () => {
        if (!id) return;
        
        try {
          setIsLoading(true);
          const data = await ArticleService.getCategoryById(id);
          setCategory(data);
          setError(null);
        } catch (error) {
          console.error('Error fetching category detail:', error);
          setError(error as Error);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Gagal mengambil detail kategori.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    }, [id]);

    return { category, isLoading, error };
  };

  // Create new category
  const createCategory = async (data: { title: string }) => {
    try {
      setIsCreating(true);
      console.log('Creating category with data:', data);
      await ArticleService.createCategory(data);
      await fetchCategories();
      toast({
        title: "Sukses!",
        description: "Kategori berhasil ditambahkan.",
      });
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menambahkan kategori: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Update category
  const updateCategory = async (id: string, data: { title: string }) => {
    try {
      setIsUpdating(true);
      console.log(`Updating category with ID ${id}:`, data);
      await ArticleService.updateCategory(id, data);
      await fetchCategories();
      toast({
        title: "Sukses!",
        description: "Kategori berhasil diperbarui.",
      });
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal memperbarui kategori: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      setIsDeleting(true);
      console.log(`Deleting category with ID ${id}`);
      await ArticleService.deleteCategory(id);
      await fetchCategories();
      toast({
        title: "Sukses!",
        description: "Kategori berhasil dihapus.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Gagal menghapus kategori: ${(error as Error).message}`,
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Data & States
    categories,
    isLoadingCategories,
    categoriesError,
    useCategoryDetail,

    // Actions
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};