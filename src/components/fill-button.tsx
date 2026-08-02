import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Botón pill con efecto de relleno: al hacer hover, una capa del color
 * oscuro actual (accent-dark) se desliza desde la izquierda y cubre todo el
 * botón, en vez de un simple cambio de color plano.
 *
 * `className` debe incluir el color base, el padding y el tamaño de texto
 * (varía según dónde se usa); este componente solo aporta la estructura del
 * efecto (relative/isolate/overflow-hidden/group) para que no haya conflictos
 * de especificidad entre clases de Tailwind.
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
      className={`group relative isolate overflow-hidden rounded-full font-bold text-white [transform:translateZ(0)] ${className}`}
    >
      {/* [transform:translateZ(0)] en el propio Link: fuerza a que ESTE
          elemento (el que tiene overflow-hidden + rounded-full) tenga su
          propia capa de composición GPU estable desde el principio. Sin
          esto, Chrome puede perder el recorte redondeado (el botón se ve
          como un rectángulo de esquinas cuadradas) apenas el span de abajo
          empieza a animarse y se promueve a su propia capa — un bug de
          compositing conocido de "overflow-hidden + border-radius + hijo
          con transform animado", confirmado en video por el cliente.

          transform:scaleX() clásico (vía valor arbitrario) en el span, no la
          propiedad "scale" separada que usa Tailwind v4 por defecto en
          scale-x-*: esa propiedad es más nueva y tiene menos soporte.
          group-active además de group-hover: en touch no hay hover real, sin
          esto el efecto no se veía nunca al tocar el botón en mobile. */}
      <span className="absolute inset-0 -z-10 origin-left [transform:scaleX(0)] bg-accent-dark transition-transform duration-300 ease-out group-hover:[transform:scaleX(1)] group-active:[transform:scaleX(1)]" />
      {children}
    </Link>
  );
}
