import { NextResponse } from "next/server";
import { profile } from "@/data/profile";

const USER = profile.githubUsername;
const REVALIDATE = 3600;

export const revalidate = 3600;

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  company: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubPayload {
  user: GitHubUser | null;
  readme: string | null;
  repos: GitHubRepo[];
  contributions: { total: number; days: ContributionDay[] } | null;
}

/* A personal access token is optional. Everything here is cached for an hour
   server-side, so the unauthenticated 60/hr limit is never a factor — the
   token only matters if the cache is cold repeatedly. */
function headers(accept = "application/vnd.github+json"): HeadersInit {
  const h: Record<string, string> = { Accept: accept };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function ghJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE },
  });
  return res.ok ? ((await res.json()) as T) : null;
}

async function ghReadme(): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${USER}/${USER}/readme`,
    {
      headers: headers("application/vnd.github.raw"),
      next: { revalidate: REVALIDATE },
    },
  );
  return res.ok ? await res.text() : null;
}

async function ghContributions() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
    { next: { revalidate: REVALIDATE } },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as {
    total: Record<string, number>;
    contributions: ContributionDay[];
  };

  return {
    total: Object.values(data.total)[0] ?? 0,
    days: data.contributions,
  };
}

export async function GET() {
  const [user, readme, rawRepos, contributions] = await Promise.all([
    ghJson<GitHubUser>(`/users/${USER}`),
    ghReadme(),
    ghJson<(GitHubRepo & { fork: boolean })[]>(
      `/users/${USER}/repos?per_page=100&sort=pushed`,
    ),
    ghContributions(),
  ]);

  const repos: GitHubRepo[] = (rawRepos ?? [])
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      topics: r.topics ?? [],
      pushed_at: r.pushed_at,
    }));

  const payload: GitHubPayload = { user, readme, repos, contributions };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate" },
  });
}
