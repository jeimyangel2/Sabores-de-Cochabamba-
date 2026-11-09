import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { initializeDatabasePool } from './server/config/db.ts';
import municipiosRoutes from './server/routes/municipiosRoutes.ts';
import platosRoutes from './server/routes/platosRoutes.ts';
import statusRoutes from './server/routes/statusRoutes.ts';
import authRoutes from './server/routes/authRoutes.ts';
import uploadRoutes from './server/routes/uploadRoutes.ts';
import configRoutes from './server/routes/configRoutes.ts';
import { ensureUploadDirectories, UPLOADS_ROOT } from './server/utils/fileStorage.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Asegurar directorios de carga física local
  ensureUploadDirectories();

  // Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  app.use(cookieParser());

  // Servir archivos multimedia locales subidos (imágenes y videos)
  app.use('/uploads', express.static(UPLOADS_ROOT));

  // Inicializar pool de conexiones a MySQL 8.x local (modo tolerante a fallos si el servicio aún no corre)
  await initializeDatabasePool();

  // Rutas de API RESTful
  app.use('/api/auth', authRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/status', statusRoutes);
  app.use('/api/municipios', municipiosRoutes);
  app.use('/api/platos', platosRoutes);
  app.use('/api/config', configRoutes);


  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Sabores de Cochabamba Backend API' });
  });

  // Vite middleware en desarrollo o servir archivos estáticos en producción
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sabores de Cochabamba] Servidor backend escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer();
