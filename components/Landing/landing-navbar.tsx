"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we've scrolled past initial position
      setIsScrolled(currentScrollY > 50);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[1200px]",
        "px-6 py-4 rounded-2xl",
        "flex items-center justify-between",
        "transition-all duration-500 ease-out",
        // Glassmorphism effect
        "border border-white/10 backdrop-blur-3xl bg-[#0a0a0f] md:bg-black/50",
        // Visibility state
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        // Scrolled state - more compact
        isScrolled ? "py-3 shadow-2xl" : "py-4"
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center group">
        <div className="relative">
          <h1
            className={cn(
              "text-2xl font-bold text-white",
              "transition-all duration-300",
              "group-hover:gradient-text-animated",
              font.className
            )}
          >
            VirtuAI
          </h1>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 blur-xl bg-violet-500/0 group-hover:bg-violet-500/30 transition-all duration-500 -z-10" />
        </div>
      </Link>

      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {["Features", "Pricing", "About"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm text-white/70 hover:text-white transition-colors duration-300 relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Link href="/sign-in" className="hidden sm:block">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-5"
          >
            Sign In
          </Button>
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            className={cn(
              "rounded-xl px-6 py-2.5",
              "bg-gradient-to-r from-violet-600 to-indigo-600",
              "hover:from-violet-500 hover:to-indigo-500",
              "text-white font-medium",
              "shadow-lg shadow-violet-500/25",
              "hover:shadow-xl hover:shadow-violet-500/40",
              "hover:-translate-y-0.5",
              "transition-all duration-300"
            )}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};
