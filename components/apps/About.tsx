"use client";

import { useState } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";

const NOTES = ["About Me", "Skills", "Education", "Contact"] as const;
type Note = (typeof NOTES)[number];

const PREVIEW: Record<Note, string> = {
  "About Me": profile.bio[0],
  Skills: Object.keys(profile.skills).join(", "),
  Education: `${profile.education.degree}, ${profile.education.institution}`,
  Contact: profile.email,
};

function NoteBody({ note }: { note: Note }) {
  if (note === "About Me") {
    return (
      <>
        <div className="mt-4 flex items-center gap-4">
          <Image
            src={profile.photo}
            alt={profile.name}
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover shadow-sm"
          />
          <div>
            <p className="text-[15px] font-semibold text-neutral-900">
              {profile.name}
            </p>
            <p className="text-[13px] text-neutral-500">{profile.title}</p>
            <p className="text-[12px] text-neutral-400">{profile.location}</p>
          </div>
        </div>

        {profile.bio.map((p, i) => (
          <p key={i} className="mt-3 text-[14px] leading-relaxed text-neutral-700">
            {p}
          </p>
        ))}
      </>
    );
  }

  if (note === "Skills") {
    return (
      <div className="mt-3 space-y-4">
        {Object.entries(profile.skills).map(([group, items]) => (
          <div key={group}>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
              {group}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-neutral-100 px-2.5 py-1 text-[12.5px] text-neutral-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (note === "Education") {
    const e = profile.education;
    return (
      <div className="mt-3">
        <p className="text-[15px] font-medium text-neutral-800">{e.degree}</p>
        <p className="mt-1 text-[13.5px] text-neutral-600">{e.institution}</p>
        <p className="mt-0.5 text-[13px] text-neutral-500">
          Graduating {e.graduation} · {e.location}
        </p>
      </div>
    );
  }

  return (
    <dl className="mt-3 space-y-2.5 text-[13.5px]">
      {[
        ["Email", profile.email, profile.links.email],
        ["GitHub", "github.com/udayan-majumder", profile.links.github],
        ["LinkedIn", "Udayan Majumder", profile.links.linkedin],
        ["Location", profile.location],
      ].map(([label, value, href]) => (
        <div key={label} className="flex gap-3">
          <dt className="w-20 shrink-0 text-neutral-400">{label}</dt>
          <dd className="text-neutral-700">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function About() {
  const [note, setNote] = useState<Note>("About Me");

  return (
    <div className="flex h-full bg-white">
      <aside className="mac-scroll w-[228px] shrink-0 overflow-auto border-r border-black/8 bg-[#fbf9f1]">
        <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Notes
        </p>
        {NOTES.map((n) => (
          <button
            key={n}
            onClick={() => setNote(n)}
            className={`w-full border-b border-black/5 px-4 py-2.5 text-left ${
              note === n ? "bg-[#f7d14b]/45" : "hover:bg-black/4"
            }`}
          >
            <p className="truncate text-[13px] font-semibold text-neutral-800">
              {n}
            </p>
            <p className="mt-0.5 truncate text-[11.5px] text-neutral-500">
              {PREVIEW[n]}
            </p>
          </button>
        ))}
      </aside>

      <section className="mac-scroll flex-1 overflow-auto px-8 py-6">
        <p className="text-center text-[11.5px] text-neutral-400">
          {profile.name} · {profile.title}
        </p>
        <h2 className="mt-4 text-[20px] font-semibold text-neutral-900">{note}</h2>
        <NoteBody note={note} />
      </section>
    </div>
  );
}
