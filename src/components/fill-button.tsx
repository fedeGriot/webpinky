import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Botón pill con efecto de relleno: al hacer hover, el color oscuro actual
 * (accent-dark) se desliza desde la izquierda y cubre todo el botón, en vez
 * de un simple cambio de color plano.
 *
 * Implementación: un degradé de dos colores con un corte duro al 50% (el
 * doble de ancho del botón) que se anima moviendo su `background-position`
 * de derecha a izquierda — NO un `<span>` hijo con `transform` recortado por
 * `overflow-hidden`. Esa versión anterior se rompía en Chrome: el navegador
 * puede perder el recorte redondeado del contenedor (el botón se veía como
 * un rectángulo de esquinas cuadradas) apenas el hijo animado se promovía a
 * su propia capa de GPU — confirmado en video por el cliente, persistente
 * incluso forzando una capa estable con translateZ(0). Un fondo (background)
 * no tiene ese problema: el navegador siempre lo recorta de forma nativa y
 * confiable al `border-radius` del propio elemento, sin capas ni hijos.
 *
 * `className` debe incluir el color base (ya no se usa visualmente ya que el
 * degradé cubre todo el botón siempre, pero no molesta dejarlo), el padding
 * y el tamaño de texto (varía según dónde se usa).
 */
export function FillButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full font-bold text-white [background-image:linear-gradient(to_right,var(--color-accent-dark)_50%,var(--color-accent)_50%)] [background-size:200%_100%] [background-position:100%_0] transition-[background-position] duration-300 ease-out hover:[background-position:0_0] active:[background-position:0_0] ${className}`}
    >
      {children}
    </Link>
  );
}
