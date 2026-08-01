"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getLenis } from "@/components/smooth-scroll";
import { FillHoverText } from "@/components/fill-hover-text";

type NavLink = { href: string; label: string };

export function MobileNav({ links, active }: { links: NavLink[]; active?: string }) {
  const [open, setOpen] = useState(false);
  // El overlay se porta a document.body (ver más abajo) en vez de quedar
  // anidado dentro del header: dentro de un div propio con z-index, el
  // overlay "hereda" ese nivel de apilamiento como grupo — y si ese div
  // termina en una posición del DOM posterior al logo (aunque ambos tengan
  // el mismo z-index), el grupo entero pinta por encima igual, tapando el
  // logo. Portado directo a <body>, el overlay compite de igual a igual con
  // el header (que tiene z-50) sin esa ambigüedad de contextos anidados.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // El scroll suave de Lenis toma el control del wheel/touch del documento;
    // hay que pausarlo mientras el overlay a pantalla completa está abierto.
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
    };
  }, [open]);

  const overlay = (
    // z-40: el header (fuera de este árbol, portado a document.body) tiene
    // z-50, así que siempre queda por encima sin ningún cálculo de altura.
    <div
      className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* pt-24: deja lugar para el header (que se pinta encima, por su
          z-index más alto) antes de empezar a centrar el contenido.
          overflow-y-auto: en pantallas bajas (poca altura de viewport,
          landscape en celular, etc.) los 5 links con este tamaño de letra
          pueden no entrar en el alto disponible; sin esto quedaban
          directamente cortados arriba/abajo sin ninguna forma de
          scrollear hasta ellos. */}
      <nav className="flex h-full flex-col items-center justify-center gap-7 overflow-y-auto px-6 pb-8 pt-24">
        {links.map((link, i) => {
          const key = link.href === "/" ? "home" : link.href.replace("/", "");
          const isActive = active === key;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`group text-3xl font-extrabold transition-all duration-300 ${
                isActive ? "text-accent" : "text-white"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <FillHoverText fill={isActive ? "accent" : "white"}>{link.label}</FillHoverText>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px]"
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

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
