export interface ICategory {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  nama: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  nama: string;
  isi: string;
  tanggal: string;
  avatar?: string;
  likes?: number;
}

export interface RelatedArticle {
  id: string;
  judul: string;
  slug: string;
  gambar: string;
  kategori: string[];
  tanggalPublikasi: string;
}

export interface IArticle {
  _id: string;
  judul: string;
  slug?: string;
  ringkasan?: string;
  deskripsi?: string;
  isi: string;
  gambar?: string;
  gambarUtama?: string;
  gambarTambahan?: string[];
  galeri?: string[];
  kategori?: (string | ICategory)[];
  category?: string | ICategory;
  tags?: string[];
  penulis: string | Author;
  tanggalPublikasi?: string;
  createdAt: string;
  updatedAt: string;
  waktuBaca?: number;
  dilihat?: number;
  likes?: number;
  komentar?: Comment[];
  artikelTerkait?: RelatedArticle[];
  caption?: string;
  trending?: boolean;
  isTrending?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
}

// Input interface for creating/updating articles
export interface IArticleInput {
  judul: string;
  penulis: string;
  isi: string;
  kategori: string;
  slug?: string;
  deskripsi?: string;
  ringkasan?: string;
  gambarUtama?: File;
  gambarTambahan?: File[];
  tags?: string[];
  trending?: boolean;
  featured?: boolean;
  // Additional fields for edit
  existingMainImage?: string;
  existingAdditionalImages?: string[];
}

// Response interfaces
export interface ArticleResponse {
  message: string;
  data: IArticle;
}

export interface ArticlesResponse {
  data: IArticle[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FeaturedArticleProps {
  article: IArticle;
}

export interface RelatedArticleCardProps {
  article: IArticle;
  onClick: () => void;
}

export interface CommentCardProps {
  comment: Comment;
  onLike: (id: string) => void;
}

export interface UseArticleHook {
  articles: IArticle[];
  isLoadingArticles: boolean;
  searchTerm: string;
  handleSearch: (term: string) => void;
  categoryFilter: string;
  handleCategoryFilter: (id: string) => void;
  pagination: PaginationMeta;
  setPage: (page: number) => void;
  refreshArticles: (
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    sortBy?: string
  ) => void;
}

export interface UseCategoryHook {
  categories: ICategory[];
  isLoadingCategories: boolean;
}

export interface ArticleDetailHook {
  article: IArticle | null;
  isLoading: boolean;
  error?: unknown;
}

export interface ArticleCommentInput {
  nama: string;
  email: string;
  isi: string;
}

export interface TableOfContentItem {
  id: string;
  text: string | null;
  level: 2 | 3;
}

export interface NewsletterSubscription {
  email: string;
}

// Category input interface
export interface ICategoryInput {
  title: string;
}

// Implement hooks with proper typing in your hooks file
// For example:
// const useArticle = (): UseArticleHook => { ... }
// const useCategory = (): UseCategoryHook => { ... }
// const useArticleDetail = (id: string): ArticleDetailHook => { ... }

// You can now import and use these types to fix your React component type errors