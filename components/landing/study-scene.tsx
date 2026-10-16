import { GlassStack } from "./glass-stack";
import { AuthLink } from "@/components/auth-link";

type StudySceneProps = { type: "today" | "learn" | "focus" };

export function StudyScene({ type }: StudySceneProps) {
  if (type === "focus") {
    return (
      <div className="focus-scene" data-scene="focus">
        <div className="focus-ring"><span>LESS NOISE.</span><strong>More presence.</strong></div>
        <div className="timer-card">
          <span className="scene-chip">• Biology</span>
          <p>Review mitosis stages</p>
          <strong>25:00</strong>
          <small>FOCUS SESSION</small>
          <AuthLink>Start focus <span aria-hidden="true">→</span></AuthLink>
        </div>
      </div>
    );
  }

  return (
    <div className={`study-scene ${type}`} data-scene={type}>
      <GlassStack />
      <div className="mock-panel">
        <div className="mock-panel-top">
          <span className="scene-chip">• {type === "today" ? "Biology" : "Biology"}</span>
          <small>{type === "today" ? "2 of 4 complete" : "2 of 3 tasks complete"}</small>
        </div>
        <div className="mock-progress"><span /></div>
        <div className="mock-task done">✓ <span>Label the cell diagram<small>Biology</small></span></div>
        <div className="mock-task done">✓ <span>Read cell division chapter<small>Biology</small></span></div>
        <div className="mock-task">□ <span>Review mitosis stages<small>Biology</small></span></div>
        <div className="mock-task">□ <span>Solve quadratic equations<small>Science/maths</small></span></div>
        <AuthLink className="mock-add">+ Add task</AuthLink>
        <div className="exam-card"><b>OCT<br /><strong>21</strong></b><span>Cell biology exam<small>Exam · Biology</small></span></div>
      </div>
    </div>
  );
}
