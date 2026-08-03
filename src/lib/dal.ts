import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { decrypt, getSessionCookieValue } from "@/lib/session";

export const verifySession = cache(async () => {
  const cookie = await getSessionCookieValue();
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/admin/login");
  }

  // El JWT de la cookie solo prueba que en algún momento se emitió una
  // sesión válida — no que el usuario siga existiendo. Sin este chequeo,
  // borrar un admin (ej. una cuenta comprometida) no invalida las sesiones
  // que ya tenía activas: seguirían funcionando hasta su expiración natural
  // (7 días). cache() asegura que esto corra una sola vez por request, no
  // en cada llamada a verifySession() dentro del mismo render.
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) {
    redirect("/admin/login");
  }

  return session;
});
