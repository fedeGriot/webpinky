"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  section: motion.section,
} as const;

/**
 * Fade + leve desplazamiento hacia arriba cuando el bloque entra en pantalla.
 * `once: true` para que no se repita al volver a scrollear; respeta
 * prefers-reduced-motion vía la regla global en globals.css.
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
