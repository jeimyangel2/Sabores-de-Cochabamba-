import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { InicioView } from './views/InicioView.tsx';
import { PlatosView } from './views/PlatosView.tsx';
import { PlatoDetalleView } from './views/PlatoDetalleView.tsx';
import { MunicipiosView } from './views/MunicipiosView.tsx';
import { MunicipioDetalleView } from './views/MunicipioDetalleView.tsx';
import { MunicipalityModal } from './components/MunicipalityModal.tsx';
import { DatabaseStatusModal } from './components/DatabaseStatusModal.tsx';
import { AdminAccessModal } from './components/AdminAccessModal.tsx';
import { ErrorState } from './components/ErrorState.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminLoginView } from './views/admin/AdminLoginView.tsx';
import { AdminDashboardView } from './views/admin/AdminDashboardView.tsx';
import { AdminMunicipiosView } from './views/admin/AdminMunicipiosView.tsx';
import { AdminPlatosView } from './views/admin/AdminPlatosView.tsx';
import { AdminBannerView } from './views/admin/AdminBannerView.tsx';
import {
  fetchDatabaseStatus,
  fetchMunicipios,
  fetchPlatos,
  fetchCurrentAdmin,
  logoutAdmin,
  setAuthToken,
  fetchHeroConfig
} from './services/api.ts';
import { supabaseClient } from './services/supabase.ts';
import { DbStatus, Municipio, Plato, AdminUser, HeroConfig } from './types/index.ts';

type AppTab =
  | 'inicio'
  | 'platos'
  | 'plato-detalle'
  | 'municipios'
  | 'municipio-detalle'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-municipios'
  | 'admin-platos'
  | 'admin-banner';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [currentPlatoId, setCurrentPlatoId] = useState<number | null>(null);
  const [currentPlato, setCurrentPlato] = useState<Plato | null>(null);
  const [currentMunicipioId, setCurrentMunicipioId] = useState<number | null>(null);
  const [currentMunicipio, setCurrentMunicipio] = useState<Municipio | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [platosDestacados, setPlatosDestacados] = useState<Plato[]>([]);
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de autenticación administrativa
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMunicipioIdFilter, setSelectedMunicipioIdFilter] = useState<number | null>(null);

  // Modales secundarios
  const [selectedMunicipioModal, setSelectedMunicipioModal] = useState<Municipio | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  // Sincronización inicial y manejo de URL del navegador (p. ej. /admin, /admin/login, /platos/:id, etc.)
  const syncRouteFromPathname = () => {
    const rawPath = window.location.pathname;
    const path = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
    const matchPlato = path.match(/^\/platos\/(\d+)$/);
    const matchMunicipio = path.match(/^\/municipios\/(\d+)$/);

    if (path === '/admin/login') {
      setActiveTab('admin-login');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (path === '/admin') {
      setActiveTab('admin-dashboard');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (path === '/admin/municipios') {
      setActiveTab('admin-municipios');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (path === '/admin/platos') {
      setActiveTab('admin-platos');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (path === '/admin/banner') {
      setActiveTab('admin-banner');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (matchPlato) {
      const id = parseInt(matchPlato[1], 10);
      setCurrentPlatoId(id);
      setCurrentMunicipioId(null);
      setActiveTab('plato-detalle');
    } else if (matchMunicipio) {
      const id = parseInt(matchMunicipio[1], 10);
      setCurrentMunicipioId(id);
      setCurrentPlatoId(null);
      setActiveTab('municipio-detalle');
    } else if (path === '/platos' || path.startsWith('/platos/')) {
      setActiveTab('platos');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else if (path === '/municipios' || path.startsWith('/municipios/')) {
      setActiveTab('municipios');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    } else {
      setActiveTab('inicio');
      setCurrentPlatoId(null);
      setCurrentMunicipioId(null);
    }
  };

  useEffect(() => {
    syncRouteFromPathname();
    const handlePopState = () => {
      syncRouteFromPathname();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Comprobar estado de sesión administrativa al iniciar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setAuthChecking(true);
        const user = await fetchCurrentAdmin();
        setAdminUser(user);
        if (!user) {
          setAuthToken(null);
        }
      } catch {
        setAdminUser(null);
        setAuthToken(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Protección de rutas administrativas en frontend
  useEffect(() => {
    if (!authChecking) {
      const isAdminRoute =
        activeTab === 'admin-dashboard' ||
        activeTab === 'admin-municipios' ||
        activeTab === 'admin-platos' ||
        activeTab === 'admin-banner';

      if (isAdminRoute && !adminUser) {
        window.history.replaceState({}, '', '/admin/login');
        setActiveTab('admin-login');
      } else if (activeTab === 'admin-login' && adminUser) {
        window.history.replaceState({}, '', '/admin');
        setActiveTab('admin-dashboard');
      }
    }
  }, [authChecking, adminUser, activeTab]);

  // Carga de datos públicos desde MySQL a través del backend
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar estado de base de datos
      try {
        const status = await fetchDatabaseStatus();
        setDbStatus(status);
      } catch (e) {
        console.warn('No se pudo obtener el estado de la base de datos', e);
      }

      // Cargar municipios, platos y configuración del hero en paralelo
      const [municipiosData, platosData, destacadosData, heroData] = await Promise.all([
        fetchMunicipios(),
        fetchPlatos(),
        fetchPlatos({ destacado: true }).catch(() => []),
        fetchHeroConfig().catch(() => null)
      ]);

      setMunicipios(municipiosData);
      setPlatos(platosData);
      if (heroData) {
        setHeroConfig(heroData);
      }

      // Platos destacados para el carrusel de inicio (destacado = 1 / true)
      if (destacadosData && destacadosData.length > 0) {
        setPlatosDestacados(destacadosData);
      } else {
        setPlatosDestacados(platosData.filter((p) => Number(p.destacado) === 1));
      }
    } catch (err: any) {
      console.error('Error al inicializar datos:', err);
      setError('No se pudo cargar la información. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Suscripción en tiempo real (Supabase Realtime)
    if (supabaseClient) {
      const channel = supabaseClient
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'configuracion_hero' },
          (payload) => {
            if (payload.new) {
              setHeroConfig((prev) => ({ ...prev, ...(payload.new as HeroConfig) }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'platos' },
          () => {
            fetchPlatos().then((allPlatos) => {
              setPlatos(allPlatos);
              setPlatosDestacados(allPlatos.filter((p) => Number(p.destacado) === 1));
            });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'municipios' },
          () => {
            fetchMunicipios().then(setMunicipios);
          }
        )
        .subscribe();

      return () => {
        if (supabaseClient) {
          supabaseClient.removeChannel(channel);
        }
      };
    }
  }, []);

  // Manejador para abrir el detalle dinámico de un plato (/platos/:id)
  const handleOpenPlatoDetalle = (plato: Plato) => {
    setCurrentPlatoId(plato.id);
    setCurrentPlato(plato);
    setActiveTab('plato-detalle');
    window.history.pushState({}, '', `/platos/${plato.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador para volver al catálogo de platos (/platos)
  const handleBackToPlatos = () => {
    setActiveTab('platos');
    setCurrentPlatoId(null);
    setCurrentPlato(null);
    window.history.pushState({}, '', '/platos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador para abrir el detalle dinámico de un municipio (/municipios/:id)
  const handleOpenMunicipioDetalle = (muni: Municipio) => {
    setCurrentMunicipioId(muni.id);
    setCurrentMunicipio(muni);
    setActiveTab('municipio-detalle');
    window.history.pushState({}, '', `/municipios/${muni.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador para volver a la sección de municipios (/municipios)
  const handleBackToMunicipios = () => {
    setActiveTab('municipios');
    setCurrentMunicipioId(null);
    setCurrentMunicipio(null);
    window.history.pushState({}, '', '/municipios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador de navegación pública general (Inicio, Platos, Municipios)
  const handleTabChange = (tab: 'inicio' | 'platos' | 'municipios') => {
    setActiveTab(tab);
    setCurrentPlatoId(null);
    setCurrentPlato(null);
    setCurrentMunicipioId(null);
    setCurrentMunicipio(null);
    const newPath = tab === 'inicio' ? '/' : `/${tab}`;
    window.history.pushState({}, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Refrescar datos en segundo plano para asegurar que los cambios de administración se reflejen inmediatamente
    loadData();
  };

  // Manejador de búsqueda desde Header
  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term);
    setActiveTab('platos');
    setCurrentPlatoId(null);
    setCurrentPlato(null);
    setCurrentMunicipioId(null);
    setCurrentMunicipio(null);
    window.history.pushState({}, '', '/platos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegar a Platos filtrados por Municipio
  const handleExploreMunicipality = (municipioId: number) => {
    setSelectedMunicipioIdFilter(municipioId);
    setActiveTab('platos');
    setCurrentPlatoId(null);
    setCurrentPlato(null);
    setCurrentMunicipioId(null);
    setCurrentMunicipio(null);
    window.history.pushState({}, '', '/platos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // MANEJADORES DE NAVEGACIÓN ADMINISTRATIVA
  // ==========================================

  const [adminPlatosInitialFilter, setAdminPlatosInitialFilter] = useState<'all' | 'destacados'>('all');

  const handleAdminNavigate = (
    section: 'dashboard' | 'municipios' | 'platos' | 'banner',
    options?: { filter?: 'all' | 'destacados' }
  ) => {
    if (options?.filter) {
      setAdminPlatosInitialFilter(options.filter);
    } else if (section === 'platos') {
      setAdminPlatosInitialFilter('all');
    }

    if (section === 'dashboard') {
      window.history.pushState({}, '', '/admin');
      setActiveTab('admin-dashboard');
    } else if (section === 'municipios') {
      window.history.pushState({}, '', '/admin/municipios');
      setActiveTab('admin-municipios');
    } else if (section === 'platos') {
      window.history.pushState({}, '', '/admin/platos');
      setActiveTab('admin-platos');
    } else if (section === 'banner') {
      window.history.pushState({}, '', '/admin/banner');
      setActiveTab('admin-banner');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToPublic = () => {
    window.history.pushState({}, '', '/');
    setActiveTab('inicio');
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    window.history.pushState({}, '', '/admin');
    setActiveTab('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.warn('Error durante logout', e);
    }
    setAdminUser(null);
    window.history.pushState({}, '', '/admin/login');
    setActiveTab('admin-login');
  };

  // Filtrado reactivo de platos en el catálogo público
  const filteredPlatos = platos.filter((plato) => {
    const matchesMunicipio =
      selectedMunicipioIdFilter === null || plato.municipio_id === selectedMunicipioIdFilter;

    if (!matchesMunicipio) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      plato.nombre.toLowerCase().includes(term) ||
      plato.descripcion.toLowerCase().includes(term) ||
      plato.ingredientes.toLowerCase().includes(term) ||
      (plato.municipio_nombre && plato.municipio_nombre.toLowerCase().includes(term))
    );
  });

  // ==========================================
  // RENDER: VISTAS DEL PANEL ADMINISTRATIVO
  // ==========================================

  // 1. Vista de Login Administrativo
  if (activeTab === 'admin-login') {
    return (
      <AdminLoginView
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={handleGoToPublic}
      />
    );
  }

  // 2. Vistas del Panel Administrativo (requieren autenticación)
  if (
    activeTab === 'admin-dashboard' ||
    activeTab === 'admin-municipios' ||
    activeTab === 'admin-platos' ||
    activeTab === 'admin-banner'
  ) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="text-center">
            <span className="w-8 h-8 border-3 border-[#C85228] border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
            <p className="text-sm font-semibold text-[#5C483F]">Verificando permisos administrativos...</p>
          </div>
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLoginView
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={handleGoToPublic}
        />
      );
    }

    const currentSection: 'dashboard' | 'municipios' | 'platos' | 'banner' =
      activeTab === 'admin-municipios'
        ? 'municipios'
        : activeTab === 'admin-platos'
        ? 'platos'
        : activeTab === 'admin-banner'
        ? 'banner'
        : 'dashboard';

    return (
      <AdminLayout
        currentAdmin={adminUser}
        activeSection={currentSection}
        onNavigate={handleAdminNavigate}
        onGoToPublic={handleGoToPublic}
        onLogout={handleLogout}
      >
        {activeTab === 'admin-dashboard' && (
          <AdminDashboardView
            currentAdmin={adminUser}
            onNavigate={handleAdminNavigate}
          />
        )}
        {activeTab === 'admin-municipios' && <AdminMunicipiosView />}
        {activeTab === 'admin-platos' && <AdminPlatosView initialFilter={adminPlatosInitialFilter} />}
        {activeTab === 'admin-banner' && (
          <AdminBannerView
            onGoToPublic={handleGoToPublic}
            onConfigSaved={(newCfg) => setHeroConfig(newCfg)}
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // RENDER: VISTAS DEL SITIO PÚBLICO
  // ==========================================

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C221E]">
      
      {/* 1. Header con menú: Inicio, Platos Típicos, Municipios + Buscador + Acceso a Administración */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Contenido Principal Público */}
      <main className="flex-1">
        {error ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <ErrorState
              title="Sabores de Cochabamba"
              message={error}
              onRetry={loadData}
            />
          </div>
        ) : (
          <>
            {activeTab === 'inicio' && (
              <InicioView
                platosDestacados={platosDestacados}
                municipios={municipios}
                heroConfig={heroConfig}
                loading={loading}
                error={error}
                onRetry={loadData}
                onViewRecipe={handleOpenPlatoDetalle}
                onExploreMunicipality={handleExploreMunicipality}
                onSelectMunicipality={handleOpenMunicipioDetalle}
                onNavigateToPlatos={() => handleTabChange('platos')}
                onNavigateToMunicipios={() => handleTabChange('municipios')}
              />
            )}

            {activeTab === 'platos' && (
              <PlatosView
                platos={filteredPlatos}
                municipios={municipios}
                loading={loading}
                error={error}
                onRetry={loadData}
                selectedMunicipioId={selectedMunicipioIdFilter}
                onSelectMunicipio={setSelectedMunicipioIdFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onViewRecipe={handleOpenPlatoDetalle}
              />
            )}

            {/* Página dinámica de Detalle del Plato y su Receta (/platos/:id) */}
            {activeTab === 'plato-detalle' && currentPlatoId !== null && (
              <PlatoDetalleView
                platoId={currentPlatoId}
                initialPlato={currentPlato}
                onBackToPlatos={handleBackToPlatos}
                onFilterByMunicipality={handleExploreMunicipality}
              />
            )}

            {activeTab === 'municipios' && (
              <MunicipiosView
                municipios={municipios}
                loading={loading}
                error={error}
                onRetry={loadData}
                onSelectMunicipio={handleOpenMunicipioDetalle}
              />
            )}

            {/* Página dinámica de Detalle del Municipio (/municipios/:id) */}
            {activeTab === 'municipio-detalle' && currentMunicipioId !== null && (
              <MunicipioDetalleView
                municipioId={currentMunicipioId}
                initialMunicipio={currentMunicipio}
                onBackToMunicipios={handleBackToMunicipios}
                onViewRecipe={handleOpenPlatoDetalle}
                onFilterByMunicipality={handleExploreMunicipality}
              />
            )}
          </>
        )}
      </main>

      {/* Footer con Inicio, Platos Típicos, Municipios, información general, redes sociales y acceso a administración */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Modal Ficha Cultural de Municipio */}
      <MunicipalityModal
        municipio={selectedMunicipioModal}
        onClose={() => setSelectedMunicipioModal(null)}
        onViewRecipe={handleOpenPlatoDetalle}
      />

      {/* Modal de Acceso al Área Administrativa */}
      <AdminAccessModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onOpenDbConfig={() => setIsDbModalOpen(true)}
        onGoToAdmin={() => {
          setIsAdminModalOpen(false);
          if (adminUser) {
            window.history.pushState({}, '', '/admin');
            setActiveTab('admin-dashboard');
          } else {
            window.history.pushState({}, '', '/admin/login');
            setActiveTab('admin-login');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal de Estado de MySQL 8.x Local */}
      <DatabaseStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        status={dbStatus}
      />

    </div>
  );
}

