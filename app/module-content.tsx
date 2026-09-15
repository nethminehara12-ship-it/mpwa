"use client";

import { useMemo, useState } from "react";
import { assessments, standardOptions, assessmentBand, directivesFor, type AssessmentKey } from "./assessment-data";

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
      "Burnout is an occupational phenomenon, not a diagnosis that a manager should assign. Sustained stress can also affect physical health and increase the risk of depression and anxiety.",
      "Address workplace causes as well as offering individual support.",
    ],
    source: ["WHO: Burn-out as an occupational phenomenon", "https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon"],
  },
  {
    title: "Depression and anxiety indicators",
    intro: "These signs may have many causes. They should prompt a supportive conversation, not a workplace diagnosis.",
    bullets: [
      "Possible depression indicators include low mood, lowered self-worth, reduced pleasure, sleep or appetite/weight changes, low energy and reduced pain tolerance.",
      "Possible anxiety indicators include excessive worry, fear of losing control, poor concentration, muscle tension, sweating, upset stomach, fatigue, sleep difficulty and avoidance.",
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
      "Repetitive checking that greatly exceeds clinical protocol—medication charts, locked cabinets or sterilisation equipment—and causes distress, exhaustion or delays may warrant a private conversation about possible obsessive-compulsive symptoms.",
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
      "Clinical safety takes priority when impairment is suspected during duty. Increased reliance on substances or discomfort without them warrants confidential clinical support.",
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
      "Consider quieter spaces for administrative work or breaks, or noise-cancelling headsets during suitable administrative tasks, where safe and operationally possible.",
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

function SupportButtons() {
  return (
    <div className="urgent-actions">
      <a className="urgent-primary" href="https://wa.me/94755551926" target="_blank" rel="noreferrer">WhatsApp NIMH 1926</a>
      <a className="urgent-secondary" href="tel:1926">Call 1926</a>
      <a className="urgent-secondary" href="sms:1926">SMS 1926</a>
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
          <details name="radar-sections" className="accordion-item" key={section.title} open={index === 0}>
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
        <details className="accordion-item" name="radar-sections">
          <summary><span className="accordion-index">10</span><span>Local Ward Realities &amp; Stressors</span><span className="accordion-toggle" aria-hidden="true">+</span></summary>
          <div className="accordion-body">
            <p>Integrated fieldwork findings: look at the working conditions behind a change in behaviour.</p>
            <ul>
              <li><strong>Defensive Nursing:</strong> fixation on paperwork and avoidance of direct patient care may reflect fear of litigation and system failures. Explore workload and anxiety before judging work ethic.</li>
              <li><strong>The Generational Boundary Clash:</strong> refusal of overtime or firm work-life boundaries may reflect a rights-based working culture. Discuss individual needs rather than assuming insubordination or distress from age alone.</li>
              <li><strong>Inter-Professional Blame Absorption:</strong> notice acute distress or loss of empathy after stockouts, patient hostility or unfair blame from clinical colleagues.</li>
              <li><strong>Gendered Masking of Stress:</strong> some male staff may express distress through irritability, behavioural shifts or substance use. Ask privately without relying on gender stereotypes.</li>
              <li><strong>Digital Isolation:</strong> retreat into phones and social media during downtime may reduce peer support. Explore the change supportively.</li>
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
  const band = assessmentBand(score);

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
            <div className="score-lockup"><span>Your score</span><strong>{score}<small>/14</small></strong></div>
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
          <button className="button primary" onClick={() => onNavigate("response")}>Open The Response</button>
          <button className="button danger" onClick={() => onNavigate("bridge")}>Open The Bridge / 1926</button>
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
        <div className="answer-grid" role="group" aria-label="Select an answer">
          {options.map((option) => (
            <button
              key={option.label}
              className={currentAnswer === option.value ? "answer-option selected" : "answer-option"}
              aria-pressed={currentAnswer === option.value}
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
          <button className="button primary" disabled={answers.some((answer) => answer === null)} onClick={() => setShowResult(true)}>View guidance</button>
        )}
      </div>
      <button className="urgent-inline" onClick={() => onNavigate("bridge")}>Immediate safety concern? Skip the score and open The Bridge →</button>
    </div>
  );
}

const conversationSteps = [
  { title: "Ask", script: "You’ve seemed a little withdrawn lately. How are you doing at the moment?", points: ["Choose a private time and place that suits both of you; silence phones once urgent cover is arranged.", "Describe the change you noticed without judging it.", "Use an open question and allow silence."] },
  { title: "Listen", script: "Take your time. I’m here to listen, and you do not have to solve everything now.", points: ["Give the person time to answer.", "Listen without assumptions or immediately offering solutions.", "Accept that they may not want to talk right now."] },
  { title: "Encourage action", script: "What would make the rest of today safer or more manageable for you?", points: ["Ask what short-term adjustment would help.", "Agree on one practical next step.", "Ask if they are ready to seek help, assist if wanted, and offer confidential professional support options."] },
  { title: "Check in", script: "I will check in before you leave today, and again tomorrow morning.", points: ["Set a specific follow-up time; for early concerns, check in again after a few days, sooner if needed.", "Document operational actions, not personal disclosures.", "Escalate if risk or functioning deteriorates."] },
];

function ResponseModule({ onNavigate }: { onNavigate: Navigate }) {
  const [view, setView] = useState<"conversation" | "pfa">("conversation");
  return (
    <div className="module-content-stack">
      <ContentIntro label="Conversation and Psychological First Aid" title="Create safety before trying to solve the problem">
        Use a calm, humane and practical response. Managers should not diagnose, provide psychotherapy or pressure anyone to recount a distressing event.
      </ContentIntro>
      <div className="segmented-control" aria-label="Response guide">
        <button className={view === "conversation" ? "active" : ""} onClick={() => setView("conversation")}>R U OK? conversation</button>
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
            <article><span>02</span><h3>LISTEN</h3><p>Approach respectfully, listen without pressure and help the person feel calmer.</p><ul><li>Ask: “I noticed things have been really heavy today. Do you have a few minutes to sit down?”</li><li>Silence digital distractions; use a steady, measured voice.</li><li>Validate: “It is understandable to feel overwhelmed after what happened today.” Avoid “Everyone is stressed; just manage.”</li><li>If welcome, help them ground themselves by noticing contact with the chair or floor and breathing gently and slowly. New or severe physical symptoms need clinical assessment.</li><li>Do not judge or offer unsolicited life advice.</li></ul></article>
            <article><span>03</span><h3>LINK</h3><p>Resolve what is immediately practical and connect the person with social and professional support.</p><ul><li>Reassign non-critical duties where possible.</li><li>Connect with trusted colleagues, family or peer support, with the person’s agreement.</li><li>For severe or persistent distress, offer 1926, psychiatric on-call care or a discreet external cross-referral.</li><li>Agree on a specific follow-up time.</li></ul></article>
          </div>
          <div className="ethics-grid">
            <div><h3>Do</h3><ul><li>Be honest and trustworthy.</li><li>Respect the person’s decisions.</li><li>Acknowledge distress and strengths.</li><li>Share practical support information.</li></ul></div>
            <div><h3>Do not</h3><ul><li>Exploit supervisory authority.</li><li>Force disclosure or traumatic recounting.</li><li>Make false promises.</li><li>Share personal disclosures unnecessarily.</li></ul></div>
          </div>
          <div className="confidentiality-note"><strong>Confidentiality has limits.</strong> Explain that immediate danger, patient-safety risks and safeguarding or legal duties may require need-to-know escalation.</div>
          <a className="source-link standalone" href="https://www.who.int/publications/i/item/9789241548205" target="_blank" rel="noreferrer">WHO Psychological First Aid guide ↗</a>
        </div>
      )}
      <CrossReferralDirectory />
      <section className="module-content-stack" aria-label="Local hospital PFA scenarios">
        <ContentIntro label="Local hospital scenarios" title="Apply Look, Listen, Link on the ward">Use these playbooks alongside the conversation model.</ContentIntro>
        <div className="accordion-list">
          <details className="accordion-item" name="pfa-playbooks"><summary><span>01 · The Brittleness Breakdown — systemic shock</span><span aria-hidden="true">+</span></summary><div className="accordion-body"><p>A nursing officer faces unfair clinical blame or family hostility after a critical medication stockout.</p><ul><li><strong>Look:</strong> check safety, intervene in hostility and arrange relief for the nurse.</li><li><strong>Listen:</strong> validate explicitly: “The supply-chain failure is not your personal fault.” Deflect unfair blame and listen privately.</li><li><strong>Link:</strong> escalate the supply problem through operational channels, arrange a recovery break and offer peer or professional support.</li></ul></div></details>
          <details className="accordion-item" name="pfa-playbooks"><summary><span>02 · The Pulsatile Surge — epidemic overload</span><span aria-hidden="true">+</span></summary><div className="accordion-body"><p>Dengue, COVID or influenza surges leave staff exhausted, panicking or working while unwell.</p><ul><li><strong>Look:</strong> check physical needs, exhaustion, acute distress and safe staffing.</li><li><strong>Listen:</strong> offer a calm private check-in and gentle grounding if welcomed.</li><li><strong>Link:</strong> arrange cover and rotate brief artistic (kala), music or spiritual breaks according to staff preferences. Escalate understaffing and unsafe shifts; breaks supplement adequate rest and staffing.</li></ul></div></details>
          <details className="accordion-item" name="pfa-playbooks"><summary><span>03 · The Generational Boundary Clash — values conflict</span><span aria-hidden="true">+</span></summary><div className="accordion-body"><p>A younger staff member becomes distressed over overtime or roster changes that disrupt study and personal commitments.</p><ul><li><strong>Ask and listen:</strong> start a private R U OK? conversation about the specific pressure.</li><li><strong>Aligning the Journey:</strong> balance the immediate ward need with the individual’s work boundaries and postgraduate aspirations.</li><li><strong>Agree and follow up:</strong> negotiate a specific, voluntary and time-limited arrangement, organise relief and honour the agreed departure time.</li></ul></div></details>
        </div>
      </section>
      <div className="module-next-card"><div><span>Professional support needed?</span><strong>Use the referral pathway.</strong></div><button className="button danger" onClick={() => onNavigate("bridge")}>Open The Bridge</button></div>
    </div>
  );
}

function CrossReferralDirectory() {
  return <section className="cross-referral" aria-labelledby="cross-referral-title">
    <p className="section-label">Discreet external support</p>
    <h2 id="cross-referral-title">Clinical pathways &amp; Cross-Referral Matrix</h2>
    <p>Staff may worry about being recognised by colleagues at a helpline or their own clinic. Listen to that concern and offer another service. Do not force treatment in the person’s workplace or promise guaranteed anonymity.</p>
    <div className="directory-table-wrap"><table className="directory-table"><thead><tr><th>Need or preference</th><th>Pathway</th><th>Next step</th></tr></thead><tbody>
      <tr><td>Comfortable with local care</td><td>Hospital Mental Health Clinic, Consultant Psychiatrist or district Medical Officer – Mental Health</td><td>Arrange a confidential referral using the local hospital directory.</td></tr>
      <tr><td>Privacy from immediate colleagues</td><td>Another Base or Teaching Hospital Mental Health Clinic</td><td>Ask the chosen service about appointment arrangements and privacy.</td></tr>
      <tr><td>Dedicated support for healthcare staff</td><td>NIMH Navodaya Day Centre</td><td><a href="tel:+94112578556">Call 011 257 8556</a> to book in advance.</td></tr>
      <tr><td>Ongoing care and workplace adjustments</td><td>GP or specialist medical officer</td><td>Seek a clinical assessment, care plan and advice on reasonable duty adjustments.</td></tr>
    </tbody></table></div>
    <article className="navodaya-card"><p className="section-label">Dedicated Health Staff Clinic</p><h3>NIMH Navodaya Day Centre</h3><p>Support for healthcare staff, supervised by Consultant Psychiatrist Dr. Gayani Siriwardena.</p><dl><div><dt>Schedule</dt><dd>Thursdays, 2:00–4:00 PM</dd></div><div><dt>Effective from</dt><dd>3 September 2026</dd></div><div><dt>Appointments</dt><dd>Prior booking is mandatory</dd></div><div><dt>Internal extension</dt><dd>500</dd></div></dl><a className="button primary" href="tel:+94112578556">Book: 011 257 8556</a><p className="device-note">Health-staff clinic schedule, clinician and extension supplied in the updated module. Confirm when booking.</p><a className="source-link" href="https://nimh.health.gov.lk/en/navodaya/" target="_blank" rel="noreferrer">NIMH Navodaya service information ↗</a></article>
  </section>;
}

function BridgeModule() {
  const shareResource = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "bridge";
    const text = ["Confidential mental-health support options", "WardWell referral directory: " + url.href, "If the app asks for access, use these contacts directly:", "NIMH: call or SMS 1926; WhatsApp https://wa.me/94755551926", "Navodaya Day Centre: 011 257 8556. Prior booking required. Health staff clinic: Thursdays 2–4 PM (confirm when booking).", "Official service information: https://nimh.health.gov.lk/en/navodaya/", "You can ask for care outside your own workplace.", "For immediate danger or a recent self-harm attempt, seek emergency clinical care; do not wait for a text reply."].join("\n");
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
  };
  return (
    <div className="module-content-stack">
      <section className="lifeline-card">
        <p className="section-label">Primary national lifeline</p>
        <h2>NIMH 1926 Mental Health Helpline</h2>
        <p>Use voice or WhatsApp support when a staff member needs confidential professional guidance. WhatsApp opens directly on supported devices.</p>
        <SupportButtons />
        <span className="number-display">075 555 1926</span><p>For structured remote support, ask 1926 about its teleconference facility and availability. Managers can also seek guidance on handling a ward crisis.</p><a className="source-link" href="https://nimh.health.gov.lk/en/1926-national-mental-health-helpline/" target="_blank" rel="noreferrer">NIMH helpline information ↗</a>
      </section>
      <section className="emergency-protocol">
        <div className="emergency-symbol" aria-hidden="true">!</div>
        <div>
          <p className="section-label">Immediate safety risk</p>
          <h3>Activate the hospital emergency pathway now</h3>
          <ol>
            <li>Move the person away from active clinical duties safely and compassionately.</li>
            <li>Do not leave them alone when there is immediate risk of self-harm or danger to others. A disclosed recent self-harm attempt requires immediate professional assessment and a safe clinical handover.</li>
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
        <article><span className="directory-type">Peer support</span><h3>The Anchor Network</h3><p>An internal Employee Help Network of designated senior doctors, nursing sisters and clinical staff trained to listen without judgement, discuss burnout or ward conflict, and guide colleagues to formal care.</p><p><strong>The Digital Anchor:</strong> approved peer-moderated WhatsApp groups can support practical coordination. Check local arrangements and consent before joining; do not post identifiable clinical or personal disclosures in groups.</p><span className="pending-tag">Local Anchor names and contacts not yet supplied</span></article>
        <article><span className="directory-type">Alternative crisis line</span><h3>1333 CCCline</h3><p>A toll-free, 24/7 crisis-support and suicide-prevention pathway for distress, despair and thoughts of self-harm. In immediate danger, use emergency clinical care.</p><a href="tel:1333">Call 1333</a><a className="source-link" href="https://cccfoundation.org.au/" target="_blank" rel="noreferrer">CCC Foundation service information ↗</a></article>
        <article><span className="directory-type">Administrative support</span><h3>Grievance and redress</h3><p>Use the appropriate Ministry or institutional grievance channel for harassment, unresolved conflict or systemic administrative failures.</p><span className="pending-tag">Contact pending</span></article>
      </div>
      <CrossReferralDirectory />
      <section className="local-directory"><span>Local hospital directory</span><h3>Hospital-specific contacts</h3><ul><li>Ward Medical Officer – Mental Health: extension not yet supplied.</li><li>Anchor Network: designated staff names and numbers not yet supplied.</li><li>Nearest Teaching Hospital Mental Health Clinic: schedule and location not yet supplied.</li><li>Ministry or institutional grievance unit: direct contact not yet supplied.</li></ul><button className="button primary" onClick={shareResource}>Share Resource via WhatsApp</button><p>Opens WhatsApp so you can choose the recipient and send the directory. No assessment responses or staff details are included.</p></section>
    </div>
  );
}

const shieldKnowledge = [
  { title: "Crisis Rostering & Buffering", body: ["During severe staff shortages, prioritise critical clinical tasks and reallocate non-critical administrative work such as 5S activities and audits.", "Reduce defensive nursing by clarifying essential documentation and escalating system constraints; retain safety-critical records.", "Protect breaks, rotate high-intensity duties and escalate unsafe staffing or supply shortages rather than expecting staff to absorb every failure."] },
  { title: "Shielding from Friction — Aligning the Journey", body: ["Balance staff work-life boundaries and personal goals with acute ward needs. Ask about the individual’s priorities rather than assuming all younger staff share the same views.", "Negotiate a specific, voluntary short extension where feasible, arrange relief and honour the agreed departure time.", "Avoid threats or relying only on duty-based enforcement; communicate openly about the immediate need and what support you can offer in return."] },
  { title: "Eradicating Blame Culture", body: ["Act as an administrative shield when junior staff face hostility caused by medication stockouts, equipment failures or other system constraints.", "Intercept aggression safely, deflect unfair clinical blame and provide a recovery break.", "Examine fatigue and operational causes before disciplinary conclusions, while still addressing harmful behaviour and maintaining fair accountability."] },
  { title: "The Manager’s Own Shield", body: ["Protect rest and recovery after extended duty. Continuous 24–48-hour shifts are a warning sign to escalate unsafe workloads and arrange relief.", "Use personally meaningful coping activities such as music, exercise or spirituality; participation should respect individual preferences.", "After a safe handover, disconnect from non-urgent ward messages, maintain clear emergency cover and seek trusted peer or professional support."] },
];

const scenarios = [
  { title: "The Out-of-Stock Crisis — Systemic Brittleness", prompt: "It is 8:00 PM. The pharmacy is out of a critical antibiotic. A patient’s relative is shouting aggressively at a junior Nursing Officer at the station. As the Ward In-Charge, what is your immediate action?", options: [
    { key: "a", label: "Instruct the junior nurse to explain the supply chain issue to the relative.", tone: "incorrect", feedback: "Incorrect. This leaves the junior staff member in the direct line of fire. A core duty of a manager is to act as the administrative shield." },
    { key: "b", label: "Step in, ask the relative to step into the corridor with you, and instruct the nurse to take a 5-minute break in the staff room.", tone: "correct", feedback: "Correct! You intercepted the aggression, protected the junior staff member and initiated a micro-break. Keep the conversation in a safe area with support available; do not isolate yourself with a threatening person." },
    { key: "c", label: "Call hospital security immediately before engaging the relative.", tone: "caution", feedback: "Use judgement. Calm de-escalation is appropriate when safe; call security immediately if there are threats or physical safety is uncertain. Never delay safety assistance." },
  ] },
  { title: "The Generational Clash — Duty vs. Rights", prompt: "A younger Gen Z nurse is scheduled to leave at 4:00 PM to prepare for a postgraduate exam. At 3:45 PM, a sudden ward emergency occurs. When asked to stay and cover, the nurse refuses, citing their rights and off-duty time. How do you respond?", options: [
    { key: "a", label: "Quote the Establishment Code (E-Code) and threaten disciplinary action for abandonment of duty.", tone: "incorrect", feedback: "Incorrect. Relying solely on duty-based enforcement can create psychological friction and undermine trust. Discuss the immediate need and the person’s commitments." },
    { key: "b", label: "Let the nurse leave immediately and absorb the workload yourself by pulling a double shift.", tone: "caution", feedback: "Sub-optimal. Absorbing every gap contributes to your own burnout and the ‘Squeezed Middle’ phenomenon. Arrange relief and escalate capacity constraints." },
    { key: "c", label: "Align the Journey: negotiate a 30-minute extension to stabilise the crisis, guaranteeing departure at 4:30 PM with study time respected.", tone: "correct", feedback: "Correct! An agreed, time-limited extension can bridge the acute ward need and the staff member’s personal goals. Arrange cover, honour the departure time and use another staffing pathway if they cannot agree." },
  ] },
  { title: "The Pulsatile Surge — Epidemic Overload", prompt: "Your specialised ward is in a massive dengue epidemic surge. Staff are working 24-hour shifts, morale is crashing, and you notice presenteeism—staff working while exhausted. What intervention is required?", options: [
    { key: "a", label: "Implement a brief, 10-minute artistic (kala) or spiritual break in the staff room, rotating staff through to decompress.", tone: "correct", feedback: "Correct! Offer staff a brief, supported recovery break that fits their preferences, with safe clinical cover. Also escalate staffing and fatigue risks: micro-breaks do not replace sleep, rest or adequate staffing." },
    { key: "b", label: "Push them to work harder, reminding them that patients will die if they stop.", tone: "incorrect", feedback: "Incorrect. Using guilt during an acute surge accelerates distress and burnout. Protect recovery and address the workload." },
  ] },
];

const commitmentOptions = [
  "Enforce one 15-minute micro-break for all staff.",
  "Hold a 5-minute transparent pre-shift huddle to discuss today’s shortages.",
  "Re-assign a highly stressed staff member away from the OPD triage desk today.",
  "Leave on time today and mute ward WhatsApp groups.",
];

function ShieldModule({ savedPlan, onCommit, onHome }: { savedPlan: string[]; onCommit: (items: string[]) => void; onHome: () => void }) {
  const [stage, setStage] = useState<"knowledge" | "scenario" | "triage" | "commitment">("knowledge");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [responses, setResponses] = useState<Array<string | null>>([null, null, null]);
  const [triage, setTriage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(savedPlan.filter((item) => commitmentOptions.includes(item)).slice(0, 3));
  const [success, setSuccess] = useState(false);
  const scenario = scenarios[scenarioIndex];
  const scenarioFeedback = scenario.options.find((item) => item.key === responses[scenarioIndex]);
  const toggleCommitment = (item: string) => {
    if (selected.includes(item)) setSelected(selected.filter((entry) => entry !== item));
    else if (selected.length < 3) setSelected([...selected, item]);
  };

  if (success) return <div className="commitment-success" aria-live="polite"><span className="success-mark">✓</span><p className="section-label">Success · My Ward Shield</p><h2>Your action plan is ready.</h2><p>You have committed to protecting your team. Your summary is available on the Dashboard.</p><ol>{selected.map((item) => <li key={item}>{item}</li>)}</ol><span className="device-note">Available in this session; retained on this device when browser storage is available.</span><button className="button primary" onClick={onHome}>Return to dashboard</button></div>;

  return <div className="module-content-stack">
    <ContentIntro label="Protective ward leadership" title="Reduce preventable pressure before it becomes harm">Learn the core principles, practise three ward scenarios, identify the root cause and create your weekly action plan.</ContentIntro>
    <ol className="shield-progress" aria-label="Shield activity progress">{["knowledge", "scenario", "triage", "commitment"].map((step, index) => <li key={step} aria-current={stage === step ? "step" : undefined}>{index + 1}. {["Core knowledge", "Ward simulator", "Triage", "My commitment"][index]}</li>)}</ol>
    {stage === "knowledge" && <>
      <div className="accordion-list compact-list">{shieldKnowledge.map((item, index) => <details name="shield-knowledge" className="accordion-item" key={item.title} open={index === 0}><summary><span className="accordion-index">0{index + 1}</span><span>{item.title}</span><span className="accordion-toggle" aria-hidden="true">+</span></summary><div className="accordion-body"><ul>{item.body.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></details>)}</div>
      <button className="button primary" onClick={() => setStage("scenario")}>Proceed to ward simulator →</button>
    </>}
    {stage === "scenario" && <section className="interactive-tool" aria-labelledby="scenario-title">
      <p className="tool-number">Interactive tool 01 · Scenario {scenarioIndex + 1} of 3</p><h2 id="scenario-title">Scenario simulator</h2><div className="scenario-box"><span>{scenario.title}</span><p>{scenario.prompt}</p></div>
      <div className="scenario-options">{scenario.options.map((option) => <button className={responses[scenarioIndex] === option.key ? "scenario-option selected" : "scenario-option"} aria-pressed={responses[scenarioIndex] === option.key} key={option.key} onClick={() => setResponses((previous) => previous.map((value, index) => index === scenarioIndex ? option.key : value))}><span>{option.key.toUpperCase()}</span>{option.label}</button>)}</div>
      {scenarioFeedback && <div className={`feedback-box ${scenarioFeedback.tone}`} role="status"><strong>{scenarioFeedback.tone === "correct" ? "Correct" : scenarioFeedback.tone === "caution" ? "Use caution" : "Reconsider"}</strong><p>{scenarioFeedback.feedback}</p></div>}
      <div className="question-navigation"><button className="button secondary" onClick={() => scenarioIndex === 0 ? setStage("knowledge") : setScenarioIndex(scenarioIndex - 1)}>Previous</button><button className="button primary" disabled={!scenarioFeedback} onClick={() => scenarioIndex < 2 ? setScenarioIndex(scenarioIndex + 1) : setStage("triage")}>{scenarioIndex < 2 ? "Next scenario" : "Continue to triage"}</button></div>
    </section>}
    {stage === "triage" && <section className="interactive-tool" aria-labelledby="triage-title">
      <p className="tool-number">Interactive tool 02</p><h2 id="triage-title">Blame vs. System Triage</h2><div className="scenario-box"><span>Identify the root cause</span><p>A highly reliable Medical Officer snaps aggressively at a matron over a delayed patient chart. Which explanation should you investigate before jumping to a disciplinary conclusion?</p></div>
      <div className="triage-options"><button className={triage === "discipline" ? "selected" : ""} aria-pressed={triage === "discipline"} onClick={() => setTriage("discipline")}>Disciplinary Issue</button><button className={triage === "system" ? "selected" : ""} aria-pressed={triage === "system"} onClick={() => setTriage("system")}>Systemic / Psychosocial Hazard</button></div>
      {triage && <div className={`feedback-box ${triage === "system" ? "correct" : "incorrect"}`} role="status"><strong>{triage === "system" ? "Correct — investigate the system" : "Re-evaluate"}</strong><p>{triage === "system" ? "Sudden uncharacteristic aggression may signal exhaustion or critical-incident stress. Create safety, offer PFA from Module 3 and investigate shifts, incidents and delays. Address the harmful behaviour fairly after immediate support; this observation does not establish a diagnosis." : "The behaviour is unacceptable, but jumping to discipline can miss the cause. Has this MO worked a double shift or experienced a critical incident? Investigate the system before issuing a warning."}</p></div>}
      <div className="question-navigation"><button className="button secondary" onClick={() => setStage("scenario")}>Back to simulator</button><button className="button primary" disabled={!triage} onClick={() => setStage("commitment")}>Create my commitment →</button></div>
    </section>}
    {stage === "commitment" && <section className="interactive-tool commitment-tool" aria-labelledby="commitment-title">
      <p className="tool-number">Interactive tool 03</p><h2 id="commitment-title">My Ward Shield Commitment</h2><p>Select one to three protective actions you will implement on your ward this week.</p>
      <div className="commitment-options">{commitmentOptions.map((item) => {const checked = selected.includes(item); const disabled = !checked && selected.length >= 3; return <label className={disabled ? "disabled" : ""} key={item}><input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleCommitment(item)} /><span className="custom-check" aria-hidden="true">✓</span><span>{item}</span></label>;})}</div>
      <p className="device-note">Arrange safe cover for breaks or duty changes and a clear handover before disconnecting. Preserve the agreed emergency contact route.</p>
      <div className="commitment-footer"><span>{selected.length}/3 selected · saved only after you generate the plan</span><button className="button primary" disabled={selected.length < 1 || selected.length > 3} onClick={() => { onCommit(selected); setSuccess(true); }}>Generate my action plan</button></div><button className="inline-back" onClick={() => setStage("triage")}>← Back to triage</button>
    </section>}
  </div>;
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
