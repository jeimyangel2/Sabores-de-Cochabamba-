export interface Municipio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string | null;
  descripcion_cultural: string;
  lugar_turistico_nombre: string;
  lugar_turistico_descripcion: string;
  lugar_turistico_imagen: string | null;
  lugar_turistico_video: string | null;
  created_at?: string;
  updated_at?: string;
  platos_count?: number;
  platos?: Plato[];
}

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  municipio_id: number;
  municipio_nombre?: string;
  imagen_principal: string | null;
  ingredientes: string;
  preparacion: string;
  imagen_preparacion: string | null;
  video_preparacion: string | null;
  destacado: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbStatus {
  connected: boolean;
  provider: 'mysql' | 'mock_fallback';
  message: string;
  database: string;
  host: string;
  timestamp: string;
}

export interface AdminUser {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
  activo?: number | boolean;
  created_at?: string;
}

export interface AdminStats {
  municipios_count: number;
  platos_count: number;
  platos_destacados_count: number;
}

export interface HeroConfig {
  id?: number;
  banner_imagen: string | null;
  banner_titulo: string;
  banner_subtitulo: string;
  banner_descripcion?: string | null;
  insignia_titulo: string;
  insignia_subtitulo: string;
  insignia_imagen: string | null;
  insignia_descripcion: string;
  insignia_plato_id?: number | null;
  updated_at?: string;
}

