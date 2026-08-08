import React from 'react';
import { X, HelpCircle, EyeOff, Zap, Shield, Sparkles, Heart } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
      <div className="bg-amber-950 border-4 border-amber-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-amber-100 max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-amber-800 rounded-lg text-amber-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-amber-200">How to Play Honey Heist</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          {/* Step 1 */}
          <div className="bg-amber-900/50 p-3.5 rounded-xl border border-amber-800">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🌲</span> 1. Avoid Bees in the Forest
            </h3>
            <p>
              Navigate your bear around the forest. Approach bee hives to harvest letter honeycombs.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-amber-300/90">
              <li>
                <strong className="text-amber-200">Bees Chase You:</strong> Bees patrol around their hives. If you get too close, they will actively swarm and chase you!
              </li>
              <li>
                <strong className="text-amber-200">Backpack Weight:</strong> Carrying more letters makes you heavier and louder, increasing the distance from which bees can detect you.
              </li>
              <li>
                <strong className="text-amber-200">Bushes:</strong> Hide inside berry bushes for 100% camouflage to make chasing bees lose your track!
              </li>
              <li>
                <strong className="text-amber-200">Bee Stings:</strong> If bees catch you, they sting you. If your health reaches 0, you get stunned and any carried letters are returned to their hives!
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-amber-900/50 p-3.5 rounded-xl border border-amber-800">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🏠</span> 2. Bear Den & Welcome Mat
            </h3>
            <p>
              Once you harvest letter honeycombs, walk back to the Bear Den at the top-left of the forest.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-amber-300/90">
              <li>
                <strong className="text-amber-200">Auto-Deposit:</strong> Simply approach the cave to safely store your harvested letters.
              </li>
              <li>
                <strong className="text-amber-200">Welcome Mat Menu:</strong> Step onto the Welcome Mat outside the cave door to open the Cave Menu.
              </li>
              <li>
                <strong className="text-amber-200">Hibernating:</strong> Rest inside the Cave to fully restore your health back to 100%!
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-amber-900/50 p-3.5 rounded-xl border border-amber-800">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🧠</span> 3. Spelling & Honey Processing
            </h3>
            <p>
              When all letters are deposited, enter the Honey Processing Workshop! Arrange your collected letters in the correct boxes to spell the vocabulary word.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-amber-300/90">
              <li>
                Use the Part of Speech, Definition, Context sentence, and Speech Pronunciation clues.
              </li>
              <li>
                Correct spelling rewards you with sweet <strong className="text-amber-200">Honey Jars</strong>!
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-amber-900/50 p-3.5 rounded-xl border border-amber-800">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🐻</span> 4. Unlock Bears & Abilities
            </h3>
            <p>
              Spend your Honey Jars in the Wardrobe to unlock unique Bear species with active abilities (press <kbd className="bg-amber-900 px-1.5 py-0.5 rounded border border-amber-700 text-[10px]">Space</kbd> or tap the Ability button):
            </p>
            <ul className="list-none mt-2 space-y-2 text-amber-300/90 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">📢</span>
                <div>
                  <strong className="text-amber-200 font-bold">Grizzly:</strong> Mighty Roar — Scares nearby bees and reduces hive alert meters.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">🎋</span>
                <div>
                  <strong className="text-amber-200 font-bold">Panda:</strong> Bamboo Roll — Perform a rapid dodge roll past bee swarms.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">❄️</span>
                <div>
                  <strong className="text-amber-200 font-bold">Polar:</strong> Frost Breath — Temporarily freezes all bees in solid ice cubes.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">✨</span>
                <div>
                  <strong className="text-amber-200 font-bold">Sunny Sun Bear:</strong> Honey Sense — Reveals paths to hives and adds an extra Hint use to the Spelling Workshop!
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">🌿</span>
                <div>
                  <strong className="text-amber-200 font-bold">Koko Koala:</strong> Stealth Sneak — Blends into the forest, making you temporarily invisible.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">🌙</span>
                <div>
                  <strong className="text-amber-200 font-bold">Luna Moon Bear:</strong> Lunar Eclipse — Evokes a shadow shield that fully blocks the next bee sting!
                </div>
              </li>
            </ul>
          </div>

          {/* Step 5 */}
          <div className="bg-amber-900/50 p-3.5 rounded-xl border border-amber-800">
            <h3 className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
              <span>🎩</span> 5. Wardrobe & Loot Hives
            </h3>
            <p>
              Open Loot Hives to secure amazing cosmetics! Customize your bear in the Wardrobe:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-amber-300/90">
              <li>
                <strong className="text-amber-200">Hats:</strong> Detective Hats, Chef Hats, Crowns, and top hats.
              </li>
              <li>
                <strong className="text-amber-200">Armor:</strong> Leather, Iron, or Golden Armor that boosts your maximum health!
              </li>
              <li>
                <strong className="text-amber-200">Trails:</strong> Honey, fire, or sparkling stardust visual trails.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
