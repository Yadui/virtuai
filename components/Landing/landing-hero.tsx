"use client";

import Link from "next/link";
import { ArrowRight, Check, TerminalSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

const timelineSteps = [
  { label: "Thinking", className: "bg-[#dfa88f] text-[#26251e]" },
  { label: "Reading", className: "bg-[#9fbbe0] text-[#26251e]" },
  { label: "Editing", className: "bg-[#c0a8dd] text-[#26251e]" },
  { label: "Done", className: "bg-[#c08532] text-white" },
];

export const LandingHero = () => {
  return (
    <section className="bg-[#f7f7f4] px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
            AI workspace for creative production
          </p>
          <h1 className="text-5xl font-normal leading-[1.08] tracking-normal text-[#26251e] sm:text-6xl lg:text-7xl">
            VirtuAI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5a5852] sm:text-lg">
            Generate images, code, copy, audio, and video from one quiet workspace built around clear prompts, visible model choices, and reusable conversations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/dashboard">
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-11 px-5">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-xl border border-[#e6e5e0] bg-white">
          <div className="flex h-11 items-center justify-between border-b border-[#e6e5e0] bg-[#fafaf7] px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#dfa88f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#c0a8dd]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9fc9a2]" />
            </div>
            <div className="hidden font-mono text-xs text-[#807d72] sm:block">
              virtuai/launch-campaign.prompt
            </div>
            <TerminalSquare className="h-4 w-4 text-[#807d72]" />
          </div>

          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
            <aside className="hidden border-r border-[#e6e5e0] bg-[#fafaf7] p-4 lg:block">
              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
                Workspace
              </div>
              {[
                "Campaign brief",
                "Image prompts",
                "Product copy",
                "Launch video",
                "Code snippets",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`mb-1 rounded-md px-3 py-2 text-sm ${
                    index === 0
                      ? "bg-white text-[#26251e] ring-1 ring-[#e6e5e0]"
                      : "text-[#5a5852]"
                  }`}
                >
                  {item}
                </div>
              ))}
            </aside>

            <div className="border-r-0 border-[#e6e5e0] p-4 lg:border-r lg:p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {timelineSteps.map((step) => (
                  <span
                    key={step.label}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${step.className}`}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
              <div className="rounded-lg border border-[#e6e5e0] bg-[#fafaf7] p-4 font-mono text-[13px] leading-6 text-[#5a5852]">
                <div className="text-[#807d72]">{"// Launch prompt"}</div>
                <div>
                  <span className="text-[#c08532]">const</span> brief = &quot;Turn the new product release into a complete launch kit&quot;;
                </div>
                <div>
                  <span className="text-[#c08532]">await</span> virtuai.generate(&#123;
                </div>
                <div className="pl-5">images: 4,</div>
                <div className="pl-5">copy: &quot;landing page + email&quot;,</div>
                <div className="pl-5">code: &quot;React hero component&quot;,</div>
                <div className="pl-5">video: &quot;short product teaser&quot;</div>
                <div>&#125;);</div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Generated four image directions",
                  "Drafted landing page copy",
                  "Prepared React code block",
                  "Queued voiceover script",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-[#e6e5e0] bg-white px-3 py-3 text-sm text-[#5a5852]"
                  >
                    <Check className="h-4 w-4 text-[#1f8a65]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-[#e6e5e0] bg-[#fafaf7] p-4 lg:border-t-0 lg:p-5">
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
                Assistant
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-[#e6e5e0] bg-white p-3 text-sm leading-6 text-[#5a5852]">
                  I found the latest campaign brief and grouped the work into image, code, copy, and video tasks.
                </div>
                <div className="rounded-lg border border-[#e6e5e0] bg-white p-3 text-sm leading-6 text-[#5a5852]">
                  The generated code is ready to reuse, and the image set is waiting for review.
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-[#e6e5e0] bg-white p-3 font-mono text-xs leading-5 text-[#807d72]">
                status: done<br />
                model: virtuai-default<br />
                tokens: 8,214
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
