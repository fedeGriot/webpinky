import { getTeamMembers } from "@/lib/data";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass } from "@/components/admin/form-styles";

export default async function EquipoPage() {
  const team = await getTeamMembers();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Equipo</h1>
      <p className="mb-8 text-white/50">Iniciales del equipo mostradas en ¿Quiénes somos?.</p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar integrante</h2>
        <form action={createTeamMember} className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Inicial</label>
            <input name="initial" maxLength={2} required className={`${inputClass} w-16`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nombre completo (opcional)</label>
            <input name="fullName" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Rol (opcional)</label>
            <input name="role" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Orden</label>
            <input name="order" type="number" defaultValue={team.length} className={`${inputClass} w-20`} />
          </div>
          <SaveButton label="Agregar" />
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {team.map((member) => (
          <form
            key={member.id}
            action={updateTeamMember}
            className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-card p-4"
          >
            <input type="hidden" name="id" value={member.id} />
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Inicial</label>
              <input name="initial" defaultValue={member.initial} maxLength={2} required className={`${inputClass} w-16`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Nombre completo</label>
              <input name="fullName" defaultValue={member.fullName ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Rol</label>
              <input name="role" defaultValue={member.role ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Orden</label>
              <input name="order" type="number" defaultValue={member.order} className={`${inputClass} w-20`} />
            </div>
            <SaveButton />
            <form action={deleteTeamMember}>
              <input type="hidden" name="id" value={member.id} />
              <DeleteButton confirmMessage={`¿Eliminar a "${member.initial}"?`} />
            </form>
          </form>
        ))}
      </div>
    </div>
  );
}
