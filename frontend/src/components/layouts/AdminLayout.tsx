// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import AppSidebar from "@/components/partials/adminPartials/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserNav from "@/components/partials/adminPartials/sidebar/user-nav";
import { Separator } from "@/components/ui/separator";


interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
    {/* Header Section */}
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header Section */}
        <header className="flex h-16 items-center gap-2 px-4 bg-background border-b md:px-8">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            {/* <Search /> */}
            <UserNav />
          </div>
        </header>

      {/* Main content */}
      <main > 
        {children}
      </main>

      </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
