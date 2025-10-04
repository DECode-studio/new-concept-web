import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r bg-sidebar">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar onItemClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <BottomBar />
    </div>
  );
};
