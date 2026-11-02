import { DecorativeVideo } from "@/components/decorative-video";

const BLOB_COUNT = 5;

function randomBlob() {
  return Math.floor(Math.random() * BLOB_COUNT) + 1;
}

function sourcesFor(base: string) {
  return [
    { src: `${base}.webm`, type: "video/webm" },
    { src: `${base}.mp4`, type: "video/mp4" },
  ];
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
 *
 * Dos resoluciones: la nativa (hasta 1300px) para el hero de escritorio, donde
 * la mancha se ve grande y con puntos nítidos, y una de 960px para pantallas
 * angostas y para `subtle` (páginas donde va casi transparente).
 */
export function BackgroundShape({ className = "", subtle = false }: { className?: string; subtle?: boolean }) {
  const base = `/videos/manchas/mancha-${randomBlob()}`;
  return (
    <DecorativeVideo
      sources={sourcesFor(base)}
      smallSources={sourcesFor(`${base}-sm`)}
      preferSmall={subtle}
      poster={`${base}-sm.webp`}
      className={`shape-drift pointer-events-none absolute select-none object-contain ${className}`}
    />
  );
}
