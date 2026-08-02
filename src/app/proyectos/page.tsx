import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { getAllProjects } from "@/lib/data";
import { staggerForGrid } from "@/lib/stagger";
import { stripHtml } from "@/lib/rich-text";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Casos de éxito de Pinky: estrategia, creatividad y performance aplicados a marcas reales en Uruguay y la región.",
  alternates: { canonical: "/proyectos" },
  openGraph: { title: "Proyectos — Pinky", url: "/proyectos" },
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
}) {
  const { cliente } = await searchParams;
  const allProjects = await getAllProjects();
  const projects = cliente ? allProjects.filter((p) => p.clientName === cliente) : allProjects;

  return (
    <>
      <SiteNav active="proyectos" />
      <main>
        {/* Hero */}
        <section className="relative px-6 pb-12 pt-16 sm:px-14 sm:pt-20">
          <BackgroundShape shape="09" className="right-[-120px] top-[-60px] h-[560px] w-[560px] opacity-10" />
          <div className="relative z-10">
            <h1 className="relative inline-block text-5xl font-extrabold leading-[1.05] text-white sm:text-7xl">
              {cliente ? cliente : "Proyectos"}
              <span className="absolute -bottom-2 -left-1 -right-3 -z-10 h-3 -rotate-1 rounded-full bg-accent/90" />
            </h1>
            {cliente && (
              <Link href="/proyectos" className="mt-4 block text-sm font-bold text-white/60 hover:text-white">
                ← Ver todos los proyectos
              </Link>
            )}
          </div>
        </section>

        {/* Grilla */}
        <section className="relative z-10 px-6 sm:px-14 section-gap">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={Math.min(i * 0.05, 0.3)}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className={`group block ${staggerForGrid(project.id)}`}
                >
                  <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/40">
                    <span>
                      {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span>{project.category}</span>
                  </div>

                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                    style={
                      project.coverImageUrl
                        ? undefined
                        : { background: `linear-gradient(150deg, ${project.accentColor}, ${project.accentColor}99)` }
                    }
                  >
                    {project.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.coverImageUrl}
                        alt={project.clientName}
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: "radial-gradient(#fff 1.2px, transparent 1.2px)",
                          backgroundSize: "14px 14px",
                        }}
                      />
                    )}
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <p className="text-xl font-bold text-white">{project.clientName}</p>
                    {project.resultBadge && (
                      <p className="shrink-0 text-lg font-extrabold text-accent">{project.resultBadge}</p>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="line-clamp-2 max-w-[26rem] text-sm text-white">{stripHtml(project.summary)}</p>
                    {project.resultLabel && (
                      <p className="shrink-0 text-xs uppercase tracking-wide text-white/40">
                        {project.resultLabel}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="bg-card/40 section-gap">
          <CtaSection
            eyebrow="Estamos abiertos a nuevos proyectos"
            titleLine1="Hagamos que"
            titleAccent="tu marca conecte."
          />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
