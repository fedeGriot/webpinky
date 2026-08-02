import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import { PinkyLogo } from "@/components/pinky-logo";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/secciones", label: "Secciones" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-row items-center justify-between border-b border-white/10 bg-card px-5 py-4 sm:w-64 sm:flex-col sm:items-stretch sm:justify-between sm:border-b-0 sm:border-r sm:py-6">
        <div className="flex items-center gap-6 sm:flex-col sm:items-stretch sm:gap-0">
          <div className="flex items-center gap-2 sm:mb-8">
            <PinkyLogo size="sm" subtext={false} />
            <span className="text-[10px] font-bold uppercase leading-none text-white/50">
              Admin
            </span>
          </div>
          <nav className="flex flex-row gap-1 sm:flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:border-t sm:border-white/10 sm:pt-4">
          <p className="hidden truncate text-xs text-white/40 sm:block">{session.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-left text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white sm:w-full"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-ink px-5 py-8 sm:px-10">{children}</main>
    </div>
  );
}
