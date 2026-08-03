import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Reset — este seed representa el copy publicado inicial, no datos de usuario.
  await prisma.projectPiece.deleteMany();
  await prisma.projectStat.deleteMany();
  await prisma.project.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.value.deleteMany();
  await prisma.processStep.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.heroContent.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  // --- Admin user ---
  // Sin fallback: crear un admin con una contraseña conocida por defecto
  // sería una puerta trasera si alguien corre el seed en producción sin
  // configurar el .env primero.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env antes de correr el seed.");
  }
  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  // --- Configuración global ---
  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      email: "hola@pinky.com.uy",
      phone1: "+598 2705 0111",
      phone2: "+598 2707 3152",
      address: "Gabriel Pereira 2828, Montevideo, Uruguay",
      foundedYear: 2010,
    },
  });

  // --- Hero de Home ---
  await prisma.heroContent.create({
    data: {
      id: "singleton",
      titleLine1: "Hacemos que",
      titleAccent: "tu marca",
      rotatingWordsJson: JSON.stringify(["crezca.", "se vea.", "venda más.", "conecte."]),
      subtitle:
        "Desde 2010 combinamos estrategia, creatividad y performance para impulsar el crecimiento de las marcas que confían en nosotros.",
      ctaPrimaryLabel: "Ver proyectos",
      ctaSecondaryLabel: "Conocenos →",
    },
  });

  // --- Contenido "Quiénes somos" ---
  await prisma.aboutContent.create({
    data: {
      id: "singleton",
      heroTitle: "Desde 2010 haciendo que las marcas crezcan.",
      heroBody:
        "Somos una agencia de publicidad integral, con fuerte ADN digital, con base en Montevideo. Combinamos estrategia, creatividad y performance para impulsar el crecimiento de las marcas que confían en nosotros.",
      growthTitle: "Crecemos junto a nuestros clientes.",
      growthBody:
        "Somos más que una agencia creativa: somos un growth partner diseñado para hacer que tu marca venda más, se vea mejor y se comunique con sentido. Escuchamos profundamente, aprendemos continuamente y pensamos estratégicamente. Transformamos ideas en realidades que venden, colaborando con marcas ambiciosas en Uruguay y la región. Desde 2010, acompañamos a más de 500 marcas en su proceso de crecimiento.",
      serviceCentricBody:
        "Trabajamos bajo un modelo centrado en las personas y en el valor que generamos a largo plazo. Los resultados sostenibles nacen del equilibrio entre estrategia, creatividad y ejecución.",
      growthPartnerBody:
        "Si buscás un aliado para escalar tus ventas online, nos integramos como growth partner: analizamos, planificamos, ejecutamos y optimizamos. Con datos, creatividad y resultados.",
    },
  });

  // --- Clientes (marquee) ---
  const clientNames = [
    "El Dorado",
    "Dermaglós",
    "Farmacias Pigalle",
    "Under Armour",
    "Merrell",
    "Indian",
    "Essen",
    "Columbia",
    "Cinnabon",
    "Mundo Mascota",
    "Revello",
    "San Cristóbal",
    "Interfase",
    "CAT",
    "AlergiaTest",
    "Todo Acá",
    "Evatest",
    "Barbacó",
    "Urufarma",
    "Cantera",
  ];
  await prisma.client.createMany({
    data: clientNames.map((name, i) => ({ name, order: i })),
  });

  // --- Servicios ---
  const services = [
    {
      slug: "estrategia-consultoria",
      icon: "🧭",
      title: "Estrategia & Consultoría",
      tagline: "Definimos el rumbo.",
      description:
        "Cada marca tiene un punto de partida y un destino distinto. Trazamos ese camino desde la estrategia, entendiendo el negocio, la competencia y las oportunidades reales del mercado. Construimos planes que conectan con objetivos concretos: crecer, posicionar, vender más o vender mejor.",
      bullets: [
        "Posicionamiento de marca y estrategia de comunicación",
        "Planificación de medios y análisis de performance",
        "Modelos de crecimiento basados en datos del negocio",
        "Investigación de mercado y análisis competitivo",
      ],
    },
    {
      slug: "creatividad-contenido",
      icon: "💡",
      title: "Creatividad & Contenido",
      tagline: "Creamos ideas que mueven.",
      description:
        "Las buenas ideas no solo llaman la atención: generan conexión, emoción y resultados. Creemos en la creatividad con propósito, la que interpreta a las audiencias y potencia las marcas con coherencia y relevancia. Trabajamos desde el concepto hasta la ejecución.",
      bullets: [
        "Campañas integrales ATL, BTL y Digital",
        "Storytelling y redacción creativa",
        "Dirección de arte, diseño y contenido visual",
        "Influencer marketing y gestión de contenidos en redes",
      ],
    },
    {
      slug: "performance-medios",
      icon: "📈",
      title: "Performance & Medios",
      tagline: "Optimizamos cada inversión.",
      description:
        "El performance no es solo pautar: es comprender cómo cada acción contribuye al resultado del negocio. Diseñamos estrategias que combinan precisión técnica, creatividad y análisis constante, para que cada dólar invertido trabaje en favor del crecimiento.",
      bullets: [
        "Estrategias y planificación de medios digitales",
        "Meta Ads, Google Ads, TikTok Ads y LinkedIn Ads",
        "Gestión y optimización de eCommerce",
        "Dashboards y reporting a medida",
        "Modelo Growth Partner",
      ],
    },
    {
      slug: "branding-diseno",
      icon: "🎨",
      title: "Branding & Diseño",
      tagline: "Hacemos que las marcas se vean bien.",
      description:
        "Una marca no es solo un logo: es una historia que se cuenta con coherencia, en cada punto de contacto con las personas. Desde la estrategia hasta la identidad visual, ayudamos a construir marcas que transmiten confianza, relevancia y diferenciación.",
      bullets: [
        "Creación y rediseño de identidad visual",
        "Naming y conceptualización de marca",
        "Diseño editorial, packaging y material POP",
        "Manuales de marca y sistemas gráficos",
      ],
    },
    {
      slug: "produccion-audiovisual",
      icon: "🎬",
      title: "Producción Audiovisual",
      tagline: "Historias que se comparten.",
      description:
        "El contenido audiovisual es hoy la forma más poderosa de conectar. Desarrollamos piezas que combinan narrativa, estética y propósito, adaptadas a cada canal y formato. Del spot televisivo al reel de Instagram, contamos historias que generan impacto.",
      bullets: [
        "Spots publicitarios para TV, digital y redes",
        "Producción de contenido para marca empleadora y campañas",
        "Cobertura de eventos, BTL y experiencias",
        "Dirección creativa y técnica integral",
      ],
    },
    {
      slug: "tecnologia-automatizacion",
      icon: "⚙️",
      title: "Tecnología & Automatización",
      tagline: "Donde la data se convierte en eficiencia.",
      description:
        "El futuro del marketing es inteligente y automatizado. Implementamos herramientas que integran datos, automatizan procesos y mejoran la toma de decisiones. El resultado: eficiencia, segmentación precisa y comunicación relevante.",
      bullets: [
        "CRM, email marketing y flujos automatizados",
        "Integración con Data4Sales, Flexi y otras plataformas",
        "Configuración y monitoreo de performance omnicanal",
        "Visualización de datos e inteligencia comercial",
      ],
    },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.create({
      data: {
        slug: s.slug,
        order: i,
        icon: s.icon,
        // Ilustraciones ya existentes como archivos estáticos — ver la nota
        // en la migración add_service_icon_urls sobre por qué estos 6
        // servicios puntuales tienen icono real en vez de emoji.
        iconUrl: `/icons/services/${s.slug}.png`,
        iconAccentUrl: `/icons/services-accent/${s.slug}.png`,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        bulletsJson: JSON.stringify(s.bullets),
      },
    });
  }

  // --- Proceso de trabajo ---
  const processSteps = [
    {
      title: "Analizamos — Entender el negocio.",
      description:
        "Nos sumergimos en tu marca, tu competencia y tu mercado. Diagnóstico real y honesto antes de cualquier idea creativa.",
    },
    {
      title: "Planificamos — Trazar el rumbo.",
      description:
        "Diseñamos estrategias con objetivos concretos y medibles: crecer, posicionar, vender más o vender mejor.",
    },
    {
      title: "Ejecutamos — Hacer que pase.",
      description:
        "Creatividad, medios, contenido, tecnología. Todo alineado al objetivo y bajo el mismo techo de la agencia.",
    },
    {
      title: "Optimizamos — Mejorar siempre.",
      description:
        "Medimos, aprendemos, iteramos. Cada dato se convierte en una decisión mejor y un resultado más grande.",
    },
  ];
  await prisma.processStep.createMany({
    data: processSteps.map((p, i) => ({ ...p, order: i })),
  });

  // --- Valores ---
  const values = [
    {
      title: "Estrategia antes de creatividad.",
      description:
        "Cada pieza y cada campaña nacen de un objetivo claro de negocio. No hacemos ideas sueltas: hacemos estrategias que se ejecutan con creatividad.",
    },
    {
      title: "Datos con propósito.",
      description:
        "Medimos para decidir mejor, no para llenar dashboards. Cada número se transforma en una acción concreta que mueve el negocio de nuestros clientes.",
    },
    {
      title: "Largo plazo por default.",
      description:
        "No somos una agencia de campaña: somos socios de crecimiento. Muchos de nuestros clientes trabajan con nosotros hace más de 10 años.",
    },
    {
      title: "Honestidad antes que ventas.",
      description:
        "Si creemos que algo no va a funcionar, lo decimos. Si creemos que un camino es mejor, lo defendemos con datos. Nuestra relación con los clientes se basa en eso.",
    },
  ];
  await prisma.value.createMany({
    data: values.map((v, i) => ({ ...v, order: i })),
  });

  // --- Equipo ---
  const team = [
    "Fabri",
    "Jime",
    "Sofi F.",
    "Nico",
    "Xime",
    "Ruth",
    "Majo",
    "Fede",
    "Sofi R.",
    "Aldana",
    "Nati",
    "Mika",
    "Matías Leal",
    "Christian",
    "Gime",
    "Mathi P.",
    "Lauta",
    "Mathi",
    "Vic",
    "Robert",
    "Lucas",
    "Ramona",
  ];
  await prisma.teamMember.createMany({
    data: team.map((fullName, i) => ({
      fullName,
      initial: fullName[0],
      photoUrl: `/team/${fullName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}.png`,
      order: i,
    })),
  });

  // --- Stats reutilizables ---
  await prisma.stat.createMany({
    data: [
      { context: "about", order: 0, value: "+15", label: "años construyendo", sublabel: "marcas que crecen" },
      { context: "about", order: 1, value: "+500", label: "clientes que confían", sublabel: "en nosotros" },
      { context: "about", order: 2, value: "22", label: "personas detrás", sublabel: "del equipo Pinky" },
      { context: "about", order: 3, value: "6", label: "servicios integrados", sublabel: "bajo un solo techo" },
      {
        context: "services",
        order: 0,
        value: "+68%",
        label: "Farmacias Pigalle",
        sublabel: "Crecimiento de facturación interanual gracias a una estrategia integral de medios y eCommerce.",
      },
      {
        context: "services",
        order: 1,
        value: "+18K",
        label: "Cinnabon",
        sublabel: "Nuevos seguidores en 3 meses durante el lanzamiento de la marca en Uruguay.",
      },
      {
        context: "services",
        order: 2,
        value: "+32%",
        label: "Mundo Mascota",
        sublabel: "Crecimiento de facturación interanual con una estrategia multicanal sostenida.",
      },
    ],
  });

  // --- Proyectos ---
  type PieceInput = { type: string; title: string; subtitle?: string };
  type StatInput = { value: string; label: string };
  type ProjectInput = {
    slug: string;
    title: string;
    clientName: string;
    industry: string;
    year: number;
    featured: boolean;
    order: number;
    category: string;
    heroHeadline: string;
    accentColor: string;
    summary: string;
    resultBadge: string;
    resultLabel: string;
    challengeTitle: string;
    challengeBody: string;
    solutionTitle: string;
    solutionBody: string;
    quoteText?: string;
    quoteAuthor?: string;
    servicesTags: string[];
    stats: StatInput[];
    pieces: PieceInput[];
  };

  const projects: ProjectInput[] = [
    {
      slug: "cinnabon-lanzamiento-uruguay",
      title: "Cinnabon: Lanzamiento Uruguay",
      clientName: "Cinnabon Uruguay",
      industry: "Food & Beverage",
      year: 2024,
      featured: true,
      order: 0,
      category: "Estrategia 360°",
      heroHeadline: "El lanzamiento más dulce de Montevideo.",
      accentColor: "#c77d3e",
      summary:
        "Acompañamos la llegada de Cinnabon a Uruguay con una estrategia 360° pensada para construir expectativa, generar comunidad y lograr una apertura con alto impacto desde el día uno.",
      resultBadge: "+18K",
      resultLabel: "seguidores / 3 meses",
      challengeTitle: "Construir una marca desde cero.",
      challengeBody:
        "Cinnabon llegaba a un mercado uruguayo que no la conocía. Había que construir una marca reconocible y deseada desde cero, en un mercado pequeño, competitivo y con un público acostumbrado a la panadería tradicional. El objetivo era doble: generar expectativa y comunidad antes de la apertura, y convertir esa energía en tráfico real el día de la inauguración en Punta Carretas Shopping.",
      solutionTitle: "Una campaña 360° desde la expectativa.",
      solutionBody:
        'Desarrollamos una campaña pre-lanzamiento bajo el concepto "Algo delicioso está llegando", que combinó vía pública y presencia en shoppings para generar curiosidad antes de la apertura. Sumamos acciones con influencers invitados a sesiones privadas de degustación, una landing de registro y sorteo de un año de Cinnabon gratis, y el día de la inauguración un evento con sampling, DJ en vivo y foto-experiencia en el local. El resultado fue una marca que se sintió instalada desde el primer día, con una comunidad activa, seguidores orgánicos y filas en la apertura.',
      quoteText:
        "Pinky entendió el negocio, entendió la marca y armó algo que sentimos propio desde el día uno.",
      quoteAuthor: "Equipo Cinnabon Uruguay",
      servicesTags: ["Estrategia 360°", "Creatividad", "Medios", "Influencers", "Producción"],
      stats: [
        { value: "+18K", label: "nuevos seguidores en 3 meses" },
        { value: "+6K", label: "participantes del sorteo de lanzamiento" },
        { value: "360°", label: "estrategia integral: OOH, digital, BTL y sampling" },
        { value: "#1", label: "tendencia en redes durante la apertura" },
      ],
      pieces: [
        { type: "video", title: "Llegamos a Montevideo.", subtitle: "Spot televisivo · Campaña de apertura" },
        { type: "landing", title: "1 año gratis de Cinnabon.", subtitle: "Landing de sorteo" },
        { type: "post", title: "Algo delicioso se está enrollando", subtitle: "Post Instagram · Pre-lanzamiento" },
        { type: "ooh", title: "Punta Carretas Shopping.", subtitle: "Vía pública · OOH" },
        { type: "influencer", title: "#Cinnabon Lover", subtitle: "Activación con influencers" },
        { type: "reel", title: "Cobertura del día de apertura.", subtitle: "Reel para Instagram · Evento de inauguración" },
      ],
    },
    {
      slug: "farmacias-pigalle-cyber",
      title: "Farmacias Pigalle: Estrategia de Performance",
      clientName: "Farmacias Pigalle",
      industry: "Retail & Farmacia",
      year: 2024,
      featured: true,
      order: 1,
      category: "Performance",
      heroHeadline: "Cyber Pigalle: hasta 50% off.",
      accentColor: "#D81470",
      summary:
        "Estrategia integral de medios y crecimiento para eCommerce que llevó a Farmacias Pigalle a su mejor facturación interanual.",
      resultBadge: "+68%",
      resultLabel: "facturación interanual",
      challengeTitle: "Crecer en un canal cada vez más competitivo.",
      challengeBody:
        "El eCommerce de farmacia es un terreno de alta competencia y baja diferenciación de precio. Farmacias Pigalle necesitaba una estrategia de medios que sostuviera el crecimiento de facturación durante todo el año, no solo en fechas puntuales como el Cyber.",
      solutionTitle: "Medios y eCommerce trabajando como un solo sistema.",
      solutionBody:
        "Diseñamos una estrategia integral de medios de performance (Meta Ads, Google Ads) sincronizada con la gestión y optimización del eCommerce, con foco en campañas de alto tráfico como Cyber Pigalle y un modelo de reporting continuo para ajustar la inversión según resultados reales de venta.",
      servicesTags: ["Performance & Medios", "eCommerce", "Meta Ads", "Google Ads"],
      stats: [
        { value: "+68%", label: "facturación interanual" },
        { value: "CYBER", label: "campaña insignia del año" },
        { value: "eCommerce", label: "gestión y optimización integral" },
      ],
      pieces: [
        { type: "campaign", title: "Cyber Pigalle — hasta 50% off.", subtitle: "Campaña de performance · Fechas especiales" },
      ],
    },
    {
      slug: "under-armour-garra-charrua",
      title: "Under Armour: Garra Charrúa",
      clientName: "Under Armour",
      industry: "Moda Deportiva",
      year: 2023,
      featured: true,
      order: 2,
      category: "Creatividad",
      heroHeadline: "Protect this house. Garra Charrúa.",
      accentColor: "#0a2540",
      summary: "Narrativa que llevó al rugby uruguayo a la Rugby World Cup France 2023.",
      resultBadge: "RWC",
      resultLabel: "France 2023",
      challengeTitle: "Contar una historia deportiva que nadie más podía contar.",
      challengeBody:
        "El rugby uruguayo llegaba por primera vez en años a un escenario mundial. Under Armour necesitaba una narrativa que conectara con la identidad charrúa y le diera al equipo una voz creativa a la altura del momento.",
      solutionTitle: "Garra Charrúa como concepto creativo central.",
      solutionBody:
        'Construimos una campaña bajo el concepto "Protect this house", adaptado a la identidad de la Garra Charrúa, combinando piezas de branding, contenido y producción audiovisual que acompañaron al equipo en el camino a la Rugby World Cup France 2023.',
      servicesTags: ["Creatividad & Contenido", "Producción Audiovisual", "Branding"],
      stats: [
        { value: "RWC", label: "France 2023" },
        { value: "Garra Charrúa", label: "concepto creativo insignia" },
        { value: "Rugby", label: "narrativa deportiva nacional" },
      ],
      pieces: [{ type: "campaign", title: "Protect this house.", subtitle: "Campaña creativa · Garra Charrúa" }],
    },
    {
      slug: "dermaglos-solares-360",
      title: "Dermaglós Solares: Campaña 360°",
      clientName: "Dermaglós",
      industry: "Farmacia & Dermocosmética",
      year: 2024,
      featured: true,
      order: 3,
      category: "Contenido",
      heroHeadline: "Proteger está en tus manos.",
      accentColor: "#e89b52",
      summary: "Campaña 360º de concientización y venta para la línea solar de Dermaglós.",
      resultBadge: "360°",
      resultLabel: "campaña integral",
      challengeTitle: "Vender protección solar, no solo un producto.",
      challengeBody:
        "La categoría solar compite por atención en un momento del año saturado de ofertas. Dermaglós necesitaba una campaña que combinara concientización sobre el cuidado de la piel con un empuje real de venta para su línea solar.",
      solutionTitle: "Concientización y venta en una sola narrativa.",
      solutionBody:
        'Desarrollamos una campaña 360° bajo el mensaje "Proteger está en tus manos", combinando piezas de contenido educativo sobre protección solar con una promoción comercial (40% OFF) distribuida en los principales puntos de contacto de la marca.',
      servicesTags: ["Creatividad & Contenido", "Branding & Diseño", "Performance & Medios"],
      stats: [
        { value: "360°", label: "campaña integral" },
        { value: "40% OFF", label: "promoción destacada de temporada" },
        { value: "Solares", label: "línea de producto protagonista" },
      ],
      pieces: [{ type: "campaign", title: "Proteger está en tus manos.", subtitle: "Campaña 360° · Línea solar" }],
    },
    {
      slug: "mundo-mascota-multicanal",
      title: "Mundo Mascota: Estrategia Multicanal",
      clientName: "Mundo Mascota",
      industry: "Retail Pet",
      year: 2024,
      featured: true,
      order: 4,
      category: "Estrategia Digital",
      heroHeadline: "Lo que comen sí importa.",
      accentColor: "#8a5223",
      summary: "Estrategia multicanal de crecimiento para el ecosistema de marcas de Mundo Mascota.",
      resultBadge: "+32%",
      resultLabel: "facturación interanual",
      challengeTitle: "Ordenar el crecimiento de un ecosistema de marcas.",
      challengeBody:
        "Mundo Mascota opera un ecosistema de marcas y canales que necesitaba una estrategia unificada para crecer de forma sostenida, en lugar de campañas aisladas por canal.",
      solutionTitle: "Un mismo modelo de crecimiento para todo el ecosistema.",
      solutionBody:
        'Implementamos una estrategia multicanal bajo el mensaje "Lo que comen sí importa", integrando medios de performance, contenido y automatización de datos para sostener el crecimiento de facturación interanual en todas las marcas del ecosistema.',
      servicesTags: ["Estrategia & Consultoría", "Performance & Medios", "Tecnología & Automatización"],
      stats: [
        { value: "+32%", label: "facturación interanual" },
        { value: "Multicanal", label: "estrategia de crecimiento sostenida" },
        { value: "Ecosistema", label: "varias marcas bajo un mismo enfoque" },
      ],
      pieces: [{ type: "campaign", title: "Lo que comen sí importa.", subtitle: "Campaña multicanal · Ecosistema de marcas" }],
    },
    {
      slug: "san-cristobal-mayo-amarillo",
      title: "San Cristóbal Seguros: Mayo Amarillo",
      clientName: "San Cristóbal Seguros",
      industry: "Seguros",
      year: 2024,
      featured: true,
      order: 5,
      category: "Concientización",
      heroHeadline: "Encender las luces ilumina el camino hacia la seguridad.",
      accentColor: "#1e3a5f",
      summary: "Mayo Amarillo: campaña de concientización vial para San Cristóbal Seguros.",
      resultBadge: "Vial",
      resultLabel: "concientización",
      challengeTitle: "Hablar de seguridad vial sin sonar a discurso institucional.",
      challengeBody:
        "Las campañas de concientización vial suelen sonar distantes. San Cristóbal Seguros necesitaba un mensaje de Mayo Amarillo que conectara emocionalmente sin perder seriedad sobre la seguridad en el tránsito.",
      solutionTitle: "Un gesto simple como símbolo de cuidado.",
      solutionBody:
        'Construimos la campaña alrededor del gesto de "encender las luces", un símbolo simple y cotidiano de cuidado en el tránsito, llevado a piezas de contenido y producción audiovisual para Mayo Amarillo.',
      servicesTags: ["Creatividad & Contenido", "Producción Audiovisual", "Estrategia & Consultoría"],
      stats: [
        { value: "Mayo Amarillo", label: "campaña de concientización vial" },
        { value: "Vial", label: "seguridad como eje central" },
        { value: "Concientización", label: "mensaje social con propósito" },
      ],
      pieces: [{ type: "campaign", title: "Encender las luces ilumina el camino.", subtitle: "Campaña de concientización · Mayo Amarillo" }],
    },
    // Otros proyectos de Cinnabon (mencionados en "Más de este cliente")
    {
      slug: "cinnabon-tu-momento-dia-del-padre",
      title: "Tu momento Cinnabon — Día del padre",
      clientName: "Cinnabon Uruguay",
      industry: "Food & Beverage",
      year: 2025,
      featured: false,
      order: 90,
      category: "Campaña",
      heroHeadline: "Tu momento Cinnabon.",
      accentColor: "#c77d3e",
      summary: "Campaña de Día del Padre para reforzar el vínculo emocional con la marca.",
      resultBadge: "Jun",
      resultLabel: "2025",
      challengeTitle: "Mantener viva la conversación entre lanzamientos.",
      challengeBody:
        "Después del lanzamiento, el desafío era seguir dando motivos para hablar de la marca en fechas relevantes para su comunidad.",
      solutionTitle: "Una fecha, un momento propio.",
      solutionBody: "Convertimos el Día del Padre en \"tu momento Cinnabon\", una excusa de consumo con identidad propia.",
      servicesTags: ["Contenido", "Redes"],
      stats: [],
      pieces: [],
    },
    {
      slug: "cinnabon-san-valentin",
      title: "San Valentín — Dulce compañía",
      clientName: "Cinnabon Uruguay",
      industry: "Food & Beverage",
      year: 2025,
      featured: false,
      order: 91,
      category: "Contenido",
      heroHeadline: "Dulce compañía.",
      accentColor: "#c77d3e",
      summary: "Campaña de contenido para San Valentín.",
      resultBadge: "Feb",
      resultLabel: "2025",
      challengeTitle: "Sumarse a una fecha ya muy disputada.",
      challengeBody: "San Valentín es una fecha saturada de marcas; había que encontrar un ángulo propio y coherente con Cinnabon.",
      solutionTitle: "El postre como acompañante, no como excusa.",
      solutionBody: "Posicionamos a Cinnabon como la \"dulce compañía\" ideal para compartir en pareja o en soledad.",
      servicesTags: ["Contenido", "Redes"],
      stats: [],
      pieces: [],
    },
    {
      slug: "cinnabon-nuevos-sabores",
      title: "Lanzamiento de nuevos sabores",
      clientName: "Cinnabon Uruguay",
      industry: "Food & Beverage",
      year: 2025,
      featured: false,
      order: 92,
      category: "Producto",
      heroHeadline: "Nuevos sabores.",
      accentColor: "#c77d3e",
      summary: "Campaña de lanzamiento de nuevos sabores de producto.",
      resultBadge: "Oct",
      resultLabel: "2025",
      challengeTitle: "Renovar el interés sin perder la identidad de marca.",
      challengeBody: "Cada nuevo sabor necesita generar novedad real sin diluir lo que ya hizo fuerte a la marca en Uruguay.",
      solutionTitle: "Novedad de producto, misma personalidad de marca.",
      solutionBody: "Presentamos los nuevos sabores con la misma energía y tono que definió el lanzamiento original de la marca.",
      servicesTags: ["Producto", "Contenido"],
      stats: [],
      pieces: [],
    },
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        clientName: p.clientName,
        industry: p.industry,
        year: p.year,
        featured: p.featured,
        order: p.order,
        category: p.category,
        heroHeadline: p.heroHeadline,
        accentColor: p.accentColor,
        summary: p.summary,
        resultBadge: p.resultBadge,
        resultLabel: p.resultLabel,
        challengeTitle: p.challengeTitle,
        challengeBody: p.challengeBody,
        solutionTitle: p.solutionTitle,
        solutionBody: p.solutionBody,
        quoteText: p.quoteText,
        quoteAuthor: p.quoteAuthor,
        servicesTagsJson: JSON.stringify(p.servicesTags),
        stats: {
          create: p.stats.map((s, i) => ({ order: i, value: s.value, label: s.label })),
        },
        pieces: {
          create: p.pieces.map((piece, i) => ({
            order: i,
            type: piece.type,
            title: piece.title,
            subtitle: piece.subtitle,
          })),
        },
      },
    });
  }

  console.log(`Seed OK — admin creado: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
