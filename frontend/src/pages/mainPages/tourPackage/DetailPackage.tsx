import MainLayout from "@/components/layouts/MainLayout";
import TourPackageDetails from '@/components/partials/mainPartials/tourPackage/[id]/DetailPackage';

const DetailTourPackage = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <TourPackageDetails />
            </div>
        </MainLayout>
        </>
    )
}

export default DetailTourPackage;