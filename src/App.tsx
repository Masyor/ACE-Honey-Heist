import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, GameSettings, BearType, CosmeticItem } from './types';
import { BEARS } from './data/bears';
import { COSMETICS } from './data/cosmetics';
import { getWordForLevel, ALL_WORD_LISTS, getWordListById } from './data/words';
import { sound } from './utils/sound';
import { HeaderHUD } from './components/HeaderHUD';
import { ForestCanvas } from './components/ForestCanvas';
import { CaveInteriorCanvas } from './components/CaveInteriorCanvas';
import { SpellingWorkbench } from './components/SpellingWorkbench';
import { MobileControls } from './components/MobileControls';
import { WardrobeModal } from './components/WardrobeModal';
import { LootboxModal } from './components/LootboxModal';
import { HelpModal } from './components/HelpModal';
import { WordListModal } from './components/WordListModal';
import { ResetModal } from './components/ResetModal';
import { SplashScreen } from './components/SplashScreen';
import { BearAnnouncementModal } from './components/BearAnnouncementModal';

export default function App() {
  // --- PERSISTENT STATE FROM LOCAL STORAGE ---
  const [level, setLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('hh_level') || '1', 10);
  });

  const [honeyJars, setHoneyJars] = useState<number>(() => {
    return parseInt(localStorage.getItem('hh_honeyJars') || '15', 10);
  });

  const [activeWordListId, setActiveWordListId] = useState<string>(() => {
    return localStorage.getItem('hh_wordListId') || ALL_WORD_LISTS[0].id;
  });

  const [equippedBearId, setEquippedBearId] = useState<string>(() => {
    return localStorage.getItem('hh_equippedBear') || 'sun';
  });

  const [equippedHatId, setEquippedHatId] = useState<string | null>(() => {
    return localStorage.getItem('hh_equippedHat') || 'hat_none';
  });

  const [equippedTrailId, setEquippedTrailId] = useState<string | null>(() => {
    return localStorage.getItem('hh_equippedTrail') || 'trail_none';
  });

  const [equippedRoarId, setEquippedRoarId] = useState<string | null>(() => {
    return localStorage.getItem('hh_equippedRoar') || 'roar_grizzly';
  });

  const [equippedArmorId, setEquippedArmorId] = useState<string | null>(() => {
    return localStorage.getItem('hh_equippedArmor') || 'armor_none';
  });

  const [unlockedBearIds, setUnlockedBearIds] = useState<string[]>(() => {
    // All bear types are completely free and unlocked by default!
    return BEARS.map((b) => b.id);
  });

  const [unlockedCosmeticIds, setUnlockedCosmeticIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hh_unlockedCosmetics');
    return saved ? JSON.parse(saved) : ['hat_none', 'trail_none', 'armor_none', 'roar_grizzly'];
  });

  // --- GAME PLAYTHROUGH STATE ---
  const [phase, setPhase] = useState<GamePhase>('FOREST');
  const [location, setLocation] = useState<'CAVE' | 'FOREST'>('CAVE'); // Start each round in cave interior!
  const [currentWord, setCurrentWord] = useState(() => getWordForLevel(level, activeWordListId));
  const [depositedLetters, setDepositedLetters] = useState<string[]>([]);
  const [isSneaking, setIsSneaking] = useState(false);
  const [abilityCooldown, setAbilityCooldown] = useState(0);
  const [abilityTriggerCount, setAbilityTriggerCount] = useState(0);
  const [mobileMoveVector, setMobileMoveVector] = useState<{ x: number; y: number } | null>(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobileWidth = window.innerWidth < 1024;
      setIsMobileLandscape(isLandscape && isMobileWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Settings & Modals
  const [settings, setSettings] = useState<GameSettings>({
    soundMuted: false,
    musicMuted: false,
    highContrast: false,
    touchControlsForceShow: true
  });

  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isLootboxOpen, setIsLootboxOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [announcedBear, setAnnouncedBear] = useState<BearType | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('hh_level', level.toString());
    localStorage.setItem('hh_honeyJars', honeyJars.toString());
    localStorage.setItem('hh_wordListId', activeWordListId);
    localStorage.setItem('hh_equippedBear', equippedBearId);
    if (equippedHatId) localStorage.setItem('hh_equippedHat', equippedHatId);
    if (equippedTrailId) localStorage.setItem('hh_equippedTrail', equippedTrailId);
    if (equippedRoarId) localStorage.setItem('hh_equippedRoar', equippedRoarId);
    if (equippedArmorId) localStorage.setItem('hh_equippedArmor', equippedArmorId);
    localStorage.setItem('hh_unlockedBears', JSON.stringify(unlockedBearIds));
    localStorage.setItem('hh_unlockedCosmetics', JSON.stringify(unlockedCosmeticIds));
  }, [activeWordListId, equippedArmorId, equippedBearId, equippedHatId, equippedRoarId, equippedTrailId, honeyJars, level, unlockedBearIds, unlockedCosmeticIds]);

  // Active Bear & Items
  const currentBear = BEARS.find((b) => b.id === equippedBearId) || BEARS[0];
  const equippedHat = COSMETICS.find((c) => c.id === equippedHatId);
  const equippedTrail = COSMETICS.find((c) => c.id === equippedTrailId);
  const equippedRoar = COSMETICS.find((c) => c.id === equippedRoarId);
  const equippedArmor = COSMETICS.find((c) => c.id === equippedArmorId);
  const activeWordList = getWordListById(activeWordListId);

  const maxHealthCalculated = 100 + (equippedArmor?.healthBonus || 0);
  const [bearHealth, setBearHealth] = useState(maxHealthCalculated);

  // Keep player max health synced if armor changes
  useEffect(() => {
    setBearHealth((prev) => Math.min(prev, maxHealthCalculated));
  }, [maxHealthCalculated]);

  // Load active Word for Level & Active Word List
  useEffect(() => {
    const word = getWordForLevel(level, activeWordListId);
    setCurrentWord(word);
    setDepositedLetters([]);
    setPhase('FOREST');
    setLocation('CAVE');
    setBearHealth(100 + (equippedArmor?.healthBonus || 0));
  }, [level, activeWordListId, equippedArmor]);

  // Select new Word List from Bookshelf
  const handleSelectWordList = useCallback((newListId: string) => {
    setActiveWordListId(newListId);
    const newWord = getWordForLevel(level, newListId);
    setCurrentWord(newWord);
    setDepositedLetters([]);
  }, [level]);

  // Ability Cooldown Timer Ticker
  useEffect(() => {
    if (abilityCooldown <= 0) return;
    const timer = setInterval(() => {
      setAbilityCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [abilityCooldown]);

  // Trigger Bear Ability
  const handleActivateAbility = useCallback(() => {
    if (abilityCooldown > 0) return;
    setAbilityTriggerCount((prev) => prev + 1);
    setAbilityCooldown(currentBear.abilityCooldown);
  }, [abilityCooldown, currentBear.abilityCooldown]);

  // Finish Spelling Round
  const handleWordSpelledComplete = useCallback((earnedJars: number) => {
    setHoneyJars((prev) => prev + earnedJars);
    setLevel((prev) => prev + 1);

    // Pick a random bear for the next round!
    const randomBear = BEARS[Math.floor(Math.random() * BEARS.length)];
    setEquippedBearId(randomBear.id);
    setAnnouncedBear(randomBear);
  }, []);

  // Unlock Bear
  const handleUnlockBear = useCallback((bear: BearType) => {
    if (honeyJars >= bear.unlockCost && !unlockedBearIds.includes(bear.id)) {
      setHoneyJars((prev) => prev - bear.unlockCost);
      setUnlockedBearIds((prev) => [...prev, bear.id]);
      setEquippedBearId(bear.id);
    }
  }, [honeyJars, unlockedBearIds]);

  // Equip Cosmetic
  const handleEquipCosmetic = useCallback((item: CosmeticItem) => {
    if (item.category === 'hat') setEquippedHatId(item.id);
    if (item.category === 'trail') setEquippedTrailId(item.id);
    if (item.category === 'roar') setEquippedRoarId(item.id);
    if (item.category === 'armor') setEquippedArmorId(item.id);
  }, []);

  // Open Loot Hive Box
  const handleOpenLootbox = useCallback((cost: number, prize: CosmeticItem, isDuplicate: boolean) => {
    setHoneyJars((prev) => Math.max(0, prev - cost + (isDuplicate ? 15 : 0)));
    if (!isDuplicate) {
      setUnlockedCosmeticIds((prev) => [...prev, prize.id]);
      handleEquipCosmetic(prize);
    }
  }, [handleEquipCosmetic]);

  // Completely Reset Game to Default State
  const handleResetGame = useCallback(() => {
    setIsResetOpen(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  // Keyboard Cheat Code Listener for Testing (Secretly typing 'sweetcheat' or 'givemehoney')
  useEffect(() => {
    let buffer = '';
    const handleCheatCode = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 20) {
        buffer = buffer.slice(-20);
      }
      if (buffer.endsWith('sweetcheat') || buffer.endsWith('givemehoney')) {
        buffer = '';
        setHoneyJars((prev) => prev + 150);
        sound.playDepositLetter();
      }
    };
    window.addEventListener('keydown', handleCheatCode);
    return () => window.removeEventListener('keydown', handleCheatCode);
  }, []);

  if (isMobileLandscape) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-[9999] flex flex-col items-center justify-center p-6 text-center text-amber-100 font-sans">
        <div className="text-6xl animate-bounce mb-4">📱</div>
        <h2 className="text-2xl font-black text-amber-300 tracking-tight mb-2">
          Portrait Mode Required
        </h2>
        <p className="text-sm text-amber-100/70 max-w-xs leading-relaxed">
          Honey Heist is designed to be played in Portrait mode. Please rotate your device to play!
        </p>
      </div>
    );
  }

  if (showSplashScreen) {
    return (
      <SplashScreen
        onPlay={() => {
          setShowSplashScreen(false);
          if (!settings.musicMuted) {
            sound.startCozyMusic();
          }
          // Assign random bear for the first round and trigger announcement popup!
          const randomBear = BEARS[Math.floor(Math.random() * BEARS.length)];
          setEquippedBearId(randomBear.id);
          setAnnouncedBear(randomBear);
        }}
      />
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-amber-950 text-amber-100 font-sans flex flex-col justify-between select-none overflow-hidden relative">
      {/* Top Header HUD */}
      <HeaderHUD
        phase={phase}
        level={level}
        wordLength={currentWord.word.length}
        depositedCount={depositedLetters.length}
        honeyJars={honeyJars}
        currentBear={currentBear}
        settings={settings}
        onToggleSound={() => {
          sound.soundMuted = !sound.soundMuted;
          setSettings((s) => ({ ...s, soundMuted: sound.soundMuted }));
        }}
        onToggleMusic={() => {
          sound.musicMuted = !sound.musicMuted;
          setSettings((s) => ({ ...s, musicMuted: sound.musicMuted }));
          if (sound.musicMuted) {
            sound.stopCozyMusic();
          } else {
            sound.startCozyMusic();
          }
        }}
        onOpenWardrobe={() => setIsWardrobeOpen(true)}
        onOpenLootbox={() => setIsLootboxOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onResetGame={handleResetGame}
      />

      {/* Main Gameplay Screen Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-1 sm:p-4 flex flex-col items-center justify-center overflow-hidden relative">
        {phase === 'PROCESSING' ? (
          <SpellingWorkbench
            currentWord={currentWord}
            level={level}
            onCompleteWord={handleWordSpelledComplete}
            hasBonusHint={currentBear.id === 'sun'}
          />
        ) : (
          <>
            {/* Cave Interior Canvas */}
            {location === 'CAVE' && (
              <CaveInteriorCanvas
                currentBear={currentBear}
                equippedHat={equippedHat}
                equippedTrail={equippedTrail}
                equippedRoar={equippedRoar}
                equippedArmor={equippedArmor}
                carriedLetters={[]}
                depositedLetters={depositedLetters}
                onUpdateDepositedLetters={(newDeposited) => setDepositedLetters(newDeposited)}
                onOpenWardrobe={() => setIsWardrobeOpen(true)}
                onOpenLootbox={() => setIsLootboxOpen(true)}
                onOpenBookshelf={() => setIsBookshelfOpen(true)}
                onExitCave={() => setLocation('FOREST')}
                mobileMoveVector={mobileMoveVector}
                bearHealth={bearHealth}
                maxHealthCalculated={maxHealthCalculated}
                onRestoreHealth={() => setBearHealth(maxHealthCalculated)}
                activeWordListName={activeWordList.name}
              />
            )}

            {/* Forest Canvas - Kept mounted in DOM so hives/letters state persists across cave visits! */}
            <div className={location === 'FOREST' ? 'w-full h-full flex items-center justify-center' : 'hidden'}>
              <ForestCanvas
                currentWord={currentWord}
                depositedLetters={depositedLetters}
                currentBear={currentBear}
                equippedHat={equippedHat}
                equippedTrail={equippedTrail}
                equippedRoar={equippedRoar}
                equippedArmor={equippedArmor}
                onAllLettersDeposited={() => setPhase('PROCESSING')}
                onUpdateDepositedLetters={(newDeposited) => setDepositedLetters(newDeposited)}
                mobileMoveVector={mobileMoveVector}
                isSneaking={isSneaking}
                onToggleSneak={() => setIsSneaking((prev) => !prev)}
                abilityCooldown={abilityCooldown}
                onActivateAbility={handleActivateAbility}
                onOpenCaveMenu={() => setLocation('CAVE')}
                abilityTriggerCount={abilityTriggerCount}
                bearHealth={bearHealth}
                onUpdateHealth={setBearHealth}
              />
            </div>
          </>
        )}
      </main>

      {/* Touch Mobile Controls Overlay (Visible in Forest Phase) */}
      {phase === 'FOREST' && (
        <MobileControls
          onJoystickMove={(vector) => setMobileMoveVector(vector)}
          onActivateAbility={handleActivateAbility}
          onGrowl={() => sound.playRoarSFX(equippedRoar?.id)}
          abilityCooldown={abilityCooldown}
          currentBear={currentBear}
          carriedCount={0}
        />
      )}

      {/* Modals */}
      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        honeyJars={honeyJars}
        equippedBearId={equippedBearId}
        equippedHatId={equippedHatId}
        equippedTrailId={equippedTrailId}
        equippedRoarId={equippedRoarId}
        equippedArmorId={equippedArmorId}
        unlockedBearIds={unlockedBearIds}
        unlockedCosmeticIds={unlockedCosmeticIds}
        onSelectBear={(id) => setEquippedBearId(id)}
        onUnlockBear={handleUnlockBear}
        onEquipCosmetic={handleEquipCosmetic}
      />

      <LootboxModal
        isOpen={isLootboxOpen}
        onClose={() => setIsLootboxOpen(false)}
        honeyJars={honeyJars}
        unlockedCosmeticIds={unlockedCosmeticIds}
        onOpenLootbox={handleOpenLootbox}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {isBookshelfOpen && (
        <WordListModal
          activeListId={activeWordListId}
          onSelectWordList={handleSelectWordList}
          onClose={() => setIsBookshelfOpen(false)}
        />
      )}

      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {announcedBear && (
        <BearAnnouncementModal
          isOpen={!!announcedBear}
          bear={announcedBear}
          onClose={() => setAnnouncedBear(null)}
        />
      )}
    </div>
  );
}
