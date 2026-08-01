import type { ReactNode } from "react";

/**
 * Texto cuya tipografía se "rellena" de color subiendo desde abajo al pasar
 * el mouse (requiere que el elemento contenedor tenga la clase "group").
 * Es una copia del texto superpuesta exactamente encima del original, con el
 * color de relleno, revelada con una máscara de degradado (.fill-hover-mask
 * en globals.css) — no una caja o fondo detrás del texto, el color sube
 * dentro de las propias letras.
 */
export function FillHoverText({
  children,
  fill = "white",
  className = "",
}: {
  children: ReactNode;
  fill?: "white" | "accent";
  className?: string;
}) {
  const fillColorClass = fill === "white" ? "text-white" : "text-accent";

  return (
    <span className={`relative inline-block ${className}`}>
      <span>{children}</span>
      <span aria-hidden="true" className={`fill-hover-mask pointer-events-none absolute inset-0 ${fillColorClass}`}>
        {children}
      </span>
    </span>
  );
}
