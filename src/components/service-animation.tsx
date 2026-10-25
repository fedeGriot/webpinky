"use client";

import { useEffect, useRef } from "react";

// Fondo del video (~#2d2347, con ruido de compresión) vs. fondo del sitio
// (#2b2247): casi iguales pero no idénticos, así que los bordes se funden con
// un desvanecido en vez de cortar en seco. 6% queda por fuera del personaje
// (el recorte deja ~3-5% de margen); solo afecta los puntos del blob.
const EDGE_FADE =
  "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)";

/**
 * Animación decorativa de un servicio. Solo carga y reproduce mientras está
 * en pantalla (preload="none" + IntersectionObserver), para no bajar los seis
 * videos al entrar a la página. Con prefers-reduced-motion queda el póster.
 */
export function ServiceAnimation({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rechaza si el navegador bloquea el autoplay; el póster ya
          // cubre ese caso, no hace falta hacer nada.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
      style={{ maskImage: EDGE_FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    />
  );
}
