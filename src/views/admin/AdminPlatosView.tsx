import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  Check,
  AlertCircle,
  Star,
  MapPin,
  Filter,
  Image as ImageIcon,
  Video,
  RefreshCw
} from 'lucide-react';
import { Plato, Municipio } from '../../types/index.ts';
import {
  fetchPlatos,
  fetchMunicipios,
  createPlatoApi,
  updatePlatoApi,
  deletePlatoApi
} from '../../services/api.ts';
import { MediaUploader } from '../../components/admin/MediaUploader.tsx';
import { YouTubeInput } from '../../components/admin/YouTubeInput.tsx';
import { MultiImageUploader } from '../../components/admin/MultiImageUploader.tsx';
import { YouTubeVideoCard } from '../../components/YouTubeVideoCard.tsx';
import { ImageGalleryView } from '../../components/ImageGalleryView.tsx';
import { parseImageGallery, serializeImageGallery } from '../../utils/youtube.ts';

interface AdminPlatosViewProps {
  initialFilter?: 'all' | 'destacados';
}

export function AdminPlatosView({ initialFilter = 'all' }: AdminPlatosViewProps) {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuniFilter, setSelectedMuniFilter] = useState<number | 'all'>('all');
  const [filterDestacadosOnly, setFilterDestacadosOnly] = useState<boolean>(initialFilter === 'destacados');
  const [isMediaUploading, setIsMediaUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilter === 'destacados') {
      setFilterDestacadosOnly(true);
    } else if (initialFilter === 'all') {
      setFilterDestacadosOnly(false);
    }
  }, [initialFilter]);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlato, setEditingPlato] = useState<Plato | null>(null);
  const [viewingPlato, setViewingPlato] = useState<Plato | null>(null);
  const [deletingPlato, setDeletingPlato] = useState<Plato | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formMunicipioId, setFormMunicipioId] = useState<number | ''>('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formImagenPrincipal, setFormImagenPrincipal] = useState('');
  const [formIngredientes, setFormIngredientes] = useState('');
  const [formPreparacion, setFormPreparacion] = useState('');
  const [formImagenPreparacion, setFormImagenPreparacion] = useState('');
  const [formImagenesPrep, setFormImagenesPrep] = useState<string[]>([]);
  const [formVideoPreparacion, setFormVideoPreparacion] = useState('');
  const [formDestacado, setFormDestacado] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [platosList, munisList] = await Promise.all([
        fetchPlatos(),
        fetchMunicipios()
      ]);
      setPlatos(platosList);
      setMunicipios(munisList);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPlato(null);
    setFormNombre('');
    const defaultMuniId = municipios.length > 0 ? municipios[0].id : 2;
    setFormMunicipioId(defaultMuniId);
    setFormDescripcion('');
    setFormImagenPrincipal('');
    setFormIngredientes('');
    setFormPreparacion('');
    setFormImagenesPrep([]);
    setFormVideoPreparacion('');
    setFormDestacado(false);
    setIsMediaUploading(false);
    setIsFormOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (p: Plato) => {
    setEditingPlato(p);
    setFormNombre(p.nombre);
    setFormMunicipioId(p.municipio_id);
    setFormDescripcion(p.descripcion);
    setFormImagenPrincipal(p.imagen_principal || '');
    setFormIngredientes(p.ingredientes);
    setFormPreparacion(p.preparacion);
    setFormImagenesPrep(parseImageGallery(p.imagen_preparacion));
    setFormVideoPreparacion(p.video_preparacion || '');
    setFormDestacado(Number(p.destacado) === 1);
    setIsMediaUploading(false);
    setIsFormOpen(true);
    setErrorMessage(null);
  };

  const handleSavePlato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      setErrorMessage('El nombre del plato es obligatorio.');
      return;
    }
    if (!formMunicipioId) {
      setErrorMessage('Debe asociar el plato a un municipio.');
      return;
    }
    if (!formDescripcion.trim()) {
      setErrorMessage('La descripción del plato es obligatoria.');
      return;
    }
    if (!formIngredientes.trim() || !formPreparacion.trim()) {
      setErrorMessage('Los ingredientes y la preparación son obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        nombre: formNombre.trim(),
        municipio_id: Number(formMunicipioId),
        descripcion: formDescripcion.trim(),
        imagen_principal: formImagenPrincipal.trim() || null,
        ingredientes: formIngredientes.trim(),
        preparacion: formPreparacion.trim(),
        imagen_preparacion: serializeImageGallery(formImagenesPrep),
        video_preparacion: formVideoPreparacion.trim() || null,
        destacado: formDestacado ? 1 : 0
      };

      if (editingPlato) {
        await updatePlatoApi(editingPlato.id, payload);
        setSuccessMessage(`Plato "${payload.nombre}" actualizado correctamente.`);
      } else {
        await createPlatoApi(payload);
        setSuccessMessage(`Plato "${payload.nombre}" registrado exitosamente.`);
      }

      setIsFormOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar el plato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDestacado = async (p: Plato) => {
    const nuevoValor = Number(p.destacado) === 1 ? 0 : 1;
    // Actualización inmediata en el estado para fluidez visual
    setPlatos((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, destacado: nuevoValor } : item))
    );
    try {
      setErrorMessage(null);
      await updatePlatoApi(p.id, {
        destacado: nuevoValor,
        nombre: p.nombre,
        municipio_id: p.municipio_id,
        descripcion: p.descripcion,
        ingredientes: p.ingredientes,
        preparacion: p.preparacion,
        imagen_principal: p.imagen_principal,
        imagen_preparacion: p.imagen_preparacion,
        video_preparacion: p.video_preparacion
      });
      setSuccessMessage(
        nuevoValor === 1
          ? `"${p.nombre}" marcado como destacado para el carrusel de inicio.`
          : `"${p.nombre}" removido de platos destacados del carrusel.`
      );
      await loadData();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      // Revertir cambio local en caso de error
      await loadData();
      const msg = err.message || '';
      if (msg.includes('no autorizado') || msg.includes('iniciar sesión') || msg.includes('Sesión no válida')) {
        setErrorMessage('Acceso no autorizado. Por favor inicia sesión como administrador con el usuario "edwin" y contraseña "anai1234" para guardar cambios.');
      } else {
        setErrorMessage(msg || 'Error al actualizar estado destacado');
      }
    }
  };

  const handleDeletePlato = async () => {
    if (!deletingPlato) return;
    try {
      setIsSubmitting(true);
      await deletePlatoApi(deletingPlato.id);
      setSuccessMessage(`Plato "${deletingPlato.nombre}" eliminado correctamente.`);
      setDeletingPlato(null);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar el plato');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrado de platos
  const filteredPlatos = platos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredientes.toLowerCase().includes(search.toLowerCase()) ||
      (p.municipio_nombre && p.municipio_nombre.toLowerCase().includes(search.toLowerCase()));

    const matchesMuni =
      selectedMuniFilter === 'all' || p.municipio_id === selectedMuniFilter;

    const matchesDestacado = !filterDestacadosOnly || Number(p.destacado) === 1;

    return matchesSearch && matchesMuni && matchesDestacado;
  });

  return (
    <div id="admin-platos-view" className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-extrabold text-2xl text-[#2C221E] tracking-tight">
            Administración de Platos Típicos
          </h1>
          <p className="text-sm text-[#7D6B62] mt-0.5">
            Registra, edita recetas, asigna municipios y selecciona platos para el carrusel principal.
          </p>
        </div>

        <button
          id="btn-admin-add-plato"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Plato</span>
        </button>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {(errorMessage.includes('autorizado') || errorMessage.includes('sesión')) && (
              <a
                href="/admin/login"
                className="px-2.5 py-1 rounded-lg bg-[#C85228] text-white font-bold hover:bg-[#B3451E] transition-colors"
              >
                Iniciar Sesión
              </a>
            )}
            <button onClick={() => setErrorMessage(null)} className="text-red-700 hover:text-red-900 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Controles de Búsqueda y Filtro por Municipio y Destacados */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Pestañas de filtrado rápido: Todos vs Solo Destacados */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] shrink-0 self-start sm:self-auto">
            <button
              type="button"
              id="tab-filter-todos-platos"
              onClick={() => setFilterDestacadosOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !filterDestacadosOnly
                  ? 'bg-white text-[#2C221E] shadow-2xs border border-[#DACDC0]'
                  : 'text-[#7D6B62] hover:text-[#2C221E]'
              }`}
            >
              Todos los platos ({platos.length})
            </button>
            <button
              type="button"
              id="tab-filter-destacados-platos"
              onClick={() => setFilterDestacadosOnly(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterDestacadosOnly
                  ? 'bg-amber-100 text-amber-900 shadow-2xs border border-amber-300'
                  : 'text-[#7D6B62] hover:text-[#2C221E]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${filterDestacadosOnly ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
              <span>Solo destacados ({platos.filter((p) => Number(p.destacado) === 1).length})</span>
            </button>
          </div>

          {/* Buscador */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A70]">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="admin-search-platos"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, ingrediente o municipio..."
              className="block w-full pl-10 pr-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
            />
          </div>

          {/* Filtro por Municipio */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8C7A70] shrink-0" />
            <select
              id="admin-filter-municipio"
              value={selectedMuniFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMuniFilter(val === 'all' ? 'all' : parseInt(val, 10));
              }}
              className="px-3 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5] text-[#2C221E]"
            >
              <option value="all">Todos los municipios ({municipios.length})</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedMuniFilter !== 'all' || filterDestacadosOnly) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedMuniFilter('all');
                setFilterDestacadosOnly(false);
              }}
              className="text-xs text-[#8C7A70] hover:text-[#2C221E] px-2 py-1 self-center underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filterDestacadosOnly && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span>Mostrando únicamente platos marcados como destacados para el carrusel principal.</span>
          </div>
        )}
      </div>

      {/* Tabla de Platos */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[#8C7A70] text-sm">
            <span className="w-6 h-6 border-2 border-[#C85228] border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Cargando lista de platos típicos...</p>
          </div>
        ) : filteredPlatos.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A70] text-sm">
            <Utensils className="w-8 h-8 text-[#D9CEC5] mx-auto mb-2" />
            <p className="font-semibold text-[#2C221E]">No se encontraron platos típicos</p>
            <p className="text-xs text-[#7D6B62] mt-1">
              Prueba cambiando los filtros o registra un nuevo plato.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="table-admin-platos" className="min-w-full divide-y divide-[#E8DFD5]">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Plato Típico
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Municipio
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Destacado en Carrusel
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5] text-xs">
                {filteredPlatos.map((p) => {
                  const isDestacado = Number(p.destacado) === 1;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Plato y Miniatura */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF0EB] shrink-0 border border-[#E8DFD5] flex items-center justify-center text-[#C85228]">
                            {(() => {
                              const prepGallery = parseImageGallery(p.imagen_preparacion);
                              const thumb = p.imagen_principal || (prepGallery.length > 0 ? prepGallery[0] : null);
                              return thumb ? (
                                <img
                                  src={thumb}
                                  alt={p.nombre}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Utensils className="w-5 h-5 text-[#C85228]" />
                              );
                            })()}
                          </div>
                          <div>
                            <div className="font-bold text-[#2C221E] text-sm">{p.nombre}</div>
                            <div className="text-[11px] text-[#7D6B62] max-w-xs truncate" title={p.descripcion}>
                              {p.descripcion}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Municipio */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD5] text-[#2C221E] font-semibold">
                          <MapPin className="w-3 h-3 text-[#C85228]" />
                          <span>{p.municipio_nombre || 'Cochabamba'}</span>
                        </span>
                      </td>

                      {/* Control Destacado en Carrusel */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <button
                          id={`btn-toggle-destacado-${p.id}`}
                          onClick={() => handleToggleDestacado(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isDestacado
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs hover:bg-amber-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                          }`}
                          title={isDestacado ? 'Clic para desmarcar del carrusel' : 'Clic para destacar en carrusel'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isDestacado ? 'fill-amber-500 text-amber-600' : 'text-stone-400'
                            }`}
                          />
                          <span>{isDestacado ? 'Destacado' : 'Estándar'}</span>
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-view-plato-${p.id}`}
                            onClick={() => setViewingPlato(p)}
                            className="p-1.5 rounded-lg text-[#7D6B62] hover:text-[#2C221E] hover:bg-[#FAF0EB] transition-colors"
                            title="Ver receta completa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-plato-${p.id}`}
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-[#C85228] hover:text-[#9E3915] hover:bg-[#FAF0EB] transition-colors"
                            title="Editar plato"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-plato-${p.id}`}
                            onClick={() => setDeletingPlato(p)}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Crear / Editar Plato */}
      {isFormOpen && (
        <div id="modal-plato-form" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden my-8">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E8DFD5] flex items-center justify-between">
              <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E]">
                {editingPlato ? `Editar Plato: ${editingPlato.nombre}` : 'Registrar Nuevo Plato Típico'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#7D6B62] hover:text-[#2C221E] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlato} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                    Nombre del Plato <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej. Silpancho Cochabambino"
                    className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                  />
                </div>

                {/* Municipio Asociado */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                    Municipio <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formMunicipioId}
                    onChange={(e) => setFormMunicipioId(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5] text-[#2C221E]"
                  >
                    {municipios.length === 0 ? (
                      <option value="2">Cercado</option>
                    ) : (
                      municipios.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Descripción del Plato <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  placeholder="Reseña, historia breve y características del sabor tradicional..."
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                />
              </div>

              {/* Imagen Principal (Opcional) */}
              <MediaUploader
                id="admin-plato-imagen-principal"
                label="Imagen principal"
                optional={true}
                mediaType="image"
                category="platos"
                value={formImagenPrincipal}
                onChange={(newVal) => setFormImagenPrincipal(newVal || '')}
                onUploadingStateChange={setIsMediaUploading}
              />

              {/* Ingredientes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Ingredientes (Un ingrediente por línea o separados) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formIngredientes}
                  onChange={(e) => setFormIngredientes(e.target.value)}
                  placeholder="1 kg de carne de res molida&#10;4 papas imillas cocidas&#10;4 huevos frescos..."
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5] font-mono"
                />
              </div>

              {/* Preparación */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Pasos de Preparación Tradicional <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formPreparacion}
                  onChange={(e) => setFormPreparacion(e.target.value)}
                  placeholder="1. Aplanar la carne con pan molido en batán...&#10;2. Freír en aceite bien caliente...&#10;3. Emplatar con arroz, papas y huevo frito."
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                />
              </div>

              {/* Multimedia Opcional de Preparación */}
              <div className="space-y-4 pt-3 border-t border-[#E8DFD5]">
                <MultiImageUploader
                  id="admin-plato-imagenes-prep"
                  label="Fotos del modo de preparación"
                  category="platos"
                  images={formImagenesPrep}
                  onChange={setFormImagenesPrep}
                  onUploadingStateChange={setIsMediaUploading}
                  helperText="Hasta 5 fotos del paso a paso o presentación (opcionales)"
                />

                <YouTubeInput
                  id="admin-plato-video-prep"
                  label="Video de YouTube de preparación"
                  value={formVideoPreparacion}
                  onChange={setFormVideoPreparacion}
                  helperText="Pega un enlace de YouTube (video tradicional o short)"
                />
              </div>

              {/* CONTROL OBLIGATORIO: Destacar en carrusel */}
              <div className="pt-3 border-t border-[#E8DFD5]">
                <label
                  htmlFor="checkbox-destacar-carrusel"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF0EB] border border-[#E8DFD5] cursor-pointer hover:bg-[#F5E4DC] transition-colors"
                >
                  <input
                    id="checkbox-destacar-carrusel"
                    type="checkbox"
                    checked={formDestacado}
                    onChange={(e) => setFormDestacado(e.target.checked)}
                    className="w-5 h-5 rounded text-[#C85228] focus:ring-[#C85228] border-[#D9CEC5] cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#2C221E]">
                      <Star className={`w-4 h-4 ${formDestacado ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
                      <span>Destacar en carrusel</span>
                    </div>
                    <span className="text-[11px] text-[#7D6B62]">
                      Si se activa, este plato se mostrará en el carrusel de la página de inicio.
                    </span>
                  </div>
                </label>
              </div>

              {/* Botones y estado de subida */}
              <div className="pt-4 border-t border-[#E8DFD5] space-y-3">
                {isMediaUploading && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                    <span>Hay imágenes subiéndose a la nube. Por favor espera unos segundos a que finalice la subida antes de guardar.</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#D9CEC5] text-xs font-bold text-[#7D6B62] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isMediaUploading}
                    className="px-5 py-2 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isMediaUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>
                      {isSubmitting
                        ? 'Guardando...'
                        : isMediaUploading
                        ? 'Subiendo fotos a la nube...'
                        : editingPlato
                        ? 'Actualizar Plato'
                        : 'Registrar Plato'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Visualizar Ficha del Plato */}
      {viewingPlato && (
        <div id="modal-plato-view" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden my-8">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E8DFD5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#C85228]" />
                <h3 className="font-serif-title font-extrabold text-base text-[#2C221E]">
                  {viewingPlato.nombre}
                </h3>
              </div>
              <button
                onClick={() => setViewingPlato(null)}
                className="text-[#7D6B62] hover:text-[#2C221E] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {viewingPlato.imagen_principal && (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-100 border border-[#E8DFD5]">
                  <img
                    src={viewingPlato.imagen_principal}
                    alt={viewingPlato.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C85228]">
                  <MapPin className="w-3.5 h-3.5" />
                  {viewingPlato.municipio_nombre}
                </span>

                {Number(viewingPlato.destacado) === 1 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Destacado en Carrusel
                  </span>
                )}
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1">
                  Descripción
                </span>
                <p className="text-[#2C221E] leading-relaxed">{viewingPlato.descripcion}</p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1">
                  Ingredientes
                </span>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#2C221E] whitespace-pre-line font-mono text-[11px]">
                  {viewingPlato.ingredientes}
                </div>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1">
                  Preparación
                </span>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#2C221E] whitespace-pre-line">
                  {viewingPlato.preparacion}
                </div>
              </div>

              {/* Multimedia de Preparación (solo si existe) */}
              {parseImageGallery(viewingPlato.imagen_preparacion).length > 0 && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1.5">
                    Fotografías de Preparación
                  </span>
                  <ImageGalleryView
                    images={parseImageGallery(viewingPlato.imagen_preparacion)}
                    altTitle={`Preparación de ${viewingPlato.nombre}`}
                  />
                </div>
              )}

              {viewingPlato.video_preparacion && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1.5">
                    Video de Preparación
                  </span>
                  <YouTubeVideoCard
                    url={viewingPlato.video_preparacion}
                    title={`Preparación de ${viewingPlato.nombre}`}
                    subtitle={viewingPlato.nombre}
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E8DFD5] flex justify-end">
              <button
                onClick={() => setViewingPlato(null)}
                className="px-4 py-1.5 rounded-xl bg-[#2C221E] text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación */}
      {deletingPlato && (
        <div id="modal-plato-delete" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E8DFD5] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E] mb-2">
              ¿Eliminar Plato Típico?
            </h3>
            <p className="text-xs text-[#7D6B62] mb-6 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el plato <strong>"{deletingPlato.nombre}"</strong>?
              Esta acción no se puede deshacer.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingPlato(null)}
                className="px-4 py-2 rounded-xl border border-[#D9CEC5] text-xs font-bold text-[#7D6B62] hover:bg-[#FAF7F2]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlato}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
