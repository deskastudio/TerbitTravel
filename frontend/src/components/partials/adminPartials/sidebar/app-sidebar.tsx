import React from "react";
import {
  AudioWaveform,
  Bot,
  Building2,
  Car,
  Command,
  Compass,
  FileText,
  GalleryVerticalEnd,
  Map,
  MessageSquare,
  PieChart,
  ShoppingCart,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import NavMain from "../sidebar/nav-main";
import NavProjects from "../sidebar/nav-project";
import NavUser from "../sidebar/nav-user";
import TeamSwitcher from "../sidebar/nav-switcher";
import NavContent from "../sidebar/nav-content";
import NavProfile from "../sidebar/nav-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = (props) => {
  const data = React.useMemo(() => ({
    user: {
      name: "Travedia Terbit Semesta",
      email: "travediaterbitsemesta@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Destinasi",
        url: "#",
        icon: Compass,
        items: [
          { title: "Data Destinasi", url: "/admin-all-destination" },
          { title: "Tambah Destinasi", url: "/admin-add-destination" },
        ],
      },
      {
        title: "Armada",
        url: "#",
        icon: Car,
        items: [
          { title: "Data Armada", url: "/admin-all-armada" },
          { title: "Tambah Armada", url: "/admin-add-armada" },
        ],
      },
      {
        title: "Konsumsi",
        url: "#",
        icon: UtensilsCrossed,
        items: [
          { title: "Data Konsumsi", url: "/admin-all-consumption" },
          { title: "Tambah Konsumsi", url: "/admin-add-consumption" },
        ],
      },
      {
        title: "Hotel",
        url: "#",
        icon: Building2,
        items: [
          { title: "Data Hotel", url: "/admin-all-hotel" },
          { title: "Tambah Hotel", url: "/admin-add-hotel" },
        ],
      },
    ],
    navProfile: [
      {
        title: "Profile",
        url: "#",
        icon: Bot,
        items: [
          { title: "Tentang Terbit", url: "/admin-about" },
          { title: "Galeri Terbit", url: "/admin-gallery" },
          { title: "Lisensi Terbit", url: "/admin-licences" },
          { title: "Partner Terbit", url: "/admin-partner" },
          { title: "Tim Terbit", url: "/admin-team" },
          { title: "Banner Terbit", url: "/admin-banner" },
        ],
      },
    ],
    projects: [
      { name: "Dashboard", url: "/admin-dashboard", icon: PieChart },
      { name: "Paket Wisata", url: "/admin-all-package-tour", icon: Map },
      { name: "Pemesanan", url: "/admin-all-booking", icon: ShoppingCart },
      { name: "Data User", url: "/admin-all-user", icon: Users },
    ],
    NavContent: [
      { name: "Artikel", url: "/admin-all-article", icon: FileText },
      { name: "Testimoni", url: "/admin-all-review", icon: MessageSquare },
    ]
  }), []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavProfile items={data.navProfile} />
        <NavContent Contents={data.NavContent} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
