/**
 * Honey Heist - Core Type Definitions
 */

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface WordData {
  id: string;
  word: string;
  difficulty: number; // 1 to 10
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition';
  definition: string;
  exampleSentence: string; // contains '_____' where word goes
  hint?: string;
}

export interface WordList {
  id: string;
  name: string;
  description: string;
  words: WordData[];
}

export interface BearType {
  id: string;
  name: string;
  description: string;
  abilityName: string;
  abilityDescription: string;
  abilityCooldown: number; // in seconds
  spriteColor: string;
  speed: number;
  stealthBonus: number;
  unlockCost: number; // Honey Jars
  unlockLevel: number; // Minimum player round required
  rarity: Rarity;
}

export type CosmeticCategory = 'hat' | 'trail' | 'roar' | 'armor';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  rarity: Rarity;
  icon: string;
  color: string;
  healthBonus?: number;
  unlockCost?: number; // for direct purchase if desired, or lootbox only
}

export interface HiveObject {
  id: string;
  x: number;
  y: number;
  letter: string;
  isHarvested: boolean;
  beeAlert: number; // 0 to 100
  beePatrolRadius: number;
  beeAngle: number;
  beeSpeed: number;
}

export interface CollectedLetter {
  id: string;
  letter: string;
  hiveId: string;
}

export interface GameStats {
  wordsSpelled: number;
  lettersCollected: number;
  hivesHeisted: number;
  stingsAvoided: number;
  perfectRounds: number;
  honeyJarsEarnedTotal: number;
}

export type GamePhase = 'FOREST' | 'PROCESSING' | 'ROUND_VICTORY';

export interface GameSettings {
  soundMuted: boolean;
  musicMuted: boolean;
  highContrast: boolean;
  touchControlsForceShow: boolean;
}
