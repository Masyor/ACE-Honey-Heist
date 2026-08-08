import React, { useRef, useEffect, useState } from 'react';
import { X, Lock, Check, Shield, Zap, Sparkles, Shirt } from 'lucide-react';
import { BearType, CosmeticItem } from '../types';
import { BEARS } from '../data/bears';
import { COSMETICS } from '../data/cosmetics';
import { PixelArtRenderer } from '../utils/pixelArt';
import { sound } from '../utils/sound';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  honeyJars: number;
  equippedBearId: string;
  equippedHatId: string | null;
  equippedTrailId: string | null;
  equippedRoarId: string | null;
  equippedArmorId: string | null;
  unlockedBearIds: string[];
  unlockedCosmeticIds: string[];
  onSelectBear: (bearId: string) => void;
  onUnlockBear: (bear: BearType) => void;
  onEquipCosmetic: (item: CosmeticItem) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  honeyJars,
  equippedBearId,
  equippedHatId,
  equippedTrailId,
  equippedRoarId,
  equippedArmorId,
  unlockedBearIds,
  unlockedCosmeticIds,
  onSelectBear,
  onUnlockBear,
  onEquipCosmetic
}) => {
  const [activeTab, setActiveTab] = useState<'bears' | 'hats' | 'trails' | 'roars' | 'armor'>('bears');
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentBear = BEARS.find((b) => b.id === equippedBearId) || BEARS[0];
  const equippedHat = COSMETICS.find((c) => c.id === equippedHatId);
  const equippedTrail = COSMETICS.find((c) => c.id === equippedTrailId);

  // Render Real-time Preview Canvas
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame += 16;
      const canvas = previewCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Background grass preview
          ctx.fillStyle = '#3c8f2d';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          PixelArtRenderer.drawBear(
            ctx,
            canvas.width / 2 - 16,
            canvas.height / 2 - 16,
            currentBear,
            'down',
            false,
            false,
            frame / 30,
            equippedHat,
            equippedTrail,
            frame
          );
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, currentBear, equippedHat, equippedTrail]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-amber-950 border-4 border-amber-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-amber-100">
        {/* Header */}
        <div className="bg-amber-900/80 px-5 py-3 border-b-2 border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shirt className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-bold text-amber-200">Bear Den Wardrobe</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-amber-800 rounded-lg text-amber-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
          {/* Bear Preview Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-900/50 p-4 rounded-xl border border-amber-800">
            <div className="relative w-32 h-32 bg-amber-950 rounded-xl border-2 border-amber-700 flex items-center justify-center shadow-inner overflow-hidden">
              <canvas ref={previewCanvasRef} width={128} height={128} className="w-full h-full" />
              <div className="absolute bottom-1 text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                Live Preview
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-amber-100">{currentBear.name}</h3>
                <span className="text-xs bg-amber-800 text-amber-300 px-2 py-0.5 rounded uppercase font-semibold">
                  {currentBear.rarity}
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-1">{currentBear.description}</p>

              {/* Special Ability Card */}
              <div className="mt-3 bg-amber-950/80 p-2.5 rounded-lg border border-amber-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-200">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Ability: {currentBear.abilityName}</span>
                </div>
                <p className="text-amber-300/80 mt-0.5">{currentBear.abilityDescription}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b-2 border-amber-800 text-sm font-bold">
            <button
              onClick={() => setActiveTab('bears')}
              className={`px-4 py-2 border-b-2 transition ${
                activeTab === 'bears'
                  ? 'border-amber-400 text-amber-200 bg-amber-900/40'
                  : 'border-transparent text-amber-400/60 hover:text-amber-300'
              }`}
            >
              🐻 Bears
            </button>
            <button
              onClick={() => setActiveTab('hats')}
              className={`px-4 py-2 border-b-2 transition ${
                activeTab === 'hats'
                  ? 'border-amber-400 text-amber-200 bg-amber-900/40'
                  : 'border-transparent text-amber-400/60 hover:text-amber-300'
              }`}
            >
              🎩 Hats
            </button>
            <button
              onClick={() => setActiveTab('trails')}
              className={`px-4 py-2 border-b-2 transition ${
                activeTab === 'trails'
                  ? 'border-amber-400 text-amber-200 bg-amber-900/40'
                  : 'border-transparent text-amber-400/60 hover:text-amber-300'
              }`}
            >
              ✨ Trails
            </button>
            <button
              onClick={() => setActiveTab('roars')}
              className={`px-3 py-2 border-b-2 transition ${
                activeTab === 'roars'
                  ? 'border-amber-400 text-amber-200 bg-amber-900/40'
                  : 'border-transparent text-amber-400/60 hover:text-amber-300'
              }`}
            >
              📢 Roars
            </button>
            <button
              onClick={() => setActiveTab('armor')}
              className={`px-3 py-2 border-b-2 transition ${
                activeTab === 'armor'
                  ? 'border-amber-400 text-amber-200 bg-amber-900/40'
                  : 'border-transparent text-amber-400/60 hover:text-amber-300'
              }`}
            >
              🛡️ Armour
            </button>
          </div>

          {/* TAB 1: BEARS */}
          {activeTab === 'bears' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BEARS.map((bear) => {
                const isUnlocked = unlockedBearIds.includes(bear.id);
                const isEquipped = equippedBearId === bear.id;
                const canAfford = honeyJars >= bear.unlockCost;

                return (
                  <div
                    key={bear.id}
                    className={`p-3 rounded-xl border-2 transition flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-amber-900/90 border-amber-400 shadow-md'
                        : isUnlocked
                        ? 'bg-amber-950/80 border-amber-800 hover:border-amber-600'
                        : 'bg-stone-900/80 border-stone-800 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-200">{bear.name}</span>
                        {isEquipped && (
                          <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded">
                            EQUIPPED
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-amber-300/80 mt-1">{bear.description}</div>
                      <div className="text-xs text-amber-400 font-medium mt-2 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{bear.abilityName}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-800/50 flex items-center justify-between">
                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.playTileClick();
                            onSelectBear(bear.id);
                          }}
                          disabled={isEquipped}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                            isEquipped
                              ? 'bg-amber-800 text-amber-300 cursor-default'
                              : 'bg-amber-600 hover:bg-amber-500 text-amber-950'
                          }`}
                        >
                          {isEquipped ? 'Selected' : 'Equip Bear'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              sound.playHoneycombPickup();
                              onUnlockBear(bear);
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-amber-950'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock for 🍯 {bear.unlockCost} Jars</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2, 3, 4, 5: COSMETICS (HATS, TRAILS, ROARS, ARMOUR) */}
          {activeTab !== 'bears' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COSMETICS.filter((c) => {
                if (activeTab === 'hats') return c.category === 'hat';
                if (activeTab === 'trails') return c.category === 'trail';
                if (activeTab === 'roars') return c.category === 'roar';
                if (activeTab === 'armor') return c.category === 'armor';
                return false;
              }).map((item) => {
                const isUnlocked = unlockedCosmeticIds.includes(item.id);
                const isEquipped =
                  equippedHatId === item.id ||
                  equippedTrailId === item.id ||
                  equippedRoarId === item.id ||
                  equippedArmorId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isUnlocked) {
                        sound.playTileClick();
                        onEquipCosmetic(item);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-amber-900/90 border-amber-400 shadow'
                        : isUnlocked
                        ? 'bg-amber-950/80 border-amber-800 hover:border-amber-600'
                        : 'bg-stone-900/80 border-stone-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xl mb-1">
                        <span>{item.icon}</span>
                        {isUnlocked ? (
                          isEquipped ? (
                            <Check className="w-4 h-4 text-amber-400" />
                          ) : null
                        ) : (
                          <Lock className="w-4 h-4 text-stone-500" />
                        )}
                      </div>

                      <div className="font-bold text-xs text-amber-200">{item.name}</div>
                      <div className="text-[10px] text-amber-300/70 mt-0.5">{item.description}</div>
                    </div>

                    <div className="mt-2 text-[10px] uppercase font-bold text-amber-400">
                      {isUnlocked
                        ? isEquipped
                          ? 'Equipped'
                          : 'Click to Equip'
                        : 'Unlocked in Loot Hive'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
