"use client";

import Link from "next/link";
import { useRef, useState } from "react";

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
  const [active, setActive] = useState(0);
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
    const cardWidth = track.scrollWidth / projects.length;
    setActive(Math.round(track.scrollLeft / cardWidth));
  }

  return (
    <div>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onScroll={onScroll}
        className="flex cursor-grab gap-6 overflow-x-auto pb-4 select-none [scrollbar-width:none] active:cursor-grabbing"
      >
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/proyectos/${project.slug}`}
            className="group relative flex w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card p-8 sm:w-[440px] sm:p-10"
            style={{ minHeight: 380 }}
          >
            {project.coverImageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImageUrl}
                  alt={project.clientName}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/75 to-card/30" />
              </>
            )}
            <div className="relative flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/40">
              <span>
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <span>{project.category}</span>
            </div>

            <h3 className="relative my-8 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {project.heroHeadline}
            </h3>

            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{project.clientName}</p>
                  <p className="text-sm text-white/50">{project.summary}</p>
                </div>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ background: project.accentColor }}
                >
                  ↗
                </span>
              </div>
              <div className="flex items-baseline gap-2 border-t border-white/10 pt-4">
                <span className="text-2xl font-extrabold text-accent">{project.resultBadge}</span>
                <span className="text-sm text-white/50">{project.resultLabel}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-white/40">
        <span>
          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <span>Arrastrá →</span>
      </div>
    </div>
  );
}
