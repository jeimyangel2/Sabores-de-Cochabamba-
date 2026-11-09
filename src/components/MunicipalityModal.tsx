import React from 'react';
import { X, MapPin, Compass, Utensils, BookOpen, Video } from 'lucide-react';
import { Municipio, Plato } from '../types/index.ts';
import { ImageGalleryView } from './ImageGalleryView.tsx';
import { YouTubeVideoCard } from './YouTubeVideoCard.tsx';
import { parseImageGallery } from '../utils/youtube.ts';

interface MunicipalityModalProps {
  municipio: Municipio | null;
  onClose: () => void;
  onViewRecipe: (plato: Plato) => void;
}

export const MunicipalityModal: React.FC<MunicipalityModalProps> = ({
  municipio,
  onClose,
  onViewRecipe
}) => {
  if (!municipio) return null;

  const touristImages = parseImageGallery(municipio.lugar_turistico_imagen);
  const bannerImage =
    municipio.imagen ||
    (touristImages.length > 0 ? touristImages[0] : null) ||
    'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id="municipio-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="municipio-modal-card"
        className="bg-[#FAF7F2] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2D8CC] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con imagen del lugar turístico o municipio */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-black shrink-0">
          <img
            src={bannerImage}
            alt={municipio.lugar_turistico_nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/40 to-transparent" />

          {/* Botón cerrar */}
          <button
            id="btn-close-muni-modal"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all z-10"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C85228] text-white text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#FCD116]" />
              Municipio de Cochabamba
            </span>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold leading-tight drop-shadow-md">
              {municipio.nombre}
            </h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 sm:p-8 space-y-6 flex-1">
          {/* Descripción General */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] mb-2">
              Identidad y Territorio
            </h3>
            <p className="text-sm sm:text-base text-[#4A3830] leading-relaxed">
              {municipio.descripcion}
            </p>
          </div>

          {/* Ficha Cultural (Integrada, sin sección independiente) */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD5] space-y-2">
            <h3 className="font-serif-title text-lg font-bold text-[#2C221E] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C85228]" />
              Reseña Cultural y Tradición Gastronómica
            </h3>
            <p className="text-xs sm:text-sm text-[#5C483F] leading-relaxed">
              {municipio.descripcion_cultural}
            </p>
          </div>

          {/* Lugar Turístico Emblemático (Único) */}
          <div className="p-5 rounded-2xl bg-[#FFF8F5] border border-[#F5C2B3] space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#C85228]" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85228]">
                  Lugar Turístico Emblemático
                </span>
                <h4 className="font-serif-title text-base sm:text-lg font-bold text-[#2C221E]">
                  {municipio.lugar_turistico_nombre}
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#5A453C] leading-relaxed">
              {municipio.lugar_turistico_descripcion}
            </p>

            {/* Galería de fotos del lugar turístico */}
            {touristImages.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-[#8C7A70] uppercase tracking-wider block">
                  Fotografías
                </span>
                <ImageGalleryView
                  images={touristImages}
                  altTitle={municipio.lugar_turistico_nombre}
                />
              </div>
            )}

            {/* Video de YouTube del lugar turístico */}
            {municipio.lugar_turistico_video && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-[#8C7A70] uppercase tracking-wider block">
                  Video del lugar
                </span>
                <YouTubeVideoCard
                  url={municipio.lugar_turistico_video}
                  title={municipio.lugar_turistico_nombre}
                  subtitle={municipio.nombre}
                />
              </div>
            )}
          </div>

          {/* Platos del Municipio */}
          <div>
            <h3 className="font-serif-title text-xl font-bold text-[#2C221E] mb-3 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#C85228]" />
              Platos Típicos de {municipio.nombre}
            </h3>

            {municipio.platos && municipio.platos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {municipio.platos.map((plato) => (
                  <div
                    key={plato.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#D5C2B4] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {plato.imagen_principal ? (
                        <img
                          src={plato.imagen_principal}
                          alt={plato.nombre}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#FFF1EB] border border-[#F5C2B3] flex items-center justify-center shrink-0 text-[#C85228]">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-[#2C221E] truncate">
                          {plato.nombre}
                        </p>
                        <p className="text-[11px] text-[#8C7A70] line-clamp-1">
                          {plato.descripcion}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onViewRecipe(plato);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#C85228] text-white text-xs font-bold hover:bg-[#A8421D] shrink-0"
                    >
                      Ver receta
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8C7A70] italic">
                Próximamente se incorporarán más recetas tradicionales de este municipio.
              </p>
            )}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 bg-[#F4EFEA] border-t border-[#E8DFD5] flex justify-end shrink-0 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4A3830] hover:bg-[#2C221E] text-white text-xs font-bold rounded-xl transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
