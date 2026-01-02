"use client";

import { useState } from "react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This tool saved me countless hours every week. The AI understands exactly what I need.",
    name: "Alex M.",
    title: "Product Manager, PixelTech",
  },
  {
    quote: "I never imagined AI integration could be this seamless. A true game-changer for our team.",
    name: "R. Malhotra",
    title: "Developer Advocate, CodeHive",
  },
  {
    quote: "Truly revolutionary for our content pipeline. Cut our production time in half.",
    name: "S. Tanveer",
    title: "Head of Content, WriteWise",
  },
  {
    quote: "The UI is clean and the performance is unmatched. Best AI tool I've used.",
    name: "D. Kim",
    title: "Frontend Engineer, ByteFlow",
  },
  {
    quote: "Reliable, fast, and simple — what more could you ask for? Highly recommend.",
    name: "J. Singh",
    title: "CTO, NovaApps",
  },
  {
    quote: "Helped my team go from idea to prototype in hours, not weeks. Incredible.",
    name: "L. Zhao",
    title: "Innovation Lead, SparkSoft",
  },
  {
    quote: "Our documentation is 3x faster to produce now. Essential for any dev team.",
    name: "N. Bose",
    title: "Technical Writer, StackPoint",
  },
  {
    quote: "Finally, an AI tool that designers and devs both love equally.",
    name: "A. Nguyen",
    title: "UI Engineer, ColorPixel",
  },
];

const TestimonialCard = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
  <div className="flex-shrink-0 w-[400px] p-8 rounded-3xl bg-zinc-900/80 border border-white/5 hover:border-violet-500/20 transition-all duration-300 group">
    <Quote className="w-8 h-8 text-violet-500/30 mb-4" />
    <p className="text-white/80 text-lg leading-relaxed mb-6 group-hover:text-white transition-colors">
      "{quote}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-white font-medium text-sm">{name}</p>
        <p className="text-white/40 text-xs">{title}</p>
      </div>
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Split testimonials into 2 rows
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10">
        {/* Section header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-16 px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Loved by creators
            <span className="gradient-text"> worldwide</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Join thousands of satisfied users who trust VirtuAI
          </p>
        </ScrollReveal>

        {/* Testimonial rows */}
        <div
          className="space-y-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Row 1 - moves left */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div
                className="flex gap-6 w-max animate-marquee"
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running',
                  ['--marquee-duration' as string]: '40s',
                }}
              >
                {[...row1, ...row1, ...row1].map((item, i) => (
                  <TestimonialCard key={`row1-${i}`} {...item} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 - moves right */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div
                className="flex gap-6 w-max animate-marquee-reverse"
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running',
                  ['--marquee-duration' as string]: '45s',
                }}
              >
                {[...row2, ...row2, ...row2].map((item, i) => (
                  <TestimonialCard key={`row2-${i}`} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <ScrollReveal animation="fadeUp" delay={200} className="mt-16 text-center px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/30">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm">10,000+ happy users</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm">4.9/5 average rating</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
