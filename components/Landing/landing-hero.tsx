"use client";

import { useEffect, useState } from "react";
import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full px-6 text-center">
        {/* Main heading */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 scroll-fade-up ${mounted ? 'is-visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          Create with the
          <br />
          <span className="gradient-text">Power of AI</span>
        </h1>

        {/* Typewriter */}
        <div
          className={`text-xl sm:text-2xl md:text-3xl text-white/50 font-light mb-12 scroll-fade-up ${mounted ? 'is-visible' : ''}`}
          style={{ transitionDelay: '200ms' }}
        >
          <TypewriterComponent
            options={{
              strings: [
                "Generate stunning images",
                "Write production-ready code",
                "Create engaging content",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 30,
              delay: 50,
            }}
          />
        </div>

        {/* CTA Button */}
        <div
          className={`scroll-fade-up ${mounted ? 'is-visible' : ''}`}
          style={{ transitionDelay: '300ms' }}
        >
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button
              size="lg"
              className="group px-10 py-7 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/40" />
      </div>
    </section>
  );
};
