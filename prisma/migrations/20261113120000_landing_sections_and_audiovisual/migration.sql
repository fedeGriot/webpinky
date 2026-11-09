-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Landing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "navLabel" TEXT NOT NULL,
    "sectionOrderJson" TEXT NOT NULL DEFAULT '[]',
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroBody" TEXT NOT NULL,
    "heroCtaLabel" TEXT NOT NULL,
    "heroVideoUrl" TEXT,
    "clientsTitle" TEXT NOT NULL,
    "clientsBody" TEXT NOT NULL,
    "painTitle" TEXT NOT NULL,
    "painIntro" TEXT NOT NULL,
    "painPointsJson" TEXT NOT NULL DEFAULT '[]',
    "servicesTitle" TEXT NOT NULL,
    "servicesIntro" TEXT NOT NULL,
    "servicesJson" TEXT NOT NULL DEFAULT '[]',
    "casesTitle" TEXT NOT NULL,
    "casesIntro" TEXT NOT NULL,
    "caseProjectIdsJson" TEXT NOT NULL DEFAULT '[]',
    "casesShowVideo" BOOLEAN NOT NULL DEFAULT false,
    "methodTitle" TEXT NOT NULL,
    "methodIntro" TEXT NOT NULL,
    "methodStepsJson" TEXT NOT NULL DEFAULT '[]',
    "formatsTitle" TEXT NOT NULL DEFAULT '',
    "formatsIntro" TEXT NOT NULL DEFAULT '',
    "formatsJson" TEXT NOT NULL DEFAULT '[]',
    "partnerTitle" TEXT NOT NULL,
    "partnerBody" TEXT NOT NULL,
    "partnerPointsJson" TEXT NOT NULL DEFAULT '[]',
    "testimonialsTitle" TEXT NOT NULL,
    "testimonialIdsJson" TEXT NOT NULL DEFAULT '[]',
    "faqTitle" TEXT NOT NULL,
    "faqsJson" TEXT NOT NULL DEFAULT '[]',
    "ctaEyebrow" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaBody" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Landing" ("caseProjectIdsJson", "casesIntro", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialIdsJson", "testimonialsTitle", "updatedAt") SELECT "caseProjectIdsJson", "casesIntro", "casesTitle", "clientsBody", "clientsTitle", "createdAt", "ctaBody", "ctaEyebrow", "ctaTitle", "faqTitle", "faqsJson", "heroBody", "heroCtaLabel", "heroEyebrow", "heroTitle", "id", "methodIntro", "methodStepsJson", "methodTitle", "navLabel", "order", "painIntro", "painPointsJson", "painTitle", "partnerBody", "partnerPointsJson", "partnerTitle", "published", "seoDescription", "seoTitle", "servicesIntro", "servicesJson", "servicesTitle", "slug", "testimonialIdsJson", "testimonialsTitle", "updatedAt" FROM "Landing";
DROP TABLE "Landing";
ALTER TABLE "new_Landing" RENAME TO "Landing";
CREATE UNIQUE INDEX "Landing_slug_key" ON "Landing"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Landing de Producción Audiovisual con el borrador de textos según las
-- recomendaciones de Dahseo (planilla "Landings: Pinky"): portafolio antes de
-- los puntos de dolor, sección de formatos y sin growth partner. Queda sin
-- publicar hasta validar el copy desde el admin.
INSERT INTO "Landing" ("id", "slug", "order", "published", "navLabel", "sectionOrderJson", "seoTitle", "seoDescription", "heroEyebrow", "heroTitle", "heroBody", "heroCtaLabel", "clientsTitle", "clientsBody", "painTitle", "painIntro", "painPointsJson", "servicesTitle", "servicesIntro", "servicesJson", "casesTitle", "casesIntro", "caseProjectIdsJson", "casesShowVideo", "methodTitle", "methodIntro", "methodStepsJson", "formatsTitle", "formatsIntro", "formatsJson", "partnerTitle", "partnerBody", "testimonialsTitle", "faqTitle", "faqsJson", "ctaEyebrow", "ctaTitle", "ctaBody", "updatedAt")
SELECT
  'landing_produccion_audiovisual',
  'produccion-audiovisual',
  1,
  false,
  'Producción audiovisual',
  '["clients", "cases", "pain", "services", "method", "formats", "testimonials", "faq", "partner"]',
  'Servicios de Producción Audiovisual en Uruguay - Pinky',
  'Producción audiovisual en Uruguay para marcas: spots, videos para redes y filmación de eventos. En Pinky unimos estrategia y creatividad. Contactanos.',
  'Producción audiovisual para marcas',
  'Servicios de Producción Audiovisual *en Uruguay*',
  'Producimos contenido audiovisual para marcas: spots publicitarios, videos para redes, institucionales y cobertura de eventos. Unimos estrategia y creatividad para que cada pieza tenga un objetivo claro y funcione en el canal donde se va a ver.',
  'Solicitá una reunión →',
  'Marcas que *confían* en Pinky',
  'Desde 2010 creamos contenido para marcas de Uruguay y la región, de campañas para televisión a piezas pensadas para redes.',
  'Cuando el video *no está funcionando*',
  'Situaciones que nos plantean las marcas cuando buscan una producción audiovisual profesional.',
  '[{"title": "Videos que nadie termina de ver", "body": "En redes, la atención se juega en los primeros segundos. Pensamos cada pieza para captar desde el inicio y sostener el mensaje hasta el final."}, {"title": "Una imagen que no está a la altura de la marca", "body": "Piezas improvisadas que no reflejan la calidad de lo que ofrecés. Cuidamos la dirección, la imagen y el sonido para que tu marca se vea como corresponde."}, {"title": "El mismo video para todos los canales", "body": "Un spot de TV no funciona igual en un reel ni en una historia. Planificamos desde el rodaje las versiones y formatos que va a necesitar cada canal."}, {"title": "Producciones sin un objetivo claro", "body": "Un video lindo no alcanza si no comunica lo que tiene que comunicar. Partimos de la estrategia: para qué se produce, para quién y dónde se va a ver."}]',
  'Servicios de producción *audiovisual*',
  '',
  '[{"tagline": "Ideas que se convierten en campañas", "title": "Spots *publicitarios.*", "body": "Spots para TV, digital y redes: desde la idea creativa y el guion hasta el rodaje y la postproducción, con la estrategia de la campaña como punto de partida."}, {"tagline": "Pensado para cada plataforma", "title": "Contenido para *redes sociales.*", "body": "Reels, historias y videos cortos pensados para cada plataforma, producidos con la frecuencia que necesita tu marca para mantenerse presente."}, {"tagline": "La historia de tu empresa", "title": "Videos institucionales y *corporativos.*", "body": "Videos que cuentan quiénes son, qué hacen y cómo trabajan, para presentaciones, el sitio web, la comunicación interna y la marca empleadora."}, {"tagline": "Productos en acción", "title": "Videos de *producto.*", "body": "Mostramos tus productos en uso, con contenido que ayuda a entenderlos y elegirlos, tanto para redes como para tu tienda online y la pauta digital."}, {"tagline": "Lo que pasa, contado en video", "title": "Filmación de *eventos.*", "body": "Filmamos lanzamientos, activaciones, acciones BTL y experiencias de marca, y editamos piezas para compartir en redes y otros canales."}, {"tagline": "Del concepto a la entrega", "title": "Dirección creativa y *técnica.*", "body": "Acompañamos cada producción de punta a punta: concepto, guion, rodaje, edición, color y sonido, con un mismo equipo coordinando todo."}]',
  'Portafolio *audiovisual*',
  'Algunas de las producciones que hicimos para las marcas que acompañamos. Dale play para verlas.',
  COALESCE((SELECT json_group_array("id") FROM (SELECT "id" FROM "Project" WHERE "slug" IN ('under-armour-garra-charrua', 'laespecialista-mujeres', 'san-cristobal-mayo-amarillo') ORDER BY CASE "slug" WHEN 'under-armour-garra-charrua' THEN 0 WHEN 'laespecialista-mujeres' THEN 1 WHEN 'san-cristobal-mayo-amarillo' THEN 2 END)), '[]'),
  true,
  'Cómo producimos tu *contenido audiovisual*',
  'El mismo método que aplicamos en cada proyecto, llevado a la producción: del brief a la entrega final, con tu equipo al tanto en cada etapa.',
  '[{"title": "Analizamos", "body": "Partimos del brief: objetivos, público, mensaje y canales donde se va a ver la pieza. Con eso definimos el enfoque creativo."}, {"title": "Planificamos", "body": "Desarrollamos la idea y el guion, y organizamos la preproducción: equipo, casting, locaciones y plan de rodaje, todo validado con vos."}, {"title": "Ejecutamos", "body": "Rodamos y pasamos a la postproducción: edición, color, sonido y gráficos, con instancias de revisión antes de la versión final."}, {"title": "Optimizamos", "body": "Adaptamos la pieza a cada formato y canal y, si se usa en pauta, medimos cómo funciona para mejorar las próximas producciones."}]',
  'Un formato para *cada canal*',
  'Planificamos desde el rodaje todas las versiones que va a necesitar la campaña, para que cada pieza se vea bien donde se publique.',
  '[{"title": "Televisión", "body": "Spots en las duraciones y especificaciones técnicas que pide cada canal."}, {"title": "Redes sociales", "body": "Versiones verticales para reels, historias y TikTok, pensadas para captar en los primeros segundos."}, {"title": "YouTube y web", "body": "Videos horizontales para el sitio, YouTube y presentaciones, en alta calidad."}, {"title": "Pauta digital", "body": "Versiones cortas para campañas en Meta Ads, Google Ads y YouTube, listas para probar y optimizar."}]',
  '',
  '',
  'Lo que dicen *las marcas*',
  'Preguntas *frecuentes*',
  '[{"question": "¿Qué tipo de videos producen?", "answer": "Spots publicitarios para TV, digital y redes, contenido para redes sociales, videos institucionales y corporativos, videos de producto y filmación de eventos. También nos ocupamos de la dirección creativa y técnica de la producción completa."}, {"question": "¿Cómo es el proceso de una producción audiovisual?", "answer": "Empezamos por el brief y los objetivos, desarrollamos la idea y el guion, organizamos la preproducción, filmamos y pasamos a la postproducción. Validamos con tu equipo cada etapa antes de avanzar a la siguiente."}, {"question": "¿Cuánto tiempo lleva producir un video?", "answer": "Depende del tipo de pieza: el contenido para redes se resuelve en menos tiempo que un spot con rodaje y postproducción completa. Al armar la propuesta te pasamos un cronograma con las fechas de cada etapa."}, {"question": "¿Cuánto cuesta una producción audiovisual?", "answer": "Depende del formato, la duración, los días de rodaje y el equipo que necesite el proyecto. Después de la primera reunión te enviamos una propuesta a medida con el detalle de lo que incluye."}, {"question": "¿Entregan el video adaptado a distintos formatos?", "answer": "Sí. Planificamos desde el rodaje las versiones que va a necesitar cada canal, como cortes verticales para redes y versiones cortas para pauta digital."}, {"question": "¿Filman fuera de Montevideo?", "answer": "Sí. Estamos en Montevideo y producimos para marcas de todo Uruguay y la región; coordinamos la logística según lo que requiera cada proyecto."}]',
  'Hablemos de tu próxima producción',
  'Contemos la historia de *tu marca.*',
  'Completá el formulario con algunos datos de tu proyecto y coordinamos una reunión para entender qué necesitás. Después te enviamos una propuesta con los próximos pasos.',
  CURRENT_TIMESTAMP;
