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
          documento con un ResizeObserver y, al detectar un cambio, recalcula
          con un debounce de 250ms: eso se sentía como un salto al scrollear
          justo después de cargar (imágenes y fuentes terminando de cargar).

          naiveDimensions: true — sin autoResize, Lenis se quedaba con el
          alto del documento medido al montar y nunca lo actualizaba (ni
          siquiera al cambiar el tamaño de la ventana): si la página crecía
          después (abrir una pregunta frecuente, una imagen o un video que
          termina de cargar), la rueda del mouse se trababa en el alto viejo
          y solo se podía seguir con la barra de scroll. Con naiveDimensions
          el límite se lee del documento real en cada scroll, sin observers
          ni recálculos diferidos, así que no vuelve el salto. */}
      <ReactLenis key={pathname} root options={{ duration: 1.1, smoothWheel: true, autoResize: false, naiveDimensions: true }} />
      <LenisBridge />
    </>
  );
}
