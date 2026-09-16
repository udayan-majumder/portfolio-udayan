import { create } from "zustand";
import { apps, type AppId } from "@/lib/apps";
import { defaultWallpaperId } from "@/data/wallpapers";

export interface WindowPayload {
  folderId?: string;
  projectId?: string;
  url?: string;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance extends Bounds {
  id: string;
  appId: AppId;
  title: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Bounds to restore to when un-maximizing */
  restoreBounds?: Bounds;
  payload?: WindowPayload;
}

const MENUBAR_H = 26;
const DOCK_RESERVE = 96;
const CASCADE = 28;

interface WindowStore {
  windows: WindowInstance[];
  focusedId: string | null;
  topZ: number;
  wallpaperId: string;
  openApp: (appId: AppId, payload?: WindowPayload, title?: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setBounds: (id: string, bounds: Partial<Bounds>) => void;
  setWallpaper: (wallpaperId: string) => void;
}

function nextBounds(appId: AppId, openCount: number): Bounds {
  const { defaultSize } = apps[appId];
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const width = Math.min(defaultSize.width, vw - 48);
  const height = Math.min(defaultSize.height, vh - MENUBAR_H - DOCK_RESERVE);

  const offset = (openCount % 6) * CASCADE;
  const x = Math.max(12, Math.round((vw - width) / 2) - CASCADE * 2 + offset);
  const y = Math.max(
    MENUBAR_H + 8,
    Math.round((vh - DOCK_RESERVE - height) / 2) - CASCADE + offset,
  );

  return { x, y, width, height };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  focusedId: null,
  topZ: 10,
  wallpaperId: defaultWallpaperId,

  openApp: (appId, payload, title) => {
    const { windows, topZ } = get();

    // macOS behaviour: clicking a running app's dock icon surfaces it rather
    // than launching a second copy — unless the click carries a new payload.
    if (!payload) {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        set({
          windows: windows.map((w) =>
            w.id === existing.id
              ? { ...w, minimized: false, z: topZ + 1 }
              : w,
          ),
          focusedId: existing.id,
          topZ: topZ + 1,
        });
        return;
      }
    }

    const id = `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const win: WindowInstance = {
      id,
      appId,
      title: title ?? apps[appId].name,
      ...nextBounds(appId, windows.length),
      z: topZ + 1,
      minimized: false,
      maximized: false,
      payload,
    };

    set({ windows: [...windows, win], focusedId: id, topZ: topZ + 1 });
  },

  close: (id) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id);
      const focusedId =
        s.focusedId === id
          ? (windows.filter((w) => !w.minimized).at(-1)?.id ?? null)
          : s.focusedId;
      return { windows, focusedId };
    }),

  focus: (id) =>
    set((s) => {
      if (s.focusedId === id) return s;
      const z = s.topZ + 1;
      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, z, minimized: false } : w,
        ),
        focusedId: id,
        topZ: z,
      };
    }),

  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
      focusedId:
        s.focusedId === id
          ? (s.windows.filter((w) => w.id !== id && !w.minimized).at(-1)?.id ??
            null)
          : s.focusedId,
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.restoreBounds) {
          return { ...w, ...w.restoreBounds, maximized: false };
        }
        return {
          ...w,
          maximized: true,
          restoreBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: MENUBAR_H,
          width: window.innerWidth,
          height: window.innerHeight - MENUBAR_H,
        };
      }),
    })),

  setBounds: (id, bounds) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...bounds } : w)),
    })),

  setWallpaper: (wallpaperId) => set({ wallpaperId }),
}));
