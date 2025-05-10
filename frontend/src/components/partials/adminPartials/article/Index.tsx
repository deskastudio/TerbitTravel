'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Plus, MoreHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useArticle, useCategory } from '@/hooks/use-article';

export default function ArticleIndexPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  // Inisialisasi dengan default values untuk menjaga agar tidak undefined
  const [articleData, setArticleData] = useState<{
    articles: any[],
    isLoadingArticles: boolean,
    pagination: {
      currentPage: number,
      totalPages: number,
      totalItems: number,
      itemsPerPage: number
    },
    searchTerm: string,
    categoryFilter: string
  }>({
    articles: [],
    isLoadingArticles: true,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    },
    searchTerm: '',
    categoryFilter: 'all'
  });

  const {
    articles,
    isLoadingArticles,
    pagination,
    searchTerm,
    categoryFilter,
    deleteArticle,
    setPage,
    handleSearch,
    handleCategoryFilter,
    isDeleting
  } = useArticle();

  // Update state lokal saat data berubah
  useEffect(() => {
    if (articles !== undefined) {
      setArticleData(prev => ({
        ...prev,
        articles: articles || [],
        isLoadingArticles,
        pagination,
        searchTerm,
        categoryFilter
      }));
    }
  }, [articles, isLoadingArticles, pagination, searchTerm, categoryFilter]);

  const {
    categories,
    isLoadingCategories
  } = useCategory();

  // Handle article view
  const handleViewArticle = (id: string) => {
    navigate(`/admin/article/${id}`);
  };

  // Handle article edit
  const handleEditArticle = (id: string) => {
    navigate(`/admin/article/edit/${id}`);
  };

  // Handle article delete confirmation
  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  // Handle article delete
  const handleDelete = async () => {
    await deleteArticle(deleteId);
    setOpenDeleteDialog(false);
    setDeleteId('');
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination && pagination.currentPage > 1) {
      setPage(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      setPage(pagination.currentPage + 1);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Safely get category name, handling different data structures
  const getCategoryName = (category: any) => {
    if (!category) return '';
    if (typeof category === 'string') return 'Unknown'; // In case it's just an ID
    return category.title || category.nama || '';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Artikel</h1>
        <Button onClick={() => navigate('/admin/article/add')}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Artikel
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Cari artikel..."
            value={articleData.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={articleData.categoryFilter} onValueChange={handleCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories && categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {articleData.isLoadingArticles ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : articleData.articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">Tidak ada artikel yang ditemukan</p>
            <Button onClick={() => navigate('/admin/article/add')}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Artikel Baru
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articleData.articles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell className="font-medium">{article.judul}</TableCell>
                    <TableCell>{article.penulis}</TableCell>
                    <TableCell>
                      {getCategoryName(article.kategori)}
                    </TableCell>
                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewArticle(article._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditArticle(article._id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConfirm(article._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
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
              onClick={handlePrevPage}
              disabled={!pagination || pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Sebelumnya
            </Button>
            <div className="flex-1 text-center text-sm text-muted-foreground">
              Halaman {pagination?.currentPage || 1} dari {pagination?.totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination || pagination.currentPage === pagination.totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Artikel</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}