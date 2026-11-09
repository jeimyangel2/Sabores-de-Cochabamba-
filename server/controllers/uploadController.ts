import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.ts';
import { deleteLocalUploadFile, UPLOADS_ROOT } from '../utils/fileStorage.ts';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Maneja la subida de un archivo multimedia (imagen o video) directamente
 * a Supabase Storage (bucket 'media') con respaldo local.
 */
export async function handleFileUpload(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha seleccionado ningún archivo para cargar.' });
      return;
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    // Validación estricta de tamaño según categoría
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      res.status(400).json({
        error: 'El archivo supera el tamaño máximo permitido para imágenes (máximo 10 MB).'
      });
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      res.status(400).json({
        error: 'El archivo supera el tamaño máximo permitido para videos (máximo 100 MB).'
      });
      return;
    }

    // Determinar la subcarpeta relativa
    let folder = 'platos';
    const categoryParam = (req.query.category || '').toString();
    if (file.destination.endsWith('municipios') || categoryParam === 'municipios') {
      folder = 'municipios';
    } else if (file.destination.endsWith('videos') || isVideo || categoryParam === 'videos') {
      folder = 'videos';
    } else if (file.destination.endsWith('banners') || categoryParam === 'banners') {
      folder = 'banners';
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const storagePath = `${folder}/${cleanBaseName}-${Date.now()}${fileExt}`;

    // 1. PRIORIDAD: Subir directamente a Supabase Storage (Almacenamiento Permanente en la Nube)
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('media')
            .upload(storagePath, fileBuffer, {
              contentType: file.mimetype,
              upsert: true
            });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(storagePath);

            console.log(`[Supabase Storage] Archivo guardado permanentemente: ${publicUrlData.publicUrl}`);

            // Eliminar copia temporal local en disco
            try {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            } catch {}

            res.status(201).json({
              success: true,
              message: 'Archivo cargado permanentemente en Supabase Storage',
              url: publicUrlData.publicUrl,
              filename: path.basename(storagePath),
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype
            });
            return;
          } else if (uploadErr) {
            console.warn('[Supabase Storage Warning]:', uploadErr.message);
          }
        } catch (supabaseEx) {
          console.warn('[Supabase Storage Exception]:', supabaseEx);
        }
      }
    }

    // 2. Respaldo local si Supabase Storage aún no tiene el bucket o presenta error
    const relativeUrl = `/uploads/${folder}/${file.filename}`;
    console.log(`[Upload Fallback] Guardado localmente como respaldo: ${relativeUrl} (${(file.size / 1024).toFixed(1)} KB)`);

    res.status(201).json({
      success: true,
      message: 'Archivo cargado en almacenamiento local (respaldo)',
      url: relativeUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  } catch (error: any) {
    console.error('[Upload Controller Error]:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }
    res.status(500).json({
      error: 'Error al cargar el archivo'
    });
  }
}

/**
 * Elimina un archivo multimedia (de Supabase Storage o local)
 */
export async function handleDeleteFile(req: Request, res: Response): Promise<void> {
  try {
    const { filePath } = req.body;
    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({ error: 'Ruta de archivo requerida.' });
      return;
    }

    // Si es un archivo de Supabase Storage
    if (filePath.includes('/storage/v1/object/public/media/')) {
      const storageKey = filePath.split('/storage/v1/object/public/media/')[1];
      if (storageKey && isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.storage.from('media').remove([storageKey]);
        }
      }
      res.json({
        success: true,
        message: 'Archivo eliminado de Supabase Storage correctamente'
      });
      return;
    }

    // Si es un archivo local
    const deleted = deleteLocalUploadFile(filePath);
    res.json({
      success: true,
      message: deleted ? 'Archivo eliminado correctamente' : 'No requirió eliminación física.'
    });
  } catch (error: any) {
    console.error('[Delete File Error]:', error);
    res.status(500).json({
      error: 'Error al eliminar el archivo'
    });
  }
}
