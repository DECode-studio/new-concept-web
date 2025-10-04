import { Moon, Sun, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = observer(({ onMenuClick }: NavbarProps) => {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    authStore.logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BYJCVCEIv4VSgfxpcPfj_WTtzHv7Da3wvA&s" 
            alt="New Concept Logo" 
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-xl font-bold text-primary">New Concept</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{authStore.currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {authStore.currentUser?.email}
                </p>
              </div>
              <DropdownMenuItem onClick={handleLogout}>
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
