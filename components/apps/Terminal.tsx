"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";

const PROMPT = "udayan@macbook ~ %";

const FILES: Record<string, readonly string[]> = {
  "about.txt": profile.bio,
  "contact.txt": [
    `email     ${profile.email}`,
    `github    ${profile.links.github}`,
    `linkedin  ${profile.links.linkedin}`,
    `location  ${profile.location}`,
  ],
};

const HELP = [
  "Available commands:",
  "",
  "  about          who I am",
  "  projects       what I have built",
  "  experience     where I have worked",
  "  achievements   hackathons and awards",
  "  skills         the stack I work in",
  "  contact        how to reach me",
  "  ls             list files",
  "  cat <file>     print a file",
  "  neofetch       system info",
  "  date           current date and time",
  "  clear          clear the screen",
  "",
  "Tip: arrow up and down walk through history.",
];

const NEOFETCH = [
  "                    'c.          udayan@macbook",
  "                 ,xNMM.          ---------------",
  "               .OMMMMo           OS: portfolioOS 1.0",
  "               lMM\"              Host: MacBook Pro (Web)",
  "     .;loddo:.  .olloddol;.      Kernel: React 19 / Next.js 16",
  "   cKMMMMMMMMMMNWMMMMMMMMMM0:    Shell: zsh",
  " .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Role: Full Stack Developer",
  " XMMMMMMMMMMMMMMMMMMMMMMMX.      Company: Sequoia Print",
  ";MMMMMMMMMMMMMMMMMMMMMMMM:       Education: B.Tech CSE '26",
  ":MMMMMMMMMMMMMMMMMMMMMMMM:       Languages: JS, TS, Python",
  ".MMMMMMMMMMMMMMMMMMMMMMMMX.      Databases: PostgreSQL, MongoDB",
  " kMMMMMMMMMMMMMMMMMMMMMMMMWd.    Cloud: AWS EC2, RDS, Docker",
  " 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk   Memory: 16GB of coffee",
  "  'XMMMMMMMMMMMMMMMMMMMMMMMMK.   Uptime: since 2022",
  "    kMMMMMMMMMMMMMMMMMMMMMMd",
  "     ;KMMMMMMMWXXWMMMMMMMk.",
  "       \"cooc*\"    \"*coo'\"",
];

function run(raw: string): readonly string[] | "CLEAR" {
  const input = raw.trim();
  if (!input) return [];

  const [cmd, ...args] = input.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "help":
      return HELP;

    case "clear":
      return "CLEAR";

    case "whoami":
      return [profile.name.toLowerCase().replace(" ", "")];

    case "about":
      return profile.bio;

    case "ls":
      return [Object.keys(FILES).join("   ") + "   projects/   resume.pdf"];

    case "cat": {
      const file = args[0];
      if (!file) return ["cat: missing file operand"];
      if (FILES[file]) return FILES[file];
      return [`cat: ${file}: No such file or directory`];
    }

    case "projects":
      return projects.flatMap((p) => [
        `${p.name}  —  ${p.tagline}`,
        `  ${p.period}${p.accolade ? `  ·  ${p.accolade}` : ""}`,
        `  ${p.tech.slice(0, 5).join(", ")}`,
        `  github.com/${p.repo}`,
        "",
      ]);

    case "experience":
      return experience.flatMap((r) => [
        `${r.title} — ${r.company}`,
        `  ${r.period}  ·  ${r.location}  ·  ${r.type}`,
        "",
      ]);

    case "achievements":
      return achievements.flatMap((a) => [
        `${a.title} — ${a.event}`,
        `  ${a.detail}`,
        "",
      ]);

    case "skills":
      return Object.entries(profile.skills).flatMap(([group, items]) => [
        `${group}:`,
        `  ${items.join(", ")}`,
        "",
      ]);

    case "contact":
      return FILES["contact.txt"];

    case "github":
      window.open(profile.links.github, "_blank", "noopener");
      return ["Opening GitHub…"];

    case "linkedin":
      window.open(profile.links.linkedin, "_blank", "noopener");
      return ["Opening LinkedIn…"];

    case "neofetch":
      return NEOFETCH;

    case "date":
      return [new Date().toString()];

    case "echo":
      return [args.join(" ")];

    case "sudo":
      if (args.join(" ") === "hire-me") {
        return [
          "Permission granted.",
          "",
          `  ${profile.email}`,
          `  ${profile.links.linkedin}`,
          "",
          "Looking forward to it.",
        ];
      }
      return [`sudo: ${args[0] ?? ""}: command not found`];

    default:
      return [`zsh: command not found: ${cmd}`, "Type 'help' to see what works."];
  }
}

interface Line {
  kind: "input" | "output";
  text: string;
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "output", text: `Last login: ${new Date().toDateString()}` },
    { kind: "output", text: "" },
    { kind: "output", text: "Welcome. Type 'help' to get started." },
    { kind: "output", text: "" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const submit = () => {
    const result = run(value);
    const echoed: Line = { kind: "input", text: value };

    if (result === "CLEAR") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        echoed,
        ...result.map((text) => ({ kind: "output" as const, text })),
        { kind: "output" as const, text: "" },
      ]);
    }

    if (value.trim()) setHistory((h) => [value, ...h]);
    setHistoryIdx(-1);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      if (next >= 0) {
        setHistoryIdx(next);
        setValue(history[next]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      setHistoryIdx(next);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="mac-scroll h-full overflow-auto bg-[#1e1e20] px-4 py-3 font-mono text-[12.5px] leading-[1.55] text-[#e6e6e6] selection:bg-white/25"
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {line.kind === "input" ? (
            <>
              <span className="text-[#4ec9b0]">{PROMPT}</span>{" "}
              <span>{line.text}</span>
            </>
          ) : (
            line.text
          )}
        </div>
      ))}

      <div className="flex items-center">
        <span className="shrink-0 text-[#4ec9b0]">{PROMPT}</span>
        <input
          ref={inputRef}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="ml-2 flex-1 bg-transparent font-mono text-[12.5px] text-[#e6e6e6] caret-[#e6e6e6] outline-none"
        />
      </div>

      <div ref={endRef} />
    </div>
  );
}
