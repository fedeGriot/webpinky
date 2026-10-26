"use client";

import { useEffect, useRef } from "react";

/**
 * Video decorativo en loop (personajes, manchas del hero). Solo carga y
 * reproduce mientras está en pantalla (preload="none" + IntersectionObserver),
 * para no bajar todos los videos al entrar a la página. Con
 * prefers-reduced-motion queda el póster.
 *
 * Todos los videos se codificaron con el fondo oscurecido por debajo del de
 * la página (ver scripts de encode); con mix-blend-mode: lighten, todo lo que
 * no es dibujo muestra el fondo real del sitio, sin recuadro, en cualquier
 * pantalla y gestión de color.
 */
export function DecorativeVideo({
  src,
  webmSrc,
  poster,
  className = "",
  isolated = false,
}: {
  /** MP4 (H.264): lo reproduce cualquier navegador. */
  src: string;
  /** VP9, más liviano a igual calidad; si está, se prefiere sobre el MP4. */
  webmSrc?: string;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rechaza si el navegador bloquea el autoplay (ej. modo de
          // bajo consumo en iPhone); el póster ya cubre ese caso.
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

  const video = (
    <video
      ref={ref}
      src={webmSrc ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={`mix-blend-lighten ${isolated ? "h-full w-full object-contain" : className}`}
    >
      {webmSrc && (
        <>
          <source src={webmSrc} type="video/webm" />
          <source src={src} type="video/mp4" />
        </>
      )}
    </video>
  );

  return isolated ? <div className={`isolate bg-ink ${className}`}>{video}</div> : video;
}
