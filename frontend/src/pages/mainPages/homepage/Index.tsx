// src/pages/Home.tsx
import MainLayout from "@/components/layouts/MainLayout";
import Banner from "@/components/partials/mainPartials/homepage/Banner";
import Layanan from "@/components/partials/mainPartials/homepage/Layanan";
import Destinasi from "@/components/partials/mainPartials/homepage/Destination";
import Hero from "@/components/partials/mainPartials/homepage/Hero";
import KerjaSamaMitra from "@/components/partials/mainPartials/homepage/KerjaSamaMitra";
import Review from "@/components/partials/mainPartials/homepage/Review";

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
