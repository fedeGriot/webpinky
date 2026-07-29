import Link from "next/link";

export function CtaSection({
  eyebrow,
  titleLine1,
  titleAccent,
  spacingClassName = "pb-24 pt-14",
}: {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  spacingClassName?: string;
}) {
  return (
    <section
      id="contacto"
      className={`relative overflow-hidden px-6 text-center sm:px-14 ${spacingClassName}`}
    >
      <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white/40">{eyebrow}</p>
      <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
        {titleLine1} <span className="text-accent">{titleAccent}</span>
      </h2>
      <div className="mt-8 flex justify-center">
        <Link
          href="/contacto"
          className="rounded-full bg-accent px-8 py-4 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          Solicitá una reunión →
        </Link>
      </div>
    </section>
  );
}
