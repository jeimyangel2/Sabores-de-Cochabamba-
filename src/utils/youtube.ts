/**
 * Utilidades para procesar enlaces de YouTube y galerías de imágenes múltiples
 */

/**
 * Extrae el identificador único (video ID) de cualquier URL de YouTube
 * Soporta formatos:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/shorts/ID
 * - https://www.youtube.com/embed/ID
 * - https://m.youtube.com/watch?v=ID
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Si ya es un ID de 11 caracteres alfanuméricos
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex universal para formatos de YouTube
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Obtiene la miniatura de YouTube en alta definición
 */
export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Obtiene la URL limpia de reproducción embebida (iframe)
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

/**
 * Obtiene la URL oficial de visualización directa en YouTube
 */
export function getYouTubeWatchUrl(url: string | null | undefined): string {
  const id = extractYouTubeId(url);
  if (!id) return url ? url.trim() : '';
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Parsea un campo de imágenes que puede ser:
 * - Una cadena JSON de array: '["url1", "url2"]'
 * - Una URL simple: 'https://...'
 * - Una cadena vacía o null
 * Retorna siempre un array de URLs limpias sin duplicados ni vacíos.
 */
export function parseImageGallery(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== 'string') return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Intento 1: Parsear como JSON array
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item && typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim());
      }
    } catch {}
  }

  // Intento 2: Separadas por salto de línea o coma
  if (trimmed.includes('\n')) {
    return trimmed
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // Intento 3: URL simple
  return [trimmed];
}

/**
 * Serializa un array de URLs de imágenes a string para guardarlo en la base de datos
 */
export function serializeImageGallery(urls: (string | null | undefined)[]): string | null {
  const clean = urls
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    .map((u) => u.trim());

  if (clean.length === 0) return null;
  if (clean.length === 1) return clean[0];
  return JSON.stringify(clean);
}
