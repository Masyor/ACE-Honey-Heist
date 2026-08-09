import { BearType } from '../types';

export const BEARS: BearType[] = [
  {
    id: 'sun',
    name: 'Sunny Sun Bear',
    description: 'A friendly starter bear. Special Ability: Honey Sense — Reveals glowing radar paths to hives and grants 1 extra use of the hint feature during the honey processing workshop!',
    abilityName: 'Honey Sense',
    abilityDescription: 'Reveals glowing paths to hives and grants 1 extra hint use during the spelling phase!',
    abilityCooldown: 14,
    spriteColor: '#d97706',
    speed: 3.5,
    stealthBonus: 1.2,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'common'
  },
  {
    id: 'grizzly',
    name: 'Barnaby Grizzly',
    description: 'A hearty forest bear. Special Ability: Mighty Roar — Scares away all bees in a massive wave, freezing their alert and resetting aggro.',
    abilityName: 'Mighty Roar',
    abilityDescription: 'Scares nearby bees with a shockwave, freezing their alert meter and resetting aggro for 5s.',
    abilityCooldown: 12,
    spriteColor: '#7c4a21',
    speed: 3.2,
    stealthBonus: 1.0,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'common'
  },
  {
    id: 'panda',
    name: 'Bao Bao Panda',
    description: 'An agile panda. Special Ability: Bamboo Roll — Performs a fast roll forward at double speed without drawing bee aggro.',
    abilityName: 'Bamboo Roll',
    abilityDescription: 'Perform a swift roll forward at double speed without alerting bees.',
    abilityCooldown: 8,
    spriteColor: '#2b2b2b',
    speed: 3.5,
    stealthBonus: 1.2,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'rare'
  },
  {
    id: 'polar',
    name: 'Kodiak Polar',
    description: 'A chilly arctic bear. Special Ability: Frost Breath — Blasts an icy wave that freezes all bee swarms in place for 6 seconds.',
    abilityName: 'Frost Breath',
    abilityDescription: 'Freezes all bee swarms in place with a wave of frost for 6 seconds.',
    abilityCooldown: 15,
    spriteColor: '#e0f2fe',
    speed: 3.0,
    stealthBonus: 1.1,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'epic'
  },
  {
    id: 'moon',
    name: 'Luna Moon Bear',
    description: 'A mystical midnight bear. Special Ability: Lunar Eclipse — Emits a protective shadow shield that blocks the next bee sting!',
    abilityName: 'Lunar Eclipse',
    abilityDescription: 'Generates a dark lunar shield that completely absorbs the next stinger attack!',
    abilityCooldown: 16,
    spriteColor: '#1e293b',
    speed: 3.6,
    stealthBonus: 1.5,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'epic'
  },
  {
    id: 'koala',
    name: 'Koko Koala Bear',
    description: 'A master of stealth. Special Ability: Stealth Sneak — Signature ability to toggle sneak mode, halving movement noise and bee aggro radius.',
    abilityName: 'Tree Camouflage',
    abilityDescription: 'Become completely invisible to bees for 6 seconds, even out in the open.',
    abilityCooldown: 14,
    spriteColor: '#6b7280',
    speed: 3.1,
    stealthBonus: 2.0,
    unlockCost: 0,
    unlockLevel: 1,
    rarity: 'legendary'
  }
];
