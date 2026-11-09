-- ========================================================
-- POLÍTICAS DE PERMISOS (ROW LEVEL SECURITY) EN SUPABASE
-- Ejecuta este script en el SQL Editor de Supabase
-- para permitir lectura y escritura desde la aplicación
-- ========================================================

-- 1. Deshabilitar RLS temporalmente o permitir acceso público a las tablas
ALTER TABLE public.municipios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_hero DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administradores DISABLE ROW LEVEL SECURITY;

-- 2. Insertar los administradores (edwin y admin con contraseña anai1234)
INSERT INTO public.administradores (id, nombre, usuario, password_hash, rol, activo)
VALUES 
  (1, 'Edwin - Administrador', 'edwin', '$2b$10$6KcOffZ096erfD9H8JxDCO4MWlrS3K5tijyibeQ94NJ7au1KI6..i', 'administrador', 1),
  (2, 'Administrador General', 'admin', '$2b$10$6KcOffZ096erfD9H8JxDCO4MWlrS3K5tijyibeQ94NJ7au1KI6..i', 'administrador', 1)
ON CONFLICT (usuario) DO NOTHING;

-- 3. Insertar fila inicial de portada
INSERT INTO public.configuracion_hero (
  id, banner_imagen, banner_titulo, banner_subtitulo, banner_descripcion,
  insignia_titulo, insignia_subtitulo, insignia_imagen, insignia_descripcion, insignia_plato_id
) VALUES (
  1, '', 'Sabores de Cochabamba', 'Tierra bendecida por su cocina y sus tradiciones', '',
  '', '', '', '', NULL
) ON CONFLICT (id) DO NOTHING;
