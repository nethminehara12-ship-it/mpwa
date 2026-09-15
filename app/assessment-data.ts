export type AssessmentKey = "self" | "team" | "staff";
export type Question = { text: string; options?: Array<{ label: string; value: number }> };

export const standardOptions = [
  {
    "label": "Often",
    "value": 2
  },
  {
    "label": "Sometimes",
    "value": 1
  },
  {
    "label": "Rarely",
    "value": 0
  }
];
export const assessments: Record<AssessmentKey, { title: string; subtitle: string; questions: Question[] }> = {
  "self": {
    "title": "Manager’s Self-Check",
    "subtitle": "Protecting the protector: evaluate your own capacity.",
    "questions": [
      {
        "text": "Are you finding it hard to relax or experiencing tension headaches and muscle pain?"
      },
      {
        "text": "Are your sleeping, eating, and exercising routines interrupted or harder to maintain?"
      },
      {
        "text": "Are you feeling more isolated, alone, or reluctant to seek connection?"
      },
      {
        "text": "Are you experiencing lingering anger, sadness, or a loss of joy in day-to-day tasks?"
      },
      {
        "text": "Are you relying more heavily on alcohol or other substances to feel better?"
      },
      {
        "text": "[Role Creep Identifier] Are you personally absorbing the operational failures of other departments (e.g., chasing pharmacy stocks, managing support staff discipline) to keep the ward running?"
      },
      {
        "text": "[Hyper-Vigilance Check] Are you working excessive continuous shifts (e.g., 24-48 hours) because you feel the system will collapse if you step away?"
      }
    ]
  },
  "team": {
    "title": "Team Structural Check",
    "subtitle": "Evaluate ward risk factors and psychosocial hazards.",
    "questions": [
      {
        "text": "Is the team missing mandated meal breaks or working excessive, unpredictable overtime?"
      },
      {
        "text": "Have you observed sudden irritability, sarcasm, or an increase in interpersonal conflict on the ward?"
      },
      {
        "text": "Are staff members missing deadlines or showing signs of \"presenteeism\" (attending work while ill)?"
      },
      {
        "text": "Has the ward recently experienced a critical incident (e.g., patient mortality) without a formal debrief?",
        "options": [
          {
            "label": "Yes",
            "value": 2
          },
          {
            "label": "Not sure",
            "value": 1
          },
          {
            "label": "No",
            "value": 0
          }
        ]
      },
      {
        "text": "Are staff members appearing dazed, withdrawn, or shutting down during shifts?"
      },
      {
        "text": "[Brittleness Metric] Is the ward currently facing severe systemic fragility, such as critical medication or equipment stockouts causing patient hostility?"
      },
      {
        "text": "[Quality vs. Capacity Metric] Are non-critical administrative tasks (e.g., 5S accreditations, ministry audits) currently disproportionate to the ward's actual capacity to provide basic clinical care?"
      }
    ]
  },
  "staff": {
    "title": "Individual Staff Check",
    "subtitle": "Supportive observation of one worker; do not record their identity.",
    "questions": [
      {
        "text": "Has the employee shown recent changes in routine, such as increased absenteeism, lateness, or \"presenteeism\" (attending work but underperforming)?"
      },
      {
        "text": "Do they appear dazed, withdrawn, or socially isolated from the rest of the clinical team?"
      },
      {
        "text": "Have you noticed sudden irritability, reactivity, or uncharacteristically aggressive behavior on the ward?"
      },
      {
        "text": "Is there a visible drop in their concentration, memory, or overall ability to perform standard clinical/administrative tasks?"
      },
      {
        "text": "Are they exhibiting signs of severe distress, such as crying, illogical thought processes, or expressing unusual/disturbing thoughts?"
      },
      {
        "text": "[Defensive Nursing] Are they hyper-fixating on paperwork to avoid litigation, rather than providing direct, empathetic patient care?"
      },
      {
        "text": "[Generational Boundary Clash] Is the employee engaging in rigid boundary-setting (e.g., abrupt refusal to work overtime) that is causing acute friction with veteran staff?"
      }
    ]
  }
};
export const bandMeta = [
  {
    "min": 0,
    "max": 3,
    "key": "green",
    "title": "Mentally Healthy",
    "summary": "Optimal Capacity. The individual or team adapts to change, feels confident, and performs well."
  },
  {
    "min": 4,
    "max": 7,
    "key": "yellow",
    "title": "Stress Response",
    "summary": "Reacting. Early signs of strain. The individual or team feels anxious or irritated and finds it hard to stay focused."
  },
  {
    "min": 8,
    "max": 11,
    "key": "amber",
    "title": "Mental Distress",
    "summary": "Injured / Struggling. Experiencing feelings of helplessness, lingering anger, or difficulty with day-to-day tasks."
  },
  {
    "min": 12,
    "max": 14,
    "key": "red",
    "title": "High Stress Response / Crisis",
    "summary": "Critical. Extreme difficulty processing, emotional outbursts, or severe operational impairment."
  }
];
const directives: Record<string, string[]> = {
  "green": [
    "Maintain: Continue current supportive practices and smart work design.",
    "Protect: Ensure staff keep taking their allocated breaks to sustain this baseline.",
    "Growth: Focus on professional development and building team connectedness."
  ],
  "yellow": [
    "Self-Care / Individual: Start by having an informal chat to ask how they are doing. Implement Wellness Action Plans (WAPs) and ensure you disconnect after your shift.",
    "Listen Actively: Give them time to answer, and listen to what they say without making assumptions.",
    "Ward Adjustment (Team-Check): Briefly review the roster for the next 48 hours to ease immediate bottlenecks.",
    "Align the Journey (Gen Z): If encountering rigid boundaries, negotiate by aligning ward survival with the staff member's personal goals (e.g., study time)."
  ],
  "amber": [
    "Intervene: Do not wait. Plan a more formal meeting with the employee in a private place where you won’t be interrupted. Initiate a one-on-one \"R U OK\" conversation using the scripts in Module 3: The Response.",
    "Structural Shield (Critical): Immediately pause or reallocate non-critical administrative tasks (like 5S activities) to buffer the affected staff members against supply-chain Brittleness.",
    "Signpost: Provide information on the Employee Assistance Programme (EAP) or encourage them to speak to a GP. Provide a confidential support service."
  ],
  "red": [
    "Immediate Escalation: Proceed immediately to Module 4: The Bridge to connect with the 1926 Helpline.",
    "Ensure Safety: If there is any risk of self-harm or danger to others, engage the hospital psychiatric on-call emergency protocol immediately. Remove the staff member from active clinical duties safely and compassionately; do not leave them alone or send them away without a safe clinical handover.",
    "Emergency Protocol: Call emergency services, contact a doctor, or go to the local hospital emergency department if immediate action is needed."
  ]
};
export function assessmentBand(score: number) {
  if (!Number.isInteger(score) || score < 0 || score > 14) throw new RangeError("Score must be an integer from 0 to 14");
  return bandMeta.find((band) => score >= band.min && score <= band.max)!;
}
export function directivesFor(type: AssessmentKey, band: string) {
  const actions = directives[band];
  if (type === "self" && band === "amber") return ["Intervene: Arrange a private conversation with a trusted colleague or professional support service; use Module 3 to guide the discussion.", ...actions.slice(1)];
  return actions;
}
