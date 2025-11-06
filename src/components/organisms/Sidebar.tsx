"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  DollarSign,
  FileText,
  BarChart3,
  Receipt,
  ClipboardList,
  History,
  UserCircle,
  Ticket,
} from "lucide-react";

import { authStore } from "@/stores";
import { UserRoles } from "@/models/enums";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const getNavItems = (role: UserRoles | null): NavItem[] => {
  switch (role) {
    case UserRoles.ADMIN:
      return [
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Branches", href: "/admin/branches", icon: Building2 },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Programs", href: "/admin/programs", icon: BookOpen },
        { title: "Classes", href: "/admin/classes", icon: GraduationCap },
        { title: "Fees", href: "/admin/fees", icon: DollarSign },
        { title: "Reports", href: "/admin/reports", icon: FileText },
        { title: "Report Accounts", href: "/admin/report-accounts", icon: BarChart3 },
        { title: "Invoices", href: "/admin/invoices", icon: Receipt },
        { title: "Vouchers", href: "/admin/vouchers", icon: Ticket },
        { title: "Logs", href: "/admin/logs", icon: History },
      ];
    case UserRoles.MANAGER:
      return [
        { title: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
        { title: "Students", href: "/manager/students", icon: Users },
        { title: "Reports", href: "/manager/reports", icon: FileText },
        { title: "Attendance", href: "/manager/attendance", icon: ClipboardList },
        { title: "Invoices", href: "/manager/invoices", icon: Receipt },
        { title: "Fees", href: "/manager/fees", icon: DollarSign },
        { title: "Logs", href: "/manager/logs", icon: History },
      ];
    case UserRoles.STAFF:
      return [
        { title: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
        { title: "Students", href: "/staff/students", icon: Users },
        { title: "Reports", href: "/staff/reports", icon: FileText },
        { title: "Attendance", href: "/staff/attendance", icon: ClipboardList },
        { title: "Invoices", href: "/staff/invoices", icon: Receipt },
      ];
    case UserRoles.STUDENT:
      return [
        { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { title: "Profile", href: "/student/profile", icon: UserCircle },
        { title: "Invoices", href: "/student/invoices", icon: Receipt },
        { title: "Attendance", href: "/student/attendance", icon: ClipboardList },
      ];
    default:
      return [];
  }
};

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar = observer(({ className, onItemClick }: SidebarProps) => {
  const role = authStore.getUserRole();
  const navItems = getNavItems(role);
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full flex-col gap-6 px-6 py-8 text-[#3d2a13]", className)}>
      <div className="rounded-3xl border border-white/40 bg-white p-5 shadow-[0_35px_55px_-40px_rgba(255,179,0,0.25)] backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#3d2a13]/70">Workspace</p>
        <p className="mt-3 text-lg font-semibold">{authStore.currentUser?.name ?? "Team"}</p>
        <p className="text-xs text-[#3d2a13]/60">{authStore.currentUser?.email ?? "Signed in"}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {navItems.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/40 px-4 py-3 text-sm font-medium tracking-wide transition",
                isActive
                  ? "bg-gradient-to-r from-[#FFB300]/35 via-[#FFC542]/15 to-transparent text-[#3d2a13] shadow-[0_25px_45px_-25px_rgba(255,179,0,0.35)]"
                  : "bg-white text-[#3d2a13] hover:border-white hover:bg-white/90"
              )}
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FFB300]/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <Icon className={cn("h-4 w-4 transition", isActive ? "scale-110 text-[#FFB300]" : "text-[#3d2a13]/45")} />
              <span>{title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
});
