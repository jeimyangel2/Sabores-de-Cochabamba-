# Configuración de Base de Datos MySQL 8.x Local - Sabores de Cochabamba

Este proyecto está diseñado para funcionar con una base de datos **MySQL 8.x instalada localmente** en tu computadora personal (sin depender de servicios en la nube).

---

## 1. Requisitos Previos

- Tener instalado **MySQL Server 8.x** (o mediante herramientas como XAMPP, WampServer, Laragon o MySQL Workbench).
- Node.js (versión 18 o superior).

---

## 2. Creación del Esquema y Carga de Datos

Puedes crear la base de datos y cargar los datos de ejemplo utilizando la consola de comandos o tu cliente gráfico preferido (MySQL Workbench, phpMyAdmin, DBeaver, HeidiSQL, etc.).

### Opción A: Desde la terminal de comandos (Recomendado)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# 1. Crear el esquema y las tablas (municipios y platos)
mysql -u root -p < database/schema.sql

# 2. Cargar los datos iniciales de municipios y recetas típicas
mysql -u root -p < database/seeds.sql
```

*(Introduce tu contraseña de MySQL cuando el sistema te la solicite).*

### Opción B: Desde MySQL Workbench o phpMyAdmin

1. Abre tu gestor de base de datos.
2. Abre y ejecuta el archivo `database/schema.sql`.
3. Abre y ejecuta el archivo `database/seeds.sql`.
4. Verifica que la base de datos `sabores_cochabamba` contenga las tablas `municipios` y `platos`.

---

## 3. Configuración de Variables de Entorno

Copia el archivo `.env.example` y crea un archivo llamado `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con las credenciales de tu MySQL local:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=sabores_cochabamba
```

---

## 4. Estructura de Tablas y Relaciones

- **`municipios`**: Almacena cada municipio con su información cultural y su lugar turístico emblemático único.
- **`platos`**: Almacena cada plato típico y su receta tradicional, vinculado mediante la clave foránea `municipio_id` hacia la tabla `municipios`.
- Los campos de video e imagen secundaria (`imagen_preparacion`, `video_preparacion`, `lugar_turistico_video`) son **opcionales**, permitiendo que una receta funcione sólo con texto, texto + imagen, texto + video, o la combinación completa.

---

## 5. Iniciar la Aplicación

```bash
# Instalar dependencias si aún no se han instalado
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación detectará automáticamente tu base de datos MySQL local y servirá los datos desde ella.
