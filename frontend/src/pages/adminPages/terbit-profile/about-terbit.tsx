import AdminLayout from "@/components/layouts/AdminLayout";
import AboutTerbitPage from "@/components/partials/adminPartials/terbit-profile/about-terbit";

const AboutTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AboutTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default AboutTerbit;