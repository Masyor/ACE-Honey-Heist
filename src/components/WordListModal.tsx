import React from 'react';
import { BookOpen, CheckCircle, Sparkles, X } from 'lucide-react';
import { ALL_WORD_LISTS } from '../data/words';
import { WordList } from '../types';
import { sound } from '../utils/sound';

interface WordListModalProps {
  activeListId: string;
  onSelectWordList: (listId: string) => void;
  onClose: () => void;
}

export const WordListModal: React.FC<WordListModalProps> = ({
  activeListId,
  onSelectWordList,
  onClose,
}) => {
  const handleChoose = (list: WordList) => {
    sound.playTileClick();
    onSelectWordList(list.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-amber-950 border-4 border-amber-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-900 border-b-2 border-amber-800">
          <div className="flex items-center gap-2 text-amber-200">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold">Cave Bookshelf — Word Lists</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-800 text-amber-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Lists Folder Auto-populated */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <p className="text-xs sm:text-sm text-amber-300/90 mb-2">
            Select a word list from the bear library. Swapping lists will update your active heist target words!
          </p>

          {ALL_WORD_LISTS.map((list) => {
            const isSelected = list.id === activeListId;
            return (
              <div
                key={list.id}
                onClick={() => handleChoose(list)}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-amber-900/90 border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                    : 'bg-amber-900/40 border-amber-800 hover:bg-amber-900/70 hover:border-amber-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <h3 className="font-bold text-amber-100 text-sm sm:text-base">
                      {list.name}
                    </h3>
                  </div>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs bg-amber-400 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold hover:underline">
                      Select
                    </span>
                  )}
                </div>

                <p className="text-xs text-amber-200/80 leading-relaxed">
                  {list.description}
                </p>

                {/* Sample words preview */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase">
                    Words ({list.words.length}):
                  </span>
                  {list.words.slice(0, 4).map((w) => (
                    <span
                      key={w.id}
                      className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-mono"
                    >
                      {w.word}
                    </span>
                  ))}
                  {list.words.length > 4 && (
                    <span className="text-[10px] text-amber-400/80">
                      +{list.words.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-amber-900/50 border-t border-amber-800 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-extrabold text-xs sm:text-sm rounded-xl transition"
          >
            Close Bookshelf
          </button>
        </div>
      </div>
    </div>
  );
};
