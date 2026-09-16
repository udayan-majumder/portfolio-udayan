import type { ReactNode } from "react";

export type IconProps = { className?: string };

/** macOS Big Sur icons sit on a squircle. rx 22.5% approximates Apple's
 *  continuous corner closely enough at dock and desktop sizes. */
function Squircle({
  children,
  fill,
  className,
}: {
  children?: ReactNode;
  fill: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect width="100" height="100" rx="22.5" fill={fill} />
      {children}
    </svg>
  );
}

export function FinderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="fdr-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ea9f5" />
          <stop offset="100%" stopColor="#1a72d8" />
        </linearGradient>
        <linearGradient id="fdr-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9e8ff" />
          <stop offset="100%" stopColor="#8fc6f3" />
        </linearGradient>
        <clipPath id="fdr-clip">
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#fdr-clip)">
        <rect width="50" height="100" fill="url(#fdr-l)" />
        <rect x="50" width="50" height="100" fill="url(#fdr-r)" />
      </g>
      <g fill="#1c2b3a">
        <rect x="29" y="34" width="5" height="17" rx="2.5" />
        <rect x="66" y="34" width="5" height="17" rx="2.5" />
      </g>
      <path
        d="M31 66c6 7 13 10 19 10s13-3 19-10"
        fill="none"
        stroke="#1c2b3a"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NotesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id="nts-clip">
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#nts-clip)">
        <rect width="100" height="100" fill="#fdfbf3" />
        <rect width="100" height="24" fill="#f7d14b" />
        <g stroke="#e3ded0" strokeWidth="3" strokeLinecap="round">
          <path d="M16 40h68M16 54h68M16 68h52M16 82h36" />
        </g>
      </g>
    </svg>
  );
}

export function PreviewIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id="prv-clip">
          <rect width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>
      <g clipPath="url(#prv-clip)">
        <rect width="100" height="100" fill="#ffffff" />
        <rect y="72" width="100" height="28" fill="#e9eef5" />
        <g stroke="#cfd8e3" strokeWidth="4" strokeLinecap="round">
          <path d="M20 26h44M20 40h60M20 54h34" />
        </g>
      </g>
      <g transform="translate(50 50)">
        <circle
          r="21"
          cx="7"
          cy="7"
          fill="rgba(90,170,240,0.22)"
          stroke="#3b82d6"
          strokeWidth="6"
        />
        <path
          d="M22 22l14 14"
          stroke="#2a6bb8"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="ml-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#1a73e8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22.5" fill="url(#ml-bg)" />
      <rect x="18" y="31" width="64" height="42" rx="7" fill="#ffffff" />
      <path
        d="M22 37l28 21 28-21"
        fill="none"
        stroke="#1a73e8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect width="100" height="100" rx="22.5" fill="#1b1b1d" />
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="21"
        fill="none"
        stroke="#4a4a4f"
        strokeWidth="2.5"
      />
      <rect x="2" y="2" width="96" height="18" rx="9" fill="#2e2e32" />
      <path
        d="M24 42l16 14-16 14"
        fill="none"
        stroke="#f2f2f2"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 72h26"
        stroke="#f2f2f2"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SafariIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="sfr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f8fb" />
          <stop offset="100%" stopColor="#dbe6ef" />
        </linearGradient>
        <linearGradient id="sfr-dial" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ec4f5" />
          <stop offset="100%" stopColor="#1665d8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22.5" fill="url(#sfr-bg)" />
      <circle cx="50" cy="50" r="38" fill="url(#sfr-dial)" />
      <circle cx="50" cy="50" r="33" fill="#f7fbfe" />
      <path d="M68 32L44 44 32 68l24-12z" fill="#ff4f45" />
      <path d="M32 68l24-12-12-12z" fill="#e6ebf0" />
      <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <Squircle fill="#1c2128" className={className}>
      <g transform="translate(18 18) scale(2.667)">
        <path
          fill="#ffffff"
          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        />
      </g>
    </Squircle>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <Squircle fill="#0a66c2" className={className}>
      <g transform="translate(20 20) scale(2.5)">
        <path
          fill="#ffffff"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
        />
      </g>
    </Squircle>
  );
}

export function VSCodeIcon({ className }: IconProps) {
  return (
    <Squircle fill="#0d3a58" className={className}>
      <g transform="translate(18 20)">
        <path
          fill="#29b6f6"
          d="M48 2.6v58.8a2.6 2.6 0 01-3.7 2.35L31 57.3V6.7L44.3.25A2.6 2.6 0 0148 2.6z"
        />
        <path
          fill="#ffffff"
          d="M31 6.7v50.6l-8.2 4L4 43.6l-2.9 2.2a1.7 1.7 0 01-2.7-1.35V19.5a1.7 1.7 0 012.7-1.35L4 20.4 22.8 2.7z"
          transform="translate(3 0)"
        />
        <path
          fill="#29b6f6"
          d="M7 20.4l16.8 11.6L7 43.6l-2.9 2.2a1.7 1.7 0 01-2.7-1.35V19.5a1.7 1.7 0 012.7-1.35z"
          opacity="0.75"
        />
      </g>
    </Squircle>
  );
}

export function SpotifyIcon({ className }: IconProps) {
  return (
    <Squircle fill="#1db954" className={className}>
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        transform="translate(0 2)"
      >
        <path d="M28 38c14-6 32-4 44 3" />
        <path d="M31 53c11-4.5 26-3 36 2.5" />
        <path d="M34 67c9-3.5 20-2.5 28 2" />
      </g>
    </Squircle>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="set-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9aa3ad" />
          <stop offset="100%" stopColor="#5e6874" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22.5" fill="url(#set-bg)" />
      <g fill="#f4f6f8">
        <path d="M50 24a26 26 0 100 52 26 26 0 000-52zm0 10a16 16 0 110 32 16 16 0 010-32z" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="46"
            y="16"
            width="8"
            height="14"
            rx="2.5"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="7" fill="#5e6874" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="trs" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cfd6de" />
          <stop offset="45%" stopColor="#f1f4f8" />
          <stop offset="100%" stopColor="#b9c2cc" />
        </linearGradient>
      </defs>
      <path
        d="M30 30h40l-4 52a8 8 0 01-8 7.4H42A8 8 0 0134 82z"
        fill="url(#trs)"
        opacity="0.92"
      />
      <g stroke="#96a0ab" strokeWidth="2.5" strokeLinecap="round">
        <path d="M43 42v38M50 42v38M57 42v38" />
      </g>
      <rect x="25" y="22" width="50" height="9" rx="4.5" fill="#dde3ea" />
      <path
        d="M40 22c0-5 3-8 10-8s10 3 10 8"
        fill="none"
        stroke="#dde3ea"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 80" className={className}>
      <defs>
        <linearGradient id="fld-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cc6f7" />
          <stop offset="100%" stopColor="#3f9ae8" />
        </linearGradient>
        <linearGradient id="fld-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd2fb" />
          <stop offset="100%" stopColor="#52a9ee" />
        </linearGradient>
      </defs>
      <path
        d="M4 14a7 7 0 017-7h24l9 9h45a7 7 0 017 7v8H4z"
        fill="url(#fld-b)"
      />
      <rect y="21" width="100" height="55" rx="8" fill="url(#fld-f)" />
    </svg>
  );
}

function DocumentSheet({
  label,
  accent,
  className,
}: {
  label: string;
  accent: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 80 100" className={className}>
      <path
        d="M8 6a6 6 0 016-6h36l24 24v70a6 6 0 01-6 6H14a6 6 0 01-6-6z"
        fill="#ffffff"
        stroke="#d4dae1"
        strokeWidth="1.5"
      />
      <path d="M50 0l24 24H56a6 6 0 01-6-6z" fill="#e6ebf1" />
      <g stroke="#dde3e9" strokeWidth="3.5" strokeLinecap="round">
        <path d="M20 40h40M20 52h40M20 64h26" />
      </g>
      <rect x="8" y="74" width="46" height="20" rx="4" fill={accent} />
      <text
        x="31"
        y="88"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export function TextFileIcon({ className }: IconProps) {
  return <DocumentSheet label="TXT" accent="#8a949e" className={className} />;
}

export function PdfFileIcon({ className }: IconProps) {
  return <DocumentSheet label="PDF" accent="#e0463b" className={className} />;
}

export function AppleLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3.02-.84.99-2.21 1.76-3.32 1.67-.14-1.1.42-2.26 1.09-3.02.77-.88 2.15-1.55 3.35-1.67zM20.9 17.02c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.38 3.5-4.1 3.51-1.53.02-1.93-1-4.01-.99-2.08.01-2.51 1.01-4.05.99-1.72-.02-3.04-1.77-4.03-3.32C.41 15.8-.02 10.72 1.72 8.03c1.24-1.92 3.19-3.04 5.03-3.04 1.87 0 3.05 1.03 4.6 1.03 1.5 0 2.42-1.03 4.59-1.03 1.63 0 3.36.89 4.59 2.43-4.04 2.21-3.38 7.98.37 9.6z" />
    </svg>
  );
}
