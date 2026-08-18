"use client";

import { useState } from "react";
import { ModuleContent, type ModuleKey } from "./module-content";
import { PwaControls } from "./pwa-controls";

const modules: Array<{
  key: ModuleKey;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  accent: string;
}> = [
  {
    key: "radar",
    number: "01",
    title: "The Radar",
    eyebrow: "Recognise",
    description: "Notice early changes in behaviour, wellbeing and ward functioning.",
    accent: "indigo",
  },
  {
    key: "assessment",
    number: "02",
    title: "The Assessment",
    eyebrow: "Reflect",
    description: "Use supportive self, team and staff-observation checks.",
    accent: "teal",
  },
  {
    key: "response",
    number: "03",
    title: "The Response",
    eyebrow: "Respond",
    description: "Start a conversation and apply Psychological First Aid.",
    accent: "amber",
  },
  {
    key: "bridge",
    number: "04",
    title: "The Bridge",
    eyebrow: "Connect",
    description: "Find confidential professional and crisis support pathways.",
    accent: "blue",
  },
  {
    key: "shield",
    number: "05",
    title: "The Shield",
    eyebrow: "Protect",
    description: "Reduce ward pressures and commit to practical protective actions.",
    accent: "green",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-mark-dot" />
      <span className="brand-mark-ring" />
    </span>
  );
}

function UrgentActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "urgent-actions compact" : "urgent-actions"}>
      <a className="urgent-primary" href="https://wa.me/94755551926" target="_blank" rel="noreferrer">
        WhatsApp NIMH 1926
      </a>
      <a className="urgent-secondary" href="tel:1926">
        Call 1926
      </a>
    </div>
  );
}

function AccessScreen({ onEnter }: { onEnter: (role: string) => void }) {
  const [role, setRole] = useState("Ward In-Charge");

  return (
    <main className="access-page">
      <section className="access-panel" aria-labelledby="access-title">
        <div className="access-brand">
          <BrandMark />
          <span>WardWell</span>
        </div>
        <div className="access-copy">
          <p className="kicker">Managerial Support Platform for Mental Health</p>
          <h1 id="access-title">Support your team with clarity and compassion.</h1>
          <p>
            A practical ward-level guide for recognising distress, responding safely and connecting staff with support.
          </p>
        </div>
        <form
          className="access-form"
          onSubmit={(event) => {
            event.preventDefault();
            onEnter(role);
          }}
        >
          <label htmlFor="manager-role">Your managerial role</label>
          <select id="manager-role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Ward In-Charge</option>
            <option>Section Head</option>
            <option>Unit Manager</option>
            <option>Other Middle-Level Manager</option>
          </select>
          <button className="button primary wide" type="submit">
            Enter platform
          </button>
          <p className="privacy-note">Prototype access only. No name, password or staff record is collected.</p>
        </form>
      </section>
      <aside className="access-aside" aria-label="Platform principles">
        <div className="access-aside-content">
          <p className="aside-label">Recognise · Respond · Refer</p>
          <blockquote>“Support the person. Address the system. Protect safety.”</blockquote>
          <div className="principle-grid">
            <span>Private</span>
            <span>Practical</span>
            <span>Non-diagnostic</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

function AppHeader({ role, onHome, onExit }: { role: string; onHome: () => void; onExit: () => void }) {
  return (
    <header className="app-header">
      <button className="brand-button" onClick={onHome} aria-label="Return to dashboard">
        <BrandMark />
        <span className="brand-wordmark">WardWell</span>
      </button>
      <div className="header-actions">
        <label className="language-select">
          <span className="sr-only">Language</span>
          <select aria-label="Language" defaultValue="en">
            <option value="en">English</option>
            <option value="si" disabled>සිංහල · soon</option>
            <option value="ta" disabled>தமிழ் · soon</option>
          </select>
        </label>
        <span className="role-pill">{role}</span>
        <button className="text-button" onClick={onExit}>Exit</button>
      </div>
    </header>
  );
}

function Dashboard({ role, onOpen, savedPlan }: { role: string; onOpen: (key: ModuleKey) => void; savedPlan: string[] }) {
  return (
    <main className="app-main dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="kicker">Support starts with one clear next step</p>
          <h1>Hello, {role}.</h1>
          <p>Choose the module that best fits what you are noticing on your ward right now.</p>
        </div>
        <div className="safety-card">
          <span className="safety-card-label">Urgent concern?</span>
          <strong>Connect directly to support.</strong>
          <UrgentActions compact />
        </div>
      </section>

      <PwaControls />

      <section aria-labelledby="modules-heading">
        <div className="section-heading-row">
          <div>
            <p className="section-label">Five practical pathways</p>
            <h2 id="modules-heading">Where would you like to begin?</h2>
          </div>
          <p className="section-support">This platform supports managerial action. It does not diagnose mental illness.</p>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <button
              key={module.key}
              className={`module-card accent-${module.accent}`}
              onClick={() => onOpen(module.key)}
            >
              <span className="module-number">{module.number}</span>
              <span className="module-eyebrow">{module.eyebrow}</span>
              <strong>{module.title}</strong>
              <span className="module-description">{module.description}</span>
              <span className="module-link">Open module <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-note">
        <div className="note-icon" aria-hidden="true">i</div>
        <div>
          <strong>Use supportive observation, not surveillance.</strong>
          <p>Do not record identifiable staff information or use this platform for performance or disciplinary decisions.</p>
        </div>
      </section>
      {savedPlan.length > 0 && (
        <section className="saved-plan-card">
          <div>
            <p className="section-label">My Ward Shield</p>
            <h2>Your current protective commitments</h2>
          </div>
          <ol>{savedPlan.map((item) => <li key={item}>{item}</li>)}</ol>
          <button className="button secondary" onClick={() => onOpen("shield")}>Review plan</button>
        </section>
      )}
    </main>
  );
}

function ModuleShell({
  moduleKey,
  onBack,
  onNavigate,
  onHome,
  savedPlan,
  onCommit,
}: {
  moduleKey: ModuleKey;
  onBack: () => void;
  onNavigate: (module: ModuleKey) => void;
  onHome: () => void;
  savedPlan: string[];
  onCommit: (items: string[]) => void;
}) {
  const moduleInfo = modules.find((item) => item.key === moduleKey)!;

  return (
    <main className="app-main module-page">
      <button className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Dashboard</button>
      <section className={`module-hero accent-${moduleInfo.accent}`}>
        <span className="module-number">Module {moduleInfo.number}</span>
        <p className="module-eyebrow">{moduleInfo.eyebrow}</p>
        <h1>{moduleInfo.title}</h1>
        <p>{moduleInfo.description}</p>
      </section>

      <ModuleContent moduleKey={moduleKey} onNavigate={onNavigate} onHome={onHome} savedPlan={savedPlan} onCommit={onCommit} />
    </main>
  );
}

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);
  const [savedPlan, setSavedPlan] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("wardwell-shield-plan");
      return stored ? JSON.parse(stored) : [];
    } catch {
      // Local storage may be unavailable in privacy-restricted browsers.
      return [];
    }
  });

  const openModule = (module: ModuleKey) => {
    setActiveModule(module);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const savePlan = (items: string[]) => {
    setSavedPlan(items);
    try {
      window.localStorage.setItem("wardwell-shield-plan", JSON.stringify(items));
    } catch {
      // The in-session plan still works if local storage is blocked.
    }
  };

  if (!role) {
    return <AccessScreen onEnter={setRole} />;
  }

  return (
    <div className="app-shell">
      <AppHeader role={role} onHome={goHome} onExit={() => { setRole(null); setActiveModule(null); }} />
      {activeModule ? (
        <ModuleShell moduleKey={activeModule} onBack={goHome} onNavigate={openModule} onHome={goHome} savedPlan={savedPlan} onCommit={savePlan} />
      ) : (
        <Dashboard role={role} onOpen={openModule} savedPlan={savedPlan} />
      )}
      <footer className="app-footer">
        <span>Managerial Support Platform for Mental Health</span>
        <span>Prototype · English</span>
      </footer>
    </div>
  );
}
