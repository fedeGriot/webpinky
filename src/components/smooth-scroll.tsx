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
      <ReactLenis key={pathname} root options={{ duration: 1.1, smoothWheel: true }} />
      <LenisBridge />
    </>
  );
}
