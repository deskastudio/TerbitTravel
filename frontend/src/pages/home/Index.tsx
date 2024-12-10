// src/pages/Home.tsx
import MainLayout from "@/components/layouts/MainLayout";
import Banner from "@/components/partials/mainPartials/Banner";
import Layanan from "@/components/partials/mainPartials/Layanan";
import Destinasi from "@/components/partials/mainPartials/Destinasi";
import Hero from "@/components/partials/mainPartials/Hero";
import KerjaSamaMitra from "@/components/partials/mainPartials/KerjaSamaMitra";
import Review from "@/components/partials/mainPartials/Review";
import Footer from "@/components/partials/mainPartials/Footer";

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <Banner />
      <Layanan />
      <Destinasi />
      <KerjaSamaMitra />
      <Review />
      <Footer />
    </MainLayout>
  );
};

export default Home;
