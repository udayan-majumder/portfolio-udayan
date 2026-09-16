"use client";

import {
  FolderIcon,
  PdfFileIcon,
  TextFileIcon,
} from "@/components/icons/AppIcons";
import type { DesktopItem } from "@/lib/desktopItems";

const glyphs = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  txt: TextFileIcon,
} as const;

export function DesktopIcon({
  item,
  selected,
  onSelect,
  onOpen,
}: {
  item: DesktopItem;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const Glyph = glyphs[item.kind];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onOpen}
      className="flex w-[88px] flex-col items-center gap-1 rounded-md px-1 pb-1 pt-2"
    >
      <span
        className={`flex h-[58px] w-[64px] items-center justify-center rounded-md ${
          selected ? "bg-white/25" : ""
        }`}
      >
        <Glyph
          className={
            item.kind === "folder" ? "h-[52px] w-[62px]" : "h-[56px] w-[45px]"
          }
        />
      </span>
      <span
        className={`max-w-full rounded px-1.5 py-px text-center text-[12px] leading-tight text-white ${
          selected ? "bg-blue-500" : ""
        }`}
        style={
          selected
            ? undefined
            : { textShadow: "0 1px 3px rgba(0,0,0,0.75)" }
        }
      >
        {item.label}
      </span>
    </button>
  );
}
