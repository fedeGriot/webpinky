"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { saveUploadedFile } from "@/lib/uploads";
import { isYouTubeUrl } from "@/lib/youtube";
import { sanitizeRichText } from "@/lib/sanitize";

// Tope defensivo: nada en este CMS necesita legítimamente un campo de texto
// de más de 20k caracteres; esto solo frena payloads patológicos.
const MAX_TEXT_LENGTH = 20_000;

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim().slice(0, MAX_TEXT_LENGTH);
}

function optionalStr(formData: FormData, key: string) {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

function int(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DEFAULT_ACCENT_COLOR = "#D90B91";

function parseSlug(formData: FormData) {
  const value = str(formData, "slug");
  if (!SLUG_RE.test(value)) {
    throw new Error("El slug solo puede tener minúsculas, números y guiones (ej: mi-proyecto).");
  }
  return value;
}

function parseYear(formData: FormData) {
  const year = int(formData, "year", new Date().getFullYear());
  if (year < 2000 || year > 2100) {
    throw new Error("El año debe estar entre 2000 y 2100.");
  }
  return year;
}

function parseAccentColor(formData: FormData) {
  const value = str(formData, "accentColor");
  return HEX_COLOR_RE.test(value) ? value : DEFAULT_ACCENT_COLOR;
}

function parseVideoUrl(formData: FormData) {
  const value = str(formData, "videoUrl");
  if (value.length === 0) return null;
  if (!isYouTubeUrl(value)) {
    throw new Error("El link de video tiene que ser una URL de YouTube válida.");
  }
  return value;
}

function projectFieldsFromForm(formData: FormData) {
  return {
    slug: parseSlug(formData),
    title: str(formData, "title"),
    clientName: str(formData, "clientName"),
    industry: str(formData, "industry"),
    year: parseYear(formData),
    featured: formData.get("featured") === "on",
    order: int(formData, "order"),
    category: str(formData, "category"),
    heroHeadline: str(formData, "heroHeadline"),
    accentColor: parseAccentColor(formData),
    videoUrl: parseVideoUrl(formData),
    summary: sanitizeRichText(str(formData, "summary")),
    resultBadge: optionalStr(formData, "resultBadge"),
    resultLabel: optionalStr(formData, "resultLabel"),
    challengeTitle: str(formData, "challengeTitle"),
    challengeBody: sanitizeRichText(str(formData, "challengeBody")),
    solutionTitle: str(formData, "solutionTitle"),
    solutionBody: sanitizeRichText(str(formData, "solutionBody")),
    quoteText: optionalStr(formData, "quoteText"),
    quoteAuthor: optionalStr(formData, "quoteAuthor"),
    servicesTagsJson: JSON.stringify(linesToArray(str(formData, "servicesTags"))),
  };
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/proyectos");
  if (slug) revalidatePath(`/proyectos/${slug}`);
}

export async function createProject(formData: FormData) {
  await verifySession();
  const cover = formData.get("coverImage") as File | null;
  const coverImageUrl = cover && cover.size > 0 ? await saveUploadedFile(cover) : null;

  const project = await prisma.project.create({
    data: { ...projectFieldsFromForm(formData), coverImageUrl },
  });

  revalidateProjectPaths(project.slug);
  redirect(`/admin/proyectos/${project.id}/editar`);
}

export async function updateProject(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  const cover = formData.get("coverImage") as File | null;
  const coverImageUrl = cover && cover.size > 0 ? await saveUploadedFile(cover) : undefined;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectFieldsFromForm(formData),
      ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
    },
  });

  revalidateProjectPaths(project.slug);
  revalidatePath(`/admin/proyectos/${id}/editar`);
}

export async function deleteProject(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  const project = await prisma.project.delete({ where: { id } });
  revalidateProjectPaths(project.slug);
  redirect("/admin/proyectos");
}

// --- Reordenar (piezas y stats comparten la misma lógica: intercambiar el
// valor "order" con el vecino de arriba/abajo, así no hace falta que el
// admin entienda o escriba números de orden a mano) ---

type Orderable = { id: string; order: number };

async function swapOrder<T extends Orderable>(
  items: T[],
  id: string,
  direction: "up" | "down",
  save: (id: string, order: number) => Promise<unknown>,
) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const current = items[index];
  const neighbor = items[swapWith];
  await Promise.all([save(current.id, neighbor.order), save(neighbor.id, current.order)]);
}

// --- Stats del proyecto ---

export async function createProjectStat(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  const maxOrder = await prisma.projectStat.aggregate({ where: { projectId }, _max: { order: true } });
  await prisma.projectStat.create({
    data: {
      projectId,
      order: (maxOrder._max.order ?? -1) + 1,
      value: str(formData, "value"),
      label: str(formData, "label"),
    },
  });
  await revalidateProjectAndRedirect(projectId);
}

export async function deleteProjectStat(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  await prisma.projectStat.delete({ where: { id: str(formData, "id") } });
  await revalidateProjectAndRedirect(projectId);
}

export async function moveProjectStat(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  const direction = str(formData, "direction") === "up" ? "up" : "down";
  const stats = await prisma.projectStat.findMany({ where: { projectId }, orderBy: { order: "asc" } });
  await swapOrder(stats, str(formData, "id"), direction, (id, order) =>
    prisma.projectStat.update({ where: { id }, data: { order } }),
  );
  await revalidateProjectAndRedirect(projectId);
}

// --- Piezas del proyecto ---

export async function createProjectPiece(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  const image = formData.get("image") as File | null;
  const imageUrl = image && image.size > 0 ? await saveUploadedFile(image) : null;
  const maxOrder = await prisma.projectPiece.aggregate({ where: { projectId }, _max: { order: true } });

  await prisma.projectPiece.create({
    data: {
      projectId,
      order: (maxOrder._max.order ?? -1) + 1,
      type: str(formData, "type") || "pieza",
      title: str(formData, "title"),
      subtitle: optionalStr(formData, "subtitle"),
      imageUrl,
    },
  });
  await revalidateProjectAndRedirect(projectId);
}

export async function deleteProjectPiece(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  await prisma.projectPiece.delete({ where: { id: str(formData, "id") } });
  await revalidateProjectAndRedirect(projectId);
}

export async function moveProjectPiece(formData: FormData) {
  await verifySession();
  const projectId = str(formData, "projectId");
  const direction = str(formData, "direction") === "up" ? "up" : "down";
  const pieces = await prisma.projectPiece.findMany({ where: { projectId }, orderBy: { order: "asc" } });
  await swapOrder(pieces, str(formData, "id"), direction, (id, order) =>
    prisma.projectPiece.update({ where: { id }, data: { order } }),
  );
  await revalidateProjectAndRedirect(projectId);
}

async function revalidateProjectAndRedirect(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  revalidateProjectPaths(project?.slug);
  redirect(`/admin/proyectos/${projectId}/editar`);
}
