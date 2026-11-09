-- ========================================================
-- CONFIGURACIÓN DE SUPABASE STORAGE (BUCKET PÚBLICO: media)
-- Proyecto: Sabores de Cochabamba
-- ========================================================

-- 1. Crear el bucket público 'media' en Supabase Storage para alojar imágenes y videos permanentemente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  104857600, -- Límite de 100 MB por archivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

-- 2. Habilitar lectura pública para cualquier visitante (para que las imágenes y videos se vean en la web)
DROP POLICY IF EXISTS "Permitir lectura publica en bucket media" ON storage.objects;
CREATE POLICY "Permitir lectura publica en bucket media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- 3. Habilitar inserción/subida de archivos
DROP POLICY IF EXISTS "Permitir subida en bucket media" ON storage.objects;
CREATE POLICY "Permitir subida en bucket media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

-- 4. Habilitar actualización de archivos
DROP POLICY IF EXISTS "Permitir actualizacion en bucket media" ON storage.objects;
CREATE POLICY "Permitir actualizacion en bucket media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media');

-- 5. Habilitar eliminación de archivos
DROP POLICY IF EXISTS "Permitir eliminacion en bucket media" ON storage.objects;
CREATE POLICY "Permitir eliminacion en bucket media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');
