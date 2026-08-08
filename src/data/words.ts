import { WordData, WordList } from '../types';
import rawWordLists from './wordLists.json';

export const ALL_WORD_LISTS: WordList[] = rawWordLists as WordList[];

export function getWordListById(listId: string): WordList {
  const found = ALL_WORD_LISTS.find((l) => l.id === listId);
  return found || ALL_WORD_LISTS[0];
}

export function getWordForLevel(level: number, listId?: string): WordData {
  const activeList = listId ? getWordListById(listId) : ALL_WORD_LISTS[0];
  const words = activeList.words;
  if (!words || words.length === 0) {
    return ALL_WORD_LISTS[0].words[0];
  }
  
  // Select words based on difficulty tier
  let targetDifficulty = Math.min(Math.floor((level - 1) / 2) + 1, 8);
  const eligibleWords = words.filter(
    (w) => Math.abs(w.difficulty - targetDifficulty) <= 1
  );
  if (eligibleWords.length === 0) {
    return words[level % words.length];
  }
  return eligibleWords[(level * 7) % eligibleWords.length];
}
