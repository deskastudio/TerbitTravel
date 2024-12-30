import AdminLayout from "@/components/layouts/AdminLayout";
import AddArticlePage from "@/components/partials/adminPartials/article/add-article";
import { Toaster } from "@/components/ui/toaster";

const AddArticle = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddArticlePage />
        <Toaster/>
      </div>
    </AdminLayout>

    </>
  )
}

export default AddArticle;