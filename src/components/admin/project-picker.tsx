"use client";

import { useState } from "react";
import { inputClass } from "@/components/admin/form-styles";

type Option = { id: string; label: string; hint?: string };

/**
 * Elegir elementos existentes (proyectos, testimonios) en un orden propio,
 * sin duplicar contenido: la landing guarda solo los IDs y muestra siempre
 * los datos actuales de cada uno. Viaja como JSON en el input oculto `name`.
 */
export function ProjectPicker({
  name,
  options,
  defaultIds = [],
  max,
  addLabel = "+ Agregar proyecto…",
}: {
  name: string;
  options: Option[];
  defaultIds?: string[];
  max?: number;
  addLabel?: string;
}) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const [ids, setIds] = useState(() => defaultIds.filter((id) => byId.has(id)));
  const available = options.filter((o) => !ids.includes(o.id));
  const full = max !== undefined && ids.length >= max;

  const move = (index: number, delta: -1 | 1) =>
    setIds((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={JSON.stringify(ids)} />
      {ids.length === 0 && <p className="text-sm text-white/40">Ninguno elegido: la sección no se muestra.</p>}
      {ids.map((id, i) => {
        const option = byId.get(id)!;
        return (
          <div key={id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
            <span className="text-xs font-bold text-white/40">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{option.label}</p>
              {option.hint && <p className="truncate text-xs text-white/40">{option.hint}</p>}
            </div>
            <div className="flex gap-1">
              {[
                { label: "Subir", text: "↑", disabled: i === 0, onClick: () => move(i, -1) },
                { label: "Bajar", text: "↓", disabled: i === ids.length - 1, onClick: () => move(i, 1) },
                { label: "Quitar", text: "✕", disabled: false, onClick: () => setIds((p) => p.filter((x) => x !== id)) },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  aria-label={b.label}
                  title={b.label}
                  disabled={b.disabled}
                  onClick={b.onClick}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-xs text-white/60 transition hover:border-accent/50 hover:text-white disabled:opacity-30"
                >
                  {b.text}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {!full && available.length > 0 && (
        <select
          value=""
          onChange={(e) => e.target.value && setIds((prev) => [...prev, e.target.value])}
          className={`${inputClass} text-sm`}
        >
          <option value="">{addLabel}</option>
          {available.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {full && <p className="text-xs text-white/40">Máximo {max}: quitá uno para agregar otro.</p>}
    </div>
  );
}
