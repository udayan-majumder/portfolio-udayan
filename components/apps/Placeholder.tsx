import { apps } from "@/lib/apps";
import type { WindowInstance } from "@/store/windowStore";

export function Placeholder({ win }: { win: WindowInstance }) {
  const app = apps[win.appId];
  const Icon = app.icon;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#f6f6f8] text-center">
      <Icon className="h-20 w-20 opacity-90" />
      <div>
        <p className="text-base font-semibold text-neutral-800">{app.name}</p>
        <p className="mt-1 text-sm text-neutral-500">
          This app is built in the next phase.
        </p>
      </div>
    </div>
  );
}
