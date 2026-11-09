"use client";

import { useState } from "react";
import { inputClass, textareaClass } from "@/components/admin/form-styles";

export type ListField = { key: string; label: string; multiline?: boolean; placeholder?: string };
type Item = Record<string, string>;

/**
 * Lista editable de ítems con varios campos (puntos de dolor, servicios,
 * FAQs...): agregar, quitar y reordenar sin escribir JSON a mano. Todo viaja
 * en un input oculto `name` como JSON; la server action lo valida y limpia.
 */
export function ListEditor({
  name,
  fields,
  defaultItems = [],
  addLabel = "+ Agregar",
}: {
  name: string;
  fields: ListField[];
  defaultItems?: Item[];
  addLabel?: string;
}) {
  // La key estable evita que React reutilice inputs al reordenar o quitar.
  const [items, setItems] = useState(() => defaultItems.map((item) => ({ key: crypto.randomUUID(), item })));

  const update = (index: number, field: string, value: string) =>
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, item: { ...row.item, [field]: value } } : row)));
  const move = (index: number, delta: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  const remove = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const add = () => setItems((prev) => [...prev, { key: crypto.randomUUID(), item: {} }]);

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(items.map((row) => row.item))} />
      {items.map((row, i) => (
        <div key={row.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white/40">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex gap-1">
              <IconButton label="Subir" disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </IconButton>
              <IconButton label="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                ↓
              </IconButton>
              <IconButton label="Quitar" onClick={() => remove(i)}>
                ✕
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-white/50">{field.label}</span>
                {field.multiline ? (
                  <textarea
                    value={row.item[field.key] ?? ""}
                    onChange={(e) => update(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className={`${textareaClass} min-h-20 text-sm`}
                  />
                ) : (
                  <input
                    value={row.item[field.key] ?? ""}
                    onChange={(e) => update(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={`${inputClass} text-sm`}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-accent hover:text-white"
      >
        {addLabel}
      </button>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-xs text-white/60 transition hover:border-accent/50 hover:text-white disabled:opacity-30"
    >
      {children}
    </button>
  );
}
