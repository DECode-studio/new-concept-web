"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  DollarSign,
  FileText,
  Receipt,
  ClipboardList,
  History,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { UserRoles } from "@/models/enums";

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
        { title: "Invoices", href: "/admin/invoices", icon: Receipt },
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
    <aside className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
});
