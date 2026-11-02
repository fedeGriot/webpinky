-- AlterTable
ALTER TABLE "Project" ADD COLUMN "seoDescription" TEXT;

-- Backfill (auditoría SEO, nov 2026): meta descriptions escritas a mano para
-- los proyectos cargados en producción — 70–160 caracteres, dentro de 960px
-- y terminando en un llamado a la acción. Un slug que no exista no hace nada;
-- desde acá en adelante se editan en el admin (campo "Meta description").
UPDATE "Project" SET "seoDescription" = 'Estrategia 360° para el lanzamiento de Cinnabon en Uruguay: expectativa, comunidad y una apertura de alto impacto desde el día uno. Conocé el caso.' WHERE "slug" = 'cinnabon-lanzamiento-uruguay' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Campaña 360° de concientización y venta para la línea solar de Dermaglós bajo el concepto "Proteger está en tus manos". Conocé el caso.' WHERE "slug" = 'dermaglos-solares-360' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Celebramos los 3 años de El Dorado PRO con una campaña 360° que puso a sus clientes en el centro. Conocé el caso completo.' WHERE "slug" = 'eldorado-3pro' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Contenido para acercar Essen al consumidor local y mostrar sus productos en acción desde una mirada actual. Conocé el caso completo.' WHERE "slug" = 'essen-contenidos' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Estrategia integral de medios y eCommerce que llevó a Farmacias Pigalle a su mejor facturación interanual. Conocé el caso completo.' WHERE "slug" = 'farmacias-pigalle-cyber' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Cuatro mujeres reales y sus historias: una campaña que llevó a La Especialista más allá de la cocina para conectar desde las emociones. Ver caso.' WHERE "slug" = 'laespecialista-mujeres' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Sorrentinos con forma de corazón: convertimos una tradición de San Valentín en un nuevo producto para La Especialista. Conocé el caso.' WHERE "slug" = 'laespecialista-valentinos' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Estrategia multicanal de crecimiento para todo el ecosistema de marcas de Mundo Mascota. Conocé cómo lo hicimos en el caso completo.' WHERE "slug" = 'mundo-mascota-estrategia' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Mayo Amarillo, la campaña de concientización vial que creamos para San Cristóbal Seguros. Conocé el caso completo.' WHERE "slug" = 'san-cristobal-mayo-amarillo' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Garra Charrúa: la narrativa de Under Armour que acompañó al rugby uruguayo rumbo a la Rugby World Cup France 2023. Conocé el caso.' WHERE "slug" = 'under-armour-garra-charrua' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Celebramos el primer aniversario de El Dorado en Salto con comunicación, entretenimiento y experiencias en la sucursal. Conocé el caso.' WHERE "slug" = 'eldorado-salto' AND "seoDescription" IS NULL;
UPDATE "Project" SET "seoDescription" = 'Una campaña 360° que conectó a El Dorado con las costumbres más típicas del verano, en múltiples medios. Conocé el caso completo.' WHERE "slug" = 'eldorado-verano' AND "seoDescription" IS NULL;
