// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import Header from "@/components/partials/mainPartials/Header";

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

      {/* Footer */}
    </>
  );
};

export default MainLayout;
