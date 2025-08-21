import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User, Lock, Podcast } from 'lucide-react';

const items = [
  {
    title: "Profile",
    href: "/admin-profile",
    icon: User,
  },
  {
    title: "Password",
    href: "/admin-password",
    icon: Lock,
  },
  {
    title: "Media Sosial",
    href: "/admin-social-media",
    icon: Podcast,
  },
];

const TabProfile = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            location.pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default TabProfile;
