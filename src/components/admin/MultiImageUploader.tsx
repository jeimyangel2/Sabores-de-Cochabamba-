import React from 'react';
import { Plus, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MediaUploader } from './MediaUploader.tsx';

interface MultiImageUploaderProps {
  id: string;
  label: string;
  category: 'municipios' | 'platos';
  maxImages?: number;
  images: string[];
  onChange: (newImages: string[]) => void;
  helperText?: string;
  onUploadingStateChange?: (isUploading: boolean) => void;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  id,
  label,
  category,
  maxImages = 5,
  images,
  onChange,
  helperText = 'Hasta 5 fotos opcionales',
  onUploadingStateChange
}) => {
  const [uploadingSlots, setUploadingSlots] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const anyUploading = Object.values(uploadingSlots).some(Boolean);
    onUploadingStateChange?.(anyUploading);
  }, [uploadingSlots, onUploadingStateChange]);

  React.useEffect(() => {
    return () => {
      onUploadingStateChange?.(false);
    };
  }, [onUploadingStateChange]);

  const handleSlotUploadChange = (index: number, isUp: boolean) => {
    setUploadingSlots((prev) => {
      if (prev[index] === isUp) return prev;
      return { ...prev, [index]: isUp };
    });
  };

  // Lista efectiva: si no hay fotos, mostramos 1 slot inicial vacío para subir
  const effectiveList = images.length === 0 ? [''] : images;

  const handleAddSlot = () => {
    // Si ya hay un slot vacío al final o se alcanzó el máximo, no añadir otro
    if (images.length < maxImages && !images.includes('')) {
      onChange([...images, '']);
    }
  };

  const handleImageChange = (index: number, newUrl: string | null) => {
    const updated = [...effectiveList];
    if (newUrl && newUrl.trim()) {
      updated[index] = newUrl.trim();
    } else {
      updated[index] = '';
    }
    const filtered = updated.filter((u) => u && u.trim().length > 0);
    onChange(filtered);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...effectiveList].filter((_, i) => i !== index);
    const filtered = updated.filter((u) => u && u.trim().length > 0);
    onChange(filtered);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div id={`multi-image-uploader-${id}`} className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#C85228]" />
            <span>{label}</span>
            <span className="text-[#8F4824] font-normal text-[11px] lowercase">(opcional)</span>
          </label>
          <p className="text-[11px] text-[#7D6B62] mt-0.5">{helperText}</p>
        </div>

        <span className="text-[11px] font-bold text-[#8C7A70] bg-[#FAF0EB] px-2.5 py-1 rounded-full border border-[#F5C2B3] text-[#C85228]">
          {images.length} / {maxImages} fotos
        </span>
      </div>

      {/* Lista de subidores de fotos */}
      <div className="space-y-3">
        {effectiveList.map((url, idx) => (
          <div
            key={`${id}-slot-${idx}`}
            className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] relative space-y-2"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold text-[#7D6B62] uppercase tracking-wider flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#C85228] text-white text-[10px] inline-flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>Foto {idx + 1}</span>
              </span>

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(idx)}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                  title="Quitar esta foto"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Quitar</span>
                </button>
              )}
            </div>

            <MediaUploader
              id={`${id}-slot-${idx}`}
              label={`Seleccionar foto ${idx + 1}`}
              optional={true}
              mediaType="image"
              category={category}
              value={url || null}
              onChange={(newUrl) => handleImageChange(idx, newUrl)}
              onUploadingStateChange={(isUp) => handleSlotUploadChange(idx, isUp)}
            />
          </div>
        ))}
      </div>

      {/* Botón para añadir otra foto */}
      {canAddMore && (
        <button
          type="button"
          id={`btn-add-more-${id}`}
          onClick={handleAddSlot}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-[#DACDC0] hover:border-[#C85228] bg-white hover:bg-[#FAF7F2] text-[#C85228] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir otra foto ({images.length} de {maxImages})</span>
        </button>
      )}

      {images.length >= maxImages && (
        <p className="text-[11px] text-[#7D6B62] text-center italic">
          Has alcanzado el límite máximo de {maxImages} fotografías.
        </p>
      )}
    </div>
  );
};
