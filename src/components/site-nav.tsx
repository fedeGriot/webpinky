import Link from "next/link";
import { PinkyLogo } from "@/components/pinky-logo";
import { SiteHeader } from "@/components/site-header";
import { FillButton } from "@/components/fill-button";
import { FillHoverText } from "@/components/fill-hover-text";
import { getSocialLinks } from "@/components/social-icons";
import { getSiteSettings } from "@/lib/data";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export type NavActive = "home" | "quienes-somos" | "que-hacemos" | "proyectos" | "contacto";

export async function SiteNav({ active }: { active?: NavActive }) {
  const settings = await getSiteSettings();
  const social = settings ? getSocialLinks(settings) : [];

  const desktopNav = (
    <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
      {LINKS.map((link) => {
        const key = link.href === "/" ? "home" : link.href.replace("/", "");
        const isActive = active === key;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`group whitespace-nowrap text-sm font-semibold ${
              isActive ? "text-accent" : "text-white/65"
            }`}
          >
            <FillHoverText>{link.label}</FillHoverText>
          </Link>
        );
      })}
    </nav>
  );

  const cta =
    active === "contacto" ? (
      <span
        aria-disabled="true"
        className="whitespace-nowrap rounded-full bg-white/5 px-6 py-[11px] text-[13px] font-bold text-white/40"
      >
        Hablemos →
      </span>
    ) : (
      <FillButton href="/contacto" className="whitespace-nowrap bg-accent px-6 py-[11px] text-[13px]">
        Hablemos →
      </FillButton>
    );

  return (
    <SiteHeader
      links={LINKS}
      active={active}
      social={social}
      logo={
        <Link href="/">
          <PinkyLogo />
        </Link>
      }
      desktopNav={desktopNav}
      cta={cta}
    />
  );
}
