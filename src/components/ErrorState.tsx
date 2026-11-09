import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocurrió un inconveniente',
  message = 'No pudimos conectar con los datos gastronómicos.',
  onRetry
}) => {
  return (
    <div id="error-state-container" className="max-w-md mx-auto my-12 p-6 bg-[#FFF8F5] border border-[#F5C2B3] rounded-2xl text-center shadow-sm">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C85228]">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#3B251B] mb-2">{title}</h3>
      <p className="text-sm text-[#7D665D] mb-5">{message}</p>
      {onRetry && (
        <button
          id="btn-retry-action"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C85228] hover:bg-[#A8421D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      )}
    </div>
  );
};
