-- El CTA final de las landings va sin párrafo (solo etiqueta, título y botón).
UPDATE "Landing" SET "ctaBody" = '' WHERE "slug" IN ('marketing-digital', 'produccion-audiovisual');
