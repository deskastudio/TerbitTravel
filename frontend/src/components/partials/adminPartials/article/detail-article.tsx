"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Pencil,
  Loader2,
  FileText,
  User,
  Calendar,
  Clock,
  Tags,
  Eye,
} from "lucide-react";
import { useArticle } from "@/hooks/use-article";
import { ICategory } from "@/types/article.types";
import { getImageUrl } from "@/utils/image-helper";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useArticleDetail } = useArticle();
  const { article, isLoading, error } = useArticleDetail(id || "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getReadingTime = (text: string) => {
    const words = getWordCount(text);
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(words / wordsPerMinute);
  };

  const getCategoryName = (category: string | ICategory | undefined) => {
    if (!category) return "Tidak ada kategori";
    if (typeof category === "string") return "Unknown";
    return category.title || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">
              Artikel Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Artikel yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Button onClick={() => navigate("/admin/article")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate("/admin/article")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              Artikel
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">
              Detail Artikel
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            {article.judul}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {typeof article.penulis === "string"
                ? article.penulis
                : article.penulis?.nama || "Unknown"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Tags className="w-3 h-3 text-blue-500" />
              {getCategoryName(
                article.category ||
                  (Array.isArray(article.kategori)
                    ? article.kategori[0]
                    : article.kategori)
              )}
            </Badge>
            <Badge
              variant="default"
              className="flex items-center gap-1 bg-green-600"
            >
              <Eye className="w-3 h-3" />
              {getReadingTime(article.isi)} min baca
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/article/${article._id}/edit`)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/article")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] bg-gray-100">
              {article.gambarUtama || article.gambar ? (
                <img
                  src={getImageUrl(article.gambarUtama || article.gambar || "")}
                  alt={article.judul}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/800x450?text=Gambar+Artikel";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Tidak ada gambar</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Article Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Konten Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {article.isi.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Images */}
          {article.gambarTambahan && article.gambarTambahan.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-6 bg-purple-600 rounded"></div>
                  Galeri Gambar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {article.gambarTambahan.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-pointer"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Gambar ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/300x300?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Statistik Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {getWordCount(article.isi)}
                  </div>
                  <div className="text-sm text-gray-600">Total Kata</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {article.isi.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Karakter</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {getReadingTime(article.isi)}
                  </div>
                  <div className="text-sm text-gray-600">Menit Baca</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {1 + (article.gambarTambahan?.length || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Gambar</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-600 rounded"></div>
                Informasi Artikel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Penulis
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {typeof article.penulis === "string"
                      ? article.penulis
                      : article.penulis?.nama || "Unknown"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Kategori
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Tags className="h-4 w-4 text-gray-400" />
                  <Badge variant="secondary">
                    {getCategoryName(
                      article.category ||
                        (Array.isArray(article.kategori)
                          ? article.kategori[0]
                          : article.kategori)
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-600">
                    Published
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-gray-600 rounded"></div>
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Dibuat pada
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Terakhir diupdate
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(article.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
