import React, { useRef, useState, useEffect } from 'react';
import { Zap, Volume2 } from 'lucide-react';
import { BearType } from '../types';

interface MobileControlsProps {
  onJoystickMove: (vector: { x: number; y: number } | null) => void;
  onActivateAbility: () => void;
  onGrowl?: () => void;
  abilityCooldown: number;
  currentBear: BearType;
  carriedCount: number;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onJoystickMove,
  onActivateAbility,
  onGrowl,
  abilityCooldown,
  currentBear
}) => {
  const joystickRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    updateKnob(e);
  };

  const updateKnob = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);
    const maxRadius = rect.width / 2 - 16;

    let knobX = deltaX;
    let knobY = deltaY;

    if (dist > maxRadius) {
      knobX = (deltaX / dist) * maxRadius;
      knobY = (deltaY / dist) * maxRadius;
    }

    setKnobPos({ x: knobX, y: knobY });

    if (maxRadius > 0) {
      onJoystickMove({ x: knobX / maxRadius, y: knobY / maxRadius });
    }
  };

  useEffect(() => {
    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (isDragging) {
        updateKnob(e);
      }
    };
    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        onJoystickMove(null);
      }
    };

    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging]);

  const isKoala = currentBear.id === 'koala';
  const abilityLabel = isKoala ? 'Stealth Sneak' : currentBear.abilityName;

  return (
    <div className="fixed bottom-10 sm:bottom-6 left-0 right-0 px-2 sm:px-4 flex items-end justify-between pointer-events-none z-20 select-none">
      {/* Left side: Touch Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleStart}
        onMouseDown={handleStart}
        className="pointer-events-auto relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-950/80 backdrop-blur border-3 sm:border-4 border-amber-700/80 shadow-2xl flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
      >
        <div className="absolute inset-2 rounded-full border border-amber-800/40 pointer-events-none" />
        <div
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-200 shadow-xl flex items-center justify-center text-amber-950 font-bold text-base sm:text-xl pointer-events-none transition-transform duration-75"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
        >
          🐾
        </div>
      </div>

      {/* Right side: Special Ability & Growl Action Buttons */}
      <div className="pointer-events-auto flex flex-col gap-2 items-end">
        <button
          onClick={onActivateAbility}
          disabled={abilityCooldown > 0}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border-2 font-extrabold text-xs sm:text-sm shadow-xl transition active:scale-95 ${
            abilityCooldown > 0
              ? 'bg-stone-800 text-stone-400 border-stone-600 opacity-60 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-amber-950 border-amber-200 animate-pulse'
          }`}
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
          <span>
            {abilityCooldown > 0
              ? `${abilityLabel} (${abilityCooldown}s)`
              : abilityLabel}
          </span>
        </button>

        {/* Growl Button (No mechanical effect, plays equipped roar sound) */}
        {onGrowl && (
          <button
            onClick={onGrowl}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-amber-900/90 hover:bg-amber-800 text-amber-200 border-2 border-amber-600/80 font-bold text-[10px] sm:text-xs shadow-lg transition active:scale-90"
            title="Growl with equipped Roar sound!"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-bounce" />
            <span>📢 Growl</span>
          </button>
        )}
      </div>
    </div>
  );
};
