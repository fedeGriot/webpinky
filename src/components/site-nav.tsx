import Link from "next/link";
import { PinkyLogo } from "@/components/pinky-logo";
import { MobileNav } from "@/components/mobile-nav";

const LINKS = [
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/", label: "Home" },
];

export type NavActive = "home" | "quienes-somos" | "que-hacemos" | "proyectos" | "contacto";

export function SiteNav({ active }: { active?: NavActive }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.08] bg-ink px-6 py-4 sm:px-14">
      <Link href="/">
        <PinkyLogo />
      </Link>

      <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
        {LINKS.map((link) => {
          const key = link.href === "/" ? "home" : link.href.replace("/", "");
          const isActive = active === key;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap text-sm font-semibold transition hover:text-white ${
                isActive ? "text-accent" : "text-white/65"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/contacto"
          className="whitespace-nowrap rounded-full bg-accent px-6 py-[11px] text-[13px] font-bold text-white transition hover:bg-accent-dark"
        >
          Hablemos →
        </Link>
        <MobileNav links={LINKS} active={active} />
      </div>
    </header>
  );
}
