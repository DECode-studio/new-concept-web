"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Menu, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authStore } from "@/stores";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = observer(({ onMenuClick }: NavbarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    authStore.logout();
    router.replace("/login");
  };

  const roleLabel = authStore.getUserRole()?.toLowerCase().replace(/^\w/, (char) => char.toUpperCase());

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/60 bg-gradient-to-r from-[#6c63ff] via-[#8a7dff] to-[#c9c3ff] text-white shadow-[0_25px_75px_-45px_rgba(108,99,255,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center gap-4 px-4 md:px-8">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link
          href="/"
          className="group relative flex items-center gap-3 rounded-full border border-white/40 bg-white/20 px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_15px_45px_-25px_rgba(108,99,255,0.55)] transition hover:border-white/60 hover:bg-white/25"
        >
          <span className="absolute -left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/30 blur-xl transition group-hover:bg-white/40" />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BYJCVCEIv4VSgfxpcPfj_WTtzHv7Da3wvA&s"
            alt="New Concept Logo"
            className="h-8 w-8 rounded-lg object-cover"
            onError={(event) => {
              event.currentTarget.src = "/logo.png";
            }}
          />
          <span className="relative text-lg font-semibold">New Concept</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          {roleLabel && (
            <div className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white md:flex">
              {roleLabel}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open profile menu"
                className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/25 text-white hover:bg-white/35"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                <User className="relative h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border border-white/40 bg-white/95 text-foreground backdrop-blur-xl"
            >
              <div className="space-y-1 px-3 py-2">
                <p className="text-sm font-semibold">{authStore.currentUser?.name ?? "Guest"}</p>
                <p className="text-xs text-foreground/70">{authStore.currentUser?.email ?? "-"}</p>
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-[#6c63ff]/10 text-sm text-foreground hover:bg-[#6c63ff]/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});
