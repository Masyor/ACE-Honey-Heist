import React, { useEffect, useRef, useState } from 'react';
import { BearType, CosmeticItem } from '../types';
import { PixelArtRenderer } from '../utils/pixelArt';
import { sound } from '../utils/sound';

export interface Vector2D {
  x: number;
  y: number;
}

interface CaveInteriorCanvasProps {
  currentBear: BearType;
  equippedHat?: CosmeticItem;
  equippedTrail?: CosmeticItem;
  equippedRoar?: CosmeticItem;
  equippedArmor?: CosmeticItem;
  carriedLetters: string[];
  depositedLetters: string[];
  onUpdateDepositedLetters: (letters: string[]) => void;
  onOpenWardrobe: () => void;
  onOpenLootbox: () => void;
  onOpenBookshelf: () => void;
  onExitCave: () => void;
  mobileMoveVector: Vector2D | null;
  bearHealth: number;
  maxHealthCalculated: number;
  onRestoreHealth: () => void;
  activeWordListName?: string;
}

export const CaveInteriorCanvas: React.FC<CaveInteriorCanvasProps> = ({
  currentBear,
  equippedHat,
  equippedTrail,
  equippedArmor,
  carriedLetters,
  depositedLetters,
  onUpdateDepositedLetters,
  onOpenWardrobe,
  onOpenLootbox,
  onOpenBookshelf,
  onExitCave,
  mobileMoveVector,
  bearHealth,
  maxHealthCalculated,
  onRestoreHealth,
  activeWordListName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compact size for cave interior
  const VIEWPORT_W = 400;
  const VIEWPORT_H = 300;

  // Player position in Cave
  const playerRef = useRef({
    x: 200,
    y: 220,
    dir: 'up' as 'up' | 'down' | 'left' | 'right',
    isSleeping: false,
    sleepTimer: 0,
    speechBubble: '🪨 Cozy Stone Cavern',
    speechTimer: 120,
    walkFrame: 0,
  });

  const bedCooldownRef = useRef(0);
  const [interactiveNotice, setInteractiveNotice] = useState<string | null>(null);
  const [playerSpeechState, setPlayerSpeechState] = useState<{ text: string; x: number; y: number } | null>(null);
  const triggeredModalRef = useRef<string | null>(null);

  // Keyboard Movement
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Cave Interior Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Create organic uneven stone floor background texture canvas
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = VIEWPORT_W;
    bgCanvas.height = VIEWPORT_H;
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      bgCtx.imageSmoothingEnabled = false;
      // Dark cavern bedrock
      bgCtx.fillStyle = '#0f172a';
      bgCtx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

      // Uneven stone pavers floor (mix of slate grey shades)
      const stoneColors = ['#1e293b', '#334155', '#2a374a', '#1a2332', '#3f4e65', '#2d3b4e'];
      const tileSize = 20;

      for (let y = 20; y < VIEWPORT_H - 20; y += tileSize) {
        for (let x = 20; x < VIEWPORT_W - 20; x += tileSize) {
          const hash = Math.floor(Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % stoneColors.length);
          bgCtx.fillStyle = stoneColors[hash];
          bgCtx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

          if ((x + y) % 3 === 0) {
            bgCtx.fillStyle = '#475569';
            bgCtx.fillRect(x + 4, y + 5, 2, 2);
            bgCtx.fillRect(x + 12, y + 14, 3, 2);
          }
        }
      }

      // Stone Wall Frame (rough rocky borders)
      bgCtx.fillStyle = '#090d16';
      bgCtx.fillRect(0, 0, VIEWPORT_W, 22);
      bgCtx.fillRect(0, 0, 22, VIEWPORT_H);
      bgCtx.fillRect(VIEWPORT_W - 22, 0, 22, VIEWPORT_H);

      // Jagged wall highlights
      bgCtx.fillStyle = '#1f2937';
      for (let x = 0; x < VIEWPORT_W; x += 16) {
        bgCtx.fillRect(x, 18, 12, 6);
      }
    }

    let animId: number;
    let time = 0;

    // Hotspot coordinates
    const BED_X = 65;
    const BED_Y = 65;

    const WARDROBE_X = 335;
    const WARDROBE_Y = 65;

    const BOOKSHELF_X = 65;
    const BOOKSHELF_Y = 185;

    const LOOTBOX_X = 335;
    const LOOTBOX_Y = 185;

    const EXIT_X = 200;
    const EXIT_Y = 270;

    const gameLoop = () => {
      time += 16;
      ctx.imageSmoothingEnabled = false;

      const player = playerRef.current;

      if (bedCooldownRef.current > 0) {
        bedCooldownRef.current -= 1;
      }

      // Sleep logic
      if (player.isSleeping) {
        player.sleepTimer -= 1;
        if (player.sleepTimer <= 0) {
          player.isSleeping = false;
          onRestoreHealth();
          player.speechBubble = 'Yawn... Rested & healthy!';
          player.speechTimer = 150;
          // EJECT player safely out of bed!
          player.x = BED_X;
          player.y = BED_Y + 52;
          bedCooldownRef.current = 120; // 2 sec cooldown before bed triggers again
        }
      } else {
        // Player movement
        let dx = 0;
        let dy = 0;

        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) dy -= 1;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) dy += 1;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) dx -= 1;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) dx += 1;

        if (mobileMoveVector && (mobileMoveVector.x !== 0 || mobileMoveVector.y !== 0)) {
          dx = mobileMoveVector.x;
          dy = mobileMoveVector.y;
        }

        if (dx !== 0 || dy !== 0) {
          const speed = currentBear.speed * 0.85;
          const norm = Math.hypot(dx, dy) || 1;
          player.x = Math.max(35, Math.min(VIEWPORT_W - 35, player.x + (dx / norm) * speed));
          player.y = Math.max(45, Math.min(VIEWPORT_H - 25, player.y + (dy / norm) * speed));
          player.walkFrame = (player.walkFrame + 0.2) % 4;

          if (Math.abs(dx) > Math.abs(dy)) {
            player.dir = dx > 0 ? 'right' : 'left';
          } else {
            player.dir = dy > 0 ? 'down' : 'up';
          }
        }
      }

      // Hotspot Distance Checks for Physical Touch Activation
      const distToBed = Math.hypot(player.x - BED_X, player.y - BED_Y);
      const distToWardrobe = Math.hypot(player.x - WARDROBE_X, player.y - WARDROBE_Y);
      const distToBookshelf = Math.hypot(player.x - BOOKSHELF_X, player.y - BOOKSHELF_Y);
      const distToLoot = Math.hypot(player.x - LOOTBOX_X, player.y - LOOTBOX_Y);
      const distToExit = Math.hypot(player.x - EXIT_X, player.y - EXIT_Y);

      if (distToBed < 36 && !player.isSleeping && bedCooldownRef.current <= 0) {
        setInteractiveNotice('🛏️ Touch Bed -> Sleeping in cozy bed...');
        player.isSleeping = true;
        player.sleepTimer = 180; // 3 seconds
        player.x = BED_X;
        player.y = BED_Y + 5; // Snuggle into bed
        sound.playLullaby();
        player.speechBubble = 'Zzz... Sweet dreams...';
        player.speechTimer = 180;
      } else if (distToWardrobe < 32) {
        setInteractiveNotice('👗 Wardrobe -> Changing Outfit & Cosmetics');
        if (triggeredModalRef.current !== 'WARDROBE') {
          triggeredModalRef.current = 'WARDROBE';
          onOpenWardrobe();
        }
      } else if (distToBookshelf < 32) {
        setInteractiveNotice('📚 Bookshelf -> Swap Word Lists');
        if (triggeredModalRef.current !== 'BOOKSHELF') {
          triggeredModalRef.current = 'BOOKSHELF';
          onOpenBookshelf();
        }
      } else if (distToLoot < 32) {
        setInteractiveNotice('🎁 Treasure Chest -> Opening Loot Box');
        if (triggeredModalRef.current !== 'LOOTBOX') {
          triggeredModalRef.current = 'LOOTBOX';
          onOpenLootbox();
        }
      } else if (distToExit < 28) {
        setInteractiveNotice('🌲 Archway -> Returning to Forest');
        onExitCave();
      } else {
        setInteractiveNotice(null);
        if (
          distToWardrobe > 45 &&
          distToLoot > 45 &&
          distToBookshelf > 45
        ) {
          triggeredModalRef.current = null;
        }
      }

      // Auto deposit letters inside cave
      if (carriedLetters.length > 0) {
        sound.playDepositLetter();
        const newDeposited = [...depositedLetters, ...carriedLetters];
        onUpdateDepositedLetters(newDeposited);
        player.speechBubble = `Deposited ${carriedLetters.length} letter(s)!`;
        player.speechTimer = 150;
      }

      // Speech timer
      if (player.speechTimer > 0) {
        player.speechTimer -= 1;
        setPlayerSpeechState({
          text: player.speechBubble,
          x: player.isSleeping ? BED_X : player.x,
          y: player.isSleeping ? BED_Y - 20 : player.y - 25,
        });
      } else {
        setPlayerSpeechState(null);
      }

      // --- 1. RENDER BACKGROUND ---
      ctx.drawImage(bgCanvas, 0, 0);

      // --- 2. RENDER INTERACTIVE CANVAS GRAPHICS ---

      // A. COZY BED (Oak Wooden Frame, Double Mattress, Soft Crimson Blanket, Pillow)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(BED_X - 22, BED_Y - 22, 44, 44);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(BED_X - 22, BED_Y - 26, 44, 6);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(BED_X - 18, BED_Y - 18, 36, 36);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(BED_X - 14, BED_Y - 16, 28, 10);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(BED_X - 18, BED_Y - 4, 36, 22);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(BED_X - 18, BED_Y - 4, 36, 4);

      // B. WOODEN WARDROBE
      ctx.fillStyle = '#78350f';
      ctx.fillRect(WARDROBE_X - 20, WARDROBE_Y - 25, 40, 50);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(WARDROBE_X - 17, WARDROBE_Y - 21, 15, 42);
      ctx.fillRect(WARDROBE_X + 2, WARDROBE_Y - 21, 15, 42);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(WARDROBE_X - 5, WARDROBE_Y, 3, 5);
      ctx.fillRect(WARDROBE_X + 2, WARDROBE_Y, 3, 5);

      // C. BOOKSHELF
      ctx.fillStyle = '#78350f';
      ctx.fillRect(BOOKSHELF_X - 20, BOOKSHELF_Y - 22, 40, 44);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(BOOKSHELF_X - 18, BOOKSHELF_Y - 8, 36, 3);
      ctx.fillRect(BOOKSHELF_X - 18, BOOKSHELF_Y + 8, 36, 3);
      const bookColors = ['#dc2626', '#2563eb', '#059669', '#f59e0b', '#7c3aed'];
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = bookColors[i % bookColors.length];
        ctx.fillRect(BOOKSHELF_X - 16 + i * 5, BOOKSHELF_Y - 20, 4, 11);
        ctx.fillRect(BOOKSHELF_X - 16 + i * 5, BOOKSHELF_Y - 5, 4, 12);
      }

      // D. TREASURE CHEST
      ctx.fillStyle = '#b45309';
      ctx.fillRect(LOOTBOX_X - 18, LOOTBOX_Y - 15, 36, 30);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(LOOTBOX_X - 14, LOOTBOX_Y - 11, 28, 22);

      // E. CAVE ARCHWAY EXIT
      ctx.fillStyle = '#15803d';
      ctx.fillRect(EXIT_X - 30, EXIT_Y - 10, 60, 30);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(EXIT_X - 30, EXIT_Y - 10, 60, 30);

      // --- 3. RENDER BEAR ---
      if (!player.isSleeping) {
        PixelArtRenderer.drawBear(
          ctx,
          player.x,
          player.y,
          currentBear,
          player.dir,
          false,
          false,
          player.walkFrame,
          equippedHat,
          equippedTrail,
          time,
          bearHealth,
          maxHealthCalculated,
          false,
          equippedArmor,
          false
        );
      } else {
        // Draw Bear tucked into bed
        PixelArtRenderer.drawBear(
          ctx,
          BED_X - 16,
          BED_Y - 14,
          currentBear,
          'down',
          false,
          false,
          0,
          equippedHat,
          null,
          time,
          bearHealth,
          maxHealthCalculated,
          false,
          equippedArmor,
          true
        );
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(BED_X - 18, BED_Y - 2, 36, 20);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(BED_X - 18, BED_Y - 2, 36, 3);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    activeWordListName,
    bearHealth,
    carriedLetters,
    currentBear,
    depositedLetters,
    equippedArmor,
    equippedHat,
    equippedTrail,
    maxHealthCalculated,
    mobileMoveVector,
    onExitCave,
    onOpenBookshelf,
    onOpenLootbox,
    onOpenWardrobe,
    onRestoreHealth,
    onUpdateDepositedLetters,
  ]);

  return (
    <div className="relative w-full max-w-[720px] aspect-[4/3] mx-auto flex flex-col items-center justify-center select-none">
      <div className="relative w-full h-full bg-slate-900 border-2 sm:border-4 border-slate-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={VIEWPORT_W}
          height={VIEWPORT_H}
          style={{ imageRendering: 'pixelated' }}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* CRISP VECTOR HTML OVERLAYS FOR HOTSPOT LABELS (ZERO BLUR) */}
        {/* Bed Label */}
        <div className="absolute top-[28%] left-[16.25%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="bg-amber-950/90 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap">
            🛏️ Cozy Bed
          </span>
        </div>

        {/* Wardrobe Label */}
        <div className="absolute top-[28%] left-[83.75%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="bg-amber-950/90 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap">
            👗 Wardrobe
          </span>
        </div>

        {/* Bookshelf Label */}
        <div className="absolute top-[68%] left-[16.25%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <span className="bg-amber-950/90 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap">
            📚 Word Lists
          </span>
          {activeWordListName && (
            <span className="text-[9px] sm:text-[10px] text-amber-300 bg-slate-950/80 px-1.5 py-0.2 rounded mt-0.5 font-medium border border-amber-800">
              {activeWordListName.split(' ')[1] || activeWordListName}
            </span>
          )}
        </div>

        {/* Treasure Chest Label */}
        <div className="absolute top-[68%] left-[83.75%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="bg-amber-950/90 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap">
            🎁 Chest
          </span>
        </div>

        {/* Forest Exit Label */}
        <div className="absolute bottom-[4%] left-[50%] -translate-x-1/2 pointer-events-none">
          <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-600 px-3 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap">
            🌲 FOREST EXIT
          </span>
        </div>

        {/* Player Speech Bubble HTML Overlay */}
        {playerSpeechState && (
          <div
            style={{
              left: `${(playerSpeechState.x / VIEWPORT_W) * 100}%`,
              top: `${(playerSpeechState.y / VIEWPORT_H) * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full bg-amber-100/95 text-amber-950 border-2 border-amber-900 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-extrabold shadow-xl whitespace-nowrap pointer-events-none animate-fade-in"
          >
            {playerSpeechState.text}
          </div>
        )}

        {/* Bottom Interactive Notice Bar Overlay */}
        {interactiveNotice && (
          <div className="absolute bottom-1.5 left-3 right-3 bg-slate-950/95 text-amber-200 border border-amber-600/90 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-extrabold text-center shadow-2xl pointer-events-none animate-pulse">
            {interactiveNotice}
          </div>
        )}
      </div>
    </div>
  );
};

