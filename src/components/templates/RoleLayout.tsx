"use client";

import { useState } from "react";

import { Navbar } from "@/components/organisms/Navbar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { BottomBar } from "@/components/organisms/BottomBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { UserRoles } from "@/models/enums";

interface RoleLayoutProps {
  children: React.ReactNode;
  role: UserRoles;
}

export const RoleLayout = ({ children, role }: RoleLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ready } = useAuthGuard({ role });

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex w-full">
        <div className="hidden w-64 border-r bg-muted/20 md:block">
          <Sidebar />
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onItemClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
};
