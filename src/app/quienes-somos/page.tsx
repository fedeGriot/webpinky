import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { CtaSection } from "@/components/cta-section";
import { ClientsMarquee } from "@/components/home/clients-marquee";
import {
  getAboutContent,
  getStats,
  getValues,
  getTeamMembers,
  getClients,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "¿Quiénes somos? — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

export default async function QuienesSomosPage() {
  const [about, stats, values, team, clients] = await Promise.all([
    getAboutContent(),
    getStats("about"),
    getValues(),
    getTeamMembers(),
    getClients(),
  ]);

  if (!about) return null;

  return (
    <>
      <SiteNav />
      <main>
        <PageHeader eyebrow="¿Quiénes somos?" title={about.heroTitle} body={about.heroBody} />

        <section className="px-6 py-16 sm:px-14">
          <h2 className="mb-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {about.growthTitle}
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/60">{about.growthBody}</p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.id} value={stat.value} label={stat.label} sublabel={stat.sublabel} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">Cómo trabajamos</p>
          <h2 className="mb-10 text-3xl font-extrabold text-white sm:text-4xl">
            Sin discursos <span className="text-accent">vacíos.</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-card p-8">
              <h3 className="mb-3 text-xl font-extrabold text-white">Service-Centric.</h3>
              <p className="text-white/60">{about.serviceCentricBody}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-8">
              <h3 className="mb-3 text-xl font-extrabold text-white">Growth Partner.</h3>
              <p className="text-white/60">{about.growthPartnerBody}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <h2 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
            Cosas en las que <span className="text-accent">creemos.</span>
          </h2>
          <p className="mb-10 max-w-xl text-white/60">
            No son slogans ni frases de manual. Son los principios que guían cada decisión que
            tomamos con las marcas que confían en nosotros.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <div key={value.id} className="rounded-2xl border border-white/10 bg-card p-6">
                <p className="mb-2 text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-2 text-lg font-bold text-white">{value.title}</h3>
                <p className="text-sm text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">El equipo</p>
          <h2 className="mb-10 text-3xl font-extrabold text-white sm:text-4xl">
            Las personas detrás de <span className="text-accent">Pinky.</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {team.map((member) => (
              <span
                key={member.id}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-lg font-bold text-white/70"
                title={member.fullName ?? undefined}
              >
                {member.initial}
              </span>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
          <h2 className="mb-8 text-3xl font-extrabold text-white sm:text-4xl">
            Marcas que confían en <span className="text-accent">nosotros.</span>
          </h2>
          <ClientsMarquee clients={clients} />
        </section>

        <CtaSection eyebrow="¿Te suena?" titleLine1="Hagamos que" titleAccent="tu marca crezca." />
      </main>
      <SiteFooter />
    </>
  );
}
