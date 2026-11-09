import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import { CaseStudyCard } from "@/components/case-study-card";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { FillButton } from "@/components/fill-button";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { SectionHeading } from "@/components/section-heading";
import { AccentText } from "@/components/accent-text";
import { JsonLd } from "@/components/json-ld";
import { getClients, getLandingBySlug, getProcessSteps, getProjectsByIds } from "@/lib/data";
import { hasAdminSession } from "@/lib/dal";
import { splitAccent, stripAccent } from "@/lib/accent";
import { SITE_URL } from "@/lib/seo";

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

  const [clients, cases, testimonialProjects, processSteps] = await Promise.all([
    getClients(),
    getProjectsByIds(landing.caseProjectIds),
    getProjectsByIds(landing.testimonialProjectIds),
    getProcessSteps(),
  ]);
  const testimonials = testimonialProjects.filter((p) => p.quoteText);
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
              <Link href="/que-hacemos" className="transition hover:text-white">
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
              {cases.length > 0 && (
                <a
                  href="#casos"
                  className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white/80 transition hover:border-white hover:text-white"
                >
                  Ver casos ↓
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Marcas que confían */}
        <section className="relative z-10 px-6 sm:px-14 section-gap">
          <Reveal className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end sm:gap-16">
            <SectionHeading className="leading-tight">
              <AccentText text={landing.clientsTitle} />
            </SectionHeading>
            <p className="text-white/70">{landing.clientsBody}</p>
          </Reveal>
          {/* Mismo criterio que en la Home: -mx para que el marquee vaya de
              punta a punta sin unidades de viewport. */}
          <Reveal className="-mx-6 sm:-mx-14">
            <ClientsMarquee clients={clients} />
          </Reveal>
        </section>

        {/* Puntos de dolor */}
        {landing.painPoints.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="mb-12 max-w-2xl">
              <SectionHeading className="mb-4 leading-tight">
                <AccentText text={landing.painTitle} />
              </SectionHeading>
              <p className="text-lg text-white">{landing.painIntro}</p>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {landing.painPoints.map((point, i) => (
                <Reveal key={point.title} delay={Math.min(i * 0.08, 0.24)} className="rounded-3xl bg-card p-8">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                  <h3 className="mb-3 text-[22px] font-extrabold leading-snug text-white">{point.title}</h3>
                  <p className="text-white">{point.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Servicios */}
        {landing.services.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-16">
              <SectionHeading className="leading-tight">
                <AccentText text={landing.servicesTitle} />
              </SectionHeading>
              <p className="text-lg text-white">{landing.servicesIntro}</p>
            </Reveal>
            <ul className="mt-12 divide-y divide-white/10 border-t border-white/10">
              {landing.services.map((service, i) => (
                <Reveal
                  as="li"
                  key={service.title}
                  delay={Math.min(i * 0.05, 0.3)}
                  className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[320px_1fr_auto] sm:items-baseline sm:gap-10"
                >
                  <h3 className="flex gap-3 text-lg font-bold leading-snug text-white">
                    <span className="text-accent">→</span>
                    {service.title}
                  </h3>
                  <p className="leading-relaxed text-white">{service.body}</p>
                  {service.href && (
                    <Link
                      href={service.href}
                      className="whitespace-nowrap text-sm font-bold text-white/60 transition hover:text-white"
                    >
                      Ver más →
                    </Link>
                  )}
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* Casos */}
        {cases.length > 0 && (
          <section id="casos" className="scroll-mt-24 px-6 sm:px-14 section-gap">
            <Reveal className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <SectionEyebrow className="mb-3">Casos de éxito</SectionEyebrow>
                <SectionHeading className="mb-4 leading-tight">
                  <AccentText text={landing.casesTitle} />
                </SectionHeading>
                <p className="text-white">{landing.casesIntro}</p>
              </div>
              <Link href="/proyectos" className="shrink-0 text-sm font-bold text-white/70 transition hover:text-white">
                Ver todos los proyectos →
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((project, i) => (
                <Reveal key={project.id} delay={Math.min(i * 0.08, 0.24)}>
                  <CaseStudyCard project={project} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Metodología */}
        <section className="bg-card/40 px-6 py-20 text-center sm:px-14 section-gap">
          <Reveal>
            <SectionEyebrow className="mb-2">Metodología</SectionEyebrow>
            <SectionHeading className="mx-auto mb-4 max-w-3xl leading-tight">
              <AccentText text={landing.methodTitle} />
            </SectionHeading>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-white">{landing.methodIntro}</p>
            <ol className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {methodSteps.map((step, i) => (
                <li key={step.title} className="rounded-2xl bg-card p-6">
                  <h3 className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")} — {step.title}
                  </h3>
                  <p className="text-white">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* Growth partner */}
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

        {/* Testimonios: citas de los casos elegidos */}
        {testimonials.length > 0 && (
          <section className="px-6 sm:px-14 section-gap">
            <Reveal>
              <SectionHeading className="mb-10 leading-tight">
                <AccentText text={landing.testimonialsTitle} />
              </SectionHeading>
              <div className={`grid grid-cols-1 gap-10 ${testimonials.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {testimonials.map((project) => (
                  <figure key={project.id} className="border-l-2 border-accent pl-6">
                    <blockquote style={{ fontFamily: "var(--font-serif)" }}>
                      <p className="text-2xl italic leading-snug text-white sm:text-3xl">
                        &ldquo;{project.quoteText}&rdquo;
                      </p>
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-white/50">
                      — {project.quoteAuthor ?? project.clientName}
                      {" · "}
                      <Link href={`/proyectos/${project.slug}`} className="font-bold text-white/70 hover:text-white">
                        Ver el caso
                      </Link>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </section>
        )}

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

        <div className="bg-card/40 section-gap">
          <CtaSection eyebrow={landing.ctaEyebrow} titleLine1={cta.line1} titleAccent={cta.accent} body={landing.ctaBody} />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
