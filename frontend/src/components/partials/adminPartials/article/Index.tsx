'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2, 
  Search,
  SlidersHorizontal,
  FilterX,
  FileText,
  User,
  Calendar,
  Tags
} from 'lucide-react';
import { useArticle, useCategory } from '@/hooks/use-article';

export default function ArticleIndexPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const {
    articles,
    isLoadingArticles,
    deleteArticle,
    isDeleting
  } = useArticle();

  const {
    categories,
    isLoadingCategories
  } = useCategory();

  // Memoized values for stats
  const stats = useMemo(() => {
    if (!articles?.length) {
      return {
        total: 0,
        totalAuthors: 0,
        totalCategories: 0,
        avgLength: 0
      };
    }

    const uniqueAuthors = new Set(articles.map(a => a.penulis)).size;
    const avgLength = Math.round(
      articles.reduce((sum, article) => sum + (article.isi?.length || 0), 0) / articles.length
    );

    return {
      total: articles.length,
      totalAuthors: uniqueAuthors,
      totalCategories: categories?.length || 0,
      avgLength
    };
  }, [articles, categories]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles?.filter((article) => {
      const matchesSearch = 
        article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.penulis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.isi?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        categoryFilter === 'all' ||
        (typeof article.kategori === 'object' ? article.kategori._id : article.kategori) === categoryFilter;

      return matchesSearch && matchesCategory;
    }) || [];
  }, [articles, searchTerm, categoryFilter]);

  // Filter active state
  useEffect(() => {
    setIsFilterActive(categoryFilter !== 'all');
  }, [categoryFilter]);

  const resetFilters = () => {
    setCategoryFilter('all');
    setIsFilterActive(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Handle article view
  const handleViewArticle = (id: string) => {
    navigate(`/admin/article/${id}`);
  };

  // Handle article edit
  const handleEditArticle = (id: string) => {
    navigate(`/admin/article/${id}/edit`);
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category name
  const getCategoryName = (category: any) => {
    if (!category) return 'Tidak ada kategori';
    if (typeof category === 'string') return 'Unknown';
    return category.title || category.nama || '';
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoadingArticles) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Article Management</h1>
          <p className="text-gray-600 mt-1">Kelola semua artikel dan konten blog</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/article/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Artikel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Artikel</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalAuthors}</div>
                <div className="text-sm text-gray-600">Jumlah Penulis</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tags className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCategories}</div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgLength}</div>
                <div className="text-sm text-gray-600">Rata-rata Karakter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari artikel, penulis, atau konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {isFilterActive && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Artikel</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Memuat...</span>
                          </div>
                        ) : (
                          categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="w-full flex items-center gap-2"
                  >
                    <FilterX className="h-4 w-4" />
                    Reset Filter
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Artikel</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Konten</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">📄</div>
                        <p className="text-gray-500">Tidak ada artikel yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba ubah filter pencarian Anda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((article) => (
                    <TableRow key={article._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{article.judul}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{article.penulis}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(article.kategori)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs">
                          {truncateText(article.isi, 80)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(article.createdAt)}
                        </div>
                      </TableCell>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewArticle(article._id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditArticle(article._id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteConfirm(article._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data termasuk gambar yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}