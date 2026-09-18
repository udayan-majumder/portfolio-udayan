"use client";

import { useState } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { wallpapers } from "@/data/wallpapers";
import { apps, dockOrder } from "@/lib/apps";
import { useWindowStore } from "@/store/windowStore";

const PANES = [
  { id: "wallpaper", label: "Wallpaper", swatch: "bg-gradient-to-br from-sky-400 to-blue-600" },
  { id: "about", label: "About", swatch: "bg-gradient-to-br from-neutral-400 to-neutral-600" },
  { id: "apps", label: "Dock & Apps", swatch: "bg-gradient-to-br from-violet-400 to-purple-600" },
] as const;

type PaneId = (typeof PANES)[number]["id"];

function SidebarIcon({ swatch }: { swatch: string }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] ${swatch} text-[11px] font-bold text-white shadow-sm`}
    />
  );
}

function WallpaperPane() {
  const wallpaperId = useWindowStore((s) => s.wallpaperId);
  const setWallpaper = useWindowStore((s) => s.setWallpaper);

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-neutral-900">Wallpaper</h2>
      <p className="mt-1 text-[13px] text-neutral-500">
        Choose a desktop picture. Changes apply immediately.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {wallpapers.map((w) => {
          const active = w.id === wallpaperId;
          return (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`relative block aspect-video w-full overflow-hidden rounded-lg ring-2 ring-offset-2 ${
                  active ? "ring-blue-500" : "ring-transparent"
                }`}
              >
                {w.src ? (
                  <Image src={w.src} alt={w.name} fill className="object-cover" />
                ) : (
                  <span
                    className="absolute inset-0"
                    style={{ background: w.gradient }}
                  />
                )}
                {active && (
                  <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path
                        d="M2.5 6.2l2.2 2.2L9.5 3.6"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </span>
              <span className="text-[12.5px] text-neutral-700">{w.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AboutPane() {
  const openApp = useWindowStore((s) => s.openApp);

  const rows: [string, string][] = [
    ["Name", profile.name],
    ["Role", `${profile.title} · ${profile.tagline}`],
    ["Location", profile.location],
    [
      "Education",
      `${profile.education.degree}, ${profile.education.institution} (${profile.education.graduation})`,
    ],
    ["System", "portfolioOS 1.0 (Next.js 16.3.5 · React 19.2.8)"],
  ];

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-neutral-900">About</h2>

      <div className="mt-5 flex items-center gap-4">
        <Image
          src={profile.photo}
          alt={profile.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover shadow-sm"
        />
        <div>
          <p className="text-[16px] font-semibold text-neutral-900">{profile.name}</p>
          <p className="text-[13px] text-neutral-500">{profile.title}</p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-black/6 rounded-lg border border-black/8 bg-[#fafafb]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-4 px-4 py-2.5 text-[13px]">
            <dt className="w-28 shrink-0 text-neutral-400">{label}</dt>
            <dd className="text-neutral-800">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => openApp("resume")}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-neutral-800"
        >
          Open Résumé
        </button>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-black/10 px-3 py-1.5 text-[12.5px] font-medium text-neutral-800 hover:bg-black/4"
        >
          View GitHub
        </a>
        <a
          href={profile.links.email}
          className="rounded-md border border-black/10 px-3 py-1.5 text-[12.5px] font-medium text-neutral-800 hover:bg-black/4"
        >
          Email Me
        </a>
      </div>
    </div>
  );
}

function AppsPane() {
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-neutral-900">Dock & Apps</h2>
      <p className="mt-1 text-[13px] text-neutral-500">
        Every app currently pinned to the Dock. Click one to launch it.
      </p>

      <div className="mt-5 divide-y divide-black/6 rounded-lg border border-black/8 bg-[#fafafb]">
        {dockOrder.map((id) => {
          const app = apps[id];
          const Icon = app.icon;
          return (
            <button
              key={id}
              onClick={() => openApp(id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-black/4"
            >
              <Icon className="h-7 w-7 shrink-0" />
              <span className="flex-1 text-[13px] text-neutral-800">{app.name}</span>
              <span className="text-[11.5px] text-neutral-400">In Dock</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Settings() {
  const [pane, setPane] = useState<PaneId>("wallpaper");

  return (
    <div className="flex h-full bg-white">
      <aside className="mac-scroll w-[196px] shrink-0 overflow-auto border-r border-black/8 bg-[#f1f1f3]/90 px-2 py-3">
        {PANES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPane(p.id)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] ${
              pane === p.id
                ? "bg-blue-500 font-medium text-white"
                : "text-neutral-700 hover:bg-black/5"
            }`}
          >
            <SidebarIcon swatch={p.swatch} />
            {p.label}
          </button>
        ))}
      </aside>

      <section className="mac-scroll flex-1 overflow-auto px-8 py-6">
        {pane === "wallpaper" && <WallpaperPane />}
        {pane === "about" && <AboutPane />}
        {pane === "apps" && <AppsPane />}
      </section>
    </div>
  );
}
