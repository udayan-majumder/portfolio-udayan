"use client";

import { useEffect, useState } from "react";
import type { PlaylistMeta } from "@/app/api/spotify/route";

const NAV = [
  {
    label: "Home",
    path: "M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732z",
  },
  {
    label: "Search",
    path: "M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z",
  },
  {
    label: "Your Library",
    path: "M3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zM15.5 2.134A1 1 0 0117 3v18a1 1 0 01-2 0V3a1 1 0 01.5-.866zM9 2a1 1 0 011 1v18a1 1 0 01-2 0V3a1 1 0 011-1zm12.5.134A1 1 0 0123 3v18a1 1 0 01-2 0V3a1 1 0 01.5-.866z",
  },
];

function SpotifyWordmark() {
  return (
    <div className="flex items-center gap-2 px-5 py-4">
      <svg viewBox="0 0 24 24" className="h-8 w-8">
        <circle cx="12" cy="12" r="12" fill="#1db954" />
        <g fill="none" stroke="#000" strokeWidth="1.9" strokeLinecap="round">
          <path d="M6.2 8.8c3.5-1.4 8-1 11 .8" />
          <path d="M6.9 12.3c2.8-1.1 6.4-.8 8.9.7" />
          <path d="M7.6 15.6c2.2-.8 5-.6 7 .6" />
        </g>
      </svg>
      <span className="text-lg font-bold tracking-tight text-white">Spotify</span>
    </div>
  );
}

function Cover({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
}) {
  if (!src) {
    return <span className={`${className} bg-[#282828]`} />;
  }
  // Spotify's CDN, not a local asset — plain img keeps it out of the
  // image-optimiser and avoids a remote-pattern config for a third-party host.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`${className} object-cover`} />;
}

export function Spotify() {
  const [playlists, setPlaylists] = useState<PlaylistMeta[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/spotify")
      .then((r) => r.json())
      .then((d: { playlists: PlaylistMeta[] }) => {
        setPlaylists(d.playlists);
        setActiveId(d.playlists[0]?.id ?? null);
      })
      .catch(() => setPlaylists([]));
  }, []);

  const active = playlists?.find((p) => p.id === activeId) ?? null;

  return (
    <div className="flex h-full bg-black">
      <aside className="flex w-[232px] shrink-0 flex-col bg-black">
        <SpotifyWordmark />

        <nav className="px-2">
          {NAV.map((item, i) => (
            <span
              key={item.label}
              className={`flex items-center gap-4 rounded-md px-3 py-2.5 text-[14px] font-semibold ${
                i === 2 ? "text-white" : "text-[#b3b3b3]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d={item.path} />
              </svg>
              {item.label}
            </span>
          ))}
        </nav>

        <div className="mx-5 my-3 h-px bg-white/10" />

        <div className="mac-scroll flex-1 overflow-auto px-2 pb-3">
          {playlists === null
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-1.5">
                  <span className="h-11 w-11 shrink-0 animate-pulse rounded bg-[#282828]" />
                  <span className="h-3 w-24 animate-pulse rounded bg-[#282828]" />
                </div>
              ))
            : playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left ${
                    activeId === p.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <Cover
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-11 w-11 shrink-0 rounded"
                  />
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[14px] font-medium ${
                        activeId === p.id ? "text-[#1db954]" : "text-white"
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="block text-[12px] text-[#b3b3b3]">
                      Playlist
                    </span>
                  </span>
                </button>
              ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-gradient-to-b from-[#3a2a4d] via-[#1c1c1c] to-[#121212]">
        <header className="flex shrink-0 items-center gap-3 px-6 pb-3 pt-5">
          <Cover
            src={active?.thumbnail ?? null}
            alt={active?.title ?? ""}
            className="h-14 w-14 shrink-0 rounded shadow-lg"
          />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-[#b3b3b3]">
              Playlist
            </p>
            <h2 className="truncate text-xl font-bold text-white">
              {active?.title ?? "Loading…"}
            </h2>
          </div>
        </header>

        <div className="min-h-0 flex-1 px-4 pb-4">
          {activeId && (
            <iframe
              key={activeId}
              title={`Spotify — ${active?.title ?? "playlist"}`}
              src={`https://open.spotify.com/embed/playlist/${activeId}?utm_source=generator&theme=0`}
              className="h-full w-full rounded-xl"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
        </div>
      </main>
    </div>
  );
}
