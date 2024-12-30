import MainLayout from "@/components/layouts/MainLayout";
import ArticlePage from "@/components/partials/mainPartials/article/Index"

const Article = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <ArticlePage />
            </div>
        </MainLayout>
        </>
    )
}

export default Article;