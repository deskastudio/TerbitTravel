import MainLayout from "@/components/layouts/MainLayout";
import ProfilePage from "@/components/partials/mainPartials/profile/Index"

const Profile = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <ProfilePage />
            </div>
        </MainLayout>
        </>
    )
}

export default Profile;