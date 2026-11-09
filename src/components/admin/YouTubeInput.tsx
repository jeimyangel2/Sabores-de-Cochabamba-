import React, { useState } from 'react';
import { Youtube, ExternalLink, X, CheckCircle2, Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from '../../utils/youtube.ts';

interface YouTubeInputProps {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  placeholder?: string;
}

export const YouTubeInput: React.FC<YouTubeInputProps> = ({
  id,
  label,
  optional = true,
  value,
  onChange,
  helperText = 'Pega un enlace de YouTube (video tradicional o short)',
  placeholder = 'Ej. https://www.youtube.com/watch?v=... o https://youtu.be/...'
}) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoId = extractYouTubeId(value);
  const thumbnail = getYouTubeThumbnail(value);
  const watchUrl = getYouTubeWatchUrl(value);

  const handleClear = () => {
    onChange('');
    setIsPlayingPreview(false);
  };

  return (
    <div id={`youtube-input-container-${id}`} className="space-y-2">
      {/* Etiqueta del campo */}
      <div className="flex items-center justify-between">
        <label htmlFor={`input-${id}`} className="block text-xs font-bold text-[#4A3830] flex items-center gap-1.5">
          <Youtube className="w-4 h-4 text-red-600" />
          <span>{label}</span>{' '}
          {optional ? (
            <span className="text-[#8F4824] font-normal text-[11px]">(opcional)</span>
          ) : (
            <span className="text-red-500 font-bold">*</span>
          )}
        </label>
        {helperText && <span className="text-[11px] text-[#8C7A70]">{helperText}</span>}
      </div>

      {/* Input de texto para la URL */}
      <div className="relative rounded-xl shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-600">
          <Youtube className="h-4 w-4" />
        </div>
        <input
          id={`input-${id}`}
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsPlayingPreview(false);
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5] text-[#2C221E]"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C7A70] hover:text-[#2C221E]"
            title="Borrar enlace"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Vista previa inmediata del video si el enlace es válido */}
      {videoId && thumbnail && (
        <div className="border border-[#E2D8CC] rounded-2xl p-3 bg-[#FAF7F2] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Video de YouTube detectado
            </span>

            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-[11px] font-semibold underline underline-offset-2"
            >
              <span>Abrir en YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Tarjeta de previsualización */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[#DACDC0] shadow-2xs group">
            {isPlayingPreview ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Vista previa YouTube"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={thumbnail}
                  alt="Miniatura de YouTube"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(true)}
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                    title="Reproducir vista previa"
                  >
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500" />
                  <span>YouTube</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {value && !videoId && (
        <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          El enlace ingresado no parece ser de YouTube. Asegúrate de copiar el enlace completo desde tu navegador o la app de YouTube (ej. https://youtu.be/abc o https://www.youtube.com/watch?v=abc).
        </p>
      )}
    </div>
  );
};
