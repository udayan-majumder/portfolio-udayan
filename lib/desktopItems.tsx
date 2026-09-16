import type { AppId } from "@/lib/apps";
import type { WindowPayload } from "@/store/windowStore";

export interface DesktopItem {
  id: string;
  label: string;
  kind: "folder" | "txt" | "pdf";
  appId: AppId;
  payload?: WindowPayload;
}

export const desktopItems: DesktopItem[] = [
  {
    id: "projects",
    label: "Projects",
    kind: "folder",
    appId: "finder",
    payload: { folderId: "projects" },
  },
  {
    id: "achievements",
    label: "Achievements",
    kind: "folder",
    appId: "finder",
    payload: { folderId: "achievements" },
  },
  {
    id: "experience",
    label: "Experience",
    kind: "folder",
    appId: "finder",
    payload: { folderId: "experience" },
  },
  {
    id: "archive",
    label: "Archive",
    kind: "folder",
    appId: "finder",
    payload: { folderId: "archive" },
  },
  { id: "resume", label: "Resume.pdf", kind: "pdf", appId: "resume" },
  { id: "readme", label: "Read me.txt", kind: "txt", appId: "about" },
];
