"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
} as const;

/**
 * Fade + leve desplazamiento hacia arriba cuando el bloque entra en pantalla.
 * `once: true` para que no se repita al volver a scrollear.
 *
 * La regla global de prefers-reduced-motion en globals.css fuerza duraciones
 * CSS casi nulas, pero Framer Motion interpola estos valores directamente en
 * JS (no pasa por `transition`/`animation` de CSS), así que esa regla no
 * alcanza a esta animación — se chequea `useReducedMotion()` acá para
 * mostrar el contenido directo, sin fade ni desplazamiento, cuando el
 * usuario lo prefiere.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof TAGS;
  id?: string;
}) {
  const Component = TAGS[as];
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
