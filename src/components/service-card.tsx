import Link from "next/link";
import { ServiceIcon } from "@/components/service-icon";
import { RichTextContent } from "@/components/rich-text-content";

export type ServiceCardData = {
  slug: string;
  order: number;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
};

export function ServiceCard({
  service,
  detailed = false,
  compact = false,
}: {
  service: ServiceCardData;
  detailed?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link
        href={`/que-hacemos#${service.slug}`}
        className="flex items-start justify-between gap-4 rounded-3xl bg-card p-6 [background-image:linear-gradient(to_right,rgba(217,11,145,0.08)_50%,transparent_50%)] [background-size:200%_100%] [background-position:100%_0] transition-[background-position] duration-500 ease-out hover:[background-position:0_0] active:[background-position:0_0]"
      >
        {/* Degradé animado en vez de span+transform — ver nota en
            fill-button.tsx (ese enfoque se rompía en Chrome). rgba fija en
            vez de var(--color-accent) porque acá el color final necesita
            alpha (8%), y bg-card (background-color) sigue debajo sin
            conflicto: son propiedades CSS distintas. */}
        <div>
          <h3 className="text-lg font-extrabold leading-tight text-white">{service.title}.</h3>
          <p className="mt-2 text-sm font-bold text-accent">{service.tagline}</p>
        </div>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center">
          <ServiceIcon slug={service.slug} fallback={service.icon} className="h-[76px] w-[76px]" />
        </div>
      </Link>
    );
  }

  return (
    <article
      id={service.slug}
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold text-white/30">
            {String(service.order + 1).padStart(2, "0")}
          </p>
          <h3 className="text-2xl font-extrabold leading-tight text-white">{service.title}.</h3>
        </div>
        <div className="flex h-24 w-24 shrink-0 items-center justify-center">
          <ServiceIcon slug={service.slug} fallback={service.icon} className="h-20 w-20" />
        </div>
      </div>
      <p className="text-base font-bold text-accent">{service.tagline}</p>
      <RichTextContent html={service.description} className="text-sm leading-relaxed text-white" />
      <ul className="flex flex-col gap-2 text-sm text-white">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="text-accent">·</span>
            {bullet}
          </li>
        ))}
      </ul>
      {!detailed && (
        <Link
          href={`/que-hacemos#${service.slug}`}
          className="mt-2 text-sm font-bold text-accent hover:text-white"
        >
          Conocer más →
        </Link>
      )}
    </article>
  );
}
