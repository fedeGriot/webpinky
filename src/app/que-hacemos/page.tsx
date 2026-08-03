import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { ServiceIcon } from "@/components/service-icon";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { RichTextContent } from "@/components/rich-text-content";
import { ResultsSection } from "@/components/results-section";
import { getServices, getProcessSteps, getAboutContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "¿Qué hacemos?",
  description:
    "Estrategia, creatividad, performance, branding, producción audiovisual y tecnología: todos los servicios de Pinky bajo un mismo techo para hacer crecer tu marca.",
  alternates: { canonical: "/que-hacemos" },
  openGraph: { title: "¿Qué hacemos? — Pinky", url: "/que-hacemos" },
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin
// rebuild — además, <ResultsSection> abajo elige 3 stats al azar en cada
// visita, y eso necesita recalcularse en cada request, no solo en build.
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
  const [services, processSteps, about] = await Promise.all([
    getServices(),
    getProcessSteps(),
    getAboutContent(),
  ]);

  return (
    <>
      <SiteNav active="que-hacemos" />
      <main>
        {/* Hero */}
        <section className="relative px-6 pt-16 sm:px-14 sm:pt-20">
          <BackgroundShape shape="02" className="right-[-140px] top-[-60px] h-[600px] w-[600px] opacity-50" />
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
        <section className="relative z-10 px-6 text-center sm:px-14 section-gap">
          <Reveal>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white">
              No somos otra agencia creativa. Somos{" "}
              <span className="font-bold text-white">socios de crecimiento</span> que combinan
              datos, creatividad y ejecución para que tu marca{" "}
              <span className="font-bold text-accent">crezca, se vea y venda más.</span>
            </p>
          </Reveal>
        </section>

        {/* Servicios en detalle */}
        <section className="px-6 sm:px-14">
          <h2 className="sr-only">Servicios en detalle</h2>
          <div className="divide-y divide-white/10">
            {services.map((service, i) => (
              <Reveal
                as="article"
                key={service.slug}
                id={service.slug}
                delay={Math.min(i * 0.05, 0.2)}
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
                  <RichTextContent html={service.description} className="mb-6 max-w-2xl text-lg leading-relaxed text-white" />
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
                  <ServiceIcon
                    iconUrl={service.iconUrl}
                    iconAccentUrl={service.iconAccentUrl}
                    fallback={service.icon}
                    variant="accent"
                    className="h-[169px] w-[169px] sm:h-[251px] sm:w-[251px]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="bg-card/40 px-6 py-20 text-center sm:px-14">
          <Reveal>
            <h2 className="mx-auto mb-12 max-w-2xl leading-snug text-white">
              <span className="block text-xl font-normal leading-relaxed text-white">
                Un método probado que aplicamos a cada proyecto.
              </span>
              <span className="mt-2 block text-2xl font-bold sm:text-3xl">
                Simple en apariencia, <span className="text-accent">riguroso en la ejecución.</span>
              </span>
            </h2>
            <ol className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => {
                const { tag, headline } = splitStep(step.title);
                return (
                  <li key={step.id} className="rounded-2xl bg-card p-6">
                    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                      {String(i + 1).padStart(2, "0")} — {tag}
                    </span>
                    <h3 className="mb-2 text-2xl font-bold text-white">{colorLastWordAsIs(headline)}</h3>
                    <p className="text-sm text-white">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </section>

        <ResultsSection />

        <div className="bg-card/40 section-gap">
          <CtaSection eyebrow="¿Empezamos?" titleLine1="Contanos tu próximo" titleAccent="desafío." />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
