type ReorderAction = (formData: FormData) => void | Promise<void>;

/**
 * Dos flechas para mover un ítem un lugar arriba/abajo dentro de su lista
 * (piezas, stats) intercambiando su "order" con el vecino — así el admin no
 * tiene que escribir ni entender números de orden a mano.
 */
export function ReorderButtons({
  action,
  id,
  projectId,
  disableUp,
  disableDown,
}: {
  action: ReorderAction;
  id: string;
  projectId: string;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex gap-1">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="direction" value="up" />
        <button
          type="submit"
          disabled={disableUp}
          aria-label="Mover arriba"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-accent/50 hover:text-accent disabled:opacity-30"
        >
          ↑
        </button>
      </form>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="direction" value="down" />
        <button
          type="submit"
          disabled={disableDown}
          aria-label="Mover abajo"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-accent/50 hover:text-accent disabled:opacity-30"
        >
          ↓
        </button>
      </form>
    </div>
  );
}
