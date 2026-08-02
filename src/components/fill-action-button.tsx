import type { ButtonHTMLAttributes } from "react";

/**
 * Igual que FillButton pero para <button> (acciones de formulario, no
 * navegación): mismo efecto de relleno con el color oscuro al hacer hover.
 */
export function FillActionButton({
  className = "",
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`group relative isolate cursor-pointer overflow-hidden rounded-full font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {/* transform:scaleX() clásico, no la propiedad "scale" separada de
          Tailwind v4 — ver nota en fill-button.tsx. */}
      <span className="absolute inset-0 -z-10 origin-left [transform:scaleX(0)] bg-accent-dark transition-transform duration-300 ease-out group-hover:[transform:scaleX(1)] group-active:[transform:scaleX(1)]" />
      {children}
    </button>
  );
}
