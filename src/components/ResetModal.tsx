import React from 'react';
import { X, RotateCcw } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
      <div className="bg-amber-950 border-4 border-red-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-amber-100 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-amber-900 rounded-lg text-amber-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="bg-red-950/80 p-3 rounded-full border border-red-800 text-red-500 animate-pulse">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-red-400 tracking-tight">Reset All Progress?</h2>
        </div>

        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed mb-6">
          This will permanently delete your custom bears, unlocked hats/armor/trails, spelling level ranks, and honey jars as if you have never played before. 
          <br /><br />
          <strong className="text-red-300">This action cannot be undone!</strong>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 px-4 bg-amber-900 hover:bg-amber-800 text-amber-200 hover:text-amber-100 font-bold text-xs rounded-xl border border-amber-700 transition-all active:scale-[0.98]"
          >
            No, Keep Playing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 sm:py-2.5 px-4 bg-red-900 hover:bg-red-800 text-white font-bold text-xs rounded-xl border border-red-700 hover:border-red-600 shadow-md shadow-red-950/50 transition-all active:scale-[0.98]"
          >
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
