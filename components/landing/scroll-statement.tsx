"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const statement =
  "StudyOS is your operating system for learning, helping every student know what to study next.";

export function ScrollStatement() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(statement);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top 78%",
        end: "bottom 45%",
        scrub: true,
        onUpdate: (trigger) => {
          setVisible(statement.slice(0, Math.ceil(trigger.progress * statement.length)));
        },
      });
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section className="statement-section" ref={section}>
      <p className="eyebrow">A calmer way forward</p>
      <h2 aria-label={statement}>
        <span aria-hidden="true">
          {visible}
          <span className="typing-caret" />
        </span>
      </h2>
      <p className="sr-only">{statement}</p>
    </section>
  );
}
