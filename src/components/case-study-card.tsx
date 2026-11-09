import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";
import { VideoLightboxTrigger } from "@/components/video-lightbox";
import { getYouTubeId } from "@/lib/youtube";

type CaseProject = {
  slug: string;
  title: string;
  clientName: string;
  accentColor: string;
  coverImageListingUrl?: string | null;
  videoUrl?: string | null;
  challengeTitle: string;
  solutionTitle: string;
  resultBadge?: string | null;
  resultLabel?: string | null;
};

/**
 * Tarjeta de caso para las landings: la misma portada del listado de
 * proyectos, pero resumida como desafío → qué hicimos → resultado (lo que
 * pide la consultoría SEO), con el indicador del resultado y el link al caso.
 *
 * `showVideo` (portafolio, ej. Producción audiovisual): si el proyecto tiene
 * video de YouTube, la portada lleva el play que lo abre en el reproductor
 * del sitio, y el link al caso queda en el nombre y en "Ver caso completo".
 * Sin video, toda la tarjeta lleva al caso, como siempre.
 */
export function CaseStudyCard({ project, showVideo = false }: { project: CaseProject; showVideo?: boolean }) {
  const href = `/proyectos/${project.slug}`;
  const videoId = showVideo && project.videoUrl ? getYouTubeId(project.videoUrl) : null;
  const cover = <ProjectCover project={project} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />;
  const body = (
    <>
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

      <span className="mt-auto pt-5 text-sm font-bold text-white/70 transition group-hover:text-white">
        Ver caso completo →
      </span>
    </>
  );

  if (!videoId) {
    return (
      <Link href={href} className="group flex h-full flex-col">
        {cover}
        {body}
      </Link>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        {cover}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/20" />
        <VideoLightboxTrigger videoId={videoId} label={`Ver video — ${project.title}`} />
      </div>
      <Link href={href} className="group flex flex-1 flex-col">
        {body}
      </Link>
    </div>
  );
}
