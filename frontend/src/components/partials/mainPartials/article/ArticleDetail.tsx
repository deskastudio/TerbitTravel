import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Bookmark,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArticleService } from "@/services/article.service";
import { IArticle } from "@/types/article.types";
import { getImageUrl } from "@/utils/image-helper";

// Add CSS for article content
import "./articleStyles.css";

// Format date
const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy", { locale: id });
};

// Loading skeleton for article detail
const ArticleDetailSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-3/4 mb-8" />

        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <Skeleton className="h-96 w-full mb-8" />

      <div className="space-y-4 mb-8">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>

      <Skeleton className="h-48 w-full mb-8" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
};

export default function ArticleDetail() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug log to verify this component is being used
  console.log("NEW ArticleDetail component loaded, params:", { slug, id });

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: article?.judul || "Artikel Menarik",
      text: `Baca artikel: ${
        article?.judul || "Artikel Menarik"
      } di Travedia Terbit Semesta`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Article shared successfully");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link artikel telah disalin ke clipboard!");
        console.log("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link artikel telah disalin ke clipboard!");
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
        alert(
          "Tidak dapat membagikan artikel. Silakan salin URL secara manual."
        );
      }
    }
  };

  // Handle bookmark/save functionality
  const handleBookmark = () => {
    // You can implement actual bookmark functionality here
    // For now, we'll show a simple alert
    alert("Artikel telah disimpan ke bookmark!");
    console.log("Article bookmarked:", article?.judul);
  };

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        let articleData: IArticle;

        if (slug) {
          // Fetch by slug
          console.log(`Fetching article by slug: ${slug}`);
          articleData = await ArticleService.getArticleBySlug(slug);
        } else if (id) {
          // Fetch by ID
          console.log(`Fetching article by ID: ${id}`);
          articleData = await ArticleService.getArticleById(id);
        } else {
          throw new Error("Artikel tidak ditemukan");
        }

        console.log("Article detail loaded:", articleData);
        setArticle(articleData);

        // Increment view count
        try {
          await ArticleService.incrementViewCount(
            articleData._id || (articleData as any).id
          );
          console.log("View count incremented");
        } catch (viewError) {
          console.error("Failed to increment view count:", viewError);
        }

        // Fetch related articles
        try {
          const category = Array.isArray(articleData.kategori)
            ? articleData.kategori[0]
            : articleData.category;

          const categoryId =
            typeof category === "object" ? category._id : category;

          if (categoryId) {
            const related = await ArticleService.getRelatedArticles(
              articleData._id || (articleData as any).id,
              categoryId
            );
            setRelatedArticles(related.slice(0, 3));
          }
        } catch (relatedError) {
          console.error("Failed to fetch related articles:", relatedError);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          "Artikel tidak ditemukan atau terjadi kesalahan saat memuat data"
        );
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug, id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ArticleDetailSkeleton />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            😢 {error || "Artikel tidak ditemukan"}
          </h2>
          <p className="text-muted-foreground mb-6">
            Artikel yang Anda cari tidak ditemukan atau sudah tidak tersedia.
          </p>
          <Button asChild>
            <Link to="/article">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Artikel
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Extract data from article
  const {
    judul,
    isi,
    kategori,
    category,
    tanggalPublikasi,
    createdAt,
    waktuBaca,
    dilihat,
    penulis,
    gambarUtama,
    gambar,
  } = article;

  // Get image URL
  const displayImage = getImageUrl(gambarUtama || gambar || "/placeholder.svg");

  // Format date
  const displayDate = formatTanggal(
    tanggalPublikasi || createdAt || new Date().toISOString()
  );

  // Calculate reading time if not available
  const readingTime = waktuBaca || Math.ceil((isi?.length || 0) / 1000);

  // Get author info
  const authorName =
    typeof penulis === "object" ? penulis.nama : penulis || "Admin";
  const authorAvatar =
    typeof penulis === "object" && penulis.avatar
      ? getImageUrl(penulis.avatar)
      : null;

  // Get category info
  const categories = Array.isArray(kategori)
    ? kategori
    : category
    ? [category]
    : [];

  // Format content - parse HTML content safely
  const createMarkup = () => {
    let content = isi || "";

    // Debug: log the original content
    console.log("Original content:", content);

    // Clean up content and ensure proper paragraph formatting
    content = content
      .replace(/<br\s*\/?>/gi, "\n") // Convert BR tags to newlines
      .replace(/<\/p>\s*<p>/gi, "\n\n") // Convert P tags to double newlines
      .replace(/<p>/gi, "") // Remove opening P tags
      .replace(/<\/p>/gi, "") // Remove closing P tags
      .split("\n") // Split by newlines
      .map((line) => line.trim()) // Trim each line
      .filter((line) => line.length > 0) // Remove empty lines
      .map(
        (line) =>
          `<p style="margin-bottom: 1.5em; text-align: justify; line-height: 1.8;">${line}</p>`
      ) // Wrap in styled P tags
      .join("");

    // Debug: log the processed content
    console.log("Processed content:", content);

    return { __html: content };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/article">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Artikel
          </Link>
        </Button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          {judul}
        </h1>

        {/* Date and Info */}
        <div className="flex flex-wrap items-center justify-end gap-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {displayDate}
            </div>

            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {readingTime} menit baca
            </div>

            <div className="flex items-center text-muted-foreground text-sm">
              <Eye className="h-4 w-4 mr-1" />
              {dilihat || 0} dilihat
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat, idx) => (
            <Badge key={idx} variant="secondary">
              {typeof cat === "object"
                ? cat.title
                : (cat || "").replace(/-/g, " ")}
            </Badge>
          ))}
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={displayImage}
            alt={judul}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>

        {/* Article Content */}
        <article className="mb-10">
          {isi ? (
            <div
              dangerouslySetInnerHTML={createMarkup()}
              className="article-content"
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#333",
                textAlign: "justify",
              }}
            />
          ) : (
            <p className="text-muted-foreground">
              Konten artikel tidak tersedia
            </p>
          )}
        </article>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-end gap-4 py-4 border-t border-b mb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Simpan
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  to={`/article/${
                    relatedArticle.slug ||
                    `id/${relatedArticle._id || (relatedArticle as any).id}`
                  }`}
                  key={relatedArticle._id || (relatedArticle as any).id}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg mb-3">
                    <img
                      src={getImageUrl(
                        relatedArticle.gambarUtama ||
                          relatedArticle.gambar ||
                          "/placeholder.svg"
                      )}
                      alt={relatedArticle.judul}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium line-clamp-2 group-hover:text-primary">
                    {relatedArticle.judul}
                  </h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatTanggal(
                      relatedArticle.tanggalPublikasi ||
                        relatedArticle.createdAt ||
                        ""
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Button Floating */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={handleShare}
            title="Bagikan artikel"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
