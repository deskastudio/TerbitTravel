import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ArticleDialog from "./ArticleDialog"
import Article from "@/types/Article"

interface ArticleCardProps {
  article: Article
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{article.excerpt}</p>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`} />
            <AvatarFallback>{article.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{article.author}</p>
            <p className="text-sm text-muted-foreground">{article.date}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <ArticleDialog article={article} />
      </CardFooter>
    </Card>
  )
}

export default ArticleCard;
