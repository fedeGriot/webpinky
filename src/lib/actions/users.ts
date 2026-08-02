"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

// Mismo costo de hash que usa prisma/seed.ts para el primer admin.
const BCRYPT_COST = 12;

const CreateUserSchema = z
  .object({
    email: z.email({ error: "Ingresá un email válido." }),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type UserFormState = { error?: string; success?: boolean } | undefined;

export async function createAdminUser(_state: UserFormState, formData: FormData): Promise<UserFormState> {
  await verifySession();

  const validated = CreateUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Revisá los datos ingresados." };
  }

  const { email, password } = validated.data;
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe un usuario con ese email." };
  }

  await prisma.adminUser.create({
    data: { email, passwordHash: await bcrypt.hash(password, BCRYPT_COST) },
  });

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function deleteAdminUser(formData: FormData) {
  const session = await verifySession();
  const id = String(formData.get("id") ?? "");

  if (id === session.userId) {
    throw new Error("No podés eliminar tu propio usuario mientras estás conectado con él.");
  }

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    throw new Error("Tiene que quedar al menos un usuario admin.");
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
}
