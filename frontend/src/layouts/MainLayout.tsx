// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import Header from "@/components/fragments/Header";
import Layanan from "@/components/fragments/Layanan";
import Destinasi from "@/components/fragments/Destinasi";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main content area wrapped in container */}
      <main className="">
        {children}
      </main>

      <Layanan />
      <Destinasi />
    </>
  );
};

export default MainLayout;
