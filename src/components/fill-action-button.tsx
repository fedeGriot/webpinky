import type { ButtonHTMLAttributes } from "react";

/**
 * Igual que FillButton pero para <button> (acciones de formulario, no
 * navegación): mismo efecto de relleno con el color oscuro al hacer hover.
 * Ver fill-button.tsx para la explicación de por qué usa un degradé animado
 * en vez de un span hijo con transform (ese enfoque se rompía en Chrome).
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
      className={`cursor-pointer rounded-full font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 [background-image:linear-gradient(to_right,var(--color-accent-dark)_50%,var(--color-accent)_50%)] [background-size:200%_100%] [background-position:100%_0] transition-[background-position] duration-300 ease-out hover:[background-position:0_0] active:[background-position:0_0] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
