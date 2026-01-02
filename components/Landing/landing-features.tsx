"use client";

import { ScrollReveal } from "@/hooks/useScrollReveal";
import { 
  Image as ImageIcon, 
  Code, 
  MessageSquare, 
  Video, 
  Music, 
  Zap,
  Sparkles,
  Brain
} from "lucide-react";

const features = [
  {
    icon: ImageIcon,
    title: "Image Generation",
    description: "Create stunning visuals from text descriptions using advanced AI models.",
    gradient: "from-pink-500 to-rose-500",
    size: "large",
  },
  {
    icon: Code,
    title: "Code Assistant",
    description: "Write, debug, and optimize code in any programming language.",
    gradient: "from-violet-500 to-purple-500",
    size: "small",
  },
  {
    icon: MessageSquare,
    title: "Smart Chat",
    description: "Engage in intelligent conversations with context awareness.",
    gradient: "from-blue-500 to-cyan-500",
    size: "small",
  },
  {
    icon: Video,
    title: "Video Creation",
    description: "Generate and edit videos with AI-powered tools and effects.",
    gradient: "from-orange-500 to-amber-500",
    size: "large",
  },
  {
    icon: Music,
    title: "Audio Synthesis",
    description: "Create music, voiceovers, and sound effects instantly.",
    gradient: "from-green-500 to-emerald-500",
    size: "small",
  },
  {
    icon: Brain,
    title: "AI Training",
    description: "Fine-tune models on your own data for custom results.",
    gradient: "from-indigo-500 to-violet-500",
    size: "small",
  },
];

export const ShowcaseSection = () => {
  return (
    <section id="features" className="relative py-32 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-white/80">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything you need to
            <br />
            <span className="gradient-text">create with AI</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            A complete suite of AI-powered tools designed to supercharge your creativity
            and productivity.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === "large";
            
            return (
              <ScrollReveal
                key={feature.title}
                animation="fadeUp"
                delay={index * 100}
                className={isLarge ? "lg:col-span-2" : ""}
              >
                <div
                  className={`group relative h-full min-h-[280px] p-8 rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden card-hover gradient-border cursor-pointer`}
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div
                    className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:gradient-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)`,
                    }}
                  />

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal animation="fadeUp" delay={600} className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            <Sparkles className="w-4 h-4 inline-block mr-2 text-violet-400" />
            And many more features coming soon...
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};
