import { Router } from 'express';
import {
  getPlatos,
  getPlatoById,
  createPlato,
  updatePlato,
  deletePlato
} from '../controllers/platosController.ts';
import { requireAuth } from '../middleware/authMiddleware.ts';

const router = Router();

// Rutas públicas
router.get('/', getPlatos);
router.get('/:id', getPlatoById);

// Rutas protegidas para administración
router.post('/', requireAuth, createPlato);
router.put('/:id', requireAuth, updatePlato);
router.patch('/:id', requireAuth, updatePlato);
router.delete('/:id', requireAuth, deletePlato);

export default router;
