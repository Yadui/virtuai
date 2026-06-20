"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/SideBar/sidebar";

interface MobileSidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for managing sidebar visibility

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Function to close the sidebar
  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#5a5852] hover:text-[#26251e] md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="border-r border-[#e6e5e0] p-0">
        <Sidebar
          apiLimitCount={apiLimitCount}
          isPro={isPro}
          onLinkClick={closeSidebar} // Pass the close function as a prop to the Sidebar
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
