import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Utensils,
  Eye,
  Layers,
  ChefHat,
  ArrowRight
} from 'lucide-react';
import { HeroConfig, Plato } from '../../types/index.ts';
import {
  fetchHeroConfig,
  updateHeroConfigApi,
  resetHeroConfigApi,
  uploadMediaFile,
  fetchPlatos
} from '../../services/api.ts';

interface AdminBannerViewProps {
  onGoToPublic: () => void;
  onConfigSaved?: (newConfig: HeroConfig) => void;
}

export function AdminBannerView({ onGoToPublic, onConfigSaved }: AdminBannerViewProps) {
  const [config, setConfig] = useState<HeroConfig>({
    banner_imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    banner_titulo: 'Sabores de Cochabamba',
    banner_subtitulo: 'Tierra bendecida por su cocina y sus tradiciones',
    banner_descripcion: 'Descubre la riqueza culinaria del valle cochabambino. Una iniciativa dedicada a documentar, preservar y compartir las recetas ancestrales y las técnicas que han pasado de generación en generación.',
    insignia_titulo: 'Pique Macho',
    insignia_subtitulo: 'El plato bandera que nos identifica',
    insignia_imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    insignia_descripcion: 'Carne de res, salchichas, papas fritas, huevo y locoto',
    insignia_plato_id: null
  });

  const [platosList, setPlatosList] = useState<Plato[]>([]);
  const [selectedPlatoPreset, setSelectedPlatoPreset] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadingInsignia, setUploadingInsignia] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const insigniaFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [heroData, platos] = await Promise.all([
        fetchHeroConfig(),
        fetchPlatos().catch(() => [] as Plato[])
      ]);
      setConfig(heroData);
      setPlatosList(platos);
    } catch (err: any) {
      console.error('Error al cargar configuración de portada:', err);
      setErrorMsg('No se pudo cargar la configuración actual. Mostrando valores locales.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsigniaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingInsignia(true);
      setErrorMsg(null);
      const res = await uploadMediaFile(file, 'banners');
      setConfig((prev) => ({
        ...prev,
        insignia_imagen: res.url
      }));
      setSuccessMsg('Imagen del platillo insignia cargada exitosamente.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error al subir imagen de insignia:', err);
      setErrorMsg(err.message || 'Error al subir la imagen del platillo insignia.');
    } finally {
      setUploadingInsignia(false);
      if (insigniaFileInputRef.current) {
        insigniaFileInputRef.current.value = '';
      }
    }
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      setErrorMsg(null);
      const res = await uploadMediaFile(file, 'banners');
      setConfig((prev) => ({
        ...prev,
        banner_imagen: res.url
      }));
      setSuccessMsg('Imagen del banner de fondo cargada exitosamente.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error al subir imagen del banner:', err);
      setErrorMsg(err.message || 'Error al subir la imagen de fondo del banner.');
    } finally {
      setUploadingBanner(false);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = '';
      }
    }
  };

  const handleApplyPlatoPreset = () => {
    if (!selectedPlatoPreset) return;
    const plato = platosList.find((p) => p.id === Number(selectedPlatoPreset));
    if (!plato) return;

    // Obtener un resumen de ingredientes corto
    const ingredientesCortos = plato.ingredientes
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join(', ')
      .slice(0, 70);

    setConfig((prev) => ({
      ...prev,
      insignia_titulo: plato.nombre,
      insignia_subtitulo: `Especialidad de ${plato.municipio_nombre || 'Cochabamba'}`,
      insignia_imagen: plato.imagen_principal || prev.insignia_imagen,
      insignia_descripcion: ingredientesCortos || prev.insignia_descripcion,
      insignia_plato_id: plato.id
    }));

    setSuccessMsg(`Datos del plato "${plato.nombre}" aplicados a la insignia.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!config.insignia_titulo.trim()) {
        setErrorMsg('El título del platillo insignia no puede estar vacío.');
        setSaving(false);
        return;
      }

      const updated = await updateHeroConfigApi(config);
      setConfig(updated);
      if (onConfigSaved) {
        onConfigSaved(updated);
      }
      setSuccessMsg('¡Configuración del Banner y Platillo Insignia guardada correctamente!');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error al guardar configuración:', err);
      setErrorMsg(err.message || 'Error al guardar los cambios en la base de datos.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        '¿Deseas restaurar la portada a los valores originales (Pique Macho tradicional y paisaje valluno)?'
      )
    ) {
      return;
    }

    try {
      setResetting(true);
      setErrorMsg(null);
      const res = await resetHeroConfigApi();
      setConfig(res);
      if (onConfigSaved) {
        onConfigSaved(res);
      }
      setSuccessMsg('Portada restablecida a los valores predeterminados originales.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error al restablecer:', err);
      setErrorMsg(err.message || 'Error al restablecer la portada.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-[#E8DFD5] text-center shadow-xs">
        <span className="w-8 h-8 border-3 border-[#C85228] border-t-transparent rounded-full animate-spin inline-block mb-3" />
        <p className="text-sm font-semibold text-[#5C483F]">
          Cargando configuración de portada y banner...
        </p>
      </div>
    );
  }

  return (
    <div id="admin-banner-view" className="space-y-8 animate-fadeIn">
      {/* Cabecera Principal */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EB] text-[#C85228] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FCD116]" />
            <span>Portada Principal del Sitio</span>
          </div>
          <h1 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#2C221E] tracking-tight">
            Banner y Platillo Insignia
          </h1>
          <p className="text-[#7D6B62] text-sm mt-1 max-w-2xl">
            Sube tu propia imagen y cambia el título del platillo insignia que da la bienvenida a los visitantes, así como el fondo panorámico del banner principal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onGoToPublic}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#2C221E] text-xs font-bold border border-[#D9CEC5] transition-all"
            title="Ver cómo luce en la página de inicio"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C85228]" />
            <span>Ver Portada Pública</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 text-xs font-bold border border-red-200 transition-all disabled:opacity-50"
            title="Volver a los valores de fábrica"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Restablecer Original</span>
          </button>
        </div>
      </div>

      {/* Avisos de Notificación */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {/* ========================================================
          VISTA PREVIA EN VIVO (LIVE PREVIEW)
          Muestra en tiempo real cómo se ve el hero con los cambios
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#C85228]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C7A70]">
              Vista Previa en Tiempo Real de la Portada
            </h2>
          </div>
          <span className="text-[11px] font-medium text-[#A39288]">
            Refleja los cambios que estás editando a continuación
          </span>
        </div>

        {/* Hero Preview Box */}
        <div className="relative overflow-hidden rounded-2xl w-full min-h-[360px] sm:min-h-[420px] bg-[#1a0f0a] text-white flex items-center border border-[#3D2F2A] shadow-lg">
          {/* Fondo panorámico 100% nítido y claro */}
          <div className="absolute inset-0 z-0">
            <img
              src={
                config.banner_imagen ||
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80'
              }
              alt="Fondo de la portada"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido en Preview: Platillo Insignia sobre fondo despejado */}
          <div className="relative z-20 w-full px-5 sm:px-8 py-8 sm:py-10 flex items-center justify-center sm:justify-end">
            <div className="relative flex flex-col items-center sm:items-end">
              {config.insignia_titulo && (
                <div className="mb-2.5 text-center sm:text-right bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-lg max-w-xs">
                  <p className="font-brush text-2xl sm:text-3xl text-white leading-none drop-shadow-md">
                    {config.insignia_titulo}
                  </p>
                  {config.insignia_subtitulo && (
                    <p className="font-cursive text-sm text-white/95 drop-shadow-xs mt-0.5">
                      {config.insignia_subtitulo}
                    </p>
                  )}
                </div>
              )}

              {/* Cazuela protagonista */}
              <div className="relative w-52 sm:w-64 lg:w-72 aspect-square rounded-full p-2 bg-[#422216]/80 border-4 border-[#7A3E20] shadow-2xl overflow-hidden group">
                <img
                  src={
                    config.insignia_imagen ||
                    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={config.insignia_titulo}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none" />
              </div>

              {/* Pie de foto de ingredientes */}
              {config.insignia_descripcion && (
                <div className="mt-2.5 flex items-center gap-2 px-3 py-1 rounded-lg bg-black/55 backdrop-blur-md text-[11px] text-white/90 border border-white/10 max-w-xs text-center truncate">
                  <span className="w-2 h-2 rounded-full bg-[#E05326] shrink-0 animate-pulse" />
                  <span className="truncate">
                    {config.insignia_descripcion}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FORMULARIO DE CONFIGURACIÓN
         ======================================================== */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECCIÓN 1: PLATILLO INSIGNIA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EFE8E0] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center font-bold">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E]">
                  1. Platillo Insignia (Protagonista de la Cazuela)
                </h3>
                <p className="text-xs text-[#7D6B62]">
                  Configura la imagen central circular, el título principal y los detalles del plato bandera.
                </p>
              </div>
            </div>

            {/* Asignación rápida desde un plato existente */}
            {platosList.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedPlatoPreset}
                  onChange={(e) => setSelectedPlatoPreset(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#D9CEC5] bg-[#FAF7F2] text-xs text-[#2C221E] focus:outline-none focus:ring-1 focus:ring-[#C85228]"
                >
                  <option value="">-- Cargar de un plato existente --</option>
                  {platosList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.municipio_nombre || 'Cochabamba'})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleApplyPlatoPreset}
                  disabled={!selectedPlatoPreset}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF0EB] hover:bg-[#F2ECE4] text-[#C85228] font-bold text-xs border border-[#E0D2C7] disabled:opacity-40 transition-colors"
                >
                  Cargar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título del Platillo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
                Título del Platillo Insignia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.insignia_titulo}
                onChange={(e) => setConfig({ ...config, insignia_titulo: e.target.value })}
                placeholder="Ej. Pique Macho, Silpancho, Chicharrón de Sacaba..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
                required
              />
              <p className="text-[11px] text-[#8C7A70] mt-1">
                Aparece con tipografía destacada sobre la cazuela.
              </p>
            </div>

            {/* Subtítulo / Frase representativa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
                Subtítulo o Frase Identitaria
              </label>
              <input
                type="text"
                value={config.insignia_subtitulo}
                onChange={(e) => setConfig({ ...config, insignia_subtitulo: e.target.value })}
                placeholder="Ej. El plato bandera que nos identifica"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
              />
              <p className="text-[11px] text-[#8C7A70] mt-1">
                Frase cursiva tradicional debajo del nombre del plato.
              </p>
            </div>
          </div>

          {/* Subida y enlace de la Imagen del Platillo Insignia */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F]">
              Imagen del Platillo Insignia (Cazuela Redonda) <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed border-[#D9CEC5] bg-[#FAF7F2]">
              {/* Miniatura actual */}
              <div className="relative w-20 h-20 rounded-full border-2 border-[#7A3E20] overflow-hidden bg-[#2C221E] shrink-0 shadow-md">
                <img
                  src={
                    config.insignia_imagen ||
                    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Insignia actual"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Botón para subir archivo local */}
                  <input
                    type="file"
                    ref={insigniaFileInputRef}
                    onChange={handleInsigniaFileUpload}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => insigniaFileInputRef.current?.click()}
                    disabled={uploadingInsignia}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingInsignia ? 'Subiendo imagen...' : 'Subir imagen desde mi equipo'}</span>
                  </button>

                  <span className="text-xs text-[#8C7A70]">o ingresa una URL:</span>
                </div>

                <input
                  type="text"
                  value={config.insignia_imagen || ''}
                  onChange={(e) => setConfig({ ...config, insignia_imagen: e.target.value })}
                  placeholder="https://... o /uploads/banners/..."
                  className="w-full px-3 py-2 rounded-lg border border-[#D9CEC5] bg-white text-xs text-[#2C221E] focus:outline-none focus:ring-1 focus:ring-[#C85228]"
                />
                <p className="text-[11px] text-[#8C7A70]">
                  Formatos admitidos: JPG, PNG, WEBP. Para un mejor acabado visual, usa fotos nítidas con el plato centrado.
                </p>
              </div>
            </div>
          </div>

          {/* Ingredientes / Pie de foto descriptivo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
              Etiqueta de Ingredientes / Descripción Corta
            </label>
            <input
              type="text"
              value={config.insignia_descripcion}
              onChange={(e) => setConfig({ ...config, insignia_descripcion: e.target.value })}
              placeholder="Ej. Carne de res, salchichas, papas fritas, huevo y locoto"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
            />
            <p className="text-[11px] text-[#8C7A70] mt-1">
              Aparece en la pastilla oscura con luz pulsante naranja debajo de la cazuela.
            </p>
          </div>
        </div>

        {/* SECCIÓN 2: BANNER DE FONDO (HERO BACKGROUND) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EFE8E0]">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C85228] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E]">
                2. Fondo del Banner y Textos de Portada
              </h3>
              <p className="text-xs text-[#7D6B62]">
                Personaliza la imagen de fondo panorámica y los textos centrales de bienvenida.
              </p>
            </div>
          </div>

          {/* Imagen de Fondo del Banner */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F]">
              Imagen de Fondo Panorámica del Banner
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed border-[#D9CEC5] bg-[#FAF7F2]">
              {/* Miniatura actual */}
              <div className="relative w-28 h-16 rounded-xl border border-[#D9CEC5] overflow-hidden bg-[#2C221E] shrink-0 shadow-sm">
                <img
                  src={
                    config.banner_imagen ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80'
                  }
                  alt="Banner actual"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerFileUpload}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    disabled={uploadingBanner}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0EB] hover:bg-[#F2ECE4] text-[#C85228] text-xs font-bold border border-[#E0D2C7] transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingBanner ? 'Subiendo imagen...' : 'Subir fondo desde mi equipo'}</span>
                  </button>

                  <span className="text-xs text-[#8C7A70]">o ingresa una URL:</span>
                </div>

                <input
                  type="text"
                  value={config.banner_imagen || ''}
                  onChange={(e) => setConfig({ ...config, banner_imagen: e.target.value })}
                  placeholder="https://... o /uploads/banners/..."
                  className="w-full px-3 py-2 rounded-lg border border-[#D9CEC5] bg-white text-xs text-[#2C221E] focus:outline-none focus:ring-1 focus:ring-[#C85228]"
                />
                <p className="text-[11px] text-[#8C7A70]">
                  Recomendado: fotografía horizontal de alta resolución de Cochabamba, valles o paisajes andinos.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título Principal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
                Título Principal
              </label>
              <input
                type="text"
                value={config.banner_titulo}
                onChange={(e) => setConfig({ ...config, banner_titulo: e.target.value })}
                placeholder="Sabores de Cochabamba"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
              />
            </div>

            {/* Subtítulo Principal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
                Subtítulo Principal
              </label>
              <input
                type="text"
                value={config.banner_subtitulo}
                onChange={(e) => setConfig({ ...config, banner_subtitulo: e.target.value })}
                placeholder="Tierra bendecida por su cocina y sus tradiciones"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
              />
            </div>
          </div>

          {/* Descripción general */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5C483F] mb-1.5">
              Párrafo de Descripción de la Gastronomía Valluna
            </label>
            <textarea
              rows={3}
              value={config.banner_descripcion || ''}
              onChange={(e) => setConfig({ ...config, banner_descripcion: e.target.value })}
              placeholder="Descubre la riqueza culinaria del valle cochabambino..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEC5] bg-[#FAF7F2] text-[#2C221E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228]"
            />
          </div>
        </div>

        {/* Barra de Acciones y Guardar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#7D6B62]">
            <Sparkles className="w-4 h-4 text-[#C85228]" />
            <span>Los cambios se guardan de forma permanente en la base de datos y se reflejan al instante.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={saving || uploadingInsignia || uploadingBanner}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#C85228] hover:bg-[#B3451E] active:bg-[#9E3B17] text-white text-sm font-bold shadow-md transition-all hover:scale-102 disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'Guardando en Base de Datos...' : 'Guardar Cambios de Portada'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
