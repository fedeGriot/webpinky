import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// SVG queda deliberadamente afuera: es XML y puede contener <script>, que el
// navegador ejecuta si el archivo se abre directo (ej. /uploads/xxx.svg). El
// resto son formatos raster sin capacidad de ejecutar código.
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Identifica el tipo real de una imagen a partir de sus primeros bytes
 * (firma/"magic number"), en vez de confiar en `file.type`, que el cliente
 * controla por completo y puede declarar de forma falsa.
 */
function sniffImageType(buffer: Buffer): string | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (buffer.length >= 6 && (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a")) {
    return "image/gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

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

  const buffer = Buffer.from(await file.arrayBuffer());

  const realType = sniffImageType(buffer);
  if (!realType || realType !== file.type) {
    throw new Error("El archivo no es una imagen válida del tipo declarado.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = EXT_BY_TYPE[realType];
  const filename = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
