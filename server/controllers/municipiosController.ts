import { Request, Response } from 'express';
import { executeQuery, getDatabaseStatus } from '../config/db.ts';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.ts';
import { initialMunicipios } from '../data/sampleData.ts';
import { Municipio } from '../../src/types/index.ts';
import { deleteLocalUploadFile } from '../utils/fileStorage.ts';
import { readPersistedJson, writePersistedJson } from '../utils/localPersistence.ts';

const MUNICIPIOS_FILE = 'persisted_municipios.json';

// Cargar estado inicial de municipios desde disco persistente o vacío
let persistedMunicipios: Municipio[] = readPersistedJson<Municipio[]>(MUNICIPIOS_FILE, [...initialMunicipios]);

function syncMunicipiosDisk() {
  writePersistedJson(MUNICIPIOS_FILE, persistedMunicipios);
}

export async function getMunicipios(req: Request, res: Response): Promise<void> {
  try {
    const searchTerm = ((req.query.search || req.query.nombre || '') as string).trim().toLowerCase();

    // 1. Supabase si está disponible
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        let query = supabase.from('municipios').select('*');
        if (searchTerm) {
          query = query.ilike('nombre', `%${searchTerm}%`);
        }
        const { data, error } = await query.order('id', { ascending: true });
        if (!error && data) {
          persistedMunicipios = data;
          syncMunicipiosDisk();
          res.json({ source: 'supabase', data });
          return;
        }
      }
    }

    // 2. MySQL si está disponible
    const status = getDatabaseStatus();
    if (status.connected) {
      let sql = `
        SELECT 
          m.id, 
          m.nombre, 
          m.descripcion, 
          m.imagen,
          m.descripcion_cultural, 
          m.lugar_turistico_nombre, 
          m.lugar_turistico_descripcion, 
          m.lugar_turistico_imagen, 
          m.lugar_turistico_video,
          COUNT(p.id) as platos_count
        FROM municipios m
        LEFT JOIN platos p ON m.id = p.municipio_id
      `;
      const params: any[] = [];

      if (searchTerm) {
        sql += ` WHERE LOWER(m.nombre) LIKE ? OR LOWER(m.descripcion) LIKE ? `;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      sql += `
        GROUP BY m.id
        ORDER BY m.id ASC
      `;
      const rows = await executeQuery<any>(sql, params);
      res.json({
        source: 'mysql',
        data: rows || []
      });
      return;
    }

    // 3. Respaldo local persistente
    let list = [...persistedMunicipios];
    if (searchTerm) {
      list = list.filter(
        (m) =>
          m.nombre.toLowerCase().includes(searchTerm) ||
          m.descripcion.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      source: 'persisted_local',
      data: list
    });
  } catch (error: any) {
    console.error('[Get Municipios Error]:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
}

export async function getMunicipioById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const muniId = parseInt(id, 10);

    if (isNaN(muniId)) {
      res.status(400).json({ error: 'ID de municipio inválido' });
      return;
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.from('municipios').select('*').eq('id', muniId).single();
        if (!error && data) {
          res.json({ source: 'supabase', data });
          return;
        }
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        SELECT 
          m.id, 
          m.nombre, 
          m.descripcion, 
          m.imagen,
          m.descripcion_cultural, 
          m.lugar_turistico_nombre, 
          m.lugar_turistico_descripcion, 
          m.lugar_turistico_imagen, 
          m.lugar_turistico_video,
          COUNT(p.id) as platos_count
        FROM municipios m
        LEFT JOIN platos p ON m.id = p.municipio_id
        WHERE m.id = ?
        GROUP BY m.id
        LIMIT 1
      `;
      const rows = await executeQuery<any>(sql, [muniId]);
      if (rows && rows.length > 0) {
        res.json({ source: 'mysql', data: rows[0] });
        return;
      }
    }

    const found = persistedMunicipios.find((m) => m.id === muniId);
    if (found) {
      res.json({ source: 'persisted_local', data: found });
      return;
    }

    res.status(404).json({ error: 'Municipio no encontrado' });
  } catch (error: any) {
    console.error('[Get Municipio By Id Error]:', error);
    res.status(500).json({ error: 'Error al consultar municipio' });
  }
}

export async function createMunicipio(req: Request, res: Response): Promise<void> {
  try {
    const {
      nombre,
      descripcion,
      imagen,
      descripcion_cultural,
      lugar_turistico_nombre,
      lugar_turistico_descripcion,
      lugar_turistico_imagen,
      lugar_turistico_video
    } = req.body;

    if (!nombre || !nombre.trim()) {
      res.status(400).json({ error: 'El nombre del municipio es obligatorio.' });
      return;
    }
    if (!descripcion || !descripcion.trim()) {
      res.status(400).json({ error: 'La descripción del municipio es obligatoria.' });
      return;
    }

    const cleanData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      imagen: imagen && typeof imagen === 'string' && imagen.trim() ? imagen.trim() : null,
      descripcion_cultural: descripcion_cultural && typeof descripcion_cultural === 'string' && descripcion_cultural.trim() ? descripcion_cultural.trim() : '',
      lugar_turistico_nombre: lugar_turistico_nombre && typeof lugar_turistico_nombre === 'string' && lugar_turistico_nombre.trim() ? lugar_turistico_nombre.trim() : '',
      lugar_turistico_descripcion: lugar_turistico_descripcion && typeof lugar_turistico_descripcion === 'string' && lugar_turistico_descripcion.trim() ? lugar_turistico_descripcion.trim() : '',
      lugar_turistico_imagen: lugar_turistico_imagen && typeof lugar_turistico_imagen === 'string' && lugar_turistico_imagen.trim() ? lugar_turistico_imagen.trim() : null,
      lugar_turistico_video: lugar_turistico_video && typeof lugar_turistico_video === 'string' && lugar_turistico_video.trim() ? lugar_turistico_video.trim() : null
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.from('municipios').insert([cleanData]).select().single();
        if (error) {
          console.error('[Supabase Insert Municipio Error]:', error);
          res.status(400).json({ error: `Error en Supabase: ${error.message}` });
          return;
        }
        if (data) {
          persistedMunicipios.push(data);
          syncMunicipiosDisk();
          res.status(201).json({ success: true, message: 'Municipio registrado exitosamente.', data });
          return;
        }
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        INSERT INTO municipios (
          nombre, descripcion, imagen, descripcion_cultural,
          lugar_turistico_nombre, lugar_turistico_descripcion,
          lugar_turistico_imagen, lugar_turistico_video
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result: any = await executeQuery(sql, [
        cleanData.nombre,
        cleanData.descripcion,
        cleanData.imagen,
        cleanData.descripcion_cultural,
        cleanData.lugar_turistico_nombre,
        cleanData.lugar_turistico_descripcion,
        cleanData.lugar_turistico_imagen,
        cleanData.lugar_turistico_video
      ]);
      const newId = result?.insertId || Date.now();
      const createdItem: Municipio = { id: newId, ...cleanData };
      persistedMunicipios.push(createdItem);
      syncMunicipiosDisk();
      res.status(201).json({ success: true, message: 'Municipio registrado exitosamente.', data: createdItem });
      return;
    }

    const newId = persistedMunicipios.length > 0 ? Math.max(...persistedMunicipios.map((m) => m.id)) + 1 : 1;
    const createdItem: Municipio = { id: newId, ...cleanData };
    persistedMunicipios.push(createdItem);
    syncMunicipiosDisk();

    res.status(201).json({
      success: true,
      message: 'Municipio registrado exitosamente.',
      data: createdItem
    });
  } catch (error: any) {
    console.error('[Create Municipio Error]:', error);
    res.status(500).json({ error: 'Error al registrar el municipio.' });
  }
}

export async function updateMunicipio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const muniId = parseInt(id, 10);

    if (isNaN(muniId)) {
      res.status(400).json({ error: 'ID de municipio inválido.' });
      return;
    }

    const previous = persistedMunicipios.find((m) => m.id === muniId);
    if (!previous) {
      res.status(404).json({ error: 'Municipio no encontrado.' });
      return;
    }

    const {
      nombre,
      descripcion,
      imagen,
      descripcion_cultural,
      lugar_turistico_nombre,
      lugar_turistico_descripcion,
      lugar_turistico_imagen,
      lugar_turistico_video
    } = req.body;

    const cleanData = {
      nombre: nombre !== undefined ? (nombre || '').trim() : previous.nombre,
      descripcion: descripcion !== undefined ? (descripcion || '').trim() : previous.descripcion,
      imagen: imagen !== undefined ? (imagen ? imagen.trim() : null) : previous.imagen,
      descripcion_cultural: descripcion_cultural !== undefined ? (descripcion_cultural ? descripcion_cultural.trim() : null) : previous.descripcion_cultural,
      lugar_turistico_nombre: lugar_turistico_nombre !== undefined ? (lugar_turistico_nombre ? lugar_turistico_nombre.trim() : null) : previous.lugar_turistico_nombre,
      lugar_turistico_descripcion: lugar_turistico_descripcion !== undefined ? (lugar_turistico_descripcion ? lugar_turistico_descripcion.trim() : null) : previous.lugar_turistico_descripcion,
      lugar_turistico_imagen: lugar_turistico_imagen !== undefined ? (lugar_turistico_imagen ? lugar_turistico_imagen.trim() : null) : previous.lugar_turistico_imagen,
      lugar_turistico_video: lugar_turistico_video !== undefined ? (lugar_turistico_video ? lugar_turistico_video.trim() : null) : previous.lugar_turistico_video
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error: updateErr } = await supabase.from('municipios').update(cleanData).eq('id', muniId);
        if (updateErr) {
          console.error('[Supabase Update Municipio Error]:', updateErr);
          res.status(400).json({ error: `Error en Supabase: ${updateErr.message}` });
          return;
        }
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        UPDATE municipios SET
          nombre = ?,
          descripcion = ?,
          imagen = ?,
          descripcion_cultural = ?,
          lugar_turistico_nombre = ?,
          lugar_turistico_descripcion = ?,
          lugar_turistico_imagen = ?,
          lugar_turistico_video = ?
        WHERE id = ?
      `;
      await executeQuery(sql, [
        cleanData.nombre,
        cleanData.descripcion,
        cleanData.imagen,
        cleanData.descripcion_cultural,
        cleanData.lugar_turistico_nombre,
        cleanData.lugar_turistico_descripcion,
        cleanData.lugar_turistico_imagen,
        cleanData.lugar_turistico_video,
        muniId
      ]);
    }

    const idx = persistedMunicipios.findIndex((m) => m.id === muniId);
    if (idx !== -1) {
      persistedMunicipios[idx] = { ...persistedMunicipios[idx], ...cleanData };
      syncMunicipiosDisk();
    }

    res.json({
      success: true,
      message: 'Municipio actualizado correctamente.',
      data: { id: muniId, ...cleanData }
    });
  } catch (error: any) {
    console.error('[Update Municipio Error]:', error);
    res.status(500).json({ error: 'Error al actualizar municipio.' });
  }
}

export async function deleteMunicipio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const muniId = parseInt(id, 10);

    if (isNaN(muniId)) {
      res.status(400).json({ error: 'ID de municipio inválido.' });
      return;
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('municipios').delete().eq('id', muniId);
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      await executeQuery('DELETE FROM municipios WHERE id = ?', [muniId]);
    }

    const idx = persistedMunicipios.findIndex((m) => m.id === muniId);
    if (idx !== -1) {
      const muni = persistedMunicipios[idx];
      deleteLocalUploadFile(muni.imagen);
      deleteLocalUploadFile(muni.lugar_turistico_imagen);
      deleteLocalUploadFile(muni.lugar_turistico_video);
      persistedMunicipios.splice(idx, 1);
      syncMunicipiosDisk();
    }

    res.json({
      success: true,
      message: 'Municipio eliminado correctamente.'
    });
  } catch (error: any) {
    console.error('[Delete Municipio Error]:', error);
    res.status(500).json({ error: 'Error al eliminar municipio.' });
  }
}
