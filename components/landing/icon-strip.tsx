"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Flag,
  Gauge,
  ListTodo,
  NotebookPen,
  Timer,
  Target,
} from "lucide-react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const icons = [
  ["Subjects", BookOpen],
  ["Tasks", CheckSquare],
  ["Exams", CalendarDays],
  ["Timer", Timer],
  ["Focus", Target],
  ["Progress", Gauge],
  ["Notes", NotebookPen],
  ["Calendar", CalendarDays],
  ["Goals", Flag],
  ["Plan", ListTodo],
] as const;

export function IconStrip() {
  const strip = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !strip.current) return;

    const context = gsap.context(() => {
      gsap.to(strip.current, {
        x: 80,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(strip.current, {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: strip.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, strip);
    return () => context.revert();
  }, []);

  return (
    <div className="icon-strip-viewport" aria-label="StudyOS features">
      <div className="icon-strip" ref={strip}>
        {icons.map(([label, Icon], index) => (
          <a className="icon-pill" href="/app" key={label} aria-label={label}>
            <Icon aria-hidden="true" size={24} strokeWidth={1.5} />
            <span>{label}</span>
            <i style={{ animationDelay: `${index * -0.15}s` }} />
          </a>
        ))}
      </div>
    </div>
  );
}
