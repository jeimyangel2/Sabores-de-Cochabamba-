import React, { useState } from 'react';
import { Youtube, Play, ExternalLink } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from '../utils/youtube.ts';

interface YouTubeVideoCardProps {
  url: string | null | undefined;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  url,
  title = 'Video demostrativo en YouTube',
  subtitle,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url || !url.trim()) return null;

  const videoId = extractYouTubeId(url);
  const thumbnail = getYouTubeThumbnail(url);
  const watchUrl = getYouTubeWatchUrl(url);

  // Si no es un enlace de YouTube y parece un archivo local o directo de video (fallback de compatibilidad)
  if (!videoId) {
    if (url.includes('.mp4') || url.includes('.webm')) {
      return (
        <div className={`rounded-2xl overflow-hidden border border-[#E8DFD5] bg-black shadow-md ${className}`}>
          <video src={url} controls className="w-full max-h-96 object-contain">
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`rounded-2xl overflow-hidden border border-[#E8DFD5] bg-[#FAF7F2] shadow-xs space-y-3 ${className}`}>
      {/* Contenedor del video */}
      <div className="relative aspect-video w-full bg-black overflow-hidden group">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
              onClick={() => setIsPlaying(true)}
              onError={(e) => {
                // Fallback a thumbnail estándar si hqdefault no está disponible
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
              }}
            />
            {/* Overlay gradiente */}
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/95 text-white text-xs font-bold shadow-md">
                  <Youtube className="w-4 h-4 fill-white" />
                  <span>YouTube</span>
                </span>

                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 rounded-full bg-black/60 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1 transition-colors"
                  title="Abrir en YouTube"
                >
                  <span>Abrir en YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Botón central Play */}
              <div className="self-center">
                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Título inferior */}
              <div>
                <p className="text-white font-serif-title font-bold text-base drop-shadow-md line-clamp-1">
                  {title}
                </p>
                {subtitle && (
                  <p className="text-white/80 text-xs drop-shadow-xs line-clamp-1 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
