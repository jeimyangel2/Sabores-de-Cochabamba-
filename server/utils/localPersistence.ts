import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Asegurar que exista la carpeta /data
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error al crear directorio /data:', err);
  }
}

/**
 * Lee un archivo JSON de persistencia local
 */
export function readPersistedJson<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) return defaultValue;
    return JSON.parse(content) as T;
  } catch (error) {
    console.warn(`[Local Persistence] Error al leer ${filename}:`, error);
    return defaultValue;
  }
}

/**
 * Guarda un archivo JSON de persistencia local en disco
 */
export function writePersistedJson<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`[Local Persistence] Error al escribir en ${filename}:`, error);
  }
}
