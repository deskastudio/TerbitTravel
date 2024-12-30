import MainLayout from "@/components/layouts/MainLayout";
import FAQPage from "@/components/partials/mainPartials/faq/Index";

const Faq = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <FAQPage />
            </div>
        </MainLayout>
        </>
    )
}

export default Faq;