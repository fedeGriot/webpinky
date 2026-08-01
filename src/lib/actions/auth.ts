"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

const LoginSchema = z.object({
  email: z.email({ error: "Ingresá un email válido." }),
  password: z.string().min(1, { error: "Ingresá tu contraseña." }),
});

export type LoginState = {
  error?: string;
} | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Revisá el email y la contraseña ingresados." };
  }

  const { email, password } = validated.data;

  // Limita intentos por IP y por email (en simultáneo) para frenar fuerza bruta,
  // sin depender de que el atacante repita la misma IP o el mismo email.
  const ip = await getClientIp();
  const allowedByIp = rateLimit(`login:ip:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  const allowedByEmail = rateLimit(`login:email:${email}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!allowedByIp || !allowedByEmail) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createSession(user.id, user.email);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
