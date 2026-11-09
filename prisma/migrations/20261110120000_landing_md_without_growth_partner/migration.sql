-- La sección Growth partner queda reservada para las landings de Ecommerce y
-- Performance: en Marketing Digital se vacía (vacía = no se muestra).
UPDATE "Landing" SET "partnerBody" = '', "partnerPointsJson" = '[]' WHERE "slug" = 'marketing-digital';
