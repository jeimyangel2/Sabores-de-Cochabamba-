import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ChefHat, Clock, AlertCircle, RefreshCw, Sparkles, Video, Image as ImageIcon, Utensils } from 'lucide-react';
import { Plato } from '../types/index.ts';
import { fetchPlatoById } from '../services/api.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import { ImageGalleryView } from '../components/ImageGalleryView.tsx';
import { YouTubeVideoCard } from '../components/YouTubeVideoCard.tsx';
import { parseImageGallery } from '../utils/youtube.ts';

interface PlatoDetalleViewProps {
  platoId: number;
  initialPlato?: Plato | null;
  onBackToPlatos: () => void;
  onFilterByMunicipality?: (municipioId: number) => void;
}

export const PlatoDetalleView: React.FC<PlatoDetalleViewProps> = ({
  platoId,
  initialPlato,
  onBackToPlatos,
  onFilterByMunicipality
}) => {
  const [plato, setPlato] = useState<Plato | null>(initialPlato || null);
  const [loading, setLoading] = useState<boolean>(!initialPlato);
  const [error, setError] = useState<string | null>(null);
  const [mainImgError, setMainImgError] = useState<boolean>(false);
  const [prepImgError, setPrepImgError] = useState<boolean>(false);

  // Consulta desde MySQL a través del endpoint /api/platos/:id
  const loadPlato = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlatoById(platoId);
      setPlato(data);
    } catch (err: any) {
      console.error(`Error al cargar el plato con ID ${platoId}:`, err);
      // Mensaje amigable al usuario sin errores técnicos
      setError('No se pudo cargar la información. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si no tenemos el plato o si el ID cambió, consultamos a la API
    if (!plato || plato.id !== platoId) {
      loadPlato();
    }
  }, [platoId]);

  // Si está cargando
  if (loading) {
    return (
      <div id="plato-detalle-loading" className="max-w-4xl mx-auto px-4 py-16">
        <LoadingState message="Cargando platos..." />
      </div>
    );
  }

  // Si ocurrió un error en la consulta
  if (error) {
    return (
      <div id="plato-detalle-error" className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#FFF8F5] border border-[#F5C2B3] rounded-3xl p-8 sm:p-10 shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C85228]">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#3B251B]">Ocurrió un inconveniente</h2>
          <p className="text-sm text-[#7D665D] max-w-md mx-auto">{error}</p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-retry-plato-detalle"
              onClick={loadPlato}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C85228] hover:bg-[#A8421D] text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
            <button
              id="btn-error-back-to-platos"
              onClick={onBackToPlatos}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF7F2] border border-[#D7C4B7] text-[#4A3830] hover:bg-[#F2ECE3] text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a platos</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado No Encontrado (ID no corresponde a ningún plato)
  if (!plato) {
    return (
      <div id="plato-no-encontrado" className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#E8DFD5] rounded-3xl p-8 sm:p-10 shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#8C7A70] border border-[#E8DFD5]">
            <Utensils className="w-8 h-8 text-[#C85228]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C221E]">Plato no encontrado</h2>
          <p className="text-sm text-[#6B574F] max-w-md mx-auto">
            El plato solicitado no existe o no se encuentra registrado en el sistema gastronómico.
          </p>
          <div className="pt-3">
            <button
              id="btn-not-found-back-to-platos"
              onClick={onBackToPlatos}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8F4824] hover:bg-[#783918] text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Platos Típicos</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Procesar lista de ingredientes (por saltos de línea)
  const ingredientesList = plato.ingredientes
    ? plato.ingredientes
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  // Procesar pasos de preparación (por saltos de línea)
  const preparacionPasos = plato.preparacion
    ? plato.preparacion
        .split('\n')
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    : [];

  const prepImages = parseImageGallery(plato.imagen_preparacion);
  const hasMainImage = Boolean(plato.imagen_principal) && !mainImgError;
  const hasPrepImage = prepImages.length > 0;
  const hasPrepVideo = Boolean(plato.video_preparacion && plato.video_preparacion.trim());

  return (
    <article id={`plato-detalle-${plato.id}`} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* 8. Botón para regresar a platos (en la parte superior para navegación rápida) */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-platos-top"
          onClick={onBackToPlatos}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E2D8CC] hover:bg-[#F5EFE6] text-[#4A3830] text-sm font-semibold transition-all shadow-2xs group"
        >
          <ArrowLeft className="w-4 h-4 text-[#C85228] group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver a platos</span>
        </button>

        {plato.destacado ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EB] text-[#C85228] text-xs font-bold border border-[#F5C2B3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plato Destacado de Cochabamba</span>
          </span>
        ) : null}
      </div>

      {/* Tarjeta Principal del Plato */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs">
        
        {/* 1. Imagen Principal del Plato */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-[#F2ECE3]">
          {hasMainImage ? (
            <img
              src={plato.imagen_principal!}
              alt={plato.nombre}
              onError={() => setMainImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Espacio visual alternativo elegante cuando no existe imagen principal */
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FAF7F2] to-[#ECE3D8] text-[#8C7A70]">
              <div className="w-16 h-16 rounded-2xl bg-white/90 border border-[#DACDC0] flex items-center justify-center mb-3 shadow-2xs">
                <Utensils className="w-8 h-8 text-[#8F4824]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#5A453C]">Sabores de Cochabamba</h3>
              <p className="text-xs text-[#A8988E] max-w-sm mt-1">Gastronomía tradicional cochabambina</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Superposición sobre la imagen con Nombre y Municipio */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2 pointer-events-auto">
            {/* 3. Municipio */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85228] text-white text-xs font-bold shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#FCD116]" />
              <span>{plato.municipio_nombre || 'Cochabamba'}</span>
            </div>

            {/* 2. Nombre del plato */}
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md text-white">
              {plato.nombre}
            </h1>
          </div>
        </div>

        {/* 4. Descripción General del Plato */}
        <div className="p-6 sm:p-8 border-b border-[#F0EBE1] bg-[#FAF7F2]">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8F4824]">
              Reseña y Tradición
            </h2>
            <p className="text-base sm:text-lg text-[#4A3830] leading-relaxed font-serif-body">
              {plato.descripcion}
            </p>
          </div>
        </div>

        {/* Contenido de la Receta: Ingredientes y Preparación */}
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 5. Ingredientes (Columna lateral o primera sección en móviles) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8DFD5] space-y-4 sticky top-24">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E2D8CC]">
                <ChefHat className="w-5 h-5 text-[#C85228]" />
                <h3 className="font-bold text-lg text-[#2C221E] uppercase tracking-wide text-sm">
                  Ingredientes
                </h3>
              </div>

              {ingredientesList.length > 0 ? (
                <ul className="space-y-3 text-sm text-[#4A3830]">
                  {ingredientesList.map((ingrediente, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-[#C85228] shrink-0 mt-2" />
                      <span>{ingrediente}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#8C7A70] italic">
                  Ingredientes tradicionales de la gastronomía valluna.
                </p>
              )}
            </div>
          </div>

          {/* 6. Preparación (Columna principal de procedimiento) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFD5]">
              <Clock className="w-5 h-5 text-[#8F4824]" />
              <h3 className="font-bold text-lg text-[#2C221E] uppercase tracking-wide text-sm">
                Modo de Preparación
              </h3>
            </div>

            {preparacionPasos.length > 0 ? (
              <div className="space-y-5">
                {preparacionPasos.map((paso, idx) => {
                  // Limpiar número inicial si el texto ya trae "1. " o "Paso 1:"
                  const limpio = paso.replace(/^(\d+[\.\-\)]\s*|paso\s*\d+[\:\.\-]?\s*)/i, '');
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD5] shadow-2xs space-y-2 hover:border-[#D5C6B5] transition-colors"
                    >
                      <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#FFF1EB] text-[#C85228] text-xs font-bold uppercase tracking-wider">
                        Paso {idx + 1}
                      </div>
                      <p className="text-sm sm:text-base text-[#4A3830] leading-relaxed">
                        {limpio || paso}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#6B574F] leading-relaxed">
                {plato.preparacion || 'Preparación tradicional transmitida de generación en generación.'}
              </p>
            )}

            {/* 7. Material Multimedia Opcional */}
            {/* Si existen imagen adicional o video de preparación se muestran aquí. Si no existen, NO se muestra ninguna sección vacía ni espacio reservado */}
            {(hasPrepImage || hasPrepVideo) && (
              <div className="pt-6 space-y-6 border-t border-[#E8DFD5]">
                
                {/* 6. Imagen adicional de preparación (OPCIONAL) */}
                {hasPrepImage && (
                  <div id="seccion-imagen-preparacion" className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F4824]">
                      <ImageIcon className="w-4 h-4 text-[#C85228]" />
                      <span>Fotografías del proceso o servido</span>
                    </div>
                    <ImageGalleryView
                      images={prepImages}
                      altTitle={`Preparación de ${plato.nombre}`}
                    />
                  </div>
                )}

                {/* 7. Video de preparación (OPCIONAL) */}
                {hasPrepVideo && (
                  <div id="seccion-video-preparacion" className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F4824]">
                      <Video className="w-4 h-4 text-[#C85228]" />
                      <span>Video demostrativo de preparación</span>
                    </div>
                    <YouTubeVideoCard
                      url={plato.video_preparacion}
                      title={`Preparación de ${plato.nombre}`}
                      subtitle={plato.nombre}
                    />
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 8. Botón para regresar a platos (al pie de la página) */}
      <div className="pt-4 pb-8 flex items-center justify-between">
        <button
          id="btn-back-to-platos-bottom"
          onClick={onBackToPlatos}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8F4824] hover:bg-[#783918] active:bg-[#632E12] text-white text-sm font-semibold transition-all shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver a platos</span>
        </button>

        {plato.municipio_id && onFilterByMunicipality && (
          <button
            id={`btn-explore-muni-${plato.municipio_id}`}
            onClick={() => onFilterByMunicipality(plato.municipio_id)}
            className="inline-flex items-center gap-1.5 text-xs text-[#8F4824] hover:text-[#C85228] font-bold hover:underline"
          >
            <span>Ver más platos de {plato.municipio_nombre || 'este municipio'} →</span>
          </button>
        )}
      </div>

    </article>
  );
};
