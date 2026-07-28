import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { getAllProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Proyectos — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const projects = await getAllProjects();

  return (
    <>
      <SiteNav />
      <main>
        <PageHeader
          eyebrow="Proyectos"
          title={
            <>
              Casos que nos <span className="text-accent">enorgullecen.</span>
            </>
          }
          body="Una selección de proyectos para las marcas que confiaron en nosotros."
        />

        <section className="px-6 py-16 sm:px-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card p-8"
                style={{ minHeight: 300 }}
              >
                {project.coverImageUrl && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/20" />
                  </>
                )}
                <div className="relative">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wide text-white/40">
                    {project.category} · {project.year}
                  </p>
                  <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white">
                    {project.heroHeadline}
                  </h2>
                  <p className="text-sm text-white/50">{project.summary}</p>
                </div>
                <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="font-bold text-white">{project.clientName}</p>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ background: project.accentColor }}
                  >
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CtaSection
          eyebrow="Estamos abiertos a nuevos proyectos"
          titleLine1="Hagamos que"
          titleAccent="tu marca crezca."
        />
      </main>
      <SiteFooter />
    </>
  );
}
