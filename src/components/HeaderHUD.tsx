import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, RotateCcw } from 'lucide-react';
import { BearType, GamePhase, GameSettings } from '../types';

interface HeaderHUDProps {
  phase: GamePhase;
  level: number;
  wordLength: number;
  depositedCount: number;
  honeyJars: number;
  currentBear: BearType;
  settings: GameSettings;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenWardrobe: () => void;
  onOpenLootbox: () => void;
  onOpenHelp: () => void;
  onResetGame: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  phase,
  level,
  wordLength,
  depositedCount,
  honeyJars,
  settings,
  onToggleSound,
  onToggleMusic,
  onOpenHelp,
  onResetGame
}) => {
  return (
    <header className="bg-amber-950/95 text-amber-100 border-b-2 border-amber-800 shadow-md px-2 py-1 sm:px-3 sm:py-2 select-none z-30 shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & Level Info */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">🍯</span>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <h1 className="font-extrabold text-xs sm:text-base tracking-wide text-amber-200">
              HONEY HEIST
            </h1>
            <span className="bg-amber-900/90 text-amber-300 font-bold text-[10px] sm:text-xs px-1.5 py-0.5 rounded border border-amber-700/80">
              R{level}: {phase === 'FOREST' ? `${depositedCount}/${wordLength}` : 'Bench'}
            </span>
          </div>
        </div>

        {/* Currency & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Honey Jars Balance */}
          <div className="flex items-center gap-1 bg-amber-900/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/50">
            <span className="text-xs sm:text-sm">🍯</span>
            <span className="font-extrabold text-amber-200 text-xs sm:text-sm">
              {honeyJars} Jars
            </span>
          </div>

          {/* Controls / Toggles */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-900/60 p-0.5 sm:p-1 rounded-lg border border-amber-800">
            <button
              onClick={onToggleSound}
              className="p-1 hover:bg-amber-800 rounded text-amber-200 transition-colors"
              title={settings.soundMuted ? 'Unmute SFX' : 'Mute SFX'}
            >
              {settings.soundMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              )}
            </button>

            <button
              onClick={onToggleMusic}
              className="p-1 hover:bg-amber-800 rounded text-amber-200 transition-colors"
              title={settings.musicMuted ? 'Unmute Music' : 'Mute Music'}
            >
              <Music
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  settings.musicMuted ? 'text-red-400' : 'text-amber-300'
                }`}
              />
            </button>

            <button
              onClick={onOpenHelp}
              className="p-1 hover:bg-amber-800 rounded text-amber-200 transition-colors"
              title="Game Instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            </button>

            <button
              onClick={onResetGame}
              className="p-1 hover:bg-red-900/60 rounded text-red-400 hover:text-red-300 transition-colors"
              title="Reset All Progress"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
