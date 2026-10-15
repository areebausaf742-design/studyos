import { GlassStack } from "./glass-stack";

export function ProgressScene() {
  return (
    <div className="progress-scene" data-scene="progress">
      <GlassStack />
      <div className="progress-card">
        <div className="card-title"><strong>Your progress</strong><small>EXAMPLE PLAN</small></div>
        <div className="big-progress">2 / 4 <small>tasks complete</small></div>
        <div className="mock-progress"><span /></div>
        <p>Biology <small>2 of 3 complete</small></p>
        <p>Science/maths <small>0 of 1 complete</small></p>
        <hr />
        <h3>Exams &amp; Deadlines</h3>
        <div className="exam-card"><b>OCT<br /><strong>21</strong></b><span>Cell biology exam<small>Exam · Biology</small></span></div>
        <div className="exam-card"><b>OCT<br /><strong>23</strong></b><span>Problem set due<small>Deadline · Science/maths</small></span></div>
      </div>
    </div>
  );
}
