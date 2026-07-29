function hashId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Desplazamiento pseudoaleatorio pero estable por id (no cambia entre recargas).
// Usado en grillas responsive (lg:grid-cols-3) como el listado de /proyectos.
const GRID_STAGGER = [
  "lg:translate-y-0",
  "lg:-translate-y-6",
  "lg:translate-y-4",
  "lg:-translate-y-3",
  "lg:translate-y-6",
];

export function staggerForGrid(id: string) {
  return GRID_STAGGER[hashId(id) % GRID_STAGGER.length];
}

// Usado en filas horizontales siempre visibles a la vez (carrusel), desde sm: en adelante.
const ROW_STAGGER = [
  "sm:translate-y-0",
  "sm:-translate-y-6",
  "sm:translate-y-4",
  "sm:-translate-y-3",
  "sm:translate-y-6",
];

export function staggerForRow(id: string) {
  return ROW_STAGGER[hashId(id) % ROW_STAGGER.length];
}
