"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

const MAILBOXES = ["Inbox", "Drafts", "Sent", "Archive"];

export function Mail() {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [body, "", from ? `Reply to: ${from}` : ""].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || "Hello Udayan",
    )}&body=${encodeURIComponent(lines)}`;
  };

  const field =
    "w-full border-b border-black/8 bg-transparent px-4 py-2 text-[13.5px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:bg-blue-50/40";

  return (
    <div className="flex h-full bg-white">
      <aside className="w-[168px] shrink-0 border-r border-black/8 bg-[#f1f1f3]/90 px-2 py-3">
        <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Mailboxes
        </p>
        {MAILBOXES.map((m, i) => (
          <div
            key={m}
            className={`flex items-center gap-2 rounded-md px-2 py-[5px] text-[13px] ${
              i === 0 ? "bg-black/10 font-medium text-neutral-900" : "text-neutral-500"
            }`}
          >
            <svg viewBox="0 0 20 16" className="h-4 w-4 shrink-0">
              <rect
                x="1"
                y="2"
                width="18"
                height="12"
                rx="2.5"
                fill={i === 0 ? "#3b82f6" : "#b6bcc4"}
              />
              <path
                d="M2.5 4l7.5 5.5L17.5 4"
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {m}
          </div>
        ))}
      </aside>

      <form onSubmit={send} className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center justify-between border-b border-black/8 px-4">
          <span className="text-[13px] font-semibold text-neutral-800">
            New Message
          </span>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3.5 py-1 text-[12.5px] font-medium text-white hover:bg-blue-700"
          >
            Send
          </button>
        </header>

        <div className="shrink-0">
          <div className={`${field} flex gap-2 focus:bg-transparent`}>
            <span className="text-neutral-400">To:</span>
            <span className="text-neutral-800">{profile.email}</span>
          </div>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From: your email"
            className={field}
          />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className={field}
          />
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          className="mac-scroll min-h-0 flex-1 resize-none px-4 py-3 text-[13.5px] leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </form>
    </div>
  );
}
