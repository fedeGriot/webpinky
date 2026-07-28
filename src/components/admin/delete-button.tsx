"use client";

export function DeleteButton({ confirmMessage = "¿Eliminar este elemento?" }: { confirmMessage?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:border-accent/50 hover:text-accent"
    >
      Eliminar
    </button>
  );
}
