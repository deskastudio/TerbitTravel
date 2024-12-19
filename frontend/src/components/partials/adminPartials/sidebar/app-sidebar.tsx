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
          { title: "Tambah Destinasi", url: "#" },
          { title: "Detail Destinasi", url: "#" },
        ],
      },
      {
        title: "Armada",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Tambah Armada", url: "#" },
          { title: "Detail Armada", url: "#" },
        ],
      },
      {
        title: "Konsumsi",
        url: "#",
        icon: Settings2,
        items: [
          { title: "Tambah Konsumsi", url: "#" },
          { title: "Detail Konsumsi", url: "#" },
        ],
      },
      {
        title: "Hotel",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Tambah Hotel", url: "#" },
          { title: "Detail Hotel", url: "#" },
        ],
      },
    ],
    projects: [
      { name: "Dashboard", url: "/admin-dashboard", icon: SquareTerminal },
      { name: "Paket Wisata", url: "/admin-all-package-tour", icon: PieChart },
      { name: "Pemesanan", url: "#", icon: Map },
    ],
    NavContent: [
      { name: "Artikel", url: "/admin-article", icon: Folder },
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
