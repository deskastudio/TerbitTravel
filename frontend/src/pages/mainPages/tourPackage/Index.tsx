import MainLayout from "@/components/layouts/MainLayout";
import TourPackagesPage from "@/components/partials/mainPartials/tourPackage/Index";

const tourPackage = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <TourPackagesPage />
            </div>
            
        </MainLayout>
        </>
    )
}

export default tourPackage;