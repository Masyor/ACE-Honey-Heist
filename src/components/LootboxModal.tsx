import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, RefreshCw, Award } from 'lucide-react';
import { CosmeticItem } from '../types';
import { COSMETICS } from '../data/cosmetics';
import { sound } from '../utils/sound';

interface LootboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  honeyJars: number;
  unlockedCosmeticIds: string[];
  onOpenLootbox: (cost: number, reward: CosmeticItem, isDuplicate: boolean) => void;
}

export const LootboxModal: React.FC<LootboxModalProps> = ({
  isOpen,
  onClose,
  honeyJars,
  unlockedCosmeticIds,
  onOpenLootbox
}) => {
  const COST = 25;

  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CosmeticItem | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  if (!isOpen) return null;

  const canAfford = honeyJars >= COST;

  const handleCrackHoneycomb = () => {
    if (!canAfford || isOpening) return;

    setIsOpening(true);
    setWonItem(null);
    sound.playLootboxOpen();

    // Select random cosmetic based on rarity weights
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * COSMETICS.length);
      const prize = COSMETICS[randomIndex];
      const duplicate = unlockedCosmeticIds.includes(prize.id);

      setWonItem(prize);
      setIsDuplicate(duplicate);
      setIsOpening(false);

      onOpenLootbox(COST, prize, duplicate);

      // Confetti burst
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-amber-950 border-4 border-amber-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-amber-100 text-center relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-amber-800 rounded-lg text-amber-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Gift className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-amber-200">Mystery Loot Hive</h2>
        </div>
        <p className="text-xs text-amber-300/80 mb-6">
          Crack open a golden honeycomb to reveal randomized bear cosmetics!
        </p>

        {/* Honeycomb Opening Animation Display */}
        <div className="my-6 py-6 bg-amber-900/40 rounded-2xl border-2 border-amber-800 flex flex-col items-center justify-center min-h-[180px] relative">
          {isOpening ? (
            <div className="flex flex-col items-center animate-pulse">
              <span className="text-6xl animate-bounce">🍯</span>
              <span className="text-sm font-bold text-amber-300 mt-3">
                CRACKING HONEYCOMB...
              </span>
            </div>
          ) : wonItem ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="text-6xl mb-2">{wonItem.icon}</div>
              <div className="text-sm uppercase font-bold text-amber-400">
                {wonItem.rarity} {wonItem.category}
              </div>
              <h3 className="text-lg font-extrabold text-amber-100">{wonItem.name}</h3>
              <p className="text-xs text-amber-300/80 max-w-xs mt-1">
                {wonItem.description}
              </p>

              {isDuplicate && (
                <div className="mt-3 bg-amber-900 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-700">
                  Duplicate! Converted to +15 Bonus Honey Jars!
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-2">🍯</span>
              <span className="text-sm font-bold text-amber-200">
                Cost: 25 Honey Jars
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCrackHoneycomb}
          disabled={!canAfford || isOpening}
          className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-base border-2 shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 ${
            canAfford && !isOpening
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 border-amber-200 animate-pulse'
              : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>
            {isOpening
              ? 'Opening...'
              : wonItem
              ? 'Open Another (🍯 25 Jars)'
              : 'Open Loot Hive (🍯 25 Jars)'}
          </span>
        </button>

        {!canAfford && (
          <p className="text-xs text-red-400 font-semibold mt-3">
            You need 25 Honey Jars to open the Loot Hive! Play spelling rounds to earn more!
          </p>
        )}
      </div>
    </div>
  );
};
