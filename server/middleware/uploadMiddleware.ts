import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import {
  ensureUploadDirectories,
  MUNICIPIOS_UPLOADS,
  PLATOS_UPLOADS,
  VIDEOS_UPLOADS,
  BANNERS_UPLOADS
} from '../utils/fileStorage.ts';

// Asegurar que las carpetas existan al inicializar
ensureUploadDirectories();

// Extensiones y MIME types autorizados
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm'];

// Configuración de almacenamiento físico en disco
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    ensureUploadDirectories();

    const category = (req.query.category || req.body.category || '').toString().toLowerCase();

    if (category === 'videos' || file.mimetype.startsWith('video/')) {
      cb(null, VIDEOS_UPLOADS);
    } else if (category === 'municipios') {
      cb(null, MUNICIPIOS_UPLOADS);
    } else if (category === 'banners' || category === 'banner' || category === 'hero' || category === 'insignia') {
      cb(null, BANNERS_UPLOADS);
    } else {
      // Por defecto a platos
      cb(null, PLATOS_UPLOADS);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    const finalFilename = `${baseName || 'archivo'}-${uniqueSuffix}${ext}`;
    cb(null, finalFilename);
  }
});

// Filtro de validación rigurosa de tipo MIME y extensión
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isImage = ALLOWED_IMAGE_MIMES.includes(mime) && ALLOWED_IMAGE_EXTS.includes(ext);
  const isVideo = ALLOWED_VIDEO_MIMES.includes(mime) && ALLOWED_VIDEO_EXTS.includes(ext);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    const error = new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, JPEG, PNG, WEBP) o videos (MP4, WEBM).');
    (error as any).code = 'INVALID_FILE_TYPE';
    cb(error);
  }
};

// Instancia de Multer con límite de 100MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB máx absoluto (para videos)
  }
});
