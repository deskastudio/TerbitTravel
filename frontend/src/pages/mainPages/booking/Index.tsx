import MainLayout from "@/components/layouts/MainLayout";
import BookingPage from "@/components/partials/mainPartials/booking/booking-form";

const Article = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <BookingPage />
            </div>
        </MainLayout>
        </>
    )
}

export default Article;