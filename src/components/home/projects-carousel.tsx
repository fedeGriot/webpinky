"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { staggerForRow } from "@/lib/stagger";

type CarouselProject = {
  id: string;
  slug: string;
  category: string;
  heroHeadline: string;
  clientName: string;
  summary: string;
  resultBadge: string;
  resultLabel: string;
  accentColor: string;
  coverImageUrl?: string | null;
};

export function ProjectsCarousel({ projects }: { projects: CarouselProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const dragState = useRef<{ startX: number; scrollLeft: number; dragging: boolean }>({
    startX: 0,
    scrollLeft: 0,
    dragging: false,
  });

  function onPointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, scrollLeft: track.scrollLeft, dragging: true };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    track.scrollLeft = dragState.current.scrollLeft - delta;
  }

  function onPointerUp() {
    dragState.current.dragging = false;
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 0);
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.scrollWidth / projects.length;
    track.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
  }

  const active = Math.round(progress * (projects.length - 1));

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onScroll={onScroll}
          className="flex cursor-grab gap-6 overflow-x-auto pb-8 pt-8 select-none [scrollbar-width:none] active:cursor-grabbing"
        >
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/proyectos/${project.slug}`}
              className={`group w-[82vw] shrink-0 sm:w-[380px] ${staggerForRow(project.id)}`}
            >
              <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/40">
                <span>
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <span>{project.category}</span>
              </div>

              <div
                className="relative aspect-[9/16] overflow-hidden rounded-3xl"
                style={
                  project.coverImageUrl
                    ? undefined
                    : { background: `linear-gradient(150deg, ${project.accentColor}, ${project.accentColor}99)` }
                }
              >
                {project.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.coverImageUrl}
                    alt={project.clientName}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage: "radial-gradient(#fff 1.2px, transparent 1.2px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-white">{project.clientName}</p>
                  <p className="line-clamp-2 text-sm text-white">{project.summary}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xl font-extrabold text-accent">{project.resultBadge}</p>
                  <p className="text-xs uppercase text-white/50">{project.resultLabel}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-[370px] z-10 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-lg text-white shadow-lg transition hover:bg-accent-dark sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-[370px] z-10 hidden h-11 w-11 translate-x-1/2 items-center justify-center rounded-full bg-accent text-lg text-white shadow-lg transition hover:bg-accent-dark sm:flex"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="shrink-0 text-sm text-white/40">
          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-white/10">
          <div
            className="h-px bg-accent transition-[width]"
            style={{ width: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>
        <span className="shrink-0 text-sm text-white/40">Arrastrá →</span>
      </div>
    </div>
  );
}
