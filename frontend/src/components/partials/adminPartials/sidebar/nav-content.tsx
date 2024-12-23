"use client";

import React from "react";
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Content = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type NavContentProps = {
  Contents: Content[];
};

const NavContent: React.FC<NavContentProps> = ({ Contents }) => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleViewProject = (url: string) => {
    navigate(url); // Navigasi ke URL yang diberikan
  };

  const handleAddProject = (url: string) => {
    navigate(url); // Navigasi ke halaman "Tambah Proyek"
  };

  const handleDeleteProject = (url: string) => {
    navigate(url); // Navigasi ke halaman konfirmasi penghapusan proyek
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {Contents.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => handleViewProject(item.url)}>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddProject("/admin-add-article")}>
                  <Forward className="text-muted-foreground" />
                  <span>Tambah Artikel</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDeleteProject("/delete-project-url")}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavContent;
