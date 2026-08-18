"use client";

import { useMemo, useState } from "react";

export type ModuleKey = "radar" | "assessment" | "response" | "bridge" | "shield";

type Navigate = (module: ModuleKey) => void;

const radarSections = [
  {
    title: "Behavioural red flags",
    intro: "Look for a meaningful change from the staff member’s usual pattern rather than judging one isolated event.",
    bullets: [
      "Repeated missed deadlines, unusual accidents, reduced confidence or an abrupt drop in routine performance.",
      "Lateness, absenteeism or presenteeism—attending work while unwell and unable to function normally.",
      "Withdrawal from colleagues, detachment, reduced personal care or marked social isolation.",
      "An apparent increase in alcohol or other substance use as a coping strategy.",
    ],
    source: ["WHO: Mental health at work", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"],
  },
  {
    title: "Emotional and cognitive red flags",
    intro: "Distress can change how a person processes information, communicates and responds to ordinary ward pressure.",
    bullets: [
      "Appearing unusually overwhelmed, distracted, dazed, withdrawn or shut down.",
      "Restlessness, jumpiness, irritability, reactivity or uncharacteristic aggression.",
      "Reduced concentration, memory, decision-making ability or motivation.",
      "Persistent sadness, anxiety, anger or loss of enjoyment in usual activities.",
    ],
    source: ["Directorate of Mental Health, Sri Lanka", "https://mentalhealth.health.gov.lk/"],
  },
  {
    title: "The golden rule of observation",
    intro: "Approach the person supportively and privately. Your role is to notice, listen and connect—not to diagnose.",
    bullets: [
      "Focus on the person, not a label or presumed disorder.",
      "Describe specific changes you have observed without making assumptions about the cause.",
      "Remember that mental illness is neither a character flaw nor a personal weakness.",
      "Keep the conversation private unless immediate safety, patient safety or safeguarding duties require escalation.",
    ],
    source: ["National Institute of Mental Health, Sri Lanka", "https://nimh.health.gov.lk/"],
  },
  {
    title: "Pressure, stress and burnout",
    intro: "Some pressure may be manageable, but sustained demands that exceed available resources can cause harmful stress.",
    bullets: [
      "Workload, staffing, shift patterns, limited control and unsafe conditions can create psychosocial risks.",
      "Prolonged workplace stress can lead to exhaustion, withdrawal and reduced professional effectiveness.",
      "Burnout is an occupational phenomenon, not a diagnosis that a manager should assign.",
      "Address workplace causes as well as offering individual support.",
    ],
    source: ["WHO: Burn-out as an occupational phenomenon", "https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon"],
  },
  {
    title: "Depression and anxiety indicators",
    intro: "These signs may have many causes. They should prompt a supportive conversation, not a workplace diagnosis.",
    bullets: [
      "Possible depression indicators include persistent low mood, reduced pleasure, sleep or appetite changes and low energy.",
      "Possible anxiety indicators include excessive worry, poor concentration, tension, sweating, sleep difficulty and avoidance.",
      "Procrastination, indecision, withdrawal or reduced confidence may become visible at work.",
      "Encourage professional assessment when symptoms are persistent, severe or impair functioning.",
    ],
    source: ["WHO mental health fact sheets", "https://www.who.int/news-room/fact-sheets"],
  },
  {
    title: "Severe distress, psychosis and repetitive behaviours",
    intro: "Unusual experiences or behaviour require a calm, safety-focused response and prompt clinical support.",
    bullets: [
      "Urgent concerns include marked disorientation, incoherent speech, severe agitation or appearing to respond to experiences others cannot observe.",
      "Repetitive checking that greatly exceeds clinical protocol and causes severe distress or delay may warrant a private conversation.",
      "Do not confront, ridicule or argue about a person’s beliefs or experiences.",
      "If there is immediate risk to the person, patients or others, activate the hospital emergency pathway without waiting for a score.",
    ],
    source: ["WHO: Schizophrenia", "https://www.who.int/news-room/fact-sheets/detail/schizophrenia"],
  },
  {
    title: "Alcohol and substance misuse",
    intro: "Substance use may be an unhelpful response to fatigue, conflict, traumatic incidents or sustained workplace stress.",
    bullets: [
      "Look for poor coordination, slowed responses, impaired judgement or a sudden change in decision-making.",
      "Clinical safety takes priority when impairment is suspected during duty.",
      "Respond through established occupational and clinical pathways, not public accusation or humiliation.",
      "Offer confidential access to professional support and arrange safe relief from clinical duties when required.",
    ],
    source: ["WHO: Alcohol", "https://www.who.int/health-topics/alcohol"],
  },
  {
    title: "Neurodivergence and workplace inclusion",
    intro: "Difference is not distress. Managers should reduce discrimination and provide reasonable, role-appropriate adjustments.",
    bullets: [
      "Use clear written instructions when verbal handovers are difficult to process.",
      "Consider quieter spaces for administrative work or breaks where operationally possible.",
      "Address conflict, grievances and bullying early while maintaining respect and civility.",
      "Do not attempt to change a person’s fundamental personality or diagnose neurodivergence.",
    ],
    source: ["ILO Global Business and Disability Network", "https://www.businessanddisability.org/"],
  },
  {
    title: "Harassment, violence and systemic stressors",
    intro: "Bullying, discrimination, gender-based harassment and domestic violence can seriously affect staff wellbeing and safety.",
    bullets: [
      "Apply zero tolerance to workplace violence, harassment and discrimination.",
      "Use established grievance, safeguarding and occupational-health procedures.",
      "Where appropriate, consider flexible work or leave arrangements that allow a vulnerable worker to seek support.",
      "Avoid promising absolute confidentiality when formal safety or safeguarding action may be required.",
    ],
    source: ["ILO Convention 190", "https://www.ilo.org/publications/ilo-convention-190-right-everyone-world-work-free-violence-and-harassment"],
  },
];

type AssessmentKey = "self" | "team" | "staff";
type Question = { text: string; options?: Array<{ label: string; value: number }> };

const standardOptions = [
  { label: "Often", value: 2 },
  { label: "Sometimes", value: 1 },
  { label: "Rarely", value: 0 },
];

const assessments: Record<AssessmentKey, { title: string; subtitle: string; questions: Question[] }> = {
  self: {
    title: "Manager’s Self-Check",
    subtitle: "Reflect on your own capacity before supporting others.",
    questions: [
      { text: "Are you finding it hard to relax or experiencing tension headaches or muscle pain?" },
      { text: "Are your sleeping, eating or exercise routines interrupted or harder to maintain?" },
      { text: "Are you feeling more isolated, alone or reluctant to seek connection?" },
      { text: "Are you experiencing lingering anger, sadness or a loss of enjoyment in day-to-day tasks?" },
      { text: "Are you relying more heavily on alcohol or other substances to feel better?" },
    ],
  },
  team: {
    title: "Team Structural Check",
    subtitle: "Review ward-level psychosocial hazards and team functioning.",
    questions: [
      { text: "Is the team missing allocated meal breaks or working excessive, unpredictable overtime?" },
      { text: "Have you observed sudden irritability, sarcasm or increased interpersonal conflict on the ward?" },
      { text: "Are staff missing deadlines or showing presenteeism—attending work while unwell?" },
      {
        text: "Has the ward experienced a critical incident without an appropriate check-in or follow-up?",
        options: [
          { label: "Yes", value: 2 },
          { label: "Not sure", value: 1 },
          { label: "No", value: 0 },
        ],
      },
      { text: "Are staff appearing dazed, withdrawn or shutting down during shifts?" },
    ],
  },
  staff: {
    title: "Supportive Staff Observation",
    subtitle: "Notice changes in one staff member without diagnosing or recording their identity.",
    questions: [
      { text: "Has the staff member shown a recent change in routine, such as increased absence, lateness or presenteeism?" },
      { text: "Do they appear unusually dazed, withdrawn or socially isolated from the team?" },
      { text: "Have you noticed sudden irritability, reactivity or uncharacteristic aggressive behaviour?" },
      { text: "Is there a visible drop in concentration, memory or ability to carry out usual clinical or administrative tasks?" },
      { text: "Are they showing severe distress, such as persistent crying, marked confusion or expressing disturbing thoughts?" },
    ],
  },
};

const bandMeta = [
  { min: 0, max: 2, key: "green", title: "Low concern", summary: "Current responses suggest relatively stable capacity, while routine support should continue." },
  { min: 3, max: 5, key: "yellow", title: "Early concern", summary: "Early strain is present. Make a practical adjustment and monitor over the coming week." },
  { min: 6, max: 8, key: "amber", title: "Significant concern", summary: "Do not wait for the situation to worsen. Begin a private conversation and agree on support." },
  { min: 9, max: 10, key: "red", title: "Urgent concern", summary: "Prompt support and escalation are required. Use the referral pathway and prioritise safety." },
];

function directivesFor(type: AssessmentKey, band: string) {
  const shared: Record<string, string[]> = {
    green: ["Maintain supportive routines and protected breaks.", "Keep regular informal check-ins.", "Continue building team connection and psychological safety."],
    yellow: ["Identify one immediate pressure that can be reduced.", "Arrange a supportive check-in within the next few days.", "Monitor whether functioning improves or deteriorates."],
    amber: ["Initiate a private conversation using Module 3.", "Reallocate non-critical demands where operationally possible.", "Offer confidential professional support options."],
    red: ["Move directly to Module 4 and connect with professional support.", "If there is immediate risk, activate the hospital emergency protocol now.", "Do not leave a person at immediate risk alone."],
  };

  if (type === "self" && band === "yellow") {
    return ["Protect your next break and disconnect after duty where possible.", "Speak with a trusted colleague or professional support service.", "Review what workload or roster pressure can be changed." ];
  }
  if (type === "team" && band === "yellow") {
    return ["Review the next 48 hours of the roster for immediate bottlenecks.", "Restore missed breaks and hold a short transparent team huddle.", "Monitor the team’s functioning over the next week."];
  }
  if (type === "staff" && band === "yellow") {
    return ["Begin with an informal, private conversation.", "Listen without assumptions and ask what support would help.", "Consider a short-term, reasonable duty adjustment."];
  }
  return shared[band];
}

function SupportButtons() {
  return (
    <div className="urgent-actions">
      <a className="urgent-primary" href="https://wa.me/94755551926" target="_blank" rel="noreferrer">WhatsApp NIMH 1926</a>
      <a className="urgent-secondary" href="tel:1926">Call 1926</a>
    </div>
  );
}

function ContentIntro({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="content-intro">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function RadarModule() {
  return (
    <div className="module-content-stack">
      <ContentIntro label="Observe change, avoid assumptions" title="Recognising signs that someone may need support">
        A single sign does not establish a mental-health condition. Look for a clear change from the person’s usual pattern, consider workplace causes and start a private, respectful conversation.
      </ContentIntro>
      <div className="principle-callout">
        <span>Golden rule</span>
        <strong>Focus on the person, not a presumed diagnosis.</strong>
      </div>
      <div className="accordion-list">
        {radarSections.map((section, index) => (
          <details className="accordion-item" key={section.title} open={index === 0}>
            <summary>
              <span className="accordion-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{section.title}</span>
              <span className="accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div className="accordion-body">
              <p>{section.intro}</p>
              <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              <a className="source-link" href={section.source[1]} target="_blank" rel="noreferrer">Further reading: {section.source[0]} ↗</a>
            </div>
          </details>
        ))}
        <details className="accordion-item local-placeholder">
          <summary>
            <span className="accordion-index">10</span>
            <span>Local ward realities and BANI stressors</span>
            <span className="accordion-toggle" aria-hidden="true">+</span>
          </summary>
          <div className="accordion-body">
            <span className="pending-tag">Pending local consultation</span>
            <p>This section will be populated with stressors identified through local focus-group and key-informant findings.</p>
            <ul>
              <li>Unpredictable roster changes and acute staffing shortages.</li>
              <li>Critical medication or supply shortages.</li>
              <li>Volatile patient or bystander interactions.</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}

function AssessmentModule({ onNavigate }: { onNavigate: Navigate }) {
  const [selected, setSelected] = useState<AssessmentKey | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [showResult, setShowResult] = useState(false);

  const begin = (key: AssessmentKey) => {
    setSelected(key);
    setQuestionIndex(0);
    setAnswers(new Array(assessments[key].questions.length).fill(null));
    setShowResult(false);
  };

  if (!selected) {
    return (
      <div className="module-content-stack">
        <ContentIntro label="Three supportive checks" title="Choose what you need to review">
          These brief checks guide reflection and managerial action. They are not validated diagnostic tests and must not be used for disciplinary or performance decisions.
        </ContentIntro>
        <div className="privacy-strip"><strong>Privacy by design:</strong> no name or assessment score is saved.</div>
        <div className="assessment-choice-grid">
          {(Object.keys(assessments) as AssessmentKey[]).map((key, index) => (
            <button className="assessment-choice" key={key} onClick={() => begin(key)}>
              <span className="choice-number">0{index + 1}</span>
              <strong>{assessments[key].title}</strong>
              <span>{assessments[key].subtitle}</span>
              <em>Start check →</em>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const assessment = assessments[selected];
  const score = answers.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const band = bandMeta.find((item) => score >= item.min && score <= item.max)!;

  if (showResult) {
    return (
      <div className="module-content-stack">
        <button className="inline-back" onClick={() => setSelected(null)}>← All assessments</button>
        <section className={`result-card risk-${band.key}`} aria-live="polite">
          <div className="result-banner">
            <span>Support guidance</span>
            <strong>{band.title}</strong>
          </div>
          <div className="result-body">
            <div className="score-lockup"><span>Your score</span><strong>{score}<small>/10</small></strong></div>
            <div className="result-summary">
              <h2>{assessment.title}</h2>
              <p>{band.summary}</p>
            </div>
          </div>
          <div className="result-directives">
            <h3>Recommended next actions</h3>
            <ol>{directivesFor(selected, band.key).map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <p className="non-diagnostic-note">This score is a reflection aid, not a diagnosis. Immediate safety concerns override the score.</p>
        </section>
        <div className="result-actions">
          <button className="button secondary" onClick={() => begin(selected)}>Repeat check</button>
          {band.key === "amber" && <button className="button primary" onClick={() => onNavigate("response")}>Open The Response</button>}
          {band.key === "red" && <button className="button danger" onClick={() => onNavigate("bridge")}>Open The Bridge</button>}
        </div>
      </div>
    );
  }

  const question = assessment.questions[questionIndex];
  const options = question.options ?? standardOptions;
  const currentAnswer = answers[questionIndex];
  const progress = ((questionIndex + 1) / assessment.questions.length) * 100;

  return (
    <div className="module-content-stack">
      <div className="assessment-topline">
        <button className="inline-back" onClick={() => setSelected(null)}>← Change assessment</button>
        <span>Question {questionIndex + 1} of {assessment.questions.length}</span>
      </div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <section className="question-card">
        <p className="section-label">{assessment.title}</p>
        <h2>{question.text}</h2>
        <div className="answer-grid" role="radiogroup" aria-label="Select an answer">
          {options.map((option) => (
            <button
              key={option.label}
              className={currentAnswer === option.value ? "answer-option selected" : "answer-option"}
              role="radio"
              aria-checked={currentAnswer === option.value}
              onClick={() => {
                const next = [...answers];
                next[questionIndex] = option.value;
                setAnswers(next);
              }}
            >
              <span className="radio-dot" aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </section>
      <div className="question-navigation">
        <button className="button secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex((value) => value - 1)}>Previous</button>
        {questionIndex < assessment.questions.length - 1 ? (
          <button className="button primary" disabled={currentAnswer === null} onClick={() => setQuestionIndex((value) => value + 1)}>Next question</button>
        ) : (
          <button className="button primary" disabled={currentAnswer === null} onClick={() => setShowResult(true)}>View guidance</button>
        )}
      </div>
      <button className="urgent-inline" onClick={() => onNavigate("bridge")}>Immediate safety concern? Skip the score and open The Bridge →</button>
    </div>
  );
}

const conversationSteps = [
  { title: "Ask", script: "You’ve seemed a little withdrawn lately. How are you doing at the moment?", points: ["Choose a private time and place.", "Describe the change you noticed without judging it.", "Use an open question and allow silence."] },
  { title: "Listen", script: "Take your time. I’m here to listen, and you do not have to solve everything now.", points: ["Give the person time to answer.", "Listen without assumptions or immediately offering solutions.", "Accept that they may not want to talk right now."] },
  { title: "Encourage action", script: "What would make the rest of today safer or more manageable for you?", points: ["Ask what short-term adjustment would help.", "Agree on one practical next step.", "Offer confidential professional support options."] },
  { title: "Check in", script: "I will check in before you leave today, and again tomorrow morning.", points: ["Set a specific follow-up time.", "Document operational actions, not personal disclosures.", "Escalate if risk or functioning deteriorates."] },
];

function ResponseModule({ onNavigate }: { onNavigate: Navigate }) {
  const [view, setView] = useState<"conversation" | "pfa">("conversation");
  return (
    <div className="module-content-stack">
      <ContentIntro label="Conversation and Psychological First Aid" title="Create safety before trying to solve the problem">
        Use a calm, humane and practical response. Managers should not diagnose, provide psychotherapy or pressure anyone to recount a distressing event.
      </ContentIntro>
      <div className="segmented-control" aria-label="Response guide">
        <button className={view === "conversation" ? "active" : ""} onClick={() => setView("conversation")}>Supportive conversation</button>
        <button className={view === "pfa" ? "active" : ""} onClick={() => setView("pfa")}>Psychological First Aid</button>
      </div>

      {view === "conversation" ? (
        <div className="response-flow">
          <div className="setup-card">
            <span>Before you begin</span>
            <h3>Create psychological safety</h3>
            <p>Find a private, neutral space. Reduce interruptions, remain calm and ensure urgent ward responsibilities are safely covered.</p>
          </div>
          {conversationSteps.map((step, index) => (
            <article className="response-step" key={step.title}>
              <div className="response-step-number">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <blockquote>“{step.script}”</blockquote>
                <ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="pfa-content">
          <div className="pfa-definition-grid">
            <article><span className="good-label">PFA is</span><p>Humane, supportive and practical help that respects the person’s dignity, culture and abilities.</p></article>
            <article><span className="avoid-label">PFA is not</span><p>Counselling, diagnosis, psychological debriefing or pressuring someone to tell their story.</p></article>
          </div>
          <div className="pfa-steps">
            <article><span>01</span><h3>LOOK</h3><p>Check immediate safety, severe distress, the operational environment and basic physical needs.</p><ul><li>Move to a quiet, safe space.</li><li>Notice panic, disorientation, agitation or shutdown.</li><li>Address missed meals, dehydration or exhaustion.</li></ul></article>
            <article><span>02</span><h3>LISTEN</h3><p>Approach respectfully, listen without pressure and help the person feel calmer.</p><ul><li>Use a steady, measured voice.</li><li>Validate without minimising.</li><li>Do not judge or offer unsolicited life advice.</li></ul></article>
            <article><span>03</span><h3>LINK</h3><p>Resolve what is immediately practical and connect the person with social and professional support.</p><ul><li>Reassign non-critical duties where possible.</li><li>Connect with trusted support.</li><li>Agree on a specific follow-up time.</li></ul></article>
          </div>
          <div className="ethics-grid">
            <div><h3>Do</h3><ul><li>Be honest and trustworthy.</li><li>Respect the person’s decisions.</li><li>Acknowledge distress and strengths.</li><li>Share practical support information.</li></ul></div>
            <div><h3>Do not</h3><ul><li>Exploit supervisory authority.</li><li>Force disclosure or traumatic recounting.</li><li>Make false promises.</li><li>Share personal disclosures unnecessarily.</li></ul></div>
          </div>
          <div className="confidentiality-note"><strong>Confidentiality has limits.</strong> Explain that immediate danger, patient-safety risks and safeguarding or legal duties may require need-to-know escalation.</div>
          <a className="source-link standalone" href="https://www.who.int/publications/i/item/9789241548205" target="_blank" rel="noreferrer">WHO Psychological First Aid guide ↗</a>
        </div>
      )}
      <div className="module-next-card"><div><span>Professional support needed?</span><strong>Use the referral pathway.</strong></div><button className="button danger" onClick={() => onNavigate("bridge")}>Open The Bridge</button></div>
    </div>
  );
}

function BridgeModule() {
  return (
    <div className="module-content-stack">
      <section className="lifeline-card">
        <p className="section-label">Primary national lifeline</p>
        <h2>NIMH 1926 Mental Health Helpline</h2>
        <p>Use voice or WhatsApp support when a staff member needs confidential professional guidance. WhatsApp opens directly on supported devices.</p>
        <SupportButtons />
        <span className="number-display">075 555 1926</span>
      </section>
      <section className="emergency-protocol">
        <div className="emergency-symbol" aria-hidden="true">!</div>
        <div>
          <p className="section-label">Immediate safety risk</p>
          <h3>Activate the hospital emergency pathway now</h3>
          <ol>
            <li>Move the person away from active clinical duties safely and compassionately.</li>
            <li>Do not leave them alone when there is immediate risk of self-harm or danger to others.</li>
            <li>Contact the psychiatric on-call service, emergency department or responsible medical officer.</li>
            <li>Use 1926 as an additional professional support route—not as a substitute for immediate emergency care.</li>
          </ol>
        </div>
      </section>
      <ContentIntro label="Referral directory" title="Match the pathway to the need">
        Know your professional limits. The manager’s responsibility is to connect the person with appropriate support, not to act as their therapist.
      </ContentIntro>
      <div className="directory-grid">
        <article><span className="directory-type">Clinical care</span><h3>Hospital mental-health pathway</h3><p>Offer confidential referral to the hospital Mental Health Clinic, Consultant Psychiatrist or district Medical Officer of Mental Health.</p><span className="pending-tag">Local contact pending</span></article>
        <article><span className="directory-type">Peer support</span><h3>The Anchor Network</h3><p>A proposed confidential circle of trained senior clinical staff who can listen, support and guide colleagues toward formal care.</p><span className="pending-tag">Institution-specific</span></article>
        <article><span className="directory-type">Alternative crisis line</span><h3>1333 CCCline</h3><p>A secondary confidential crisis-support and suicide-prevention pathway. Verify availability and operating details before launch.</p><a href="tel:1333">Call 1333</a></article>
        <article><span className="directory-type">Administrative support</span><h3>Grievance and redress</h3><p>Use the appropriate Ministry or institutional grievance channel for harassment, unresolved conflict or systemic administrative failures.</p><span className="pending-tag">Contact pending</span></article>
      </div>
      <div className="local-directory"><span>Local hospital directory</span><strong>CSTH · CEBH · NIID · NIMH · BH Homagama</strong><p>Names, extensions, clinic locations and duty schedules will be added after institutional confirmation.</p></div>
    </div>
  );
}

const shieldKnowledge = [
  { title: "Crisis rostering and buffering", body: ["Identify the most safety-critical tasks before allocating staff.", "Protect breaks and avoid repeated high-intensity assignments where operationally possible.", "Use short-term task redistribution after critical incidents or marked distress.", "Record staffing and supply constraints for escalation as system risks."] },
  { title: "Shielding staff from friction", body: ["Step into volatile interactions rather than leaving junior staff in the direct line of aggression.", "Use transparent pre-shift huddles about shortages, delays and expected pressure points.", "Escalate threats early and involve security when physical safety may be compromised.", "Provide a brief recovery period after intense conflict or traumatic events."] },
  { title: "Replacing blame with learning", body: ["Address unacceptable behaviour while also examining workload, fatigue, communication and system failures.", "Separate immediate safety actions from later fact-finding and accountability.", "Use debriefs to identify improvements, not to force emotional disclosure.", "Track repeated operational hazards and escalate them through governance channels."] },
  { title: "The manager’s own shield", body: ["Protect your own breaks, rest and boundaries whenever possible.", "Seek peer or professional support rather than carrying every crisis alone.", "Use delegation and clear on-call escalation routes.", "Model respectful communication and permission to ask for help."] },
];

const scenarioOptions = [
  { key: "a", label: "Ask the junior nurse to explain the supply issue to the relative.", tone: "incorrect", feedback: "This leaves the junior staff member in the direct line of aggression. The manager should first create safety and take responsibility for de-escalation." },
  { key: "b", label: "Step in, move the conversation away from the station and give the nurse a short recovery break.", tone: "correct", feedback: "You intercepted the aggression, protected the junior staff member and created a brief opportunity to regulate stress." },
  { key: "c", label: "Call hospital security immediately before speaking to the relative.", tone: "caution", feedback: "Security may be necessary if physical safety is threatened. If the situation is not yet dangerous, begin calm de-escalation while keeping security available." },
];

const commitmentOptions = [
  "Protect one 15-minute micro-break for staff on the highest-pressure shift.",
  "Hold a five-minute pre-shift huddle about today’s shortages and risks.",
  "Reassign one highly stressed staff member away from a high-intensity position today.",
  "Leave on time today where operationally possible and mute non-urgent ward messages.",
];

function ShieldModule({ savedPlan, onCommit, onHome }: { savedPlan: string[]; onCommit: (items: string[]) => void; onHome: () => void }) {
  const [scenario, setScenario] = useState<string | null>(null);
  const [triage, setTriage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(savedPlan);
  const [success, setSuccess] = useState(false);
  const scenarioFeedback = scenarioOptions.find((item) => item.key === scenario);

  const toggleCommitment = (item: string) => {
    if (selected.includes(item)) setSelected(selected.filter((entry) => entry !== item));
    else if (selected.length < 3) setSelected([...selected, item]);
  };

  if (success) {
    return (
      <div className="commitment-success" aria-live="polite">
        <span className="success-mark">✓</span>
        <p className="section-label">My Ward Shield</p>
        <h2>Your action plan is ready.</h2>
        <p>You have committed to protecting your team through practical action.</p>
        <ol>{selected.map((item) => <li key={item}>{item}</li>)}</ol>
        <span className="device-note">Saved on this device only.</span>
        <button className="button primary" onClick={onHome}>Return to dashboard</button>
      </div>
    );
  }

  return (
    <div className="module-content-stack">
      <ContentIntro label="Protective ward leadership" title="Reduce preventable pressure before it becomes harm">
        Mental-health support is not only an individual intervention. Managers can change how work is organised, how conflict is absorbed and how teams recover after difficult events.
      </ContentIntro>
      <div className="accordion-list compact-list">
        {shieldKnowledge.map((item, index) => (
          <details className="accordion-item" key={item.title} open={index === 0}>
            <summary><span className="accordion-index">0{index + 1}</span><span>{item.title}</span><span className="accordion-toggle" aria-hidden="true">+</span></summary>
            <div className="accordion-body"><ul>{item.body.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>
          </details>
        ))}
      </div>

      <section className="interactive-tool" aria-labelledby="scenario-title">
        <p className="tool-number">Interactive tool 01</p>
        <h2 id="scenario-title">Scenario simulator</h2>
        <div className="scenario-box"><span>The out-of-stock crisis</span><p>It is 8:00 PM. The pharmacy is out of a critical antibiotic, and a patient’s relative is shouting at a junior Nursing Officer at the station. What is your immediate action?</p></div>
        <div className="scenario-options">
          {scenarioOptions.map((option) => <button className={scenario === option.key ? "scenario-option selected" : "scenario-option"} key={option.key} onClick={() => setScenario(option.key)}><span>{option.key.toUpperCase()}</span>{option.label}</button>)}
        </div>
        {scenarioFeedback && <div className={`feedback-box ${scenarioFeedback.tone}`}><strong>{scenarioFeedback.tone === "correct" ? "Good response" : scenarioFeedback.tone === "caution" ? "Use caution" : "Reconsider"}</strong><p>{scenarioFeedback.feedback}</p></div>}
        <span className="pending-tag">Two additional local scenarios pending FGD findings</span>
      </section>

      <section className="interactive-tool" aria-labelledby="triage-title">
        <p className="tool-number">Interactive tool 02</p>
        <h2 id="triage-title">Support and accountability triage</h2>
        <div className="scenario-box"><span>Identify the complete response</span><p>A normally reliable Medical Officer snaps aggressively at a matron over a delayed patient chart. What should the manager do?</p></div>
        <div className="triage-options">
          <button className={triage === "discipline" ? "selected" : ""} onClick={() => setTriage("discipline")}>Treat it only as misconduct</button>
          <button className={triage === "system" ? "selected" : ""} onClick={() => setTriage("system")}>Treat it only as a system problem</button>
          <button className={triage === "both" ? "selected" : ""} onClick={() => setTriage("both")}>Create safety, support the person and investigate both behaviour and system causes</button>
        </div>
        {triage && <div className={`feedback-box ${triage === "both" ? "correct" : "caution"}`}><strong>{triage === "both" ? "Balanced response" : "The response is incomplete"}</strong><p>{triage === "both" ? "Address the unacceptable interaction while examining fatigue, double shifts, prior critical incidents and system delays. Support and accountability can coexist." : "A single explanation may either ignore wellbeing and workplace causes or fail to address harmful conduct. Examine both fairly."}</p></div>}
      </section>

      <section className="interactive-tool commitment-tool" aria-labelledby="commitment-title">
        <p className="tool-number">Interactive tool 03</p>
        <h2 id="commitment-title">My Ward Shield</h2>
        <p>Select one to three protective actions you will implement this week.</p>
        <div className="commitment-options">
          {commitmentOptions.map((item) => {
            const checked = selected.includes(item);
            const disabled = !checked && selected.length >= 3;
            return <label className={disabled ? "disabled" : ""} key={item}><input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleCommitment(item)} /><span className="custom-check" aria-hidden="true">✓</span><span>{item}</span></label>;
          })}
        </div>
        <div className="commitment-footer"><span>{selected.length}/3 selected · saved only after you generate the plan</span><button className="button primary" disabled={selected.length < 1} onClick={() => { onCommit(selected); setSuccess(true); }}>Generate my action plan</button></div>
      </section>
    </div>
  );
}

export function ModuleContent({
  moduleKey,
  onNavigate,
  onHome,
  savedPlan,
  onCommit,
}: {
  moduleKey: ModuleKey;
  onNavigate: Navigate;
  onHome: () => void;
  savedPlan: string[];
  onCommit: (items: string[]) => void;
}) {
  return useMemo(() => {
    if (moduleKey === "radar") return <RadarModule />;
    if (moduleKey === "assessment") return <AssessmentModule onNavigate={onNavigate} />;
    if (moduleKey === "response") return <ResponseModule onNavigate={onNavigate} />;
    if (moduleKey === "bridge") return <BridgeModule />;
    return <ShieldModule savedPlan={savedPlan} onCommit={onCommit} onHome={onHome} />;
  }, [moduleKey, onCommit, onHome, onNavigate, savedPlan]);
}
