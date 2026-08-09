import React, { useEffect, useRef } from 'react';
import { Sparkles, Shirt } from 'lucide-react';
import { BearType } from '../types';
import { PixelArtRenderer } from '../utils/pixelArt';
import { sound } from '../utils/sound';

interface BearAnnouncementModalProps {
  isOpen: boolean;
  bear: BearType;
  onClose: () => void;
}

export const BearAnnouncementModal: React.FC<BearAnnouncementModalProps> = ({ isOpen, bear, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame += 1;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Center-ish for bear drawing inside 128x128
          // Scale 4x for a big showcase bear
          ctx.save();
          ctx.scale(4, 4);

          const walkFrame = Math.floor(frame / 12) % 4;
          const bounceY = Math.sin(frame / 8) * 1.2;

          PixelArtRenderer.drawBear(
            ctx,
            8, // centered in 32x32 space inside 128x128 canvas
            4 + bounceY,
            bear,
            'down',
            false,
            false,
            walkFrame,
            null,
            null,
            frame * 16,
            100,
            100,
            false,
            null,
            false
          );

          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, bear]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    // Play the bear roar sound effect!
    sound.playRoarSFX();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
      <div className="bg-amber-950 border-4 border-amber-500 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-amber-100 relative text-center">
        
        {/* Header Badge */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="bg-amber-900/80 p-2 px-4 rounded-full border border-amber-600 flex items-center gap-1.5 text-amber-400 animate-pulse text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>New Round Started!</span>
          </div>
          
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400 tracking-tight leading-tight">
            You are {bear.name}!
          </h2>
        </div>

        {/* Big Bear Canvas */}
        <div className="w-36 h-36 mx-auto mb-5 bg-amber-900/40 border-2 border-amber-700 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={128}
            height={128}
            className="w-28 h-28 image-render-pixelated drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Ability and Wardrobe Reminder */}
        <div className="bg-amber-900/60 p-3 rounded-xl border border-amber-800/80 text-xs text-amber-200 text-left mb-6 space-y-1.5">
          <p className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <span>⚡</span> SPECIAL ABILITY: {bear.abilityName}
          </p>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            {bear.abilityDescription}
          </p>
          <div className="pt-2 border-t border-amber-800/60 mt-2 flex items-center gap-1.5 text-[11px] text-amber-400/95 font-medium">
            <Shirt className="w-3.5 h-3.5" />
            <span>You can change bear types in the wardrobe!</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="w-full py-3 px-6 bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black text-lg rounded-xl border-b-4 border-amber-700 hover:border-amber-600 active:border-b-0 active:translate-y-1 transition-all shadow-md shadow-amber-950/50 uppercase tracking-wider"
        >
          GRRR!
        </button>
      </div>
    </div>
  );
};
