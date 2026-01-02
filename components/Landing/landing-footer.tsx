"use client";

import Link from "next/link";
import { Montserrat } from "next/font/google";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { 
  SiX, 
  SiGithub, 
  SiDiscord 
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

const socialLinks = [
  { name: "Twitter", Icon: SiX, href: "https://twitter.com" },
  { name: "GitHub", Icon: SiGithub, href: "https://github.com" },
  { name: "LinkedIn", Icon: Linkedin, href: "https://linkedin.com" },
  { name: "Discord", Icon: SiDiscord, href: "https://discord.com" },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Help Center", "Community", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Licenses"],
  },
];

export const LandingFooter = () => {
  return (
    <footer className="relative bg-black border-t border-white/5">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Brand column */}
          <ScrollReveal animation="fadeUp" className="col-span-2">
            <Link href="/" className="inline-block mb-6">
              <h2
                className={cn(
                  "text-3xl font-bold gradient-text",
                  font.className
                )}
              >
                VirtuAI
              </h2>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering creativity with AI. Generate images, write code, and
              create content faster than ever.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label={name}
                >
                  <Icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Link columns */}
          {footerLinks.map((column, i) => (
            <ScrollReveal
              key={column.title}
              animation="fadeUp"
              delay={(i + 1) * 100}
              className="col-span-1"
            >
              <h3 className="text-sm font-semibold text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom bar */}
        <ScrollReveal animation="fadeUp" delay={500}>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} VirtuAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/60 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white/60 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Large background logo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <span className={cn("text-[20rem] font-bold whitespace-nowrap", font.className)}>
          VirtuAI
        </span>
      </div>
    </footer>
  );
};
