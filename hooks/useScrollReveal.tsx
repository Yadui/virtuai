"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref as RefObject<T>, isVisible];
}

// Wrapper component for easier use
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fadeUp" | "fadeIn" | "fadeScale" | "slideLeft" | "slideRight";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animation = "fadeUp",
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const animationClasses: Record<string, string> = {
    fadeUp: "scroll-fade-up",
    fadeIn: "scroll-fade-in",
    fadeScale: "scroll-fade-scale",
    slideLeft: "scroll-slide-left",
    slideRight: "scroll-slide-right",
  };

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation]} ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
