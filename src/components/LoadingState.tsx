import React from 'react';
import { Loader2, UtensilsCrossed } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando sabores tradicionales...'
}) => {
  return (
    <div id="loading-state-container" className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#EAE0D5] border-t-[#C85228] animate-spin flex items-center justify-center" />
        <UtensilsCrossed className="w-6 h-6 text-[#C85228] absolute" />
      </div>
      <p className="text-[#6B574F] font-medium text-base animate-pulse text-center">
        {message}
      </p>
    </div>
  );
};
