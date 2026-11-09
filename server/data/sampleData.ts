import { Municipio, Plato, HeroConfig } from '../../src/types/index.ts';

// Lista limpia de municipios lista para que registres desde cero
export const initialMunicipios: Municipio[] = [];

// Lista limpia de platos y recetas lista para que registres desde cero
export const initialPlatos: Plato[] = [];

export interface StoredAdmin {
  id: number;
  nombre: string;
  usuario: string;
  password_hash: string;
  rol: string;
  activo: number;
  created_at: string;
}

// Credenciales protegidas de acceso administrativo
export const initialAdministradores: StoredAdmin[] = [
  {
    id: 1,
    nombre: 'Edwin - Administrador',
    usuario: 'edwin',
    // Hash bcrypt para 'anai1234'
    password_hash: '$2b$10$6KcOffZ096erfD9H8JxDCO4MWlrS3K5tijyibeQ94NJ7au1KI6..i',
    rol: 'administrador',
    activo: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    nombre: process.env.ADMIN_DEFAULT_NAME || 'Administrador General',
    usuario: process.env.ADMIN_DEFAULT_USER || 'admin',
    // Hash bcrypt para 'anai1234'
    password_hash: '$2b$10$6KcOffZ096erfD9H8JxDCO4MWlrS3K5tijyibeQ94NJ7au1KI6..i',
    rol: 'administrador',
    activo: 1,
    created_at: new Date().toISOString()
  }
];

// Configuración de portada lista para tus datos
export const initialHeroConfig: HeroConfig = {
  id: 1,
  banner_imagen: '',
  banner_titulo: 'Sabores de Cochabamba',
  banner_subtitulo: 'Tierra bendecida por su cocina y sus tradiciones',
  banner_descripcion: '',
  insignia_titulo: '',
  insignia_subtitulo: '',
  insignia_imagen: '',
  insignia_descripcion: '',
  insignia_plato_id: null,
  updated_at: new Date().toISOString()
};
