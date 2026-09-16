export interface Wallpaper {
  id: string;
  name: string;
  /** Path under /public. When absent, the CSS gradient fallback is used. */
  src?: string;
}

export const wallpapers: Wallpaper[] = [
  { id: "lofi-cat", name: "Lofi Cat", src: "/wallpapers/lofi-cat.jpg" },
];

export const defaultWallpaperId = wallpapers[0].id;
