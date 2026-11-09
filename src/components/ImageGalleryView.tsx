import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2 } from 'lucide-react';

interface ImageGalleryViewProps {
  images: string[];
  altTitle: string;
  className?: string;
}

export const ImageGalleryView: React.FC<ImageGalleryViewProps> = ({
  images,
  altTitle,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const activeImage = images[selectedIndex] || images[0];
  const hasMultiple = images.length > 1;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Imagen Principal Grande */}
      <div className="relative w-full aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-stone-900 border border-[#E8DFD5] shadow-xs group">
        <img
          src={activeImage}
          alt={`${altTitle} - Foto ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
          }}
        />

        {/* Controles de navegación si hay más de 1 foto */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
              title="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
              title="Siguiente foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Contador de fotos */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
              <ImageIcon className="w-3.5 h-3.5 text-[#E8927C]" />
              <span>
                {selectedIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Tira de Miniaturas si hay múltiples fotos */}
      {hasMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {images.map((imgUrl, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === i
                  ? 'border-[#C85228] scale-102 shadow-md ring-2 ring-[#C85228]/30'
                  : 'border-[#DACDC0] opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
