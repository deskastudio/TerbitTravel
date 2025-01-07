import AdminLayout from "@/components/layouts/AdminLayout";
import DestinationPage from "@/components/partials/adminPartials/destination/Index";

const Destination = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DestinationPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Destination;