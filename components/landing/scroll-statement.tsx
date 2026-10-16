"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export const TYPE_CHARS_PER_SECOND = 12;
export const PIN_LENGTH = 2.8;
export const SCRUB_SMOOTHING = 1.5;
export const PUNCTUATION_PAUSE_MS = 150;

const statement =
  "StudyOS is your operating system for learning, helping every student know what to study next.";

export function ScrollStatement() {
  const section = useRef<HTMLElement>(null);
  const targetChars = useRef(0);
  const shownChars = useRef(0);
  const pauseUntil = useRef(0);
  const [visible, setVisible] = useState("");

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const fullTextId = window.setTimeout(() => setVisible(statement), 0);
      return () => window.clearTimeout(fullTextId);
    }

    const context = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: `+=${window.innerHeight * PIN_LENGTH}`,
        pin: true,
        scrub: SCRUB_SMOOTHING,
        onUpdate: (self) => {
          targetChars.current = Math.ceil(self.progress * statement.length);
        },
      });

      const tick = (time: number) => {
        if (shownChars.current >= targetChars.current || time < pauseUntil.current) return;
        const elapsed = gsap.ticker.deltaRatio(60) / 60;
        const next = Math.min(
          targetChars.current,
          shownChars.current + Math.max(1, Math.floor(TYPE_CHARS_PER_SECOND * elapsed)),
        );
        const previousCharacter = statement[next - 1];
        shownChars.current = next;
        setVisible(statement.slice(0, next));
        if (/[,.!?]/.test(previousCharacter ?? "")) pauseUntil.current = time + PUNCTUATION_PAUSE_MS / 1000;
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
      };
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="statement-section" ref={section}>
      <p className="eyebrow">A calmer way forward</p>
      <h2 aria-label={statement}>
        <span aria-hidden="true">{visible}<span className="typing-caret" /></span>
      </h2>
      <p className="sr-only">{statement}</p>
    </section>
  );
}
