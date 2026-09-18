"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";

/* ---------------------------------------------------------------------- */
/* A tiny pretty-printer that turns the site's own data files into        */
/* colour-tokenised "source code" lines — VS Code Dark+ palette.          */
/* ---------------------------------------------------------------------- */

const COLOR = {
  key: "#9cdcfe",
  str: "#ce9178",
  num: "#b5cea8",
  bool: "#569cd6",
  punc: "#858585",
  kw: "#569cd6",
  type: "#4ec9b0",
  cmt: "#6a9955",
  fn: "#dcdcaa",
  var: "#4fc1ff",
} as const;

type ColorKey = keyof typeof COLOR;
interface Tok {
  t: string;
  c?: ColorKey;
}
type Line = Tok[];

function isIdent(s: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);
}

function quote(s: string) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function isPrimitive(v: unknown) {
  return v === null || typeof v !== "object";
}

function renderInline(value: unknown): Tok[] {
  if (typeof value === "string") return [{ t: quote(value), c: "str" }];
  if (typeof value === "number") return [{ t: String(value), c: "num" }];
  if (typeof value === "boolean") return [{ t: String(value), c: "bool" }];
  return [{ t: String(value) }];
}

function renderValue(value: unknown, indent: number, jsonKeys = false): Line[] {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return [[{ t: "[]", c: "punc" }]];
    const lines: Line[] = [[{ t: "[", c: "punc" }]];
    value.forEach((item, i) => {
      const isLast = i === value.length - 1;
      if (isPrimitive(item)) {
        lines.push([
          { t: padIn },
          ...renderInline(item),
          { t: isLast ? "" : ",", c: "punc" },
        ]);
      } else {
        const sub = renderValue(item, indent + 1, jsonKeys);
        sub.forEach((l, li) => {
          lines.push(li === 0 ? [{ t: padIn }, ...l] : l);
        });
        lines[lines.length - 1].push({ t: isLast ? "" : ",", c: "punc" });
      }
    });
    lines.push([{ t: pad }, { t: "]", c: "punc" }]);
    return lines;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [[{ t: "{}", c: "punc" }]];
    const lines: Line[] = [[{ t: "{", c: "punc" }]];
    entries.forEach(([k, v], i) => {
      const isLast = i === entries.length - 1;
      const keyTok: Tok = {
        t: jsonKeys || !isIdent(k) ? quote(k) : k,
        c: "key",
      };
      if (isPrimitive(v)) {
        lines.push([
          { t: padIn },
          keyTok,
          { t: ": ", c: "punc" },
          ...renderInline(v),
          { t: isLast ? "" : ",", c: "punc" },
        ]);
      } else {
        const sub = renderValue(v, indent + 1, jsonKeys);
        sub.forEach((l, li) => {
          lines.push(
            li === 0 ? [{ t: padIn }, keyTok, { t: ": ", c: "punc" }, ...l] : l,
          );
        });
        lines[lines.length - 1].push({ t: isLast ? "" : ",", c: "punc" });
      }
    });
    lines.push([{ t: pad }, { t: "}", c: "punc" }]);
    return lines;
  }

  return [renderInline(value)];
}

function buildFile(
  exportName: string,
  typeAnnotation: Tok[] | null,
  value: unknown,
  suffix?: Tok[],
): Line[] {
  const body = renderValue(value, 0);
  const first: Line = [
    { t: "export ", c: "kw" },
    { t: "const ", c: "kw" },
    { t: exportName, c: "var" },
    ...(typeAnnotation ? [{ t: ": ", c: "punc" } as Tok, ...typeAnnotation] : []),
    { t: " = ", c: "punc" },
    ...body[0],
  ];
  const rest = body.slice(1);
  const last = rest.length ? rest[rest.length - 1] : first;
  if (suffix) last.push(...suffix);
  last.push({ t: ";", c: "punc" });
  return [first, ...rest];
}

function raw(...parts: [string, ColorKey?][]): Line {
  return parts.map(([t, c]) => ({ t, c }));
}

interface FieldSpec {
  name: string;
  optional?: boolean;
  type: Tok[];
}

function tsType(s: string): Tok[] {
  return [{ t: s, c: "type" }];
}

function unionType(options: string[]): Tok[] {
  const toks: Tok[] = [];
  options.forEach((o, i) => {
    if (i > 0) toks.push({ t: " | ", c: "punc" });
    toks.push({ t: quote(o), c: "str" });
  });
  return toks;
}

function interfaceLines(name: string, fields: FieldSpec[]): Line[] {
  return [
    [
      { t: "export ", c: "kw" },
      { t: "interface ", c: "kw" },
      { t: name, c: "type" },
      { t: " {", c: "punc" },
    ],
    ...fields.map<Line>((f) => [
      { t: "  " },
      { t: f.name, c: "key" },
      { t: f.optional ? "?" : "" },
      { t: ": ", c: "punc" },
      ...f.type,
      { t: ";", c: "punc" },
    ]),
    [{ t: "}", c: "punc" }],
    [],
  ];
}

/* ---------------------------------------------------------------------- */
/* Files                                                                  */
/* ---------------------------------------------------------------------- */

type FileId =
  | "readme"
  | "package"
  | "profile"
  | "projects"
  | "experience"
  | "achievements";

interface FileMeta {
  id: FileId;
  name: string;
  dir?: string;
  lang: "markdown" | "json" | "typescript";
}

const FILES: FileMeta[] = [
  { id: "profile", name: "profile.ts", dir: "data", lang: "typescript" },
  { id: "projects", name: "projects.ts", dir: "data", lang: "typescript" },
  { id: "experience", name: "experience.ts", dir: "data", lang: "typescript" },
  { id: "achievements", name: "achievements.ts", dir: "data", lang: "typescript" },
  { id: "readme", name: "README.md", lang: "markdown" },
  { id: "package", name: "package.json", lang: "json" },
];

const FILE_MAP: Record<FileId, FileMeta> = Object.fromEntries(
  FILES.map((f) => [f.id, f]),
) as Record<FileId, FileMeta>;

const README_MD = `# ${profile.name}

${profile.tagline}

📍 ${profile.location} · 🎓 ${profile.education.degree}, ${profile.education.institution}

${profile.bio.map((p) => p).join("\n\n")}

## 🚀 Projects

${projects
  .map(
    (p) =>
      `- **[${p.name}](https://github.com/${p.repo})** — ${p.tagline}${
        p.accolade ? ` · _${p.accolade}_` : ""
      }`,
  )
  .join("\n")}

## 💼 Experience

${experience
  .map((r) => `- **${r.title}**, ${r.company} — ${r.period}`)
  .join("\n")}

## 🏆 Achievements

${achievements.map((a) => `- **${a.title}** — ${a.event}`).join("\n")}

## 🧰 Stack

${Object.entries(profile.skills)
  .map(([group, items]) => `**${group}:** ${items.join(", ")}  `)
  .join("\n")}

## 📫 Reach me

[${profile.email}](${profile.links.email}) · [GitHub](${profile.links.github}) · [LinkedIn](${profile.links.linkedin})
`;

const PACKAGE_JSON_VALUE = {
  name: "portfolio",
  version: "0.1.0",
  private: true,
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "eslint",
  },
  dependencies: {
    motion: "^13.3.0",
    next: "16.3.5",
    react: "19.2.8",
    "react-dom": "19.2.8",
    "react-markdown": "^10.1.0",
    zustand: "^5.0.15",
  },
};

const FIELD_STRING: Tok[] = tsType("string");
const FIELD_STRING_ARR: Tok[] = tsType("string[]");
const FIELD_BOOL: Tok[] = tsType("boolean");

const FILE_LINES: Partial<Record<FileId, Line[]>> = {
  package: renderValue(PACKAGE_JSON_VALUE, 0, true),

  profile: buildFile("profile", null, profile, [{ t: " as const", c: "kw" }]),

  achievements: [
    ...interfaceLines("Achievement", [
      { name: "id", type: FIELD_STRING },
      { name: "title", type: FIELD_STRING },
      { name: "event", type: FIELD_STRING },
      { name: "period", type: FIELD_STRING },
      { name: "role", type: FIELD_STRING },
      { name: "detail", type: FIELD_STRING },
      { name: "projectId", optional: true, type: FIELD_STRING },
    ]),
    ...buildFile(
      "achievements",
      [{ t: "Achievement", c: "type" }, { t: "[]", c: "punc" }],
      achievements,
    ),
  ],

  experience: [
    ...interfaceLines("Role", [
      { name: "id", type: FIELD_STRING },
      { name: "title", type: FIELD_STRING },
      { name: "company", type: FIELD_STRING },
      {
        name: "type",
        type: unionType(["Full-time", "Internship", "Freelance"]),
      },
      { name: "location", type: FIELD_STRING },
      { name: "period", type: FIELD_STRING },
      { name: "current", type: FIELD_BOOL },
      { name: "stack", type: FIELD_STRING_ARR },
      { name: "highlights", type: FIELD_STRING_ARR },
    ]),
    ...buildFile(
      "experience",
      [{ t: "Role", c: "type" }, { t: "[]", c: "punc" }],
      experience,
    ),
  ],

  projects: [
    ...interfaceLines("Project", [
      { name: "id", type: FIELD_STRING },
      { name: "name", type: FIELD_STRING },
      { name: "tagline", type: FIELD_STRING },
      { name: "period", type: FIELD_STRING },
      { name: "accolade", optional: true, type: FIELD_STRING },
      { name: "description", type: FIELD_STRING_ARR },
      { name: "tech", type: FIELD_STRING_ARR },
      { name: "repo", type: FIELD_STRING },
      { name: "live", optional: true, type: FIELD_STRING },
      { name: "archived", optional: true, type: FIELD_BOOL },
    ]),
    ...buildFile(
      "projects",
      [{ t: "Project", c: "type" }, { t: "[]", c: "punc" }],
      projects,
    ),
    [],
    raw(
      ["export ", "kw"],
      ["const ", "kw"],
      ["featuredProjects", "var"],
      [" = ", "punc"],
      ["projects", "var"],
      [".", "punc"],
      ["filter", "fn"],
      ["((p) => !p.archived)", "punc"],
      [";", "punc"],
    ),
    raw(
      ["export ", "kw"],
      ["const ", "kw"],
      ["archivedProjects", "var"],
      [" = ", "punc"],
      ["projects", "var"],
      [".", "punc"],
      ["filter", "fn"],
      ["((p) => p.archived)", "punc"],
      [";", "punc"],
    ),
  ],
};

/* ---------------------------------------------------------------------- */
/* Icons                                                                  */
/* ---------------------------------------------------------------------- */

function FileTypeIcon({ lang }: { lang: FileMeta["lang"] }) {
  if (lang === "typescript") {
    return (
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-[#3178c6] text-[8px] font-bold text-white">
        TS
      </span>
    );
  }
  if (lang === "json") {
    return (
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[10px] font-bold text-[#cbcb41]">
        {"{}"}
      </span>
    );
  }
  return (
    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[9px] font-bold text-[#519aba]">
      M↓
    </span>
  );
}

function FolderChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 text-[#c5c5c5] transition-transform ${open ? "rotate-90" : ""}`}
      fill="currentColor"
    >
      <path d="M4 2l4 4-4 4z" />
    </svg>
  );
}

function ActivityIcon({
  active,
  label,
  children,
}: {
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`relative flex h-11 w-11 items-center justify-center ${
        active ? "text-white" : "text-[#858585] hover:text-[#d7d7d7]"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-white" />
      )}
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Editor                                                                 */
/* ---------------------------------------------------------------------- */

function CodeView({ lines }: { lines: Line[] }) {
  return (
    <div className="flex font-mono text-[12.5px] leading-[19px]">
      <div className="select-none px-3 pt-3 text-right text-[#6e7681]">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="min-w-0 flex-1 whitespace-pre pt-3 pr-6 text-[#d4d4d4]">
        {lines.map((line, i) => (
          <div key={i}>
            {line.length === 0 ? (
              " "
            ) : (
              line.map((tok, ti) => (
                <span key={ti} style={tok.c ? { color: COLOR[tok.c] } : undefined}>
                  {tok.t}
                </span>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarkdownPreview() {
  return (
    <div className="gh-md mx-auto max-w-3xl px-8 py-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{README_MD}</ReactMarkdown>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* App                                                                    */
/* ---------------------------------------------------------------------- */

export function VSCode() {
  const [openIds, setOpenIds] = useState<FileId[]>(["readme"]);
  const [activeId, setActiveId] = useState<FileId | null>("readme");
  const [dataOpen, setDataOpen] = useState(true);

  const openFile = (id: FileId) => {
    setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setActiveId(id);
  };

  const closeTab = (id: FileId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenIds((ids) => {
      const idx = ids.indexOf(id);
      const next = ids.filter((x) => x !== id);
      if (activeId === id) {
        setActiveId(next[idx] ?? next[idx - 1] ?? next[0] ?? null);
      }
      return next;
    });
  };

  const active = activeId ? FILE_MAP[activeId] : null;

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] text-[13px]">
      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <div className="flex w-11 shrink-0 flex-col items-center justify-between bg-[#333333] py-1.5">
          <div className="flex flex-col">
            <ActivityIcon active label="Explorer">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M3 4h7l2 2h9v3H3zM3 10h18v10H3z" opacity="0.9" />
              </svg>
            </ActivityIcon>
            <ActivityIcon label="Search">
              <svg
                viewBox="0 0 18 18"
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="7.5" cy="7.5" r="5.5" />
                <path d="M11.8 11.8L16 16" />
              </svg>
            </ActivityIcon>
            <ActivityIcon label="Source Control">
              <svg viewBox="0 0 16 16" className="h-[17px] w-[17px]" fill="currentColor">
                <path d="M5 5.4v5.2a2.2 2.2 0 111.5 0V8.6a2.2 2.2 0 002.2 2.2h1.3v-.8A2.2 2.2 0 1112 12v-.2H8.7A3.7 3.7 0 015 8.1V5.4a2.2 2.2 0 111.5 0zM4.2 3a.8.8 0 100 1.6.8.8 0 000-1.6zm7.8 8.4a.8.8 0 100 1.6.8.8 0 000-1.6z" />
              </svg>
            </ActivityIcon>
            <ActivityIcon label="Extensions">
              <svg viewBox="0 0 16 16" className="h-[17px] w-[17px]" fill="currentColor">
                <path d="M9 2a1.5 1.5 0 00-1.5 1.5V5H5a1 1 0 00-1 1v2.5H2.5a1.5 1.5 0 000 3H4V14a1 1 0 001 1h2.5v-1.5a1.5 1.5 0 013 0V15H13a1 1 0 001-1v-2.5h1.5a1.5 1.5 0 000-3H14V6a1 1 0 00-1-1h-2.5V3.5A1.5 1.5 0 009 2z" />
              </svg>
            </ActivityIcon>
          </div>
          <div className="flex flex-col">
            <ActivityIcon label="Account">
              <svg viewBox="0 0 16 16" className="h-[17px] w-[17px]" fill="currentColor">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1.5c-3 0-6 1.5-6 4V15h12v-1.5c0-2.5-3-4-6-4z" />
              </svg>
            </ActivityIcon>
            <ActivityIcon label="Settings">
              <svg viewBox="0 0 16 16" className="h-[17px] w-[17px]" fill="currentColor">
                <path d="M9.1 1.6c-.1-.4-.5-.6-.9-.6h-.4c-.4 0-.8.2-.9.6l-.3 1a5.6 5.6 0 00-1.2.7l-1-.4c-.4-.1-.8 0-1 .4l-.4.7c-.2.4-.1.8.2 1.1l.8.7c-.1.4-.1.8 0 1.2l-.8.7c-.3.3-.4.7-.2 1.1l.4.7c.2.4.6.5 1 .4l1-.4c.4.3.8.5 1.2.7l.3 1c.1.4.5.6.9.6h.4c.4 0 .8-.2.9-.6l.3-1c.4-.2.9-.4 1.2-.7l1 .4c.4.1.8 0 1-.4l.4-.7c.2-.4.1-.8-.2-1.1l-.8-.7c.1-.4.1-.8 0-1.2l.8-.7c.3-.3.4-.7.2-1.1l-.4-.7c-.2-.4-.6-.5-1-.4l-1 .4c-.4-.3-.8-.5-1.2-.7zM8 10.5A2.5 2.5 0 118 5.5a2.5 2.5 0 010 5z" />
              </svg>
            </ActivityIcon>
          </div>
        </div>

        {/* Explorer */}
        <div className="mac-scroll w-[230px] shrink-0 overflow-y-auto border-r border-black/40 bg-[#252526] pt-2">
          <p className="px-4 pb-1 text-[11px] font-semibold tracking-wide text-[#bbbbbb]">
            EXPLORER
          </p>
          <p className="flex items-center gap-1 px-3 pb-1 pt-1 text-[11px] font-bold text-[#cccccc]">
            <FolderChevron open /> PORTFOLIO-UDAYAN
          </p>

          <div className="pl-3">
            <button
              onClick={() => setDataOpen((v) => !v)}
              className="flex w-full items-center gap-1.5 rounded-[3px] px-2 py-[3px] text-left text-[#cccccc] hover:bg-white/[0.06]"
            >
              <FolderChevron open={dataOpen} />
              <svg viewBox="0 0 16 12" className="h-3.5 w-3.5 shrink-0">
                <path
                  d="M1 2a1 1 0 011-1h3.5l1.3 1.3H14a1 1 0 011 1V10a1 1 0 01-1 1H2a1 1 0 01-1-1z"
                  fill="#c09553"
                />
              </svg>
              data
            </button>

            {dataOpen && (
              <div className="pl-4">
                {FILES.filter((f) => f.dir === "data").map((f) => (
                  <button
                    key={f.id}
                    onClick={() => openFile(f.id)}
                    className={`flex w-full items-center gap-2 rounded-[3px] px-2 py-[3px] text-left ${
                      activeId === f.id
                        ? "bg-[#37373d] text-white"
                        : "text-[#cccccc] hover:bg-white/[0.06]"
                    }`}
                  >
                    <FileTypeIcon lang={f.lang} />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}

            {FILES.filter((f) => !f.dir).map((f) => (
              <button
                key={f.id}
                onClick={() => openFile(f.id)}
                className={`flex w-full items-center gap-2 rounded-[3px] px-2 py-[3px] text-left ${
                  activeId === f.id
                    ? "bg-[#37373d] text-white"
                    : "text-[#cccccc] hover:bg-white/[0.06]"
                }`}
              >
                <FileTypeIcon lang={f.lang} />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex min-w-0 flex-1 flex-col">
          {openIds.length > 0 && (
            <div className="mac-scroll flex shrink-0 overflow-x-auto bg-[#252526]">
              {openIds.map((id) => {
                const f = FILE_MAP[id];
                const isActive = id === activeId;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveId(id)}
                    className={`group flex shrink-0 items-center gap-2 border-r border-black/40 px-3 py-2 text-[12.5px] ${
                      isActive
                        ? "bg-[#1e1e1e] text-white"
                        : "text-[#969696] hover:bg-white/[0.04]"
                    }`}
                  >
                    <FileTypeIcon lang={f.lang} />
                    <span className="whitespace-nowrap">{f.name}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => closeTab(id, e)}
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded hover:bg-white/15"
                    >
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                        <path
                          d="M2 2l6 6M8 2l-6 6"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {active && (
            <div className="flex shrink-0 items-center gap-1 border-b border-black/40 bg-[#1e1e1e] px-3 py-1.5 text-[11.5px] text-[#a0a0a0]">
              {active.dir && (
                <>
                  <span>{active.dir}</span>
                  <span className="text-[#5a5a5a]">›</span>
                </>
              )}
              <span>{active.name}</span>
            </div>
          )}

          <div className="mac-scroll min-h-0 flex-1 overflow-auto">
            {!active ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-[#5a5a5a]">
                <svg viewBox="0 0 100 100" className="h-16 w-16 opacity-40" fill="currentColor">
                  <path d="M48 2.6v58.8a2.6 2.6 0 01-3.7 2.35L31 57.3V6.7L44.3.25A2.6 2.6 0 0148 2.6z" />
                </svg>
                <p className="text-[13px]">No editor open</p>
              </div>
            ) : active.id === "readme" ? (
              <MarkdownPreview />
            ) : (
              <CodeView lines={FILE_LINES[active.id] ?? []} />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-[22px] shrink-0 items-center justify-between bg-[#007acc] px-2.5 text-[11.5px] text-white">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
              <path d="M5 5.4v5.2a2.2 2.2 0 111.5 0V8.6a2.2 2.2 0 002.2 2.2h1.3v-.8A2.2 2.2 0 1112 12v-.2H8.7A3.7 3.7 0 015 8.1V5.4a2.2 2.2 0 111.5 0zM4.2 3a.8.8 0 100 1.6.8.8 0 000-1.6zm7.8 8.4a.8.8 0 100 1.6.8.8 0 000-1.6z" />
            </svg>
            main
          </span>
          <span>0 △ 0 ⊗</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>
            {active?.lang === "markdown"
              ? "Markdown"
              : active?.lang === "json"
                ? "JSON"
                : active?.lang === "typescript"
                  ? "TypeScript"
                  : "Plain Text"}
          </span>
          <span>Prettier</span>
        </div>
      </div>
    </div>
  );
}
