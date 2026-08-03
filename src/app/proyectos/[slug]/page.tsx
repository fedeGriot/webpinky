import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getProjectBySlug, getNextProject, getPreviousProject } from "@/lib/data";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { VideoLightboxTrigger } from "@/components/video-lightbox";
import { getYouTubeId } from "@/lib/youtube";
import { RichTextContent } from "@/components/rich-text-content";
import { stripHtml } from "@/lib/rich-text";

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
    description: stripHtml(project.summary),
    alternates: { canonical: `/proyectos/${slug}` },
    openGraph: {
      title: `${project.title} — Pinky`,
      description: stripHtml(project.summary),
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

  const [previousProject, nextProject] = await Promise.all([
    getPreviousProject(project.order),
    getNextProject(project.order),
  ]);
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
    description: stripHtml(project.summary),
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
            <RichTextContent html={project.summary} className="mt-6 max-w-xl text-lg text-white" />
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
            <Reveal className="mt-14 flex flex-col gap-6 sm:flex-row sm:flex-nowrap sm:gap-x-8 sm:gap-y-6">
              {project.stats.map((stat) => (
                <div key={stat.id} className="sm:basis-0 sm:flex-1">
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
            <RichTextContent html={project.challengeBody} className="text-lg leading-relaxed text-white" />

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
            <RichTextContent html={project.solutionBody} className="text-lg leading-relaxed text-white" />
          </div>
        </Reveal>

        {(previousProject || nextProject) && (
          <Reveal as="section" className="px-6 pb-24 sm:px-14 section-gap">
            {/* Navegación simple entre proyectos: dos links de texto, uno a
                cada lado, en vez de la tarjeta pesada de antes. Debajo del
                rótulo (Anterior/Siguiente) va el nombre real del próximo
                proyecto, no un texto genérico. La animación al pasar el
                mouse queda solo en la flecha (no en todo el bloque) para
                que se sienta como un gesto chico, no un botón. */}
            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-10">
              {previousProject ? (
                <Link
                  href={`/proyectos/${previousProject.slug}`}
                  className="group flex max-w-[45%] flex-col gap-2 sm:max-w-xs"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-white/40">Anterior</span>
                  <span className="flex items-center gap-3 text-lg font-normal text-white/70 transition group-hover:text-white sm:text-2xl">
                    <span
                      aria-hidden
                      className="inline-block shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1.5"
                    >
                      ←
                    </span>
                    <span className="line-clamp-2">{previousProject.title}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {nextProject ? (
                <Link
                  href={`/proyectos/${nextProject.slug}`}
                  className="group flex max-w-[45%] flex-col items-end gap-2 text-right sm:max-w-xs"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-white/40">Siguiente</span>
                  <span className="flex items-center gap-3 text-lg font-normal text-white/70 transition group-hover:text-white sm:text-2xl">
                    <span className="line-clamp-2">{nextProject.title}</span>
                    <span
                      aria-hidden
                      className="inline-block shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </Reveal>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
