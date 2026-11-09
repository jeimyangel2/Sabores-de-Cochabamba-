import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Utensils,
  Star,
  ArrowRight,
  Database,
  PlusCircle,
  Building2,
  BookOpenCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AdminUser, AdminStats, Municipio, Plato } from '../../types/index.ts';
import { fetchAdminStats, fetchMunicipios, fetchPlatos } from '../../services/api.ts';
import { supabaseClient } from '../../services/supabase.ts';

interface AdminDashboardViewProps {
  currentAdmin: AdminUser;
  onNavigate: (
    section: 'dashboard' | 'municipios' | 'platos' | 'banner',
    options?: { filter?: 'all' | 'destacados' }
  ) => void;
}

export function AdminDashboardView({ currentAdmin, onNavigate }: AdminDashboardViewProps) {
  const [stats, setStats] = useState<AdminStats>({
    municipios_count: 0,
    platos_count: 0,
    platos_destacados_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.warn('Error al cargar estadísticas, consultando colecciones directas', err);
        try {
          const [mList, pList] = await Promise.all([fetchMunicipios(), fetchPlatos()]);
          setStats({
            municipios_count: mList.length,
            platos_count: pList.length,
            platos_destacados_count: pList.filter((p) => Number(p.destacado) === 1).length
          });
        } catch (e) {
          console.error('Error total en métricas', e);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    if (supabaseClient) {
      const channel = supabaseClient
        .channel('dashboard-live-stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'platos' }, () => {
          loadStats();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'municipios' }, () => {
          loadStats();
        })
        .subscribe();

      return () => {
        if (supabaseClient) {
          supabaseClient.removeChannel(channel);
        }
      };
    }
  }, []);

  return (
    <div id="admin-dashboard-view" className="space-y-8 animate-fadeIn">
      {/* Bienvenida y Datos del Administrador */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EB] text-[#C85228] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistema: Sabores de Cochabamba</span>
          </div>
          <h1 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#2C221E] tracking-tight">
            Bienvenido, {currentAdmin.nombre}
          </h1>
          <p className="text-[#7D6B62] text-sm mt-1">
            Panel de control general para la gestión culinaria, turística y portada de Cochabamba.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-dash-to-municipios"
            onClick={() => onNavigate('municipios')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#2C221E] text-xs font-bold border border-[#D9CEC5] transition-all"
          >
            <MapPin className="w-4 h-4 text-[#C85228]" />
            <span>Ver Municipios</span>
          </button>

          <button
            id="btn-dash-to-platos"
            onClick={() => onNavigate('platos')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#2C221E] text-xs font-bold border border-[#D9CEC5] transition-all"
          >
            <Utensils className="w-4 h-4 text-[#C85228]" />
            <span>Ver Platos</span>
          </button>

          <button
            id="btn-dash-to-banner"
            onClick={() => onNavigate('banner')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#FCD116]" />
            <span>Banner e Insignia</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] mb-4">
          Resumen General del Sistema
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Municipios Registrados (Clickeable) */}
          <button
            type="button"
            id="stat-card-municipios"
            onClick={() => onNavigate('municipios')}
            className="w-full text-left bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:shadow-md hover:border-[#C85228] transition-all cursor-pointer group flex flex-col justify-between"
            title="Ver todos los municipios registrados"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D6B62] group-hover:text-[#C85228] transition-colors">
                  Municipios Registrados
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-title text-4xl font-extrabold text-[#2C221E]">
                  {loading ? '...' : stats.municipios_count}
                </span>
                <span className="text-xs text-[#8C7A70]">en Cochabamba</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs font-bold text-[#C85228] group-hover:translate-x-0.5 transition-transform">
              <span>Ver todos los municipios</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Platos Registrados (Clickeable) */}
          <button
            type="button"
            id="stat-card-platos"
            onClick={() => onNavigate('platos', { filter: 'all' })}
            className="w-full text-left bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:shadow-md hover:border-[#C85228] transition-all cursor-pointer group flex flex-col justify-between"
            title="Ver todos los platos registrados"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D6B62] group-hover:text-[#C85228] transition-colors">
                  Platos Registrados
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-title text-4xl font-extrabold text-[#2C221E]">
                  {loading ? '...' : stats.platos_count}
                </span>
                <span className="text-xs text-[#8C7A70]">recetas tradicionales</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs font-bold text-[#C85228] group-hover:translate-x-0.5 transition-transform">
              <span>Ver todos los platos</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Platos Destacados en Carrusel (Clickeable) */}
          <button
            type="button"
            id="stat-card-destacados"
            onClick={() => onNavigate('platos', { filter: 'destacados' })}
            className="w-full text-left bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            title="Ver platos destacados en el carrusel"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D6B62] group-hover:text-amber-700 transition-colors">
                  Platos Destacados
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-title text-4xl font-extrabold text-[#2C221E]">
                  {loading ? '...' : stats.platos_destacados_count}
                </span>
                <span className="text-xs text-[#8C7A70]">en carrusel principal</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              <span>Ver platos destacados</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Secciones de Administración Directa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Módulo Administrar Municipios */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title font-extrabold text-xl text-[#2C221E] mb-2">
              Administración de Municipios
            </h3>
            <p className="text-sm text-[#7D6B62] leading-relaxed mb-6">
              Gestiona el listado de municipios, sus reseñas culturales y su lugar turístico emblemático único con fotografía o video opcional.
            </p>
          </div>

          <button
            id="btn-dash-action-municipios"
            onClick={() => onNavigate('municipios')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2C221E] hover:bg-[#3D2F2A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Gestionar Municipios</span>
            <ArrowRight className="w-4 h-4 text-[#E8927C]" />
          </button>
        </div>

        {/* Módulo Administrar Platos */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center mb-4">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title font-extrabold text-xl text-[#2C221E] mb-2">
              Administración de Platos
            </h3>
            <p className="text-sm text-[#7D6B62] leading-relaxed mb-6">
              Registra nuevos platos típicos, edita ingredientes y preparación, asócialos a un municipio y marca si deben aparecer en el carrusel de inicio.
            </p>
          </div>

          <button
            id="btn-dash-action-platos"
            onClick={() => onNavigate('platos')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <span>Gestionar Platos Típicos</span>
            <ArrowRight className="w-4 h-4 text-[#FCD116]" />
          </button>
        </div>

        {/* Módulo Personalizar Banner e Insignia */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#FCD116]" />
            </div>
            <h3 className="font-serif-title font-extrabold text-xl text-[#2C221E] mb-2">
              Banner e Insignia
            </h3>
            <p className="text-sm text-[#7D6B62] leading-relaxed mb-6">
              Cambia la imagen y título del platillo insignia circular en portada, así como el fondo panorámico del banner principal de bienvenida.
            </p>
          </div>

          <button
            id="btn-dash-action-banner"
            onClick={() => onNavigate('banner')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2C221E] hover:bg-[#3D2F2A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Editar Banner e Insignia</span>
            <ArrowRight className="w-4 h-4 text-[#E8927C]" />
          </button>
        </div>
      </div>
    </div>
  );
}
