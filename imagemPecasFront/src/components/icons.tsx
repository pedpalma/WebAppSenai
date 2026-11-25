// Ícones SVG simples (traço), usados em botões e campos.
type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const SearchIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export const UploadIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
);

export const LogoutIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></svg>
);

export const MailIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);

export const LockIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);

export const UserIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);

export const EyeIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const EyeOffIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 3l18 18" /><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);

export const ImageIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
);

export const ArrowRightIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);

export const GearIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>
);

export const HeartIcon = ({ className = "h-5 w-5", filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} className={className}><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.6 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.6 4.3 6.7C19.5 16.4 12 21 12 21Z" /></svg>
);

export const PlusIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const TagIcon = ({ className = "h-3 w-3" }: IconProps) => (
  <svg {...base} className={className}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
);
