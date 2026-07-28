"use client";

import { useFormStatus } from "react-dom";

export function SaveButton({ label = "Guardar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}
