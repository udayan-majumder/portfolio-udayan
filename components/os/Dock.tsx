"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TrashIcon } from "@/components/icons/AppIcons";
import { apps, dockOrder, type AppId } from "@/lib/apps";
import { useWindowStore } from "@/store/windowStore";

const SIZE = 48;
const MAX_SCALE = 1.62;
const RANGE = 150;
const SPRING = { mass: 0.1, stiffness: 190, damping: 14 };

function DockTile({
  label,
  running,
  onClick,
  mouseX,
  getCenter,
  children,
}: {
  label: string;
  running?: boolean;
  onClick: () => void;
  mouseX: MotionValue<number>;
  getCenter: () => number | undefined;
  children: React.ReactNode;
}) {
  /* Scale is a transform, so a magnified tile never changes the dock's
     layout — which is what keeps `getCenter` stable while hovering. */
  const distance = useTransform(mouseX, (x) => {
    const center = getCenter();
    return center === undefined ? RANGE : x - center;
  });

  const scale = useSpring(
    useTransform(distance, [-RANGE, 0, RANGE], [1, MAX_SCALE, 1], {
      clamp: true,
    }),
    SPRING,
  );

  const y = useTransform(scale, (s) => -(s - 1) * 20);

  return (
    <div
      data-tile
      className="group relative flex flex-col items-center justify-end"
      style={{ width: SIZE }}
    >
      <motion.span
        style={{ y }}
        className="pointer-events-none absolute -top-11 z-10 whitespace-nowrap rounded-md bg-neutral-800/90 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
      >
        {label}
      </motion.span>

      <motion.button
        aria-label={label}
        onClick={onClick}
        style={{ scale, y, width: SIZE, height: SIZE, transformOrigin: "bottom center" }}
        whileTap={{ scale: 0.86 }}
        className="drop-shadow-md"
      >
        {children}
      </motion.button>

      <span
        className={`mt-1 h-1 w-1 rounded-full bg-white/80 transition-opacity ${
          running ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const containerRef = useRef<HTMLDivElement>(null);
  const centers = useRef<number[]>([]);

  const openApp = useWindowStore((s) => s.openApp);
  const windows = useWindowStore((s) => s.windows);
  const runningApps = new Set<AppId>(windows.map((w) => w.appId));

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    centers.current = Array.from(
      el.querySelectorAll<HTMLElement>("[data-tile]"),
    ).map((tile) => {
      const r = tile.getBoundingClientRect();
      return r.left + r.width / 2;
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center pb-2">
      <div
        ref={containerRef}
        onMouseEnter={measure}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="pointer-events-auto flex items-end gap-2.5 rounded-2xl border border-white/20 bg-white/20 px-2.5 pb-1.5 pt-2 shadow-2xl backdrop-blur-2xl"
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        {dockOrder.map((appId, i) => {
          const app = apps[appId];
          const Icon = app.icon;
          return (
            <DockTile
              key={appId}
              label={app.name}
              running={runningApps.has(appId)}
              onClick={() => openApp(appId)}
              mouseX={mouseX}
              getCenter={() => centers.current[i]}
            >
              <Icon className="h-full w-full" />
            </DockTile>
          );
        })}

        <div className="mx-1 mb-3 h-11 w-px bg-white/30" />

        <DockTile
          label="Trash"
          onClick={() => {}}
          mouseX={mouseX}
          getCenter={() => centers.current[dockOrder.length]}
        >
          <TrashIcon className="h-full w-full" />
        </DockTile>
      </div>
    </div>
  );
}
