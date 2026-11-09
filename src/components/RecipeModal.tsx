import React, { useState } from 'react';
import { X, MapPin, ChefHat, Check, Copy, Printer, Video, Image as ImageIcon, Sparkles, Utensils } from 'lucide-react';
import { Plato } from '../types/index.ts';
import { ImageGalleryView } from './ImageGalleryView.tsx';
import { YouTubeVideoCard } from './YouTubeVideoCard.tsx';
import { parseImageGallery } from '../utils/youtube.ts';

interface RecipeModalProps {
  plato: Plato | null;
  onClose: () => void;
  onFilterByMunicipality?: (municipioId: number) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  plato,
  onClose,
  onFilterByMunicipality
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!plato) return null;

  // Procesar lista de ingredientes (por saltos de línea)
  const ingredientsList = plato.ingredientes
    ? plato.ingredientes
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
    : [];

  // Procesar pasos de preparación (por saltos de línea o números)
  const preparationSteps = plato.preparacion
    ? plato.preparacion
        .split('\n')
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    : [];

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCopyRecipe = () => {
    const text = `${plato.nombre} - Sabores de Cochabamba\nMunicipio: ${plato.municipio_nombre || 'Cochabamba'}\n\nDESCRIPCIÓN:\n${plato.descripcion}\n\nINGREDIENTES:\n${plato.ingredientes}\n\nPREPARACIÓN:\n${plato.preparacion}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="recipe-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="recipe-modal-card"
        className="bg-[#FAF7F2] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2D8CC] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con Imagen Protagonista */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-[#2C221E] shrink-0">
          {plato.imagen_principal ? (
            <img
              src={plato.imagen_principal}
              alt={plato.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#3B251B] to-[#703517] text-white/40">
              <Utensils className="w-16 h-16 text-[#C85228]/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/40 to-transparent" />

          {/* Botón cerrar */}
          <button
            id="btn-close-recipe-modal"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all z-10"
            aria-label="Cerrar receta"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Información sobrepuesta */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {plato.municipio_nombre && (
                <button
                  onClick={() => {
                    if (onFilterByMunicipality) {
                      onFilterByMunicipality(plato.municipio_id);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C85228] text-white text-xs font-bold hover:bg-[#A8421D] transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FCD116]" />
                  <span>{plato.municipio_nombre}</span>
                </button>
              )}
              {Boolean(plato.destacado) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Plato Emblemático
                </span>
              )}
            </div>

            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold leading-tight drop-shadow-md">
              {plato.nombre}
            </h2>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-8 space-y-8 flex-1">
          
          {/* Descripción & Barra de Herramientas */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8DFD5]">
            <p className="text-sm sm:text-base text-[#5A453C] leading-relaxed max-w-xl">
              {plato.descripcion}
            </p>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                id="btn-copy-recipe"
                onClick={handleCopyRecipe}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D7C4B7] hover:bg-[#F2ECE3] text-[#4A3830] text-xs font-semibold transition-colors"
                title="Copiar texto de receta"
              >
                <Copy className="w-3.5 h-3.5 text-[#C85228]" />
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
              <button
                id="btn-print-recipe"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D7C4B7] hover:bg-[#F2ECE3] text-[#4A3830] text-xs font-semibold transition-colors"
                title="Imprimir receta"
              >
                <Printer className="w-3.5 h-3.5 text-[#C85228]" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>

          {/* Sección de Ingredientes con Checklist interactiva */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-title text-xl font-bold text-[#2C221E] flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#C85228]" />
                Ingredientes Tradicionales
              </h3>
              <span className="text-xs text-[#8C7A70]">
                {ingredientsList.length} ingredientes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ingredientsList.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-[#F2ECE3]/70 border-[#D5C2B4] text-[#8C7A70] line-through'
                        : 'bg-white border-[#E8DFD5] hover:border-[#C85228]/50 text-[#3B251B]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-[#C85228] text-white'
                          : 'border border-[#C8B8AE] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-snug">
                      {ing}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sección de Preparación Paso a Paso */}
          <div>
            <h3 className="font-serif-title text-xl font-bold text-[#2C221E] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFF1EB] text-[#C85228] flex items-center justify-center text-xs font-bold font-sans">
                1
              </span>
              Preparación Paso a Paso
            </h3>

            <div className="space-y-4">
              {preparationSteps.map((step, idx) => {
                // Eliminar posibles prefijos numéricos para formatear uniformemente
                const cleanStep = step.replace(/^\d+[\.\)]\s*/, '');
                return (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-2xs"
                  >
                    <span className="w-7 h-7 rounded-xl bg-[#FAF7F2] border border-[#E2D8CC] text-[#C85228] font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#4A3830] leading-relaxed pt-0.5">
                      {cleanStep}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manejo de Multimedia Opcional (imagen_preparacion / video_preparacion) */}
          {(() => {
            const prepImages = parseImageGallery(plato.imagen_preparacion);
            if (prepImages.length === 0 && !plato.video_preparacion) return null;
            return (
              <div className="pt-4 border-t border-[#E8DFD5] space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#6B574F] flex items-center gap-2">
                  <span>Material Multimedia de la Receta</span>
                </h4>

                {/* Galería de preparación */}
                {prepImages.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase tracking-wider">
                      <ImageIcon className="w-3.5 h-3.5 text-[#C85228]" />
                      <span>Fotografías de preparación</span>
                    </span>
                    <ImageGalleryView
                      images={prepImages}
                      altTitle={`Preparación de ${plato.nombre}`}
                    />
                  </div>
                )}

                {/* Video de YouTube de preparación */}
                {plato.video_preparacion && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase tracking-wider">
                      <Video className="w-3.5 h-3.5 text-[#C85228]" />
                      <span>Video explicativo en YouTube</span>
                    </span>
                    <YouTubeVideoCard
                      url={plato.video_preparacion}
                      title={`Preparación de ${plato.nombre}`}
                      subtitle={plato.nombre}
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {/* Nota de arquitectura y flexibilidad de la receta */}
          <div className="p-4 rounded-2xl bg-[#F0EBE1]/60 border border-[#E2D8CC] flex items-start gap-3 text-xs text-[#7D665D]">
            <Sparkles className="w-4 h-4 text-[#C85228] shrink-0 mt-0.5" />
            <p>
              <strong>Formato flexible:</strong> Esta receta funciona de manera óptima tanto sólo en texto descriptivo como enriquecida con fotografía y video de apoyo, garantizando la preservación fidedigna de nuestras tradiciones cochabambinas.
            </p>
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="p-4 sm:p-6 bg-[#F4EFEA] border-t border-[#E8DFD5] flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-[#8C7A70] italic">
            Sabores de Cochabamba • Patrimonio Culinario
          </span>
          <button
            id="btn-close-recipe-modal-bottom"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4A3830] hover:bg-[#2C221E] text-white text-xs font-bold rounded-xl transition-all"
          >
            Cerrar receta
          </button>
        </div>
      </div>
    </div>
  );
};
