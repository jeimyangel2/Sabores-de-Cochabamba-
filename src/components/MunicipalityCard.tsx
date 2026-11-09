import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Municipio } from '../types/index.ts';

import { parseImageGallery } from '../utils/youtube.ts';

interface MunicipalityCardProps {
  municipio: Municipio;
  onSelect: (municipio: Municipio) => void;
  onExplorePlatos: (municipioId: number) => void;
}

export const MunicipalityCard: React.FC<MunicipalityCardProps> = ({
  municipio,
  onSelect,
  onExplorePlatos
}) => {
  const [imgError, setImgError] = useState(false);

  const touristGallery = parseImageGallery(municipio.lugar_turistico_imagen);
  const registeredImage = municipio.imagen || (touristGallery.length > 0 ? touristGallery[0] : null);
  const hasImage = Boolean(registeredImage) && !imgError;

  return (
    <article
      id={`municipio-card-${municipio.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E6DDD3] shadow-xs hover:shadow-md transition-all duration-200"
    >
      {/* 1. Imagen cuando exista */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-[#EFE9DF] cursor-pointer flex items-center justify-center"
        onClick={() => onSelect(municipio)}
      >
        {hasImage ? (
          <img
            src={registeredImage!}
            alt={municipio.nombre}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-[#8C7A70] w-full h-full bg-gradient-to-br from-[#FAF7F2] to-[#ECE3D8]">
            <div className="w-12 h-12 rounded-full bg-white/80 border border-[#DACDC0] flex items-center justify-center mb-2 shadow-2xs">
              <MapPin className="w-6 h-6 text-[#C85228]" />
            </div>
            <span className="text-[11px] font-semibold text-[#5A453C]">{municipio.nombre}</span>
            <span className="text-[10px] text-[#A8988E]">Cochabamba</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#241A15]/75 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-[#FCD116]" />
          <span>Cochabamba</span>
        </div>
      </div>

      {/* 2. Contenido: Nombre, Descripción breve, Botón Ver municipio */}
      <div className="p-4 flex flex-col flex-1 space-y-2">
        <h3 
          className="font-bold text-base text-[#241712] tracking-tight leading-tight cursor-pointer hover:text-[#C85228] transition-colors"
          onClick={() => onSelect(municipio)}
        >
          {municipio.nombre}
        </h3>

        <p className="text-xs text-[#6B5A52] leading-relaxed line-clamp-2 flex-1">
          {municipio.descripcion}
        </p>

        <div className="pt-2">
          <button
            id={`btn-ver-muni-${municipio.id}`}
            onClick={() => onSelect(municipio)}
            className="w-full py-2 px-3 rounded-lg bg-[#FAF5EE] hover:bg-[#8F4824] hover:text-white border border-[#DACDC0] hover:border-[#8F4824] text-[#8F4824] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-2xs group/btn cursor-pointer"
          >
            <span>Ver municipio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
