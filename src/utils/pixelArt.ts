/**
 * Honey Heist - Stardew Valley Style Pixel Art Renderer
 */

import { BearType, CosmeticItem, HiveObject } from '../types';

export class PixelArtRenderer {
  // Tile Size in Pixels
  public static readonly TILE = 32;

  // --- MAP ENVIRONMENT RENDERING ---

  public static drawGrassTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    seed: number
  ) {
    // Base Stardew Forest Grass Color (#409331)
    ctx.fillStyle = '#3c8f2d';
    ctx.fillRect(x, y, this.TILE, this.TILE);

    // Variation texture pixels
    const hash = (seed * 9301 + 49297) % 233280;
    
    // Dark green shadows
    ctx.fillStyle = '#2f7422';
    if (hash % 2 === 0) ctx.fillRect(x + 4, y + 8, 2, 4);
    if (hash % 3 === 0) ctx.fillRect(x + 18, y + 20, 2, 4);
    if (hash % 5 === 0) ctx.fillRect(x + 24, y + 6, 2, 4);

    // Light green highlights
    ctx.fillStyle = '#52aa40';
    if (hash % 7 === 0) ctx.fillRect(x + 12, y + 4, 2, 2);
    if (hash % 11 === 0) ctx.fillRect(x + 6, y + 22, 2, 2);

    // Tiny clover or flower dots
    if (hash % 13 === 0) {
      ctx.fillStyle = '#ffffff'; // White clover
      ctx.fillRect(x + 14, y + 14, 2, 2);
      ctx.fillStyle = '#fef08a'; // Yellow center
      ctx.fillRect(x + 16, y + 14, 2, 2);
    } else if (hash % 17 === 0) {
      ctx.fillStyle = '#f472b6'; // Pink wildflower
      ctx.fillRect(x + 8, y + 16, 2, 2);
    }
  }

  public static drawDirtTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    seed: number
  ) {
    // Stardew Valley warm dirt path color (#d2ab6b)
    ctx.fillStyle = '#c89e5e';
    ctx.fillRect(x, y, this.TILE, this.TILE);

    // Subtle dirt pebbles & soil specks
    const hash = (seed * 49297 + 9301) % 233280;

    ctx.fillStyle = '#a67c41'; // darker dirt
    if (hash % 2 === 0) ctx.fillRect(x + 6, y + 10, 3, 2);
    if (hash % 3 === 0) ctx.fillRect(x + 20, y + 18, 2, 2);

    ctx.fillStyle = '#e2c289'; // lighter dirt highlight
    if (hash % 5 === 0) ctx.fillRect(x + 12, y + 6, 2, 2);
    if (hash % 7 === 0) ctx.fillRect(x + 22, y + 8, 2, 2);
  }

  public static drawBush(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    hasBerries: boolean = true
  ) {
    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 36, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bush Body - Rounded Stardew Bush
    ctx.fillStyle = '#1e5e22'; // Dark green base
    ctx.fillRect(x + 2, y + 8, 36, 28);
    ctx.fillRect(x + 6, y + 4, 28, 32);

    ctx.fillStyle = '#2e8133'; // Main foliage
    ctx.fillRect(x + 4, y + 6, 32, 28);

    ctx.fillStyle = '#41a447'; // Highlight top
    ctx.fillRect(x + 6, y + 6, 24, 12);
    ctx.fillRect(x + 10, y + 4, 16, 6);

    // Berry details
    if (hasBerries) {
      ctx.fillStyle = '#dc2626'; // Red berries
      ctx.fillRect(x + 8, y + 12, 4, 4);
      ctx.fillRect(x + 26, y + 18, 4, 4);
      ctx.fillRect(x + 16, y + 24, 4, 4);
      ctx.fillRect(x + 24, y + 10, 3, 3);

      ctx.fillStyle = '#f87171'; // Berry highlight
      ctx.fillRect(x + 8, y + 12, 2, 2);
      ctx.fillRect(x + 26, y + 18, 2, 2);
    }
  }

  public static drawTree(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    seed: number
  ) {
    // Tree Base Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 24, y + 62, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#5c3818'; // Dark wood
    ctx.fillRect(x + 18, y + 32, 12, 32);
    ctx.fillStyle = '#7a4d25'; // Mid wood
    ctx.fillRect(x + 20, y + 32, 8, 30);
    ctx.fillStyle = '#9c6633'; // Highlight wood line
    ctx.fillRect(x + 22, y + 32, 2, 28);

    // Root feet
    ctx.fillStyle = '#5c3818';
    ctx.fillRect(x + 14, y + 58, 6, 6);
    ctx.fillRect(x + 28, y + 58, 6, 6);

    // Leaf Canopy Layers (Stardew layered pine/deciduous)
    const isPine = seed % 2 === 0;

    if (isPine) {
      // Pine Tree Triangles
      // Bottom layer
      ctx.fillStyle = '#1b521f';
      ctx.beginPath();
      ctx.moveTo(x + 24, y - 10);
      ctx.lineTo(x - 4, y + 42);
      ctx.lineTo(x + 52, y + 42);
      ctx.closePath();
      ctx.fill();

      // Mid layer
      ctx.fillStyle = '#26702b';
      ctx.beginPath();
      ctx.moveTo(x + 24, y - 20);
      ctx.lineTo(x + 2, y + 28);
      ctx.lineTo(x + 46, y + 28);
      ctx.closePath();
      ctx.fill();

      // Top layer
      ctx.fillStyle = '#3a933f';
      ctx.beginPath();
      ctx.moveTo(x + 24, y - 32);
      ctx.lineTo(x + 8, y + 12);
      ctx.lineTo(x + 40, y + 12);
      ctx.closePath();
      ctx.fill();
    } else {
      // Round Deciduous Oak Tree
      ctx.fillStyle = '#1a541c'; // Dark shadow leaves
      ctx.beginPath();
      ctx.arc(x + 24, y + 10, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2a7c2d'; // Main leaf body
      ctx.beginPath();
      ctx.arc(x + 22, y + 6, 23, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3eb043'; // Top highlight canopy
      ctx.beginPath();
      ctx.arc(x + 20, y + 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Small leaf detail clusters
      ctx.fillStyle = '#53c959';
      ctx.fillRect(x + 12, y - 8, 8, 6);
      ctx.fillRect(x + 24, y - 2, 10, 6);
    }
  }

  public static drawWaterStream(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number
  ) {
    // Water base color (#2563eb)
    ctx.fillStyle = '#2e74c9';
    ctx.fillRect(x, y, this.TILE, this.TILE);

    // Shoreline sand edge
    ctx.fillStyle = '#d2ab6b';
    ctx.fillRect(x, y, 4, this.TILE);

    // Water animated ripples
    ctx.fillStyle = '#60a5fa';
    const waveOffset = Math.sin(time / 400 + y / 20) * 4;
    ctx.fillRect(x + 10 + waveOffset, y + 8, 12, 2);
    ctx.fillRect(x + 6 - waveOffset, y + 22, 14, 2);

    // Foam highlights
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(x + 4, y + (time / 300) % this.TILE, 2, 4);
  }

  public static drawWoodenBridge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    // Wooden Bridge Planks
    ctx.fillStyle = '#7c2d12'; // dark wood frame
    ctx.fillRect(x, y, 64, 40);

    ctx.fillStyle = '#a16207'; // wood planks
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + 2, y + 2 + i * 8, 60, 6);
    }

    // Railings
    ctx.fillStyle = '#581c87';
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y - 2, 64, 4);
    ctx.fillRect(x, y + 38, 64, 4);
  }

  public static drawBearCave(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    storedHoneyCount: number
  ) {
    // Rockface cliff
    ctx.fillStyle = '#475569'; // Slate rock base
    ctx.fillRect(x - 20, y - 20, 100, 70);

    ctx.fillStyle = '#334155'; // Dark rock shade
    ctx.fillRect(x - 20, y + 10, 100, 40);

    // Cave Mouth Entrance Arch
    ctx.fillStyle = '#0f172a'; // Deep cave dark inside
    ctx.beginPath();
    ctx.ellipse(x + 30, y + 30, 24, 22, 0, Math.PI, Math.PI * 2);
    ctx.fillRect(x + 6, y + 30, 48, 22);
    ctx.fill();

    // Wooden sign "BEAR DEN"
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 10, y - 15, 40, 14);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('BEAR DEN', x + 13, y - 5);

    // Welcome Mat outside cave door
    ctx.fillStyle = '#92400e'; // Woven coir mat brown
    ctx.fillRect(x + 6, y + 50, 48, 14);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 6, y + 50, 48, 14);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WELCOME', x + 30, y + 59);
    ctx.textAlign = 'left';

    // Honey Jars stockpiled inside/outside cave mouth
    for (let i = 0; i < Math.min(storedHoneyCount, 8); i++) {
      const jarX = x + 10 + (i % 4) * 11;
      const jarY = y + 32 + Math.floor(i / 4) * 10;

      // Jar Glass & Honey
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(jarX, jarY, 8, 8);
      ctx.fillStyle = '#78350f'; // cork lid
      ctx.fillRect(jarX + 1, jarY - 2, 6, 2);
      ctx.fillStyle = '#fef08a'; // glass shine
      ctx.fillRect(jarX + 1, jarY + 1, 2, 2);
    }
  }

  // --- HIVES & BEES ---

  public static drawHive(
    ctx: CanvasRenderingContext2D,
    hive: HiveObject,
    time: number
  ) {
    const { x, y, letter, isHarvested, beeAlert, beeAngle, beePatrolRadius } = hive;

    // Hanging rope or branch connection
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 15, y - 12, 2, 14);

    if (!isHarvested) {
      // Golden Beehive Body (Layered oval rings)
      ctx.fillStyle = '#f59e0b'; // Honey yellow
      ctx.beginPath();
      ctx.ellipse(x + 16, y + 10, 14, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hive rings
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x + 4, y + 4, 24, 3);
      ctx.fillRect(x + 2, y + 10, 28, 3);
      ctx.fillRect(x + 6, y + 16, 20, 3);

      // Hive entrance hole
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(x + 16, y + 14, 4, 0, Math.PI * 2);
      ctx.fill();

      // Honey dripping
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 15, y + 26, 2, 3 + Math.sin(time / 200) * 2);

      // Letter Tag Badge on Hive
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(x + 4, y - 8, 24, 14);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(letter, x + 16, y + 3);
      ctx.textAlign = 'left';
    } else {
      // Harvested Empty Hive
      ctx.fillStyle = '#a16207';
      ctx.beginPath();
      ctx.ellipse(x + 16, y + 10, 12, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#222';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('EMPTY', x + 2, y + 14);
    }

    // Bees Patrolling Around Hive
    const numBees = isHarvested ? 1 : 3;
    for (let i = 0; i < numBees; i++) {
      const angle = beeAngle + (i * Math.PI * 2) / numBees;
      const radius = beePatrolRadius + Math.sin(time / 150 + i) * 6;
      const bx = x + 16 + Math.cos(angle) * radius;
      const by = y + 10 + Math.sin(angle) * radius;

      // Draw Bee Sprite
      ctx.fillStyle = beeAlert > 60 ? '#ef4444' : '#f59e0b'; // turns red when alerted!
      ctx.fillRect(bx - 3, by - 3, 6, 5);

      // Black stripes
      ctx.fillStyle = '#000000';
      ctx.fillRect(bx - 1, by - 3, 2, 5);

      // Flapping wings
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const wingY = Math.sin(time / 30) > 0 ? -5 : -2;
      ctx.fillRect(bx - 2, by + wingY, 4, 2);
    }

    // Alert meter visual circle around hive when near
    if (beeAlert > 0) {
      ctx.strokeStyle = beeAlert > 75 ? '#ef4444' : beeAlert > 40 ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 16, y + 10, beePatrolRadius + 10, 0, (Math.PI * 2 * beeAlert) / 100);
      ctx.stroke();
    }
  }

  // --- PLAYER BEAR CHARACTER RENDERING ---

  public static drawBear(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    bear: BearType,
    facingDir: 'up' | 'down' | 'left' | 'right',
    isSneaking: boolean,
    isRolling: boolean,
    walkFrame: number,
    hat?: CosmeticItem | null,
    trail?: CosmeticItem | null,
    time: number = 0,
    health: number = 100,
    maxHealth: number = 100,
    isStunned: boolean = false,
    armor?: CosmeticItem | null,
    isSleeping: boolean = false
  ) {
    ctx.save();

    // 1. Particle Trail Effect
    if (trail && trail.id !== 'trail_none') {
      this.drawParticleTrail(ctx, x, y, trail, time);
    }

    // 2. Bear Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 28, isSneaking ? 16 : 14, isSneaking ? 6 : 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rolling Animation Transformation
    if (isRolling) {
      ctx.translate(x + 16, y + 16);
      ctx.rotate((time / 100) % (Math.PI * 2));
      ctx.translate(-(x + 16), -(y + 16));
    }

    const color = bear.spriteColor;

    // Body dimensions (slight duck when sneaking)
    const bodyY = isSneaking ? y + 8 : y + 4;
    const bodyH = isSneaking ? 20 : 24;

    // 3. Bear Body
    ctx.fillStyle = color;
    ctx.fillRect(x + 4, bodyY, 24, bodyH);

    // Panda Special Black & White pattern
    if (bear.id === 'panda') {
      ctx.fillStyle = '#ffffff'; // white belly
      ctx.fillRect(x + 8, bodyY + 4, 16, bodyH - 6);
      ctx.fillStyle = '#000000'; // black arms/legs
      ctx.fillRect(x + 4, bodyY + 8, 4, 12);
      ctx.fillRect(x + 24, bodyY + 8, 4, 12);
    }

    // Sun Bear orange chest crescent
    if (bear.id === 'sun') {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(x + 16, bodyY + 12, 6, 0, Math.PI);
      ctx.fill();
    }

    // Moon Bear white chest crescent
    if (bear.id === 'moon') {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(x + 16, bodyY + 12, 6, 0, Math.PI);
      ctx.fill();
    }

    // Polar Bear fur texture
    if (bear.id === 'polar') {
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(x + 6, bodyY + 2, 20, bodyH - 4);
    }

    // --- DRAW EQUIPPED ARMOUR OVER CHEST ---
    if (armor && armor.id !== 'armor_none') {
      if (armor.id === 'armor_vest') {
        ctx.fillStyle = '#334155'; // Kevlar navy vest
        ctx.fillRect(x + 6, bodyY + 6, 20, 12);
        ctx.fillStyle = '#f59e0b'; // vest strap
        ctx.fillRect(x + 8, bodyY + 6, 16, 2);
      } else if (armor.id === 'armor_plate') {
        ctx.fillStyle = '#cbd5e1'; // Gleaming silver plate
        ctx.fillRect(x + 6, bodyY + 6, 20, 12);
        ctx.fillStyle = '#e2e8f0'; // plate highlight
        ctx.fillRect(x + 8, bodyY + 8, 8, 8);
      } else if (armor.id === 'armor_honey') {
        ctx.fillStyle = '#f59e0b'; // Beeswax armor
        ctx.fillRect(x + 6, bodyY + 6, 20, 12);
        ctx.fillStyle = '#78350f'; // honeycomb cell lines
        ctx.fillRect(x + 10, bodyY + 8, 4, 4);
        ctx.fillRect(x + 18, bodyY + 8, 4, 4);
      } else if (armor.id === 'armor_bark') {
        ctx.fillStyle = '#78350f'; // Ancient Redwood bark
        ctx.fillRect(x + 6, bodyY + 6, 20, 12);
        ctx.fillStyle = '#22c55e'; // mossy bark accent
        ctx.fillRect(x + 8, bodyY + 8, 4, 3);
        ctx.fillRect(x + 18, bodyY + 12, 4, 3);
      }
    }

    // 4. Ears
    ctx.fillStyle = color;
    ctx.fillRect(x + 4, bodyY - 4, 6, 6);
    ctx.fillRect(x + 22, bodyY - 4, 6, 6);

    // Inner ears
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(x + 6, bodyY - 2, 2, 2);
    ctx.fillRect(x + 24, bodyY - 2, 2, 2);

    // 5. Face details depending on facing direction & sleeping state
    ctx.fillStyle = '#000000'; // Eyes & Nose
    if (isSleeping) {
      // Sleeping eyes (- -)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 10, bodyY + 8, 4, 2);
      ctx.fillRect(x + 18, bodyY + 8, 4, 2);
    } else if (isStunned) {
      // Dizzy eyes (x x)
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('x', x + 10, bodyY + 8);
      ctx.fillText('x', x + 18, bodyY + 8);
    } else if (facingDir === 'down' || facingDir === 'right') {
      const eyeOffset = facingDir === 'right' ? 2 : 0;
      ctx.fillRect(x + 10 + eyeOffset, bodyY + 6, 3, 3);
      ctx.fillRect(x + 19 + eyeOffset, bodyY + 6, 3, 3);

      // Snout
      ctx.fillStyle = bear.id === 'panda' ? '#ffffff' : '#d97706';
      ctx.fillRect(x + 12 + eyeOffset, bodyY + 10, 8, 6);
      ctx.fillStyle = '#000000'; // Nose tip
      ctx.fillRect(x + 14 + eyeOffset, bodyY + 10, 4, 3);
    } else if (facingDir === 'left') {
      ctx.fillRect(x + 8, bodyY + 6, 3, 3);
      ctx.fillRect(x + 17, bodyY + 6, 3, 3);

      ctx.fillStyle = bear.id === 'panda' ? '#ffffff' : '#d97706';
      ctx.fillRect(x + 10, bodyY + 10, 8, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 12, bodyY + 10, 4, 3);
    }

    // 6. Walking Paws
    const legOffset = Math.sin(walkFrame * 0.4) * 4;
    ctx.fillStyle = '#3f210d';
    if (bear.id === 'panda') ctx.fillStyle = '#000000';

    if (facingDir === 'down' || facingDir === 'up') {
      ctx.fillRect(x + 6, bodyY + bodyH, 6, 4 + legOffset);
      ctx.fillRect(x + 20, bodyY + bodyH, 6, 4 - legOffset);
    } else {
      ctx.fillRect(x + 8 + legOffset, bodyY + bodyH, 6, 4);
      ctx.fillRect(x + 18 - legOffset, bodyY + bodyH, 6, 4);
    }

    // 7. Render Equipped Hat
    if (hat && hat.id !== 'hat_none' && !isRolling) {
      this.drawHatOnBear(ctx, x, bodyY - 8, hat);
    }

    // 8. Dizzy Stars or Floating Zzz Overhead
    if (isSleeping) {
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 12px monospace';
      const zOffset = (time / 100) % 20;
      ctx.fillText('Z', x + 24 + zOffset / 2, bodyY - 10 - zOffset);
      ctx.fillText('z', x + 20 + zOffset / 3, bodyY - 4 - zOffset / 1.5);
    } else if (isStunned) {
      const starAngle = time / 150;
      for (let i = 0; i < 3; i++) {
        const sx = x + 16 + Math.cos(starAngle + (i * Math.PI * 2) / 3) * 16;
        const sy = bodyY - 14 + Math.sin(starAngle + (i * Math.PI * 2) / 3) * 6;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(sx, sy, 4, 4);
      }
    }

    // 9. Health Bar Overhead
    const barW = 36;
    const barH = 5;
    const barX = x - 2;
    const barY = bodyY - (hat && hat.id !== 'hat_none' ? 18 : 12);

    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    const healthRatio = Math.max(0, Math.min(1, health / maxHealth));
    ctx.fillStyle = healthRatio > 0.5 ? '#22c55e' : healthRatio > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(barX, barY, barW * healthRatio, barH);

    ctx.restore();
  }

  // --- HATS & COSMETICS RENDERING ---

  private static drawHatOnBear(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    hat: CosmeticItem
  ) {
    if (!hat || hat.id === 'hat_none') return;

    if (hat.id === 'hat_straw') {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x + 2, y, 28, 5); // brim
      ctx.fillRect(x + 8, y - 6, 16, 6); // dome
      ctx.fillStyle = '#dc2626'; // red ribbon
      ctx.fillRect(x + 8, y - 1, 16, 2);
    } else if (hat.id === 'hat_crown') {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 6, y - 2, 20, 6);
      ctx.fillRect(x + 6, y - 8, 4, 6);
      ctx.fillRect(x + 14, y - 10, 4, 8);
      ctx.fillRect(x + 22, y - 8, 4, 6);
      ctx.fillStyle = '#ef4444'; // crown gem
      ctx.fillRect(x + 15, y - 6, 2, 2);
    } else if (hat.id === 'hat_bee') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 10, y - 8, 2, 8); // left antenna
      ctx.fillRect(x + 20, y - 8, 2, 8); // right antenna
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + 11, y - 10, 3, 0, Math.PI * 2);
      ctx.arc(x + 21, y - 10, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (hat.id === 'hat_chef') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 8, y - 2, 16, 4);
      ctx.fillRect(x + 6, y - 12, 20, 10);
    } else if (hat.id === 'hat_top') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 4, y, 24, 4); // brim
      ctx.fillRect(x + 8, y - 12, 16, 12); // cylinder
      ctx.fillStyle = '#ef4444'; // ribbon
      ctx.fillRect(x + 8, y - 2, 16, 2);
    } else if (hat.id === 'hat_flowers') {
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(x + 6, y + 1, 4, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + 14, y, 4, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 22, y + 1, 4, 4);
    } else {
      // Default icon badge
      ctx.font = '14px sans-serif';
      ctx.fillText(hat.icon, x + 8, y + 4);
    }
  }

  private static drawParticleTrail(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    trail: CosmeticItem,
    time: number
  ) {
    if (!trail || trail.id === 'trail_none') return;

    for (let i = 0; i < 4; i++) {
      const px = x + 16 - Math.cos(time / 200 + i) * 16;
      const py = y + 24 + Math.sin(time / 200 + i) * 6;

      ctx.fillStyle = trail.color;
      if (trail.id === 'trail_honey') {
        ctx.fillRect(px, py, 4, 4);
      } else if (trail.id === 'trail_sparkles') {
        ctx.fillRect(px, py, 3, 3);
        ctx.fillRect(px + 1, py - 2, 1, 5);
      } else if (trail.id === 'trail_leaves') {
        ctx.fillRect(px, py, 5, 3);
      } else {
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
