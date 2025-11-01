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
    <aside className={cn("pb-12", className)}>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
});
