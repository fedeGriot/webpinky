"use client";

// Página temporal, sin linkear desde ningún lado del sitio — solo para
// comparar en vivo 4 opciones de tratamiento para el menú hamburguesa de
// mobile (efecto de texto + efecto al tap + íconos de redes). Borrar una vez
// que se elija una opción.

import { useState } from "react";
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/components/social-icons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/quienes-somos", label: "¿Quiénes somos?" },
  { href: "/que-hacemos", label: "¿Qué hacemos?" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

const SOCIALS = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "LinkedIn", Icon: LinkedInIcon },
  { label: "YouTube", Icon: YouTubeIcon },
];

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[28px] border-4 border-white/15 bg-ink shadow-2xl">
        {children}
      </div>
      <p className="max-w-[300px] text-center text-xs text-white/40">{label}</p>
    </div>
  );
}

function PhoneHeader({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
      <span className="text-lg font-extrabold text-white">
        pinky<span className="text-accent">.</span>
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
      >
        <span className={`h-[2px] w-5 rounded-full bg-white transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`h-[2px] w-5 rounded-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`h-[2px] w-5 rounded-full bg-white transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>
    </div>
  );
}

/* ---------- Opción A: relleno rápido + ripple al tocar ---------- */

function RippleLink({
  href,
  label,
  isActive,
  delay,
  open,
}: {
  href: string;
  label: string;
  isActive: boolean;
  delay: number;
  open: boolean;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function addRipple(e: React.PointerEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 500);
  }

  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      onPointerDown={addRipple}
      className={`group relative isolate block overflow-hidden rounded-lg px-1 py-0.5 text-2xl font-extrabold transition-all duration-300 ${
        isActive ? "text-accent" : "text-white"
      } ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
    >
      <span className="relative inline-block">
        <span>{label}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-accent opacity-0 transition-opacity duration-150 group-active:opacity-100"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 100%)",
          }}
        >
          {label}
        </span>
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-accent/30"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
            animation: "menu-ripple 500ms ease-out forwards",
          }}
        />
      ))}
    </a>
  );
}

function OptionA() {
  const [open, setOpen] = useState(false);
  return (
    <PhoneFrame label="A · Relleno rápido (0.15s) + ripple táctil al tocar. Sutil, casi imperceptible salvo el toque.">
      <style>{`@keyframes menu-ripple { to { width: 140px; height: 140px; opacity: 0; } }`}</style>
      <PhoneHeader open={open} onToggle={() => setOpen((v) => !v)} />
      <div
        className={`absolute inset-x-0 bottom-0 top-[57px] flex flex-col items-center justify-center gap-6 bg-ink transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((link, i) => (
          <RippleLink key={link.href} href={link.href} label={link.label} isActive={i === 0} delay={i * 40} open={open} />
        ))}
        <div className={`mt-4 flex items-center gap-4 transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ transitionDelay: open ? "220ms" : "0ms" }}>
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 transition active:border-accent active:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ---------- Opción B: subrayado deslizante + escala al presionar ---------- */

function OptionB() {
  const [open, setOpen] = useState(false);
  return (
    <PhoneFrame label="B · Al presionar, el texto se achica un poco (feedback táctil) y un subrayado de acento entra deslizando.">
      <PhoneHeader open={open} onToggle={() => setOpen((v) => !v)} />
      <div
        className={`absolute inset-x-0 bottom-0 top-[57px] flex flex-col items-center justify-center gap-6 bg-ink transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => e.preventDefault()}
            className={`relative inline-block text-2xl font-extrabold text-white transition-all duration-300 active:scale-[0.94] ${
              i === 0 ? "text-accent" : "text-white"
            } ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-accent transition-transform duration-200 [transition-delay:0ms] active:scale-x-100" />
          </a>
        ))}
        <div className={`mt-4 flex items-center gap-4 transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ transitionDelay: open ? "220ms" : "0ms" }}>
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 transition active:scale-90 active:border-accent active:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ---------- Opción C: píldora de fondo (mismo lenguaje que las choice cards del form de contacto) ---------- */

function OptionC() {
  const [open, setOpen] = useState(false);
  return (
    <PhoneFrame label="C · Píldora de fondo al presionar — mismo lenguaje visual que las tarjetas de opciones del formulario de contacto.">
      <PhoneHeader open={open} onToggle={() => setOpen((v) => !v)} />
      <div
        className={`absolute inset-x-0 bottom-0 top-[57px] flex flex-col items-center justify-center gap-3 bg-ink px-8 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => e.preventDefault()}
            className={`w-full rounded-2xl px-5 py-3 text-center text-xl font-extrabold text-white transition-all duration-300 active:bg-accent/15 active:text-accent ${
              i === 0 ? "bg-accent/10 text-accent" : ""
            } ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            {link.label}
          </a>
        ))}
        <div className={`mt-4 flex items-center gap-3 transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ transitionDelay: open ? "220ms" : "0ms" }}>
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition active:border-accent active:bg-accent/15 active:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ---------- Opción D: editorial numerado (inspirado en el trazo grueso/editorial de referencias tipo Buffalo) ---------- */

function OptionD() {
  const [open, setOpen] = useState(false);
  return (
    <PhoneFrame label="D · Numerado y editorial (línea inspirada en la referencia): barra de acento que barre al presionar, redes como texto.">
      <PhoneHeader open={open} onToggle={() => setOpen((v) => !v)} />
      <div
        className={`absolute inset-x-0 bottom-0 top-[57px] flex flex-col justify-center gap-5 bg-ink px-7 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => e.preventDefault()}
            className={`group relative block transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-bold text-white/30 transition-colors group-active:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-xl font-extrabold leading-tight ${i === 0 ? "text-accent" : "text-white"}`}>
                {link.label}
              </span>
            </div>
            <span className="mt-1.5 block h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-active:scale-x-100" />
          </a>
        ))}
        <div
          className={`mt-5 flex items-center gap-4 border-t border-white/10 pt-5 transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          style={{ transitionDelay: open ? "220ms" : "0ms" }}
        >
          {SOCIALS.map(({ label }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="relative text-xs font-bold uppercase tracking-wide text-white/50 transition-colors active:text-accent"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export default function DemoMenuMobilePage() {
  return (
    <div className="min-h-screen bg-ink px-6 py-16 sm:px-14">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">Demo interna — no linkeada</p>
        <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">Opciones para el menú mobile</h1>
        <p className="mb-12 max-w-2xl text-white/60">
          Tocá el ícono de hamburguesa en cada teléfono para abrir el menú, y tocá/mantené presionado sobre un link
          para ver el efecto de tap. Las 4 opciones comparten la misma estructura (links + redes), lo que cambia es el
          tratamiento del texto y la respuesta al toque.
        </p>
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <OptionA />
          <OptionB />
          <OptionC />
          <OptionD />
        </div>
      </div>
    </div>
  );
}
