import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/uploadMiddleware.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';
import { handleFileUpload, handleDeleteFile } from '../controllers/uploadController.ts';

const router = Router();

// Wrapper para capturar y formatear errores de Multer de manera amigable
function multerErrorHandler(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'El archivo supera el tamaño máximo permitido (10 MB para imágenes, 100 MB para videos).'
          });
        }
        return res.status(400).json({
          error: `Error en la subida: ${err.message}`
        });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, JPEG, PNG, WEBP) o videos (MP4, WEBM).'
        });
      }
      return res.status(400).json({
        error: err.message || 'Error al cargar el archivo'
      });
    }
    next();
  });
}

// Rutas protegidas para administradores
router.post('/', requireAuth, multerErrorHandler, handleFileUpload);
router.delete('/', requireAuth, handleDeleteFile);

export default router;
