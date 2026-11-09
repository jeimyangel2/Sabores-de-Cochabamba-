import React, { useState } from 'react';
import { MapPin, Utensils } from 'lucide-react';
import { Plato } from '../types/index.ts';
import { parseImageGallery } from '../utils/youtube.ts';

interface DishCardProps {
  plato: Plato;
  onViewRecipe: (plato: Plato) => void;
  onFilterByMunicipality?: (municipioId: number) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  plato,
  onViewRecipe,
}) => {
  const [imgError, setImgError] = useState(false);

  const prepGallery = parseImageGallery(plato.imagen_preparacion);
  const effectiveImage = plato.imagen_principal || (prepGallery.length > 0 ? prepGallery[0] : null);
  const hasImage = Boolean(effectiveImage) && !imgError;

  return (
    <article
      id={`plato-card-${plato.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E6DDD3] shadow-xs hover:shadow-md transition-all duration-200"
    >
      {/* 1. Imagen Principal */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F2ECE3] flex items-center justify-center">
        {hasImage ? (
          <img
            src={effectiveImage!}
            alt={plato.nombre}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Espacio visual alternativo apropiado si no tiene imagen o si falla */
          <div className="flex flex-col items-center justify-center p-4 text-center text-[#8C7A70] w-full h-full bg-gradient-to-br from-[#FAF7F2] to-[#ECE3D8]">
            <div className="w-12 h-12 rounded-full bg-white/80 border border-[#DACDC0] flex items-center justify-center mb-2 shadow-2xs">
              <Utensils className="w-6 h-6 text-[#8F4824]" />
            </div>
            <span className="text-[11px] font-semibold text-[#5A453C]">Sabores de Cochabamba</span>
            <span className="text-[10px] text-[#A8988E]">Plato tradicional</span>
          </div>
        )}
      </div>

      {/* 2. Contenido: Nombre, Municipio, Descripción breve, Botón Ver receta */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        {/* Nombre del plato */}
        <h3 className="font-bold text-base sm:text-lg text-[#241712] tracking-tight leading-snug line-clamp-1">
          {plato.nombre}
        </h3>

        {/* Municipio */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A3E20] font-semibold">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C84A22]" />
          <span className="line-clamp-1">{plato.municipio_nombre || 'Cochabamba'}</span>
        </div>

        {/* Descripción breve */}
        <p className="text-xs text-[#6B5A52] leading-relaxed line-clamp-2 flex-1">
          {plato.descripcion}
        </p>

        {/* Botón Ver receta */}
        <div className="pt-2">
          <button
            id={`btn-ver-receta-${plato.id}`}
            onClick={() => onViewRecipe(plato)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#8F4824] hover:bg-[#783918] active:bg-[#632E12] text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <span>Ver receta</span>
          </button>
        </div>
      </div>
    </article>
  );
};
