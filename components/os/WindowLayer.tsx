"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { Window } from "@/components/os/Window";
import { Placeholder } from "@/components/apps/Placeholder";
import type { AppId } from "@/lib/apps";
import { useWindowStore, type WindowInstance } from "@/store/windowStore";

type AppProps = { win: WindowInstance };

/* Each app is its own chunk — nothing but the shell ships until an icon is
   actually clicked. */
const registry: Record<AppId, ComponentType<AppProps>> = {
  finder: dynamic(() => import("@/components/apps/Finder").then((m) => m.Finder)),
  about: dynamic(() => import("@/components/apps/About").then((m) => m.About)),
  resume: dynamic(() => import("@/components/apps/Resume").then((m) => m.Resume)),
  mail: dynamic(() => import("@/components/apps/Mail").then((m) => m.Mail)),
  terminal: dynamic(() =>
    import("@/components/apps/Terminal").then((m) => m.Terminal),
  ),
  github: dynamic(() => import("@/components/apps/GitHub").then((m) => m.GitHub)),
  linkedin: dynamic(() =>
    import("@/components/apps/LinkedIn").then((m) => m.LinkedIn),
  ),
  spotify: dynamic(() =>
    import("@/components/apps/Spotify").then((m) => m.Spotify),
  ),
  safari: Placeholder,
  vscode: Placeholder,
  settings: Placeholder,
};

export function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows.map((win) => {
        const App = registry[win.appId];
        return (
          <Window key={win.id} win={win}>
            <App win={win} />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
