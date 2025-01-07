import AdminLayout from "@/components/layouts/AdminLayout";
import AddHotelPage from "@/components/partials/adminPartials/hotel/add-hotel";
import { Toaster } from "@/components/ui/toaster";

const AddHotel = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddHotelPage />
        <Toaster/>
      </div>
    </AdminLayout>

    </>
  )
}

export default AddHotel;