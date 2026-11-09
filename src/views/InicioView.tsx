import React, { useRef } from 'react';
import { ChefHat, MapPin, ChevronLeft, ChevronRight, ArrowRight, Utensils, Heart, Sparkles, AlertCircle, Database } from 'lucide-react';
import { Municipio, Plato, HeroConfig } from '../types/index.ts';
import { DishCard } from '../components/DishCard.tsx';
import { MunicipalityCard } from '../components/MunicipalityCard.tsx';
import { LoadingState } from '../components/LoadingState.tsx';

interface InicioViewProps {
  platosDestacados: Plato[];
  municipios: Municipio[];
  heroConfig?: HeroConfig | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onViewRecipe: (plato: Plato) => void;
  onExploreMunicipality: (municipioId: number) => void;
  onSelectMunicipality: (municipio: Municipio) => void;
  onNavigateToPlatos: () => void;
  onNavigateToMunicipios: () => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  platosDestacados,
  municipios,
  heroConfig,
  loading,
  error,
  onRetry,
  onViewRecipe,
  onExploreMunicipality,
  onSelectMunicipality,
  onNavigateToPlatos,
  onNavigateToMunicipios
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const bannerImage = heroConfig?.banner_imagen || '';
  const bannerTitulo = heroConfig?.banner_titulo || 'Sabores de Cochabamba';
  const bannerSubtitulo = heroConfig?.banner_subtitulo || 'Tierra bendecida por su cocina y sus tradiciones';
  const bannerDescripcion = heroConfig?.banner_descripcion || '';
  const insigniaTitulo = heroConfig?.insignia_titulo || '';
  const insigniaSubtitulo = heroConfig?.insignia_subtitulo || '';
  const insigniaImagen = heroConfig?.insignia_imagen || '';
  const insigniaDescripcion = heroConfig?.insignia_descripcion || '';

  // Buscar si el platillo insignia corresponde a un plato del catálogo para abrir su receta al hacer clic
  const linkedPlato = heroConfig?.insignia_plato_id
    ? platosDestacados.find(p => p.id === heroConfig.insignia_plato_id)
    : platosDestacados.find(p => p.nombre.toLowerCase().includes(insigniaTitulo.toLowerCase()));

  return (
    <div id="inicio-view" className="space-y-12 sm:space-y-16 pb-16">
      
      {/* ========================================================
          1. HERO PRINCIPAL
          - Sección visual personalizable desde el panel de administración.
          - ELEMENTO PRINCIPAL: Platillo Insignia y fondo panorámico.
         ======================================================== */}
      {/* ========================================================
          1. HERO PRINCIPAL
          - Sección visual personalizable desde el panel de administración.
          - Fondo panorámico 100% nítido, claro y sin capas opacas.
          - Platillo Insignia protagonista configurado por el Administrador.
         ======================================================== */}
      <section
        id="hero-section"
        className="relative overflow-hidden w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] bg-[#1a0f0a] text-white flex items-center"
      >
        {/* Capa de fondo panorámico claro y nítido */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#2A1810] via-[#1a0f0a] to-[#241712]">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Banner gastronómico de Cochabamba"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/40 border border-white/5">
              <Sparkles className="w-12 h-12 mb-2 text-[#C85228]/40 animate-pulse" />
              <p className="text-sm font-medium">Sube tu banner panorámico desde el panel de administración</p>
            </div>
          )}
        </div>

        {/* Contenido del Hero: Platillo Insignia protagonista */}
        {insigniaImagen ? (
          <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-10 sm:py-14 flex items-center justify-center sm:justify-end">
            <div className="relative flex flex-col items-center sm:items-end">
              {insigniaTitulo && (
                <div className="mb-3 text-center sm:text-right bg-black/45 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl max-w-xs">
                  <p className="font-brush text-2xl sm:text-3xl text-white leading-none drop-shadow-md">
                    {insigniaTitulo}
                  </p>
                  {insigniaSubtitulo && (
                    <p className="font-cursive text-sm sm:text-base text-white/95 drop-shadow-xs mt-0.5">
                      {insigniaSubtitulo}
                    </p>
                  )}
                </div>
              )}

              {/* Cazuela protagonista de barro con el Platillo Insignia */}
              <div
                onClick={() => {
                  if (linkedPlato) {
                    onViewRecipe(linkedPlato);
                  }
                }}
                className={`relative w-64 sm:w-80 lg:w-92 aspect-square rounded-full p-2.5 bg-[#422216]/80 border-4 border-[#7A3E20] shadow-2xl overflow-hidden group ${
                  linkedPlato ? 'cursor-pointer hover:border-[#FCD116]' : ''
                }`}
                title={linkedPlato ? `Ver receta tradicional de ${insigniaTitulo}` : insigniaTitulo}
              >
                <img
                  src={insigniaImagen}
                  alt={insigniaTitulo}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
              </div>

              {insigniaDescripcion && (
                <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/55 backdrop-blur-md text-[11px] text-white/95 border border-white/20 max-w-sm text-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#E05326] animate-pulse shrink-0" />
                  <span className="truncate">{insigniaDescripcion}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* ========================================================
          2. CARRUSEL DE PLATOS DESTACADOS
          - Título de sección: "Platos destacados".
          - Carrusel moderno de platos preparado para recibir datos desde MySQL con destacado = true.
          - Cada tarjeta muestra:
            * Imagen principal
            * Nombre del plato
            * Municipio
            * Descripción breve
            * Botón "Ver receta"
          - Controles de navegación y touch-friendly para tablets y celulares.
          - Estados: carga, error, vacío y normal.
         ======================================================== */}
      <section id="seccion-platos-destacados" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-5">
          
          {/* Cabecera de la sección */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] border border-[#E8D7C7] flex items-center justify-center text-[#8F4824] shrink-0">
                <ChefHat className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#241712] tracking-tight">
                  Platos destacados
                </h2>
                <p className="text-xs sm:text-sm text-[#78675F]">
                  Sabores emblemáticos seleccionados con la condición de destacados en el sistema
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Botones de navegación del carrusel */}
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-9 h-9 rounded-lg bg-white border border-[#DACDC0] hover:bg-[#F2ECE3] text-[#3E2E28] flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="Plato anterior"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-9 h-9 rounded-lg bg-white border border-[#DACDC0] hover:bg-[#F2ECE3] text-[#3E2E28] flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="Siguiente plato"
                  title="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Botón Ver todos los platos */}
              <button
                id="btn-ver-todos-platos"
                onClick={onNavigateToPlatos}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DACDC0] bg-white hover:bg-[#F2ECE3] text-[#7A3E20] text-xs font-semibold transition-colors shadow-2xs"
              >
                <span>Ver todos los platos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Estados de interfaz del carrusel */}
          {loading ? (
            <div className="py-12">
              <LoadingState message="Cargando platos..." />
            </div>
          ) : error ? (
            <div className="p-6 bg-[#FFF5F2] border border-[#FADBD4] rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#C84A22] mx-auto" />
              <p className="text-sm font-semibold text-[#5A1C12]">
                No se pudo cargar la información. Verifique la conexión con el servidor.
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-1.5 rounded-lg bg-[#8F4824] text-white text-xs font-semibold hover:bg-[#7A3E20]"
                >
                  Reintentar
                </button>
              )}
            </div>
          ) : platosDestacados.length === 0 ? (
            <div className="p-8 bg-white border border-[#E6DDD3] rounded-2xl text-center space-y-2">
              <Utensils className="w-8 h-8 text-[#8C7A70] mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-[#241712]">
                No hay platos destacados disponibles.
              </h3>
              <p className="text-xs text-[#78675F] max-w-md mx-auto">
                Los platos marcados como destacados en la base de datos MySQL aparecerán automáticamente en este carrusel.
              </p>
            </div>
          ) : (
            /* Carrusel responsivo con scroll nativo optimizado para touch */
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-[#DACDC0]"
              >
                {platosDestacados.map((plato) => (
                  <div
                    key={plato.id}
                    className="w-68 sm:w-72 md:w-80 shrink-0 snap-start flex flex-col"
                  >
                    <DishCard plato={plato} onViewRecipe={onViewRecipe} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          3. SECCIÓN MUNICIPIOS
          - Título: "Explora por municipio".
          - Mostrar tarjetas de municipios.
          - Cada tarjeta tiene:
            * Imagen
            * Nombre del municipio
            * Descripción breve
            * Botón "Explorar"
          - Preparado para obtenerse desde MySQL.
          - Reorganización responsive para Desktop, Tablet y Celular.
         ======================================================== */}
      <section id="seccion-municipios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] border border-[#CDE5D8] flex items-center justify-center text-[#106A43] shrink-0">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#241712] tracking-tight">
                  Explora por municipio
                </h2>
                <p className="text-xs sm:text-sm text-[#78675F]">
                  Conoce las tradiciones, geografía y especialidades culinarias de cada región
                </p>
              </div>
            </div>

            <button
              id="btn-ver-todos-municipios"
              onClick={onNavigateToMunicipios}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DACDC0] bg-white hover:bg-[#F2ECE3] text-[#3E2E28] text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto"
            >
              <span>Ver todos los municipios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Estados de carga o vacío */}
          {loading ? (
            <div className="py-10">
              <LoadingState message="Cargando municipios..." />
            </div>
          ) : municipios.length === 0 ? (
            <div className="p-8 bg-white border border-[#E6DDD3] rounded-2xl text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#8C7A70] mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-[#241712]">
                Todavía no hay municipios registrados.
              </h3>
              <p className="text-xs text-[#78675F]">
                Los municipios configurados en MySQL se reflejarán inmediatamente en esta sección.
              </p>
            </div>
          ) : (
            /* Grilla responsiva de tarjetas de municipios:
               - Celular: 1 o 2 columnas
               - Tablet: 2 o 3 columnas
               - Desktop: 4 o 5 columnas
            */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {municipios.slice(0, 5).map((muni) => (
                <MunicipalityCard
                  key={muni.id}
                  municipio={muni}
                  onSelect={onSelectMunicipality}
                  onExplorePlatos={onExploreMunicipality}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          4. SECCIÓN SOBRE EL PROYECTO
          - Sección breve y visual que explica el propósito de la plataforma.
          - Mensaje relacionado con:
            * Recopilación de recetas tradicionales.
            * Organización de la información gastronómica.
            * Facilidad para consultar recetas.
            * Preservación de la gastronomía cochabambina.
            * Uso de tecnología para conservar y difundir estos conocimientos.
          - Sin crear página adicional (sección dentro de Inicio).
         ======================================================== */}
      <section
        id="sobre-el-proyecto"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E6DDD3] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Columna Texto & Propósito */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF0E6] text-[#8F4824] text-xs font-bold tracking-wide">
                <span>PROPÓSITO DE LA PLATAFORMA</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241712] tracking-tight leading-tight">
                Preservando nuestra identidad culinaria mediante la tecnología
              </h2>

              <p className="text-sm sm:text-base text-[#5C483F] leading-relaxed">
                <strong>Sabores de Cochabamba</strong> nace como una respuesta a la necesidad de salvaguardar el patrimonio inmaterial más querido de nuestra región: su comida tradicional.
              </p>

              {/* 4 Pilares del Propósito */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D5] space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#8F4824]">
                    1. Recopilación de recetas
                  </h4>
                  <p className="text-xs text-[#6B5A52] leading-relaxed">
                    Rescate meticuloso de ingredientes originarios, medidas bataneras y secretos de preparación familiar.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D5] space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#8F4824]">
                    2. Organización estructurada
                  </h4>
                  <p className="text-xs text-[#6B5A52] leading-relaxed">
                    Clasificación precisa por municipios, ingredientes clave e instrucciones paso a paso con respaldo en MySQL.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D5] space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#8F4824]">
                    3. Facilidad de consulta
                  </h4>
                  <p className="text-xs text-[#6B5A52] leading-relaxed">
                    Búsqueda ágil e interactiva accesible desde computadoras, tablets y teléfonos móviles de manera universal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D5] space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#8F4824]">
                    4. Difusión cultural
                  </h4>
                  <p className="text-xs text-[#6B5A52] leading-relaxed">
                    Uso de tecnología moderna para que las nuevas generaciones continúen valorando y cocinando nuestras tradiciones.
                  </p>
                </div>

              </div>

            </div>

            {/* Columna Visual: Composición de Tradición & Futuro */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#DACDC0] aspect-4/3 sm:aspect-16/11 bg-[#F5EFE6]">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                  alt="Preparación tradicional cochabambina con especias e ingredientes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center gap-1.5 font-cursive text-2xl text-white">
                    <span>"Nuestra tradición en cada bocado"</span>
                    <Heart className="w-4 h-4 fill-current text-[#D52B1E] inline" />
                  </div>
                  <div className="bolivia-ribbon w-24 h-1" />
                </div>
              </div>

              {/* Tarjeta flotante con indicador tecnológico */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3.5 rounded-xl border border-[#E6DDD3] shadow-md items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#8F4824]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#241712]">Datos estructurados en MySQL</p>
                  <p className="text-[11px] text-[#78675F]">Tecnología al servicio de la cultura</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
