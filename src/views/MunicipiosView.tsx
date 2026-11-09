import React, { useState } from 'react';
import { MapPin, Search, X, ArrowRight, Utensils, Compass } from 'lucide-react';
import { Municipio } from '../types/index.ts';
import { parseImageGallery } from '../utils/youtube.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { ErrorState } from '../components/ErrorState.tsx';

interface MunicipiosViewProps {
  municipios: Municipio[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelectMunicipio: (municipio: Municipio) => void;
}

export const MunicipiosView: React.FC<MunicipiosViewProps> = ({
  municipios,
  loading,
  error,
  onRetry,
  onSelectMunicipio
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Buscador de municipios por nombre (también cotejando descripción)
  const filteredMunicipios = municipios.filter((m) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.nombre.toLowerCase().includes(term) ||
      m.descripcion.toLowerCase().includes(term)
    );
  });

  return (
    <div id="municipios-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* 2. Encabezado, Título y Breve Descripción */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5EE] text-emerald-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Valles, Alturas y Tradición Culinaria</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C221E] tracking-tight">
          Municipios
        </h1>
        <p className="text-sm sm:text-base text-[#6B574F] max-w-2xl leading-relaxed">
          Explora los municipios de Cochabamba, su identidad cultural forjada por generaciones, sus lugares turísticos emblemáticos y las recetas tradicionales que definen su patrimonio gastronómico.
        </p>
      </div>

      {/* 4. Buscador de Municipios */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-4 sm:p-5 border border-[#E8DFD5] shadow-xs">
        <div className="relative w-full sm:w-96">
          <input
            id="municipios-search-input"
            type="text"
            placeholder="Buscar municipio por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl bg-[#FAF7F2] border border-[#DACDC0] text-[#2C221E] placeholder-[#9E8B81] focus:outline-none focus:ring-2 focus:ring-[#C85228]/40 focus:border-[#C85228]"
          />
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3.5" />
          {searchTerm && (
            <button
              id="btn-clear-search-municipios"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 text-[#8C7A70] hover:text-[#2C221E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs font-semibold text-[#8C7A70] self-start sm:self-auto">
          Mostrando <span className="text-[#C85228] font-bold">{filteredMunicipios.length}</span> {filteredMunicipios.length === 1 ? 'municipio' : 'municipios'}
        </div>
      </div>

      {/* Listado de Tarjetas de Municipios */}
      {loading ? (
        <LoadingState message="Cargando municipios..." />
      ) : error ? (
        <ErrorState
          title="Error al consultar los municipios"
          message={error}
          onRetry={onRetry}
        />
      ) : municipios.length === 0 ? (
        <EmptyState
          title="Todavía no hay municipios registrados."
          message="No se encontraron registros de municipios en la base de datos."
        />
      ) : filteredMunicipios.length === 0 ? (
        <EmptyState
          title="No se encontraron municipios con esa búsqueda."
          message={`No encontramos ningún municipio que coincida con "${searchTerm}".`}
          onClear={() => setSearchTerm('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMunicipios.map((muni) => {
            const touristGallery = parseImageGallery(muni.lugar_turistico_imagen);
            const imgUrl = muni.imagen || (touristGallery.length > 0 ? touristGallery[0] : null);
            return (
              <article
                key={muni.id}
                id={`municipio-card-${muni.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all hover:border-[#DACDC0]"
              >
                {/* Imagen del Municipio */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F2ECE3]">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={muni.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    /* Espacio alternativo elegante cuando no existe imagen */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF7F2] to-[#ECE3D8] text-[#8C7A70]">
                      <MapPin className="w-8 h-8 text-[#C85228] mb-2" />
                      <span className="font-serif-title font-bold text-sm text-[#5A453C]">{muni.nombre}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C85228] text-white text-[11px] font-bold shadow-xs">
                      <MapPin className="w-3 h-3 text-[#FCD116]" />
                      <span>Cochabamba</span>
                    </span>
                  </div>
                </div>

                {/* Contenido: Nombre, Descripción Breve y Botón */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-serif-title text-2xl font-bold text-[#2C221E] group-hover:text-[#C85228] transition-colors">
                      {muni.nombre}
                    </h2>
                    
                    {/* Descripción breve */}
                    <p className="text-sm text-[#6B574F] leading-relaxed line-clamp-3 font-serif-body">
                      {muni.descripcion}
                    </p>
                  </div>

                  {/* Lugar turístico emblema breve o platos */}
                  {muni.lugar_turistico_nombre && (
                    <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-2 text-xs text-[#8F4824]">
                      <Compass className="w-3.5 h-3.5 text-[#C85228] shrink-0" />
                      <span className="truncate font-semibold">{muni.lugar_turistico_nombre}</span>
                    </div>
                  )}

                  {/* Botón “Ver municipio” */}
                  <div className="pt-2">
                    <button
                      id={`btn-ver-municipio-${muni.id}`}
                      onClick={() => onSelectMunicipio(muni)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#8F4824] text-[#4A3830] hover:text-white border border-[#DACDC0] hover:border-[#8F4824] text-xs font-bold transition-all shadow-2xs group-hover:shadow-xs"
                    >
                      <span>Ver municipio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
};
