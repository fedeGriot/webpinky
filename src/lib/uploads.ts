import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Guarda un archivo subido en public/uploads y devuelve su URL pública.
 * Aislado en un módulo propio para poder cambiar a S3/Cloudinary/Vercel Blob
 * más adelante sin tocar las server actions que lo llaman.
 */
export async function saveUploadedFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Tipo de archivo no permitido: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("El archivo supera el tamaño máximo permitido (8MB).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = EXT_BY_TYPE[file.type] ?? "bin";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
