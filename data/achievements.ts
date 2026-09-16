export interface Achievement {
  id: string;
  title: string;
  event: string;
  period: string;
  role: string;
  detail: string;
  projectId?: string;
}

export const achievements: Achievement[] = [
  {
    id: "sih-2025",
    title: "Top 40 Nationally",
    event: "Smart India Hackathon 2025",
    period: "Sep 2025 — Oct 2025",
    role: "Full Stack Dev",
    detail:
      "Cleared the internal round and placed in the national Top 40 with MediMitra, a cross-platform telemedicine platform with WebRTC consultations and a multilingual AI symptom checker.",
    projectId: "medimitra",
  },
  {
    id: "gsc-2025",
    title: "Top 100 of 3,700+ Teams",
    event: "Google Solution Challenge 2025",
    period: "May 2025 — Jun 2025",
    role: "Team Lead, Full Stack Dev",
    detail:
      "Led the team behind AidAlert to the Top 100 nationwide and advanced to the final round.",
    projectId: "aidalert",
  },
  {
    id: "ai-unleashed-2025",
    title: "Best Frontend Award",
    event: "AI Unleashed 2025",
    period: "Oct 2025 — Nov 2025",
    role: "Team Member, Backend Dev",
    detail:
      "Won Best Frontend for FundSeeker, an AI startup–investor matching platform powered by a fine-tuned Llama 3.1 8B model.",
    projectId: "fundseeker",
  },
];
