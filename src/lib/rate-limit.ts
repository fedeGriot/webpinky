import "server-only";
import { headers } from "next/headers";

/**
 * Rate limiter en memoria: suficiente para una única instancia del servidor
 * (que es como corre este proyecto hoy). Si en el futuro se escala a más de
 * una instancia, esto debería moverse a un store compartido (ej. Redis).
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

// Evita que el Map crezca indefinidamente con keys viejas.
function cleanup(now: number) {
  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }
}

/**
 * Devuelve true si la acción identificada por `key` está permitida, y registra
 * el intento. Al superar `limit` intentos dentro de `windowMs`, devuelve false
 * hasta que la ventana expire.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (Math.random() < 0.01) cleanup(now);

  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}

/** IP del cliente a partir de los headers que setea el proxy (Railway, etc). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
