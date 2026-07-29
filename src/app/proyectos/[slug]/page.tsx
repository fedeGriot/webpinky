import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
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

function renderHeroTitle(title: string) {
  const words = title.trim().split(" ");
  const tailCount = Math.min(2, words.length);
  const head = words.slice(0, words.length - tailCount);
  const tail = words.slice(words.length - tailCount).join(" ");
  return (
    <>
      {head.map((word, i) => (
        <span key={i}>{word} </span>
      ))}
      <span className="relative inline-block text-accent">
        {tail}
        <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2 -rotate-1 rounded-full bg-accent/90" />
      </span>
    </>
  );
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

  const ficha = [
    { label: "Cliente", value: project.clientName },
    { label: "Industria", value: project.industry },
    { label: "Año", value: String(project.year) },
  ];

  return (
    <>
      <SiteNav active="proyectos" />
      <main>
        <section className="px-6 pt-8 sm:px-14">
          <div className="flex items-center justify-between text-sm text-white/40">
            <Link href="/" className="hover:text-white/70">
              Home
            </Link>
            <Link href="/proyectos" className="font-bold text-accent hover:text-white">
              ← Volver a proyectos
            </Link>
          </div>
        </section>

        {/* Hero: título + ficha */}
        <section className="grid grid-cols-1 gap-10 px-6 py-10 sm:px-14 lg:grid-cols-[1fr_280px]">
          <div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              {renderHeroTitle(project.heroHeadline)}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white">{project.summary}</p>
          </div>

          <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
            {ficha.map((row) => (
              <div key={row.label} className="py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-white/40">{row.label}</p>
                <p className="mt-1 font-semibold text-white">{row.value}</p>
              </div>
            ))}
            <div className="py-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Servicios</p>
              <div className="flex flex-wrap gap-2">
                {project.servicesTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lámina clara: portada + piezas + resultados */}
        <div className="rounded-b-[3rem] bg-white px-6 py-14 sm:px-14">
          <div
            className="relative flex h-96 items-center justify-center overflow-hidden rounded-3xl sm:h-[34rem]"
            style={
              project.coverImageUrl
                ? undefined
                : { background: `linear-gradient(160deg, ${project.accentColor}, ${project.accentColor}99)` }
            }
          >
            {project.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImageUrl}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `radial-gradient(${project.accentColor} 1.4px, transparent 1.4px)`,
                    backgroundSize: "18px 18px",
                  }}
                />
                <p className="relative max-w-md px-6 text-center text-2xl font-extrabold text-white sm:text-3xl">
                  {project.heroHeadline}
                </p>
              </>
            )}
          </div>

          {project.pieces.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-2 text-3xl font-extrabold text-ink sm:text-4xl">
                Piezas del <span className="text-accent">proyecto.</span>
              </h2>
              <p className="mb-10 text-ink/50">Una selección de piezas de la campaña</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {project.pieces.slice(0, 3).map((piece) => (
                  <div
                    key={piece.id}
                    className="relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-2xl p-5"
                    style={
                      !piece.imageUrl
                        ? { background: `linear-gradient(160deg, ${project.accentColor}, ${project.accentColor}99)` }
                        : undefined
                    }
                  >
                    {piece.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={piece.imageUrl}
                        alt={piece.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div
                      className={
                        piece.imageUrl
                          ? "relative -m-5 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16"
                          : "relative"
                      }
                    >
                      <p className="text-base font-extrabold leading-tight text-white">{piece.title}</p>
                      {piece.subtitle && <p className="mt-1 text-xs text-white/70">{piece.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.stats.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-ink/10 pt-10">
              {project.stats.map((stat) => (
                <div key={stat.id}>
                  <p className="text-3xl font-extrabold text-accent sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 max-w-[14rem] text-sm text-ink/60">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desafío / Solución en dos columnas */}
        <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:px-14 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-accent">— El desafío</p>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white">
              {project.challengeTitle}
            </h2>
            <p className="text-lg leading-relaxed text-white">{project.challengeBody}</p>

            {project.quoteText && (
              <blockquote
                className="mt-8 border-l-2 border-accent pl-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <p className="text-xl italic text-white">&ldquo;{project.quoteText}&rdquo;</p>
                {project.quoteAuthor && (
                  <cite className="mt-3 block text-sm not-italic text-white/40">
                    — {project.quoteAuthor}
                  </cite>
                )}
              </blockquote>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-accent">— La solución</p>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white">
              {project.solutionTitle}
            </h2>
            <p className="text-lg leading-relaxed text-white">{project.solutionBody}</p>
          </div>
        </section>

        {moreFromClient.length > 0 && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Otros proyectos <span className="text-accent">con {project.clientName}.</span>
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
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-card"
                >
                  <div
                    className="relative h-32"
                    style={
                      p.coverImageUrl
                        ? undefined
                        : { background: `linear-gradient(160deg, ${p.accentColor}55, ${p.accentColor}10)` }
                    }
                  >
                    {p.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImageUrl} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="mb-2 text-xs font-bold uppercase text-white/40">{p.category}</p>
                    <p className="font-bold text-white">{p.title}</p>
                    <p className="mt-1 text-sm text-white/50">{p.resultLabel}</p>
                  </div>
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
