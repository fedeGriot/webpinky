"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Permite a otros componentes (ej. el menú mobile a pantalla completa)
 * pausar el scroll suave mientras tienen su propio scroll/overlay. */
export function getLenis() {
  return lenisInstance;
}

function LenisBridge() {
  // useLenis() (del propio paquete) se suscribe de forma reactiva al momento
  // exacto en que Lenis termina de crearse. La implementación anterior leía
  // lenisRef.current.lenis a mano dentro de un efecto atado a [enabled,
  // pathname]: en ese instante Lenis todavía no existía (se crea en un
  // efecto posterior, propio de la librería) y nada volvía a disparar ese
  // efecto para releer el ref ya actualizado — getLenis() quedaba en null
  // para siempre. Por eso el resize() en cambios de paso del formulario
  // (y el stop()/start() del menú mobile) nunca hacían nada.
  const lenis = useLenis();
  useEffect(() => {
    lenisInstance = lenis ?? null;
    return () => {
      lenisInstance = null;
    };
  }, [lenis]);
  return null;
}

export function SmoothScroll() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;

  // key={pathname}: recargar la página siempre "arreglaba" el scroll trabado
  // porque una recarga crea una instancia de Lenis nueva, medida contra el
  // documento ya definitivo. En navegación interna, en cambio, se reutilizaba
  // la MISMA instancia entre páginas, y su recálculo de tamaño (aunque se
  // dispara automático) queda momentáneamente desfasado contra el layout de
  // la página anterior. Recrearla en cada ruta replica el mismo camino
  // (instancia nueva, recién medida) que una recarga, de forma determinística.
  return (
    <>
      {/* autoResize: false — por defecto Lenis observa el tamaño del
          documento con un ResizeObserver (debounce de 250ms) y, cuando
          detecta un cambio, fuerza animatedScroll = actualScroll,
          descartando de golpe el suavizado en curso. Esto se sentía como
          un salto al scrollear, sobre todo justo después de cargar la
          página (imágenes terminando de decodificar, fuentes haciendo
          swap) — exactamente cuando alguien hace su primer scroll. El
          único lugar que necesita recalcular el alto dinámicamente (el
          paso del formulario de contacto) ya llama a getLenis()?.resize()
          a mano, así que no depende de este auto-resize. El resize por
          cambio de ancho de ventana sigue funcionando aparte (no depende
          de esta opción). */}
      <ReactLenis key={pathname} root options={{ duration: 1.1, smoothWheel: true, autoResize: false }} />
      <LenisBridge />
    </>
  );
}
