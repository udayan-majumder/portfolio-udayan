"use client";

import { useState } from "react";
import Image from "next/image";
import { Dock } from "@/components/os/Dock";
import { DesktopIcon } from "@/components/os/DesktopIcon";
import { MenuBar } from "@/components/os/MenuBar";
import { WindowLayer } from "@/components/os/WindowLayer";
import { desktopItems } from "@/lib/desktopItems";
import { wallpapers } from "@/data/wallpapers";
import { useWindowStore } from "@/store/windowStore";

export function Desktop() {
  const [selected, setSelected] = useState<string | null>(null);
  const openApp = useWindowStore((s) => s.openApp);
  const wallpaperId = useWindowStore((s) => s.wallpaperId);

  const wallpaper = wallpapers.find((w) => w.id === wallpaperId);

  return (
    <main
      className="fixed inset-0 overflow-hidden"
      onClick={() => setSelected(null)}
    >
      {wallpaper?.src ? (
        <Image
          src={wallpaper.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="wallpaper-fallback absolute inset-0" />
      )}

      <MenuBar />

      <div className="absolute bottom-28 right-3 top-[34px] grid grid-flow-col grid-rows-[repeat(auto-fill,94px)] content-start justify-end gap-x-1">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={() => setSelected(item.id)}
            onOpen={() => openApp(item.appId, item.payload, item.label)}
          />
        ))}
      </div>

      <WindowLayer />

      <Dock />
    </main>
  );
}
