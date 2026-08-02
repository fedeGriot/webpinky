"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAdminUser, type UserFormState } from "@/lib/actions/users";
import { inputClass, labelClass } from "@/components/admin/form-styles";
import { SaveButton } from "@/components/admin/save-button";

const initialState: UserFormState = undefined;

export function CreateUserForm() {
  const [state, formAction] = useActionState(createAdminUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6"
    >
      <h2 className="text-lg font-bold text-white">Crear usuario</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Email</label>
          <input name="email" type="email" required autoComplete="off" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Contraseña</label>
          <input name="password" type="password" required autoComplete="new-password" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Confirmar contraseña</label>
          <input name="confirmPassword" type="password" required autoComplete="new-password" className={inputClass} />
        </div>
      </div>

      {state?.error && <p className="rounded-lg bg-accent/15 px-3 py-2 text-sm text-accent">{state.error}</p>}
      {state?.success && (
        <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-400">Usuario creado con éxito.</p>
      )}

      <div>
        <SaveButton label="Crear usuario" />
      </div>
    </form>
  );
}
