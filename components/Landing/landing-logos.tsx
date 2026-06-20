"use client";

import { ScrollReveal } from "@/hooks/useScrollReveal";

const stages = [
  { label: "Thinking", detail: "Plans the request", color: "#dfa88f", text: "#26251e" },
  { label: "Grepping", detail: "Finds context", color: "#9fc9a2", text: "#26251e" },
  { label: "Reading", detail: "Opens sources", color: "#9fbbe0", text: "#26251e" },
  { label: "Editing", detail: "Drafts output", color: "#c0a8dd", text: "#26251e" },
  { label: "Done", detail: "Packages results", color: "#c08532", text: "#ffffff" },
];

export const LandingContent = () => {
  return (
    <section id="timeline" className="border-y border-[#e6e5e0] bg-[#fafaf7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <ScrollReveal animation="fadeUp" className="max-w-xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
            Agent timeline
          </p>
          <h2 className="text-3xl font-normal leading-tight tracking-normal text-[#26251e] sm:text-4xl">
            Follow every AI action from first thought to finished asset.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#5a5852]">
            The design system keeps the pastel palette scoped to in-product progress, so the interface stays calm while complex work remains readable.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fadeUp" delay={150}>
          <div className="rounded-xl border border-[#e6e5e0] bg-white">
            <div className="border-b border-[#e6e5e0] px-4 py-3 font-mono text-xs text-[#807d72]">
              /runs/launch-kit.timeline
            </div>
            <div className="divide-y divide-[#efeee8]">
              {stages.map((stage, index) => (
                <div key={stage.label} className="grid gap-3 px-4 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <span
                    className="w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ backgroundColor: stage.color, color: stage.text }}
                  >
                    {stage.label}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#26251e]">{stage.detail}</p>
                    <p className="font-mono text-xs text-[#807d72]">
                      step_{String(index + 1).padStart(2, "0")}.json
                    </p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#efeee8] sm:w-28">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${44 + index * 12}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 border-t border-[#e6e5e0] bg-[#fafaf7] p-4 md:grid-cols-2">
              <pre className="overflow-x-auto rounded-lg border border-[#e6e5e0] bg-white p-4 font-mono text-xs leading-5 text-[#5a5852]">
{`diff --summary
+ hero-copy.md
+ campaign-image-prompts.json
+ pricing-card.tsx
+ video-script.md`}
              </pre>
              <div className="rounded-lg border border-[#e6e5e0] bg-white p-4 text-sm leading-6 text-[#5a5852]">
                <p className="font-medium text-[#26251e]">Run summary</p>
                <p className="mt-2">
                  Five staged actions produced reusable assets, code, and prompts without leaving the workspace.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
