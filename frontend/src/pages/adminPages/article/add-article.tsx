import AdminLayout from "@/components/layouts/AdminLayout";
import AddArticlePage from "@/components/partials/adminPartials/article/add-article";

const AddArticle = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddArticlePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default AddArticle;