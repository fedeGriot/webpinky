"use client";

import { useState, type ChangeEvent } from "react";
import { ACCEPTED_IMAGE_TYPES, formatKB, formatSize, type ImageSpec } from "@/lib/image-specs";

export type ImageCheck = { level: "ok" | "warn" | "error"; text: string };

/**
 * Revisa la imagen elegida contra la medida y el peso de su casilla antes de
 * enviar el formulario. Si supera el peso máximo se vacía el input (no se
 * sube) y se explica cómo corregirla; medida o proporción distintas solo
 * avisan, porque el sitio igual la recorta y la escala.
 */
export function useImageCheck(spec: ImageSpec) {
  const [check, setCheck] = useState<ImageCheck | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (!file) return setCheck(null);

    const reject = (text: string) => {
      input.value = "";
      setCheck({ level: "error", text });
    };

    if (file.size > spec.maxKB * 1024) {
      return reject(
        `Pesa ${formatKB(file.size)} y el máximo para esta imagen es ${spec.maxKB} KB. ` +
          `Exportala a ${formatSize(spec)} con más compresión y volvé a subirla.`,
      );
    }

    let width: number, height: number;
    try {
      const bitmap = await createImageBitmap(file);
      ({ width, height } = bitmap);
      bitmap.close();
    } catch {
      return reject("No se pudo leer la imagen. Usá un archivo JPG, WebP o PNG.");
    }

    const summary = `${width}×${height}px · ${formatKB(file.size)}`;
    const warnings: string[] = [];
    if (width > spec.width * 1.05 || height > spec.height * 1.05) {
      warnings.push(`es más grande de lo necesario: exportala a ${formatSize(spec)} y va a pesar menos`);
    } else if (width < spec.width * 0.95 || height < spec.height * 0.95) {
      warnings.push(`es más chica que ${formatSize(spec)} y puede verse pixelada`);
    }
    if (Math.abs(width / height / (spec.width / spec.height) - 1) > 0.03) {
      warnings.push("la proporción no coincide, así que se va a recortar");
    }
    if (file.type === "image/png" && !spec.transparent) {
      warnings.push("para fotos conviene JPG o WebP, que pesan bastante menos que PNG");
    }

    setPreview(URL.createObjectURL(file));
    setCheck(
      warnings.length
        ? { level: "warn", text: `${summary} — ${warnings.join("; ")}.` }
        : { level: "ok", text: `${summary} — lista para subir.` },
    );
  }

  return { check, preview, onChange };
}

const LEVEL_CLASS: Record<ImageCheck["level"], string> = {
  ok: "text-emerald-300",
  warn: "text-amber-300",
  error: "text-accent",
};

export function ImageCheckMessage({ check }: { check: ImageCheck | null }) {
  if (!check) return null;
  return (
    <p role={check.level === "error" ? "alert" : "status"} className={`text-xs ${LEVEL_CLASS[check.level]}`}>
      {check.text}
    </p>
  );
}

/** Input de archivo simple (logos, fotos, ilustraciones) con el chequeo. */
export function ImageInput({ name, spec, className }: { name: string; spec: ImageSpec; className?: string }) {
  const { check, onChange } = useImageCheck(spec);
  return (
    <>
      <input name={name} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={onChange} className={className} />
      <ImageCheckMessage check={check} />
    </>
  );
}
