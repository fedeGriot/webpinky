type ClientItem = { id: string; name: string; logoUrl: string | null };

export function ClientsMarquee({ clients }: { clients: ClientItem[] }) {
  if (clients.length === 0) return null;

  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-14 py-2">
        {[...clients, ...clients].map((client, i) => (
          <span
            key={`${client.id}-${i}`}
            className="whitespace-nowrap text-xl font-extrabold uppercase tracking-tight text-white/35"
          >
            {client.name}
          </span>
        ))}
      </div>
    </div>
  );
}
