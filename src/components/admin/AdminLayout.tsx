import React, { useState } from 'react';
import {
  UtensilsCrossed,
  MapPin,
  Utensils,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { AdminUser } from '../../types/index.ts';

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  activeSection: 'dashboard' | 'municipios' | 'platos' | 'banner';
  onNavigate: (section: 'dashboard' | 'municipios' | 'platos' | 'banner') => void;
  onGoToPublic: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({
  currentAdmin,
  activeSection,
  onNavigate,
  onGoToPublic,
  onLogout,
  children
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="admin-layout" className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-[#2C221E]">
      {/* Barra Superior Administrativa */}
      <header id="admin-header" className="bg-[#2C221E] text-[#FDFBF7] border-b border-[#3D2F2A] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo y Nombre del Sistema */}
          <div className="flex items-center gap-3">
            <button
              id="admin-brand-btn"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C85228] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-[#FCD116]" />
              </div>
              <div>
                <span className="font-serif-title font-extrabold text-base tracking-wide text-white block leading-tight">
                  Sabores de Cochabamba
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#E8927C] uppercase block">
                  Panel de Administración
                </span>
              </div>
            </button>
          </div>

          {/* Navegación Desktop */}
          <nav id="admin-desktop-nav" className="hidden md:flex items-center gap-1">
            <button
              id="nav-admin-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-[#C85228] text-white shadow-xs'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Panel General</span>
            </button>

            <button
              id="nav-admin-municipios"
              onClick={() => onNavigate('municipios')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'municipios'
                  ? 'bg-[#C85228] text-white shadow-xs'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Municipios</span>
            </button>

            <button
              id="nav-admin-platos"
              onClick={() => onNavigate('platos')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'platos'
                  ? 'bg-[#C85228] text-white shadow-xs'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Platos Típicos</span>
            </button>

            <button
              id="nav-admin-banner"
              onClick={() => onNavigate('banner')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'banner'
                  ? 'bg-[#C85228] text-white shadow-xs'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FCD116]" />
              <span>Banner e Insignia</span>
            </button>
          </nav>

          {/* Controles de Usuario y Acceso */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs border border-white/15">
              <UserCheck className="w-3.5 h-3.5 text-[#FCD116]" />
              <span className="font-semibold text-white max-w-[140px] truncate" title={currentAdmin.nombre}>
                {currentAdmin.nombre}
              </span>
            </div>

            <button
              id="btn-admin-goto-public"
              onClick={onGoToPublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
              title="Ir al portal público"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E8927C]" />
              <span>Sitio Público</span>
            </button>

            <button
              id="btn-admin-logout"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8F3516] hover:bg-[#A83E1A] text-white text-xs font-bold transition-colors shadow-2xs"
              title="Cerrar sesión administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>

          {/* Botón Móvil */}
          <div className="md:hidden flex items-center gap-2">
            <button
              id="btn-admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Abrir menú administrativo"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div id="admin-mobile-menu" className="md:hidden border-t border-[#3D2F2A] bg-[#241B18] px-4 pt-3 pb-5 space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-[#D9CEC5] mb-2">
              <UserCheck className="w-4 h-4 text-[#FCD116]" />
              <span>Administrador: <strong>{currentAdmin.nombre}</strong></span>
            </div>

            <button
              id="mob-nav-admin-dashboard"
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-[#C85228] text-white'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Panel General</span>
            </button>

            <button
              id="mob-nav-admin-municipios"
              onClick={() => {
                onNavigate('municipios');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeSection === 'municipios'
                  ? 'bg-[#C85228] text-white'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Administrar Municipios</span>
            </button>

            <button
              id="mob-nav-admin-platos"
              onClick={() => {
                onNavigate('platos');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeSection === 'platos'
                  ? 'bg-[#C85228] text-white'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Administrar Platos</span>
            </button>

            <button
              id="mob-nav-admin-banner"
              onClick={() => {
                onNavigate('banner');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeSection === 'banner'
                  ? 'bg-[#C85228] text-white'
                  : 'text-[#D9CEC5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FCD116]" />
              <span>Banner y Portada</span>
            </button>

            <div className="pt-2 border-t border-[#3D2F2A] flex flex-col gap-2">
              <button
                id="mob-btn-admin-goto-public"
                onClick={() => {
                  onGoToPublic();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#E8927C]" />
                <span>Volver al Sitio Público</span>
              </button>

              <button
                id="mob-btn-admin-logout"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#8F3516] text-white text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión Administrativa</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contenido Principal del Panel */}
      <main id="admin-main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Pie Administrativo */}
      <footer id="admin-footer" className="bg-[#FAF7F2] border-t border-[#E8DFD5] py-4 text-center text-xs text-[#8C7A70]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sabores de Cochabamba — Sistema de Administración Culinaria y Territorial</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sesión Administrativa Activa
          </span>
        </div>
      </footer>
    </div>
  );
}
