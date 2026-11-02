"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const TAGS = {
  div: "div",
  section: "section",
  article: "article",
  li: "li",
} as const;

/**
 * Fade + leve desplazamiento hacia arriba cuando el bloque entra en pantalla,
 * una sola vez.
 *
 * Lo que ya está en pantalla al cargar NO depende de JavaScript: el HTML
 * llega con la clase .reveal-intro (animación CSS, ver globals.css), que
 * arranca con el primer pintado. Antes todo arrancaba con opacity: 0 hasta
 * hidratar, y el contenido principal (portada de cada proyecto, título de
 * Contacto) no contaba como pintado hasta que cargaba el JS: LCP mobile de
 * 4–15 s en la auditoría SEO.
 *
 * Lo que está más abajo se oculta recién al montar (fuera de pantalla, nadie
 * lo ve) y se revela con un IntersectionObserver al entrar. Se maneja directo
 * sobre el DOM en vez de con estado: no re-renderiza nada.
 */
export function Reveal({
  children,
  className = "",
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

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // En pantalla (o ya scrolleado) al hidratar: la animación CSS ya lo cubre.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.animation = "none";
    el.style.opacity = "0";
    el.style.translate = "0 28px";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transition = `opacity 0.6s ${EASE} ${delay}s, translate 0.6s ${EASE} ${delay}s`;
        el.style.opacity = "";
        // Vuelve a "none" (no "0 0"): cualquier translate distinto de none
        // crea un containing block para descendientes position:fixed, y el
        // lightbox de video quedaba encerrado en el bloque.
        el.style.translate = "";
        observer.disconnect();
      },
      { rootMargin: "-80px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        elRef.current = node;
      }}
      id={id}
      className={`reveal-intro ${className}`}
      style={{ ...style, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
