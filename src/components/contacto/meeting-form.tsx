"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitMeetingRequest, type MeetingRequestInput } from "@/lib/actions/contact";
import { FillActionButton } from "@/components/fill-action-button";
import { getLenis } from "@/components/smooth-scroll";

const COMPANY_SIZE_OPTIONS = [
  "Soy emprendedor / negocio personal",
  "Pyme (hasta 20 empleados)",
  "Empresa mediana (20 a 100 empleados)",
  "Empresa grande (más de 100 empleados)",
];

const CHALLENGE_OPTIONS = [
  "Aumentar ventas y generar demanda",
  "Conseguir leads más calificados y mejorar la conversión",
  "Ordenar la estrategia y la comunicación",
  "Mejorar la ejecución y el seguimiento de mi comunicación",
  "Necesito ayuda para definirlo",
];

const TIMELINE_OPTIONS = ["Este mes", "Dentro de 1 a 3 meses", "Estoy explorando opciones"];

const BUDGET_OPTIONS = [
  "USD 1.000 – 3.000",
  "USD 3.000 – 8.000",
  "USD 8.000 – 20.000",
  "Más de USD 20.000",
  "Prefiero conversarlo en la reunión",
];

const EMPTY_FORM: MeetingRequestInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  role: "",
  companySize: "",
  mainChallenge: "",
  timeline: "",
  budget: "",
  message: "",
  hpToken: "",
};

const TOTAL_STEPS = 3;

function ChoiceCards({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`cursor-pointer rounded-2xl border px-5 py-3 text-left text-sm font-semibold transition ${
            value === option
              ? "border-accent bg-accent/15 text-white"
              : "border-white/10 bg-card text-white/70 hover:border-white/30 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-bold uppercase tracking-wide text-white/40">
        {label} {optional && <span className="normal-case text-white/30">(opcional)</span>}
      </span>
      {children}
    </label>
  );
}

// Nunca usar <label> acá: envuelve varios <button>, y un <label> con más de un
// elemento "labelable" hace que el navegador resalte el primero al pasar el mouse.
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <p className="text-base font-bold text-accent">{label}</p>
      {children}
    </div>
  );
}

const inputClass =
  "rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent";

export function MeetingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MeetingRequestInput>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Al cambiar de paso la altura de la página cambia de golpe (el paso 2
    // tiene más contenido que el 1). Lenis recalcula el alto solo automático,
    // pero con un debounce — mientras tanto el scroll queda limitado a la
    // altura vieja (más corta) y se siente "trabado". Forzar el resize acá,
    // apenas cambia el paso, evita esa ventana rota.
    getLenis()?.resize();
  }, [step]);

  function update<K extends keyof MeetingRequestInput>(key: K, value: MeetingRequestInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const step1Valid = form.name.trim() && form.email.trim() && form.phone.trim() && form.company.trim();
  const step2Valid = form.companySize && form.mainChallenge && form.timeline && form.budget;

  async function handleSubmit() {
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      const result = await submitMeetingRequest(form);
      if (result.ok) {
        router.push("/contacto/gracias");
      } else {
        setStatus("error");
        setError(result.error);
      }
    } catch {
      // El server action ya no debería tirar nunca, pero si algo se corta
      // en el camino (red, etc.) igual queremos mostrar un mensaje y no
      // dejar el botón trabado en "Enviando...".
      setStatus("error");
      setError("No pudimos enviar tu solicitud. Probá de nuevo o escribinos por mail.");
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-10">
      {/* Honeypot anti-spam: type="hidden" en vez de ocultarlo con CSS. Con
          type="text" (aunque quede fuera de pantalla) algunos navegadores lo
          rellenaban igual al autocompletar el resto del formulario, tratando
          a gente real como bots. Los navegadores nunca autocompletan campos
          type="hidden" — es una regla fija, no una heurística evitable. */}
      <input
        type="hidden"
        name="hpToken"
        value={form.hpToken}
        onChange={(e) => update("hpToken", e.target.value)}
      />
      <div className="mb-8 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${i + 1 <= step ? "bg-accent" : "bg-white/10"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Paso 1 de 3</p>
            <h3 className="mt-1 text-2xl font-extrabold text-white">Contanos de vos.</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellido">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Tu nombre"
              />
            </Field>
            <Field label="Email corporativo">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="vos@empresa.com"
              />
            </Field>
            <Field label="Teléfono">
              <input
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+598 ..."
              />
            </Field>
            <Field label="Empresa">
              <input
                className={inputClass}
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Nombre de tu empresa"
              />
            </Field>
            <Field label="Sitio web" optional>
              <input
                className={inputClass}
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="www.tuempresa.com"
              />
            </Field>
            <Field label="Cargo en la empresa" optional>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Ej. Marketing Manager"
              />
            </Field>
          </div>
          <FillActionButton
            disabled={!step1Valid}
            onClick={() => setStep(2)}
            className="mt-2 self-start bg-accent px-7 py-3.5 text-sm"
          >
            Siguiente →
          </FillActionButton>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Paso 2 de 3</p>
            <h3 className="mt-1 text-2xl font-extrabold text-white">Contanos de tu negocio.</h3>
          </div>
          <FieldGroup label="¿Qué tamaño tiene tu empresa?">
            <ChoiceCards options={COMPANY_SIZE_OPTIONS} value={form.companySize} onChange={(v) => update("companySize", v)} />
          </FieldGroup>
          <FieldGroup label="¿Cuál es el principal desafío de tu negocio hoy?">
            <ChoiceCards options={CHALLENGE_OPTIONS} value={form.mainChallenge} onChange={(v) => update("mainChallenge", v)} />
          </FieldGroup>
          <FieldGroup label="¿Cuándo te gustaría comenzar a trabajar?">
            <ChoiceCards options={TIMELINE_OPTIONS} value={form.timeline} onChange={(v) => update("timeline", v)} />
          </FieldGroup>
          <FieldGroup label="¿Cuál es tu presupuesto mensual?">
            <ChoiceCards options={BUDGET_OPTIONS} value={form.budget} onChange={(v) => update("budget", v)} />
          </FieldGroup>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="cursor-pointer rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white/70 transition hover:border-white hover:text-white"
            >
              ← Atrás
            </button>
            <FillActionButton
              disabled={!step2Valid}
              onClick={() => setStep(3)}
              className="bg-accent px-7 py-3.5 text-sm"
            >
              Siguiente →
            </FillActionButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Paso 3 de 3</p>
            <h3 className="mt-1 text-2xl font-extrabold text-white">Un último detalle.</h3>
          </div>
          <Field label="Contanos brevemente qué necesitás resolver" optional>
            <textarea
              className={`${inputClass} min-h-[120px] resize-none`}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Lo que quieras contarnos antes de la reunión..."
            />
          </Field>
          <label className="flex items-start gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            Acepto los términos y condiciones de Pinky.
          </label>
          {error && <p className="text-sm font-semibold text-accent">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="cursor-pointer rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white/70 transition hover:border-white hover:text-white"
            >
              ← Atrás
            </button>
            <FillActionButton
              disabled={!agreed || status === "submitting"}
              onClick={handleSubmit}
              className="bg-accent px-7 py-3.5 text-sm"
            >
              {status === "submitting" ? "Enviando..." : "Solicitar reunión →"}
            </FillActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
