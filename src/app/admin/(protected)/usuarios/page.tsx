import { verifySession } from "@/lib/dal";
import { getAdminUsers } from "@/lib/data";
import { deleteAdminUser } from "@/lib/actions/users";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { DeleteButton } from "@/components/admin/delete-button";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-UY", { dateStyle: "medium" }).format(date);
}

export default async function UsuariosPage() {
  const session = await verifySession();
  const users = await getAdminUsers();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Usuarios</h1>
      <p className="mb-8 text-white/50">Quién puede entrar a este panel de administración.</p>

      <div className="mb-8 flex flex-col gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-card p-4"
          >
            <div>
              <p className="font-semibold text-white">
                {user.email}
                {user.id === session.userId && (
                  <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                    Vos
                  </span>
                )}
              </p>
              <p className="text-xs text-white/40">Creado el {formatDate(user.createdAt)}</p>
            </div>
            {user.id !== session.userId && users.length > 1 && (
              <form action={deleteAdminUser}>
                <input type="hidden" name="id" value={user.id} />
                <DeleteButton confirmMessage={`¿Eliminar el usuario ${user.email}?`} />
              </form>
            )}
          </div>
        ))}
      </div>

      <CreateUserForm />
    </div>
  );
}
