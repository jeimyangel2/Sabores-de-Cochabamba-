import React from 'react';
import { Home, Utensils, MapPin, Database, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'inicio' | 'platos' | 'municipios') => void;
  onOpenDbModal: () => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenDbModal,
  onOpenAdminModal
}) => {
  return (
    <footer id="main-footer" className="bg-[#241A15] text-[#D8CDC4] pt-14 pb-8 border-t border-[#3D2E26] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#3D2E26]">
          
          {/* Columna Marca, Información General & Redes Sociales */}
          <div className="md:col-span-5 space-y-4">
            <div
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E05326] to-[#B83E15] flex items-center justify-center text-white shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                  <line x1="6" y1="17" x2="18" y2="17"/>
                </svg>
              </div>
              <span className="font-brush text-3xl font-bold text-white tracking-tight">
                Sabores <span className="font-cursive text-2xl text-[#E05326]">de</span> Cochabamba
              </span>
            </div>

            {/* Información General del Proyecto */}
            <p className="text-xs sm:text-sm text-[#A8988E] max-w-md leading-relaxed">
              Plataforma digital dedicada a la recopilación, organización, consulta interactiva y preservación activa de las recetas tradicionales y el patrimonio culinario de los municipios de Cochabamba.
            </p>

            {/* Redes Sociales como elementos visuales */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                Comunidad & Redes
              </span>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="#facebook"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-lg bg-[#2F221B] hover:bg-[#8F4824] text-[#D8CDC4] hover:text-white flex items-center justify-center transition-colors border border-[#44332A]"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-lg bg-[#2F221B] hover:bg-[#8F4824] text-[#D8CDC4] hover:text-white flex items-center justify-center transition-colors border border-[#44332A]"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#youtube"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-lg bg-[#2F221B] hover:bg-[#8F4824] text-[#D8CDC4] hover:text-white flex items-center justify-center transition-colors border border-[#44332A]"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="bolivia-ribbon w-24 h-1 inline-block" />
              <span className="text-xs text-[#8C7A70] font-script text-base">
                Capital Gastronómica de Bolivia
              </span>
            </div>
          </div>

          {/* Columna Enlaces de Navegación Estrictos (Inicio, Platos Típicos, Municipios) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-nav-inicio"
                  onClick={() => {
                    setActiveTab('inicio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[#A8988E] hover:text-[#E05326] transition-colors"
                >
                  <Home className="w-4 h-4 text-[#8F4824]" />
                  <span>Inicio</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-platos"
                  onClick={() => {
                    setActiveTab('platos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[#A8988E] hover:text-[#E05326] transition-colors"
                >
                  <Utensils className="w-4 h-4 text-[#8F4824]" />
                  <span>Platos Típicos</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-municipios"
                  onClick={() => {
                    setActiveTab('municipios');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[#A8988E] hover:text-[#E05326] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#8F4824]" />
                  <span>Municipios</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Columna Base de Datos Local y Área Administrativa */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Infraestructura & Acceso
            </h4>
            <p className="text-xs text-[#A8988E] leading-relaxed">
              Diseñado con Node.js, Express y MySQL 8.x local para consultar platos destacados y municipios sin depender de servicios externos en la nube.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                id="footer-admin-link"
                onClick={onOpenAdminModal}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#2F221B] hover:bg-[#3D2E26] border border-[#4D3A30] text-xs font-semibold text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E05326]" />
                <span>Área Administrativa</span>
              </button>
              <button
                id="footer-db-info-btn"
                onClick={onOpenDbModal}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#2F221B] hover:bg-[#3D2E26] border border-[#4D3A30] text-xs font-semibold text-[#E05326] transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>MySQL 8.x</span>
              </button>
            </div>
          </div>

        </div>

        {/* Derechos de Autor */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#827166]">
          <p>© {new Date().getFullYear()} Sabores de Cochabamba. Todos los derechos reservados. Preservando las tradiciones culinarias de nuestra tierra.</p>
          <p className="flex items-center gap-1 shrink-0">
            Hecho con <Heart className="w-3.5 h-3.5 text-[#E05326] fill-current inline" /> para Cochabamba, Bolivia
          </p>
        </div>

      </div>
    </footer>
  );
};
