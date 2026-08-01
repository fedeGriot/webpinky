import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getProjectBySlug, getNextProject } from "@/lib/data";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { VideoLightboxTrigger } from "@/components/video-lightbox";
import { getYouTubeId } from "@/lib/youtube";

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
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${slug}` },
    openGraph: {
      title: `${project.title} — Pinky`,
      description: project.summary,
      url: `/proyectos/${slug}`,
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : undefined,
    },
  };
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

  const nextProject = await getNextProject(project.order);
  const videoId = project.videoUrl ? getYouTubeId(project.videoUrl) : null;

  const ficha = [
    { label: "Cliente", value: project.clientName },
    { label: "Industria", value: project.industry },
    { label: "Año", value: String(project.year) },
  ];

  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/proyectos/${project.slug}`,
    image: project.coverImageUrl ? `${SITE_URL}${project.coverImageUrl}` : undefined,
    datePublished: `${project.year}`,
    creator: { "@type": "Organization", name: "Pinky. The Fit Agency" },
    about: project.clientName,
  };

  return (
    <>
      <JsonLd data={caseStudyJsonLd} />
      <SiteNav active="proyectos" />
      <main>
        <section className="px-6 pt-8 sm:px-14">
          <div className="flex items-center justify-end text-sm text-white/40">
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
            {videoId && (
              <>
                <div className="absolute inset-0 bg-black/20" />
                <VideoLightboxTrigger videoId={videoId} label={`Ver video — ${project.title}`} />
              </>
            )}
          </div>

          {project.pieces.length > 0 && (
            <Reveal className="mt-14">
              <h2 className="mb-10 text-3xl font-extrabold text-ink sm:text-4xl">
                Piezas del <span className="text-accent">proyecto.</span>
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {project.pieces.slice(0, 3).map((piece) => (
                  <div
                    key={piece.id}
                    className="relative aspect-[9/16] overflow-hidden rounded-2xl"
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
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {project.stats.length > 0 && (
            <Reveal className="mt-14 flex flex-wrap gap-x-8 gap-y-6 sm:flex-nowrap">
              {project.stats.map((stat) => (
                <div key={stat.id} className="basis-[45%] sm:basis-0 sm:flex-1">
                  <p className="text-3xl font-extrabold text-accent sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 max-w-[14rem] text-sm text-ink/60">{stat.label}</p>
                </div>
              ))}
            </Reveal>
          )}
        </div>

        {/* Desafío / Solución en dos columnas */}
        <Reveal as="section" className="grid grid-cols-1 gap-10 px-6 sm:px-14 lg:grid-cols-2 section-gap">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-accent">— El desafío</p>
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
            <p className="mb-2 text-sm font-bold uppercase text-accent">— La solución</p>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white">
              {project.solutionTitle}
            </h2>
            <p className="text-lg leading-relaxed text-white">{project.solutionBody}</p>
          </div>
        </Reveal>

        {nextProject && (
          <Reveal as="section" className="px-6 pb-24 sm:px-14 section-gap">
            <Link
              href={`/proyectos/${nextProject.slug}`}
              className="group relative isolate flex items-center justify-between overflow-hidden rounded-3xl border border-white/10 bg-card px-8 py-10 sm:px-12 sm:py-14"
            >
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent-dark transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40 transition group-hover:text-white/70">
                  Siguiente proyecto
                </p>
                <p className="text-3xl font-extrabold text-white sm:text-4xl">
                  {nextProject.clientName}{" "}
                  <span className="text-accent transition group-hover:text-white">{nextProject.title}.</span>
                </p>
              </div>
              <span className="shrink-0 text-3xl text-accent transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </Link>
          </Reveal>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
