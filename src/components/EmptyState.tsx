import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron resultados',
  message = 'Intenta modificar el término de búsqueda o seleccionar otro municipio.',
  onClear
}) => {
  return (
    <div id="empty-state-container" className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F0EBE1] flex items-center justify-center text-[#8C7A70] mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#3B251B] mb-2">{title}</h3>
      <p className="text-sm text-[#7D665D] max-w-md mb-6">{message}</p>
      {onClear && (
        <button
          id="btn-clear-filters"
          onClick={onClear}
          className="px-5 py-2.5 bg-[#FAF7F2] border border-[#D7C4B7] text-[#4A3830] hover:bg-[#F2ECE3] text-sm font-semibold rounded-xl transition-all"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
