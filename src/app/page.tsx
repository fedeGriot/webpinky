import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DecorativeBlob } from "@/components/decorative-blob";
import { HeroRotator } from "@/components/home/hero-rotator";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { ServiceCard } from "@/components/service-card";
import { CtaSection } from "@/components/cta-section";
import {
  getHeroContent,
  getClients,
  getFeaturedProjects,
  getServices,
} from "@/lib/data";

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
        <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:px-14 sm:pt-24">
          <DecorativeBlob className="right-[-140px] top-10 h-[620px] w-[620px] opacity-40" />
          <DecorativeBlob className="left-[-200px] bottom-[-180px] h-[500px] w-[500px] opacity-25" />
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
              <Link
                href="/proyectos"
                className="rounded-full bg-accent px-7 py-4 text-sm font-bold text-white transition hover:bg-accent-dark"
              >
                {hero?.ctaPrimaryLabel ?? "Ver proyectos"}
              </Link>
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
        <section id="clientes" className="border-y border-white/[0.08] px-6 py-16 sm:px-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Nuestros <span className="text-accent">clientes.</span>
            </h2>
            <p className="text-sm text-white/50">
              +500 marcas · +15 años construyendo relaciones a largo plazo.
            </p>
          </div>
          <ClientsMarquee clients={clients} />
        </section>

        {/* Proyectos destacados */}
        <section className="px-6 py-24 sm:px-14">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/40">
                Trabajos · Seleccionados
              </p>
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Casos que nos <span className="text-accent">enorgullecen.</span>
              </h2>
            </div>
            <Link
              href="/proyectos"
              className="text-sm font-bold text-white/70 transition hover:text-white"
            >
              Ver todos los proyectos →
            </Link>
          </div>
          <ProjectsCarousel projects={projects} />
        </section>

        {/* Servicios */}
        <section className="border-t border-white/[0.08] px-6 pb-0 pt-24 sm:px-14">
          <div className="mb-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/40">
              — Servicios
            </p>
            <Link href="/que-hacemos" className="group inline-flex items-center gap-3">
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                ¿Qué <span className="relative inline-block text-accent">
                  hacemos?
                  <span className="absolute -bottom-1 left-0 right-0 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
                </span>
              </h2>
              <span className="text-2xl text-accent transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} compact />
            ))}
          </div>
        </section>

        <CtaSection
          eyebrow="Estamos abiertos a nuevos proyectos"
          titleLine1="Hagamos que"
          titleAccent="tu marca crezca."
          spacingClassName="pt-[100px] pb-[100px]"
        />
      </main>
      <SiteFooter />
    </>
  );
}
