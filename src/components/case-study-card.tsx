import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";

type CaseProject = {
  slug: string;
  clientName: string;
  category: string;
  accentColor: string;
  coverImageListingUrl?: string | null;
  challengeTitle: string;
  solutionTitle: string;
  resultBadge?: string | null;
  resultLabel?: string | null;
  servicesTags: string[];
};

/**
 * Tarjeta de caso para las landings: la misma portada del listado de
 * proyectos, pero resumida como desafío → qué hicimos → resultado (lo que
 * pide la consultoría SEO), con los servicios involucrados y el link al caso.
 */
export function CaseStudyCard({ project }: { project: CaseProject }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="group flex h-full flex-col">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">{project.category}</p>
      <ProjectCover project={project} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />

      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-white">{project.clientName}</h3>
        {project.resultBadge && (
          <p className="shrink-0 text-right text-lg font-extrabold leading-tight text-accent">
            {project.resultBadge}
            {project.resultLabel && (
              <span className="block text-[11px] font-bold uppercase tracking-wide text-white/40">
                {project.resultLabel}
              </span>
            )}
          </p>
        )}
      </div>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-accent">Desafío</dt>
          <dd className="text-white">{project.challengeTitle}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-accent">Qué hicimos</dt>
          <dd className="text-white">{project.solutionTitle}</dd>
        </div>
      </dl>

      {project.servicesTags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.servicesTags.slice(0, 3).map((tag) => (
            <li key={tag} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/60">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-auto pt-5 text-sm font-bold text-white/70 transition group-hover:text-white">
        Ver caso completo →
      </span>
    </Link>
  );
}
