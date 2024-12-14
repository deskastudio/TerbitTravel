// src/pages/Home.tsx
import MainLayout from "@/components/layouts/MainLayout";
import Banner from "@/components/partials/mainPartials/Banner";
import Layanan from "@/components/partials/mainPartials/Layanan";
import Destinasi from "@/components/partials/mainPartials/Destination";
import Hero from "@/components/partials/mainPartials/Hero";
import KerjaSamaMitra from "@/components/partials/mainPartials/KerjaSamaMitra";
import Review from "@/components/partials/mainPartials/Review";

const Homepage = () => {
  return (
    <MainLayout>
      <Hero />
      <Banner />
      <Layanan />
      <Destinasi />
      <KerjaSamaMitra />
      <Review />
    </MainLayout>
  );
};

export default Homepage;
