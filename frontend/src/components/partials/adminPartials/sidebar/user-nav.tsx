"use client";

import React, { useState } from "react";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/hooks/use-admin-auth"; // Import Admin Auth Hook

const NavUser: React.FC = () => {
  const { isMobile } = useSidebar();
  const { admin, logout, loading } = useAdminAuth(); // Gunakan Admin Auth Hook
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Handle logout dengan konfirmasi
  const handleLogout = async () => {
    try {
      await logout();
      setIsLogoutDialogOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLogoutDialogOpen(false);
    }
  };

  // Handle klik logout button
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogoutDialogOpen(true);
  };

  // Jika admin belum ada, return null atau loading state
  if (!admin) {
    return null;
  }

  // Generate initial dari nama user untuk avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={admin.avatar} alt={admin.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(admin.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{admin.name}</span>
                  <span className="truncate text-xs">{admin.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(admin.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{admin.name}</span>
                    <span className="truncate text-xs">{admin.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/admin-profile" 
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogoutClick}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                disabled={loading}
              >
                <LogOut className="h-4 w-4" />
                {loading ? 'Logging out...' : 'Keluar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Alert Dialog untuk konfirmasi logout */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Konfirmasi Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Apakah Anda yakin ingin keluar dari sistem? 
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Anda harus login kembali untuk mengakses dashboard.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel 
              onClick={() => setIsLogoutDialogOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging out...
                </div>
              ) : (
                'Ya, Keluar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NavUser;