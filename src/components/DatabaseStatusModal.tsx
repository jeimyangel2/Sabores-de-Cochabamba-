import React from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Terminal, Server, FileText } from 'lucide-react';
import { DbStatus } from '../types/index.ts';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DbStatus | null;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  status
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="db-status-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="db-status-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-db-modal"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F4EFEA] hover:bg-[#E8DFD5] flex items-center justify-center text-[#5A453C] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1EB] border border-[#F5C2B3] flex items-center justify-center text-[#C85228]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2C221E]">
              Arquitectura MySQL 8.x Local
            </h2>
            <p className="text-sm text-[#7D665D]">
              Estado y configuración del motor de datos de la plataforma
            </p>
          </div>
        </div>

        {/* Estado actual */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A70]">
              Estado de Conexión
            </span>
            {status?.connected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                MySQL 8.x Activo y Conectado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Modo Datos Locales Activo
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#8C7A70]">Base de Datos</p>
              <p className="font-semibold text-[#2C221E] font-mono">{status?.database || 'sabores_cochabamba'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8C7A70]">Host y Puerto</p>
              <p className="font-semibold text-[#2C221E] font-mono">{status?.host || 'localhost:3306'}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#6B574F] bg-white/70 p-2.5 rounded-xl border border-[#E8DFD5]">
            {status?.message}
          </p>
        </div>

        {/* Instrucciones para ejecución local */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A3830] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#C85228]" />
            Pasos para tu computadora personal
          </h3>

          <div className="p-4 rounded-2xl bg-[#2C221E] text-white text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Terminal className="w-4 h-4" />
              1. Importar tablas y recetas en MySQL local:
            </div>
            <p className="text-[#C8B8AE]">mysql -u root -p &lt; database/schema.sql</p>
            <p className="text-[#C8B8AE]">mysql -u root -p &lt; database/seeds.sql</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#F5C2B3] text-xs text-[#5A453C] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#C85228]">
              <FileText className="w-4 h-4" />
              2. Configurar variables en .env:
            </div>
            <p className="leading-relaxed">
              Copia <code>.env.example</code> a <code>.env</code> y coloca tu contraseña de MySQL local:
            </p>
            <pre className="bg-white p-2 rounded border border-[#E8DFD5] text-[#2C221E]">
{`DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=sabores_cochabamba`}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            id="btn-understand-db-status"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C85228] hover:bg-[#A8421D] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
