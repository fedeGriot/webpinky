"use client";

import { useEffect, useRef } from "react";

export type VideoSource = { src: string; type: string };

/**
 * Video decorativo en loop (personajes, manchas del hero).
 *
 * Carga (auditoría SEO: los videos no tienen que competir con el contenido
 * principal):
 * - El póster (WebP liviano, primer cuadro del video) va en el HTML y se ve
 *   desde el primer pintado. No se puede hacer aparecer el video recién al
 *   final: el navegador lo toma como el elemento más grande en pantalla y el
 *   LCP se registra recién cuando aparece. Con el póster queda registrado
 *   temprano, y el paso al video es imperceptible (es el mismo cuadro).
 * - El video no baja nada hasta el evento `load` de la página; recién ahí se
 *   empieza a observar si está en pantalla. El src se asigna al entrar en
 *   pantalla (primer formato reproducible; versión chica si corresponde).
 * - Con prefers-reduced-motion, o si el navegador bloquea el autoplay (ej.
 *   modo de bajo consumo en iPhone), queda el póster quieto.
 *
 * Todos los videos se codificaron con el fondo oscurecido por debajo del de
 * la página; con mix-blend-mode: lighten, lo que no es dibujo muestra el
 * fondo real del sitio, sin recuadro.
 */
export function DecorativeVideo({
  sources,
  smallSources,
  preferSmall = false,
  poster,
  className = "",
  isolated = false,
}: {
  /** En orden de preferencia; se usa el primero que el navegador soporte. */
  sources: VideoSource[];
  /** Versión de menor resolución: en pantallas angostas o si preferSmall. */
  smallSources?: VideoSource[];
  /** Usar siempre la versión chica (ej. manchas casi transparentes). */
  preferSmall?: boolean;
  poster: string;
  className?: string;
  /**
   * El blend se resuelve contra lo que hay detrás dentro del mismo stacking
   * context: si un ancestro crea uno (z-index, opacity < 1, transform...), el
   * fondo es transparente y se ve el rectángulo oscuro del video. Con
   * isolated, el video va en un contenedor propio con fondo bg-ink, así el
   * resultado no depende de dónde esté ubicado. Solo para videos que no se
   * superponen con otro contenido (personajes): ese fondo es sólido.
   */
  isolated?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const start = () => {
      const useSmall = smallSources && (preferSmall || window.innerWidth < 768);
      const candidates = useSmall ? smallSources : sources;
      const playable = candidates.find((s) => video.canPlayType(s.type) !== "");
      if (!playable) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // El src recién al entrar en pantalla: una instancia oculta con
            // display:none (ej. la de mobile en desktop) nunca pide nada,
            // ni siquiera en Safari, que a veces ignora preload="none".
            if (!video.src) video.src = playable.src;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(video);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      observer?.disconnect();
    };
  }, [sources, smallSources, preferSmall]);

  const video = (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      className={`mix-blend-lighten ${isolated ? "h-full w-full object-contain" : className}`}
    />
  );

  return isolated ? <div className={`isolate bg-ink ${className}`}>{video}</div> : video;
}
