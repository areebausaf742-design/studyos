"use client";

import { useEffect, useState } from "react";

export function HelloIntro({ name, onDone }: { name: string; onDone: () => void }) {
  const firstName = name.trim().split(/\s+/)[0] || "Student";
  const greeting = `Hello, ${firstName}`;
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shouldReduce) {
      const reveal = window.setTimeout(() => setVisibleCharacters(greeting.length), 0);
      const timeout = window.setTimeout(onDone, 1200);
      return () => {
        window.clearTimeout(reveal);
        window.clearTimeout(timeout);
      };
    }

    let index = 0;
    const typing = window.setInterval(() => {
      index += 1;
      setVisibleCharacters(index);
      if (index >= greeting.length) window.clearInterval(typing);
    }, 75);
    const timeout = window.setTimeout(onDone, 3600);
    return () => {
      window.clearInterval(typing);
      window.clearTimeout(timeout);
    };
  }, [greeting, onDone]);

  return (
    <div className="hello-intro" role="dialog" aria-label="Welcome" aria-live="polite">
      <div className="hello-intro-orb" aria-hidden="true" />
      <p className="eyebrow">StudyOS</p>
      <h2>{greeting.slice(0, visibleCharacters)}<span className="hello-caret" aria-hidden="true">|</span></h2>
      <p>A calmer place to decide what to study next.</p>
      <button type="button" onClick={onDone}>Skip</button>
    </div>
  );
}
