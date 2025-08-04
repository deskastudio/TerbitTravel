"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Eye,
  Bookmark,
  BookmarkCheck,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ArrowLeft,
  MessageCircle,
  Share,
  Heart,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PenLine,
  Image,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useArticle } from "@/hooks/use-article";
import { getImageUrl } from "@/utils/image-helper";

// Format date
const formatTanggal = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy", { locale: id });
};

// Related article component
const RelatedArticleCard = ({
  article,
  onClick,
}: {
  article: any;
  onClick: () => void;
}) => {
  if (!article) return null;

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={getImageUrl(
            article.gambar || article.gambarUtama || "/placeholder.svg"
          )}
          alt={article.judul}
          className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          {article.kategori && article.kategori[0] && (
            <Badge className="bg-primary/80 text-white mb-2">
              {typeof article.kategori[0] === "string"
                ? article.kategori[0].replace(/-/g, " ")
                : article.kategori[0].title || "Kategori"}
            </Badge>
          )}
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary-foreground transition-colors">
            {article.judul}
          </h3>
          <div className="flex items-center mt-2 text-xs text-gray-200">
            <Calendar className="h-3 w-3 mr-1" />
            {formatTanggal(
              article.tanggalPublikasi ||
                article.createdAt ||
                new Date().toISOString()
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Comment component
const CommentCard = ({
  comment,
  onLike,
}: {
  comment: any;
  onLike: (id: string) => void;
}) => {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={comment.avatar || "/placeholder.svg"}
          alt={comment.nama}
        />
        <AvatarFallback>{comment.nama?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{comment.nama}</div>
          <div className="text-xs text-muted-foreground">
            {comment.tanggal ? formatTanggal(comment.tanggal) : ""}
          </div>
        </div>
        <p className="mt-2 text-sm">{comment.isi}</p>
        <div className="mt-2 flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onLike(comment.id)}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{comment.likes || 0} suka</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Balas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Sample article data untuk fallback
const artikelData = {
  id: "1",
  judul: "10 Pantai Tersembunyi di Bali yang Belum Banyak Dikunjungi Wisatawan",
  slug: "pantai-tersembunyi-bali",
  ringkasan:
    "Jelajahi keindahan pantai-pantai tersembunyi di Bali yang masih alami dan belum terjamah oleh keramaian wisatawan.",
  isi: `<p>Bali, pulau yang terkenal dengan keindahan alamnya, memiliki banyak pantai tersembunyi yang belum banyak dikunjungi wisatawan. Pantai-pantai ini menawarkan keindahan alam yang masih alami dan jauh dari keramaian.</p>
  
  <h2>1. Pantai Nyang Nyang</h2>
  <p>Terletak di Pecatu, Bali Selatan, Pantai Nyang Nyang menawarkan pemandangan laut yang spektakuler. Untuk mencapai pantai ini, Anda harus menuruni sekitar 500 anak tangga, tetapi pemandangan yang ditawarkan sepadan dengan usaha Anda.</p>
  
  <p>Dengan pasir putih yang membentang sekitar 1,5 kilometer dan air laut yang jernih, pantai ini menjadi tempat yang sempurna untuk bersantai dan menikmati keindahan alam. Tidak banyak fasilitas yang tersedia di sini, jadi pastikan untuk membawa persediaan makanan dan minuman yang cukup.</p>
  
  <h2>2. Pantai Gunung Payung</h2>
  <p>Pantai ini terletak di Kutuh, Bali Selatan. Pantai Gunung Payung menawarkan pemandangan tebing karang yang menakjubkan dan air laut yang jernih. Pantai ini cocok untuk berenang dan snorkeling.</p>
  
  <p>Untuk mencapai pantai ini, Anda harus menuruni tangga yang cukup panjang. Namun, pemandangan yang disuguhkan sangat memukau dengan tebing karang yang hijau dan laut biru yang kontras.</p>`,
  gambar: "/placeholder.svg?height=600&width=1200",
  gambarThumbnail: "/placeholder.svg?height=400&width=600",
  kategori: ["wisata-alam", "pantai", "bali"],
  penulis: {
    nama: "Andi Wijaya",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Travel blogger dan fotografer yang telah menjelajahi lebih dari 50 destinasi wisata di Indonesia.",
  },
  tanggalPublikasi: "2023-06-15",
  waktuBaca: 5,
  dilihat: 1250,
  komentar: [
    {
      id: "k1",
      nama: "Budi Santoso",
      avatar: "/placeholder.svg?height=40&width=40",
      isi: "Artikel yang sangat informatif! Saya jadi ingin mengunjungi Pantai Nyang Nyang.",
      tanggal: "2023-06-16",
      likes: 5,
    },
    {
      id: "k2",
      nama: "Siti Nurbaya",
      avatar: "/placeholder.svg?height=40&width=40",
      isi: "Terima kasih infonya. Pantai Green Bowl memang sangat indah, saya pernah ke sana tahun lalu.",
      tanggal: "2023-06-17",
      likes: 3,
    },
  ],
  artikelTerkait: [
    {
      id: "2",
      judul: "5 Aktivitas Seru yang Bisa Dilakukan di Pantai Kuta Bali",
      slug: "aktivitas-pantai-kuta-bali",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["wisata-alam", "pantai", "bali"],
      tanggalPublikasi: "2023-05-20",
    },
    {
      id: "3",
      judul: "Panduan Lengkap Berwisata ke Bali untuk Pemula",
      slug: "panduan-wisata-bali-pemula",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["tips-travel", "bali"],
      tanggalPublikasi: "2023-04-10",
    },
    {
      id: "4",
      judul: "7 Kuliner Khas Bali yang Wajib Dicoba",
      slug: "kuliner-khas-bali",
      gambar: "/placeholder.svg?height=200&width=300",
      kategori: ["wisata-kuliner", "bali"],
      tanggalPublikasi: "2023-07-05",
    },
  ],
};

export default function ArticleDetail() {
  const params = useParams();
  const { slug, id: articleId } = params;
  const navigate = useNavigate();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  // Menentukan ID/slug yang akan digunakan
  const identifier = slug || articleId || "";

  console.log("Article Detail params:", params);
  console.log("Using identifier:", identifier);

  // Integrasi dengan hook
  const { useArticleDetail } = useArticle();
  const { article, isLoading, error } = useArticleDetail(identifier);

  // State untuk UI interaksi
  const [komentarBaru, setKomentarBaru] = useState("");
  const [namaKomentar, setNamaKomentar] = useState("");
  const [emailKomentar, setEmailKomentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localArticle, setLocalArticle] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  // Extract headings for Table of Contents
  const [tableOfContents, setTableOfContents] = useState<any[]>([]);

  // Jika tidak ada API data, gunakan sample data
  useEffect(() => {
    if (!isLoading && article) {
      console.log("Setting article from API:", article);
      setLocalArticle(article);
      setLikeCount(article.likes || 0);
    } else if (!isLoading && !article && error) {
      console.log("Using sample article data due to error");
      setLocalArticle(artikelData);
      setLikeCount((artikelData as any).likes || 0);
    }
  }, [article, isLoading, error]);

  // Ekstrak heading untuk TOC dari article content setelah render
  useEffect(() => {
    if (localArticle && contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h2, h3");
      const toc = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: heading.tagName === "H2" ? 2 : 3,
        };
      });
      setTableOfContents(toc);
    }
  }, [localArticle]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const contentElement = contentRef.current;
        const totalHeight = contentElement.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const currentPosition = scrollTop + windowHeight;

        // Calculate the offset for when content begins and ends
        const contentTop = contentElement.offsetTop;
        const contentBottom = contentTop + totalHeight;

        // Calculate progress only when scrolling through the content
        if (currentPosition >= contentTop) {
          const progress = Math.min(
            100,
            ((currentPosition - contentTop) / (contentBottom - contentTop)) *
              100
          );
          setReadingProgress(progress);
        }

        // Update active section for TOC
        if (tableOfContents.length > 0) {
          // Find the heading that is currently in view
          for (let i = tableOfContents.length - 1; i >= 0; i--) {
            const heading = document.getElementById(tableOfContents[i].id);
            if (heading && heading.getBoundingClientRect().top <= 100) {
              setActiveSection(tableOfContents[i].id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  const handleSubmitKomentar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!komentarBaru.trim() || !namaKomentar.trim() || !emailKomentar.trim())
      return;

    setIsSubmitting(true);
    // Simulate submitting comment
    setTimeout(() => {
      // Add comment to local state first for immediate feedback
      const newComment = {
        id: `temp-${Date.now()}`,
        nama: namaKomentar,
        isi: komentarBaru,
        tanggal: new Date().toISOString(),
        likes: 0,
      };

      setLocalArticle((prev: any) => ({
        ...prev,
        komentar: [...(prev.komentar || []), newComment],
      }));

      // Clear form
      setKomentarBaru("");
      setNamaKomentar("");
      setEmailKomentar("");
      setIsSubmitting(false);

      // Show success toast
      toast({
        title: "Komentar terkirim",
        description:
          "Komentar Anda berhasil dikirim dan sedang menunggu moderasi.",
      });
    }, 1000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = localArticle?.judul || "Artikel menarik";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          title + " " + url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }

    toast({
      title: "Berbagi",
      description: `Artikel dibagikan ke ${platform}`,
    });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link disalin",
        description: "Link artikel telah disalin ke clipboard",
      });
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);

    toast({
      title: isBookmarked
        ? "Artikel dihapus dari bookmark"
        : "Artikel disimpan",
      description: isBookmarked
        ? "Artikel telah dihapus dari daftar bacaan Anda"
        : "Artikel telah ditambahkan ke daftar bacaan Anda",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    toast({
      title: isLiked ? "Suka dihapus" : "Artikel disukai",
      description: isLiked
        ? "Anda telah menghapus suka dari artikel ini"
        : "Terima kasih telah menyukai artikel ini!",
    });
  };

  const handleCommentLike = (commentId: string) => {
    if (!localArticle) return;

    setLocalArticle((prev: any) => ({
      ...prev,
      komentar: (prev.komentar || []).map((comment: any) =>
        comment.id === commentId
          ? { ...comment, likes: (comment.likes || 0) + 1 }
          : comment
      ),
    }));

    toast({
      title: "Suka",
      description: "Anda menyukai komentar ini",
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const handleGoBack = () => {
    navigate("/article");
  };

  const handleViewRelatedArticle = (article: any) => {
    if (article.slug) {
      navigate(`/article/${article.slug}`);
    } else {
      navigate(`/article/id/${article.id}`);
    }
  };

  // Function to open gallery modal
  const openGallery = (index: number = 0) => {
    setCurrentGalleryImage(index);
    setImageGalleryOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-[60vh] w-full rounded-xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!localArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button onClick={handleGoBack}>Kembali ke Artikel</Button>
        </div>
      </div>
    );
  }

  // Prepare gallery images
  const galleryImages =
    localArticle.galeri ||
    [localArticle.gambar || localArticle.gambarUtama].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-primary transition-all"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb dan Tombol Kembali */}
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 p-0 hover:bg-transparent"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Artikel</span>
          </Button>

          {/* Social share buttons for mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Kategori */}
        <div className="flex flex-wrap gap-2 mb-4">
          {localArticle.kategori && Array.isArray(localArticle.kategori) ? (
            localArticle.kategori.map((kategori: any, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-muted/50">
                {typeof kategori === "string"
                  ? kategori.replace(/-/g, " ")
                  : kategori.title || "Kategori"}
              </Badge>
            ))
          ) : localArticle.category ? (
            <Badge variant="outline" className="bg-muted/50">
              {typeof localArticle.category === "string"
                ? localArticle.category
                : localArticle.category.title || "Kategori"}
            </Badge>
          ) : null}
        </div>

        {/* Judul Artikel */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          {localArticle.judul}
        </h1>

        {/* Ringkasan */}
        {localArticle.ringkasan && (
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {localArticle.ringkasan}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage
                src={
                  typeof localArticle.penulis === "object"
                    ? localArticle.penulis.avatar
                    : "/placeholder.svg"
                }
                alt={
                  typeof localArticle.penulis === "object"
                    ? localArticle.penulis.nama
                    : "Penulis"
                }
              />
              <AvatarFallback>
                {typeof localArticle.penulis === "object"
                  ? localArticle.penulis.nama.charAt(0)
                  : "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">
                {typeof localArticle.penulis === "object"
                  ? localArticle.penulis.nama
                  : localArticle.penulis || "Penulis"}
              </div>
              <div className="text-xs">
                Penulis •{" "}
                {formatTanggal(
                  localArticle.tanggalPublikasi ||
                    localArticle.createdAt ||
                    new Date().toISOString()
                )}
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {localArticle.waktuBaca || 5} menit baca
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {(typeof localArticle.dilihat === "number"
              ? localArticle.dilihat.toLocaleString()
              : localArticle.dilihat) || "0"}{" "}
            dilihat
          </div>
          <div className="flex items-center">
            <Heart
              className={`h-4 w-4 mr-1 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {likeCount} suka
          </div>
        </div>

        {/* Featured Image with Caption */}
        <div className="relative mb-8 overflow-hidden rounded-xl group">
          <img
            src={getImageUrl(
              localArticle.gambarUtama ||
                localArticle.gambar ||
                "/placeholder.svg"
            )}
            alt={localArticle.judul}
            className="w-full object-cover h-[60vh] object-center"
          />

          {/* Gallery button */}
          {galleryImages.length > 0 && (
            <Button
              variant="outline"
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white gap-2"
              onClick={() => openGallery()}
            >
              <Camera className="h-4 w-4" />
              <span>Lihat {galleryImages.length} Foto</span>
            </Button>
          )}

          {/* Caption if exists */}
          {localArticle.caption && (
            <div className="text-sm text-muted-foreground mt-2 italic text-center">
              {localArticle.caption}
            </div>
          )}
        </div>

        {/* Main content layout with sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <div className="md:w-1/4 order-2 md:order-1">
            <div className="sticky top-24">
              {/* Social share buttons */}
              <div className="hidden md:flex flex-col items-center gap-3 mb-8">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleLike}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {isLiked ? "Batal Suka" : "Suka Artikel"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleBookmark}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {isBookmarked ? "Hapus Bookmark" : "Simpan Artikel"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleShare("facebook")}
                      >
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Bagikan ke Facebook
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleShare("twitter")}
                      >
                        <Twitter className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Bagikan ke Twitter
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleShare("whatsapp")}
                      >
                        <Share className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Bagikan ke WhatsApp
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleCopyLink}
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Salin Link</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4 mb-8">
                  <div
                    className="flex items-center justify-between mb-2 cursor-pointer"
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                  >
                    <h3 className="font-bold">Daftar Isi</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {showTableOfContents ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </Button>
                  </div>

                  {showTableOfContents && (
                    <ul className="space-y-2 mt-4">
                      {tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          className={`cursor-pointer hover:text-primary transition-colors text-sm ${
                            activeSection === item.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          } ${item.level === 3 ? "ml-4" : ""}`}
                          onClick={() => scrollToSection(item.id)}
                        >
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 order-1 md:order-2">
            {/* Article Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none mb-12 prose-headings:scroll-mt-20"
              dangerouslySetInnerHTML={{ __html: localArticle.isi }}
            />

            {/* Tags if available */}
            {localArticle.tags && localArticle.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {localArticle.tags.map((tag: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="bg-muted/20 rounded-xl p-6 mb-12 border border-border">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      typeof localArticle.penulis === "object"
                        ? localArticle.penulis.avatar
                        : "/placeholder.svg"
                    }
                    alt={
                      typeof localArticle.penulis === "object"
                        ? localArticle.penulis.nama
                        : "Penulis"
                    }
                  />
                  <AvatarFallback>
                    {typeof localArticle.penulis === "object"
                      ? localArticle.penulis.nama.charAt(0)
                      : "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold mb-1">Tentang Penulis</h3>
                  <h4 className="font-medium mb-2">
                    {typeof localArticle.penulis === "object"
                      ? localArticle.penulis.nama
                      : localArticle.penulis || "Penulis"}
                  </h4>
                  <p className="text-muted-foreground">
                    {typeof localArticle.penulis === "object" &&
                    localArticle.penulis.bio
                      ? localArticle.penulis.bio
                      : "Penulis artikel di platform kami."}
                  </p>
                </div>
              </div>
            </div>

            {/* Like and Comment Section */}
            <div className="flex items-center justify-between mb-8 p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${isLiked ? "bg-primary/90" : ""}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
                  <span>{likeCount} Suka</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    const element = document.getElementById("komentar-section");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{localArticle.komentar?.length || 0} Komentar</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={handleBookmark}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                  <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {localArticle.artikelTerkait &&
          localArticle.artikelTerkait.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                Artikel Terkait
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localArticle.artikelTerkait.map(
                  (terkait: any, idx: number) => (
                    <RelatedArticleCard
                      key={terkait.id || idx}
                      article={terkait}
                      onClick={() => handleViewRelatedArticle(terkait)}
                    />
                  )
                )}
              </div>
            </div>
          )}

        {/* Comment Section */}
        <div id="komentar-section" className="mb-12 scroll-mt-20">
          <Tabs defaultValue="komentar" className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="komentar">
                Komentar ({localArticle.komentar?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="tulis-komentar">Tulis Komentar</TabsTrigger>
            </TabsList>

            <TabsContent value="komentar">
              <div className="space-y-4">
                {localArticle.komentar && localArticle.komentar.length > 0 ? (
                  localArticle.komentar.map((komen: any, idx: number) => (
                    <CommentCard
                      key={komen.id || idx}
                      comment={komen}
                      onLike={handleCommentLike}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-2">
                      Belum ada komentar
                    </h3>
                    <p className="text-muted-foreground">
                      Jadilah yang pertama memberikan komentar!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tulis-komentar">
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PenLine className="h-5 w-5" />
                  Tulis Komentar Anda
                </h3>

                <form onSubmit={handleSubmitKomentar} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nama"
                        className="block font-medium mb-1 text-sm"
                      >
                        Nama
                      </label>
                      <Input
                        id="nama"
                        type="text"
                        value={namaKomentar}
                        onChange={(e) => setNamaKomentar(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-medium mb-1 text-sm"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={emailKomentar}
                        onChange={(e) => setEmailKomentar(e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="komentar"
                      className="block font-medium mb-1 text-sm"
                    >
                      Komentar
                    </label>
                    <textarea
                      id="komentar"
                      className="w-full p-3 border border-border rounded-md min-h-[120px] focus:border-primary focus:ring-1 focus:ring-primary"
                      value={komentarBaru}
                      onChange={(e) => setKomentarBaru(e.target.value)}
                      placeholder="Tulis komentar Anda di sini..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Komentar"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Newsletter */}
        <div className="rounded-lg bg-primary/10 p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Dapatkan Artikel Terbaru</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Berlangganan newsletter kami untuk mendapatkan update artikel
            menarik langsung ke inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Email Anda" className="flex-1" />
            <Button>Berlangganan</Button>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {imageGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setImageGalleryOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>

          <div className="relative">
            <img
              src={galleryImages[currentGalleryImage] || "/placeholder.svg"}
              alt={`Gallery image ${currentGalleryImage + 1}`}
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />

            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full"
                  onClick={() =>
                    setCurrentGalleryImage((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full"
                  onClick={() =>
                    setCurrentGalleryImage((prev) =>
                      prev === galleryImages.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {currentGalleryImage + 1} / {galleryImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
