import { Request, Response } from 'express';
import { executeQuery, getDatabaseStatus } from '../config/db.ts';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.ts';
import { initialPlatos, initialMunicipios } from '../data/sampleData.ts';
import { Plato } from '../../src/types/index.ts';
import { deleteLocalUploadFile } from '../utils/fileStorage.ts';
import { readPersistedJson, writePersistedJson } from '../utils/localPersistence.ts';

const PLATOS_FILE = 'persisted_platos.json';

// Cargar estado inicial de platos desde disco persistente o muestra
let persistedPlatos: Plato[] = readPersistedJson<Plato[]>(PLATOS_FILE, [...initialPlatos]);

function syncPlatosDisk() {
  writePersistedJson(PLATOS_FILE, persistedPlatos);
}

export async function getPlatos(req: Request, res: Response): Promise<void> {
  try {
    const { municipio_id, destacado, search } = req.query;

    // 1. Supabase si está disponible
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        let query = supabase
          .from('platos')
          .select('*, municipios(nombre)');

        if (municipio_id) {
          query = query.eq('municipio_id', parseInt(municipio_id as string, 10));
        }

        if (destacado === 'true' || destacado === '1') {
          query = query.eq('destacado', 1);
        }

        if (search && typeof search === 'string' && search.trim() !== '') {
          const term = search.trim();
          query = query.or(`nombre.ilike.%${term}%,descripcion.ilike.%${term}%,ingredientes.ilike.%${term}%`);
        }

        const { data, error } = await query.order('destacado', { ascending: false });
        if (!error && data) {
          const mapped: Plato[] = data.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            municipio_id: p.municipio_id,
            municipio_nombre: p.municipios?.nombre || 'Cochabamba',
            imagen_principal: p.imagen_principal,
            ingredientes: p.ingredientes,
            preparacion: p.preparacion,
            imagen_preparacion: p.imagen_preparacion,
            video_preparacion: p.video_preparacion,
            destacado: p.destacado,
            created_at: p.created_at
          }));
          persistedPlatos = mapped;
          syncPlatosDisk();
          res.json({ source: 'supabase', data: mapped });
          return;
        }
      }
    }

    // 2. MySQL si está disponible
    const status = getDatabaseStatus();
    if (status.connected) {
      let sql = `
        SELECT 
          p.id, 
          p.nombre, 
          p.descripcion, 
          p.municipio_id, 
          m.nombre as municipio_nombre,
          p.imagen_principal, 
          p.ingredientes, 
          p.preparacion, 
          p.imagen_preparacion, 
          p.video_preparacion, 
          p.destacado,
          p.created_at
        FROM platos p
        JOIN municipios m ON p.municipio_id = m.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (municipio_id) {
        sql += ' AND p.municipio_id = ?';
        params.push(parseInt(municipio_id as string, 10));
      }

      if (destacado === 'true' || destacado === '1') {
        sql += ' AND p.destacado = 1';
      }

      if (search && typeof search === 'string' && search.trim() !== '') {
        sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.ingredientes LIKE ?)';
        const term = `%${search.trim()}%`;
        params.push(term, term, term);
      }

      sql += ' ORDER BY p.destacado DESC, p.nombre ASC';

      const rows = await executeQuery<any>(sql, params);
      res.json({
        source: 'mysql',
        data: rows || []
      });
      return;
    }

    // 3. Respaldo local persistente garantizado
    let list: Plato[] = [...persistedPlatos].map((p) => {
      const muni = initialMunicipios.find((m) => m.id === p.municipio_id);
      return {
        ...p,
        municipio_nombre: p.municipio_nombre || (muni ? muni.nombre : 'Cochabamba')
      };
    });

    if (municipio_id) {
      const targetMuniId = parseInt(municipio_id as string, 10);
      list = list.filter((p) => p.municipio_id === targetMuniId);
    }

    if (destacado === 'true' || destacado === '1') {
      list = list.filter((p) => Number(p.destacado) === 1);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.ingredientes.toLowerCase().includes(q) ||
          (p.municipio_nombre && p.municipio_nombre.toLowerCase().includes(q))
      );
    }

    res.json({
      source: 'persisted_local',
      data: list
    });
  } catch (error: any) {
    console.error('[Get Platos Error]:', error);
    res.status(500).json({ error: 'Error al obtener platos típicos' });
  }
}

export async function getPlatoById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const platoId = parseInt(id, 10);

    if (isNaN(platoId)) {
      res.status(400).json({ error: 'ID de plato inválido' });
      return;
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('platos')
          .select('*, municipios(nombre)')
          .eq('id', platoId)
          .single();

        if (!error && data) {
          const item: Plato = {
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            municipio_id: data.municipio_id,
            municipio_nombre: data.municipios?.nombre || 'Cochabamba',
            imagen_principal: data.imagen_principal,
            ingredientes: data.ingredientes,
            preparacion: data.preparacion,
            imagen_preparacion: data.imagen_preparacion,
            video_preparacion: data.video_preparacion,
            destacado: data.destacado,
            created_at: data.created_at
          };
          res.json({ source: 'supabase', data: item });
          return;
        }
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        SELECT 
          p.id, 
          p.nombre, 
          p.descripcion, 
          p.municipio_id, 
          m.nombre as municipio_nombre,
          p.imagen_principal, 
          p.ingredientes, 
          p.preparacion, 
          p.imagen_preparacion, 
          p.video_preparacion, 
          p.destacado,
          p.created_at
        FROM platos p
        JOIN municipios m ON p.municipio_id = m.id
        WHERE p.id = ?
        LIMIT 1
      `;
      const rows = await executeQuery<any>(sql, [platoId]);
      if (rows && rows.length > 0) {
        res.json({ source: 'mysql', data: rows[0] });
        return;
      }
    }

    const found = persistedPlatos.find((p) => p.id === platoId);
    if (found) {
      const muni = initialMunicipios.find((m) => m.id === found.municipio_id);
      res.json({
        source: 'persisted_local',
        data: {
          ...found,
          municipio_nombre: found.municipio_nombre || (muni ? muni.nombre : 'Cochabamba')
        }
      });
      return;
    }

    res.status(404).json({ error: 'Plato típico no encontrado' });
  } catch (error: any) {
    console.error('[Get Plato By Id Error]:', error);
    res.status(500).json({ error: 'Error al consultar plato típico' });
  }
}

export async function createPlato(req: Request, res: Response): Promise<void> {
  try {
    const {
      nombre,
      municipio_id,
      descripcion,
      imagen_principal,
      ingredientes,
      preparacion,
      imagen_preparacion,
      video_preparacion,
      destacado
    } = req.body;

    if (!nombre || !nombre.trim()) {
      res.status(400).json({ error: 'El nombre del plato es obligatorio.' });
      return;
    }
    const parsedMuniId = parseInt(municipio_id, 10);
    if (isNaN(parsedMuniId)) {
      res.status(400).json({ error: 'Debe seleccionar un municipio válido.' });
      return;
    }
    if (!descripcion || !descripcion.trim()) {
      res.status(400).json({ error: 'La descripción del plato es obligatoria.' });
      return;
    }
    if (!ingredientes || !ingredientes.trim()) {
      res.status(400).json({ error: 'Los ingredientes son obligatorios.' });
      return;
    }
    if (!preparacion || !preparacion.trim()) {
      res.status(400).json({ error: 'Los pasos de preparación son obligatorios.' });
      return;
    }

    const isDestacado = destacado === true || destacado === 1 || destacado === '1' ? 1 : 0;

    const cleanData = {
      nombre: nombre.trim(),
      municipio_id: parsedMuniId,
      descripcion: descripcion.trim(),
      imagen_principal: imagen_principal && typeof imagen_principal === 'string' && imagen_principal.trim() ? imagen_principal.trim() : null,
      ingredientes: ingredientes.trim(),
      preparacion: preparacion.trim(),
      imagen_preparacion: imagen_preparacion && typeof imagen_preparacion === 'string' && imagen_preparacion.trim() ? imagen_preparacion.trim() : null,
      video_preparacion: video_preparacion && typeof video_preparacion === 'string' && video_preparacion.trim() ? video_preparacion.trim() : null,
      destacado: isDestacado
    };

    let muniNombre = 'Cochabamba';
    const foundMuni = initialMunicipios.find((m) => m.id === parsedMuniId);
    if (foundMuni) {
      muniNombre = foundMuni.nombre;
    }

    // 1. Supabase insert
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        // Validar que el municipio existe en Supabase para evitar errores de Foreign Key
        const { data: muniCheck } = await supabase
          .from('municipios')
          .select('id, nombre')
          .eq('id', cleanData.municipio_id)
          .maybeSingle();

        if (muniCheck) {
          muniNombre = muniCheck.nombre;
        } else {
          // Si el municipio seleccionado no existe, vincular al primer municipio disponible en Supabase
          const { data: firstMuni } = await supabase
            .from('municipios')
            .select('id, nombre')
            .order('id', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (firstMuni) {
            cleanData.municipio_id = firstMuni.id;
            muniNombre = firstMuni.nombre;
          }
        }

        const { data, error } = await supabase.from('platos').insert([cleanData]).select().single();
        if (error) {
          console.error('[Supabase Insert Plato Error]:', error);
          res.status(400).json({ error: `Error en Supabase: ${error.message}` });
          return;
        }

        if (data) {
          const item: Plato = { ...data, municipio_nombre: muniNombre };
          persistedPlatos.push(item);
          syncPlatosDisk();
          res.status(201).json({ success: true, message: 'Plato registrado exitosamente.', data: item });
          return;
        }
      }
    }

    // 2. MySQL insert
    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        INSERT INTO platos (
          nombre, municipio_id, descripcion, imagen_principal,
          ingredientes, preparacion, imagen_preparacion, video_preparacion, destacado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result: any = await executeQuery(sql, [
        cleanData.nombre,
        cleanData.municipio_id,
        cleanData.descripcion,
        cleanData.imagen_principal,
        cleanData.ingredientes,
        cleanData.preparacion,
        cleanData.imagen_preparacion,
        cleanData.video_preparacion,
        cleanData.destacado
      ]);

      const newId = result?.insertId || Date.now();
      const createdItem: Plato = { id: newId, ...cleanData, municipio_nombre: muniNombre };
      persistedPlatos.push(createdItem);
      syncPlatosDisk();
      res.status(201).json({ success: true, message: 'Plato registrado exitosamente.', data: createdItem });
      return;
    }

    // 3. Local persistente
    const newId = persistedPlatos.length > 0 ? Math.max(...persistedPlatos.map((p) => p.id)) + 1 : 1;
    const createdItem: Plato = {
      id: newId,
      ...cleanData,
      municipio_nombre: muniNombre
    };
    persistedPlatos.push(createdItem);
    syncPlatosDisk();

    res.status(201).json({
      success: true,
      message: 'Plato registrado exitosamente.',
      data: createdItem
    });
  } catch (error: any) {
    console.error('[Create Plato Error]:', error);
    res.status(500).json({ error: 'Error al registrar el plato: ' + (error.message || '') });
  }
}

export async function updatePlato(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const platoId = parseInt(id, 10);

    if (isNaN(platoId)) {
      res.status(400).json({ error: 'ID de plato inválido.' });
      return;
    }

    const previousPlato = persistedPlatos.find((p) => p.id === platoId);

    const {
      nombre,
      municipio_id,
      descripcion,
      imagen_principal,
      ingredientes,
      preparacion,
      imagen_preparacion,
      video_preparacion,
      destacado
    } = req.body;

    const finalNombre = nombre !== undefined ? (nombre || '').trim() : (previousPlato?.nombre || '');
    const finalMuniId = municipio_id !== undefined ? parseInt(municipio_id, 10) : (previousPlato?.municipio_id || 1);
    const finalDesc = descripcion !== undefined ? (descripcion || '').trim() : (previousPlato?.descripcion || '');
    const finalIngr = ingredientes !== undefined ? (ingredientes || '').trim() : (previousPlato?.ingredientes || '');
    const finalPrep = preparacion !== undefined ? (preparacion || '').trim() : (previousPlato?.preparacion || '');
    const finalImagenPrinc = imagen_principal !== undefined ? (imagen_principal ? imagen_principal.trim() : null) : (previousPlato?.imagen_principal || null);
    const finalImagenPrep = imagen_preparacion !== undefined ? (imagen_preparacion ? imagen_preparacion.trim() : null) : (previousPlato?.imagen_preparacion || null);
    const finalVideoPrep = video_preparacion !== undefined ? (video_preparacion ? video_preparacion.trim() : null) : (previousPlato?.video_preparacion || null);
    const isDestacado = destacado !== undefined ? (destacado === true || destacado === 1 || destacado === '1' ? 1 : 0) : (previousPlato?.destacado || 0);

    const cleanData = {
      nombre: finalNombre,
      municipio_id: finalMuniId,
      descripcion: finalDesc,
      imagen_principal: finalImagenPrinc,
      ingredientes: finalIngr,
      preparacion: finalPrep,
      imagen_preparacion: finalImagenPrep,
      video_preparacion: finalVideoPrep,
      destacado: isDestacado
    };

    let muniNombre = previousPlato?.municipio_nombre || 'Cochabamba';

    // Supabase update
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        // Validar que el municipio existe en Supabase
        const { data: muniCheck } = await supabase
          .from('municipios')
          .select('id, nombre')
          .eq('id', cleanData.municipio_id)
          .maybeSingle();

        if (muniCheck) {
          muniNombre = muniCheck.nombre;
        } else {
          const { data: firstMuni } = await supabase
            .from('municipios')
            .select('id, nombre')
            .order('id', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (firstMuni) {
            cleanData.municipio_id = firstMuni.id;
            muniNombre = firstMuni.nombre;
          }
        }

        const { data: updatedSupabase, error: updateErr } = await supabase
          .from('platos')
          .update(cleanData)
          .eq('id', platoId)
          .select()
          .maybeSingle();

        if (updateErr) {
          console.error('[Supabase Update Plato Error]:', updateErr);
          res.status(400).json({ error: `Error en Supabase: ${updateErr.message}` });
          return;
        }
      }
    }

    // MySQL update
    const status = getDatabaseStatus();
    if (status.connected) {
      const sql = `
        UPDATE platos SET
          nombre = ?,
          municipio_id = ?,
          descripcion = ?,
          imagen_principal = ?,
          ingredientes = ?,
          preparacion = ?,
          imagen_preparacion = ?,
          video_preparacion = ?,
          destacado = ?
        WHERE id = ?
      `;
      await executeQuery(sql, [
        cleanData.nombre,
        cleanData.municipio_id,
        cleanData.descripcion,
        cleanData.imagen_principal,
        cleanData.ingredientes,
        cleanData.preparacion,
        cleanData.imagen_preparacion,
        cleanData.video_preparacion,
        cleanData.destacado,
        platoId
      ]);
    }

    // Actualizar en disco persistente
    const idx = persistedPlatos.findIndex((p) => p.id === platoId);
    const muni = initialMunicipios.find((m) => m.id === cleanData.municipio_id);
    if (idx !== -1) {
      persistedPlatos[idx] = {
        ...persistedPlatos[idx],
        ...cleanData,
        municipio_nombre: muni ? muni.nombre : persistedPlatos[idx].municipio_nombre
      };
      syncPlatosDisk();
    }

    res.json({
      success: true,
      message: 'Plato actualizado correctamente.',
      data: { id: platoId, ...cleanData, municipio_nombre: muni?.nombre }
    });
  } catch (error: any) {
    console.error('[Update Plato Error]:', error);
    res.status(500).json({ error: 'Error al actualizar el plato.' });
  }
}

export async function deletePlato(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const platoId = parseInt(id, 10);

    if (isNaN(platoId)) {
      res.status(400).json({ error: 'ID de plato inválido.' });
      return;
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('platos').delete().eq('id', platoId);
      }
    }

    const status = getDatabaseStatus();
    if (status.connected) {
      await executeQuery('DELETE FROM platos WHERE id = ?', [platoId]);
    }

    const pIdx = persistedPlatos.findIndex((p) => p.id === platoId);
    if (pIdx !== -1) {
      const platoToDelete = persistedPlatos[pIdx];
      deleteLocalUploadFile(platoToDelete.imagen_principal);
      deleteLocalUploadFile(platoToDelete.imagen_preparacion);
      deleteLocalUploadFile(platoToDelete.video_preparacion);
      persistedPlatos.splice(pIdx, 1);
      syncPlatosDisk();
    }

    res.json({
      success: true,
      message: 'Plato y sus archivos eliminados correctamente.'
    });
  } catch (error: any) {
    console.error('[Delete Plato Error]:', error);
    res.status(500).json({ error: 'Error al eliminar el plato.' });
  }
}
