"use client";

import { useEffect, useState } from "react";
import {
  SiReact,
  SiTailwindcss,
  SiNextdotjs,
  SiPostgresql,
  SiOpenai,
  SiVercel,
  SiTypescript,
  SiPrisma,
} from "@icons-pack/react-simple-icons";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Bot, Cpu, Sparkles, Wand2 } from "lucide-react";

// Inner circle - Tech Stack (development tools)
const techStack = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
];

// Outer circle - AI Model Providers
const modelProviders = [
  { name: "OpenAI", Icon: SiOpenai, color: "#ffffff" },
  { name: "Replicate", Icon: Bot, color: "#F97316" },
  { name: "Stability AI", Icon: Sparkles, color: "#A855F7" },
  { name: "Anthropic", Icon: Cpu, color: "#D97706" },
  { name: "Midjourney", Icon: Wand2, color: "#10B981" },
  { name: "Google AI", Icon: SiVercel, color: "#4285F4" },
];

export const LandingContent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fadeUp" className="text-center mb-16">
          <p className="text-violet-400 uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Powered By
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trusted Technology Stack
          </h2>
        </ScrollReveal>

        {/* Orbiting circles container */}
        <div className="relative flex items-center justify-center h-[550px] md:h-[700px]">
          
          {/* Center logo */}
          <div className="absolute z-20 w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
            <span className="text-white font-bold text-xl md:text-3xl">V</span>
          </div>

          {/* Inner orbit ring */}
          <div 
            className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-white/[0.08]"
            style={{
              animation: mounted ? 'spin 35s linear infinite' : 'none',
            }}
          >
            {techStack.map((item, index) => {
              const angle = (index * 360) / techStack.length;
              const Icon = item.Icon;
              return (
                <div
                  key={item.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${50 + 50 * Math.cos((angle - 90) * (Math.PI / 180))}%`,
                    top: `${50 + 50 * Math.sin((angle - 90) * (Math.PI / 180))}%`,
                    animation: mounted ? 'counter-spin 35s linear infinite' : 'none',
                  }}
                >
                  <Icon
                    className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:scale-125"
                    style={{ color: item.color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Outer orbit ring */}
          <div 
            className="absolute w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full border border-white/[0.05]"
            style={{
              animation: mounted ? 'spin 50s linear infinite reverse' : 'none',
            }}
          >
            {modelProviders.map((item, index) => {
              const angle = (index * 360) / modelProviders.length;
              const Icon = item.Icon;
              return (
                <div
                  key={item.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${50 + 50 * Math.cos((angle - 90) * (Math.PI / 180))}%`,
                    top: `${50 + 50 * Math.sin((angle - 90) * (Math.PI / 180))}%`,
                    animation: mounted ? 'counter-spin 50s linear infinite reverse' : 'none',
                  }}
                >
                  <Icon
                    className="w-10 h-10 md:w-12 md:h-12 transition-all duration-300 opacity-50 group-hover:opacity-100 group-hover:scale-125"
                    style={{ color: item.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </section>
  );
};
