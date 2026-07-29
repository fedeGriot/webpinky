import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CtaSection } from "@/components/cta-section";
import { DecorativeBlob } from "@/components/decorative-blob";
import { TeamAvatar } from "@/components/team-avatar";
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

function renderHeroTitle(title: string) {
  const words = title.trim().split(" ");
  const tailCount = Math.min(2, words.length);
  const head = words.slice(0, words.length - tailCount);
  const tail = words.slice(words.length - tailCount).join(" ");
  return (
    <>
      {head.map((word, i) => (
        <span key={i} className={/^\d{4}$/.test(word) ? "text-accent" : undefined}>
          {word}{" "}
        </span>
      ))}
      <span className="relative inline-block">
        {tail}
        <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
      </span>
    </>
  );
}

function highlightPhrase(text: string, phrase: string) {
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent">{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

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
      <SiteNav active="quienes-somos" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-16 sm:px-14 sm:pt-20">
          <DecorativeBlob className="right-[-140px] top-0 h-[460px] w-[460px] opacity-40" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              {renderHeroTitle(about.heroTitle)}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white">
              {withBold(about.heroBody, ["ADN digital"])}
            </p>
          </div>
        </section>

        {/* Growth + stats */}
        <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16">
            <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {highlightPhrase(about.growthTitle, "junto a")}
            </h2>
            <p className="leading-relaxed text-white">
              {withBold(about.growthBody, ["growth partner", "2010", "500 marcas"])}
            </p>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-8 border-t border-white/10 pt-10 sm:flex-nowrap sm:divide-x sm:divide-white/10 sm:border-t-0 sm:pt-0">
            {stats.map((stat) => (
              <div key={stat.id} className="basis-[45%] sm:basis-0 sm:flex-1 sm:px-8 sm:first:pl-0">
                <p className="text-4xl font-extrabold text-accent sm:text-5xl">{stat.value}</p>
                <p className="mt-2 max-w-[11rem] text-sm text-white/60">
                  {stat.label} {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="border-t border-white/[0.08] bg-card/40 px-6 py-20 text-center sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">Cómo trabajamos</p>
          <h2 className="mb-12 text-3xl font-extrabold text-white sm:text-4xl">
            Sin discursos <span className="text-accent">vacíos.</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-card p-8">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h3 className="mb-3 text-xl font-extrabold text-white">Service-Centric.</h3>
              <p className="text-white">{about.serviceCentricBody}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-8">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h3 className="mb-3 text-xl font-extrabold text-white">
                <span className="text-accent">Growth</span> Partner.
              </h3>
              <p className="text-white">{about.growthPartnerBody}</p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="border-t border-white/[0.08] px-6 py-20 sm:px-14">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Cosas en las que <span className="text-accent">creemos.</span>
            </h2>
            <p className="text-white">
              No son slogans ni frases de manual. Son los principios que guían cada decisión que
              tomamos con las marcas que confían en nosotros.
            </p>
          </div>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {values.map((value, i) => (
              <div
                key={value.id}
                className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[280px_1fr] sm:gap-10"
              >
                <div className="flex gap-3">
                  <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-bold leading-snug text-white">{value.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className="border-t border-white/[0.08] px-6 py-20 text-center sm:px-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">El equipo</p>
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Las personas detrás de <span className="text-accent">Pinky.</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-white">
            Un equipo multidisciplinario que combina estrategia, creatividad, tecnología y pasión
            por las marcas que acompañamos. {team.length} personas, un solo propósito.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-8">
            {team.map((member, i) => (
              <div key={member.id} className={i % 2 === 0 ? "-translate-y-3" : "translate-y-3"}>
                <TeamAvatar
                  initial={member.initial}
                  index={i}
                  title={member.fullName ?? undefined}
                  photoUrl={member.photoUrl}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Clientes */}
        <div className="bg-card/40">
          <section className="border-t border-white/[0.08] px-6 py-20 text-center sm:px-14">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">Clientes</p>
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
              Marcas que confían en <span className="text-accent">nosotros.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-white">
              Desde retail y moda hasta tecnología y servicios financieros. Más de 500 marcas
              construyen su crecimiento con nosotros.
            </p>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-12 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
              {clients.map((client) => (
                <div key={client.id} className="flex h-11 items-center justify-center">
                  {client.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="h-full max-w-[160px] object-contain brightness-0 invert opacity-70 transition hover:opacity-100"
                    />
                  ) : (
                    <span className="text-center text-sm font-extrabold uppercase tracking-tight text-white/60">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <CtaSection eyebrow="¿Te suena?" titleLine1="Hagamos que" titleAccent="tu marca crezca." />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
