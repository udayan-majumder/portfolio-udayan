export interface Wallpaper {
  id: string;
  name: string;
  /** Path under /public. */
  src?: string;
  /** CSS `background` value used instead of an image asset. */
  gradient?: string;
}

export const wallpapers: Wallpaper[] = [
  { id: "lofi-cat", name: "Lofi Cat", src: "/wallpapers/lofi-cat.jpg" },
  {
    id: "dusk",
    name: "Dusk",
    gradient:
      "radial-gradient(ellipse 80% 60% at 18% 8%, #4a2f7a 0%, transparent 60%)," +
      "radial-gradient(ellipse 70% 50% at 82% 18%, #8c4a75 0%, transparent 55%)," +
      "radial-gradient(ellipse 100% 40% at 50% 100%, #e08a6b 0%, transparent 70%)," +
      "linear-gradient(180deg, #150c2b 0%, #2d1b4e 38%, #6b3a5f 72%, #b56b74 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    gradient:
      "radial-gradient(ellipse 70% 50% at 20% 10%, #1fae7a 0%, transparent 55%)," +
      "radial-gradient(ellipse 80% 60% at 85% 15%, #2a6bb0 0%, transparent 60%)," +
      "radial-gradient(ellipse 90% 45% at 50% 100%, #0f3b52 0%, transparent 70%)," +
      "linear-gradient(180deg, #041019 0%, #0a2233 40%, #0f3b3a 75%, #123b2e 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    gradient:
      "radial-gradient(circle at 24% 22%, #2a3a6b 0%, transparent 45%)," +
      "radial-gradient(circle at 76% 12%, #4a3f8f 0%, transparent 40%)," +
      "linear-gradient(180deg, #05050c 0%, #0c0f24 45%, #14173a 100%)",
  },
  {
    id: "sunset-ridge",
    name: "Sunset Ridge",
    gradient:
      "radial-gradient(ellipse 90% 55% at 50% 0%, #ffb37a 0%, transparent 55%)," +
      "radial-gradient(ellipse 80% 50% at 20% 30%, #ff7a59 0%, transparent 55%)," +
      "radial-gradient(ellipse 100% 45% at 50% 100%, #5a1f3d 0%, transparent 70%)," +
      "linear-gradient(180deg, #2b0f2e 0%, #6a1f3a 40%, #b3452f 75%, #ff8a4c 100%)",
  },
];

export const defaultWallpaperId = wallpapers[0].id;
