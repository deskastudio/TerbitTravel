import AdminLayout from "@/components/layouts/AdminLayout";
import TourPackagePage from "@/components/partials/adminPartials/tourPackage/Index";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TourPackage = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
      <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tour Packages</h1>
        <Button asChild>
          <Link to="/admin-add-package-tour">
            <span className="hidden md:inline">Add New Package</span>
            <span className="md:hidden">Add New</span>
          </Link>
        </Button>
      </div>
      <TourPackagePage />
    </div>
      </div>
    </AdminLayout>

    </>
  )
}

export default TourPackage;