import MainLayout from "@/components/layouts/MainLayout";
import AboutSection from "@/components/partials/mainPartials/profile/AboutSection";
import GallerySection from "@/components/partials/mainPartials/profile/GallerySection";
import HeroCarousel from "@/components/partials/mainPartials/profile/HeroCarousel";
import PartnersSection from "@/components/partials/mainPartials/profile/PartnerSection";
import TeamSection from "@/components/partials/mainPartials/profile/TeamSection";

const Profile = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <HeroCarousel />
                <AboutSection />
                <GallerySection />
                <PartnersSection />
                <TeamSection />
            </div>
        </MainLayout>
        </>
    )
}

export default Profile;