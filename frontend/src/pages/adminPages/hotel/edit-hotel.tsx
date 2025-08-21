import AdminLayout from "@/components/layouts/AdminLayout";
import EditHotelPage from "@/components/partials/adminPartials/hotel/edit-hotel";

const EditHotel = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditHotelPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditHotel;