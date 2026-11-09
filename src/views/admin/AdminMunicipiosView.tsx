import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Landmark,
  Utensils,
  RefreshCw
} from 'lucide-react';
import { Municipio } from '../../types/index.ts';
import {
  fetchMunicipios,
  createMunicipioApi,
  updateMunicipioApi,
  deleteMunicipioApi
} from '../../services/api.ts';
import { MediaUploader } from '../../components/admin/MediaUploader.tsx';
import { YouTubeInput } from '../../components/admin/YouTubeInput.tsx';
import { MultiImageUploader } from '../../components/admin/MultiImageUploader.tsx';
import { YouTubeVideoCard } from '../../components/YouTubeVideoCard.tsx';
import { ImageGalleryView } from '../../components/ImageGalleryView.tsx';
import { parseImageGallery, serializeImageGallery } from '../../utils/youtube.ts';

export function AdminMunicipiosView() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null);
  const [viewingMunicipio, setViewingMunicipio] = useState<Municipio | null>(null);
  const [deletingMunicipio, setDeletingMunicipio] = useState<Municipio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formDescripcionCultural, setFormDescripcionCultural] = useState('');
  const [formImagen, setFormImagen] = useState('');
  const [formLugarNombre, setFormLugarNombre] = useState('');
  const [formLugarDescripcion, setFormLugarDescripcion] = useState('');
  const [formLugarImagenes, setFormLugarImagenes] = useState<string[]>([]);
  const [formLugarVideo, setFormLugarVideo] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await fetchMunicipios();
      setMunicipios(list);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar municipios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingMunicipio(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormDescripcionCultural('');
    setFormImagen('');
    setFormLugarNombre('');
    setFormLugarDescripcion('');
    setFormLugarImagenes([]);
    setFormLugarVideo('');
    setIsMediaUploading(false);
    setIsFormOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (m: Municipio) => {
    setEditingMunicipio(m);
    setFormNombre(m.nombre);
    setFormDescripcion(m.descripcion);
    setFormDescripcionCultural(m.descripcion_cultural);
    setFormImagen(m.imagen || '');
    setFormLugarNombre(m.lugar_turistico_nombre);
    setFormLugarDescripcion(m.lugar_turistico_descripcion);
    setFormLugarImagenes(parseImageGallery(m.lugar_turistico_imagen));
    setFormLugarVideo(m.lugar_turistico_video || '');
    setIsMediaUploading(false);
    setIsFormOpen(true);
    setErrorMessage(null);
  };

  const handleSaveMunicipio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formDescripcion.trim() || !formDescripcionCultural.trim()) {
      setErrorMessage('Los campos de nombre, descripción general y cultural son obligatorios.');
      return;
    }
    if (!formLugarNombre.trim() || !formLugarDescripcion.trim()) {
      setErrorMessage('El nombre y descripción del lugar turístico emblemático son obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        nombre: formNombre.trim(),
        descripcion: formDescripcion.trim(),
        descripcion_cultural: formDescripcionCultural.trim(),
        imagen: formImagen.trim() || null,
        lugar_turistico_nombre: formLugarNombre.trim(),
        lugar_turistico_descripcion: formLugarDescripcion.trim(),
        lugar_turistico_imagen: serializeImageGallery(formLugarImagenes),
        lugar_turistico_video: formLugarVideo.trim() || null
      };

      if (editingMunicipio) {
        await updateMunicipioApi(editingMunicipio.id, payload);
        setSuccessMessage(`Municipio "${payload.nombre}" actualizado correctamente.`);
      } else {
        await createMunicipioApi(payload);
        setSuccessMessage(`Municipio "${payload.nombre}" creado exitosamente.`);
      }

      setIsFormOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar el municipio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMunicipio = async () => {
    if (!deletingMunicipio) return;
    try {
      setIsSubmitting(true);
      await deleteMunicipioApi(deletingMunicipio.id);
      setSuccessMessage(`Municipio "${deletingMunicipio.nombre}" eliminado correctamente.`);
      setDeletingMunicipio(null);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar el municipio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMunicipios = municipios.filter((m) =>
    m.nombre.toLowerCase().includes(search.toLowerCase()) ||
    m.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    m.lugar_turistico_nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="admin-municipios-view" className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-extrabold text-2xl text-[#2C221E] tracking-tight">
            Administración de Municipios
          </h1>
          <p className="text-sm text-[#7D6B62] mt-0.5">
            Crea, edita o elimina municipios y su lugar turístico emblemático.
          </p>
        </div>

        <button
          id="btn-admin-add-municipio"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Municipio</span>
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
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Filtro / Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A70]">
            <Search className="h-4 w-4" />
          </div>
          <input
            id="admin-search-municipio"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar municipio por nombre o lugar turístico..."
            className="block w-full pl-10 pr-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-[#8C7A70] hover:text-[#2C221E] px-2 py-1"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla / Listado de Municipios */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[#8C7A70] text-sm">
            <span className="w-6 h-6 border-2 border-[#C85228] border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Cargando lista de municipios...</p>
          </div>
        ) : filteredMunicipios.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A70] text-sm">
            <MapPin className="w-8 h-8 text-[#D9CEC5] mx-auto mb-2" />
            <p className="font-semibold text-[#2C221E]">No se encontraron municipios</p>
            <p className="text-xs text-[#7D6B62] mt-1">Prueba con otro término de búsqueda o crea uno nuevo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="table-admin-municipios" className="min-w-full divide-y divide-[#E8DFD5]">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Municipio
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Lugar Turístico Único
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Platos Asociados
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#7D6B62]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5] text-xs">
                {filteredMunicipios.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Municipio y foto */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF0EB] shrink-0 border border-[#E8DFD5]">
                          {(() => {
                            const touristGallery = parseImageGallery(m.lugar_turistico_imagen);
                            const thumb = m.imagen || (touristGallery.length > 0 ? touristGallery[0] : null);
                            return thumb ? (
                              <img
                                src={thumb}
                                alt={m.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#C85228]">
                                <MapPin className="w-5 h-5" />
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <div className="font-bold text-[#2C221E] text-sm">{m.nombre}</div>
                          <div className="text-[11px] text-[#7D6B62] max-w-xs truncate" title={m.descripcion}>
                            {m.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lugar turístico emblemático */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#2C221E]">
                        <Landmark className="w-3.5 h-3.5 text-[#C85228] shrink-0" />
                        <span>{m.lugar_turistico_nombre}</span>
                      </div>
                      <div className="text-[11px] text-[#7D6B62] line-clamp-1 max-w-xs" title={m.lugar_turistico_descripcion}>
                        {m.lugar_turistico_descripcion}
                      </div>
                    </td>

                    {/* Conteo de platos */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF0EB] text-[#C85228]">
                        <Utensils className="w-3 h-3" />
                        <span>{m.platos_count ?? 0}</span>
                      </span>
                    </td>

                    {/* Botones de acción */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-view-muni-${m.id}`}
                          onClick={() => setViewingMunicipio(m)}
                          className="p-1.5 rounded-lg text-[#7D6B62] hover:text-[#2C221E] hover:bg-[#FAF0EB] transition-colors"
                          title="Ver ficha completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-edit-muni-${m.id}`}
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg text-[#C85228] hover:text-[#9E3915] hover:bg-[#FAF0EB] transition-colors"
                          title="Editar municipio"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-muni-${m.id}`}
                          onClick={() => setDeletingMunicipio(m)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                          title="Eliminar municipio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Crear / Editar Municipio */}
      {isFormOpen && (
        <div id="modal-municipio-form" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden my-8">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E8DFD5] flex items-center justify-between">
              <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E]">
                {editingMunicipio ? `Editar Municipio: ${editingMunicipio.nombre}` : 'Registrar Nuevo Municipio'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#7D6B62] hover:text-[#2C221E] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMunicipio} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Nombre del Municipio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej. Aiquile"
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                />
              </div>

              {/* Descripción General */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Descripción General <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  placeholder="Reseña geográfica, características y vocación del municipio..."
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                />
              </div>

              {/* Descripción Cultural */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C221E] mb-1">
                  Descripción Cultural y Tradiciones <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescripcionCultural}
                  onChange={(e) => setFormDescripcionCultural(e.target.value)}
                  placeholder="Costumbres, festividades, gastronomía e identidad cultural..."
                  className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-[#FAF8F5]"
                />
              </div>

              {/* Imagen del Municipio (Opcional) */}
              <MediaUploader
                id="admin-muni-imagen"
                label="Imagen del municipio"
                optional={true}
                mediaType="image"
                category="municipios"
                value={formImagen}
                onChange={(newVal) => setFormImagen(newVal || '')}
                onUploadingStateChange={setIsMediaUploading}
              />

              {/* Sección Lugar Turístico Emblemático ÚNICO */}
              <div className="pt-3 border-t border-[#E8DFD5]">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4 text-[#C85228]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C85228]">
                    Lugar Turístico Emblemático (Exactamente Uno)
                  </span>
                </div>

                <div className="space-y-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFD5]">
                  <div>
                    <label className="block text-xs font-bold text-[#2C221E] mb-1">
                      Nombre del Lugar Turístico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formLugarNombre}
                      onChange={(e) => setFormLugarNombre(e.target.value)}
                      placeholder="Ej. Templo de San Pedro / Cristo de la Concordia"
                      className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C221E] mb-1">
                      Descripción del Lugar Turístico <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formLugarDescripcion}
                      onChange={(e) => setFormLugarDescripcion(e.target.value)}
                      placeholder="Historia, atractivo visual y relevancia turística..."
                      className="w-full px-3.5 py-2 border border-[#D9CEC5] rounded-xl text-xs focus:ring-2 focus:ring-[#C85228] bg-white"
                    />
                  </div>

                  {/* Multimedia del Lugar Turístico */}
                  <div className="space-y-4 pt-2 border-t border-[#E8DFD5]">
                    <MultiImageUploader
                      id="admin-muni-tur-imagenes"
                      label="Fotos del lugar turístico"
                      category="municipios"
                      images={formLugarImagenes}
                      onChange={setFormLugarImagenes}
                      onUploadingStateChange={setIsMediaUploading}
                      helperText="Hasta 5 fotos opcionales del lugar turístico"
                    />

                    <YouTubeInput
                      id="admin-muni-tur-video"
                      label="Video de YouTube del lugar turístico"
                      value={formLugarVideo}
                      onChange={setFormLugarVideo}
                      helperText="Pega un enlace de YouTube (video o short)"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
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
                        : editingMunicipio
                        ? 'Actualizar Municipio'
                        : 'Crear Municipio'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Visualizar Ficha del Municipio */}
      {viewingMunicipio && (
        <div id="modal-municipio-view" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden my-8">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E8DFD5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C85228]" />
                <h3 className="font-serif-title font-extrabold text-base text-[#2C221E]">
                  {viewingMunicipio.nombre}
                </h3>
              </div>
              <button
                onClick={() => setViewingMunicipio(null)}
                className="text-[#7D6B62] hover:text-[#2C221E] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {viewingMunicipio.imagen && (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-100 border border-[#E8DFD5]">
                  <img
                    src={viewingMunicipio.imagen}
                    alt={viewingMunicipio.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1">
                  Descripción General
                </span>
                <p className="text-[#2C221E] leading-relaxed">{viewingMunicipio.descripcion}</p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-[#7D6B62] block mb-1">
                  Cultura y Tradiciones
                </span>
                <p className="text-[#2C221E] leading-relaxed">{viewingMunicipio.descripcion_cultural}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-2.5">
                <span className="font-bold text-[#C85228] block">
                  Lugar Turístico: {viewingMunicipio.lugar_turistico_nombre}
                </span>
                <p className="text-[#7D6B62] leading-relaxed">{viewingMunicipio.lugar_turistico_descripcion}</p>

                {/* Galería de fotos del lugar turístico */}
                {parseImageGallery(viewingMunicipio.lugar_turistico_imagen).length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[#7D6B62] block">
                      Fotografías del lugar turístico
                    </span>
                    <ImageGalleryView
                      images={parseImageGallery(viewingMunicipio.lugar_turistico_imagen)}
                      altTitle={viewingMunicipio.lugar_turistico_nombre}
                    />
                  </div>
                )}

                {/* Video de YouTube del lugar turístico */}
                {viewingMunicipio.lugar_turistico_video && (
                  <div className="mt-3 space-y-1.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[#7D6B62] block">
                      Video del lugar turístico
                    </span>
                    <YouTubeVideoCard
                      url={viewingMunicipio.lugar_turistico_video}
                      title={`Recorrido: ${viewingMunicipio.lugar_turistico_nombre}`}
                      subtitle={viewingMunicipio.nombre}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E8DFD5] flex justify-end">
              <button
                onClick={() => setViewingMunicipio(null)}
                className="px-4 py-1.5 rounded-xl bg-[#2C221E] text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación */}
      {deletingMunicipio && (
        <div id="modal-municipio-delete" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E8DFD5] p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              (deletingMunicipio.platos_count ?? 0) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="font-serif-title font-extrabold text-lg text-[#2C221E] mb-2">
              {(deletingMunicipio.platos_count ?? 0) > 0 ? 'Municipio con platos asociados' : '¿Eliminar Municipio?'}
            </h3>

            {(deletingMunicipio.platos_count ?? 0) > 0 ? (
              <div className="space-y-3 mb-6">
                <p className="text-xs text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed font-semibold">
                  Este municipio tiene platos asociados. Debe reasignar o eliminar los platos antes de eliminar el municipio.
                </p>
                <p className="text-xs text-[#7D6B62]">
                  Actualmente hay <strong className="text-[#C85228]">{deletingMunicipio.platos_count}</strong> {(deletingMunicipio.platos_count === 1 ? 'plato registrado' : 'platos registrados')} asociados a <strong>"{deletingMunicipio.nombre}"</strong>. Para preservar la integridad de los datos, no es posible eliminarlo directamente.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#7D6B62] mb-6 leading-relaxed">
                Estás a punto de eliminar el municipio <strong>"{deletingMunicipio.nombre}"</strong>. Esta acción no se puede deshacer.
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingMunicipio(null)}
                className="px-4 py-2 rounded-xl border border-[#D9CEC5] text-xs font-bold text-[#7D6B62] hover:bg-[#FAF7F2]"
              >
                {(deletingMunicipio.platos_count ?? 0) > 0 ? 'Entendido / Volver' : 'Cancelar'}
              </button>
              {(deletingMunicipio.platos_count ?? 0) === 0 && (
                <button
                  onClick={handleDeleteMunicipio}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
