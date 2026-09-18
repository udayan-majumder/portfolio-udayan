"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppleLogo } from "@/components/icons/AppIcons";

const BOOT_KEY = "portfolioos:booted";
const TOTAL_MS = 5000;
const LOGO_DELAY_MS = 350;
const BAR_HOLD_MS = 200;

/* useLayoutEffect runs synchronously before the browser's next paint, so the
   "already visited" check below can turn the overlay off before it ever
   becomes visible. On the server it would just warn and no-op, so it's
   swapped for useEffect there — this never actually executes during SSR. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Mimics a real Mac's cold-boot sequence: a beat of black, the Apple logo
 *  fading in, then the firmware progress bar filling — shown once per
 *  browser via localStorage, then fading out to reveal the desktop already
 *  mounted underneath.
 *
 *  Defaults to `mount: true` so the server-rendered markup IS the black
 *  screen — a first-time visitor never glimpses the desktop underneath
 *  before the boot overlay appears. A layout effect (before paint) flips
 *  `mount` to false for a returning visitor, which unmounts this whole
 *  subtree outright rather than asking the entrance/exit animation to run —
 *  telling a freshly-mounted AnimatePresence child to exit in the same tick
 *  is a race, not a real "boot finished" transition. */
export function BootScreen() {
  const [mount, setMount] = useState(true);
  const [show, setShow] = useState(true);
  const [stage, setStage] = useState<"black" | "logo">("black");
  const decided = useRef(false);

  useIsomorphicLayoutEffect(() => {
    // Dev Strict Mode invokes effects twice on mount; without this guard the
    // second invocation would see the flag the first one just wrote and
    // wrongly treat a genuine first visit as a repeat one.
    if (decided.current) return;
    decided.current = true;

    let firstVisit = true;
    try {
      firstVisit = window.localStorage.getItem(BOOT_KEY) !== "1";
      if (firstVisit) window.localStorage.setItem(BOOT_KEY, "1");
    } catch {
      // Storage unavailable (private browsing, etc.) — skip the animation.
      firstVisit = false;
    }
    if (!firstVisit) setMount(false);
  }, []);

  useEffect(() => {
    if (!mount) return;
    const toLogo = setTimeout(() => setStage("logo"), LOGO_DELAY_MS);
    const toDone = setTimeout(() => setShow(false), TOTAL_MS);
    return () => {
      clearTimeout(toLogo);
      clearTimeout(toDone);
    };
  }, [mount]);

  if (!mount) return null;

  const barDuration = (TOTAL_MS - LOGO_DELAY_MS - BAR_HOLD_MS) / 1000;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          role="status"
          aria-label="Starting up"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
        >
          <AnimatePresence>
            {stage === "logo" && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-9"
              >
                <AppleLogo className="h-16 w-16 text-white" />
                <div className="h-[3px] w-[200px] overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: barDuration, ease: "easeInOut" }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
