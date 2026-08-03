import { getStats } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { SectionHeading } from "@/components/section-heading";

// El módulo "Resultados que hablan" siempre muestra 3, pero el admin puede
// cargar más de 3 en /admin/secciones/stats — de esos, se eligen 3 al azar
// en cada visita, así van rotando entre todos los casos cargados en vez de
// mostrar siempre los mismos. Se re-ordenan por "order" después de elegirlos
// para que la posición en pantalla no salte de forma aleatoria también.
function pickRandom<T extends { order: number }>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).sort((a, b) => a.order - b.order);
}

/**
 * Usado en ¿Qué hacemos?, Contacto y la página de Gracias — mismo módulo,
 * mismos datos (Stat context="services"), para que el mensaje de resultados
 * de la agencia sea consistente en cualquier página donde aparezca. Requiere
 * que la página que lo use sea `force-dynamic` (para que la selección al
 * azar se recalcule en cada visita, no solo en build).
 *
 * `bottomPadding`: en ¿Qué hacemos? este módulo lo sigue un CTA final que ya
 * aporta su propio espacio antes del footer (mismo criterio que el resto del
 * sitio: cada sección solo agrega margen/padding hacia UN lado, nunca los
 * dos, para no duplicar el espacio con `section-gap`). En Contacto y Gracias
 * es lo último antes del footer, así que necesita su propio padding inferior
 * — mismo valor que usa CtaSection ahí.
 */
export async function ResultsSection({ bottomPadding = false }: { bottomPadding?: boolean }) {
  const allStats = await getStats("services");
  if (allStats.length === 0) return null;
  const stats = pickRandom(allStats, 3);

  return (
    <section className={`px-6 sm:px-14 section-gap ${bottomPadding ? "pb-24" : ""}`}>
      <Reveal>
        <SectionEyebrow className="mb-2">Lo que generamos</SectionEyebrow>
        <SectionHeading className="mb-12">
          Resultados que <span className="text-accent">hablan.</span>
        </SectionHeading>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
          {stats.map((stat) => (
            <div key={stat.id} className="sm:px-8 sm:first:pl-0">
              <p className="text-4xl font-extrabold text-accent sm:text-5xl">{stat.value}</p>
              <p className="mt-2 font-bold text-white">{stat.label}</p>
              {stat.sublabel && <p className="mt-1 text-sm text-white/60">{stat.sublabel}</p>}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
