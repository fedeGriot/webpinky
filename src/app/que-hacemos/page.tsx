import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { StatCard } from "@/components/stat-card";
import { CtaSection } from "@/components/cta-section";
import { getServices, getProcessSteps, getStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "¿Qué hacemos? — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function QueHacemosPage() {
  const [services, processSteps, stats] = await Promise.all([
    getServices(),
    getProcessSteps(),
    getStats("services"),
  ]);

  return (
    <>
      <SiteNav />
      <main>
        <PageHeader
          eyebrow="¿Qué hacemos?"
          title={
            <>
              Todo lo que tu marca necesita, <span className="text-accent">bajo un techo.</span>
            </>
          }
          body="Combinamos estrategia, diseño, tecnología, data y creatividad bajo un mismo techo para crear campañas centradas en la audiencia, que venden y conectan. Desde la idea hasta la ejecución."
        />

        <section className="border-t border-white/[0.08] px-6 py-6 sm:px-14">
          <p className="max-w-2xl text-lg text-white/60">
            No somos otra agencia creativa. Somos{" "}
            <span className="font-bold text-white">socios de crecimiento</span> que combinan
            datos, creatividad y ejecución para que tu marca{" "}
            <span className="font-bold text-white">crezca, se vea y venda más.</span>
          </p>
        </section>

        <section className="px-6 py-16 sm:px-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} detailed />
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">
            Cómo trabajamos
          </p>
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Nuestro <span className="text-accent">proceso.</span>
          </h2>
          <p className="mb-10 max-w-xl text-white/60">
            Un método probado que aplicamos a cada proyecto. Simple en apariencia, riguroso en la
            ejecución.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={step.id} className="rounded-2xl border border-white/10 bg-card p-6">
                <p className="mb-3 text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-white/60">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">
            Lo que generamos
          </p>
          <h2 className="mb-10 text-3xl font-extrabold text-white sm:text-4xl">
            Resultados que <span className="text-accent">hablan.</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.id} value={stat.value} label={stat.label} sublabel={stat.sublabel} />
            ))}
          </div>
        </section>

        <CtaSection eyebrow="¿Empezamos?" titleLine1="Contanos tu próximo" titleAccent="desafío." />
      </main>
      <SiteFooter />
    </>
  );
}
