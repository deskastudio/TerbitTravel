// types/article.types.ts

export interface IArticle {
  _id: string;
  judul: string;
  penulis: string;
  isi: string;
  gambarUtama: string;
  gambarTambahan: string[];
  kategori: ICategory | string;
  createdAt: string;
  updatedAt: string;
}

export interface IArticleInput {
  judul: string;
  penulis: string;
  isi: string;
  kategori: string;
  gambarUtama: File | null;
  gambarTambahan: File[];
}

export interface ICategory {
  _id: string;
  title: string; // Mengubah dari nama menjadi title untuk menyesuaikan dengan model backend
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ArticleResponse {
  message: string;
  data: IArticle;
}