import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StatCard } from "@/components/stat-card";
import { getProjectBySlug, getMoreFromClient, getNextProject } from "@/lib/data";

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: `${project.title} — Pinky` };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [moreFromClient, nextProject] = await Promise.all([
    getMoreFromClient(project.clientName, project.slug),
    getNextProject(project.order),
  ]);

  return (
    <>
      <SiteNav />
      <main>
        <section className="px-6 pb-4 pt-8 text-sm text-white/40 sm:px-14">
          <Link href="/" className="hover:text-white/70">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/proyectos" className="hover:text-white/70">
            Proyectos
          </Link>{" "}
          / <span className="text-white/60">{project.title}</span>
          <div className="mt-4">
            <Link href="/proyectos" className="font-bold text-accent hover:text-white">
              ← Volver a proyectos
            </Link>
          </div>
        </section>

        <section className="px-6 pb-16 pt-6 sm:px-14">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">
            Proyecto destacado
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
            {project.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">{project.summary}</p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase text-white/40">Cliente</p>
              <p className="mt-1 font-semibold text-white">{project.clientName}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-white/40">Industria</p>
              <p className="mt-1 font-semibold text-white">{project.industry}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-white/40">Año</p>
              <p className="mt-1 font-semibold text-white">{project.year}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-white/40">Servicios</p>
              <p className="mt-1 font-semibold text-white">{project.servicesTags.join(", ")}</p>
            </div>
          </div>
        </section>

        {project.stats.length > 0 && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {project.stats.map((stat) => (
                <StatCard key={stat.id} value={stat.value} label={stat.label} />
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
          <p className="mb-2 text-sm font-bold text-accent">— El desafío</p>
          <h2 className="mb-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {project.challengeTitle}
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/60">{project.challengeBody}</p>

          {project.quoteText && (
            <blockquote className="mt-10 max-w-2xl border-l-2 border-accent pl-6" style={{ fontFamily: "var(--font-serif)" }}>
              <p className="text-xl italic text-white/80">&ldquo;{project.quoteText}&rdquo;</p>
              {project.quoteAuthor && (
                <cite className="mt-3 block text-sm not-italic text-white/40">
                  — {project.quoteAuthor}
                </cite>
              )}
            </blockquote>
          )}
        </section>

        <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
          <p className="mb-2 text-sm font-bold text-accent">— La solución</p>
          <h2 className="mb-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {project.solutionTitle}
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/60">{project.solutionBody}</p>
        </section>

        {project.pieces.length > 0 && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <h2 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
              Piezas del <span className="text-accent">proyecto.</span>
            </h2>
            <p className="mb-10 text-white/50">{project.pieces.length} piezas seleccionadas</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.pieces.map((piece) => (
                <div
                  key={piece.id}
                  className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-6"
                  style={!piece.imageUrl ? { background: `${project.accentColor}22` } : undefined}
                >
                  {piece.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={piece.imageUrl}
                      alt={piece.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className={piece.imageUrl ? "relative bg-gradient-to-t from-black/80 to-transparent -m-6 p-6 pt-16" : "relative"}>
                    <p className="text-lg font-extrabold leading-tight text-white">{piece.title}</p>
                    {piece.subtitle && <p className="mt-2 text-sm text-white/50">{piece.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {moreFromClient.length > 0 && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Más de este cliente ·{" "}
                <span className="text-accent">Otros proyectos con {project.clientName}.</span>
              </h2>
              <Link href="/proyectos" className="text-sm font-bold text-white/70 hover:text-white">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {moreFromClient.map((p) => (
                <Link
                  key={p.id}
                  href={`/proyectos/${p.slug}`}
                  className="group rounded-2xl border border-white/10 bg-card p-6"
                >
                  <p className="mb-3 text-xs font-bold uppercase text-white/40">{p.category}</p>
                  <p className="font-bold text-white">{p.title}</p>
                  <p className="mt-1 text-sm text-white/50">{p.resultLabel}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {nextProject && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <Link href={`/proyectos/${nextProject.slug}`} className="group flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">
                  Siguiente proyecto
                </p>
                <p className="text-3xl font-extrabold text-white sm:text-4xl">
                  {nextProject.clientName} <span className="text-accent">{nextProject.title}.</span>
                </p>
              </div>
              <span className="text-3xl text-accent transition group-hover:translate-x-1">→</span>
            </Link>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
