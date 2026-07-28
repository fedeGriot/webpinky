import Link from "next/link";

export type ServiceCardData = {
  slug: string;
  order: number;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
};

export function ServiceCard({ service, detailed = false }: { service: ServiceCardData; detailed?: boolean }) {
  return (
    <article
      id={service.slug}
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card p-8"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{service.icon}</span>
        <span className="text-xs font-bold text-white/30">
          {String(service.order + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-2xl font-extrabold leading-tight text-white">{service.title}.</h3>
      <p className="text-base font-bold text-accent">{service.tagline}</p>
      <p className="text-sm leading-relaxed text-white/60">{service.description}</p>
      <ul className="flex flex-col gap-2 text-sm text-white/60">
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
