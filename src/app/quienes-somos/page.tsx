import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CtaSection } from "@/components/cta-section";
import { BackgroundShape } from "@/components/background-shape";
import { TeamAvatar } from "@/components/team-avatar";
import { Reveal } from "@/components/reveal";
import { RichTextContent } from "@/components/rich-text-content";
import {
  getAboutContent,
  getStats,
  getValues,
  getTeamMembers,
  getClients,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "¿Quiénes somos?",
  description:
    "Desde 2010 acompañamos a más de 500 marcas a crecer. Conocé nuestra historia, cómo trabajamos, nuestro equipo y los clientes que confían en Pinky.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: { title: "¿Quiénes somos? — Pinky", url: "/quienes-somos" },
};

// mono: true convierte el logo a blanco sólido (brightness-0 invert), igual
// que los logos de clientes. La medalla de eCommerce Awards tiene textura y
// degradado propios (no es un logo plano de un solo color): forzarla a
// blanco sólido le haría perder el texto de la cinta y el relieve, así que
// se deja con su plateado original.
const AWARDS = [
  { name: "eCommerce Awards Uruguay 2022 — Ganador", logoUrl: "/premios/ecommerce-award.png", mono: false },
  { name: "IAB MIXX Awards", logoUrl: "/premios/iab-mixx-awards.png", mono: true },
  { name: "Cannes Lions — International Festival of Creativity", logoUrl: "/premios/cannes-lions.png", mono: true },
  { name: "Desachate 2012", logoUrl: "/premios/desachate-2012.png", mono: true },
];

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
        <section className="relative px-6 pb-7 pt-16 sm:px-14 sm:pt-20">
          <BackgroundShape shape="03" className="right-[-140px] top-[-40px] h-[600px] w-[600px] opacity-50" />
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
        <section className="relative z-10 px-6 sm:px-14 section-gap">
          <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-8 sm:gap-x-[150px]">
            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {highlightPhrase(about.growthTitle, "junto a")}
            </h2>
            <p className="leading-relaxed text-white">
              {withBold(about.growthBody, ["growth partner", "2010", "500 marcas"])}
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4 sm:divide-x sm:divide-white/10 sm:border-t-0 sm:pt-0"
          >
            {/* grid (no flex-nowrap + flex-1) en ambos breakpoints: con flex,
                "flex: 1 1 0%" solo reparte el espacio en partes iguales si el
                contenido lo permite — el min-width:auto por defecto de un
                flex item evita que se achique más allá de su propio
                contenido mínimo, así que el número más ancho (ej. "+550" en
                4xl/5xl bold) terminaba empujando su columna más ancha que
                las demás, sobre todo al rotar el celular a horizontal (ese
                ancho cruza el breakpoint sm: y pasa a este layout). Grid con
                columnas iguales no tiene ese problema: el ancho de columna
                no depende del contenido. */}
            {stats.map((stat) => (
              <div key={stat.id} className="sm:px-8 sm:first:pl-0">
                <p className="text-4xl font-extrabold text-accent sm:text-5xl">{stat.value}</p>
                <p className="mt-2 max-w-[11rem] text-sm text-white/60">
                  {stat.label} {stat.sublabel}
                </p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* Premios */}
        <section className="px-6 text-center sm:px-14 section-gap">
          <Reveal>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">Premios</p>
            <h2 className="mb-12 text-3xl font-extrabold text-white sm:text-4xl">
              Trabajo reconocido en la <span className="text-accent">industria.</span>
            </h2>
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-10">
              {AWARDS.map((award) => (
                <div key={award.name} className="flex h-24 w-40 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={award.logoUrl}
                    alt={award.name}
                    className={`max-h-full max-w-full object-contain ${award.mono ? "brightness-0 invert" : ""}`}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Cómo trabajamos */}
        <section className="bg-card/40 px-6 py-20 text-center sm:px-14 section-gap">
          <Reveal>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">¿Cómo trabajamos?</p>
            <h2 className="mb-12 text-3xl font-extrabold text-white sm:text-4xl">
              Sin discursos <span className="text-accent">vacíos</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            <Reveal className="rounded-3xl bg-card p-8">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h3 className="mb-3 text-[22px] font-extrabold text-white">Service-Centric</h3>
              <RichTextContent html={about.serviceCentricBody} className="text-white" />
            </Reveal>
            <Reveal delay={0.1} className="rounded-3xl bg-card p-8">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h3 className="mb-3 text-[22px] font-extrabold text-white">
                <span className="text-accent">Growth</span> Partner
              </h3>
              <RichTextContent html={about.growthPartnerBody} className="text-white" />
            </Reveal>
          </div>
        </section>

        {/* Valores */}
        <section className="px-6 sm:px-14 section-gap">
          <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Cosas en las que <span className="text-accent">creemos.</span>
            </h2>
            <p className="text-white">
              No son slogans ni frases de manual. Son los principios que guían cada decisión que
              tomamos con las marcas que confían en nosotros.
            </p>
          </Reveal>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {values.map((value, i) => (
              <Reveal
                key={value.id}
                delay={Math.min(i * 0.08, 0.32)}
                className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[280px_1fr] sm:gap-10"
              >
                <div className="flex gap-3">
                  <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-bold leading-snug text-white">{value.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white">{value.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className="px-6 text-center sm:px-14 section-gap">
          <Reveal>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">El equipo</p>
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
              Las personas detrás de <span className="text-accent">Pinky.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-white">
              Un equipo multidisciplinario que combina estrategia, creatividad, tecnología y pasión
              por las marcas que acompañamos. {team.length} personas, un solo propósito.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-8">
            {team.map((member, i) => (
              <Reveal
                key={member.id}
                delay={Math.min(i * 0.025, 0.45)}
                className={i % 2 === 0 ? "-translate-y-3" : "translate-y-3"}
              >
                <TeamAvatar
                  initial={member.initial}
                  index={i}
                  title={member.fullName ?? undefined}
                  photoUrl={member.photoUrl}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Clientes */}
        <div className="bg-card/40 section-gap">
          <section className="px-6 py-20 text-center sm:px-14">
            <Reveal>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-white/40">Clientes</p>
              <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                Marcas que confían en <span className="text-accent">nosotros.</span>
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-white">
                Desde retail y moda hasta tecnología y servicios financieros. Más de 500 marcas
                construyen su crecimiento con nosotros.
              </p>
            </Reveal>
            <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-14">
              {clients.map((client, i) => (
                <Reveal
                  key={client.id}
                  delay={Math.min(i * 0.025, 0.45)}
                  className="flex w-[calc((100%-48px)/2)] justify-center sm:w-[calc((100%-96px)/3)] lg:w-[calc((100%-144px)/4)]"
                >
                  <div className="flex h-16 w-[160px] items-center justify-center">
                    {client.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        className="h-full w-full object-contain brightness-0 invert opacity-70 transition hover:opacity-100"
                      />
                    ) : (
                      <span className="text-center text-sm font-extrabold uppercase tracking-tight text-white/60">
                        {client.name}
                      </span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <CtaSection eyebrow="¿Formamos equipo?" titleLine1="Hagamos que" titleAccent="tu marca crezca." />
        </div>
      </main>
      <SiteFooter variant="alt" />
    </>
  );
}
