import AdminLayout from "@/components/layouts/AdminLayout";
import GalleryTerbitPage from "@/components/partials/adminPartials/terbit-profile/gallery-terbit";

const GalleryTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <GalleryTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default GalleryTerbit;