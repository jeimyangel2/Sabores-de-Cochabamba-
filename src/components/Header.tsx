import React, { useState } from 'react';
import { Utensils, MapPin, Home, Search, Menu, X, Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DbStatus } from '../types/index.ts';

interface HeaderProps {
  activeTab: 'inicio' | 'platos' | 'plato-detalle' | 'municipios' | 'municipio-detalle';
  setActiveTab: (tab: 'inicio' | 'platos' | 'municipios') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: (term: string) => void;
  dbStatus: DbStatus | null;
  onOpenDbModal: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  dbStatus,
  onOpenDbModal,
  onOpenAdminModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchTerm);
    if (activeTab === 'inicio') {
      setActiveTab('platos');
    }
  };

  // Solo Inicio, Platos Típicos y Municipios
  const navItems = [
    { id: 'inicio' as const, label: 'Inicio', icon: Home },
    { id: 'platos' as const, label: 'Platos Típicos', icon: Utensils },
    { id: 'municipios' as const, label: 'Municipios', icon: MapPin },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#E8DFD5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Nombre: Sabores de Cochabamba */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Ícono Gorro de Chef en terracota */}
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 100 90" className="w-10 sm:w-11 h-10 sm:h-11 text-[#C84A22] fill-none stroke-current" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 22 75 L 78 75 L 74 84 L 26 84 Z" fill="#C84A22" />
                <path d="M 24 75 C 10 70 8 52 20 42 C 16 28 32 16 46 25 C 55 12 75 14 80 30 C 92 36 92 60 76 75" />
                <line x1="28" y1="64" x2="72" y2="64" strokeWidth="4" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-brush text-2xl sm:text-3xl text-[#5A1C12] font-bold tracking-tight leading-none">
                  Sabores <span className="font-cursive text-xl font-normal text-[#5A1C12]">de</span> Cochabamba
                </span>
                {/* Cordillera Azul estilizada */}
                <svg viewBox="0 0 70 24" className="w-10 h-5 text-[#1A5372] fill-none stroke-current shrink-0 -mt-1 hidden sm:block" strokeWidth="2.5">
                  <path d="M 2 22 L 22 6 L 34 16 L 50 4 L 68 22 Z" fill="rgba(26,83,114,0.12)" strokeLinejoin="round" />
                </svg>
              </div>
              
              {/* Tricolor boliviano ribbon & slogan */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] sm:text-[11px] text-[#55453E] font-medium tracking-tight">
                  Recetas que mantienen viva nuestra tradición
                </span>
                <div className="h-1.5 w-12 rounded-full overflow-hidden flex shadow-2xs">
                  <span className="w-1/3 bg-[#D52B1E]" />
                  <span className="w-1/3 bg-[#FCD116]" />
                  <span className="w-1/3 bg-[#007934]" />
                </div>
              </div>
            </div>
          </div>

          {/* Menú de Navegación: Inicio, Platos Típicos, Municipios */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected =
                item.id === activeTab ||
                (item.id === 'platos' && activeTab === 'plato-detalle') ||
                (item.id === 'municipios' && activeTab === 'municipio-detalle');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#7A3E20] text-white shadow-md'
                      : 'text-[#3E2E28] hover:text-[#7A3E20] hover:bg-[#F0E8DD]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#3E2E28]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Buscador + Acceso Administración + DB Status */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Buscador */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative flex items-center">
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Buscar recetas, platos o municipios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 md:w-56 xl:w-72 h-10 pl-3 pr-2 text-xs rounded-l-md bg-white border border-[#D8CFC5] border-r-0 text-[#2C221E] placeholder-[#8F8178] focus:outline-none focus:ring-1 focus:ring-[#7A3E20] focus:border-[#7A3E20]"
                />
                <button
                  id="header-search-btn"
                  type="submit"
                  className="h-10 px-3.5 bg-[#5A1C12] hover:bg-[#702216] text-white rounded-r-md flex items-center justify-center transition-colors shadow-2xs"
                  title="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Acceso al Área Administrativa */}
            <button
              id="header-admin-btn"
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8CFC5] bg-white hover:bg-[#F2ECE3] text-[#5A1C12] text-xs font-semibold transition-all shadow-2xs"
              title="Acceso al área administrativa"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#8F4824]" />
              <span className="hidden xl:inline">Administración</span>
            </button>
          </div>

          {/* Controles para Móvil */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-admin-btn"
              onClick={onOpenAdminModal}
              className="p-2 rounded-lg bg-[#F0EBE1] text-[#5A1C12]"
              title="Área Administrativa"
            >
              <ShieldCheck className="w-4 h-4 text-[#8F4824]" />
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#F0EBE1] text-[#3E2E28]"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-[#E8DFD5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Buscar recetas, platos o municipios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-3 pr-2 text-xs rounded-l-md bg-white border border-[#D8CFC5] border-r-0 text-[#2C221E]"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-[#5A1C12] text-white rounded-r-md flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected =
                item.id === activeTab ||
                (item.id === 'platos' && activeTab === 'plato-detalle') ||
                (item.id === 'municipios' && activeTab === 'municipio-detalle');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold text-center ${
                    isSelected
                      ? 'bg-[#7A3E20] text-white'
                      : 'bg-white border border-[#E8DFD5] text-[#3E2E28]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E8DFD5]/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8F4824]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acceso Administrativo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDbModal();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5C483F]"
            >
              <Database className="w-4 h-4" />
              <span>MySQL 8.x</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
