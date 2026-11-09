import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Landmark, Utensils, Video, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Municipio, Plato } from '../types/index.ts';
import { fetchMunicipioById, fetchPlatos } from '../services/api.ts';
import { DishCard } from '../components/DishCard.tsx';
import { LoadingState } from '../components/LoadingState.tsx';
import { ImageGalleryView } from '../components/ImageGalleryView.tsx';
import { YouTubeVideoCard } from '../components/YouTubeVideoCard.tsx';
import { parseImageGallery } from '../utils/youtube.ts';

interface MunicipioDetalleViewProps {
  municipioId: number;
  initialMunicipio?: Municipio | null;
  onBackToMunicipios: () => void;
  onViewRecipe: (plato: Plato) => void;
  onFilterByMunicipality?: (id: number) => void;
}

export const MunicipioDetalleView: React.FC<MunicipioDetalleViewProps> = ({
  municipioId,
  initialMunicipio,
  onBackToMunicipios,
  onViewRecipe,
  onFilterByMunicipality
}) => {
  const [municipio, setMunicipio] = useState<Municipio | null>(initialMunicipio || null);
  const [platos, setPlatos] = useState<Plato[]>(initialMunicipio?.platos || []);
  const [loading, setLoading] = useState<boolean>(!initialMunicipio);
  const [error, setError] = useState<string | null>(null);

  const [mainImgError, setMainImgError] = useState<boolean>(false);
  const [turImgError, setTurImgError] = useState<boolean>(false);

  const loadMunicipioData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Consulta del municipio mediante su ID a MySQL / API
      const muniData = await fetchMunicipioById(municipioId);
      setMunicipio(muniData);

      // Si los platos ya vienen en la respuesta del municipio, usarlos; de lo contrario consultar por municipio_id
      if (muniData.platos && muniData.platos.length > 0) {
        setPlatos(muniData.platos);
      } else {
        const platosData = await fetchPlatos({ municipio_id: municipioId });
        setPlatos(platosData);
      }
    } catch (err: any) {
      console.error(`Error al cargar datos del municipio con ID ${municipioId}:`, err);
      setError('No se pudo cargar la información. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!municipio || municipio.id !== municipioId) {
      loadMunicipioData();
    }
  }, [municipioId]);

  // Estado de Carga
  if (loading) {
    return (
      <div id="municipio-detalle-loading" className="max-w-4xl mx-auto px-4 py-16">
        <LoadingState message="Cargando municipios..." />
      </div>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <div id="municipio-detalle-error" className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#FFF8F5] border border-[#F5C2B3] rounded-3xl p-8 sm:p-10 shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C85228]">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#3B251B]">Ocurrió un inconveniente</h2>
          <p className="text-sm text-[#7D665D] max-w-md mx-auto">{error}</p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-retry-municipio-detalle"
              onClick={loadMunicipioData}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C85228] hover:bg-[#A8421D] text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
            <button
              id="btn-error-back-to-municipios"
              onClick={onBackToMunicipios}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF7F2] border border-[#D7C4B7] text-[#4A3830] hover:bg-[#F2ECE3] text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Municipios</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado No Encontrado
  if (!municipio) {
    return (
      <div id="municipio-no-encontrado" className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#E8DFD5] rounded-3xl p-8 sm:p-10 shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#8C7A70] border border-[#E8DFD5]">
            <MapPin className="w-8 h-8 text-[#C85228]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C221E]">Municipio no encontrado</h2>
          <p className="text-sm text-[#6B574F] max-w-md mx-auto">
            El municipio solicitado no existe o no se encuentra registrado en el sistema.
          </p>
          <div className="pt-3">
            <button
              id="btn-not-found-back-to-municipios"
              onClick={onBackToMunicipios}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8F4824] hover:bg-[#783918] text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Municipios</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const touristImages = parseImageGallery(municipio.lugar_turistico_imagen);
  // Imagen del municipio: campo 'imagen' o en su defecto primera de 'lugar_turistico_imagen'
  const municipioImgUrl = municipio.imagen || (touristImages.length > 0 ? touristImages[0] : null);
  const hasMunicipioImage = Boolean(municipioImgUrl) && !mainImgError;

  // Lugar turístico opcionales
  const hasTurImage = touristImages.length > 0;
  const hasTurVideo = Boolean(municipio.lugar_turistico_video && municipio.lugar_turistico_video.trim());

  return (
    <article id={`municipio-detalle-${municipio.id}`} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* 1. ENCABEZADO DEL MUNICIPIO */}
      <header id="municipio-encabezado" className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            id="btn-back-to-municipios-top"
            onClick={onBackToMunicipios}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E2D8CC] hover:bg-[#F5EFE6] text-[#4A3830] text-sm font-semibold transition-all shadow-2xs group"
          >
            <ArrowLeft className="w-4 h-4 text-[#C85228] group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a Municipios</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5EE] text-emerald-800 text-xs font-bold border border-emerald-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Cochabamba, Bolivia</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EB] text-[#C85228] text-xs font-bold border border-[#F5C2B3]">
            <MapPin className="w-3.5 h-3.5 text-[#C85228]" />
            <span>Municipio de Cochabamba</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C221E] uppercase">
            {municipio.nombre}
          </h1>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL: SECCIONES 2 A 6 */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs divide-y divide-[#F0EBE1]">
        
        {/* 2. IMAGEN PRINCIPAL DEL MUNICIPIO */}
        <section id="municipio-imagen-principal" aria-label={`Imagen principal de ${municipio.nombre}`}>
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-[#F2ECE3]">
            {hasMunicipioImage ? (
              <img
                src={municipioImgUrl!}
                alt={`Fotografía representativa de ${municipio.nombre}`}
                onError={() => setMainImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Espacio visual alternativo elegante cuando no existe imagen principal */
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FAF7F2] to-[#ECE3D8] text-[#8C7A70]">
                <div className="w-16 h-16 rounded-2xl bg-white/90 border border-[#DACDC0] flex items-center justify-center mb-3 shadow-2xs">
                  <MapPin className="w-8 h-8 text-[#C85228]" />
                </div>
                <h3 className="font-serif-title text-xl font-bold text-[#5A453C]">{municipio.nombre}</h3>
                <p className="text-xs text-[#A8988E] max-w-sm mt-1">Municipio de Cochabamba</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. DESCRIPCIÓN GENERAL */}
        <section id="municipio-descripcion-general" className="p-6 sm:p-8 bg-[#FAF7F2]/60 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8F4824]">
            Descripción General
          </h2>
          <p className="text-base sm:text-lg text-[#4A3830] leading-relaxed font-serif-body max-w-3xl">
            {municipio.descripcion}
          </p>
        </section>

        {/* 4. CULTURA DEL MUNICIPIO (Formato textual puro sin páginas independientes) */}
        <section id="municipio-cultura" className="p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF1EB] flex items-center justify-center text-[#C85228]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2C221E] uppercase">
              Cultura de {municipio.nombre}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5A453C] leading-relaxed max-w-3xl whitespace-pre-line">
            {municipio.descripcion_cultural}
          </p>
        </section>

        {/* 5. LUGAR TURÍSTICO EMBLEMÁTICO (UN SOLO LUGAR POR MUNICIPIO) */}
        <section id="municipio-lugar-turistico" className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EB] text-[#C85228] text-xs font-bold border border-[#F5C2B3]">
              <Landmark className="w-3.5 h-3.5" />
              <span>Lugar turístico emblemático</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2C221E] pt-1">
              {municipio.lugar_turistico_nombre}
            </h2>
          </div>

          {/* Imagen o Video opcionales del lugar turístico */}
          {(hasTurImage || hasTurVideo) && (
            <div className="space-y-4">
              {/* Galería de imágenes del lugar turístico si existe */}
              {hasTurImage && (
                <div id="seccion-lugar-turistico-imagen" className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F4824]">
                    <ImageIcon className="w-4 h-4 text-[#C85228]" />
                    <span>Fotografías del lugar emblemático</span>
                  </div>
                  <ImageGalleryView
                    images={touristImages}
                    altTitle={municipio.lugar_turistico_nombre}
                  />
                </div>
              )}

              {/* Video de YouTube del lugar turístico si existe */}
              {hasTurVideo && (
                <div id="seccion-lugar-turistico-video" className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F4824]">
                    <Video className="w-4 h-4 text-[#C85228]" />
                    <span>Video del lugar emblemático</span>
                  </div>
                  <YouTubeVideoCard
                    url={municipio.lugar_turistico_video}
                    title={municipio.lugar_turistico_nombre}
                    subtitle={municipio.nombre}
                  />
                </div>
              )}
            </div>
          )}

          {/* Descripción del lugar turístico */}
          <p className="text-sm sm:text-base text-[#5A453C] leading-relaxed max-w-3xl whitespace-pre-line">
            {municipio.lugar_turistico_descripcion}
          </p>
        </section>

        {/* 6. PLATOS TÍPICOS DEL MUNICIPIO */}
        <section id="municipio-platos" className="p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFD5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1EB] flex items-center justify-center text-[#C85228]">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2C221E] uppercase">
                  Platos típicos de este municipio
                </h2>
                <p className="text-xs text-[#8C7A70] mt-0.5">
                  Recetas tradicionales originarias y representativas de {municipio.nombre}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#8F4824] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E8DFD5] self-start sm:self-auto">
              {platos.length} {platos.length === 1 ? 'plato registrado' : 'platos registrados'}
            </span>
          </div>

          {/* Tarjetas de platos o Estado Sin Platos */}
          {platos.length === 0 ? (
            <div id="municipio-sin-platos" className="p-8 sm:p-10 text-center bg-[#FAF7F2] rounded-2xl border border-dashed border-[#DACDC0] space-y-2">
              <Utensils className="w-8 h-8 text-[#8C7A70] mx-auto opacity-70" />
              <h3 className="font-bold text-[#4A3830] text-base">Este municipio todavía no tiene platos registrados</h3>
              <p className="text-xs sm:text-sm text-[#8C7A70] max-w-sm mx-auto">
                Próximamente se recopilarán y publicarán las recetas tradicionales pertenecientes a {municipio.nombre}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {platos.map((plato) => (
                <DishCard
                  key={plato.id}
                  plato={plato}
                  onViewRecipe={onViewRecipe}
                  onFilterByMunicipality={onFilterByMunicipality}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Botón inferior Volver a Municipios */}
      <div className="pt-2 pb-6">
        <button
          id="btn-back-to-municipios-bottom"
          onClick={onBackToMunicipios}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8F4824] hover:bg-[#783918] active:bg-[#632E12] text-white text-sm font-semibold transition-all shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver a Municipios</span>
        </button>
      </div>

    </article>
  );
};
