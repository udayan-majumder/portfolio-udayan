"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import { SafariIcon } from "@/components/icons/AppIcons";

type PageId = "home" | "resume" | "error";

interface Page {
  id: PageId;
  address: string;
  title: string;
  /** For the error page — the address the visitor actually typed. */
  query?: string;
}

const HOME: Page = { id: "home", address: "udayanmajumder.dev", title: `${profile.name} — ${profile.title}` };
const RESUME: Page = { id: "resume", address: "udayanmajumder.dev/resume.pdf", title: "resume.pdf" };

const HOME_ALIASES = new Set(["", "home", "start", "udayanmajumder.dev", "https://udayanmajumder.dev"]);
const RESUME_ALIASES = new Set([
  "resume",
  "resume.pdf",
  "udayanmajumder.dev/resume.pdf",
  "https://udayanmajumder.dev/resume.pdf",
  "/resume.pdf",
]);

interface Bookmark {
  label: string;
  kind: "internal" | "external";
  target: string;
}

const BOOKMARKS: Bookmark[] = [
  { label: "Start Page", kind: "internal", target: "home" },
  { label: "Résumé", kind: "internal", target: "resume" },
  { label: "GitHub", kind: "external", target: profile.links.github },
  { label: "LinkedIn", kind: "external", target: profile.links.linkedin },
  ...projects
    .filter((p) => p.live)
    .map((p) => ({ label: `${p.name} (Live)`, kind: "external" as const, target: p.live! })),
];

function normalizeExternal(raw: string): string {
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function looksLikeUrl(raw: string): boolean {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(raw) || /^https?:\/\//i.test(raw);
}

function ToolbarIcon({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled?: boolean;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 enabled:hover:bg-black/6 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10 text-neutral-800">
      <header className="flex flex-col items-center text-center">
        <Image
          src={profile.photo}
          alt={profile.name}
          width={88}
          height={88}
          className="h-[88px] w-[88px] rounded-full object-cover shadow-md"
        />
        <h1 className="mt-4 text-[26px] font-semibold text-neutral-900">{profile.name}</h1>
        <p className="mt-1 text-[15px] text-neutral-500">{profile.tagline}</p>
        <p className="mt-0.5 text-[13px] text-neutral-400">{profile.location}</p>

        <div className="mt-5 flex gap-2.5">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
          >
            View GitHub
          </a>
          <button
            onClick={() => onNavigate(RESUME)}
            className="rounded-full border border-black/12 px-4 py-2 text-[13px] font-medium text-neutral-800 hover:bg-black/4"
          >
            Résumé
          </button>
          <a
            href={profile.links.email}
            className="rounded-full border border-black/12 px-4 py-2 text-[13px] font-medium text-neutral-800 hover:bg-black/4"
          >
            Contact
          </a>
        </div>
      </header>

      <section className="mt-12">
        {profile.bio.map((p, i) => (
          <p key={i} className="mt-3 text-[14px] leading-relaxed text-neutral-600 first:mt-0">
            {p}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
          Projects
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`https://github.com/${p.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/8 p-4 hover:border-black/20"
            >
              <p className="text-[13.5px] font-semibold text-neutral-900">{p.name}</p>
              <p className="mt-1 text-[12.5px] text-neutral-500">{p.tagline}</p>
              {p.accolade && (
                <p className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                  {p.accolade}
                </p>
              )}
              <p className="mt-2 flex flex-wrap gap-1">
                {p.tech.slice(0, 4).map((t) => (
                  <span key={t} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10.5px] text-neutral-600">
                    {t}
                  </span>
                ))}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
          Experience
        </h2>
        <ul className="mt-3 space-y-3">
          {experience.map((r) => (
            <li key={r.id} className="rounded-lg border border-black/8 p-4">
              <p className="text-[13.5px] font-semibold text-neutral-900">
                {r.title} <span className="font-normal text-neutral-400">· {r.company}</span>
              </p>
              <p className="mt-0.5 text-[12px] text-neutral-500">{r.period}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
          Awards
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {achievements.map((a) => (
            <span
              key={a.id}
              className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-neutral-700"
            >
              🏆 {a.title} — {a.event}
            </span>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-black/8 pt-5 text-center text-[12px] text-neutral-400">
        {profile.email} · Built with Next.js
      </footer>
    </div>
  );
}

function ErrorPage({ query }: { query?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <SafariIcon className="h-14 w-14 opacity-50" />
      <p className="text-[16px] font-semibold text-neutral-800">
        Safari Can’t Find the Server
      </p>
      <p className="max-w-sm text-[13px] text-neutral-500">
        Safari can’t open the page “{query}” because it couldn’t find the server.
      </p>
    </div>
  );
}

export function Safari() {
  const [history, setHistory] = useState<Page[]>([HOME]);
  const [index, setIndex] = useState(0);
  const [addressDraft, setAddressDraft] = useState(HOME.address);

  const current = history[index];

  // Keep the address bar in sync with whatever page is actually showing —
  // including Back/Forward, which change `index` without going through
  // `navigate()`.
  useEffect(() => {
    setAddressDraft(current.address);
  }, [current.address]);

  const navigate = (page: Page) => {
    setHistory((h) => [...h.slice(0, index + 1), page]);
    setIndex((i) => i + 1);
  };

  const go = (raw: string) => {
    const value = raw.trim();
    const key = value.toLowerCase();

    if (HOME_ALIASES.has(key)) {
      navigate(HOME);
      return;
    }
    if (RESUME_ALIASES.has(key)) {
      navigate(RESUME);
      return;
    }
    if (looksLikeUrl(value)) {
      window.open(normalizeExternal(value), "_blank", "noopener");
      setAddressDraft(current.address);
      return;
    }
    navigate({ id: "error", address: value, title: "Can’t open page", query: value });
  };

  const openBookmark = (b: Bookmark) => {
    if (b.kind === "external") {
      window.open(b.target, "_blank", "noopener");
      return;
    }
    navigate(b.target === "resume" ? RESUME : HOME);
  };

  const canBack = index > 0;
  const canForward = index < history.length - 1;

  const favicon = useMemo(() => <SafariIcon className="h-3.5 w-3.5 shrink-0" />, []);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Tab strip */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-black/8 bg-[#e8e8ea] px-3">
        <div className="flex h-7 max-w-[200px] items-center gap-1.5 rounded-md bg-white px-2.5 text-[12px] text-neutral-700 shadow-sm">
          {favicon}
          <span className="truncate">{current.title}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-black/8 px-3">
        <ToolbarIcon label="Back" disabled={!canBack} onClick={() => setIndex((i) => i - 1)}>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon label="Forward" disabled={!canForward} onClick={() => setIndex((i) => i + 1)}>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon label="Reload" onClick={() => go(current.id === "error" ? current.query ?? "" : current.address)}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path
              d="M13.5 8A5.5 5.5 0 112.9 5.5M2.5 2.5v3.4h3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolbarIcon>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(addressDraft);
          }}
          className="flex-1"
        >
          <input
            value={addressDraft}
            onChange={(e) => setAddressDraft(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-md bg-black/6 px-3 py-1.5 text-center text-[12.5px] text-neutral-800 outline-none focus:bg-white focus:text-left focus:ring-1 focus:ring-blue-400"
            placeholder="Search or enter website name"
          />
        </form>

        <span className="w-6" />
      </div>

      {/* Bookmarks bar */}
      <div className="flex h-8 shrink-0 items-center gap-1 overflow-x-auto border-b border-black/8 bg-[#fafafb] px-3">
        {BOOKMARKS.map((b) => (
          <button
            key={b.label}
            onClick={() => openBookmark(b)}
            className="shrink-0 rounded px-2 py-1 text-[11.5px] text-neutral-600 hover:bg-black/5"
          >
            {b.label}
            {b.kind === "external" && <span className="ml-1 text-neutral-400">↗</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mac-scroll min-h-0 flex-1 overflow-auto bg-white">
        {current.id === "home" && <HomePage onNavigate={navigate} />}
        {current.id === "resume" && (
          <iframe src="/resume.pdf" title="Résumé" className="h-full w-full border-0" />
        )}
        {current.id === "error" && <ErrorPage query={current.query} />}
      </div>
    </div>
  );
}
