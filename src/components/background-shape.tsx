import { DecorativeVideo } from "@/components/decorative-video";

const BLOB_COUNT = 5;

function randomBlob() {
  return Math.floor(Math.random() * BLOB_COUNT) + 1;
}

/**
 * Mancha animada de fondo para los heros. Se elige una de las 5 al azar en
 * cada render (las páginas son force-dynamic, así que cambia por visita).
 *
 * El fondo de los videos se oscureció por debajo del de la página en los tres
 * canales; con mix-blend-mode: lighten queda el fondo real del sitio en todo
 * lo que no es mancha, aunque el video sea un rectángulo que sangra por
 * fuera de la sección. object-contain: los videos no son cuadrados, y las
 * bandas que deja contain también desaparecen con el blend.
 */
export function BackgroundShape({ className = "" }: { className?: string }) {
  const n = randomBlob();
  return (
    <DecorativeVideo
      src={`/videos/manchas/mancha-${n}.mp4`}
      webmSrc={`/videos/manchas/mancha-${n}.webm`}
      poster={`/videos/manchas/mancha-${n}.jpg`}
      className={`shape-drift pointer-events-none absolute select-none object-contain ${className}`}
    />
  );
}
