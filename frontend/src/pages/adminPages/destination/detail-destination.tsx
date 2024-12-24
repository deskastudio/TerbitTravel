import AdminLayout from "@/components/layouts/AdminLayout";
import DetailDestinationPage from "@/components/partials/adminPartials/destination/detail-destination";

const DetailDestination = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailDestinationPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailDestination;