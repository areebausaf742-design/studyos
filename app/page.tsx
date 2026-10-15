import {
  GlassStack,
  IconStrip,
  LandingHeader,
  ParticleHero,
  ProgressScene,
  ScrollStatement,
  StudyScene,
} from "@/components/landing";

const navItems = [
  ["Today", "today"],
  ["Learn", "learn"],
  ["Focus", "focus"],
  ["Progress", "progress"],
];

export default function LandingPage() {
  return (
    <main className="landing-page" id="begin">
      <LandingHeader />

      <section className="landing-section hero-section">
        <div className="landing-copy">
          <p className="eyebrow">A clearer way to study</p>
          <h1>Your operating<br className="desktop-only" /> system for learning.</h1>
          <p className="lede">Your subjects, tasks and deadlines. One clear place to decide what comes next.</p>
          <a className="landing-button" href="/app">Start your study plan <span aria-hidden="true">→</span></a>
        </div>
        <div className="hero-scene" data-scene="begin">
          <ParticleHero />
          <GlassStack />
          <p className="scene-caption">A little structure. More room to think.</p>
        </div>
      </section>

      <ScrollStatement />
      <IconStrip />

      <section className="landing-section split-section" id="today">
        <div className="landing-copy">
          <p className="eyebrow">01 — Today</p>
          <h2>Keep your study plan moving.</h2>
          <p className="lede">Organize your subjects and focus on the next task.</p>
          <GlassStack />
        </div>
        <StudyScene type="today" />
      </section>

      <section className="landing-section split-section" id="learn">
        <div className="landing-copy">
          <p className="eyebrow">02 — Learn</p>
          <h2>Every subject.<br />A clear next step.</h2>
          <p className="lede">Break the work into tasks. Keep what you need to review close to what’s due.</p>
          <ul className="feature-list"><li>Create your subjects</li><li>Add and complete tasks</li><li>See what’s left to review</li></ul>
        </div>
        <StudyScene type="learn" />
      </section>

      <section className="landing-section focus-section" id="focus">
        <div className="landing-copy">
          <p className="eyebrow">03 — Focus</p>
          <h2>One task. Your full attention.</h2>
          <p className="lede">Choose a task, set your timer and give it some space.</p>
        </div>
        <StudyScene type="focus" />
      </section>

      <section className="landing-section split-section" id="progress">
        <div className="landing-copy">
          <p className="eyebrow">04 — Progress</p>
          <h2>See the work add up.</h2>
          <p className="lede">Know what’s done, what’s left and what’s coming. Without losing sight of the bigger picture.</p>
          <GlassStack />
        </div>
        <ProgressScene />
      </section>

      <section className="landing-section cta-section" id="next">
        <div className="landing-copy">
          <p className="eyebrow">Make space for what’s next</p>
          <h2>A calmer start.<br />A clearer next step.</h2>
          <p className="lede">Bring your subjects, tasks and deadlines together. Then take it one study session at a time.</p>
          <a className="landing-button" href="/app">Start your study plan <span aria-hidden="true">→</span></a>
        </div>
        <GlassStack />
      </section>

      <footer className="landing-footer">
        <div className="footer-brand"><span className="brand-mark" />StudyOS</div>
        <p>An operating system for learning.</p>
        <nav aria-label="Footer navigation">{navItems.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
        <small>© 2026 StudyOS</small>
      </footer>

      <nav aria-label="Page sections" className="section-index">
        <a className="active" href="#begin">Begin</a>
        {navItems.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}
        <a href="#next">Your next step</a>
      </nav>
    </main>
  );
}
