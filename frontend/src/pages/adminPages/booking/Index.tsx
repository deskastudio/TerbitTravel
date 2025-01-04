import AdminLayout from "@/components/layouts/AdminLayout";
import BookingsPage from "@/components/partials/adminPartials/booking/Index";

const Bookings = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <BookingsPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Bookings;