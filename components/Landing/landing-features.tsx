"use client";

import {
  Code,
  Image as ImageIcon,
  MessageSquare,
  Music,
  Settings2,
  Video,
} from "lucide-react";

import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: MessageSquare,
    title: "Conversation-first workspace",
    description: "Keep prompts, model choices, and generated outputs together so every project has memory and context.",
  },
  {
    icon: ImageIcon,
    title: "Image direction",
    description: "Move from a rough creative brief to multiple visual options with simple controls for count and resolution.",
  },
  {
    icon: Code,
    title: "Code generation",
    description: "Ask for snippets, components, and explanations in the same calm surface as your creative work.",
  },
  {
    icon: Video,
    title: "Video prompts",
    description: "Shape short-form video ideas and scripts from the same launch narrative you use everywhere else.",
  },
  {
    icon: Music,
    title: "Audio support",
    description: "Generate musical and voiceover starting points without switching tools or losing the brief.",
  },
  {
    icon: Settings2,
    title: "Custom models",
    description: "Add provider connections and set defaults when your team needs a specific model workflow.",
  },
];

export const ShowcaseSection = () => {
  return (
    <section id="features" className="bg-[#f7f7f4] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal animation="fadeUp" className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
            Features
          </p>
          <h2 className="text-3xl font-normal leading-tight tracking-normal text-[#26251e] sm:text-4xl">
            A full AI toolkit with the visual quiet of a good editor.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#5a5852]">
            VirtuAI keeps the work surface restrained, readable, and built for repeated creative production.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <ScrollReveal key={feature.title} animation="fadeUp" delay={index * 80}>
                <article className="h-full rounded-xl border border-[#e6e5e0] bg-white p-6 transition-colors hover:border-[#cfcdc4]">
                  <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-md border border-[#e6e5e0] bg-[#fafaf7] text-[#26251e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-[#26251e]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#5a5852]">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
