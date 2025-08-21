import AdminLayout from "@/components/layouts/AdminLayout";
import EditArticlePage from "@/components/partials/adminPartials/article/edit-article";

const EditArticle = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditArticlePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditArticle;