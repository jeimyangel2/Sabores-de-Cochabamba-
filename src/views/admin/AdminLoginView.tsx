import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  UtensilsCrossed,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { loginAdmin } from '../../services/api.ts';
import { AdminUser } from '../../types/index.ts';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToPublic: () => void;
}

export function AdminLoginView({ onLoginSuccess, onBackToPublic }: AdminLoginViewProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      setErrorMessage('Por favor ingrese su usuario y contraseña.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const user = await loginAdmin({
        usuario: usuario.trim(),
        password: password.trim()
      });
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciales incorrectas o usuario inactivo.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div id="admin-login-page" className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Botón superior para volver al sitio público */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <button
          id="btn-login-back"
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8C7A70] hover:text-[#C85228] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al portal público de Sabores de Cochabamba</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Tarjeta Principal de Login */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-[#E8DFD5]">
          
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#C85228] flex items-center justify-center text-white shadow-md mb-4">
              <ShieldCheck className="w-8 h-8 text-[#FCD116]" />
            </div>
            <h1 className="font-serif-title font-extrabold text-2xl text-[#2C221E] tracking-tight">
              Acceso Administrativo
            </h1>
            <p className="mt-2 text-sm text-[#7D6B62]">
              Ingresa tus credenciales para administrar municipios y recetas tradicionales.
            </p>
          </div>

          {/* Alerta de Error */}
          {errorMessage && (
            <div
              id="admin-login-error"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulario */}
          <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="input-admin-usuario"
                className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1.5"
              >
                Usuario
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A70]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="input-admin-usuario"
                  type="text"
                  required
                  autoComplete="username"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="edwin"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-[#D9CEC5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228] focus:border-[#C85228] bg-[#FAF8F5] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="input-admin-password"
                className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A70]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="input-admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-[#D9CEC5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85228] focus:border-[#C85228] bg-[#FAF8F5] transition-all"
                />
              </div>
            </div>

            <div>
              <button
                id="btn-admin-submit-login"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-[#C85228] hover:bg-[#B3451E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C85228] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Información de seguridad */}
          <div className="mt-6 pt-5 border-t border-[#E8DFD5] text-center">
            <p className="text-xs text-[#7D6B62]">
              Acceso restringido a administradores autorizados. Las credenciales se gestionan de forma segura en el servidor.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
