import type { ComponentType } from "react";
import {
  FinderIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  NotesIcon,
  PreviewIcon,
  SafariIcon,
  SettingsIcon,
  SpotifyIcon,
  TerminalIcon,
  VSCodeIcon,
  type IconProps,
} from "@/components/icons/AppIcons";

export type AppId =
  | "finder"
  | "safari"
  | "vscode"
  | "github"
  | "linkedin"
  | "spotify"
  | "about"
  | "mail"
  | "terminal"
  | "resume"
  | "settings";

export interface AppDef {
  id: AppId;
  name: string;
  icon: ComponentType<IconProps>;
  inDock: boolean;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  /** Menu titles shown in the menu bar while this app is focused */
  menus: string[];
}

const FILE_MENUS = ["File", "Edit", "View", "Window", "Help"];

export const apps: Record<AppId, AppDef> = {
  finder: {
    id: "finder",
    name: "Finder",
    icon: FinderIcon,
    inDock: true,
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 520, height: 340 },
    menus: ["File", "Edit", "View", "Go", "Window", "Help"],
  },
  safari: {
    id: "safari",
    name: "Safari",
    icon: SafariIcon,
    inDock: true,
    defaultSize: { width: 980, height: 640 },
    minSize: { width: 560, height: 380 },
    menus: ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"],
  },
  vscode: {
    id: "vscode",
    name: "Visual Studio Code",
    icon: VSCodeIcon,
    inDock: true,
    defaultSize: { width: 1000, height: 640 },
    minSize: { width: 620, height: 400 },
    menus: ["File", "Edit", "Selection", "View", "Go", "Run", "Help"],
  },
  github: {
    id: "github",
    name: "GitHub",
    icon: GitHubIcon,
    inDock: true,
    defaultSize: { width: 940, height: 640 },
    minSize: { width: 560, height: 400 },
    menus: FILE_MENUS,
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkedInIcon,
    inDock: true,
    defaultSize: { width: 900, height: 640 },
    minSize: { width: 560, height: 400 },
    menus: FILE_MENUS,
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    icon: SpotifyIcon,
    inDock: true,
    defaultSize: { width: 780, height: 520 },
    minSize: { width: 420, height: 360 },
    menus: ["File", "Edit", "View", "Playback", "Window", "Help"],
  },
  about: {
    id: "about",
    name: "Notes",
    icon: NotesIcon,
    inDock: true,
    defaultSize: { width: 820, height: 560 },
    minSize: { width: 480, height: 340 },
    menus: FILE_MENUS,
  },
  mail: {
    id: "mail",
    name: "Mail",
    icon: MailIcon,
    inDock: true,
    defaultSize: { width: 760, height: 540 },
    minSize: { width: 460, height: 380 },
    menus: ["File", "Edit", "View", "Mailbox", "Message", "Window", "Help"],
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: TerminalIcon,
    inDock: true,
    defaultSize: { width: 740, height: 460 },
    minSize: { width: 420, height: 260 },
    menus: ["Shell", "Edit", "View", "Window", "Help"],
  },
  resume: {
    id: "resume",
    name: "Preview",
    icon: PreviewIcon,
    inDock: true,
    defaultSize: { width: 780, height: 700 },
    minSize: { width: 420, height: 400 },
    menus: ["File", "Edit", "View", "Go", "Tools", "Window", "Help"],
  },
  settings: {
    id: "settings",
    name: "System Settings",
    icon: SettingsIcon,
    inDock: true,
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 480, height: 380 },
    menus: ["File", "Edit", "View", "Window", "Help"],
  },
};

/** Dock order, left to right. Trash is appended separately by the Dock. */
export const dockOrder: AppId[] = [
  "finder",
  "safari",
  "vscode",
  "github",
  "linkedin",
  "spotify",
  "about",
  "mail",
  "terminal",
  "resume",
  "settings",
];
