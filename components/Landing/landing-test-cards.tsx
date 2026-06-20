"use client";

import { useState } from "react";
import { Quote } from "lucide-react";

import { ScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "The workspace feels focused enough for daily production, but flexible enough for every kind of AI task we run.",
    name: "Alex M.",
    title: "Product Manager, PixelTech",
  },
  {
    quote: "We can move from idea to assets without losing the prompt trail. That alone changed how our team ships campaigns.",
    name: "R. Malhotra",
    title: "Developer Advocate, CodeHive",
  },
  {
    quote: "The model controls are simple, and the generated outputs stay organized by conversation instead of disappearing into tabs.",
    name: "S. Tanveer",
    title: "Head of Content, WriteWise",
  },
  {
    quote: "It has the calm of a writing tool and the utility of a developer console. Our designers and engineers both use it.",
    name: "D. Kim",
    title: "Frontend Engineer, ByteFlow",
  },
  {
    quote: "The best part is the lack of clutter. It makes AI generation feel like a repeatable workflow, not a novelty demo.",
    name: "J. Singh",
    title: "CTO, NovaApps",
  },
  {
    quote: "Custom model setup gave us the control we needed, while the rest of the interface stayed approachable.",
    name: "L. Zhao",
    title: "Innovation Lead, SparkSoft",
  },
];

const TestimonialCard = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
  <div className="w-[320px] flex-shrink-0 rounded-xl border border-[#e6e5e0] bg-white p-6 sm:w-[380px]">
    <Quote className="mb-5 h-6 w-6 text-[#a09c92]" />
    <p className="text-base leading-7 text-[#5a5852]">&quot;{quote}&quot;</p>
    <div className="mt-6 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e6e5e0] text-sm font-semibold text-[#26251e]">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#26251e]">{name}</p>
        <p className="text-xs text-[#807d72]">{title}</p>
      </div>
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);

  return (
    <section id="customers" className="overflow-hidden bg-[#f7f7f4] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal animation="fadeUp" className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
            Customers
          </p>
          <h2 className="text-3xl font-normal leading-tight tracking-normal text-[#26251e] sm:text-4xl">
            Built for teams that use AI all day.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#5a5852]">
            Quiet surfaces, persistent context, and enough structure to keep creative operations moving.
          </p>
        </ScrollReveal>
      </div>

      <div
        className="space-y-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[row1, row2].map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[#f7f7f4] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[#f7f7f4] to-transparent" />
            <div className="overflow-hidden">
              <div
                className={`flex w-max gap-4 ${rowIndex === 0 ? "animate-marquee" : "animate-marquee-reverse"}`}
                style={{
                  animationPlayState: isPaused ? "paused" : "running",
                  ["--marquee-duration" as string]: rowIndex === 0 ? "42s" : "48s",
                }}
              >
                {[...row, ...row, ...row, ...row].map((item, index) => (
                  <TestimonialCard key={`${rowIndex}-${index}`} {...item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
