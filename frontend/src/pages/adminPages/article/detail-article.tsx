import AdminLayout from "@/components/layouts/AdminLayout";
import DetailArticlePage from "@/components/partials/adminPartials/article/detail-article";

const DetailArticle = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailArticlePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailArticle;