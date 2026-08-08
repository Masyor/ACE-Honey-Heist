import React, { useEffect, useRef, useState } from 'react';
import { PixelArtRenderer } from '../utils/pixelArt';
import { BEARS } from '../data/bears';
import { Play } from 'lucide-react';
import { sound } from '../utils/sound';

interface SplashScreenProps {
  onPlay: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBearIndex, setSelectedBearIndex] = useState(0);

  // Cycle through the bears every 2 seconds on the splash screen for a cute preview!
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedBearIndex((prev) => (prev + 1) % BEARS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();
      
      // Scale context 3.5x for a giant pixel bear
      ctx.scale(3.5, 3.5);

      // Calculate bounce & walking frame
      frame += 1;
      const walkFrame = Math.floor(frame / 12) % 4;
      const bounceY = Math.sin(frame / 8) * 1.5;

      // Current bear to showcase
      const bear = BEARS[selectedBearIndex];

      // Draw the bear in the center of scaled space
      // Canvas width is 112, scaled by 3.5 = 392. Canvas height is 112, scaled by 3.5 = 392.
      // So center is around x=40, y=36 inside the 112x112 space.
      PixelArtRenderer.drawBear(
        ctx,
        40,
        36 + bounceY,
        bear,
        'down',
        false, // isSneaking
        false, // isRolling
        walkFrame,
        null,  // hat
        null,  // trail
        frame * 16, // time
        100,   // health
        100,   // maxHealth
        false, // isStunned
        null,  // armor
        false  // isSleeping
      );

      ctx.restore();

      // Draw some cute pixel bees buzzing around the bear
      ctx.save();
      const numBees = 3;
      for (let i = 0; i < numBees; i++) {
        const angle = (frame / 45) + (i * Math.PI * 2) / numBees;
        const radius = 55 + Math.sin(frame / 15 + i) * 6;
        const bx = canvas.width / 2 + Math.cos(angle) * radius;
        const by = canvas.height / 2 - 10 + Math.sin(angle) * radius;

        // Draw Bee Sprite Body
        ctx.fillStyle = '#f59e0b'; // golden yellow
        ctx.fillRect(bx - 4, by - 4, 8, 6);

        // Black stripes
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx - 1, by - 4, 2, 6);

        // Flapping wings
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        const wingY = Math.sin(frame / 4) > 0 ? -6 : -3;
        ctx.fillRect(bx - 3, by + wingY, 6, 3);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedBearIndex]);

  const handlePlayClick = () => {
    sound.playTileClick();
    onPlay();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#1c0d02] via-[#2d1502] to-[#120700] z-[9999] flex flex-col items-center justify-between p-6 overflow-hidden font-sans select-none">
      {/* Golden Forest Dust Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute w-2 h-2 rounded-full bg-yellow-400 top-1/4 left-1/4 animate-pulse blur-[1px]" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 top-1/3 left-3/4 animate-pulse blur-[1px]" style={{ animationDuration: '4.5s' }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-500 top-2/3 left-1/3 animate-pulse blur-[1px]" style={{ animationDuration: '5s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-yellow-300 top-3/4 left-5/6 animate-pulse blur-[1px]" style={{ animationDuration: '3.5s' }} />
      </div>

      {/* Decorative Wood Logs/Leaves in Background */}
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-950/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-amber-950/20 blur-3xl pointer-events-none" />

      {/* Top Margin Spacer */}
      <div className="h-4 sm:h-8" />

      {/* Header & Logo Area */}
      <div className="flex flex-col items-center text-center max-w-md w-full relative z-10 mt-4">
        {/* Subtitle / Eyebrow */}
        <span className="text-yellow-400 font-bold tracking-[0.25em] text-xs uppercase mb-1 drop-shadow-sm">
          ★ AN UN-BEAR-ABLY CUTE SPELLING ADVENTURE ★
        </span>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter select-none pb-2">
          HONEY HEIST
        </h1>
        
        {/* Title Underline Accent */}
        <div className="w-32 h-1.5 bg-amber-600 rounded-full border-b border-amber-500 shadow" />
      </div>

      {/* Bear Showcase Canvas Container */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 relative z-10">
        <div className="bg-amber-950/80 border-4 border-amber-800 rounded-3xl p-4 shadow-2xl relative flex flex-col items-center justify-center max-w-[280px] sm:max-w-[320px]">
          {/* Sparkles element */}
          <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 font-black text-[10px] px-2.5 py-1 rounded-full border-2 border-amber-700 animate-bounce">
            A WIDE SELECTION OF BEARS!
          </div>

          <canvas
            ref={canvasRef}
            width={392}
            height={392}
            className="w-48 h-48 sm:w-56 sm:h-56 image-render-pixelated drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
          />

          {/* Species Label */}
          <div className="mt-2 text-center">
            <span className="text-amber-400 font-black text-sm uppercase tracking-wider block">
              {BEARS[selectedBearIndex].name}
            </span>
            <span className="text-amber-200/70 text-[10px] leading-tight block mt-0.5 max-w-[200px] mx-auto">
              {BEARS[selectedBearIndex].abilityName}: {BEARS[selectedBearIndex].abilityDescription}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button Area */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 relative z-10 mb-8">
        <button
          onClick={handlePlayClick}
          className="w-full py-4 px-8 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xl rounded-2xl border-b-8 border-amber-700 hover:border-amber-600 transition-all transform hover:-translate-y-1 active:translate-y-1 active:border-b-2 shadow-lg shadow-amber-950/50 flex items-center justify-center gap-3 animate-pulse"
        >
          <Play className="w-6 h-6 fill-current text-amber-950" />
          PLAY GAME
        </button>

        {/* Footer info */}
        <p className="text-[10px] sm:text-xs text-amber-300/40 tracking-wider">
          VER. 1.1.2
        </p>
      </div>
    </div>
  );
};
