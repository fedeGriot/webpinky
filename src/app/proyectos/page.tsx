import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DecorativeBlob } from "@/components/decorative-blob";
import { CtaSection } from "@/components/cta-section";
import { getAllProjects } from "@/lib/data";
import { staggerForGrid } from "@/lib/stagger";

export const metadata: Metadata = {
  title: "Proyectos — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const projects = await getAllProjects();

  return (
    <>
      <SiteNav active="proyectos" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-16 sm:px-14 sm:pt-20">
          <DecorativeBlob className="right-[-140px] top-0 h-[420px] w-[420px] opacity-40" />
          <div className="relative z-10">
            <h1 className="relative inline-block text-5xl font-extrabold leading-[1.05] text-white sm:text-7xl">
              Proyectos
              <span className="absolute -bottom-2 -left-1 -right-3 -z-10 h-3 -rotate-1 rounded-full bg-accent/90" />
            </h1>
          </div>
        </section>

        {/* Grilla */}
        <section className="px-6 py-10 sm:px-14">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.slug}`}
                className={`group ${staggerForGrid(project.id)}`}
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
                  <p className="shrink-0 text-lg font-extrabold text-accent">{project.resultBadge}</p>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="line-clamp-2 max-w-[26rem] text-sm text-white">{project.summary}</p>
                  <p className="shrink-0 text-xs uppercase tracking-wide text-white/40">
                    {project.resultLabel}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="bg-card/40">
          <CtaSection
            eyebrow="Estamos abiertos a nuevos proyectos"
            titleLine1="Hagamos que"
            titleAccent="tu marca crezca."
          />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
