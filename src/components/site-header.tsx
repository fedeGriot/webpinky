"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getLenis } from "@/components/smooth-scroll";
import { SOCIAL_ICONS } from "@/components/social-icons";

type NavLink = { href: string; label: string };
type SocialLink = { label: string; href: string };

/**
 * Header completo (no solo el botón hamburguesa): logo, CTA "Hablemos" y el
 * menú mobile viven en un solo componente cliente porque necesitan compartir
 * el mismo estado `open` — el logo y el CTA se ocultan en mobile mientras el
 * menú está abierto (pedido explícito: "que aparezca siempre sin el logo,
 * que se ocupe pantalla completa"), y eso no se puede coordinar si el estado
 * vive en un componente hijo aparte sin que los hermanos se enteren.
 */
export function SiteHeader({
  links,
  active,
  social = [],
  logo,
  cta,
  desktopNav,
}: {
  links: NavLink[];
  active?: string;
  social?: SocialLink[];
  logo: React.ReactNode;
  cta: React.ReactNode;
  desktopNav: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      // overflow:hidden en <body> no alcanza para bloquear el scroll de
      // fondo en iOS Safari (bug conocido: igual deja scrollear con el
      // dedo) — eso era la causa real de que el header con el logo
      // apareciera "a veces sí, a veces no" al scrollear con el menú
      // abierto: el scroll de fondo SÍ pasaba, y el header sticky quedaba
      // en una posición inconsistente según cuánto se hubiera movido. Fijar
      // el body en su lugar (position:fixed + top negativo) bloquea el
      // scroll de fondo de verdad en todos los navegadores, y al cerrar se
      // restaura exactamente la misma posición.
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      getLenis()?.stop();
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      const restoredY = top ? -parseInt(top, 10) : 0;
      const lenis = getLenis();
      lenis?.start();
      // Restaurar con lenis.scrollTo (no window.scrollTo a secas): Lenis
      // guarda su propia posición interna de scroll aparte de la nativa del
      // navegador, y start() la reafirma — un window.scrollTo de este lado
      // quedaba pisado apenas Lenis volvía a tomar el control, y el scroll
      // terminaba saltando de nuevo a 0 en vez de quedarse donde estaba.
      if (lenis) lenis.scrollTo(restoredY, { immediate: true });
      else window.scrollTo(0, restoredY);
    }
    // Sin cleanup que repita esta misma limpieza: React la corre ANTES de
    // cada nueva ejecución del efecto (no solo al desmontar), así que
    // pisaba document.body.style.top con "" justo antes de que la rama de
    // arriba (open === false) llegara a leerlo — restoredY quedaba siempre
    // en 0. La propia rama de cierre ya deja todo restaurado; no hace falta
    // duplicarlo acá.
  }, [open]);

  // Solo aplica en mobile (abajo de lg:, donde vive el botón hamburguesa) y
  // solo mientras el menú está abierto — en desktop el logo y el CTA
  // siempre quedan visibles sin importar este estado. opacity (no
  // display:none) para que no haya un salto de layout al abrir/cerrar: el
  // botón hamburguesa se mantiene en la misma posición siempre.
  const hideWhileOpen = open ? "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100" : "";

  const overlay = (
    // z-40: el header (fuera de este árbol, portado a document.body) tiene
    // z-50, así que siempre queda por encima sin ningún cálculo de altura.
    <div
      className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* pt-24: dejar lugar para la altura del header (el botón hamburguesa
          se pinta encima, por su z-index más alto) — la altura del header no
          cambia al abrir/cerrar (logo/CTA se ocultan con opacity, no
          display:none), así que este valor es válido en los dos estados.
          overflow-y-auto: en pantallas bajas (poca altura de viewport,
          landscape en celular, etc.) los 5 links con este tamaño de letra
          pueden no entrar en el alto disponible; sin esto quedaban
          directamente cortados arriba/abajo sin ninguna forma de
          scrollear hasta ellos. */}
      <nav className="flex h-full flex-col items-start justify-center gap-7 overflow-y-auto px-8 pb-8 pt-24 sm:px-14">
        {links.map((link, i) => {
          const key = link.href === "/" ? "home" : link.href.replace("/", "");
          const isActive = active === key;
          const color = isActive ? "text-accent" : "text-white";
          // Orden de aparición invertido (el último item entra primero) +
          // translate-y-4 (en vez de -y): junto con el desplazamiento hacia
          // abajo del panel completo (ver overlay arriba), esto hace que el
          // menú se sienta como que "sube" desde abajo en vez de caer desde
          // arriba — pedido explícito del cliente.
          const delayIndex = links.length - 1 - i;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`group relative inline-flex flex-col transition-all duration-300 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${delayIndex * 40}ms` : "0ms" }}
            >
              <span className="flex items-baseline gap-3 text-3xl font-extrabold">
                <span className={color}>→</span>
                <span className={color}>{link.label}</span>
              </span>
              {/* transform:scaleX() clásico, no la propiedad "scale" que usa
                  Tailwind v4 por defecto — ver nota en fill-button.tsx. */}
              <span className="mt-2 h-[2px] w-full origin-left [transform:scaleX(0)] bg-accent transition-transform duration-300 ease-out group-active:[transform:scaleX(1)]" />
            </Link>
          );
        })}

        {social.length > 0 && (
          <div
            className={`mt-4 flex items-center gap-4 transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "0ms" : "0ms" }}
          >
            {social.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition active:border-accent active:text-accent"
                >
                  {Icon && <Icon className="h-[18px] w-[18px]" />}
                </a>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b bg-ink px-6 py-4 transition-colors duration-300 sm:px-14 ${
        open ? "border-transparent" : "border-white/[0.08]"
      }`}
    >
      <div className={hideWhileOpen}>{logo}</div>

      {desktopNav}

      <div className="flex shrink-0 items-center gap-3">
        <div className={hideWhileOpen}>{cta}</div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 rounded-full bg-white transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[2px] w-6 rounded-full bg-white transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {mounted && createPortal(overlay, document.body)}
    </header>
  );
}
