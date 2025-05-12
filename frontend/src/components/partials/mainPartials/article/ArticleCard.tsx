import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock, Eye, Bookmark, Share2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IArticle } from "@/types/article.types";

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

export const ArticleCard = ({ article, isFeatured = false }: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    // Prioritas: slug dulu, lalu ID
    if (article.slug) {
      console.log(`Navigating to article detail with slug: ${article.slug}`);
      navigate(`/article/${article.slug}`);
    } else {
      const articleId = article._id || article.id;
      console.log(`Navigating to article detail with ID: ${articleId}`);
      navigate(`/article/id/${articleId}`);
    }
  };

  // Safety check to ensure we have all required data
  const displayImage = article.gambarUtama || article.gambar || "/placeholder.svg";
  const displayTitle = article.judul || "Artikel tanpa judul";
  const displayAuthor = article.penulis || "Penulis";
  const displayDate = article.tanggalPublikasi || article.createdAt || new Date().toISOString();
  
  // Calculate reading time based on content length (if not provided)
  const readingTime = article.waktuBaca || Math.ceil((article.isi?.length || 0) / 1000); // Approx. 1000 chars per min
  
  // Check if article is trending (if property exists)
  const isTrending = article.isTrending || false;

  if (isFeatured) {
    return (
      <div className="relative overflow-hidden rounded-xl cursor-pointer" onClick={handleViewDetail}>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img src={displayImage} alt={displayTitle} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.kategori && Array.isArray(article.kategori) ? (
              article.kategori.slice(0, 2).map((kategori, idx) => (
                <Badge key={idx} className="bg-primary/80 hover:bg-primary text-white">
                  {typeof kategori === 'string' 
                    ? kategori.replace(/-/g, " ") 
                    : kategori.title || 'Kategori'}
                </Badge>
              ))
            ) : article.category ? (
              <Badge className="bg-primary/80 hover:bg-primary text-white">
                {typeof article.category === 'string' 
                  ? article.category 
                  : article.category.title || 'Kategori'}
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
                  src={typeof article.penulis === 'object' ? article.penulis.avatar : "/placeholder.svg"} 
                  alt={typeof article.penulis === 'object' ? article.penulis.nama : displayAuthor} 
                />
                <AvatarFallback>
                  {typeof article.penulis === 'object' 
                    ? article.penulis.nama.charAt(0) 
                    : displayAuthor.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {typeof article.penulis === 'object' ? article.penulis.nama : displayAuthor}
                </div>
                <div className="text-xs text-gray-300">{formatTanggal(displayDate)}</div>
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
                  {typeof article.dilihat === 'number' 
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
        <img src={displayImage} alt={displayTitle} className="h-48 w-full object-cover" />
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
                {typeof kategori === 'string' 
                  ? kategori.replace(/-/g, " ") 
                  : kategori.title || 'Kategori'}
              </Badge>
            ))
          ) : article.category ? (
            <Badge variant="outline" className="bg-muted/50">
              {typeof article.category === 'string' 
                ? article.category 
                : article.category.title || 'Kategori'}
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
              {typeof article.dilihat === 'number' 
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
              src={typeof article.penulis === 'object' ? article.penulis.avatar : "/placeholder.svg"} 
              alt={typeof article.penulis === 'object' ? article.penulis.nama : displayAuthor} 
            />
            <AvatarFallback>
              {typeof article.penulis === 'object' 
                ? article.penulis.nama.charAt(0) 
                : displayAuthor.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">
            {typeof article.penulis === 'object' ? article.penulis.nama : displayAuthor}
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};