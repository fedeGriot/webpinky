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
    <Link href={href} className={`group relative isolate overflow-hidden rounded-full font-bold text-white ${className}`}>
      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent-dark transition-transform duration-300 ease-out group-hover:scale-x-100" />
      {children}
    </Link>
  );
}
