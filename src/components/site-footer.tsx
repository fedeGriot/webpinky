import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { PinkyLogo } from "@/components/pinky-logo";
import { SOCIAL_ICONS, PhoneIcon } from "@/components/social-icons";

const AGENCY_LINKS = [
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

const toTel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const SOCIAL_LINKS = (settings: { instagramUrl: string | null; linkedinUrl: string | null; youtubeUrl: string | null; twitterUrl: string | null }) =>
  [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "X / Twitter", href: settings.twitterUrl },
  ].filter((s) => s.href);

export async function SiteFooter({ variant = "default" }: { variant?: "default" | "alt" }) {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const social = SOCIAL_LINKS(settings);
  const bg = variant === "alt" ? "bg-card/40" : "bg-ink";

  return (
    <footer className={`border-t border-white/[0.08] ${bg} px-6 sm:px-14`}>
      <div className="flex flex-wrap items-center justify-between gap-6 py-7">
        <div className="flex flex-wrap items-center gap-7">
          <PinkyLogo size="sm" subtext={false} />

          <nav className="flex flex-wrap items-center gap-7">
            {AGENCY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/65 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2.5">
            <PhoneIcon className="h-4 w-4 shrink-0 text-accent" />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-white">
              <a href={toTel(settings.phone1)} className="transition hover:text-accent">
                {settings.phone1}
              </a>
              {settings.phone2 && (
                <>
                  <span className="text-white/20">|</span>
                  <a href={toTel(settings.phone2)} className="transition hover:text-accent">
                    {settings.phone2}
                  </a>
                </>
              )}
            </div>
          </div>

          {social.length > 0 && (
            <div className="flex items-center gap-3">
              {social.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-accent hover:text-white"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-4 text-xs text-white/40">
        <p>© {new Date().getFullYear()} Pinky. The Fit Agency.</p>
        <div className="flex gap-4">
          <Link href="/privacidad" className="hover:text-white/70">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-white/70">
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
