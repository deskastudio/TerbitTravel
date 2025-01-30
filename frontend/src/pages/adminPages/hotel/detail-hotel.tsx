import AdminLayout from "@/components/layouts/AdminLayout";
import DetailHotelPage from "@/components/partials/adminPartials/hotel/detail-hotel";

const DetailHotel = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailHotelPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailHotel;