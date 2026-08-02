import Link from "next/link";
import { ServiceIcon } from "@/components/service-icon";

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
        className="group relative isolate flex items-start justify-between gap-4 overflow-hidden rounded-3xl bg-card p-6"
      >
        {/* transform:scaleX() clásico, no la propiedad "scale" separada de
            Tailwind v4 — ver nota en fill-button.tsx. */}
        <span className="absolute inset-0 -z-10 origin-left [transform:scaleX(0)] bg-accent/[0.08] transition-transform duration-500 ease-out group-hover:[transform:scaleX(1)] group-active:[transform:scaleX(1)]" />
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
      <p className="text-sm leading-relaxed text-white">{service.description}</p>
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
