"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const DEMO_DURATION = 30;
const steps = [
  { at: 0, title: "Start with a subject.", caption: "Biology is ready for a little structure." },
  { at: 5, title: "Add the work.", caption: "Three small tasks make the next step clear." },
  { at: 10, title: "Make progress visible.", caption: "One task is done. The plan keeps moving." },
  { at: 15, title: "Keep deadlines close.", caption: "Cell biology exam · 21 days remaining." },
  { at: 20, title: "Focus is coming soon.", caption: "A 25:00 focus session will give one task some space." },
  { at: 25, title: "See the work add up.", caption: "Progress keeps the bigger picture in view." },
  { at: 30, title: "A calmer next step.", caption: "Preview complete. Open StudyOS to try the real study plan." },
];

type DemoStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function ProductIntro() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [step, setStep] = useState<DemoStep>(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduceId = window.setTimeout(() => {
      setReduced(shouldReduce);
      if (shouldReduce) setStep(6);
    }, 0);
    if (shouldReduce) return () => window.clearTimeout(reduceId);

    const nextTimeline = gsap.timeline({
      paused: true,
      onUpdate: () => setProgress(nextTimeline.progress() * 100),
      onComplete: () => setPlaying(false),
    });
    nextTimeline.duration(DEMO_DURATION);
    steps.forEach((item, index) => {
      nextTimeline.call(() => setStep(index as DemoStep), [], item.at);
    });
    timeline.current = nextTimeline;
    return () => {
      window.clearTimeout(reduceId);
      nextTimeline.kill();
    };
  }, []);

  function play() {
    if (reduced) return;
    timeline.current?.play();
    setPlaying(true);
  }

  function pause() {
    timeline.current?.pause();
    setPlaying(false);
  }

  function replay() {
    if (reduced) return;
    timeline.current?.restart();
    setPlaying(true);
  }

  function skip() {
    timeline.current?.progress(1).pause();
    setStep(6);
    setProgress(100);
    setPlaying(false);
  }

  const current = steps[step];

  return (
    <section className="product-intro" ref={root} aria-labelledby="preview-title">
      <div className="product-intro-heading">
        <p className="eyebrow">Preview</p>
        <h2 id="preview-title">See how a study plan comes together.</h2>
        <p className="lede">A short walkthrough of subjects, tasks, deadlines and progress.</p>
      </div>
      <div className="product-window" aria-live="polite">
        <div className="window-bar">
          <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
          <strong>StudyOS · Preview</strong>
          <span className="window-status">LOCAL PLAN</span>
        </div>
        <div className="window-body">
          <div className={`demo-board demo-step-${step}`}>
            <div className="demo-sidebar">
              <span className="demo-brand">StudyOS</span>
              <b>Subjects</b>
              <span className={step >= 0 ? "selected" : ""}>Biology</span>
              <span>Science / maths</span>
            </div>
            <div className="demo-content">
              <div className="demo-topline"><span>MONDAY, 19 OCTOBER</span><b>Today</b></div>
              <div className="demo-progress"><span style={{ width: `${Math.max(8, Math.min(100, step * 18))}%` }} /></div>
              <div className="demo-chip">• Biology</div>
              <div className="demo-task-row"><i className={step >= 2 ? "checked" : ""}>{step >= 2 ? "✓" : ""}</i><span>Review mitosis stages<small>Biology</small></span></div>
              <div className="demo-task-row"><i className={step >= 1 ? "checked" : ""}>{step >= 1 ? "✓" : ""}</i><span>Read cell division chapter<small>Biology</small></span></div>
              <div className="demo-task-row"><i className={step >= 1 ? "checked" : ""}>{step >= 1 ? "✓" : ""}</i><span>Label the cell diagram<small>Biology</small></span></div>
              {step >= 3 && <div className="demo-exam"><strong>21</strong><span>Cell biology exam<small>days remaining</small></span></div>}
              {step >= 4 && <div className="demo-focus"><small>COMING SOON · FOCUS SESSION</small><strong>25:00</strong></div>}
              {step >= 5 && <div className="demo-result"><strong>2 / 3</strong><span>tasks complete</span></div>}
            </div>
          </div>
          <div className="product-intro-caption">
            <p className="eyebrow">Step {Math.min(step + 1, 7)} of 7</p>
            <h3>{current.title}</h3>
            <p>{current.caption}</p>
          </div>
        </div>
        <div className="product-controls">
          <div className="demo-progress-bar" aria-label={`${Math.round(progress)} percent complete`}><span style={{ width: `${progress}%` }} /></div>
          <div className="product-control-row">
            <button type="button" onClick={playing ? pause : play} disabled={reduced}>{playing ? "Pause" : "Play intro"}</button>
            <button type="button" onClick={replay} disabled={reduced}>Replay</button>
            <button type="button" onClick={skip} disabled={reduced}>Skip</button>
          </div>
        </div>
      </div>
    </section>
  );
}
