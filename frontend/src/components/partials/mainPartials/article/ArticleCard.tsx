import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Eye,
  Bookmark,
  Share2,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IArticle } from "@/types/article.types";
import { getImageUrl } from "@/utils/image-helper";

// Format date
const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy", { locale: id });
};

// Props interface
interface ArticleCardProps {
  article: IArticle;
  isFeatured?: boolean;
}

export const ArticleCard = ({
  article,
  isFeatured = false,
}: ArticleCardProps) => {
  const navigate = useNavigate();

  // Saved (bookmark) state for this article (persisted in localStorage)
  const [isSaved, setIsSaved] = useState(false);

  // Helper to safely get an article identifier
  const getArticleId = React.useCallback(() => {
    if (article._id) return article._id;
    // some payloads use `id` or `slug`
    const maybeId = (article as unknown) as Record<string, unknown>;
    if (typeof maybeId.id === "string") return (maybeId.id as string) || null;
    if (typeof article.slug === "string") return article.slug;
    return null;
  }, [article]);

  useEffect(() => {
    try {
      const savedArticles: string[] = JSON.parse(
        localStorage.getItem("savedArticles") || "[]"
      );
      const articleId = getArticleId();
      if (articleId) setIsSaved(savedArticles.includes(articleId));
    } catch (e) {
      console.error("Failed to read saved articles from localStorage", e);
    }
  }, [article, getArticleId]);

  const handleViewDetail = () => {
    // Prioritas: slug dulu, lalu ID
    if (article.slug) {
      console.log(`Navigating to article detail with slug: ${article.slug}`);
      navigate(`/article/${article.slug}`);
    } else {
  const articleId = getArticleId();
  console.log(`Navigating to article detail with ID: ${articleId}`);
  navigate(`/article/id/${articleId}`);
    }
  };

  // Safety check to ensure we have all required data
  const imagePath = article.gambarUtama || article.gambar || "/placeholder.svg";
  const displayImage = getImageUrl(imagePath);
  const displayTitle = article.judul || "Artikel tanpa judul";
  const displayAuthor =
    typeof article.penulis === "object"
      ? article.penulis.nama
      : article.penulis || "Penulis";
  const displayDate =
    article.tanggalPublikasi || article.createdAt || new Date().toISOString();

  // Calculate reading time based on content length (if not provided)
  const readingTime =
    article.waktuBaca || Math.ceil((article.isi?.length || 0) / 1000); // Approx. 1000 chars per min

  // Check if article is trending (if property exists)
  const isTrending = article.isTrending || false;

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const key = "savedArticles";
      const saved: string[] = JSON.parse(localStorage.getItem(key) || "[]");
  const articleId = getArticleId();
      if (!articleId) return;

      if (saved.includes(articleId)) {
        const updated = saved.filter((id) => id !== articleId);
        localStorage.setItem(key, JSON.stringify(updated));
        setIsSaved(false);
        console.log("Article removed from saved:", articleId);
        // Notify other components (same-tab) that saved articles changed
        try {
          window.dispatchEvent(new Event("savedArticlesUpdated"));
        } catch {
          /* ignore */
        }
      } else {
        saved.push(articleId);
        localStorage.setItem(key, JSON.stringify(saved));
        setIsSaved(true);
        console.log("Article saved:", articleId);
        // Notify other components (same-tab) that saved articles changed
        try {
          window.dispatchEvent(new Event("savedArticlesUpdated"));
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      console.error("Failed to toggle save for article", err);
    }
  };

  const shareArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const articleId = getArticleId();
      const url =
        window.location.origin +
        (article.slug ? `/article/${article.slug}` : `/article/id/${articleId}`);

      if (navigator.share) {
        navigator
          .share({ title: article.judul, text: article.ringkasan || "", url })
          .catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert("Link artikel disalin ke clipboard");
        });
      } else {
  // Fallback: prompt with URL to copy manually
  prompt("Salin link artikel:", url);
      }
    } catch (err) {
      console.error("Failed to share article", err);
    }
  };

  if (isFeatured) {
    return (
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        onClick={handleViewDetail}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={displayImage}
            alt={displayTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.kategori && Array.isArray(article.kategori) ? (
              article.kategori.slice(0, 2).map((kategori, idx) => (
                <Badge
                  key={idx}
                  className="bg-primary/80 hover:bg-primary text-white"
                >
                  {typeof kategori === "string"
                    ? kategori.replace(/-/g, " ")
                    : kategori.title || "Kategori"}
                </Badge>
              ))
            ) : article.category ? (
              <Badge className="bg-primary/80 hover:bg-primary text-white">
                {typeof article.category === "string"
                  ? article.category
                  : article.category.title || "Kategori"}
              </Badge>
            ) : null}
          </div>
          <h2 className="text-2xl font-bold mb-2 line-clamp-2 hover:text-primary/90">
            {displayTitle}
          </h2>
          <p className="text-sm text-gray-200 line-clamp-2 mb-3">
            {article.ringkasan || article.deskripsi || ""}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage
                  src={
                    typeof article.penulis === "object"
                      ? article.penulis.avatar
                      : "/placeholder.svg"
                  }
                  alt={displayAuthor}
                />
                <AvatarFallback>{displayAuthor.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{displayAuthor}</div>
                <div className="text-xs text-gray-300">
                  {formatTanggal(displayDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {readingTime} menit baca
              </div>
              {article.dilihat && (
                <div className="flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  {typeof article.dilihat === "number"
                    ? article.dilihat.toLocaleString()
                    : article.dilihat}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={displayImage}
          alt={displayTitle}
          className="h-48 w-full object-cover"
        />
        {isTrending && (
          <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Trending
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {article.kategori && Array.isArray(article.kategori) ? (
            article.kategori.slice(0, 2).map((kategori, idx) => (
              <Badge key={idx} variant="outline" className="bg-muted/50">
                {typeof kategori === "string"
                  ? kategori.replace(/-/g, " ")
                  : kategori.title || "Kategori"}
              </Badge>
            ))
          ) : article.category ? (
            <Badge variant="outline" className="bg-muted/50">
              {typeof article.category === "string"
                ? article.category
                : article.category.title || "Kategori"}
            </Badge>
          ) : null}
        </div>
        <CardTitle
          className="text-lg font-bold line-clamp-2 hover:text-primary cursor-pointer"
          onClick={handleViewDetail}
        >
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.ringkasan || article.deskripsi || ""}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatTanggal(displayDate)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {readingTime} menit baca
          </div>
          {article.dilihat && (
            <div className="flex items-center">
              <Eye className="h-3.5 w-3.5 mr-1" />
              {typeof article.dilihat === "number"
                ? article.dilihat.toLocaleString()
                : article.dilihat}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                typeof article.penulis === "object"
                  ? article.penulis.avatar
                  : "/placeholder.svg"
              }
              alt={displayAuthor}
            />
            <AvatarFallback>{displayAuthor.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{displayAuthor}</span>
        </div>
        <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSave}
              aria-label={isSaved ? "Hapus dari tersimpan" : "Simpan artikel"}
            >
              <Bookmark
                className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={shareArticle}
              aria-label="Bagikan artikel"
            >
              <Share2 className="h-4 w-4" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
