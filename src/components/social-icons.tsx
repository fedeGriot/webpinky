const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <line x1="7.5" y1="10" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5V11.8c0-1.1.8-1.8 1.9-1.8 1.1 0 1.6.7 1.6 1.9v4.6" />
    </svg>
  );
}

export function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="4" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <path d="M6.6 3.8c.5-.1 1 .1 1.3.6l1.5 2.6c.3.5.2 1.1-.2 1.5l-1.4 1.4c1 2.1 2.7 3.8 4.8 4.8l1.4-1.4c.4-.4 1-.5 1.5-.2l2.6 1.5c.5.3.7.8.6 1.3l-.5 2.1c-.1.6-.7 1-1.3 1-8 0-14.5-6.5-14.5-14.5 0-.6.4-1.2 1-1.3l2.2-.4z" />
    </svg>
  );
}

export function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l7.2 5.5a1.4 1.4 0 0 0 1.6 0L20 7" />
    </svg>
  );
}

export function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} {...props}>
      <path d="M12 21s7-6.4 7-11.6A7 7 0 0 0 5 9.4C5 14.6 12 21 12 21z" />
      <circle cx="12" cy="9.4" r="2.4" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<string, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  "X / Twitter": TwitterIcon,
};

export type SiteSocialUrls = {
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
};

/** Compartido entre SiteFooter y MobileNav para no repetir el mismo mapeo. */
export function getSocialLinks(settings: SiteSocialUrls) {
  return [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "X / Twitter", href: settings.twitterUrl },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));
}
