"use client";

import { useEffect, useState } from "react";
import { AppleLogo } from "@/components/icons/AppIcons";
import { apps } from "@/lib/apps";
import { useWindowStore } from "@/store/windowStore";

function formatClock(d: Date) {
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${weekday} ${d.getDate()} ${month} ${time}`;
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  // Rendered empty on the server so the clock can't cause a hydration mismatch.
  return <span className="tabular-nums">{now ? formatClock(now) : ""}</span>;
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 24 18" className="h-3.5 w-[18px]" fill="currentColor">
      <path d="M12 16.2l3-3.6a4.6 4.6 0 00-6 0zM12 8.6c1.9 0 3.7.7 5 1.9l1.9-2.3A11 11 0 0012 5.4c-2.6 0-5 .9-6.9 2.8L7 10.5a7.4 7.4 0 015-1.9zM12 1.8c-3.6 0-6.9 1.3-9.4 3.6l1.9 2.2A11.6 11.6 0 0112 4.8c2.9 0 5.5 1 7.5 2.8l1.9-2.2A14 14 0 0012 1.8z" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 30 14" className="h-3.5 w-[22px]">
      <rect
        x="0.75"
        y="0.75"
        width="24"
        height="12.5"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <rect x="2.6" y="2.6" width="18" height="8.8" rx="2" fill="currentColor" />
      <path
        d="M27 5c1.4.6 1.4 3.4 0 4z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function ControlCentreGlyph() {
  return (
    <svg viewBox="0 0 20 16" className="h-3.5 w-[18px]" fill="currentColor">
      <rect x="0" y="1" width="9" height="14" rx="4.5" opacity="0.55" />
      <circle cx="4.5" cy="5" r="3" />
      <rect x="11" y="1" width="9" height="14" rx="4.5" opacity="0.55" />
      <circle cx="15.5" cy="11" r="3" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="7.5" cy="7.5" r="5.5" />
      <path d="M11.8 11.8L16 16" />
    </svg>
  );
}

export function MenuBar() {
  const focusedId = useWindowStore((s) => s.focusedId);
  const windows = useWindowStore((s) => s.windows);

  const focused = windows.find((w) => w.id === focusedId);
  const activeApp = focused ? apps[focused.appId] : null;
  const appName = activeApp?.name ?? "Finder";
  const menus = activeApp?.menus ?? ["File", "Edit", "View", "Go", "Window", "Help"];

  return (
    <div
      className="fixed inset-x-0 top-0 z-[9000] flex h-[var(--menubar-h)] items-center justify-between bg-black/25 px-3 text-[13px] text-white backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center gap-1">
        <button className="rounded px-2 py-0.5 hover:bg-white/15">
          <AppleLogo className="h-[15px] w-[15px]" />
        </button>
        <button className="rounded px-2 py-0.5 font-semibold hover:bg-white/15">
          {appName}
        </button>
        {menus.map((m) => (
          <button key={m} className="rounded px-2 py-0.5 hover:bg-white/15">
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3.5">
        <BatteryGlyph />
        <WifiGlyph />
        <SearchGlyph />
        <ControlCentreGlyph />
        <Clock />
      </div>
    </div>
  );
}
