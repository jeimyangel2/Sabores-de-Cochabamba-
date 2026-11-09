-- ========================================================
-- SABORES DE COCHABAMBA
-- Esquema de Base de Datos para MySQL 8.x Local
-- ========================================================

-- Crear la base de datos si no existe con codificación UTF-8 Multilingüe
CREATE DATABASE IF NOT EXISTS `sabores_cochabamba` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `sabores_cochabamba`;

-- Desactivar temporalmente revisión de claves foráneas para limpieza segura
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `platos`;
DROP TABLE IF EXISTS `municipios`;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- 1. TABLA: MUNICIPIOS
-- Almacena los municipios del departamento de Cochabamba,
-- su reseña cultural y su lugar turístico emblemático único.
-- ========================================================
CREATE TABLE `municipios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL,
  `descripcion_cultural` TEXT NOT NULL,
  `lugar_turistico_nombre` VARCHAR(150) NOT NULL,
  `lugar_turistico_descripcion` TEXT NOT NULL,
  `lugar_turistico_imagen` VARCHAR(255) NULL DEFAULT NULL,
  `lugar_turistico_video` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_municipios_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- 2. TABLA: PLATOS
-- Almacena los platos típicos y sus recetas tradicionales.
-- Cada plato pertenece obligatoriamente a un municipio.
-- Los campos imagen_preparacion y video_preparacion son opcionales.
-- ========================================================
CREATE TABLE `platos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `municipio_id` INT UNSIGNED NOT NULL,
  `imagen_principal` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Opcional: imagen principal del plato',
  `ingredientes` TEXT NOT NULL COMMENT 'Lista de ingredientes con cantidades (formato texto o JSON)',
  `preparacion` TEXT NOT NULL COMMENT 'Pasos detallados de la preparación tradicional',
  `imagen_preparacion` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Opcional: imagen del paso a paso o emplatado',
  `video_preparacion` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Opcional: enlace o ruta a video de preparación',
  `destacado` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 para platos destacados en portada, 0 para estándar',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_platos_municipio_id` (`municipio_id`),
  KEY `idx_platos_destacado` (`destacado`),
  KEY `idx_platos_nombre` (`nombre`),
  CONSTRAINT `fk_platos_municipio` 
    FOREIGN KEY (`municipio_id`) 
    REFERENCES `municipios` (`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- 3. TABLA: ADMINISTRADORES
-- Almacena los usuarios administrativos del sistema.
-- Contraseñas protegidas mediante hash bcrypt.
-- ========================================================
CREATE TABLE IF NOT EXISTS `administradores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(30) NOT NULL DEFAULT 'administrador',
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_administradores_usuario` (`usuario`),
  KEY `idx_administradores_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- 4. TABLA: CONFIGURACION_HERO
-- Almacena la personalización del banner principal y del
-- platillo insignia para que el administrador pueda cambiarlo.
-- ========================================================
CREATE TABLE IF NOT EXISTS `configuracion_hero` (
  `id` INT UNSIGNED NOT NULL DEFAULT 1,
  `banner_imagen` VARCHAR(255) NULL DEFAULT NULL,
  `banner_titulo` VARCHAR(150) NOT NULL DEFAULT 'Sabores de Cochabamba',
  `banner_subtitulo` VARCHAR(200) NOT NULL DEFAULT 'Tierra bendecida por su cocina y sus tradiciones',
  `banner_descripcion` TEXT NULL,
  `insignia_titulo` VARCHAR(150) NOT NULL DEFAULT 'Pique Macho',
  `insignia_subtitulo` VARCHAR(200) NOT NULL DEFAULT 'El plato bandera que nos identifica',
  `insignia_imagen` VARCHAR(255) NULL DEFAULT NULL,
  `insignia_descripcion` VARCHAR(255) NOT NULL DEFAULT 'Carne de res, salchichas, papas fritas, huevo y locoto',
  `insignia_plato_id` INT UNSIGNED NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

