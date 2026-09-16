"use client";

import { useMemo, useState } from "react";
import { achievements } from "@/data/achievements";
import { experience } from "@/data/experience";
import { archivedProjects, featuredProjects } from "@/data/projects";
import type { WindowInstance } from "@/store/windowStore";

type FolderId = "projects" | "achievements" | "experience" | "archive";

const FOLDERS: { id: FolderId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "experience", label: "Experience" },
  { id: "archive", label: "Archive" },
];

interface Entry {
  id: string;
  name: string;
  meta: string;
  badge?: string;
  bullets: string[];
  tags: string[];
  link?: string;
}

const GRADIENTS = [
  ["#5b8def", "#2f5fd0"],
  ["#f2994a", "#d9663d"],
  ["#56c596", "#2f9e70"],
  ["#a06bf0", "#7042c4"],
  ["#ef6f8f", "#c9455f"],
  ["#4ab3d1", "#2a7fa3"],
];

function initials(name: string) {
  const parts = name.split(/[\s—-]+/).filter(Boolean);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function EntryTile({ entry, index }: { entry: Entry; index: number }) {
  const [from, to] = GRADIENTS[index % GRADIENTS.length];
  return (
    <span
      className="flex h-14 w-14 items-center justify-center rounded-[13px] text-lg font-semibold text-white shadow-sm"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      {initials(entry.name)}
    </span>
  );
}

function useEntries(folder: FolderId): Entry[] {
  return useMemo(() => {
    if (folder === "achievements") {
      return achievements.map((a) => ({
        id: a.id,
        name: a.title,
        meta: `${a.event} · ${a.period}`,
        bullets: [a.detail],
        tags: [a.role],
      }));
    }

    if (folder === "experience") {
      return experience.map((r) => ({
        id: r.id,
        name: r.company,
        meta: `${r.title} · ${r.period}`,
        badge: r.current ? "Current" : undefined,
        bullets: r.highlights,
        tags: r.stack,
      }));
    }

    const list = folder === "archive" ? archivedProjects : featuredProjects;
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      meta: `${p.tagline} · ${p.period}`,
      badge: p.accolade,
      bullets: p.description,
      tags: p.tech,
      link: `https://github.com/${p.repo}`,
    }));
  }, [folder]);
}

export function Finder({ win }: { win: WindowInstance }) {
  const initial = (win.payload?.folderId as FolderId) ?? "projects";
  const [folder, setFolder] = useState<FolderId>(
    FOLDERS.some((f) => f.id === initial) ? initial : "projects",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries = useEntries(folder);
  const selected = entries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex h-full bg-white">
      <aside className="mac-scroll w-[172px] shrink-0 overflow-auto border-r border-black/8 bg-[#f1f1f3]/90 px-2 py-3">
        <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Favourites
        </p>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFolder(f.id);
              setSelectedId(null);
            }}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-[13px] ${
              folder === f.id
                ? "bg-black/10 font-medium text-neutral-900"
                : "text-neutral-700 hover:bg-black/5"
            }`}
          >
            <svg viewBox="0 0 20 16" className="h-4 w-4 shrink-0">
              <path
                d="M1 3a2 2 0 012-2h4.5l2 2H17a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2z"
                fill="#5aa9e6"
              />
            </svg>
            {f.label}
          </button>
        ))}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center justify-between border-b border-black/8 px-4">
          <h2 className="text-[13px] font-semibold text-neutral-800">
            {FOLDERS.find((f) => f.id === folder)?.label}
          </h2>
          <span className="text-[11px] text-neutral-400">
            {entries.length} item{entries.length === 1 ? "" : "s"}
          </span>
        </header>

        <div className="mac-scroll flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3">
            {entries.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => setSelectedId(entry.id)}
                onDoubleClick={() =>
                  entry.link && window.open(entry.link, "_blank", "noopener")
                }
                className={`flex flex-col items-center gap-2 rounded-lg px-2 py-3 text-center ${
                  selectedId === entry.id ? "bg-blue-500/12" : "hover:bg-black/4"
                }`}
              >
                <EntryTile entry={entry} index={i} />
                <span
                  className={`rounded px-1.5 py-px text-[12px] leading-tight ${
                    selectedId === entry.id
                      ? "bg-blue-600 text-white"
                      : "text-neutral-700"
                  }`}
                >
                  {entry.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <aside className="mac-scroll w-[262px] shrink-0 overflow-auto border-l border-black/8 bg-[#fafafb] px-4 py-4">
          <h3 className="text-[15px] font-semibold text-neutral-900">
            {selected.name}
          </h3>
          <p className="mt-0.5 text-[12px] text-neutral-500">{selected.meta}</p>

          {selected.badge && (
            <p className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
              {selected.badge}
            </p>
          )}

          <ul className="mt-3 space-y-2">
            {selected.bullets.map((b, i) => (
              <li key={i} className="text-[12.5px] leading-relaxed text-neutral-700">
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {selected.tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-neutral-200/80 px-2 py-0.5 text-[11px] text-neutral-700"
              >
                {t}
              </span>
            ))}
          </div>

          {selected.link && (
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-3 py-2 text-[12.5px] font-medium text-white hover:bg-neutral-800"
            >
              Open on GitHub
            </a>
          )}
        </aside>
      )}
    </div>
  );
}
