// components/partials/adminPartials/banner/Detail.tsx - Fixed version
'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  Loader2, 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Calendar,
  Hash,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useBanner } from '@/hooks/use-banner';
import { Banner } from '@/types/banner.types';

export default function BannerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {
    getBannerById,
    getImageUrl,
    deleteBanner,
    toggleBannerStatus,
    isDeleting,
    hasPermission
  } = useBanner();

  // Permission checks
  const canRead = hasPermission('read');
  const canUpdate = hasPermission('update');
  const canDelete = hasPermission('delete');

  // Load banner data
  useEffect(() => {
    const fetchBanner = async () => {
      if (!id || !canRead) {
        setIsLoadingBanner(false);
        return;
      }

      try {
        setIsLoadingBanner(true);
        const bannerData = await getBannerById(id);
        setBanner(bannerData || null);
      } catch (error) {
        console.error('Error loading banner:', error);
        setBanner(null);
      } finally {
        setIsLoadingBanner(false);
      }
    };

    fetchBanner();
  }, [id, getBannerById, canRead]);

  // Handle edit
  const handleEdit = () => {
    if (!canUpdate || !id) return;
    navigate(`/admin/banner/edit/${id}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!canDelete) return;
    setOpenDeleteDialog(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;
    
    const success = await deleteBanner(id);
    if (success) {
      navigate('/admin/banner');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    if (!canUpdate || !id || !banner) return;
    
    const success = await toggleBannerStatus(id);
    if (success) {
      setBanner(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (!id) return;
    
    try {
      const bannerData = await getBannerById(id);
      setBanner(bannerData || null);
    } catch (error) {
      console.error('Error refreshing banner:', error);
    }
  };

  // Download image
  const handleDownloadImage = () => {
    if (!banner?.gambar) return;
    
    const imageUrl = getImageUrl(banner.gambar);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `banner-${banner.judul.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share banner
  const handleShare = async () => {
    if (!banner) return;
    
    const shareData = {
      title: `Banner: ${banner.judul}`,
      text: banner.deskripsi || `Banner ${banner.judul}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // No permission
  if (!canRead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/banner')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Anda tidak memiliki akses untuk melihat detail banner.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isLoadingBanner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/banner')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Memuat detail banner...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Banner not found
  if (!banner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/banner')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Banner tidak ditemukan</p>
            <Button onClick={() => navigate('/admin/banner')}>
              Kembali ke Daftar Banner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/banner')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detail Banner</h1>
          <p className="text-muted-foreground">Informasi lengkap banner</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {canUpdate && (
            <Button onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Gambar Banner
              </div>
              {banner.gambar && (
                <Button variant="outline" size="sm" onClick={handleDownloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden border">
              {banner.gambar ? (
                <img
                  src={getImageUrl(banner.gambar)}
                  alt={banner.judul}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center">
                          <svg class="h-16 w-16 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-muted-foreground">Gambar tidak dapat dimuat</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Tidak ada gambar</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Banner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Judul</label>
              <p className="text-lg font-semibold">{banner.judul}</p>
            </div>

            {/* Description */}
            {banner.deskripsi && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
                <p className="text-sm leading-relaxed">{banner.deskripsi}</p>
              </div>
            )}

            <Separator />

            {/* Link */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Link Tujuan
              </label>
              {banner.link ? (
                <div className="flex items-center gap-2">
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {banner.link}
                  </a>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada link</p>
              )}
            </div>

            <Separator />

            {/* Order and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Urutan Tampil
                </label>
                <Badge variant="outline" className="mt-1">
                  {banner.urutan}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Status Banner
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={banner.isActive ? "default" : "secondary"}
                  >
                    {banner.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                  {canUpdate && (
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={handleToggleStatus}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Dibuat
                </label>
                <p className="text-sm">{formatDate(banner.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Terakhir Diperbarui
                </label>
                <p className="text-sm">{formatDate(banner.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {canUpdate && (
              <>
                <Button variant="outline" onClick={handleToggleStatus}>
                  {banner.isActive ? (
                    <>
                      <ToggleLeft className="h-4 w-4 mr-2" />
                      Nonaktifkan Banner
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-4 w-4 mr-2" />
                      Aktifkan Banner
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Banner
                </Button>
              </>
            )}
            {banner.link && (
              <Button variant="outline" asChild>
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka Link
                </a>
              </Button>
            )}
            {banner.gambar && (
              <Button variant="outline" onClick={handleDownloadImage}>
                <Download className="h-4 w-4 mr-2" />
                Download Gambar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus banner "<strong>{banner.judul}</strong>"? 
              <br /><br />
              <strong>Tindakan ini tidak dapat dibatalkan</strong> dan file gambar akan dihapus dari server.
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