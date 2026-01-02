"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/SideBar/sidebar";

interface NavbarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Navbar = ({ apiLimitCount = 0, isPro = false }: NavbarProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    router.push("/dashboard");
    // Optionally refresh the page state for a new chat
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f] text-white">
      {/* Left side - New Chat & Sidebar Toggle */}
      <div className="flex items-center gap-2">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar
              apiLimitCount={apiLimitCount}
              isPro={isPro}
              onLinkClick={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="gap-2"
        >
          <PenSquare className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
      </div>

      {/* Right side - User Button */}
      <div className="flex items-center">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;