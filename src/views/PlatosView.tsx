import React from 'react';
import { Utensils, Search, Filter, X } from 'lucide-react';
import { Municipio, Plato } from '../types/index.ts';
import { DishCard } from '../components/DishCard.tsx';
import { LoadingState } from '../components/LoadingState.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { ErrorState } from '../components/ErrorState.tsx';

interface PlatosViewProps {
  platos: Plato[];
  municipios: Municipio[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  selectedMunicipioId: number | null;
  onSelectMunicipio: (id: number | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onViewRecipe: (plato: Plato) => void;
}

export const PlatosView: React.FC<PlatosViewProps> = ({
  platos,
  municipios,
  loading,
  error,
  onRetry,
  selectedMunicipioId,
  onSelectMunicipio,
  searchTerm,
  setSearchTerm,
  onViewRecipe
}) => {
  const selectedMunicipio = municipios.find((m) => m.id === selectedMunicipioId);

  return (
    <div id="platos-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabecera de la Sección */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1EB] text-[#C85228] text-xs font-bold">
          <Utensils className="w-3.5 h-3.5" />
          <span>Tradición y Sabor</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C221E] tracking-tight">
          Platos Típicos de Cochabamba
        </h1>
        <p className="text-sm sm:text-base text-[#6B574F] max-w-2xl leading-relaxed">
          Explora los sabores emblemáticos de los valles cochabambinos. Consulta ingredientes, secretos de preparación y recetas completas organizadas por municipio.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8DFD5] shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-96">
            <input
              id="platos-search-input"
              type="text"
              placeholder="Buscar por nombre, ingrediente o sabor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl bg-[#FAF7F2] border border-[#DACDC0] text-[#2C221E] placeholder-[#9E8B81] focus:outline-none focus:ring-2 focus:ring-[#C85228]/40 focus:border-[#C85228]"
            />
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3.5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 text-[#8C7A70] hover:text-[#2C221E]"
                aria-label="Borrar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="text-xs font-semibold text-[#8C7A70] self-start md:self-auto">
            Mostrando <span className="text-[#C85228] font-bold">{platos.length}</span> recetas típicas
          </div>
        </div>

        {/* Filtro por Municipios (Pills) */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#8C7A70]">
            <Filter className="w-3.5 h-3.5 text-[#C85228]" />
            <span>Filtrar por municipio:</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              id="filter-muni-all"
              onClick={() => onSelectMunicipio(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMunicipioId === null
                  ? 'bg-[#C85228] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5C483F] border border-[#E2D8CC] hover:bg-[#F0EBE1]'
              }`}
            >
              Todos los municipios
            </button>

            {municipios.map((muni) => {
              const isSelected = selectedMunicipioId === muni.id;
              return (
                <button
                  key={muni.id}
                  id={`filter-muni-${muni.id}`}
                  onClick={() => onSelectMunicipio(isSelected ? null : muni.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#C85228] text-white font-bold shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C483F] border border-[#E2D8CC] hover:bg-[#F0EBE1]'
                  }`}
                >
                  {muni.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicador de filtro activo */}
        {(selectedMunicipio || searchTerm) && (
          <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#7D665D]">
            <span>
              Filtro activo:{' '}
              {selectedMunicipio && (
                <strong className="text-[#C85228]">Municipio: {selectedMunicipio.nombre}</strong>
              )}
              {selectedMunicipio && searchTerm && ' • '}
              {searchTerm && (
                <strong className="text-[#C85228]">Búsqueda: "{searchTerm}"</strong>
              )}
            </span>
            <button
              id="btn-reset-all-filters"
              onClick={() => {
                onSelectMunicipio(null);
                setSearchTerm('');
              }}
              className="text-[#C85228] font-bold hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

      </div>

      {/* Listado de Platos */}
      {loading ? (
        <LoadingState message="Cargando platos..." />
      ) : error ? (
        <ErrorState
          title="Error al consultar el catálogo de platos"
          message={error}
          onRetry={onRetry}
        />
      ) : platos.length === 0 ? (
        <EmptyState
          title={
            searchTerm
              ? "No se encontraron platos con esa búsqueda."
              : selectedMunicipio
              ? `Este municipio todavía no tiene platos registrados.`
              : "Todavía no hay platos registrados."
          }
          message={
            searchTerm
              ? `No encontramos ningún plato que coincida con "${searchTerm}".`
              : selectedMunicipio
              ? `Próximamente se publicarán las recetas tradicionales de ${selectedMunicipio.nombre}.`
              : "Pronto se registrarán nuevas recetas tradicionales de Cochabamba."
          }
          onClear={() => {
            onSelectMunicipio(null);
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {platos.map((plato) => (
            <DishCard
              key={plato.id}
              plato={plato}
              onViewRecipe={onViewRecipe}
              onFilterByMunicipality={onSelectMunicipio}
            />
          ))}
        </div>
      )}

    </div>
  );
};
