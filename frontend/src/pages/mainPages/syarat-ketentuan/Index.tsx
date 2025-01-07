import MainLayout from "@/components/layouts/MainLayout";
import SyaratKetentuanPage from "@/components/partials/mainPartials/syarat-ketentuan/Index"

const SyaratKetentuan = () => {
    return (
        <>
        <MainLayout>
            <div className="container mx-auto py-32">
                <SyaratKetentuanPage />
            </div>
        </MainLayout>
        </>
    )
}

export default SyaratKetentuan;