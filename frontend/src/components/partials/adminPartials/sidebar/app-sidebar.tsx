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
  Image,
} from "lucide-react";

import NavMain from "../sidebar/nav-main";
import NavProjects from "../sidebar/nav-project";
import NavContent from "../sidebar/nav-content";
import NavProfile from "../sidebar/nav-profile";
import {
  Sidebar,
  SidebarContent,
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
          { title: "Data Destinasi", url: "/admin/destination" },
          { title: "Tambah Destinasi", url: "/admin/destination/add" },
        ],
      },
      {
        title: "Armada",
        url: "#",
        icon: Car,
        items: [
          { title: "Data Armada", url: "/admin/armada" },
          { title: "Tambah Armada", url: "/admin/armada/add" },
        ],
      },
      {
        title: "Konsumsi",
        url: "#",
        icon: UtensilsCrossed,
        items: [
          { title: "Data Konsumsi", url: "/admin/consumption" },
          { title: "Tambah Konsumsi", url: "/admin/consumption/add" },
        ],
      },
      {
        title: "Hotel",
        url: "#",
        icon: Building2,
        items: [
          { title: "Data Hotel", url: "/admin/hotel" },
          { title: "Tambah Hotel", url: "/admin/hotel/add" },
        ],
      },
    ],
    navProfile: [
      {
        title: "Profile",
        url: "#",
        icon: Bot,
        items: [
          { title: "Tentang Terbit", url: "/admin/tentang-terbit" },
          { title: "Galeri Terbit", url: "/admin/galeri-terbit" },
          { title: "Lisensi Terbit", url: "/admin/lisensi-terbit" },
          { title: "Partner Terbit", url: "/admin/partner-terbit" },
          { title: "Tim Terbit", url: "/admin/tim-terbit" },
          { title: "Banner Terbit", url: "/admin/banner-terbit" },
        ],
      },
    ],
    projects: [
      { name: "Dashboard", url: "/admin/dashboard", icon: PieChart },
      { name: "Paket Wisata", url: "/admin/paket-wisata", icon: Map },
      { name: "Pemesanan", url: "/admin/booking", icon: ShoppingCart },
      { name: "Data User", url: "/admin/user", icon: Users },
    ],
    NavContent: [
      { name: "Artikel", url: "/admin/article", icon: FileText },
      { name: "Banner", url: "/admin/banner", icon: Image },
      { name: "Testimoni", url: "/admin/testimoni", icon: MessageSquare },
    ]
  }), []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavProfile items={data.navProfile} />
        <NavContent Contents={data.NavContent} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;