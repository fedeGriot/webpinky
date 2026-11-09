"use client";

import { useState } from "react";
import { LANDING_SECTIONS, type LandingSectionKey } from "@/lib/landing-sections";

/**
 * Orden de las secciones de una landing (entre el hero y el contacto), con
 * flechas para subir y bajar y una casilla para mostrar u ocultar cada una.
 * El orden y las ocultas viajan como JSON en dos inputs ocultos.
 */
export function SectionOrder({
  name,
  hiddenName,
  defaultOrder,
  defaultHidden,
}: {
  name: string;
  hiddenName: string;
  defaultOrder: LandingSectionKey[];
  defaultHidden: LandingSectionKey[];
}) {
  const [order, setOrder] = useState(defaultOrder);
  const [hidden, setHidden] = useState(defaultHidden);
  const move = (index: number, delta: -1 | 1) =>
    setOrder((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  const toggle = (key: LandingSectionKey) =>
    setHidden((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <ol className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={JSON.stringify(order)} />
      <input type="hidden" name={hiddenName} value={JSON.stringify(hidden)} />
      {order.map((key, i) => {
        const visible = !hidden.includes(key);
        return (
          <li
            key={key}
            className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-2 ${
              visible ? "bg-white/[0.03]" : "bg-transparent opacity-50"
            }`}
          >
            <input
              type="checkbox"
              checked={visible}
              onChange={() => toggle(key)}
              aria-label={`Mostrar ${LANDING_SECTIONS[key]}`}
              className="h-4 w-4"
            />
            <span className="flex-1 text-sm font-semibold text-white">
              {LANDING_SECTIONS[key]}
              {!visible && <span className="ml-2 text-xs font-normal text-white/50">(oculta)</span>}
            </span>
            {[
              { label: "Subir", text: "↑", disabled: i === 0, delta: -1 as const },
              { label: "Bajar", text: "↓", disabled: i === order.length - 1, delta: 1 as const },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-label={`${b.label} ${LANDING_SECTIONS[key]}`}
                title={b.label}
                disabled={b.disabled}
                onClick={() => move(i, b.delta)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-xs text-white/60 transition hover:border-accent/50 hover:text-white disabled:opacity-30"
              >
                {b.text}
              </button>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
