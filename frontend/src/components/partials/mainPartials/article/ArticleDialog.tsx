import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Article from "@/types/Article"

interface ArticleDialogProps {
  article: Article
}

const ArticleDialog = ({ article }: ArticleDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Read More</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>
            By {article.author} | {article.date}
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-64 mb-4">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <ScrollArea className="max-h-[60vh]">
          <p className="text-muted-foreground">{article.content}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleDialog;
