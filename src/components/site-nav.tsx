import Link from "next/link";

const LINKS = [
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.08] bg-ink px-6 py-4 sm:px-14">
      <Link href="/" className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-white">pinky</span>
        <span className="h-[7px] w-[7px] rounded-full bg-accent" />
        <span className="hidden text-[9px] font-bold leading-none text-white/50 sm:inline">
          The Fit
          <br />
          Agency
        </span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-white/65 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/que-hacemos#contacto"
        className="rounded-full bg-accent px-6 py-[11px] text-[13px] font-bold text-white transition hover:bg-accent-dark"
      >
        Hablemos →
      </Link>
    </header>
  );
}
