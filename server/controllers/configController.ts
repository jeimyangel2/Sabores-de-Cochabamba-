import { Request, Response } from 'express';
import { executeQuery, getPool } from '../config/db.ts';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.ts';
import { initialHeroConfig } from '../data/sampleData.ts';
import { HeroConfig } from '../../src/types/index.ts';
import { deleteLocalUploadFile } from '../utils/fileStorage.ts';
import { readPersistedJson, writePersistedJson } from '../utils/localPersistence.ts';

const HERO_FILE = 'persisted_hero_config.json';

// Cargar estado inicial desde disco permanente (si existe) o desde sampleData
let inMemoryHeroConfig: HeroConfig = readPersistedJson<HeroConfig>(HERO_FILE, { ...initialHeroConfig });

/**
 * Obtiene la configuración actual del banner y platillo insignia (Público)
 */
export async function getHeroConfig(req: Request, res: Response): Promise<void> {
  try {
    // 1. Prioridad: Supabase PostgreSQL si está configurado
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('configuracion_hero')
          .select('*')
          .eq('id', 1)
          .single();

        if (!error && data) {
          const config: HeroConfig = {
            id: 1,
            banner_imagen: data.banner_imagen || inMemoryHeroConfig.banner_imagen,
            banner_titulo: data.banner_titulo || inMemoryHeroConfig.banner_titulo,
            banner_subtitulo: data.banner_subtitulo || inMemoryHeroConfig.banner_subtitulo,
            banner_descripcion: data.banner_descripcion !== undefined ? data.banner_descripcion : inMemoryHeroConfig.banner_descripcion,
            insignia_titulo: data.insignia_titulo || inMemoryHeroConfig.insignia_titulo,
            insignia_subtitulo: data.insignia_subtitulo || inMemoryHeroConfig.insignia_subtitulo,
            insignia_imagen: data.insignia_imagen || inMemoryHeroConfig.insignia_imagen,
            insignia_descripcion: data.insignia_descripcion || inMemoryHeroConfig.insignia_descripcion,
            insignia_plato_id: data.insignia_plato_id !== null ? Number(data.insignia_plato_id) : null,
            updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
          };
          inMemoryHeroConfig = { ...config };
          writePersistedJson(HERO_FILE, inMemoryHeroConfig);
          res.json({ success: true, data: config });
          return;
        }
      }
    }

    // 2. MySQL fallback si está disponible
    const pool = getPool();
    if (pool) {
      try {
        const rows = await executeQuery<any>(
          'SELECT * FROM configuracion_hero WHERE id = 1 LIMIT 1'
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          const config: HeroConfig = {
            id: 1,
            banner_imagen: row.banner_imagen || inMemoryHeroConfig.banner_imagen,
            banner_titulo: row.banner_titulo || inMemoryHeroConfig.banner_titulo,
            banner_subtitulo: row.banner_subtitulo || inMemoryHeroConfig.banner_subtitulo,
            banner_descripcion: row.banner_descripcion !== undefined ? row.banner_descripcion : inMemoryHeroConfig.banner_descripcion,
            insignia_titulo: row.insignia_titulo || inMemoryHeroConfig.insignia_titulo,
            insignia_subtitulo: row.insignia_subtitulo || inMemoryHeroConfig.insignia_subtitulo,
            insignia_imagen: row.insignia_imagen || inMemoryHeroConfig.insignia_imagen,
            insignia_descripcion: row.insignia_descripcion || inMemoryHeroConfig.insignia_descripcion,
            insignia_plato_id: row.insignia_plato_id !== null ? Number(row.insignia_plato_id) : null,
            updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
          };
          inMemoryHeroConfig = { ...config };
          writePersistedJson(HERO_FILE, inMemoryHeroConfig);
          res.json({ success: true, data: config });
          return;
        }
      } catch (dbErr) {
        console.warn('[Config Controller] MySQL no disponible, usando almacenamiento persistente local.');
      }
    }

    // 3. Almacén persistente garantizado
    res.json({ success: true, data: inMemoryHeroConfig });
  } catch (error) {
    console.error('[Config Controller Error]:', error);
    res.status(500).json({ error: 'Error interno al consultar la configuración de portada.' });
  }
}

/**
 * Actualiza la configuración del banner y platillo insignia (Requiere autenticación de Administrador)
 */
export async function updateHeroConfig(req: Request, res: Response): Promise<void> {
  try {
    const {
      banner_imagen,
      banner_titulo,
      banner_subtitulo,
      banner_descripcion,
      insignia_titulo,
      insignia_subtitulo,
      insignia_imagen,
      insignia_descripcion,
      insignia_plato_id
    } = req.body;

    const prevConfig = { ...inMemoryHeroConfig };

    // Si se reemplazaron imágenes locales, eliminar archivos huérfanos anteriores
    if (
      prevConfig.banner_imagen &&
      banner_imagen !== undefined &&
      prevConfig.banner_imagen !== banner_imagen &&
      prevConfig.banner_imagen.startsWith('/uploads/')
    ) {
      deleteLocalUploadFile(prevConfig.banner_imagen);
    }

    if (
      prevConfig.insignia_imagen &&
      insignia_imagen !== undefined &&
      prevConfig.insignia_imagen !== insignia_imagen &&
      prevConfig.insignia_imagen.startsWith('/uploads/')
    ) {
      deleteLocalUploadFile(prevConfig.insignia_imagen);
    }

    const updatedConfig: HeroConfig = {
      id: 1,
      banner_imagen: banner_imagen !== undefined ? banner_imagen : inMemoryHeroConfig.banner_imagen,
      banner_titulo: (banner_titulo || inMemoryHeroConfig.banner_titulo).trim(),
      banner_subtitulo: (banner_subtitulo || inMemoryHeroConfig.banner_subtitulo).trim(),
      banner_descripcion: banner_descripcion !== undefined ? banner_descripcion : inMemoryHeroConfig.banner_descripcion,
      insignia_titulo: (insignia_titulo || inMemoryHeroConfig.insignia_titulo).trim(),
      insignia_subtitulo: (insignia_subtitulo || inMemoryHeroConfig.insignia_subtitulo).trim(),
      insignia_imagen: insignia_imagen !== undefined ? insignia_imagen : inMemoryHeroConfig.insignia_imagen,
      insignia_descripcion: (insignia_descripcion || inMemoryHeroConfig.insignia_descripcion).trim(),
      insignia_plato_id: insignia_plato_id !== undefined ? (insignia_plato_id ? Number(insignia_plato_id) : null) : inMemoryHeroConfig.insignia_plato_id,
      updated_at: new Date().toISOString()
    };

    // 1. Guardar en Supabase PostgreSQL (si está conectado)
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('configuracion_hero').upsert({
            id: 1,
            banner_imagen: updatedConfig.banner_imagen,
            banner_titulo: updatedConfig.banner_titulo,
            banner_subtitulo: updatedConfig.banner_subtitulo,
            banner_descripcion: updatedConfig.banner_descripcion,
            insignia_titulo: updatedConfig.insignia_titulo,
            insignia_subtitulo: updatedConfig.insignia_subtitulo,
            insignia_imagen: updatedConfig.insignia_imagen,
            insignia_descripcion: updatedConfig.insignia_descripcion,
            insignia_plato_id: updatedConfig.insignia_plato_id,
            updated_at: new Date().toISOString()
          });
        } catch (supErr) {
          console.warn('[Config Controller] Error al guardar en Supabase:', supErr);
        }
      }
    }

    // 2. Guardar en MySQL si existe
    const pool = getPool();
    if (pool) {
      try {
        await executeQuery(
          `INSERT INTO configuracion_hero (
            id, banner_imagen, banner_titulo, banner_subtitulo, banner_descripcion,
            insignia_titulo, insignia_subtitulo, insignia_imagen, insignia_descripcion, insignia_plato_id
          ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            banner_imagen = VALUES(banner_imagen),
            banner_titulo = VALUES(banner_titulo),
            banner_subtitulo = VALUES(banner_subtitulo),
            banner_descripcion = VALUES(banner_descripcion),
            insignia_titulo = VALUES(insignia_titulo),
            insignia_subtitulo = VALUES(insignia_subtitulo),
            insignia_imagen = VALUES(insignia_imagen),
            insignia_descripcion = VALUES(insignia_descripcion),
            insignia_plato_id = VALUES(insignia_plato_id),
            updated_at = CURRENT_TIMESTAMP`,
          [
            updatedConfig.banner_imagen,
            updatedConfig.banner_titulo,
            updatedConfig.banner_subtitulo,
            updatedConfig.banner_descripcion,
            updatedConfig.insignia_titulo,
            updatedConfig.insignia_subtitulo,
            updatedConfig.insignia_imagen,
            updatedConfig.insignia_descripcion,
            updatedConfig.insignia_plato_id
          ]
        );
      } catch (dbErr) {
        console.warn('[Config Controller] No se pudo guardar en MySQL, continuando...');
      }
    }

    // 3. Escribir SIEMPRE en disco local para garantizar persistencia perpetua
    inMemoryHeroConfig = { ...updatedConfig };
    writePersistedJson(HERO_FILE, inMemoryHeroConfig);

    res.json({
      success: true,
      message: 'Configuración del banner y platillo insignia guardada permanentemente.',
      data: updatedConfig
    });
  } catch (error) {
    console.error('[Config Controller Update Error]:', error);
    res.status(500).json({ error: 'Error interno al actualizar la configuración de portada.' });
  }
}

/**
 * Restablece la configuración a los valores por defecto (Pique Macho tradicional)
 */
export async function resetHeroConfig(req: Request, res: Response): Promise<void> {
  try {
    const defaultConfig = { ...initialHeroConfig, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('configuracion_hero').upsert({
            id: 1,
            ...defaultConfig,
            updated_at: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Error al resetear en Supabase:', e);
        }
      }
    }

    const pool = getPool();
    if (pool) {
      try {
        await executeQuery(
          `UPDATE configuracion_hero SET
            banner_imagen = ?,
            banner_titulo = ?,
            banner_subtitulo = ?,
            banner_descripcion = ?,
            insignia_titulo = ?,
            insignia_subtitulo = ?,
            insignia_imagen = ?,
            insignia_descripcion = ?,
            insignia_plato_id = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = 1`,
          [
            defaultConfig.banner_imagen,
            defaultConfig.banner_titulo,
            defaultConfig.banner_subtitulo,
            defaultConfig.banner_descripcion,
            defaultConfig.insignia_titulo,
            defaultConfig.insignia_subtitulo,
            defaultConfig.insignia_imagen,
            defaultConfig.insignia_descripcion,
            defaultConfig.insignia_plato_id
          ]
        );
      } catch (err) {
        console.warn('Error al resetear en MySQL:', err);
      }
    }

    inMemoryHeroConfig = { ...defaultConfig };
    writePersistedJson(HERO_FILE, inMemoryHeroConfig);

    res.json({
      success: true,
      message: 'Configuración restablecida a los valores por defecto.',
      data: inMemoryHeroConfig
    });
  } catch (error) {
    console.error('[Config Controller Reset Error]:', error);
    res.status(500).json({ error: 'Error interno al restablecer la portada.' });
  }
}
