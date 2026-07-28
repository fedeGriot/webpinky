import Link from "next/link";

const SECTIONS = [
  { href: "/admin/secciones/hero", label: "Hero (Home)", description: "Título, palabras rotativas y CTAs del inicio." },
  { href: "/admin/secciones/about", label: "Contenido — Quiénes somos", description: "Textos largos de la página institucional." },
  { href: "/admin/secciones/clientes", label: "Clientes", description: "Logos/nombres del marquee de clientes." },
  { href: "/admin/secciones/servicios", label: "Servicios", description: "Los 6 servicios, con bullets y tagline." },
  { href: "/admin/secciones/proceso", label: "Proceso de trabajo", description: "Los 4 pasos de 'Cómo trabajamos'." },
  { href: "/admin/secciones/valores", label: "Valores", description: "Las 4 creencias de la agencia." },
  { href: "/admin/secciones/equipo", label: "Equipo", description: "Iniciales del equipo Pinky." },
  { href: "/admin/secciones/stats", label: "Stats", description: "Números destacados (about / services)." },
  { href: "/admin/secciones/configuracion", label: "Configuración del sitio", description: "Contacto, dirección y redes sociales." },
];

export default function SeccionesIndexPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">Secciones</h1>
      <p className="mb-8 text-white/50">Editá el contenido de las páginas públicas.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-white/10 bg-card p-6 transition hover:border-accent/50"
          >
            <h2 className="mb-2 font-bold text-white">{section.label}</h2>
            <p className="text-sm text-white/50">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
