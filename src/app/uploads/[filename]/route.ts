import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { UPLOAD_DIR, mimeTypeForUploadedFilename } from "@/lib/uploads";

/**
 * Sirve los archivos subidos por el CMS (guardados en UPLOAD_DIR, fuera de
 * public/ — ver src/lib/uploads.ts). mimeTypeForUploadedFilename valida el
 * nombre contra el patrón exacto que genera saveUploadedFile antes de armar
 * cualquier ruta de filesystem, así que `filename` nunca llega a path.join
 * sin haber sido chequeado (nada de "..", separadores, etc.).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  const mimeType = mimeTypeForUploadedFilename(filename);
  if (!mimeType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(path.join(UPLOAD_DIR, filename));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        // Nombre con UUID aleatorio: el contenido de una URL dada nunca cambia.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
