"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { formStr as str, landingFieldsFromForm, parseSlug } from "@/lib/landing-form";

function revalidateLandingPaths(...slugs: string[]) {
  for (const slug of slugs) revalidatePath(`/servicios/${slug}`);
  revalidatePath("/sitemap.xml");
}

/**
 * Crea una landing nueva solo con nombre y slug: el resto de los títulos
 * arranca con un texto base (la misma estructura de secciones que recomienda
 * Dahseo) para completar en la edición. Queda sin publicar.
 */
export async function createLanding(formData: FormData) {
  await verifySession();
  const navLabel = str(formData, "navLabel");
  const maxOrder = await prisma.landing.aggregate({ _max: { order: true } });

  const landing = await prisma.landing.create({
    data: {
      slug: parseSlug(formData),
      navLabel,
      order: (maxOrder._max.order ?? -1) + 1,
      seoTitle: `${navLabel} en Uruguay - Pinky`,
      seoDescription: "",
      heroEyebrow: navLabel,
      heroTitle: `${navLabel} *en Uruguay*`,
      heroBody: "",
      heroCtaLabel: "Solicitá una reunión →",
      clientsTitle: "Marcas que *confían* en Pinky",
      clientsBody: "Desde 2010 acompañamos el crecimiento de marcas de Uruguay y la región.",
      painTitle: "Desafíos que *resolvemos*",
      painIntro: "",
      servicesTitle: "Qué *incluye* el servicio",
      servicesIntro: "",
      casesTitle: "Casos de *éxito*",
      casesIntro: "",
      methodTitle: "Cómo *trabajamos*",
      methodIntro: "",
      partnerTitle: "Más que una agencia: tu *growth partner*",
      partnerBody: "",
      testimonialsTitle: "Lo que dicen *las marcas*",
      faqTitle: "Preguntas *frecuentes*",
      ctaEyebrow: "Hablemos de tu proyecto",
      ctaTitle: "Hagamos que tu marca *crezca.*",
      ctaBody: "",
    },
  });

  redirect(`/admin/landings/${landing.id}`);
}

export async function updateLanding(formData: FormData) {
  await verifySession();
  const id = str(formData, "id");
  const previous = await prisma.landing.findUniqueOrThrow({ where: { id }, select: { slug: true } });
  const landing = await prisma.landing.update({ where: { id }, data: await landingFieldsFromForm(formData) });
  revalidateLandingPaths(previous.slug, landing.slug);
  redirect(`/admin/landings/${landing.id}?guardado=1`);
}

export async function deleteLanding(formData: FormData) {
  await verifySession();
  const landing = await prisma.landing.delete({ where: { id: str(formData, "id") } });
  revalidateLandingPaths(landing.slug);
  redirect("/admin/landings");
}
