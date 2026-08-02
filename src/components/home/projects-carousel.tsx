"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { staggerForRow } from "@/lib/stagger";
import { stripHtml } from "@/lib/rich-text";

type CarouselProject = {
  id: string;
  slug: string;
  category: string;
  heroHeadline: string;
  clientName: string;
  summary: string;
  resultBadge?: string | null;
  resultLabel?: string | null;
  accentColor: string;
  coverImageUrl?: string | null;
};

export function ProjectsCarousel({ projects }: { projects: CarouselProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const dragState = useRef<{ startX: number; scrollLeft: number; pointerDown: boolean; dragging: boolean; captured: boolean }>({
    startX: 0,
    scrollLeft: 0,
    pointerDown: false,
    dragging: false,
    captured: false,
  });

  // Umbral de movimiento antes de considerar el gesto un arrastre. Sin esto,
  // setPointerCapture se llamaba en TODO pointerdown con mouse, incluso en un
  // click simple sin mover el mouse — y una vez capturado el puntero, el click
  // resultante pasa a tener como target el propio track (el elemento que
  // capturó), no la tarjeta bajo el cursor. Como el track es ancestro del
  // <Link>, ese click nunca burbujeaba hasta el link y la navegación no
  // pasaba nunca al hacer click con mouse (en cualquier tarjeta, no solo las
  // pegadas a las flechas). Ahora solo se captura el puntero una vez que el
  // movimiento supera el umbral, o sea cuando realmente hay un arrastre.
  const DRAG_THRESHOLD = 4;

  function onPointerDown(e: React.PointerEvent) {
    // Solo mouse: en touch, capturar el puntero acá puede pisar el gesto de
    // scroll vertical de la página cuando arranca sobre el carrusel. El touch
    // ya tiene scroll horizontal nativo vía overflow-x-auto + touch-pan-x.
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, scrollLeft: track.scrollLeft, pointerDown: true, dragging: false, captured: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    const state = dragState.current;
    // "pointermove" se dispara con solo pasar el mouse por encima, sin botón
    // apretado — sin este chequeo, cualquier hover after-the-fact reusaba un
    // startX/scrollLeft viejo de la última vez que sí hubo un pointerdown y
    // "saltaba" el scroll solo, o dejaba dragging trabado en true para
    // siempre (nunca llega un pointerup real que lo apague) hasta el próximo
    // click, que recién ahí reinicia el estado.
    if (!track || !state.pointerDown) return;
    const delta = e.clientX - state.startX;
    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      state.dragging = true;
      track.setPointerCapture(e.pointerId);
      state.captured = true;
    }
    track.scrollLeft = state.scrollLeft - delta;
  }

  // pointercancel (no solo pointerup) tiene que limpiar el mismo estado: el
  // navegador lo dispara en vez de pointerup cuando decide que el gesto ya
  // no es un click/drag normal (por ejemplo al competir con un gesto propio
  // del trackpad) — sin este handler, ese caso nunca apagaba pointerDown y
  // el arrastre quedaba "pegado" al mouse hasta el próximo click.
  function endDrag(e: React.PointerEvent) {
    const state = dragState.current;
    if (state.captured) {
      trackRef.current?.releasePointerCapture(e.pointerId);
    }
    state.pointerDown = false;
    state.dragging = false;
    state.captured = false;
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
        {/* data-lenis-prevent-touch (no el genérico data-lenis-prevent): ese
            genérico bloqueaba a Lenis para TOUCH *y* WHEEL sobre este
            contenedor. Bloquear wheel era el problema en desktop: al pasar
            el mouse por encima mientras se scrollea la página, Lenis deja
            de manejar esos eventos, su posición interna se desincroniza de
            la real, y al volver a agarrar el control salta/se traba. Con la
            versión "-touch" eso solo pasa para gestos táctiles (donde sí
            hace falta, para no pisar el drag horizontal del carrusel), y el
            scroll con rueda de mouse sobre este módulo queda intacto.

            touch-auto (no touch-pan-x): pan-x le decía al navegador "un
            gesto que arranca acá SOLO puede ser scroll horizontal", así que
            un swipe vertical que arrancaba justo sobre una imagen del
            carrusel no lo tomaba ni el navegador (por el pan-x) ni Lenis
            (por el prevent) — no pasaba nada. Con touch-auto el navegador
            decide la dirección según el gesto real, como en cualquier
            carrusel horizontal dentro de una página con scroll vertical. */}
        <div
          ref={trackRef}
          data-lenis-prevent-touch
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onScroll={onScroll}
          className="flex touch-auto cursor-grab gap-6 overflow-x-auto pb-8 pt-8 select-none [scrollbar-width:none] active:cursor-grabbing"
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
                  <p className="line-clamp-2 text-sm text-white">{stripHtml(project.summary)}</p>
                </div>
                {(project.resultBadge || project.resultLabel) && (
                  <div className="shrink-0 text-right">
                    {project.resultBadge && (
                      <p className="text-xl font-extrabold text-accent">{project.resultBadge}</p>
                    )}
                    {project.resultLabel && (
                      <p className="text-xs uppercase text-white/50">{project.resultLabel}</p>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* clip-path recorta también el área de clic (no solo la pintura, a
            diferencia de rounded-full): sin esto, las esquinas cuadradas e
            invisibles del botón quedaban encima de la imagen del primer/
            tercer proyecto y se comían el clic pensado para la tarjeta. */}
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-[370px] z-10 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-lg text-white shadow-lg transition hover:bg-accent-dark sm:flex [clip-path:circle(50%)]"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-[370px] z-10 hidden h-11 w-11 translate-x-1/2 items-center justify-center rounded-full bg-accent text-lg text-white shadow-lg transition hover:bg-accent-dark sm:flex [clip-path:circle(50%)]"
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
