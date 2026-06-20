"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, PenSquare } from "lucide-react";
import { signOut } from "next-auth/react";
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-11 items-center justify-between border-b border-[#e6e5e0] bg-[#fafaf7] px-4 text-[#26251e]">
      {/* Left side — mobile: hamburger + new chat; desktop: new chat only */}
      <div className="flex items-center gap-2">
        {/* Mobile-only sidebar toggle */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#5a5852] hover:text-[#26251e] lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[220px] border-r border-[#e6e5e0] p-0">
            <Sidebar
              apiLimitCount={apiLimitCount}
              isPro={isPro}
              onLinkClick={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewChat}
          className="gap-2 text-[#5a5852] hover:text-[#26251e]"
        >
          <PenSquare className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-[#5a5852] hover:text-[#26251e]">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;