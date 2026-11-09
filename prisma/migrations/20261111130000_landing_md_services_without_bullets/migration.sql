-- Los servicios de las landings van sin lista de puntos (solo el párrafo):
-- se quita la clave "bullets" de cada servicio de Marketing Digital.
UPDATE "Landing"
SET "servicesJson" = (
  SELECT json_group_array(json_remove(value, '$.bullets'))
  FROM json_each("Landing"."servicesJson")
)
WHERE "slug" = 'marketing-digital';
