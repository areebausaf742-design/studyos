"use client";

import dynamic from "next/dynamic";
import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GlassStack } from "./glass-stack";

const ParticleCanvas = dynamic(() => import("./particle-canvas"), { ssr: false });

function getCapabilities(): "loading" | "canvas" | "static" {
  if (typeof window === "undefined") return "loading";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (deviceMemory !== undefined && deviceMemory <= 4);
  const canvas = document.createElement("canvas");
  const webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  return !reduced && !mobile && !lowPower && webgl ? "canvas" : "static";
}

export function ParticleHero() {
  const [capabilities, setCapabilities] = useState<"loading" | "canvas" | "static">("loading");
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capabilityId = window.setTimeout(() => setCapabilities(getCapabilities()), 0);
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    if (host.current) observer.observe(host.current);

    const onScroll = () => {
      const range = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(Math.max(window.scrollY / range, 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(capabilityId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`particle-hero particle-hero-${capabilities}`} aria-hidden="true" ref={host}>
      {capabilities === "canvas" ? (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 1.5]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        >
          <ParticleCanvas count={6000} progress={progress} />
          <Preload all />
        </Canvas>
      ) : (
        <GlassStack />
      )}
    </div>
  );
}
