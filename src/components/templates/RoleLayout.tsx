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
      <div className="flex min-h-screen items-center justify-center bg-[#070f26] text-slate-200">
        <div className="rounded-3xl border border-white/10 bg-white/10 px-10 py-8 backdrop-blur">
          <p className="text-sm tracking-[0.3em] uppercase text-white/70">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-12%] h-[28rem] w-[28rem] rounded-full bg-[rgba(108,99,255,0.28)] blur-[150px]" />
        <div className="absolute right-[-18%] top-[-15%] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,182,193,0.28)] blur-[170px]" />
        <div className="absolute bottom-[-25%] left-[28%] h-[28rem] w-[42rem] rotate-6 rounded-full bg-[rgba(156,140,255,0.22)] blur-[210px]" />
        <div className="absolute bottom-12 right-12 h-44 w-44 rounded-full bg-white/55 blur-[120px]" />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="relative z-10 flex w-full">
        <div className="hidden md:block">
          <div className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-72 md:flex">
            <div className="flex h-full w-full flex-col border-r border-white/40 bg-white/85 px-0 py-6 shadow-[0_30px_60px_-45px_rgba(108,99,255,0.35)] backdrop-blur-2xl">
              <Sidebar className="h-full overflow-y-auto" />
            </div>
          </div>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-72 border-white/40 bg-white/90 p-0 shadow-[0_30px_60px_-45px_rgba(108,99,255,0.35)] backdrop-blur-2xl"
          >
            <Sidebar className="h-full overflow-y-auto" onItemClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="mt-20 flex-1 overflow-y-auto pb-24 md:ml-72 md:pb-20">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 md:px-12">
            <div className="rounded-[32px] border border-white/50 bg-white/80 p-[1.5px] shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <div className="rounded-[30px] bg-white p-6 md:p-10">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
};
