"use client";

import { useState } from "react";
import { LANDING_SECTIONS, type LandingSectionKey } from "@/lib/landing-sections";

/**
 * Orden de las secciones de una landing (entre el hero y el contacto), con
 * flechas para subir y bajar. Viaja como JSON en el input oculto `name`.
 */
export function SectionOrder({ name, defaultOrder }: { name: string; defaultOrder: LandingSectionKey[] }) {
  const [order, setOrder] = useState(defaultOrder);
  const move = (index: number, delta: -1 | 1) =>
    setOrder((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  return (
    <ol className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={JSON.stringify(order)} />
      {order.map((key, i) => (
        <li key={key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="text-xs font-bold text-white/40">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1 text-sm font-semibold text-white">{LANDING_SECTIONS[key]}</span>
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
      ))}
    </ol>
  );
}
