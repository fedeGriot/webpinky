"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { saveUploadedFile } from "@/lib/uploads";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmail(formData: FormData, key: string) {
  const value = str(formData, key);
  if (!EMAIL_RE.test(value)) {
    throw new Error(`"${key}" debe ser un email válido.`);
  }
  return value;
}

// Solo http(s), para no terminar guardando un href tipo javascript: en un <a>.
function parseOptionalUrl(formData: FormData, key: string) {
  const value = optionalStr(formData, key);
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("protocol");
  } catch {
    throw new Error(`"${key}" debe ser una URL http(s) válida.`);
  }
  return value;
}

// --- Contenido singleton ---

export async function upsertHero(formData: FormData) {
  await verifySession();
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      titleLine1: str(formData, "titleLine1"),
      titleAccent: str(formData, "titleAccent"),
      rotatingWordsJson: JSON.stringify(linesToArray(str(formData, "rotatingWords"))),
      subtitle: str(formData, "subtitle"),
      ctaPrimaryLabel: str(formData, "ctaPrimaryLabel"),
      ctaSecondaryLabel: str(formData, "ctaSecondaryLabel"),
    },
    update: {
      titleLine1: str(formData, "titleLine1"),
      titleAccent: str(formData, "titleAccent"),
      rotatingWordsJson: JSON.stringify(linesToArray(str(formData, "rotatingWords"))),
      subtitle: str(formData, "subtitle"),
      ctaPrimaryLabel: str(formData, "ctaPrimaryLabel"),
      ctaSecondaryLabel: str(formData, "ctaSecondaryLabel"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/secciones/hero");
}

export async function upsertAbout(formData: FormData) {
  await verifySession();
  const data = {
    heroTitle: str(formData, "heroTitle"),
    heroBody: str(formData, "heroBody"),
    growthTitle: str(formData, "growthTitle"),
    growthBody: str(formData, "growthBody"),
    serviceCentricBody: str(formData, "serviceCentricBody"),
    growthPartnerBody: str(formData, "growthPartnerBody"),
  };
  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/about");
}

export async function upsertSiteSettings(formData: FormData) {
  await verifySession();
  const data = {
    email: parseEmail(formData, "email"),
    phone1: str(formData, "phone1"),
    phone2: optionalStr(formData, "phone2"),
    address: str(formData, "address"),
    instagramUrl: parseOptionalUrl(formData, "instagramUrl"),
    linkedinUrl: parseOptionalUrl(formData, "linkedinUrl"),
    youtubeUrl: parseOptionalUrl(formData, "youtubeUrl"),
    twitterUrl: parseOptionalUrl(formData, "twitterUrl"),
    foundedYear: int(formData, "foundedYear", 2010),
  };
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/secciones/configuracion");
}

// --- Clientes ---

export async function createClient(formData: FormData) {
  await verifySession();
  const logo = formData.get("logo") as File | null;
  const logoUrl = logo ? await saveUploadedFile(logo) : null;
  await prisma.client.create({
    data: {
      name: str(formData, "name"),
      order: int(formData, "order"),
      logoUrl,
    },
  });
  revalidatePath("/");
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/clientes");
}

export async function updateClient(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  const logo = formData.get("logo") as File | null;
  const logoUrl = logo && logo.size > 0 ? await saveUploadedFile(logo) : undefined;
  await prisma.client.update({
    where: { id },
    data: {
      name: str(formData, "name"),
      order: int(formData, "order"),
      ...(logoUrl !== undefined ? { logoUrl } : {}),
    },
  });
  revalidatePath("/");
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/clientes");
}

export async function deleteClient(formData: FormData) {
  await verifySession();
  await prisma.client.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/");
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/clientes");
}

// --- Servicios ---

export async function createService(formData: FormData) {
  await verifySession();
  await prisma.service.create({
    data: {
      slug: str(formData, "slug"),
      order: int(formData, "order"),
      icon: str(formData, "icon") || "✦",
      title: str(formData, "title"),
      tagline: str(formData, "tagline"),
      description: str(formData, "description"),
      bulletsJson: JSON.stringify(linesToArray(str(formData, "bullets"))),
    },
  });
  revalidatePath("/");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/servicios");
}

export async function updateService(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  await prisma.service.update({
    where: { id },
    data: {
      slug: str(formData, "slug"),
      order: int(formData, "order"),
      icon: str(formData, "icon") || "✦",
      title: str(formData, "title"),
      tagline: str(formData, "tagline"),
      description: str(formData, "description"),
      bulletsJson: JSON.stringify(linesToArray(str(formData, "bullets"))),
    },
  });
  revalidatePath("/");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/servicios");
}

export async function deleteService(formData: FormData) {
  await verifySession();
  await prisma.service.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/servicios");
}

// --- Proceso ---

export async function createProcessStep(formData: FormData) {
  await verifySession();
  await prisma.processStep.create({
    data: {
      order: int(formData, "order"),
      title: str(formData, "title"),
      description: str(formData, "description"),
    },
  });
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/proceso");
}

export async function updateProcessStep(formData: FormData) {
  await verifySession();
  await prisma.processStep.update({
    where: { id: str(formData, "id") },
    data: {
      order: int(formData, "order"),
      title: str(formData, "title"),
      description: str(formData, "description"),
    },
  });
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/proceso");
}

export async function deleteProcessStep(formData: FormData) {
  await verifySession();
  await prisma.processStep.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/proceso");
}

// --- Valores ---

export async function createValue(formData: FormData) {
  await verifySession();
  await prisma.value.create({
    data: {
      order: int(formData, "order"),
      title: str(formData, "title"),
      description: str(formData, "description"),
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/valores");
}

export async function updateValue(formData: FormData) {
  await verifySession();
  await prisma.value.update({
    where: { id: str(formData, "id") },
    data: {
      order: int(formData, "order"),
      title: str(formData, "title"),
      description: str(formData, "description"),
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/valores");
}

export async function deleteValue(formData: FormData) {
  await verifySession();
  await prisma.value.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/valores");
}

// --- Equipo ---

export async function createTeamMember(formData: FormData) {
  await verifySession();
  const photo = formData.get("photo") as File | null;
  const photoUrl = photo && photo.size > 0 ? await saveUploadedFile(photo) : null;
  await prisma.teamMember.create({
    data: {
      order: int(formData, "order"),
      initial: str(formData, "initial"),
      fullName: optionalStr(formData, "fullName"),
      role: optionalStr(formData, "role"),
      photoUrl,
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/equipo");
}

export async function updateTeamMember(formData: FormData) {
  await verifySession();
  const photo = formData.get("photo") as File | null;
  const photoUrl = photo && photo.size > 0 ? await saveUploadedFile(photo) : undefined;
  await prisma.teamMember.update({
    where: { id: str(formData, "id") },
    data: {
      order: int(formData, "order"),
      initial: str(formData, "initial"),
      fullName: optionalStr(formData, "fullName"),
      role: optionalStr(formData, "role"),
      ...(photoUrl !== undefined ? { photoUrl } : {}),
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/equipo");
}

export async function deleteTeamMember(formData: FormData) {
  await verifySession();
  await prisma.teamMember.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/quienes-somos");
  revalidatePath("/admin/secciones/equipo");
}

// --- Stats ---

export async function createStat(formData: FormData) {
  await verifySession();
  await prisma.stat.create({
    data: {
      context: str(formData, "context"),
      order: int(formData, "order"),
      value: str(formData, "value"),
      label: str(formData, "label"),
      sublabel: optionalStr(formData, "sublabel"),
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/stats");
}

export async function updateStat(formData: FormData) {
  await verifySession();
  await prisma.stat.update({
    where: { id: str(formData, "id") },
    data: {
      context: str(formData, "context"),
      order: int(formData, "order"),
      value: str(formData, "value"),
      label: str(formData, "label"),
      sublabel: optionalStr(formData, "sublabel"),
    },
  });
  revalidatePath("/quienes-somos");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/stats");
}

// Mínimo de stats por sección: por debajo de esto el módulo de números
// destacados en la web pública se ve pobre/desbalanceado.
const MIN_STATS_PER_CONTEXT = 3;

export async function deleteStat(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  const stat = await prisma.stat.findUnique({ where: { id } });
  if (!stat) return;

  const count = await prisma.stat.count({ where: { context: stat.context } });
  if (count <= MIN_STATS_PER_CONTEXT) {
    throw new Error(`Tiene que haber al menos ${MIN_STATS_PER_CONTEXT} stats en "${stat.context}".`);
  }

  await prisma.stat.delete({ where: { id } });
  revalidatePath("/quienes-somos");
  revalidatePath("/que-hacemos");
  revalidatePath("/admin/secciones/stats");
}
