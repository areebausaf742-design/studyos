import { AuthLink } from "@/components/auth-link";

export function LandingHeader() {
  return (
    <header className="landing-header">
      <a className="brand" href="#begin" aria-label="StudyOS home">
        <span aria-hidden="true" className="brand-mark" />
        <span>StudyOS</span>
      </a>
      <nav aria-label="Main navigation" className="landing-nav">
        <a href="#today">Today</a>
        <a href="#learn">Learn</a>
        <a href="#focus">Focus</a>
        <a href="#progress">Progress</a>
      </nav>
      <AuthLink className="header-cta">Open StudyOS <span aria-hidden="true">↗</span></AuthLink>
    </header>
  );
}
