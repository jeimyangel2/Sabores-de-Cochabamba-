import fs from 'fs';
import path from 'path';

export const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
export const MUNICIPIOS_UPLOADS = path.join(UPLOADS_ROOT, 'municipios');
export const PLATOS_UPLOADS = path.join(UPLOADS_ROOT, 'platos');
export const VIDEOS_UPLOADS = path.join(UPLOADS_ROOT, 'videos');
export const BANNERS_UPLOADS = path.join(UPLOADS_ROOT, 'banners');

/**
 * Asegura que los directorios locales existan físicamente en el disco
 */
export function ensureUploadDirectories(): void {
  const dirs = [UPLOADS_ROOT, MUNICIPIOS_UPLOADS, PLATOS_UPLOADS, VIDEOS_UPLOADS, BANNERS_UPLOADS];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Elimina un archivo local dentro de la carpeta uploads si existe.
 * Previene ataques de Directory Traversal validando la ruta canónica.
 */
export function deleteLocalUploadFile(fileUrlOrPath: string | null | undefined): boolean {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') {
    return false;
  }

  // Solo procesar archivos que correspondan a rutas locales dentro de /uploads/
  const trimmed = fileUrlOrPath.trim();
  if (!trimmed.startsWith('/uploads/') && !trimmed.startsWith('uploads/')) {
    return false;
  }

  try {
    const cleanRelativePath = trimmed.replace(/^\/?uploads\//, '');
    const fullPath = path.resolve(UPLOADS_ROOT, cleanRelativePath);

    // Validación de seguridad contra Directory Traversal (debe estar dentro de UPLOADS_ROOT)
    if (!fullPath.startsWith(UPLOADS_ROOT)) {
      console.warn(`[Security Warning] Intento de acceso a ruta fuera de uploads: ${fullPath}`);
      return false;
    }

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
      console.log(`[File Storage] Archivo local eliminado físicamente: ${fullPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[File Storage Error] Error al eliminar archivo ${fileUrlOrPath}:`, error);
    return false;
  }
}
