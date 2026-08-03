import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { HeroRotator } from "@/components/home/hero-rotator";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { ServiceCard } from "@/components/service-card";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { FillButton } from "@/components/fill-button";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { SectionHeading } from "@/components/section-heading";
import {
  getHeroContent,
  getClients,
  getFeaturedProjects,
  getServices,
} from "@/lib/data";

// Sin título propio: la Home hereda el título/descripción por defecto del
// layout raíz (que ya son el nombre y la descripción del sitio).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, clients, projects, services] = await Promise.all([
    getHeroContent(),
    getClients(),
    getFeaturedProjects(),
    getServices(),
  ]);

  return (
    <>
      <SiteNav active="home" />
      <main>
        {/* Hero */}
        <section className="relative px-6 pb-20 pt-20 sm:px-14 sm:pt-24">
          <BackgroundShape shape="01" className="right-[-180px] top-[-40px] h-[680px] w-[680px] opacity-50" />
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-[15vw] font-extrabold leading-[0.96] tracking-[-0.03em] text-white sm:text-[80px] lg:text-[96px]">
              <span className="block">{hero?.titleLine1}</span>
              <span className="relative inline-block">
                {hero?.titleAccent}
                <span className="absolute -bottom-1 -left-1.5 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
              </span>{" "}
              <HeroRotator words={hero?.rotatingWords ?? []} />
            </h1>
            <p className="mt-8 max-w-xl text-lg text-white">{hero?.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <FillButton href="/proyectos" className="bg-accent px-7 py-4 text-sm">
                {hero?.ctaPrimaryLabel ?? "Ver proyectos →"}
              </FillButton>
              <Link
                href="/quienes-somos"
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white/80 transition hover:border-white hover:text-white"
              >
                {hero?.ctaSecondaryLabel ?? "Conocenos →"}
              </Link>
            </div>
          </div>
        </section>

        {/* Clientes */}
        {/* relative z-10: el blob del hero es position:absolute y por reglas de
            stacking de CSS pinta por encima del contenido normal de esta
            sección aunque esté "detrás" en el DOM; con z-10 esta sección pasa
            a tener su propio nivel de apilamiento por encima del blob. */}
        <section id="clientes" className="relative z-10 px-6 pt-16 sm:px-14">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading>
              Nuestros <span className="text-accent">clientes</span>
            </SectionHeading>
            <p className="text-sm text-white/50">
              +500 marcas · +15 años construyendo relaciones a largo plazo.
            </p>
          </Reveal>
          {/* -mx cancela el padding de la sección (px-6/sm:px-14) para que el
              marquee llegue de punta a punta de la pantalla, sin el corte que
              generaba ese margen a los costados. Se usa el padding del propio
              contenedor en vez de 100vw/w-screen a propósito: w-screen puede
              quedar unos px más ancho que el viewport real cuando hay
              scrollbar visible y generar scroll horizontal — este enfoque no
              toca unidades de viewport, así que no corre ese riesgo. */}
          <div className="-mx-6 sm:-mx-14">
            <ClientsMarquee clients={clients} />
          </div>
        </section>

        {/* Proyectos destacados */}
        <section className="px-6 sm:px-14 section-gap">
          {/* flex-col + sm:flex-row (no flex-wrap): que el botón "Ver todos"
              quede debajo del titular en mobile es un criterio fijo por
              breakpoint, no algo que dependa de si el texto de esta sección
              en particular alcanza a entrar al lado del título — con
              flex-wrap, dos secciones con textos de largo distinto podían
              quebrar en anchos de pantalla distintos y verse inconsistentes
              entre sí. */}
          <Reveal className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow className="mb-3">Trabajos Seleccionados</SectionEyebrow>
              <SectionHeading className="leading-tight">
                Casos que nos <span className="text-accent">enorgullecen</span>
              </SectionHeading>
            </div>
            <Link
              href="/proyectos"
              className="text-sm font-bold text-white/70 transition hover:text-white"
            >
              Ver todos los proyectos →
            </Link>
          </Reveal>
          <ProjectsCarousel projects={projects} />
        </section>

        {/* Servicios */}
        <section className="px-6 sm:px-14 section-gap">
          <Reveal className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionEyebrow className="mb-3">Servicios</SectionEyebrow>
              <SectionHeading className="leading-tight">
                ¿Qué <span className="relative inline-block text-accent">
                  hacemos?
                  <span className="absolute -bottom-1 left-0 right-0 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
                </span>
              </SectionHeading>
            </div>
            <Link
              href="/que-hacemos"
              className="text-sm font-bold text-white/70 transition hover:text-white"
            >
              Ver todos los servicios →
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.08}>
                <ServiceCard service={service} compact />
              </Reveal>
            ))}
          </div>
        </section>

        <CtaSection
          eyebrow="Estamos abiertos a nuevos proyectos"
          titleLine1="Hagamos que"
          titleAccent="tu marca crezca"
          spacingClassName="section-gap pb-24"
        />
      </main>
      <SiteFooter />
    </>
  );
}
