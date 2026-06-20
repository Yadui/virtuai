"use client";

import Link from "next/link";
import { Linkedin } from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "@icons-pack/react-simple-icons";

const socialLinks = [
  { name: "Twitter", Icon: SiX, href: "https://twitter.com" },
  { name: "GitHub", Icon: SiGithub, href: "https://github.com" },
  { name: "LinkedIn", Icon: Linkedin, href: "https://linkedin.com" },
  { name: "Discord", Icon: SiDiscord, href: "https://discord.com" },
];

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[#e6e5e0] bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[#f54e00] text-sm font-semibold text-white">
                V
              </span>
              <span className="text-2xl font-semibold text-[#f54e00]">VirtuAI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#5a5852]">
              A calm AI workspace for generating conversations, images, code, music, and video from a single project trail.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-md border border-[#e6e5e0] bg-white text-[#807d72] transition-colors hover:text-[#26251e]"
                  aria-label={name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#e6e5e0] pt-6 text-sm text-[#807d72] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VirtuAI. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#26251e]">Privacy Policy</a>
            <a href="#" className="hover:text-[#26251e]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
