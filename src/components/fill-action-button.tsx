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
      className={`group relative isolate cursor-pointer overflow-hidden rounded-full font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 [transform:translateZ(0)] ${className}`}
      {...props}
    >
      {/* [transform:translateZ(0)] + transform:scaleX() clásico — ver nota
          en fill-button.tsx (fix de un bug de compositing de Chrome que
          hacía perder el border-radius al animarse). */}
      <span className="absolute inset-0 -z-10 origin-left [transform:scaleX(0)] bg-accent-dark transition-transform duration-300 ease-out group-hover:[transform:scaleX(1)] group-active:[transform:scaleX(1)]" />
      {children}
    </button>
  );
}
