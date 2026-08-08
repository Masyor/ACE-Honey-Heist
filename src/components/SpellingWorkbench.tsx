import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, HelpCircle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { WordData } from '../types';
import { sound } from '../utils/sound';

interface SpellingWorkbenchProps {
  currentWord: WordData;
  level: number;
  onCompleteWord: (earnedJars: number) => void;
  onHintUsed?: () => void;
  hasBonusHint?: boolean;
}

export const SpellingWorkbench: React.FC<SpellingWorkbenchProps> = ({
  currentWord,
  level,
  onCompleteWord,
  onHintUsed,
  hasBonusHint = false
}) => {
  const targetLetters = currentWord.word.split('');

  // Scrambled tiles pool
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string }[]>([]);
  // Placed tiles in target slots
  const [placedTiles, setPlacedTiles] = useState<(string | null)[]>([]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedJarsAmount, setEarnedJarsAmount] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(hasBonusHint ? 3 : 2);
  const [isShaking, setIsShaking] = useState(false);

  // Scramble available letters on mount
  useEffect(() => {
    const tiles = targetLetters.map((letter, idx) => ({
      id: `tile_${idx}_${letter}_${Math.random()}`,
      letter
    }));

    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    setAvailableTiles(tiles);
    setPlacedTiles(new Array(targetLetters.length).fill(null));
    setIsSuccess(false);
    setHintsRemaining(hasBonusHint ? 3 : 2);
  }, [currentWord, hasBonusHint]);

  // Audio Pronunciation
  const handleListenPronunciation = () => {
    sound.speakWord(currentWord.word);
  };

  // Click Available Tile -> Place into first empty slot
  const handleSelectAvailableTile = (tile: { id: string; letter: string }) => {
    sound.playTileClick();

    const emptyIdx = placedTiles.findIndex((slot) => slot === null);
    if (emptyIdx === -1) return;

    const newPlaced = [...placedTiles];
    newPlaced[emptyIdx] = tile.letter;
    setPlacedTiles(newPlaced);

    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

    // Check if fully placed
    checkCompletion(newPlaced);
  };

  // Click Placed Tile -> Return to available pool
  const handleRemovePlacedTile = (index: number) => {
    const letter = placedTiles[index];
    if (!letter) return;

    sound.playTileClick();

    const newPlaced = [...placedTiles];
    newPlaced[index] = null;
    setPlacedTiles(newPlaced);

    setAvailableTiles((prev) => [
      ...prev,
      { id: `tile_ret_${index}_${letter}_${Math.random()}`, letter }
    ]);
  };

  // Reset Tiles
  const handleResetTiles = () => {
    sound.playTileClick();
    const tiles = targetLetters.map((letter, idx) => ({
      id: `tile_reset_${idx}_${letter}_${Math.random()}`,
      letter
    }));
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    setAvailableTiles(tiles);
    setPlacedTiles(new Array(targetLetters.length).fill(null));
  };

  // Use Hint
  const handleUseHint = () => {
    if (hintsRemaining <= 0) return;

    // Find first incorrect or empty slot
    const firstWrongIdx = placedTiles.findIndex((l, idx) => l !== targetLetters[idx]);
    if (firstWrongIdx === -1) return;

    sound.playTileClick();
    const correctLetter = targetLetters[firstWrongIdx];

    // Remove placed letter at this index if exists
    const currentPlacedLetter = placedTiles[firstWrongIdx];
    let newAvailable = [...availableTiles];

    if (currentPlacedLetter) {
      newAvailable.push({
        id: `hint_ret_${Math.random()}`,
        letter: currentPlacedLetter
      });
    }

    // Find tile with correct letter in available
    const correctTileIdx = newAvailable.findIndex((t) => t.letter === correctLetter);
    if (correctTileIdx !== -1) {
      newAvailable.splice(correctTileIdx, 1);
    }

    const newPlaced = [...placedTiles];
    newPlaced[firstWrongIdx] = correctLetter;

    setPlacedTiles(newPlaced);
    setAvailableTiles(newAvailable);
    setHintsRemaining((prev) => prev - 1);
    if (onHintUsed) onHintUsed();

    checkCompletion(newPlaced);
  };

  // Check word spelling
  const checkCompletion = (currentSlots: (string | null)[]) => {
    if (currentSlots.some((s) => s === null)) return;

    const spelledWord = currentSlots.join('');
    if (spelledWord === currentWord.word) {
      // SUCCESS!
      setIsSuccess(true);
      sound.playWordCorrect();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Calculate reward Jars
      const baseReward = 15;
      const difficultyBonus = currentWord.difficulty * 3;
      const totalJars = baseReward + difficultyBonus;
      setEarnedJarsAmount(totalJars);
    } else {
      // INCORRECT Shake
      setIsShaking(true);
      sound.playStungSFX();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2.5 sm:p-5 bg-amber-950/95 border-2 sm:border-4 border-amber-800 rounded-xl sm:rounded-2xl shadow-2xl text-amber-100 backdrop-blur max-h-[85vh] overflow-y-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-4 border-b-2 border-amber-800/80">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-3xl">🍯</span>
          <div>
            <h2 className="text-sm sm:text-2xl font-bold text-amber-200">
              Honey Processing Workshop
            </h2>
            <p className="text-[10px] sm:text-sm text-amber-300/80">
              Arrange the collected honeycombs into the correct word!
            </p>
          </div>
        </div>

        {/* Audio Pronounce Button */}
        <button
          onClick={handleListenPronunciation}
          className="flex items-center gap-1 sm:gap-2 bg-amber-800 hover:bg-amber-700 active:scale-95 text-amber-100 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-amber-600 font-semibold text-[11px] sm:text-sm transition shadow"
          title="Listen to Word Pronunciation"
        >
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span>Pronounce</span>
        </button>
      </div>

      {/* Clues Parchment Card */}
      <div className="my-2.5 sm:my-5 p-2.5 sm:p-4 bg-amber-900/60 rounded-lg sm:rounded-xl border border-amber-700/80 shadow-inner relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 mb-2 sm:mb-3">
          <span className="bg-amber-800 text-amber-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-600">
            {currentWord.partOfSpeech}
          </span>
          <span className="bg-amber-900 text-amber-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-700">
            Tier {currentWord.difficulty}
          </span>
        </div>

        {/* Definition */}
        <div className="mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
            Definition:
          </span>
          <p className="text-xs sm:text-base font-medium text-amber-100 italic leading-relaxed">
            "{currentWord.definition}"
          </p>
        </div>

        {/* Example Sentence with Blank */}
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
            Context Sentence:
          </span>
          <p className="text-xs sm:text-base font-semibold text-amber-200 leading-relaxed bg-amber-950/70 p-2 sm:p-3 rounded-lg border border-amber-800">
            {currentWord.exampleSentence}
          </p>
        </div>
      </div>

      {/* TARGET LETTER SLOTS */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Target Honey Jars ({placedTiles.filter(Boolean).length}/{targetLetters.length}):
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || isSuccess}
              className="flex items-center gap-1 text-xs bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-600 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Hint ({hintsRemaining} left)</span>
            </button>

            <button
              onClick={handleResetTiles}
              disabled={isSuccess}
              className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-amber-200 px-2.5 py-1 rounded-lg border border-stone-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Honey Jar Letter Slots Grid */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 bg-amber-950/80 rounded-2xl border-2 border-amber-800 transition-transform ${
            isShaking ? 'animate-bounce border-red-500' : ''
          }`}
        >
          {placedTiles.map((tile, idx) => (
            <button
              key={`slot_${idx}`}
              onClick={() => handleRemovePlacedTile(idx)}
              disabled={isSuccess}
              className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-lg transition transform active:scale-95 ${
                tile
                  ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-amber-950 border-amber-300 shadow-amber-500/20'
                  : 'bg-amber-900/40 border-dashed border-amber-700 text-amber-700/50'
              }`}
            >
              {tile || '_'}
              {tile && (
                <span className="absolute top-1 right-1 text-[9px] opacity-60">
                  🍯
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AVAILABLE LETTER TILES */}
      {!isSuccess && (
        <div className="my-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-2 text-center">
            Click letters to place them into jars:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5 p-3 bg-amber-900/40 rounded-xl border border-amber-800">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleSelectAvailableTile(tile)}
                className="w-11 h-12 sm:w-12 sm:h-13 bg-amber-700 hover:bg-amber-600 active:scale-90 text-amber-100 font-bold text-lg rounded-xl border-2 border-amber-500 shadow-md transition"
              >
                {tile.letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VICTORY CARD OVERLAY */}
      {isSuccess && (
        <div className="mt-6 p-5 bg-gradient-to-br from-amber-800/90 to-amber-900/90 rounded-2xl border-2 border-amber-400 text-center shadow-2xl animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-400 rounded-full text-amber-950 mb-2 shadow">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-amber-100">
            WORD PROCESSED PERFECTLY!
          </h3>
          <p className="text-amber-200 text-sm mt-1">
            You spelled <span className="font-extrabold text-amber-300 underline">{currentWord.word}</span>!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-950/80 px-4 py-2 rounded-full border border-amber-500 my-4 shadow">
            <span className="text-2xl animate-bounce">🍯</span>
            <span className="font-extrabold text-amber-300 text-lg">
              +{earnedJarsAmount} Honey Jars Earned!
            </span>
          </div>

          <div>
            <button
              onClick={() => onCompleteWord(earnedJarsAmount)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-extrabold text-base px-8 py-3.5 rounded-xl border-2 border-amber-200 shadow-xl transition transform active:scale-95"
            >
              <span>Next Heist Round</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
