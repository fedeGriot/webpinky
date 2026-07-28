import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

const AGENCY_LINKS = [
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
];

const SOCIAL_LINKS = (settings: { instagramUrl: string | null; linkedinUrl: string | null; youtubeUrl: string | null; twitterUrl: string | null }) =>
  [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "YouTube", href: settings.youtubeUrl },
    { label: "X / Twitter", href: settings.twitterUrl },
  ].filter((s) => s.href);

export async function SiteFooter() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const social = SOCIAL_LINKS(settings);

  return (
    <footer className="border-t border-white/[0.08] bg-ink px-6 py-14 sm:px-14">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
        <div>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">pinky</span>
            <span className="h-[6px] w-[6px] rounded-full bg-accent" />
          </div>
          <p className="text-sm text-white/50">
            The Fit Agency. Desde {settings.foundedYear}.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">Agencia</p>
          <ul className="flex flex-col gap-2">
            {AGENCY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/65 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">Contacto</p>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li>{settings.phone1}</li>
            {settings.phone2 && <li>{settings.phone2}</li>}
            <li>{settings.address}</li>
          </ul>
        </div>

        {social.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">Seguinos</p>
            <ul className="flex flex-col gap-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href!}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/65 hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Pinky. The Fit Agency. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link href="/privacidad" className="hover:text-white/70">
            Política de privacidad
          </Link>
          <Link href="/terminos" className="hover:text-white/70">
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
