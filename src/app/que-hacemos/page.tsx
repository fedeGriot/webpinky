import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DecorativeBlob } from "@/components/decorative-blob";
import { ServiceIcon } from "@/components/service-icon";
import { CtaSection } from "@/components/cta-section";
import { getServices, getProcessSteps, getStats, getAboutContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "¿Qué hacemos? — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

function withBold(text: string, phrases: string[]) {
  if (phrases.length === 0) return text;
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(pattern).map((chunk, i) =>
    phrases.includes(chunk) ? (
      <strong key={i} className="font-bold text-white">
        {chunk}
      </strong>
    ) : (
      chunk
    ),
  );
}

function colorLastWord(title: string) {
  const words = title.trim().split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")}
      {words.length ? " " : ""}
      <span className="text-accent">{last}.</span>
    </>
  );
}

function splitStep(title: string) {
  const [tag, headline] = title.split(" — ");
  return { tag: tag ?? title, headline: headline ?? "" };
}

function colorLastWordAsIs(text: string) {
  const words = text.trim().split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")}
      {words.length ? " " : ""}
      <span className="text-accent">{last}</span>
    </>
  );
}

export default async function QueHacemosPage() {
  const [services, processSteps, stats, about] = await Promise.all([
    getServices(),
    getProcessSteps(),
    getStats("services"),
    getAboutContent(),
  ]);

  return (
    <>
      <SiteNav active="que-hacemos" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-16 sm:px-14 sm:pt-20">
          <DecorativeBlob className="right-[-140px] top-0 h-[460px] w-[460px] opacity-40" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Todo lo que tu marca necesita,{" "}
              <span className="relative inline-block text-accent">
                bajo un techo.
                <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
              </span>
            </h1>
            {about && (
              <p className="mt-6 max-w-xl text-lg text-white">
                {withBold(about.heroBody, ["ADN digital"])}
              </p>
            )}
          </div>
        </section>

        {/* Statement */}
        <section className="border-t border-white/[0.08] px-6 py-14 text-center sm:px-14">
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white">
            No somos otra agencia creativa. Somos{" "}
            <span className="font-bold text-white">socios de crecimiento</span> que combinan
            datos, creatividad y ejecución para que tu marca{" "}
            <span className="font-bold text-accent">crezca, se vea y venda más.</span>
          </p>
        </section>

        {/* Servicios en detalle */}
        <section className="border-t border-white/[0.08] px-6 sm:px-14">
          <div className="divide-y divide-white/10">
            {services.map((service, i) => (
              <div
                key={service.slug}
                id={service.slug}
                className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-[48px_1fr_360px] sm:items-center sm:gap-10"
              >
                <p className="text-2xl font-extrabold text-accent sm:self-start">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">
                    — {service.tagline}
                  </p>
                  <h3 className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {colorLastWord(service.title)}
                  </h3>
                  <p className="mb-6 max-w-2xl text-lg leading-relaxed text-white">
                    {service.description}
                  </p>
                  <ul className="divide-y divide-dashed divide-white/15 text-base text-white">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 py-3">
                        <span className="text-accent">→</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex h-56 w-56 items-center justify-center rounded-full bg-card sm:h-[340px] sm:w-[340px]">
                    <ServiceIcon
                      slug={service.slug}
                      fallback={service.icon}
                      variant="accent"
                      className="h-32 w-32 sm:h-[190px] sm:w-[190px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="border-t border-white/[0.08] bg-card/40 px-6 py-20 text-center sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">
            Cómo trabajamos
          </p>
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Sin discursos <span className="text-accent">vacíos.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-white">
            Un método probado que aplicamos a cada proyecto. Simple en apariencia, riguroso en la
            ejecución.
          </p>
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => {
              const { tag, headline } = splitStep(step.title);
              return (
                <div key={step.id} className="rounded-2xl border border-white/10 bg-card p-6">
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")} — {tag}
                  </span>
                  <h3 className="mb-2 text-2xl font-bold text-white">{colorLastWordAsIs(headline)}</h3>
                  <p className="text-sm text-white">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Resultados */}
        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">
            Lo que generamos
          </p>
          <h2 className="mb-12 text-3xl font-extrabold text-white sm:text-4xl">
            Resultados que <span className="text-accent">hablan.</span>
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
            {stats.map((stat) => (
              <div key={stat.id} className="sm:px-8 sm:first:pl-0">
                <p className="text-4xl font-extrabold text-accent sm:text-5xl">{stat.value}</p>
                <p className="mt-2 font-bold text-white">{stat.label}</p>
                {stat.sublabel && <p className="mt-1 text-sm text-white/60">{stat.sublabel}</p>}
              </div>
            ))}
          </div>
        </section>

        <div className="bg-card/40">
          <CtaSection eyebrow="¿Empezamos?" titleLine1="Contanos tu próximo" titleAccent="desafío." />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
