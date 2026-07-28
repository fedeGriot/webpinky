import Link from "next/link";

const CARDS = [
  {
    href: "/admin/secciones",
    title: "Secciones",
    description: "Hero, servicios, proceso, valores, equipo, stats y configuración del sitio.",
  },
  {
    href: "/admin/proyectos",
    title: "Proyectos",
    description: "Casos de estudio: crear, editar, reordenar y destacar proyectos.",
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">Panel de administración</h1>
      <p className="mb-8 text-white/50">Elegí qué querés editar.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-white/10 bg-card p-6 transition hover:border-accent/50"
          >
            <h2 className="mb-2 text-lg font-bold text-white">{card.title}</h2>
            <p className="text-sm text-white/50">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
