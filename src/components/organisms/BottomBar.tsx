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
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-xl -translate-x-1/2 rounded-3xl border border-white/40 bg-gradient-to-r from-[#6c63ff] to-[#9a8cff] p-3 text-white shadow-[0_25px_55px_-35px_rgba(108,99,255,0.45)] backdrop-blur-xl md:hidden">
      <nav className="flex items-center justify-around gap-2">
        {items.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition",
                isActive
                  ? "bg-white/20 text-white shadow-[0_12px_25px_-15px_rgba(108,99,255,0.55)]"
                  : "text-white/70 hover:bg-white/15 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/65")} />
              <span>{title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
});
