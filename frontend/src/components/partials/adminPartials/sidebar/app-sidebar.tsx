import React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Folder,
  Forward,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Trash2,
} from "lucide-react";

import NavMain from "../sidebar/nav-main";
import NavProjects from "../sidebar/nav-project";
import NavUser from "../sidebar/nav-user";
import TeamSwitcher from "../sidebar/nav-switcher";
import NavContent from "../sidebar/nav-content";
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
        icon: Bot,
        items: [
          { title: "Data Destinasi", url: "/admin-all-destination" },
          { title: "Tambah Destinasi", url: "/admin-add-destination" },
          { title: "Detail Destinasi", url: "/admin-detail-destination" },
        ],
      },
      {
        title: "Armada",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Data Armada", url: "/admin-all-armada" },
          { title: "Tambah Armada", url: "/admin-add-armada" },
          { title: "Detail Armada", url: "/admin-detail-armada" },
        ],
      },
      {
        title: "Konsumsi",
        url: "#",
        icon: Settings2,
        items: [
          { title: "Data Konsumsi", url: "/admin-all-consumption" },
          { title: "Tambah Konsumsi", url: "/admin-add-consumption" },
          { title: "Detail Konsumsi", url: "/admin-detail-consumption" },
        ],
      },
      {
        title: "Hotel",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Data Hotel", url: "/admin-all-hotel" },
          { title: "Tambah Hotel", url: "/admin-add-hotel" },
          { title: "Detail Hotel", url: "/admin-detail-hotel" },
        ],
      },
    ],
    projects: [
      { name: "Dashboard", url: "/admin-dashboard", icon: SquareTerminal },
      { name: "Paket Wisata", url: "/admin-all-package-tour", icon: PieChart },
      { name: "Pemesanan", url: "#", icon: Map },
    ],
    NavContent: [
      { name: "Artikel", url: "/admin-all-article", icon: Folder },
      { name: "Testimoni", url: "#", icon: Forward },
      { name: "Banner", url: "#", icon: Trash2 },
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
