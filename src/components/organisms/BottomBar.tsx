"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { LayoutDashboard, FileText, Receipt, UserCircle } from "lucide-react";

import { authStore } from "@/stores";
import { UserRoles } from "@/models/enums";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleBaseMap: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: "admin",
  [UserRoles.MANAGER]: "manager",
  [UserRoles.STAFF]: "staff",
  [UserRoles.STUDENT]: "student",
};

const getBottomNavItems = (role: UserRoles | null): BottomNavItem[] => {
  if (!role) return [];
  const base = roleBaseMap[role];
  return [
    { title: "Dashboard", href: `/${base}/dashboard`, icon: LayoutDashboard },
    { title: "Reports", href: `/${base}/reports`, icon: FileText },
    { title: "Invoices", href: `/${base}/invoices`, icon: Receipt },
    { title: "Profile", href: `/${base}/profile`, icon: UserCircle },
  ];
};

export const BottomBar = observer(() => {
  const role = authStore.getUserRole();
  const pathname = usePathname();
  const items = getBottomNavItems(role);

  if (!items.length) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex items-center justify-around">
        {items.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
});
