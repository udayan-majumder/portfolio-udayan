"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const FILE = "/resume.pdf";

export function Resume() {
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    fetch(FILE, { method: "HEAD" })
      .then((r) => setStatus(r.ok ? "ok" : "missing"))
      .catch(() => setStatus("missing"));
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#3c3c3e]">
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-black/30 bg-[#4a4a4d] px-4">
        <span className="text-[12.5px] font-medium text-neutral-200">
          {profile.name.replace(" ", "_")}_Resume.pdf
        </span>
        <a
          href={FILE}
          download
          className="rounded-md bg-white/15 px-3 py-1 text-[12px] font-medium text-white hover:bg-white/25"
        >
          Download
        </a>
      </header>

      {status === "ok" ? (
        <iframe src={FILE} title="Resume" className="min-h-0 flex-1" />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-[14px] font-medium text-neutral-200">
            {status === "loading" ? "Opening…" : "resume.pdf not found"}
          </p>
          {status === "missing" && (
            <p className="max-w-xs text-[12.5px] leading-relaxed text-neutral-400">
              Drop your resume at{" "}
              <code className="rounded bg-black/30 px-1 py-0.5">
                public/resume.pdf
              </code>{" "}
              and it will render here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
