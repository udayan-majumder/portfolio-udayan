"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { apps } from "@/lib/apps";
import { useWindowStore, type Bounds, type WindowInstance } from "@/store/windowStore";

const MENUBAR_H = 26;
type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: "n", className: "left-2 right-2 -top-1 h-2 cursor-ns-resize" },
  { dir: "s", className: "left-2 right-2 -bottom-1 h-2 cursor-ns-resize" },
  { dir: "w", className: "top-2 bottom-2 -left-1 w-2 cursor-ew-resize" },
  { dir: "e", className: "top-2 bottom-2 -right-1 w-2 cursor-ew-resize" },
  { dir: "nw", className: "-top-1 -left-1 h-3 w-3 cursor-nwse-resize" },
  { dir: "ne", className: "-top-1 -right-1 h-3 w-3 cursor-nesw-resize" },
  { dir: "sw", className: "-bottom-1 -left-1 h-3 w-3 cursor-nesw-resize" },
  { dir: "se", className: "-bottom-1 -right-1 h-3 w-3 cursor-nwse-resize" },
];

function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  focused,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  focused: boolean;
}) {
  const base =
    "group/light flex h-3 w-3 items-center justify-center rounded-full transition-colors";
  const glyph =
    "opacity-0 transition-opacity group-hover/lights:opacity-100 pointer-events-none";

  return (
    <div className="group/lights flex items-center gap-2">
      <button
        aria-label="Close"
        onClick={onClose}
        className={base}
        style={{ background: focused ? "var(--traffic-red)" : "#c8ccd1" }}
      >
        <svg viewBox="0 0 10 10" className={`${glyph} h-2 w-2`}>
          <path
            d="M3 3l4 4M7 3l-4 4"
            stroke="#7a0e0a"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        aria-label="Minimize"
        onClick={onMinimize}
        className={base}
        style={{ background: focused ? "var(--traffic-yellow)" : "#c8ccd1" }}
      >
        <svg viewBox="0 0 10 10" className={`${glyph} h-2 w-2`}>
          <path d="M2.5 5h5" stroke="#8a5a02" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      <button
        aria-label="Maximize"
        onClick={onMaximize}
        className={base}
        style={{ background: focused ? "var(--traffic-green)" : "#c8ccd1" }}
      >
        <svg viewBox="0 0 10 10" className={`${glyph} h-2 w-2`}>
          <path
            d="M3 7V3h4"
            stroke="#0a5c1c"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function Window({
  win,
  children,
}: {
  win: WindowInstance;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);

  // Selected individually: zustand actions are stable references, so this
  // window only re-renders when its own focus state actually changes.
  const focus = useWindowStore((s) => s.focus);
  const close = useWindowStore((s) => s.close);
  const minimize = useWindowStore((s) => s.minimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const setBounds = useWindowStore((s) => s.setBounds);
  const focused = useWindowStore((s) => s.focusedId === win.id);

  const { minSize } = apps[win.appId];

  /* Drag and resize mutate the element's style directly and commit to the
     store only on pointerup — otherwise every pointermove re-renders the
     window tree and the whole desktop stutters. */

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();

    const el = outerRef.current;
    if (!el) return;

    const startX = e.clientX;
    const startY = e.clientY;
    let dx = 0;
    let dy = 0;

    const onMove = (ev: PointerEvent) => {
      dx = ev.clientX - startX;
      dy = Math.max(MENUBAR_H - win.y, ev.clientY - startY);
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };

    const onUp = () => {
      el.style.transform = "";
      setBounds(win.id, { x: win.x + dx, y: win.y + dy });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (e: React.PointerEvent, dir: ResizeDir) => {
    e.preventDefault();
    e.stopPropagation();

    const el = outerRef.current;
    if (!el) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...win };
    let next: Bounds = {
      x: start.x,
      y: start.y,
      width: start.width,
      height: start.height,
    };

    const onMove = (ev: PointerEvent) => {
      const mx = ev.clientX - startX;
      const my = ev.clientY - startY;
      let { width, height, x, y } = {
        width: start.width,
        height: start.height,
        x: start.x,
        y: start.y,
      };

      if (dir.includes("e")) width = Math.max(minSize.width, start.width + mx);
      if (dir.includes("s")) height = Math.max(minSize.height, start.height + my);
      if (dir.includes("w")) {
        width = Math.max(minSize.width, start.width - mx);
        x = start.x + (start.width - width);
      }
      if (dir.includes("n")) {
        height = Math.max(minSize.height, start.height - my);
        y = Math.max(MENUBAR_H, start.y + (start.height - height));
      }

      next = { x, y, width, height };
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const onUp = () => {
      setBounds(win.id, next);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <motion.div
      ref={outerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.13 }}
      onPointerDown={() => focus(win.id)}
      className="absolute"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.z,
        pointerEvents: win.minimized ? "none" : "auto",
      }}
    >
      <motion.div
        initial={{ scale: 0.93 }}
        animate={
          win.minimized
            ? { scale: 0.18, opacity: 0, y: 520 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        style={{ transformOrigin: "bottom center" }}
        className={`flex h-full w-full flex-col overflow-hidden rounded-[var(--window-radius)] border border-black/15 bg-white ${
          focused ? "shadow-[0_22px_70px_rgba(0,0,0,0.45)]" : "shadow-xl"
        }`}
      >
        <div
          onPointerDown={startDrag}
          onDoubleClick={() => toggleMaximize(win.id)}
          className={`relative flex h-9 shrink-0 items-center border-b border-black/10 px-3 ${
            win.maximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
          } ${focused ? "bg-[#e8e8ea]" : "bg-[#f2f2f4]"}`}
        >
          <TrafficLights
            focused={focused}
            onClose={() => close(win.id)}
            onMinimize={() => minimize(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
          />
          <span
            className={`pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold ${
              focused ? "text-neutral-700" : "text-neutral-400"
            }`}
          >
            {win.title}
          </span>
        </div>

        <div className="mac-scroll min-h-0 flex-1 overflow-auto bg-white text-neutral-900">
          {children}
        </div>
      </motion.div>

      {!win.maximized &&
        HANDLES.map((h) => (
          <div
            key={h.dir}
            onPointerDown={(e) => startResize(e, h.dir)}
            className={`absolute ${h.className}`}
          />
        ))}
    </motion.div>
  );
}
