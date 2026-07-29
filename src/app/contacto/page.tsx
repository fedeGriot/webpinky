import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DecorativeBlob } from "@/components/decorative-blob";
import { MailIcon, PhoneIcon, PinIcon, SOCIAL_ICONS } from "@/components/social-icons";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto — Pinky",
};

// Renderizado dinámico: el contenido viene del CMS y debe reflejarse sin rebuild.
export const dynamic = "force-dynamic";

const toTel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default async function ContactoPage() {
  const settings = await getSiteSettings();

  const social = settings
    ? [
        { label: "Instagram", href: settings.instagramUrl },
        { label: "LinkedIn", href: settings.linkedinUrl },
        { label: "YouTube", href: settings.youtubeUrl },
        { label: "X / Twitter", href: settings.twitterUrl },
      ].filter((s) => s.href)
    : [];

  return (
    <>
      <SiteNav active="contacto" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-16 sm:px-14 sm:pt-20">
          <DecorativeBlob className="right-[-140px] top-0 h-[460px] w-[460px] opacity-40" />
          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">Contacto</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Hablemos de tu{" "}
              <span className="relative inline-block text-accent">
                próximo proyecto.
                <span className="absolute -bottom-1 -left-1 -right-2 -z-10 h-2.5 -rotate-1 rounded-full bg-accent/90" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white">
              Contanos qué necesita tu marca. Te respondemos en menos de 24 horas hábiles.
            </p>
            {settings && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${settings.email}?subject=Quiero%20hablar%20con%20Pinky`}
                  className="rounded-full bg-accent px-7 py-4 text-sm font-bold text-white transition hover:bg-accent-dark"
                >
                  Escribinos por mail →
                </a>
                <a
                  href={toTel(settings.phone1)}
                  className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white/80 transition hover:border-white hover:text-white"
                >
                  Llamanos
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Datos de contacto */}
        {settings && (
          <section className="border-t border-white/[0.08] px-6 py-16 sm:px-14">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <MailIcon className="h-5 w-5" />
                </span>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-white/40">Email</p>
                <a href={`mailto:${settings.email}`} className="font-semibold text-white hover:text-accent">
                  {settings.email}
                </a>
              </div>

              <div>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-white/40">Teléfono</p>
                <div className="flex flex-col gap-1">
                  <a href={toTel(settings.phone1)} className="font-semibold text-white hover:text-accent">
                    {settings.phone1}
                  </a>
                  {settings.phone2 && (
                    <a href={toTel(settings.phone2)} className="font-semibold text-white hover:text-accent">
                      {settings.phone2}
                    </a>
                  )}
                </div>
              </div>

              <div>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <PinIcon className="h-5 w-5" />
                </span>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-white/40">Dirección</p>
                <p className="font-semibold text-white">{settings.address}</p>
              </div>

              {social.length > 0 && (
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-wide text-white/40">Seguinos</p>
                  <div className="flex items-center gap-3">
                    {social.map((s) => {
                      const Icon = SOCIAL_ICONS[s.label];
                      return (
                        <a
                          key={s.label}
                          href={s.href!}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.label}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-accent hover:text-white"
                        >
                          {Icon && <Icon className="h-5 w-5" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
