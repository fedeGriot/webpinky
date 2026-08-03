import type { ReactNode } from "react";

/**
 * Título de sección (h2) con el tamaño/peso fijo usado en todo el sitio.
 * `tone` cubre las dos superficies donde aparece: "white" para las
 * secciones de fondo oscuro (la mayoría) y "ink" para la lámina clara de
 * la ficha de proyecto. `className` es para overrides de spacing/leading,
 * no para volver a declarar tamaño/peso/color.
 */
export function SectionHeading({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "ink";
}) {
  return (
    <h2 className={`text-3xl font-extrabold sm:text-4xl ${tone === "white" ? "text-white" : "text-ink"} ${className}`}>
      {children}
    </h2>
  );
}
