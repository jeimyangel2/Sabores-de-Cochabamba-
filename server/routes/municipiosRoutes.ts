import { Router } from 'express';
import {
  getMunicipios,
  getMunicipioById,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio
} from '../controllers/municipiosController.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

const router = Router();

// Rutas públicas
router.get('/', getMunicipios);
router.get('/:id', getMunicipioById);

// Rutas protegidas para administración
router.post('/', requireAuth, createMunicipio);
router.put('/:id', requireAuth, updateMunicipio);
router.delete('/:id', requireAuth, deleteMunicipio);

export default router;
