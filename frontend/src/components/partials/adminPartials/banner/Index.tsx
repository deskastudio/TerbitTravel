// components/partials/adminPartials/banner/Index.tsx - Fixed version
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Info,
  RefreshCw
} from 'lucide-react';
import { useBanner } from '@/hooks/use-banner';
import { Banner } from '@/types/banner.types';

export default function BannerPage() {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);

  const {
    banners,
    isLoading,
    isDeleting,
    deleteBanner: deleteBannerAction,
    toggleBannerStatus,
    getImageUrl,
    hasPermission,
    canAddMore,
    remainingSlots,
    fetchBanners
  } = useBanner();

  // Permission checks
  const canRead = hasPermission('read');
  const canCreate = hasPermission('create');
  const canUpdate = hasPermission('update');
  const canDelete = hasPermission('delete');

  // Handle banner view
  const handleViewBanner = (id: string) => {
    if (!canRead) return;
    navigate(`/admin/banner/${id}`);
  };

  // Handle banner edit
  const handleEditBanner = (id: string) => {
    if (!canUpdate) return;
    navigate(`/admin/banner/edit/${id}`);
  };

  // Handle banner delete confirmation
  const handleDeleteConfirm = (banner: Banner) => {
    if (!canDelete) return;
    setDeleteId(banner._id);
    setDeleteBanner(banner);
    setOpenDeleteDialog(true);
  };

  // Handle banner delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    const success = await deleteBannerAction(deleteId);
    if (success) {
      setOpenDeleteDialog(false);
      setDeleteId('');
      setDeleteBanner(null);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (banner: Banner) => {
    if (!canUpdate) return;
    await toggleBannerStatus(banner._id);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchBanners();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // No permission alert
  if (!canRead) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Anda tidak memiliki akses untuk melihat daftar banner.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Daftar Banner</h1>
          <p className="text-muted-foreground">
            Kelola banner website Anda (maksimal 10 banner)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canCreate && (
            <Button 
              onClick={() => navigate('/admin/banner/add')}
              disabled={!canAddMore}
            >
              <Plus className="mr-2 h-4 w-4" /> 
              Tambah Banner
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banner</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">
              dari maksimal 10 banner
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banner Aktif</CardTitle>
            <ToggleRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {banners.filter(b => b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              sedang ditampilkan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banner Tidak Aktif</CardTitle>
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {banners.filter(b => !b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              tidak ditampilkan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slot Tersisa</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingSlots}</div>
            <p className="text-xs text-muted-foreground">
              bisa ditambah lagi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Banner count warning */}
      {!canAddMore && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Anda telah mencapai batas maksimal 10 banner. Hapus banner yang tidak digunakan untuk menambah yang baru.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Memuat data banner...</p>
            </div>
          </CardContent>
        </Card>
      ) : banners.length === 0 ? (
        // Empty State
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Belum ada banner yang ditambahkan</p>
            {canCreate && (
              <Button onClick={() => navigate('/admin/banner/add')}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Banner Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        // Banner Table
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                <TableHead className="w-20">Urutan</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Link</TableHead>
                <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                <TableHead className="text-right w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner._id}>
                  {/* Image */}
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                      {banner.gambar ? (
                        <img 
                          src={getImageUrl(banner.gambar)} 
                          alt={banner.judul}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full text-muted-foreground"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Title */}
                  <TableCell className="font-medium">
                    <div className="max-w-[200px]">
                      <p className="truncate" title={banner.judul}>
                        {banner.judul}
                      </p>
                    </div>
                  </TableCell>
                  
                  {/* Description */}
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    <div className="max-w-[150px]">
                      {banner.deskripsi ? (
                        <p className="truncate" title={banner.deskripsi}>
                          {truncateText(banner.deskripsi, 40)}
                        </p>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Order */}
                  <TableCell>
                    <Badge variant="outline">{banner.urutan}</Badge>
                  </TableCell>
                  
                  {/* Status with toggle */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={banner.isActive ? "default" : "secondary"}>
                        {banner.isActive ? 'Aktif' : 'Non-aktif'}
                      </Badge>
                      {canUpdate && (
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => handleToggleStatus(banner)}
                          size="sm"
                        />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Link */}
                  <TableCell className="hidden lg:table-cell">
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                        title={banner.link}
                      >
                        <span className="max-w-[100px] truncate">
                          {banner.link.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                    {formatDate(banner.createdAt)}
                  </TableCell>
                  
                  {/* Actions */}
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
                        
                        {canRead && (
                          <DropdownMenuItem onClick={() => handleViewBanner(banner._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                        )}
                        
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => handleEditBanner(banner._id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        
                        {canUpdate && (
                          <DropdownMenuItem onClick={() => handleToggleStatus(banner)}>
                            {banner.isActive ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Nonaktifkan
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Aktifkan
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        
                        {(canRead || canUpdate || canDelete) && <DropdownMenuSeparator />}
                        
                        {canDelete && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConfirm(banner)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus banner "{deleteBanner?.judul}"? 
              <br /><br />
              <strong>Tindakan ini tidak dapat dibatalkan</strong> dan file gambar akan dihapus dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
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
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Banner
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}