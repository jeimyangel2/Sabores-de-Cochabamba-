import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.ts';
import {
  getHeroConfig,
  updateHeroConfig,
  resetHeroConfig
} from '../controllers/configController.ts';

const router = Router();

// Ruta pública para cargar la configuración de portada en la vista de Inicio
router.get('/hero', getHeroConfig);

// Rutas protegidas para administradores (edwin / admin)
router.put('/hero', requireAuth, updateHeroConfig);
router.post('/hero/reset', requireAuth, resetHeroConfig);

export default router;
