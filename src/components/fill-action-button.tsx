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
      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent-dark transition-transform duration-300 ease-out group-hover:scale-x-100" />
      {children}
    </button>
  );
}
