import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { MeetingForm } from "@/components/contacto/meeting-form";
import { Reveal } from "@/components/reveal";
import { ResultsSection } from "@/components/results-section";
import { SectionEyebrow } from "@/components/section-eyebrow";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contanos qué necesita tu marca y coordinamos una reunión. Trabajamos con empresas que buscan escalar ventas y mejorar su performance digital.",
  alternates: { canonical: "/contacto" },
  openGraph: { title: "Contacto — Pinky", url: "/contacto" },
};

// SiteNav/SiteFooter consultan la base (getSiteSettings). Sin esto, Next
// intenta pre-renderizar esta página en build time, y en Railway el volumen
// persistente (donde vive el SQLite de producción) recién se monta en
// runtime, no durante el build — mismo patrón que el resto de las páginas
// del sitio (ver README).
export const dynamic = "force-dynamic";

export default function ContactoPage() {
  return (
    <>
      <SiteNav active="contacto" />
      <main>
        <section className="relative overflow-hidden px-6 pt-16 sm:px-14 sm:pt-20">
          <BackgroundShape shape="08" className="right-[-140px] top-[-80px] h-[520px] w-[520px] opacity-10" />
          <div className="relative z-10 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            {/* Presentación */}
            <Reveal>
              <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
                Hablemos de tu{" "}
                <span className="relative inline-block text-accent">
                  próximo proyecto.
                  <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
                </span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-white">
                Trabajamos con empresas que buscan ordenar su estrategia de comunicación, escalar ventas
                o mejorar su performance digital.{" "}
                <span className="font-bold">Completá el formulario y coordinamos una reunión.</span>
              </p>
            </Reveal>

            {/* Formulario */}
            <Reveal delay={0.1}>
              <SectionEyebrow className="mb-2">Solicitar reunión</SectionEyebrow>
              <h2 className="mb-6 text-2xl font-extrabold text-white sm:text-3xl">
                Contanos sobre tu empresa <span className="text-accent">y sus necesidades.</span>
              </h2>
              <MeetingForm />
            </Reveal>
          </div>
        </section>

        <ResultsSection bottomPadding />
      </main>
      <SiteFooter />
    </>
  );
}
