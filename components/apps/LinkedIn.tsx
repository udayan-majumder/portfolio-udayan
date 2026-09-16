"use client";

import Image from "next/image";
import { LinkedInIcon } from "@/components/icons/AppIcons";
import { achievements } from "@/data/achievements";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const NAV = [
  {
    label: "Home",
    path: "M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z",
  },
  {
    label: "My Network",
    path: "M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 12A3.5 3.5 0 104 8.5 3.5 3.5 0 007.5 12z",
  },
  {
    label: "Jobs",
    path: "M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z",
  },
  {
    label: "Messaging",
    path: "M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7z",
  },
  {
    label: "Notifications",
    path: "M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z",
  },
];

const LOGO_TINTS = ["#0a66c2", "#057642", "#8f5849", "#5f3c8b"];

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-white">
      {title && (
        <h2 className="px-6 pt-5 text-xl font-semibold text-black/90">{title}</h2>
      )}
      <div className="px-6 pb-5 pt-3">{children}</div>
    </section>
  );
}

function OrgLogo({ name, index }: { name: string; index: number }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded text-base font-semibold text-white"
      style={{ background: LOGO_TINTS[index % LOGO_TINTS.length] }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-10 flex h-[52px] items-center gap-4 border-b border-black/10 bg-white px-5">
      <LinkedInIcon className="h-8 w-8 shrink-0" />
      <div className="flex items-center gap-1 rounded bg-[#edf3f8] px-3 py-1.5">
        <svg viewBox="0 0 16 16" className="h-4 w-4 fill-black/60">
          <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 002.12-2.12zM3 6.5A3.5 3.5 0 116.5 10 3.5 3.5 0 013 6.5z" />
        </svg>
        <span className="text-[13px] text-black/50">Search</span>
      </div>

      <nav className="ml-auto flex items-center gap-1">
        {NAV.map((item) => (
          <span
            key={item.label}
            className="flex w-[74px] flex-col items-center gap-0.5 py-1 text-[11px] text-black/60"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d={item.path} />
            </svg>
            {item.label}
          </span>
        ))}
      </nav>
    </header>
  );
}

function ProfileHeader() {
  return (
    <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <div className="h-[134px] bg-gradient-to-r from-[#2d1b4e] via-[#5b3a7e] to-[#b56b74]" />

      <div className="relative px-6 pb-5">
        <Image
          src={profile.photo}
          alt={profile.name}
          width={152}
          height={152}
          className="absolute -top-[76px] h-[152px] w-[152px] rounded-full border-4 border-white object-cover"
        />

        <div className="pt-[84px]">
          <h1 className="text-2xl font-semibold text-black/90">{profile.name}</h1>
          <p className="mt-0.5 text-base text-black/90">
            {profile.title} · {profile.tagline}
          </p>
          <p className="mt-1 text-sm text-black/60">
            {profile.location} ·{" "}
            <a
              href={profile.links.email}
              className="font-semibold text-[#0a66c2] hover:underline"
            >
              Contact info
            </a>
          </p>
          <p className="mt-1 text-sm text-black/60">
            {experience[0].title} at {experience[0].company}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#004182]"
            >
              Connect
            </a>
            <a
              href={profile.links.email}
              className="rounded-full border border-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-[#0a66c2] hover:bg-[#0a66c2]/10"
            >
              Message
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/40 px-4 py-1.5 text-sm font-semibold text-black/70 hover:bg-black/5"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LinkedIn() {
  return (
    <div className="mac-scroll h-full overflow-auto bg-[#f4f2ee]">
      <TopNav />

      <div className="mx-auto flex max-w-[740px] flex-col gap-2 px-4 py-5">
        <ProfileHeader />

        <Card title="About">
          {profile.bio.map((p, i) => (
            <p key={i} className="mb-2.5 text-sm leading-relaxed text-black/90">
              {p}
            </p>
          ))}
        </Card>

        <Card title="Experience">
          <div className="flex flex-col divide-y divide-black/8">
            {experience.map((role, i) => (
              <div key={role.id} className="flex gap-3 py-4 first:pt-1">
                <OrgLogo name={role.company} index={i} />
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-black/90">
                    {role.title}
                  </h3>
                  <p className="text-sm text-black/90">
                    {role.company} · {role.type}
                  </p>
                  <p className="text-[13px] text-black/60">
                    {role.period} · {role.location}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {role.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="text-[13.5px] leading-relaxed text-black/80"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[13px] text-black/60">
                    {role.stack.join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Education">
          <div className="flex gap-3 pt-1">
            <OrgLogo name="TI" index={3} />
            <div>
              <h3 className="text-[15px] font-semibold text-black/90">
                {profile.education.institution}
              </h3>
              <p className="text-sm text-black/90">{profile.education.degree}</p>
              <p className="text-[13px] text-black/60">
                Graduating {profile.education.graduation} ·{" "}
                {profile.education.location}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Projects">
          <div className="flex flex-col divide-y divide-black/8">
            {projects.map((p) => (
              <div key={p.id} className="py-3 first:pt-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-black/90">
                    {p.name}
                  </h3>
                  <span className="shrink-0 text-[13px] text-black/60">
                    {p.period}
                  </span>
                </div>
                <p className="text-sm text-black/80">{p.tagline}</p>
                {p.accolade && (
                  <p className="mt-1 text-[13px] font-medium text-[#915907]">
                    {p.accolade}
                  </p>
                )}
                <p className="mt-1.5 text-[13px] text-black/60">
                  {p.tech.join(" · ")}
                </p>
                <a
                  href={`https://github.com/${p.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block text-[13.5px] font-semibold text-[#0a66c2] hover:underline"
                >
                  View repository
                </a>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Honors & Awards">
          <div className="flex flex-col divide-y divide-black/8">
            {achievements.map((a) => (
              <div key={a.id} className="py-3 first:pt-1">
                <h3 className="text-[15px] font-semibold text-black/90">
                  {a.title}
                </h3>
                <p className="text-[13px] text-black/60">
                  {a.event} · {a.period} · {a.role}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-black/80">
                  {a.detail}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Skills">
          <div className="flex flex-col divide-y divide-black/8">
            {Object.entries(profile.skills).map(([group, items]) => (
              <div key={group} className="py-3 first:pt-1">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-black/50">
                  {group}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[#edf3f8] px-3 py-1 text-[13px] text-black/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
