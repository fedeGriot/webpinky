import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import { CaseStudyCard } from "@/components/case-study-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { FillButton } from "@/components/fill-button";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { SectionHeading } from "@/components/section-heading";
import { AccentText } from "@/components/accent-text";
import { JsonLd } from "@/components/json-ld";
import { VideoLightboxTrigger } from "@/components/video-lightbox";
import { getYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { DecorativeVideo } from "@/components/decorative-video";
import { getServiceAnimation } from "@/lib/service-animations";
import { getClients, getLandingBySlug, getLandingCases, getProcessSteps, getTestimonialsByIds } from "@/lib/data";
import { hasAdminSession } from "@/lib/dal";
import { splitAccent, stripAccent } from "@/lib/accent";
import { SITE_URL } from "@/lib/seo";
import type { LandingSectionKey } from "@/lib/landing-sections";

// Renderizado dinámico: el contenido viene del CMS (/admin/landings) y debe
// reflejarse sin rebuild, igual que el resto del sitio.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Una landing sin publicar solo la ve un admin logueado (vista previa); para
// el resto no existe.
async function getVisibleLanding(slug: string) {
  const landing = await getLandingBySlug(slug);
  if (!landing) return null;
  if (!landing.published && !(await hasAdminSession())) return null;
  return landing;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = await getVisibleLanding(slug);
  if (!landing) return {};
  const url = `/servicios/${landing.slug}`;
  return {
    // absolute: el title de la planilla de SEO ya trae la marca ("… - Pinky"),
    // así que no se le suma el template "%s — Pinky" del layout.
    title: { absolute: landing.seoTitle },
    description: landing.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: landing.seoTitle, description: landing.seoDescription, url },
    ...(landing.published ? {} : { robots: { index: false, follow: false } }),
  };
}

/** "Hagamos que tu marca *crezca en digital.*" → las dos partes del CtaSection. */
function splitCtaTitle(title: string) {
  const segments = splitAccent(title);
  const firstAccent = segments.findIndex((s) => s.accent);
  if (firstAccent === -1) return { line1: title, accent: "" };
  return {
    line1: segments.slice(0, firstAccent).map((s) => s.text).join("").trim(),
    accent: segments.slice(firstAccent).map((s) => s.text).join("").trim(),
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const landing = await getVisibleLanding(slug);
  if (!landing) notFound();

  const [clients, cases, testimonials, processSteps] = await Promise.all([
    getClients(),
    getLandingCases(landing.caseProjectIds),
    getTestimonialsByIds(landing.testimonialIds),
    getProcessSteps(),
  ]);
  // Si la landing no adapta el método, se usan las etapas generales del sitio
  // (las mismas de ¿Qué hacemos?), para no dejar la sección vacía.
  const methodSteps =
    landing.methodSteps.length > 0
      ? landing.methodSteps
      : processSteps.map((step) => {
          const [tag, headline] = step.title.split(" — ");
          return { title: tag ?? step.title, body: headline ? `${headline}. ${step.description}` : step.description };
        });
  const cta = splitCtaTitle(landing.ctaTitle);
  const servicesHaveAnimations = landing.services.some((s) => s.service && getServiceAnimation(s.service));
  const showreelId = landing.showreelUrl ? getYouTubeId(landing.showreelUrl) : null;
  const showreelThumb = showreelId ? await getYouTubeThumbnail(showreelId) : null;

  const url = `${SITE_URL}/servicios/${landing.slug}`;
  const name = stripAccent(landing.heroTitle);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: landing.navLabel,
    description: landing.seoDescription,
    url,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Uruguay" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "¿Qué hacemos?", item: `${SITE_URL}/que-hacemos` },
      { "@type": "ListItem", position: 3, name: landing.navLabel, item: url },
    ],
  };
  const faqJsonLd = landing.faqs.length > 0 && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  // Cada sección por clave, para renderizarlas en el orden de la landing
  // (sectionOrder). Las que no tienen contenido quedan en null.
  const sections: Record<LandingSectionKey, ReactNode> = {
    clients: (
      <>
        {/* Marcas que confían */}
        <section className="relative z-10 px-6 sm:px-14 section-gap">
          <Reveal className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end sm:gap-16">
            <SectionHeading className="leading-tight">
              <AccentText text={landing.clientsTitle} />
            </SectionHeading>
            {landing.clientsBody && <p className="text-white/70">{landing.clientsBody}</p>}
          </Reveal>
          {/* Mismo criterio que en la Home: -mx para que el marquee vaya de
              punta a punta sin unidades de viewport. */}
          <Reveal className="-mx-6 sm:-mx-14">
            <ClientsMarquee clients={clients} />
          </Reveal>
        </section>
      </>
    ),
    showreel: (
      <>
        {/* Showreel: título y texto junto al video (no suelto en la página),
            con un marco rosa desplazado detrás como acento. */}
        {showreelId && showreelThumb && (
          <section className="px-6 sm:px-14 section-gap">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <Reveal>
                <SectionEyebrow className="mb-3">Showreel</SectionEyebrow>
                <SectionHeading className="mb-4 leading-tight">
                  <AccentText text={landing.showreelTitle || "Showreel"} />
                </SectionHeading>
                {landing.showreelBody && <p className="text-lg text-white">{landing.showreelBody}</p>}
              </Reveal>
              <Reveal delay={0.1} className="relative">
                <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-accent/25 sm:-bottom-4 sm:-right-4" />
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/40">
                  <Image src={showreelThumb} alt="" fill sizes="(max-width: 1024px) 90vw, 760px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <VideoLightboxTrigger videoId={showreelId} label={`Ver showreel — ${landing.navLabel}`} />
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </>
    ),
    pain: (
      <>
        {/* Puntos de dolor */}
        {landing.painPoints.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="mb-8 max-w-2xl sm:mb-12">
              <SectionHeading className="mb-4 leading-tight">
                <AccentText text={landing.painTitle} />
              </SectionHeading>
              {landing.painIntro && <p className="text-lg text-white">{landing.painIntro}</p>}
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {landing.painPoints.map((point, i) => (
                <Reveal
                  key={point.title}
                  delay={Math.min(i * 0.08, 0.24)}
                  className="group relative overflow-hidden rounded-3xl bg-card p-6 sm:p-8"
                >
                  <div className="mb-3 flex items-center gap-4 sm:mb-4">
                    {/* Las ondas (.sonar-ring, globals.css) nacen del centro
                        del punto; el overflow-hidden de la tarjeta las recorta. */}
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <span aria-hidden="true" className="sonar-ring" />
                      <span aria-hidden="true" className="sonar-ring" />
                      <span aria-hidden="true" className="sonar-ring" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
                    </span>
                    <h3 className="relative text-[22px] font-extrabold leading-snug text-white">{point.title}</h3>
                  </div>
                  <p className="relative text-white">{point.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </>
    ),
    services: (
      <>
        {/* Servicios */}
        {landing.services.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-16">
              <SectionHeading className={`leading-tight ${landing.servicesIntro ? "" : "sm:col-span-2"}`}>
                <AccentText text={landing.servicesTitle} />
              </SectionHeading>
              {landing.servicesIntro && <p className="text-lg text-white">{landing.servicesIntro}</p>}
            </Reveal>
            {/* Estructura de los servicios de ¿Qué hacemos? (bajada, título,
                texto y animación del servicio a la derecha), en dos columnas
                desde lg. En mobile la animación va arriba, más chica: al
                costado le dejaba muy poco ancho al texto. */}
            {!servicesHaveAnimations ? (
              // Sin animaciones (ej. Producción audiovisual): tarjetas en tres
              // columnas, para que los textos no queden sueltos en la página.
              // En el celular, carrusel deslizable (mismo criterio que los
              // casos): seis tarjetas apiladas eran la sección más larga. Un
              // solo Reveal para todo, por las tarjetas que arrancan fuera de
              // pantalla hacia el costado.
              <Reveal className="mt-10 sm:mt-12">
                <div
                  data-lenis-prevent-touch
                  className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
                >
                  {landing.services.map((service) => (
                    <article
                      key={service.title}
                      className="flex w-[82vw] shrink-0 snap-start scroll-ml-6 flex-col rounded-3xl border border-white/10 bg-card/60 p-6 transition-colors hover:border-accent/50 sm:w-auto sm:p-8"
                    >
                      {service.tagline && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-accent">{service.tagline}</p>
                      )}
                      <h3 className="mb-3 text-2xl font-extrabold leading-tight text-white">
                        <AccentText text={service.title} />
                      </h3>
                      <p className="leading-relaxed text-white/80">{service.body}</p>
                      {service.href && (
                        <Link
                          href={service.href}
                          className="mt-auto pt-5 text-sm font-bold text-white/60 transition hover:text-white"
                        >
                          Ver más →
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              </Reveal>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 sm:mt-14 sm:gap-y-14 lg:grid-cols-2">
                {landing.services.map((service, i) => {
                  const animation = service.service ? getServiceAnimation(service.service) : null;
                  return (
                    // Grilla de dos columnas: título a la izquierda y animación a la
                    // derecha. En mobile el párrafo va debajo a todo el ancho (con
                    // la animación al costado del texto completo quedaba muy
                    // angosto); desde sm la animación ocupa las dos filas.
                    <Reveal
                      as="article"
                      key={service.title}
                      delay={(i % 2) * 0.08}
                      className="grid grid-cols-[1fr_auto] gap-x-4 sm:gap-x-8"
                    >
                      <div className="min-w-0 self-center sm:self-end">
                        {service.tagline && (
                          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">— {service.tagline}</p>
                        )}
                        <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                          <AccentText text={service.title} />
                        </h3>
                      </div>
                      {animation && (
                        <DecorativeVideo
                          {...animation}
                          isolated
                          className="col-start-2 row-start-1 aspect-[960/756] w-28 self-center sm:row-span-2 sm:w-48 lg:w-40 xl:w-52"
                        />
                      )}
                      <div className="col-span-2 mt-4 sm:col-span-1">
                        <p className="text-lg leading-relaxed text-white">{service.body}</p>
                        {service.href && (
                          <Link
                            href={service.href}
                            className="mt-5 inline-block text-sm font-bold text-white/60 transition hover:text-white"
                          >
                            Ver más →
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </>
    ),
    cases: (
      <>
        {/* Casos */}
        {cases.length > 0 && (
          <section id="casos" className="scroll-mt-24 px-6 sm:px-14 section-gap">
            <Reveal className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <SectionEyebrow className="mb-3">Casos de éxito</SectionEyebrow>
                <SectionHeading className="mb-4 leading-tight">
                  <AccentText text={landing.casesTitle} />
                </SectionHeading>
                {landing.casesIntro && <p className="text-white">{landing.casesIntro}</p>}
              </div>
              <Link
                href="/proyectos"
                className="-my-3 shrink-0 py-3 text-sm font-bold text-white/70 transition hover:text-white"
              >
                Ver todos los proyectos →
              </Link>
            </Reveal>
            {/* Hasta lg, carrusel deslizable con scroll-snap (como el de la Home,
                pero solo CSS): tres tarjetas verticales apiladas ocupaban casi
                tres pantallas en el celular, y en tablet la tercera quedaba sola.
                El -mx/px lleva el carrusel de borde a borde y deja asomar la
                tarjeta siguiente como pista de que se puede deslizar. Un solo
                Reveal para todo: los de cada tarjeta no se disparaban en las que
                arrancan fuera de pantalla hacia el costado. */}
            <Reveal>
              <div
                data-lenis-prevent-touch
                className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:-mx-14 sm:px-14 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {cases.map((project) => (
                  <div key={project.id} className="w-[78vw] shrink-0 snap-start scroll-ml-6 sm:w-[44vw] sm:scroll-ml-14 lg:w-auto">
                    <CaseStudyCard project={project} showVideo={landing.casesShowVideo} />
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}
      </>
    ),
    method: (
      <>
        {/* Metodología */}
        <section className="bg-card/40 px-6 py-14 text-center sm:px-14 sm:py-20 section-gap">
          <Reveal>
            <SectionEyebrow className="mb-2">Metodología</SectionEyebrow>
            <SectionHeading className="mx-auto mb-4 max-w-3xl leading-tight">
              <AccentText text={landing.methodTitle} />
            </SectionHeading>
            {landing.methodIntro && <p className="mx-auto max-w-2xl text-lg text-white">{landing.methodIntro}</p>}
            <ol className="mt-10 grid grid-cols-1 gap-4 text-left sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {methodSteps.map((step, i) => (
                <li key={step.title} className="rounded-2xl bg-card p-5 sm:p-6">
                  <h3 className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")} — {step.title}
                  </h3>
                  <p className="text-white">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      </>
    ),
    formats: (
      <>
        {/* Formatos y canales: cómo se adapta el servicio a cada medio. */}
        {landing.formats.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="mb-10 max-w-2xl">
              <SectionHeading className="mb-4 leading-tight">
                <AccentText text={landing.formatsTitle} />
              </SectionHeading>
              {landing.formatsIntro && <p className="text-lg text-white">{landing.formatsIntro}</p>}
            </Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {landing.formats.map((format, i) => (
                <Reveal key={format.title} delay={Math.min(i * 0.08, 0.24)} className="border-t-2 border-accent pt-5">
                  <h3 className="mb-2 text-xl font-extrabold text-white">{format.title}</h3>
                  <p className="leading-relaxed text-white/80">{format.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </>
    ),
    partner: (
      <>
        {/* Growth partner: opcional (la consultoría lo reserva para algunas
            landings, ej. Ecommerce y Performance); vacío no se muestra. */}
        {(landing.partnerBody || landing.partnerPoints.length > 0) && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16">
              <SectionHeading className="leading-tight">
                <AccentText text={landing.partnerTitle} />
              </SectionHeading>
              <p className="text-lg leading-relaxed text-white">{landing.partnerBody}</p>
            </Reveal>
            {landing.partnerPoints.length > 0 && (
              <ol className="mt-12 divide-y divide-white/10 border-t border-white/10">
                {landing.partnerPoints.map((point, i) => (
                  <Reveal
                    as="li"
                    key={point.title}
                    delay={Math.min(i * 0.08, 0.32)}
                    className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[280px_1fr] sm:gap-10"
                  >
                    <div className="flex gap-3">
                      <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-lg font-bold leading-snug text-white">{point.title}</h3>
                    </div>
                    <p className="leading-relaxed text-white">{point.body}</p>
                  </Reveal>
                ))}
              </ol>
            )}
          </section>
        )}
      </>
    ),
    testimonials: (
      <>
        {/* Testimonios (escritos o en video), administrados aparte en
            /admin/secciones/testimonios y elegidos en cada landing. */}
        {testimonials.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal>
              <SectionHeading className="mb-10 leading-tight">
                <AccentText text={landing.testimonialsTitle} />
              </SectionHeading>
              <div
                className={`grid grid-cols-1 gap-x-16 gap-y-14 ${testimonials.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </Reveal>
          </section>
        )}
      </>
    ),
    faq: (
      <>
        {/* FAQs */}
        {landing.faqs.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <SectionHeading className="leading-tight">
                <AccentText text={landing.faqTitle} />
              </SectionHeading>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {landing.faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-lg font-bold leading-snug text-white">{faq.question}</h3>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg leading-none text-accent transition group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl leading-relaxed text-white/80">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </section>
        )}
      </>
    ),
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <SiteNav active="que-hacemos" />
      <main>
        {!landing.published && (
          <p className="bg-accent px-6 py-2 text-center text-sm font-bold text-white sm:px-14">
            Vista previa: esta landing no está publicada y solo la ven los administradores.{" "}
            <Link href={`/admin/landings/${landing.id}`} className="underline">
              Editar
            </Link>
          </p>
        )}

        {/* Hero */}
        <section className="relative px-6 pt-16 sm:px-14 sm:pt-20">
          <BackgroundShape className="right-[-140px] top-[-60px] h-[600px] w-[600px] opacity-50" />
          <div className="relative z-10 max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
              <Link href="/que-hacemos" className="-my-3 inline-block py-3 transition hover:text-white">
                ¿Qué hacemos?
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/80">{landing.navLabel}</span>
            </nav>
            <SectionEyebrow className="mb-4 text-accent!">{landing.heroEyebrow}</SectionEyebrow>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              <AccentText text={landing.heroTitle} underline />
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white">{landing.heroBody}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <FillButton href="/contacto" className="bg-accent px-7 py-4 text-sm">
                {landing.heroCtaLabel}
              </FillButton>
            </div>
          </div>
        </section>

        {landing.sectionOrder
          .filter((key) => !landing.hiddenSections.includes(key))
          .map((key) => (
            <Fragment key={key}>{sections[key]}</Fragment>
          ))}

        <div className="bg-card/40 section-gap">
          <CtaSection eyebrow={landing.ctaEyebrow} titleLine1={cta.line1} titleAccent={cta.accent} body={landing.ctaBody} />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
