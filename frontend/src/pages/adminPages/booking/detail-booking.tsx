import AdminLayout from "@/components/layouts/AdminLayout";
import DetailBookingsPage from "@/components/partials/adminPartials/booking/detail-booking";

const DetailBooking = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailBookingsPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailBooking;