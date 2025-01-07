import MainLayout from "@/components/layouts/MainLayout";
import DestinationPage from "@/components/partials/mainPartials/destination/Index"


const Destination = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <DestinationPage />
            </div>
        </MainLayout>
        </>
    )
}

export default Destination;
