import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BackgroundShape } from "@/components/background-shape";
import { ResultsSection } from "@/components/results-section";

export const metadata: Metadata = {
  title: "¡Gracias!",
  description: "Recibimos tu solicitud de reunión. Te vamos a contactar a la brevedad.",
  robots: { index: false, follow: true },
};

// Ver nota en src/app/contacto/page.tsx: SiteNav/SiteFooter consultan la
// base, y en build time (Railway) el volumen persistente todavía no está
// montado.
export const dynamic = "force-dynamic";

export default function GraciasPage() {
  return (
    <>
      <SiteNav active="contacto" />
      <main>
        <section className="relative overflow-hidden px-6 py-24 sm:px-14 sm:py-32">
          <BackgroundShape shape="08" className="right-[-140px] top-[-80px] h-[520px] w-[520px] opacity-10" />
          <div className="relative z-10 mx-auto max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Solicitud recibida</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              ¡Listo, recibimos tu solicitud!
            </h1>
            <p className="mt-6 text-lg text-white/70">
              Te vamos a contactar a la brevedad para coordinar la reunión.
            </p>
            <Link
              href="/"
              className="mt-10 inline-block rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white/70 transition hover:border-white hover:text-white"
            >
              ← Volver al inicio
            </Link>
          </div>
        </section>

        <ResultsSection />
      </main>
      <SiteFooter />
    </>
  );
}
