import React from 'react';
import { X, ShieldAlert, Lock, ArrowRight, Database } from 'lucide-react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDbConfig: () => void;
  onGoToAdmin?: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onOpenDbConfig,
  onGoToAdmin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="admin-access-modal"
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E6DDD3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 bg-[#2C1810] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C85228] flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Área Administrativa</h3>
              <p className="text-[11px] text-[#D8CDC4]">Gestión de municipios y platos típicos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-[#FAF0EB] border border-[#E8DFD5] rounded-xl text-[#2C221E] text-xs leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-[#C85228] shrink-0 mt-0.5" />
            <p>
              El sistema de autenticación y panel de administración permite a los administradores autenticados gestionar municipios, lugares turísticos y platos típicos tradicionales.
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#5C483F] leading-relaxed">
            <p>
              Las rutas administrativas están protegidas mediante credenciales seguras (bcrypt) y sesiones HTTP-only.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {onGoToAdmin && (
              <button
                id="btn-modal-go-to-admin"
                onClick={() => {
                  onClose();
                  onGoToAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C85228] hover:bg-[#B3451E] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Ingresar al Panel de Administración</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#D9CEC5] text-[#7D6B62] hover:text-[#2C221E] text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

