"use server";

import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/data";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 3;
// Límite mucho más alto que el del aviso por mail — no debería frenar nunca a
// una persona real completando el formulario varias veces, solo a un script
// en loop. Este SÍ se chequea antes de guardar (a diferencia del de abajo,
// que solo throttlea el mail), porque el guardado no tenía ningún límite.
const SAVE_RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_TIMEOUT_MS = 10_000;

const meetingRequestSchema = z.object({
  name: z.string().trim().min(1, "Falta tu nombre").max(200),
  email: z.string().trim().email("Email inválido").max(320),
  phone: z.string().trim().min(1, "Falta tu teléfono").max(50),
  company: z.string().trim().min(1, "Falta el nombre de tu empresa").max(200),
  website: z.string().trim().max(300).optional(),
  role: z.string().trim().max(200).optional(),
  companySize: z.string().trim().min(1, "Elegí una opción").max(200),
  mainChallenge: z.string().trim().min(1, "Elegí una opción").max(200),
  timeline: z.string().trim().min(1, "Elegí una opción").max(200),
  budget: z.string().trim().min(1, "Elegí una opción").max(200),
  message: z.string().trim().max(4000).optional(),
  // Honeypot: campo invisible para humanos. Se chequea aparte, antes de esta
  // validación (ver más abajo) — acá solo se acota el tamaño por higiene.
  hpToken: z.string().max(200).optional(),
});

export type MeetingRequestInput = z.infer<typeof meetingRequestSchema>;

export type SubmitMeetingRequestResult = { ok: true } | { ok: false; error: string };

// Evita que un salto de línea en un campo termine "inyectando" líneas extra en
// el cuerpo del mail (no explota Resend, que usa una API JSON, pero es una
// buena práctica de higiene no confiar en el input para dar formato al mensaje).
function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function meetingRequestRows(data: MeetingRequestInput): [string, string][] {
  return [
    ["Nombre y apellido", data.name],
    ["Email corporativo", data.email],
    ["Teléfono", data.phone],
    ["Empresa", data.company],
    ["Sitio web", data.website || "—"],
    ["Cargo en la empresa", data.role || "—"],
    ["Tamaño de la empresa", data.companySize],
    ["Principal desafío", data.mainChallenge],
    ["Cuándo quiere empezar", data.timeline],
    ["Presupuesto mensual", data.budget],
    ["Mensaje", data.message || "—"],
  ];
}

function formatEmailBody(data: MeetingRequestInput) {
  return meetingRequestRows(data)
    .map(([label, value]) => `${label}: ${singleLine(value)}`)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mail en HTML con la estética de la web (fondo violeta, tarjeta oscura,
// acento rosa) — se manda junto al texto plano como fallback. Layout con
// <table> e inline styles a propósito: es lo único que se renderiza igual
// en todos los clientes de mail (Gmail, Outlook, Apple Mail), a diferencia
// de flex/grid o clases externas.
function formatEmailHtml(data: MeetingRequestInput) {
  const rows = meetingRequestRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid rgba(255,255,255,0.08);vertical-align:top;width:190px;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#9b8fc4;">
              ${escapeHtml(label)}
            </span>
          </td>
          <td style="padding:14px 0;border-top:1px solid rgba(255,255,255,0.08);vertical-align:top;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#ffffff;white-space:pre-wrap;">
              ${escapeHtml(singleLine(value))}
            </span>
          </td>
        </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:32px 16px;background-color:#2b2247;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
      <tr>
        <td style="padding-bottom:24px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;color:#ffffff;">pinky<span style="color:#d90b91;">.</span></span>
        </td>
      </tr>
      <tr>
        <td style="background-color:#211933;border-radius:20px;padding:32px;">
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#d90b91;">
            Nueva solicitud de reunión
          </p>
          <h1 style="margin:4px 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:#ffffff;">
            ${escapeHtml(data.company)}
          </h1>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top:20px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7a6fa0;">
            Enviado automáticamente desde el formulario de contacto de pinky.com.uy
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export async function submitMeetingRequest(input: MeetingRequestInput): Promise<SubmitMeetingRequestResult> {
  // Red de seguridad final: esta función no puede tirar una excepción sin
  // manejar. Es la puerta de entrada de un lead de negocio real — si algo
  // inesperado explota acá, el usuario tiene que ver un mensaje razonable,
  // no una pantalla rota ni un submit que se cuelga en silencio.
  try {
    // Honeypot: se chequea ANTES de validar con zod, sobre el input crudo.
    // El campo es type="hidden" en el form (los navegadores nunca lo
    // autocompletan), así que si llega con contenido es casi seguro un bot.
    // Igual queda un registro server-side (no visible para el usuario) por si
    // alguna vez le pega a una persona real por error — así no se pierde el
    // lead sin dejar rastro.
    if (input.hpToken) {
      console.warn(
        "Honeypot del formulario de contacto disparado (posible falso positivo si es una persona real):",
        { name: input.name, email: input.email, company: input.company, hpToken: input.hpToken },
      );
      return { ok: true };
    }

    const parsed = meetingRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }
    const data = parsed.data;

    // A diferencia del rate limit de más abajo (que solo throttlea el aviso
    // por mail), este SÍ bloquea el guardado — sin él, el endpoint público
    // aceptaba cualquier volumen de solicitudes sin límite alguno.
    const ip = await getClientIp();
    if (!rateLimit(`meeting-request-save:${ip}`, SAVE_RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return { ok: false, error: "Demasiadas solicitudes. Probá de nuevo más tarde." };
    }

    // Guardar el lead es lo primero y lo único de lo que depende la
    // respuesta de éxito al usuario. Todo lo que pasa después (mail de
    // notificación) es best-effort: si Resend está caído, la cuota se
    // agotó, o hay un corte de red, el lead ya quedó capturado en la base y
    // el equipo lo puede ver/recuperar desde ahí.
    let requestId: string;
    try {
      const saved = await prisma.meetingRequest.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          website: data.website || null,
          role: data.role || null,
          companySize: data.companySize,
          mainChallenge: data.mainChallenge,
          timeline: data.timeline,
          budget: data.budget,
          message: data.message || null,
        },
      });
      requestId = saved.id;
    } catch (dbError) {
      console.error("No se pudo guardar la solicitud de reunión en la base:", dbError);
      return { ok: false, error: "No pudimos procesar tu solicitud. Probá de nuevo o escribinos por mail." };
    }

    // Este segundo rate limit (más estricto, mismo `ip` ya obtenido arriba)
    // throttlea solo el AVISO por mail, para no inundar la bandeja del
    // equipo con reenvíos rápidos — el guardado del lead ya quedó protegido
    // por su propio límite (más alto) antes del try/catch de arriba.
    if (!rateLimit(`meeting-request:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      console.warn(`Solicitud ${requestId} guardada; sin aviso por mail por rate limit (ip=${ip}).`);
      return { ok: true };
    }

    await sendNotificationEmail(requestId, data);

    return { ok: true };
  } catch (unexpected) {
    console.error("Error inesperado en submitMeetingRequest:", unexpected);
    return { ok: false, error: "Ocurrió un error inesperado. Probá de nuevo o escribinos por mail." };
  }
}

// Nunca puede tirar: cualquier falla acá se loggea y se guarda en el propio
// registro (emailError), pero el usuario ya recibió su confirmación de éxito
// porque el lead está guardado independientemente de esto.
async function sendNotificationEmail(requestId: string, data: MeetingRequestInput) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error(`RESEND_API_KEY no configurada — solicitud ${requestId} guardada sin avisar por mail.`);
      return;
    }

    const settings = await getSiteSettings().catch((err) => {
      console.error("Error leyendo SiteSettings para el mail de aviso:", err);
      return null;
    });
    const to = (process.env.RESEND_TO_EMAIL || settings?.email)?.trim();
    if (!to) {
      console.error(`Sin dirección de destino configurada — solicitud ${requestId} guardada sin avisar por mail.`);
      return;
    }
    const from = (process.env.RESEND_FROM_EMAIL || "Pinky Web <onboarding@resend.dev>").trim();

    const resend = new Resend(apiKey);
    const { error } = await withTimeout(
      resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `Nueva solicitud de reunión — ${singleLine(data.company)}`,
        text: formatEmailBody(data),
        html: formatEmailHtml(data),
      }),
      EMAIL_TIMEOUT_MS,
      "envío de mail de Resend",
    );

    if (error) {
      console.error(`Resend devolvió un error para la solicitud ${requestId} (lead ya guardado igual):`, error);
      await prisma.meetingRequest
        .update({ where: { id: requestId }, data: { emailError: JSON.stringify(error) } })
        .catch((err) => console.error(`No se pudo registrar emailError en ${requestId}:`, err));
      return;
    }

    await prisma.meetingRequest
      .update({ where: { id: requestId }, data: { emailSent: true } })
      .catch((err) => console.error(`No se pudo marcar emailSent en ${requestId}:`, err));
  } catch (emailException) {
    console.error(`Excepción enviando el mail de aviso para ${requestId} (lead ya guardado igual):`, emailException);
    await prisma.meetingRequest
      .update({ where: { id: requestId }, data: { emailError: String(emailException) } })
      .catch((err) => console.error(`No se pudo registrar emailError en ${requestId}:`, err));
  }
}
