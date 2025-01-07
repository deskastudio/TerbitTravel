import AdminLayout from "@/components/layouts/AdminLayout";
import ReviewPage from "@/components/partials/adminPartials/review/Index";

const Review = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <ReviewPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Review;