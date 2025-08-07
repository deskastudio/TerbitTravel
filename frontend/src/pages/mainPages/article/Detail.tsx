import MainLayout from "@/components/layouts/MainLayout";
import ArticleDetail from "@/components/partials/mainPartials/article/ArticleDetail";

const ArticleDetailPage = () => {
  return (
    <MainLayout>
      <div className="py-24">
        <ArticleDetail />
      </div>
    </MainLayout>
  );
};

export default ArticleDetailPage;
