"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  UserCircle,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { UserRoles } from "@/models/enums";

interface BottomNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const getBottomNavItems = (role: UserRoles | null): BottomNavItem[] => {
  const baseHref = role?.toLowerCase() || "";
  return [
    { title: "Dashboard", href: `/${baseHref}/dashboard`, icon: LayoutDashboard },
    { title: "Reports", href: `/${baseHref}/reports`, icon: FileText },
    { title: "Invoices", href: `/${baseHref}/invoices`, icon: Receipt },
    { title: "Profile", href: `/${baseHref}/profile`, icon: UserCircle },
  ];
};

export const BottomBar = observer(() => {
  const role = authStore.getUserRole();
  const pathname = usePathname();
  const navItems = getBottomNavItems(role);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
});
