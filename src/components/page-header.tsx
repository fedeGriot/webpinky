export function PageHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-16 sm:px-14 sm:pt-20">
      <p className="mb-4 text-sm font-bold uppercase tracking-wide text-accent">{eyebrow}</p>
      <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
        {title}
      </h1>
      {body && <p className="mt-6 max-w-2xl text-lg text-white/60">{body}</p>}
    </section>
  );
}
