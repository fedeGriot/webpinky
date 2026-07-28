# Pinky — Web + CMS

Sitio de Pinky (The Fit Agency) construido en Next.js, con un panel de administración propio (`/admin`) para editar el contenido de las secciones del sitio y gestionar los proyectos (casos de estudio) sin tocar código.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma + SQLite (`dev.db` en la raíz del proyecto)
- Sesión de admin propia (cookie firmada con `jose`, contraseña hasheada con `bcryptjs`)
- Subida de imágenes a `public/uploads/`

## Primeros pasos

```bash
npm install
npx prisma migrate dev   # crea/actualiza dev.db
npx prisma db seed       # carga el contenido inicial + usuario admin
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público y [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel.

Las credenciales del primer admin están en `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, usadas por el seed). **Cambiá la contraseña después de tu primer login real** — no hay pantalla de cambio de contraseña todavía; para cambiarla hoy hay que actualizar `ADMIN_PASSWORD` en `.env` y volver a correr `npx prisma db seed` (esto resetea todo el contenido al seed original, así que hacelo solo en desarrollo, o pedime que agregue una pantalla de "cambiar contraseña" cuando la necesites en producción).

> Si `npm run dev` se queda colgado sin responder en tu entorno, probá `npm run build && npm run start` como alternativa (modo producción, sin hot-reload).

## Estructura

- `src/app/page.tsx`, `quienes-somos/`, `que-hacemos/`, `proyectos/` — páginas públicas. Todas renderizan dinámicamente (`export const dynamic = "force-dynamic"`) para reflejar los cambios del CMS sin rebuild.
- `src/app/admin` — panel de administración, protegido por `src/proxy.ts` (equivalente al middleware, renombrado en Next 16).
- `src/lib/data.ts` — funciones de lectura (Prisma) usadas por las páginas públicas.
- `src/lib/actions/` — Server Actions de mutación (secciones y proyectos), usadas por los formularios del admin.
- `prisma/schema.prisma` — modelo de datos. `prisma/seed.ts` — contenido inicial real (extraído de los mockups originales).

## Base de datos en producción

Este proyecto usa SQLite para desarrollo (archivo local, cero configuración). Para producción:

- **VPS / Railway / Fly.io con disco persistente**: funciona tal cual, sin cambios.
- **Vercel u otra plataforma serverless**: SQLite con archivo local no persiste entre despliegues/instancias. Antes de deployar ahí, hay que migrar el `datasource` de `prisma/schema.prisma` a Postgres (por ejemplo Neon o Vercel Postgres) y correr `npx prisma migrate deploy` contra esa base.

## Imágenes subidas

Las imágenes de clientes/proyectos se guardan en `public/uploads/` (no se versionan en git). En un VPS con disco persistente esto funciona sin cambios; en una plataforma serverless vas a necesitar moverlo a un storage externo (S3, Cloudinary, Vercel Blob) — la función `saveUploadedFile` en `src/lib/uploads.ts` está aislada para poder hacer ese cambio sin tocar el resto del código.
