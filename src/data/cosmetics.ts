import { CosmeticItem } from '../types';

export const COSMETICS: CosmeticItem[] = [
  // HATS
  {
    id: 'hat_none',
    name: 'No Hat',
    description: 'A natural bare bear look.',
    category: 'hat',
    rarity: 'common',
    icon: '🚫',
    color: 'transparent'
  },
  {
    id: 'hat_straw',
    name: 'Farmer Straw Hat',
    description: 'A cozy woven straw hat reminiscent of Valley farmers.',
    category: 'hat',
    rarity: 'common',
    icon: '🌾',
    color: '#eab308'
  },
  {
    id: 'hat_beanie',
    name: 'Winter Beanie',
    description: 'Keeps your bear ears warm during chilly autumn nights.',
    category: 'hat',
    rarity: 'common',
    icon: '🧶',
    color: '#ef4444'
  },
  {
    id: 'hat_bee',
    name: 'Bee Antennae',
    description: 'Disguise yourself as a giant furry worker bee!',
    category: 'hat',
    rarity: 'rare',
    icon: '🐝',
    color: '#f59e0b'
  },
  {
    id: 'hat_chef',
    name: 'Master Honey Chef Toque',
    description: 'For bears who process honey with culinary perfection.',
    category: 'hat',
    rarity: 'rare',
    icon: '👨‍🍳',
    color: '#f8fafc'
  },
  {
    id: 'hat_flowers',
    name: 'Wildflower Crown',
    description: 'Woven with sweet clover and dandelion blossoms.',
    category: 'hat',
    rarity: 'rare',
    icon: '🌸',
    color: '#ec4899'
  },
  {
    id: 'hat_top',
    name: 'Gentleman Top Hat',
    description: 'A dapper black top hat for refined bear heists.',
    category: 'hat',
    rarity: 'epic',
    icon: '🎩',
    color: '#1e293b'
  },
  {
    id: 'hat_pirate',
    name: 'Honey Pirate Tricorne',
    description: 'Shiver me timbers! Ahoy, hive planderer!',
    category: 'hat',
    rarity: 'epic',
    icon: '🏴‍☠️',
    color: '#881337'
  },
  {
    id: 'hat_crown',
    name: 'Golden Hive Crown',
    description: 'Forged from pure solidified royal jelly and gold.',
    category: 'hat',
    rarity: 'legendary',
    icon: '👑',
    color: '#fbbf24'
  },

  // TRAILS
  {
    id: 'trail_none',
    name: 'No Trail',
    description: 'Leave no paw prints or trails behind.',
    category: 'trail',
    rarity: 'common',
    icon: '🚫',
    color: 'transparent'
  },
  {
    id: 'trail_honey',
    name: 'Golden Honey Drips',
    description: 'Leaves a gooey trail of sweet honey drops behind your paws.',
    category: 'trail',
    rarity: 'common',
    icon: '🍯',
    color: '#f59e0b'
  },
  {
    id: 'trail_leaves',
    name: 'Autumn Leaves',
    description: 'Whirling golden and red leaves flutter behind your footsteps.',
    category: 'trail',
    rarity: 'rare',
    icon: '🍂',
    color: '#ea580c'
  },
  {
    id: 'trail_sparkles',
    name: 'Starlight Sparkles',
    description: 'Glittering stardust shines as you sneak through the woods.',
    category: 'trail',
    rarity: 'rare',
    icon: '✨',
    color: '#38bdf8'
  },
  {
    id: 'trail_petals',
    name: 'Cherry Blossom Petals',
    description: 'Soft pink sakura petals drift in your stealthy wake.',
    category: 'trail',
    rarity: 'epic',
    icon: '🌸',
    color: '#f472b6'
  },
  {
    id: 'trail_rainbow',
    name: 'Rainbow Stardust',
    description: 'A magical spectrum trail fit for a legendary honey thief.',
    category: 'trail',
    rarity: 'legendary',
    icon: '🌈',
    color: '#a855f7'
  },

  // ROARS
  {
    id: 'roar_grizzly',
    name: 'Classic Forest Growl',
    description: 'A deep, echoing bear growl that rattles the treetops.',
    category: 'roar',
    rarity: 'common',
    icon: '📢',
    color: '#b45309'
  },
  {
    id: 'roar_squeak',
    name: 'Squeaky Toy Chirp',
    description: 'A hilariously cute squeak that somehow baffles the bees.',
    category: 'roar',
    rarity: 'rare',
    icon: '🐥',
    color: '#facc15'
  },
  {
    id: 'roar_slurp',
    name: 'Loud Honey Slurp',
    description: 'A boisterous *SLURP* sound effect when using your ability.',
    category: 'roar',
    rarity: 'rare',
    icon: '😋',
    color: '#f97316'
  },
  {
    id: 'roar_thunder',
    name: 'Thunderous Boom',
    description: 'A mighty rumble like rolling summer thunder.',
    category: 'roar',
    rarity: 'epic',
    icon: '⚡',
    color: '#0284c7'
  },
  {
    id: 'roar_fanfare',
    name: 'Royal Trumpet Fanfare',
    description: 'A majestic brass fanfare whenever you activate your ability!',
    category: 'roar',
    rarity: 'legendary',
    icon: '🎺',
    color: '#eab308'
  },

  // ARMOUR (Increases Max Health)
  {
    id: 'armor_none',
    name: 'No Armour',
    description: 'Standard natural bear fur (+0 HP).',
    category: 'armor',
    rarity: 'common',
    icon: '🚫',
    color: 'transparent',
    healthBonus: 0
  },
  {
    id: 'armor_vest',
    name: 'Bee-let Proof Vest',
    description: 'Padded Kevlar-knit vest designed to absorb stingers (+30 Max HP).',
    category: 'armor',
    rarity: 'common',
    icon: '🎽',
    color: '#475569',
    healthBonus: 30
  },
  {
    id: 'armor_plate',
    name: 'Paw-lished Platemail',
    description: 'Gleaming steel chestplate forged for heavy-duty honey raids (+60 Max HP).',
    category: 'armor',
    rarity: 'rare',
    icon: '🛡️',
    color: '#94a3b8',
    healthBonus: 60
  },
  {
    id: 'armor_honey',
    name: 'Honeycomb Cuirass',
    description: 'Hardened beeswax armor that absorbs bee attacks (+100 Max HP).',
    category: 'armor',
    rarity: 'epic',
    icon: '🐝',
    color: '#f59e0b',
    healthBonus: 100
  },
  {
    id: 'armor_bark',
    name: 'Ancient Redwood Barkmail',
    description: 'Impenetrable ancient forest bark blessed by nature (+150 Max HP).',
    category: 'armor',
    rarity: 'legendary',
    icon: '🪵',
    color: '#78350f',
    healthBonus: 150
  }
];
