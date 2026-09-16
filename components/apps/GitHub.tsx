"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { GitHubIcon } from "@/components/icons/AppIcons";
import type {
  ContributionDay,
  GitHubPayload,
  GitHubRepo,
} from "@/app/api/github/route";

/* The README is fetched from a remote source, so raw HTML is sanitised before
   it renders. The allowances below cover the presentational attributes a
   GitHub profile README actually uses. */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), "align"],
    p: [...(defaultSchema.attributes?.p ?? []), "align"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "align"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "align"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "align"],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "width",
      "height",
      "align",
    ],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Java: "#b07219",
};

const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function StatIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
      <path d={path} />
    </svg>
  );
}

const ICON_PEOPLE =
  "M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.5 5.5 0 013.034 4.084.75.75 0 11-1.482.235 4 4 0 00-7.9 0 .75.75 0 01-1.482-.236A5.5 5.5 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.53.717 4 4 0 012.836 3.256.75.75 0 001.482-.236 5.5 5.5 0 00-2.096-3.55A3 3 0 0011 4z";
const ICON_STAR =
  "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z";
const ICON_REPO =
  "M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8z";
const ICON_FORK =
  "M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0z";

function ContributionGraph({
  days,
  total,
}: {
  days: ContributionDay[];
  total: number;
}) {
  const weeks = useMemo(() => {
    if (!days.length) return [];
    const pad = new Date(days[0].date).getUTCDay();
    const cells: (ContributionDay | null)[] = [
      ...Array<null>(pad).fill(null),
      ...days,
    ];
    const out: (ContributionDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [days]);

  const monthLabels = useMemo(() => {
    let last = -1;
    return weeks.map((week) => {
      const first = week.find(Boolean);
      if (!first) return "";
      const d = new Date(first.date);
      const m = d.getUTCMonth();
      if (m !== last && d.getUTCDate() <= 7) {
        last = m;
        return d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
      }
      return "";
    });
  }, [weeks]);

  return (
    <section className="rounded-md border border-[#30363d] p-4">
      <h3 className="mb-3 text-sm text-[#e6edf3]">
        {total.toLocaleString()} contributions in the last year
      </h3>

      <div className="mac-scroll overflow-x-auto pb-1">
        <div className="inline-block">
          <div className="mb-1 flex gap-[3px] text-[10px] text-[#7d8590]">
            {monthLabels.map((label, i) => (
              <span key={i} className="w-[10px] shrink-0 whitespace-nowrap">
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di];
                  return (
                    <span
                      key={di}
                      title={
                        day
                          ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                          : undefined
                      }
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{
                        background: day
                          ? LEVEL_COLORS[day.level]
                          : "transparent",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] text-[#7d8590]">
        <span className="mr-1">Less</span>
        {LEVEL_COLORS.map((c) => (
          <span
            key={c}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ background: c }}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </section>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-md border border-[#30363d] p-4 transition-colors hover:border-[#8b949e]"
    >
      <span className="text-sm font-semibold text-[#4493f8]">{repo.name}</span>

      {repo.description && (
        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#7d8590]">
          {repo.description}
        </span>
      )}

      {repo.topics.length > 0 && (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#388bfd26] px-2 py-0.5 text-[11px] text-[#4493f8]"
            >
              {t}
            </span>
          ))}
        </span>
      )}

      <span className="mt-auto flex items-center gap-4 pt-3 text-[11px] text-[#7d8590]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: LANGUAGE_COLORS[repo.language] ?? "#8b949e",
              }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <StatIcon path={ICON_STAR} />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <StatIcon path={ICON_FORK} />
            {repo.forks_count}
          </span>
        )}
      </span>
    </a>
  );
}

export function GitHub() {
  const [data, setData] = useState<GitHubPayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<"overview" | "repositories">("overview");

  useEffect(() => {
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#0d1117] text-center">
        <GitHubIcon className="h-14 w-14 opacity-60" />
        <p className="text-sm text-[#e6edf3]">Could not reach GitHub</p>
        <p className="text-xs text-[#7d8590]">Check your connection and reopen.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0d1117]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#30363d] border-t-[#7d8590]" />
      </div>
    );
  }

  const { user, readme, repos, contributions } = data;

  return (
    <div className="mac-scroll h-full overflow-auto bg-[#0d1117]">
      <header className="sticky top-0 z-10 border-b border-[#30363d] bg-[#161b22] px-5">
        <div className="flex items-center gap-2 py-3">
          <GitHubIcon className="h-6 w-6" />
          <span className="text-sm text-[#e6edf3]">{user?.login}</span>
        </div>

        <nav className="flex gap-4 text-[13px]">
          {(["overview", "repositories"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-1 pb-2 capitalize ${
                tab === t
                  ? "border-[#fd8c73] font-semibold text-[#e6edf3]"
                  : "border-transparent text-[#7d8590] hover:text-[#e6edf3]"
              }`}
            >
              {t}
              {t === "repositories" && (
                <span className="ml-1.5 rounded-full bg-[#30363d] px-1.5 py-0.5 text-[11px]">
                  {repos.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-col gap-6 px-5 py-5 md:flex-row">
        <aside className="w-full shrink-0 md:w-[260px]">
          {user && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url}
                alt={user.login}
                className="h-[200px] w-[200px] rounded-full border border-[#30363d] object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-[#e6edf3]">
                {user.name}
              </h2>
              <p className="text-lg font-light text-[#7d8590]">{user.login}</p>

              {user.bio && (
                <p className="mt-3 text-sm text-[#e6edf3]">{user.bio}</p>
              )}

              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-md border border-[#30363d] bg-[#21262d] py-1.5 text-center text-sm font-medium text-[#e6edf3] hover:bg-[#30363d]"
              >
                View on GitHub
              </a>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-[#7d8590]">
                <StatIcon path={ICON_PEOPLE} />
                <span className="font-semibold text-[#e6edf3]">
                  {user.followers}
                </span>
                followers
                <span className="text-[#30363d]">·</span>
                <span className="font-semibold text-[#e6edf3]">
                  {user.following}
                </span>
                following
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7d8590]">
                <StatIcon path={ICON_REPO} />
                <span className="font-semibold text-[#e6edf3]">
                  {user.public_repos}
                </span>
                repositories
              </div>
            </>
          )}
        </aside>

        <main className="min-w-0 flex-1">
          {tab === "overview" ? (
            <div className="flex flex-col gap-6">
              {readme && (
                <section className="rounded-md border border-[#30363d] p-6">
                  <div className="gh-md">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
                    >
                      {readme}
                    </ReactMarkdown>
                  </div>
                </section>
              )}

              {contributions && (
                <ContributionGraph
                  days={contributions.days}
                  total={contributions.total}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {repos.map((r) => (
                <RepoCard key={r.name} repo={r} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
