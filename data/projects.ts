export interface Project {
  id: string;
  name: string;
  tagline: string;
  period: string;
  accolade?: string;
  description: string[];
  tech: string[];
  /** owner/name — used for both the github.com URL and the GitHub API */
  repo: string;
  live?: string;
  archived?: boolean;
}

export const projects: Project[] = [
  {
    id: "medimitra",
    name: "MediMitra",
    tagline: "AI-powered telemedicine platform",
    period: "Sep 2025 — Oct 2025",
    accolade: "Smart India Hackathon 2025 — Top 40 (Internal Round)",
    description: [
      "Cross-platform (Web + Android) telemedicine platform with WebRTC video consultations and Socket.io messaging.",
      "Multilingual AI symptom checker covering English, Hindi and Punjabi, served by a containerized FastAPI microservice.",
      "Deployed on AWS EC2 with RDS PostgreSQL; Android app published via Capacitor.",
    ],
    tech: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Python",
      "FastAPI",
      "WebRTC",
      "Socket.io",
      "AWS EC2",
      "Capacitor",
    ],
    repo: "udayan-majumder/Medi_Mitra",
  },
  {
    id: "aidalert",
    name: "AidAlert",
    tagline: "Real-time emergency response platform",
    period: "May 2025 — Jun 2025",
    accolade: "Google Solution Challenge 2025 — Top 100 of 3,700+ teams",
    description: [
      "Real-time emergency response platform with SOS tracking, live weather APIs and three-role authentication for Admin, NGO and User.",
      "Dockerized backend deployed on AWS EC2 behind an NGINX reverse proxy with SSL and AWS RDS PostgreSQL.",
    ],
    tech: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
      "NGINX",
      "AWS EC2",
      "AWS RDS",
    ],
    repo: "udayan-majumder/AidAlert",
  },
  {
    id: "shoppy",
    name: "Shoppy",
    tagline: "Full-stack e-commerce platform",
    period: "Jun 2025 — Aug 2025",
    description: [
      "End-to-end commerce platform with product listings, cart, checkout and payments, authentication, orders, reviews and promo codes.",
      "Deployed via Docker and NGINX on AWS EC2 with SSL.",
    ],
    tech: [
      "React",
      "Next.js",
      "TypeScript",
      "Zustand",
      "Chakra UI",
      "Express.js",
      "PostgreSQL",
      "Docker",
      "AWS EC2",
    ],
    repo: "udayan-majumder/Ecommerce",
  },
  {
    id: "fundseeker",
    name: "FundSeeker",
    tagline: "AI startup–investor matching engine",
    period: "Oct 2025 — Nov 2025",
    accolade: "Best Frontend Award — AI Unleashed 2025",
    description: [
      "AI matching engine pairing startups with investors using a fine-tuned Llama 3.1 8B model and weighted compatibility scoring across sector and business fit.",
      "Redis caching for match query optimization; structured JSON match scores persisted to MongoDB Atlas.",
      "Frontend shipped through Vercel CI/CD, backend on AWS EC2.",
    ],
    tech: [
      "React",
      "Vite",
      "Chakra UI",
      "Python",
      "Flask",
      "Redis",
      "MongoDB Atlas",
      "AWS EC2",
    ],
    repo: "sritama77/Fundseeker-AI",
  },
  {
    id: "chatsystem",
    name: "Chat System",
    tagline: "Browser-based chat interface",
    period: "2022 — 2023",
    description: [
      "An early project — a chat interface built with vanilla HTML, CSS and JavaScript, with no framework or build step.",
    ],
    tech: ["JavaScript", "HTML", "CSS"],
    repo: "udayan-majumder/chatSystem",
    live: "https://chat-system-blond.vercel.app",
    archived: true,
  },
];

export const featuredProjects = projects.filter((p) => !p.archived);
export const archivedProjects = projects.filter((p) => p.archived);
