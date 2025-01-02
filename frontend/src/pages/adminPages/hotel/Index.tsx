import AdminLayout from "@/components/layouts/AdminLayout";
import HotelPage from "@/components/partials/adminPartials/hotel/Index";

const Hotel = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <HotelPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Hotel;