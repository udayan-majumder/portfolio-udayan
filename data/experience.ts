export interface Role {
  id: string;
  title: string;
  company: string;
  type: "Full-time" | "Internship" | "Freelance";
  location: string;
  period: string;
  current: boolean;
  stack: string[];
  highlights: string[];
}

export const experience: Role[] = [
  {
    id: "sequoia",
    title: "Full Stack Engineer",
    company: "Sequoia Print Pvt Ltd",
    type: "Full-time",
    location: "Kolkata",
    period: "May 2026 — Present",
    current: true,
    stack: ["React", "Node.js", "PostgreSQL", "Prisma", "Python"],
    highlights: [
      "Resolved a critical database ID overlap issue and redesigned the schema to guarantee referential integrity.",
      "Cut API response times by 20% through strategic caching.",
      "Built an image OCR detection pipeline at 80% accuracy plus internal billing automation software, eliminating manual data entry.",
    ],
  },
  {
    id: "brinavv",
    title: "Full Stack Developer Intern",
    company: "Brinavv Technologies Pvt Ltd",
    type: "Internship",
    location: "Remote — Hyderabad",
    period: "Feb 2026 — Apr 2026",
    current: false,
    stack: ["MongoDB", "Express", "React", "Node.js", "Redux Toolkit", "Azure"],
    highlights: [
      "Engineered a School ERP Fee Management system with JWT-based RBAC across Admin, Student and Faculty roles.",
      "Designed MongoDB schemas with indexing and aggregation pipelines for payment processing and installment tracking — 45% faster APIs, 30% higher payment throughput.",
      "Built React dashboards and dynamic forms with Redux Toolkit in a monorepo CSR architecture on Microsoft Azure.",
      "Used Mongoose transactions to hold data consistent under concurrent operations; reviewed code via Git PR workflows.",
    ],
  },
  {
    id: "betphile",
    title: "Web Developer",
    company: "Betphile",
    type: "Freelance",
    location: "Remote",
    period: "Mar 2025",
    current: false,
    stack: ["Next.js", "Chakra UI", "AWS Amplify"],
    highlights: [
      "Built an SEO-optimized Next.js landing platform with SSR, improving discoverability and reducing initial load time.",
      "Configured an AWS Amplify CI/CD pipeline for automated production deployments.",
    ],
  },
];
