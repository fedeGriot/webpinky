"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const TAGS = {
  div: "div",
  section: "section",
  article: "article",
  li: "li",
} as const;

/**
 * Fade + leve desplazamiento hacia arriba cuando el bloque entra en pantalla.
 * `once: true` (se desconecta el observer apenas dispara una vez) para que
 * no se repita al volver a scrollear.
 *
 * IntersectionObserver nativo en vez de `whileInView` de Framer Motion: la
 * versión anterior (basada en Framer) se quedaba permanentemente en su
 * estado `initial` (invisible) para cualquier bloque que requiriera scroll
 * para entrar en pantalla, en producción. No se pudo aislar con certeza si
 * la causa era Framer, una carrera con la hidratación de Next.js, o el
 * smooth-scroll de Lenis — así que en vez de perseguir esa causa exacta, se
 * sacó la dependencia del manejo interno de `whileInView` por completo.
 * Este observer es mínimo y se controla enteramente acá.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  as = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  as?: keyof typeof TAGS;
  id?: string;
}) {
  const Component = TAGS[as];
  const elRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        elRef.current = node;
      }}
      id={id}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 28px",
        transition: `opacity 0.6s ${EASE} ${delay}s, translate 0.6s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </Component>
  );
}
