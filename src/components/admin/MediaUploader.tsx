import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Play
} from 'lucide-react';
import { uploadMediaFile, deleteMediaFile } from '../../services/api.ts';

interface MediaUploaderProps {
  id: string;
  label: string;
  optional?: boolean;
  mediaType: 'image' | 'video';
  category: 'municipios' | 'platos' | 'videos';
  value: string | null;
  onChange: (newUrl: string | null) => void;
  helperText?: string;
  onUploadingStateChange?: (isUploading: boolean) => void;
}

const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm'];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  id,
  label,
  optional = true,
  mediaType,
  category,
  value,
  onChange,
  helperText,
  onUploadingStateChange
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [selectedFileInfo, setSelectedFileInfo] = useState<{
    name: string;
    sizeFormatted: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCleanFileName = (pathOrUrl: string): string => {
    if (!pathOrUrl) return '';
    const parts = pathOrUrl.split('/');
    return parts[parts.length - 1] || pathOrUrl;
  };

  const handleFileSelection = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isImage = mediaType === 'image';
    const isVideo = mediaType === 'video';

    // 1. Validar extensión y formato
    if (isImage && !ALLOWED_IMAGE_EXTS.includes(ext)) {
      setErrorMessage('Tipo de archivo no permitido. Solo se permiten imágenes en formato JPG, JPEG, PNG o WEBP.');
      return;
    }
    if (isVideo && !ALLOWED_VIDEO_EXTS.includes(ext)) {
      setErrorMessage('Tipo de archivo no permitido. Solo se permiten videos en formato MP4 o WEBM.');
      return;
    }

    // 2. Validar tamaño máximo
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      setErrorMessage('El archivo supera el tamaño máximo permitido para imágenes (máximo 10 MB).');
      return;
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      setErrorMessage('El archivo supera el tamaño máximo permitido para videos (máximo 100 MB).');
      return;
    }

    // Vista previa inmediata en navegador
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setSelectedFileInfo({
      name: file.name,
      sizeFormatted: formatFileSize(file.size)
    });

    // 3. Subir archivo al backend (carpeta uploads/)
    try {
      setIsUploading(true);
      onUploadingStateChange?.(true);
      const targetCategory = isVideo ? 'videos' : category;
      const result = await uploadMediaFile(file, targetCategory);

      // Actualizar valor en el formulario
      onChange(result.url);
      setSuccessMessage('Archivo cargado correctamente');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error('[Upload Error]:', err);
      setErrorMessage(err.message || 'Error al procesar el archivo. Puedes intentar seleccionarlo de nuevo.');
      // Se mantiene localPreview y selectedFileInfo para no eliminar la imagen del usuario
    } finally {
      setIsUploading(false);
      onUploadingStateChange?.(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
    // Limpiar input para permitir reseleccionar el mismo archivo
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRemoveFile = async () => {
    if (value && (value.startsWith('/uploads/') || value.includes('/storage/v1/object/public/media/'))) {
      // Eliminar de manera limpia
      await deleteMediaFile(value);
    }
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    setSelectedFileInfo(null);
    setSuccessMessage(null);
    setErrorMessage(null);
    onChange(null);
  };

  const activeMediaUrl = localPreview || value;

  return (
    <div id={`media-uploader-container-${id}`} className="space-y-2">
      {/* Encabezado del campo */}
      <div className="flex items-center justify-between">
        <label htmlFor={`input-${id}`} className="block text-xs font-bold text-[#4A3830]">
          {label}{' '}
          {optional ? (
            <span className="text-[#8F4824] font-normal text-[11px]">(opcional)</span>
          ) : (
            <span className="text-red-500 font-bold">*</span>
          )}
        </label>
        {helperText && <span className="text-[11px] text-[#8C7A70]">{helperText}</span>}
      </div>

      {/* Input nativo oculto */}
      <input
        ref={fileInputRef}
        id={`input-${id}`}
        type="file"
        accept={mediaType === 'image' ? '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp' : '.mp4,.webm,video/mp4,video/webm'}
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Si existe un archivo seleccionado o almacenado actualmente */}
      {activeMediaUrl ? (
        <div className="border border-[#E2D8CC] rounded-2xl p-4 bg-[#FAF7F2] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1EB] border border-[#F5C2B3] flex items-center justify-center shrink-0 text-[#C85228]">
                {mediaType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2C221E] truncate">
                  {selectedFileInfo?.name || getCleanFileName(activeMediaUrl)}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#7D6B62]">
                  {selectedFileInfo && <span>{selectedFileInfo.sizeFormatted} •</span>}
                  {isUploading ? (
                    <span className="text-amber-800 font-semibold flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                      Subiendo a la nube, espera...
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Listo para guardar
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones: Reemplazar o Eliminar */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id={`btn-replace-${id}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1.5 rounded-lg border border-[#DACDC0] bg-white hover:bg-[#F2ECE3] text-[#4A3830] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Reemplazar archivo"
              >
                <RefreshCw className="w-3 h-3 text-[#C85228]" />
                <span>Reemplazar</span>
              </button>
              <button
                type="button"
                id={`btn-remove-${id}`}
                onClick={handleRemoveFile}
                disabled={isUploading}
                className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Eliminar archivo"
              >
                <Trash2 className="w-3 h-3" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>

          {/* Área de Visualización y Reproducción */}
          <div className="relative rounded-xl overflow-hidden border border-[#E2D8CC] bg-black/5 flex items-center justify-center">
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10">
                <RefreshCw className="w-7 h-7 animate-spin text-[#FCD116]" />
                <span className="text-xs font-bold drop-shadow">Subiendo a Supabase Storage...</span>
                <span className="text-[10px] text-white/80">Espera un momento antes de guardar</span>
              </div>
            )}
            {mediaType === 'image' ? (
              <img
                src={activeMediaUrl}
                alt="Vista previa"
                className="w-full max-h-56 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            ) : (
              <video
                src={activeMediaUrl}
                controls
                className="w-full max-h-64 bg-black object-contain"
                preload="metadata"
              >
                Tu navegador no soporta la reproducción de video HTML5.
              </video>
            )}
          </div>
        </div>
      ) : (
        /* Zona de Carga (Drag & Drop / Clic) */
        <div
          id={`dropzone-${id}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
            isDragging
              ? 'border-[#C85228] bg-[#FFF1EB]/50 scale-[1.01]'
              : 'border-[#DACDC0] bg-[#FAF7F2] hover:bg-[#F5EFE6] hover:border-[#C85228]/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#DACDC0] flex items-center justify-center text-[#C85228] shadow-2xs">
            {isUploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : mediaType === 'image' ? (
              <ImageIcon className="w-6 h-6" />
            ) : (
              <Video className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-[#2C221E]">
              {isUploading ? (
                'Cargando archivo al servidor local...'
              ) : (
                <>
                  <span className="text-[#C85228] underline underline-offset-2">Haz clic para seleccionar</span> o arrastra tu archivo
                </>
              )}
            </p>
            <p className="text-[11px] text-[#7D6B62] mt-0.5">
              {mediaType === 'image'
                ? 'Imágenes JPG, PNG o WEBP (tamaño máximo: 10 MB)'
                : 'Videos MP4 o WEBM con reproducción HTML5 (tamaño máximo: 100 MB)'}
            </p>
          </div>
        </div>
      )}

      {/* Mensajes de Estado */}
      {errorMessage && (
        <div
          id={`error-media-${id}`}
          className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          id={`success-media-${id}`}
          className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
