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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFF4D4] via-[#FFF9EC] to-[#FFE69A] text-[#9c7611]">
        <div className="rounded-3xl border border-[#FFB300]/30 bg-white/70 px-10 py-8 shadow-[0_25px_65px_-35px_rgba(255,179,0,0.35)] backdrop-blur-md">
          <p className="text-sm tracking-[0.3em] uppercase">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 top-[-18%] h-[26rem] w-[26rem] rounded-full bg-[rgba(255,179,0,0.32)] blur-[150px]" />
        <div className="absolute right-[-18%] top-[-18%] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,214,107,0.32)] blur-[170px]" />
        <div className="absolute bottom-[-25%] left-[28%] h-[30rem] w-[44rem] rotate-6 rounded-full bg-[rgba(255,219,164,0.28)] blur-[210px]" />
        <div className="absolute bottom-12 right-12 h-44 w-44 rounded-full bg-white/65 blur-[120px]" />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="relative z-10 flex w-full">
        <div className="hidden md:block">
          <div className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-72 md:flex">
            <div className="flex h-full w-full flex-col border-r border-white/40 bg-white/90 px-0 py-6 shadow-[0_30px_60px_-45px_rgba(255,179,0,0.35)] backdrop-blur-2xl">
              <Sidebar className="h-full overflow-y-auto" />
            </div>
          </div>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-72 border-white/40 bg-white/95 p-0 shadow-[0_30px_60px_-45px_rgba(255,179,0,0.35)] backdrop-blur-2xl"
          >
            <Sidebar className="h-full overflow-y-auto" onItemClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="mt-20 flex-1 overflow-y-auto pb-24 md:ml-72 md:pb-20">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 md:px-12">
            <div className="rounded-[32px] border border-white/50 bg-white/90 p-[1.5px] shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <div className="rounded-[30px] bg-white p-6 md:p-10">{children}</div>
            </div>
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
};
