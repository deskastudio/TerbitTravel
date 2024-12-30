import MainLayout from "@/components/layouts/MainLayout";
import PrivacyPolicyPage from "@/components/partials/mainPartials/privacy-policy/Index";

const PrivacyPolicy = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <PrivacyPolicyPage />
            </div>
        </MainLayout>
        </>
    )
}

export default PrivacyPolicy;