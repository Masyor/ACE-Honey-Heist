import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BearType, CosmeticItem, HiveObject, WordData } from '../types';
import { PixelArtRenderer } from '../utils/pixelArt';
import { sound } from '../utils/sound';

interface ForestCanvasProps {
  currentWord: WordData;
  depositedLetters: string[];
  currentBear: BearType;
  equippedHat?: CosmeticItem | null;
  equippedTrail?: CosmeticItem | null;
  equippedRoar?: CosmeticItem | null;
  equippedArmor?: CosmeticItem | null;
  onAllLettersDeposited: () => void;
  onUpdateDepositedLetters: (letters: string[]) => void;
  mobileMoveVector?: { x: number; y: number } | null;
  isSneaking: boolean;
  onToggleSneak: () => void;
  abilityCooldown: number;
  onActivateAbility: () => void;
  onOpenCaveMenu?: () => void;
  hibernateTriggerCount?: number;
  abilityTriggerCount?: number;
  bearHealth?: number;
  onUpdateHealth?: (health: number) => void;
}

interface BeeEntity {
  id: string;
  hiveId: string;
  x: number;
  y: number;
  state: 'patrol' | 'chase' | 'scared' | 'returning';
  homeX: number;
  homeY: number;
  patrolAngle: number;
  attackCooldown: number;
}

interface TreePosition {
  x: number;
  y: number;
  seed: number;
}

interface BushPosition {
  x: number;
  y: number;
}

export const ForestCanvas: React.FC<ForestCanvasProps> = ({
  currentWord,
  depositedLetters,
  currentBear,
  equippedHat,
  equippedTrail,
  equippedRoar,
  equippedArmor,
  onAllLettersDeposited,
  onUpdateDepositedLetters,
  mobileMoveVector,
  isSneaking,
  onToggleSneak,
  abilityCooldown,
  onActivateAbility,
  onOpenCaveMenu,
  hibernateTriggerCount,
  abilityTriggerCount,
  bearHealth: propBearHealth,
  onUpdateHealth
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasOpenedCaveMenuRef = useRef(false);

  // Map Dimensions
  const MAP_W = 1600;
  const MAP_H = 1200;

  // Viewport Dimensions
  const VIEWPORT_W = 800;
  const VIEWPORT_H = 600;

  const maxHealthCalculated = 100 + (equippedArmor?.healthBonus || 0);

  // Bear Player State
  const playerRef = useRef({
    x: 200,
    y: 200,
    dir: 'down' as 'up' | 'down' | 'left' | 'right',
    walkFrame: 0,
    health: propBearHealth !== undefined ? propBearHealth : maxHealthCalculated,
    maxHealth: maxHealthCalculated,
    stunTimer: 0,
    graceTimer: 0,
    hibernateTimer: 0,
    isRolling: false,
    isFrozenBees: false,
    isInvisible: false,
    isShielded: false,
    roarWaveRadius: 0,
    carriedLetters: [] as string[],
    lowHealthCommentTimer: 0,
    speechBubbleTimer: 0,
    activeSpeechBubble: null as string | null
  });

  // Handle Hibernate Trigger
  useEffect(() => {
    if (hibernateTriggerCount && hibernateTriggerCount > 0) {
      playerRef.current.hibernateTimer = 150; // 2.5 seconds sleep
      playerRef.current.health = playerRef.current.maxHealth;
      setBearHealth(playerRef.current.maxHealth);
      if (onUpdateHealth) onUpdateHealth(playerRef.current.maxHealth);
      sound.playLullaby();
      setStatusMessage('💤 Bear is hibernating safely in Bear Cave... Health fully restored!');
    }
  }, [hibernateTriggerCount, onUpdateHealth]);

  // Sync with incoming propBearHealth
  useEffect(() => {
    if (propBearHealth !== undefined) {
      setBearHealth(propBearHealth);
      playerRef.current.health = propBearHealth;
    }
  }, [propBearHealth]);

  // Keep player max health synced if armor changes
  useEffect(() => {
    playerRef.current.maxHealth = maxHealthCalculated;
    playerRef.current.health = Math.min(playerRef.current.health, maxHealthCalculated);
    setBearHealth(playerRef.current.health);
    if (onUpdateHealth) onUpdateHealth(playerRef.current.health);
  }, [maxHealthCalculated, onUpdateHealth]);

  // Camera State
  const cameraRef = useRef({ x: 0, y: 0 });

  // Map Objects State (Randomized ONLY per word round)
  const hivesRef = useRef<HiveObject[]>([]);
  const beesRef = useRef<BeeEntity[]>([]);
  const treesRef = useRef<TreePosition[]>([]);
  const bushesRef = useRef<BushPosition[]>([]);

  // UI State
  const [carriedLettersCount, setCarriedLettersCount] = useState(0);
  const [bearHealth, setBearHealth] = useState(maxHealthCalculated);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Explore the woods! Walk up to hives to gather letters.'
  );

  // Keys Pressed State
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Ability Active Effect Timers
  const abilityActiveTimerRef = useRef(0);

  // Helper: Pseudo-random generator for round layout
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Initialize & Randomize Map Objects ONLY when Word changes! (Not on letter deposit)
  useEffect(() => {
    const wordLetters = currentWord.word.split('');
    const roundSeed = currentWord.difficulty * 100 + wordLetters.length * 7 + currentWord.word.charCodeAt(0);

    // 1. Randomize Trees
    const newTrees: TreePosition[] = [];
    const numTrees = 32;
    for (let i = 0; i < numTrees; i++) {
      const tx = 100 + Math.floor(pseudoRandom(roundSeed + i * 3) * (MAP_W - 200));
      const ty = 100 + Math.floor(pseudoRandom(roundSeed + i * 3 + 1) * (MAP_H - 200));
      if (Math.hypot(tx - 120, ty - 100) > 180) {
        newTrees.push({ x: tx, y: ty, seed: i + 1 });
      }
    }
    treesRef.current = newTrees;

    // 2. Randomize Bushes
    const newBushes: BushPosition[] = [];
    const numBushes = 18;
    for (let i = 0; i < numBushes; i++) {
      const bx = 120 + Math.floor(pseudoRandom(roundSeed + i * 5 + 10) * (MAP_W - 240));
      const by = 120 + Math.floor(pseudoRandom(roundSeed + i * 5 + 11) * (MAP_H - 240));
      if (Math.hypot(bx - 120, by - 100) > 180) {
        newBushes.push({ x: bx, y: by });
      }
    }
    bushesRef.current = newBushes;

    // 3. Exactly 1 Hive per Letter in word
    const newHives: HiveObject[] = [];
    const newBees: BeeEntity[] = [];

    wordLetters.forEach((letter, idx) => {
      let hx = 400;
      let hy = 400;
      let attempts = 0;
      while (attempts < 50) {
        hx = 250 + Math.floor(pseudoRandom(roundSeed + idx * 13 + attempts) * (MAP_W - 500));
        hy = 250 + Math.floor(pseudoRandom(roundSeed + idx * 17 + attempts + 1) * (MAP_H - 500));
        const distToCave = Math.hypot(hx - 120, hy - 100);
        const tooCloseToOtherHive = newHives.some((h) => Math.hypot(h.x - hx, h.y - hy) < 180);

        if (distToCave > 280 && !tooCloseToOtherHive) break;
        attempts++;
      }

      const hiveId = `hive_${idx}_${letter}`;

      newHives.push({
        id: hiveId,
        x: hx,
        y: hy,
        letter,
        isHarvested: false,
        beeAlert: 0,
        beePatrolRadius: 50,
        beeAngle: idx * 1.5,
        beeSpeed: 0.02 + currentWord.difficulty * 0.002
      });

      // Spawn Active Bees per Hive that patrol and chase
      const beesForHiveCount = 2;
      for (let b = 0; b < beesForHiveCount; b++) {
        newBees.push({
          id: `bee_${hiveId}_${b}`,
          hiveId,
          x: hx + 16 + Math.cos((b * Math.PI * 2) / beesForHiveCount) * 40,
          y: hy + 10 + Math.sin((b * Math.PI * 2) / beesForHiveCount) * 40,
          state: 'patrol',
          homeX: hx + 16,
          homeY: hy + 10,
          patrolAngle: (b * Math.PI * 2) / beesForHiveCount,
          attackCooldown: 0
        });
      }
    });

    hivesRef.current = newHives;
    beesRef.current = newBees;

    // Reset Player spawn & inventory
    playerRef.current.x = 200;
    playerRef.current.y = 200;
    playerRef.current.health = maxHealthCalculated;
    playerRef.current.stunTimer = 0;
    playerRef.current.hibernateTimer = 0;
    playerRef.current.carriedLetters = [];
    setCarriedLettersCount(0);
    setBearHealth(maxHealthCalculated);
  }, [currentWord.id, currentWord.difficulty, currentWord.word, maxHealthCalculated]);

  // Ref to track last executed ability trigger count
  const lastProcessedTriggerRef = useRef(0);

  // Execute ability effects inside the canvas
  const execAbilityInCanvas = useCallback(() => {
    const player = playerRef.current;
    if (player.stunTimer > 0) return;

    sound.playAbilityWhoosh();

    if (currentBear.id === 'grizzly') {
      // MIGHTY ROAR
      player.roarWaveRadius = 10;
      beesRef.current.forEach((bee) => {
        const dist = Math.hypot(bee.x - player.x, bee.y - player.y);
        if (dist < 260) {
          bee.state = 'scared';
          bee.attackCooldown = 75; // ~1.2 seconds brief flee
        }
      });
      hivesRef.current.forEach((h) => (h.beeAlert = 0));
      setStatusMessage('📢 MIGHTY ROAR! Forced nearby bees to flee a short distance!');
    } else if (currentBear.id === 'panda') {
      // Bamboo Roll
      player.isRolling = true;
      abilityActiveTimerRef.current = 35; // ~0.6 seconds quick roll burst
      setStatusMessage('🎋 BAMBOO ROLL! Quick dodge roll past bees!');
    } else if (currentBear.id === 'polar') {
      // Frost Breath
      player.isFrozenBees = true;
      abilityActiveTimerRef.current = 300; // 5 seconds freeze
      setStatusMessage('❄️ FROST BREATH! Freezing all bee swarms in solid ice!');
    } else if (currentBear.id === 'koala') {
      // Stealth Sneak
      player.isInvisible = true;
      abilityActiveTimerRef.current = 300; // 5 seconds stealth sneak
      setStatusMessage('🌿 STEALTH SNEAK! Completely invisible to bees!');
    } else if (currentBear.id === 'sun') {
      // Honey Sense
      abilityActiveTimerRef.current = 600; // 10 seconds radar guide
      setStatusMessage('✨ HONEY SENSE! Golden radar paths to unharvested hives revealed!');
    } else if (currentBear.id === 'moon') {
      // Lunar Eclipse
      player.isShielded = true;
      abilityActiveTimerRef.current = 600; // 10 seconds duration
      setStatusMessage('🌙 LUNAR ECLIPSE! Shadow shield active! Blocks the next bee sting completely.');
    }
  }, [currentBear.id]);

  // Handle external ability triggers (e.g. MobileControls / HUD button clicks)
  useEffect(() => {
    if (abilityTriggerCount && abilityTriggerCount > lastProcessedTriggerRef.current) {
      lastProcessedTriggerRef.current = abilityTriggerCount;
      execAbilityInCanvas();
    }
  }, [abilityTriggerCount, execAbilityInCanvas]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        onActivateAbility();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onActivateAbility]);

  // Main Game Loop & Render
  useEffect(() => {
    let animId: number;
    let time = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      time += 16;
      const player = playerRef.current;

      // --- HANDLE STUN, GRACE & HIBERNATE TIMERS ---
      if (player.stunTimer > 0) {
        player.stunTimer -= 1;
        if (player.stunTimer <= 0) {
          player.health = Math.max(30, Math.floor(player.maxHealth * 0.4));
          player.graceTimer = 60; // 1 second (60 frames) grace period!
          setBearHealth(player.health);
          if (onUpdateHealth) onUpdateHealth(player.health);
          setStatusMessage('🛡️ Recovered! 1 second grace period active.');
        }
      }

      if (player.graceTimer > 0) {
        player.graceTimer -= 1;
      }

      if (player.hibernateTimer > 0) {
        player.hibernateTimer -= 1;
        player.health = player.maxHealth;
        setBearHealth(player.health);
        if (onUpdateHealth) onUpdateHealth(player.health);
        if (player.hibernateTimer <= 0) {
          setStatusMessage('💤 Bear finished hibernating! Health 100% restored.');
        }
      }

      // --- HANDLE ACTIVE ABILITY EFFECT TIMERS ---
      if (abilityActiveTimerRef.current > 0) {
        abilityActiveTimerRef.current -= 1;
        if (abilityActiveTimerRef.current <= 0) {
          player.isRolling = false;
          player.isFrozenBees = false;
          player.isInvisible = false;
          player.isShielded = false;
        }
      }

      // --- HANDLE ROAR SHOCKWAVE ANIMATION ---
      if (player.roarWaveRadius > 0) {
        player.roarWaveRadius += 16;
        if (player.roarWaveRadius > 500) {
          player.roarWaveRadius = 0;
        }
      }

      // --- HANDLE LOW HEALTH COMMENTS & SPEECH BUBBLE ---
      if (player.health > 0 && player.health <= player.maxHealth * 0.45 && player.stunTimer <= 0 && player.hibernateTimer <= 0) {
        player.lowHealthCommentTimer += 1;
        // Trigger a comment every 10 seconds (~600 frames)
        if (player.lowHealthCommentTimer % 600 === 120) {
          const napComments = [
            "Yawn... I really need a nap.",
            "I'm so weak... I need a nap in my cave!",
            "So tired... I should head to the cave to sleep.",
            "Ouch... a nap sounds so perfect right now.",
            "My health is low, I need to hibernate and rest!"
          ];
          const randomComment = napComments[Math.floor(Math.random() * napComments.length)];
          setStatusMessage(`🐻 ${randomComment}`);
          player.activeSpeechBubble = randomComment;
          player.speechBubbleTimer = 180; // 3 seconds visible
        }
      } else {
        // Reset comment timer when health is restored
        player.lowHealthCommentTimer = 0;
      }

      if (player.speechBubbleTimer > 0) {
        player.speechBubbleTimer -= 1;
        if (player.speechBubbleTimer <= 0) {
          player.activeSpeechBubble = null;
        }
      }

      // --- 1. PLAYER MOVEMENT & INPUTS ---
      if (player.stunTimer <= 0 && player.hibernateTimer <= 0) {
        let dx = 0;
        let dy = 0;

        // Joystick Input Vector
        if (mobileMoveVector) {
          dx = mobileMoveVector.x;
          dy = mobileMoveVector.y;
        } else {
          // Keyboard Input
          if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
          if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
          if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
          if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;
        }

        if (dx !== 0 || dy !== 0) {
          // Determine Direction facing
          if (Math.abs(dx) > Math.abs(dy)) {
            player.dir = dx > 0 ? 'right' : 'left';
          } else {
            player.dir = dy > 0 ? 'down' : 'up';
          }

          const speedMultiplier = player.isRolling ? currentBear.speed * 1.8 : currentBear.speed;
          const norm = Math.hypot(dx, dy) || 1;
          const moveX = (dx / (mobileMoveVector ? 1 : norm)) * speedMultiplier;
          const moveY = (dy / (mobileMoveVector ? 1 : norm)) * speedMultiplier;

          player.x += moveX;
          player.y += moveY;
          player.walkFrame += 1;

          // Clamp within Map boundaries
          player.x = Math.max(30, Math.min(MAP_W - 32, player.x));
          player.y = Math.max(30, Math.min(MAP_H - 32, player.y));

          if (Math.floor(player.walkFrame) % 15 === 0) {
            sound.playFootstep();
          }
        }
      }

      // --- 2. CAMERA FOLLOWING BEAR & PORTRAIT ZOOM ---
      const isPortraitMobile = typeof window !== 'undefined' && window.innerWidth < window.innerHeight && window.innerWidth < 768;
      const zoom = isPortraitMobile ? 2.0 : 1.5;
      const visibleVW = VIEWPORT_W / zoom;
      const visibleVH = VIEWPORT_H / zoom;

      const camX = Math.max(0, Math.min(MAP_W - visibleVW, player.x - visibleVW / 2));
      const camY = Math.max(0, Math.min(MAP_H - visibleVH, player.y - visibleVH / 2));
      cameraRef.current = { x: camX, y: camY };

      // --- 3. CHECK BUSH HIDING / CAMOUFLAGE ---
      let isHidingInBush = false;
      bushesRef.current.forEach((b) => {
        if (Math.hypot(player.x - (b.x + 20), player.y - (b.y + 20)) < 32) {
          isHidingInBush = true;
        }
      });

      // --- 4. AUTO TOUCH PICKUP OF LETTERS ---
      if (player.stunTimer <= 0) {
        hivesRef.current.forEach((hive) => {
          if (!hive.isHarvested) {
            const dist = Math.hypot(player.x - (hive.x + 16), player.y - (hive.y + 16));
            if (dist < 48) {
              hive.isHarvested = true;
              player.carriedLetters.push(hive.letter);
              setCarriedLettersCount(player.carriedLetters.length);
              sound.playHoneycombPickup();
              setStatusMessage(
                `🐝 Harvested letter '${hive.letter}'! Backpack holds ${player.carriedLetters.length} letter(s). Return to Bear Cave!`
              );
            }
          }
        });
      }

      // --- 5. AUTOMATIC BEAR CAVE INTERACTION ---
      const caveX = 120;
      const caveY = 100;
      const distToCave = Math.hypot(player.x - caveX, player.y - caveY);

      // A. Close Proximity Auto Deposit Letters (distToCave < 140)
      if (distToCave < 140 && player.stunTimer <= 0) {
        if (player.carriedLetters.length > 0) {
          sound.playDepositLetter();
          const newDeposited = [...depositedLetters, ...player.carriedLetters];
          onUpdateDepositedLetters(newDeposited);

          setStatusMessage(`🍯 Deposited ${player.carriedLetters.length} letter honeycomb(s) in Bear Cave!`);
          player.carriedLetters = [];
          setCarriedLettersCount(0);

          if (newDeposited.length >= currentWord.word.length) {
            sound.playWordCorrect();
            setTimeout(() => {
              onAllLettersDeposited();
            }, 500);
          }
        }
      }

      // B. Step on or near Cave Doorway Entrance (cave archway and welcome mat)
      const distToEntrance = Math.hypot(player.x + 16 - 130, player.y + 16 - 150);
      const isTouchingDoor =
        distToEntrance < 45 ||
        (player.x >= 90 &&
          player.x <= 170 &&
          player.y >= 105 &&
          player.y <= 165);

      if (isTouchingDoor && player.stunTimer <= 0) {
        if (!hasOpenedCaveMenuRef.current) {
          hasOpenedCaveMenuRef.current = true;
          if (onOpenCaveMenu) {
            onOpenCaveMenu();
          }
        }
      } else if (!isTouchingDoor && Math.hypot(player.x - 130, player.y - 145) >= 80) {
        hasOpenedCaveMenuRef.current = false;
      }

      // --- 6. BEES AI & AGGRO CALCULATIONS ---
      const carriedCount = player.carriedLetters.length;
      let baseAggroRadius = 140 + carriedCount * 45;

      // Moving slowly or sneaking reduces detection radius significantly (by 65%)
      const isMovingSlowly = isSneaking || (mobileMoveVector && Math.hypot(mobileMoveVector.x, mobileMoveVector.y) < 0.5);
      if (isMovingSlowly) {
        baseAggroRadius *= 0.35;
      }

      if (isHidingInBush || player.isInvisible || player.graceTimer > 0) baseAggroRadius = 0;

      const maxChaseDist = 280 + carriedCount * 70;

      beesRef.current.forEach((bee) => {
        if (bee.attackCooldown > 0) bee.attackCooldown -= 1;
        if (player.isFrozenBees) return;

        const distToPlayer = Math.hypot(player.x - bee.x, player.y - bee.y);
        const distToHome = Math.hypot(bee.x - bee.homeX, bee.y - bee.homeY);

        if (bee.state === 'scared') {
          // Flee directly away from player
          const angle = Math.atan2(bee.y - player.y, bee.x - player.x);
          bee.x += Math.cos(angle) * 3.5;
          bee.y += Math.sin(angle) * 3.5;
          if (bee.attackCooldown <= 0) bee.state = 'returning';
        } else if (bee.state === 'chase') {
          if (
            distToHome > maxChaseDist ||
            isHidingInBush ||
            player.isInvisible ||
            player.stunTimer > 0 ||
            player.graceTimer > 0 ||
            player.isRolling
          ) {
            bee.state = 'returning';
          } else {
            const angle = Math.atan2(player.y - bee.y, player.x - bee.x);
            bee.x += Math.cos(angle) * (2.2 + currentWord.difficulty * 0.1);
            bee.y += Math.sin(angle) * (2.2 + currentWord.difficulty * 0.1);

            // Sting Attack
            if (
              distToPlayer < 18 &&
              bee.attackCooldown <= 0 &&
              player.stunTimer <= 0 &&
              player.graceTimer <= 0 &&
              !player.isRolling &&
              player.hibernateTimer <= 0
            ) {
              bee.attackCooldown = 40;
              if (player.isShielded) {
                player.isShielded = false;
                player.graceTimer = 60; // 1 second grace period
                setStatusMessage('🛡️ LUNAR ECLIPSE BLOCKED! The shadow shield absorbed the bee sting completely!');
                sound.playTileClick();
              } else {
                player.health = Math.max(0, player.health - 20);
                setBearHealth(player.health);
                if (onUpdateHealth) onUpdateHealth(player.health);
                sound.playStungSFX();

                if (player.health <= 0) {
                  // Drop carried letters back to hives on 0 HP
                  if (player.carriedLetters.length > 0) {
                    hivesRef.current.forEach((h) => {
                      if (player.carriedLetters.includes(h.letter)) {
                        h.isHarvested = false;
                      }
                    });
                    player.carriedLetters = [];
                    setCarriedLettersCount(0);
                    setStatusMessage('💫 STUNNED! Bees stung you to 0 HP and returned letters to hives!');
                  } else {
                    setStatusMessage('💫 STUNNED! Bees knocked you out for 3 seconds!');
                  }

                  player.stunTimer = 180;
                  beesRef.current.forEach((b) => (b.state = 'returning'));
                } else {
                  player.graceTimer = 120; // 2-second immunity cooldown between bee stings!
                  setStatusMessage(`💥 OUCH! A bee stung you! Immunity active! Health: ${player.health}/${player.maxHealth} HP`);
                }
              }

              bee.x -= Math.cos(angle) * 20;
              bee.y -= Math.sin(angle) * 20;
            }
          }
        } else if (bee.state === 'returning') {
          const angle = Math.atan2(bee.homeY - bee.y, bee.homeX - bee.x);
          bee.x += Math.cos(angle) * 2.0;
          bee.y += Math.sin(angle) * 2.0;
          if (distToHome < 10) bee.state = 'patrol';
        } else {
          // Patrol
          bee.patrolAngle += 0.03;
          bee.x = bee.homeX + Math.cos(bee.patrolAngle) * 40;
          bee.y = bee.homeY + Math.sin(bee.patrolAngle) * 40;

          if (distToPlayer < baseAggroRadius && player.stunTimer <= 0 && player.graceTimer <= 0 && !player.isRolling) {
            bee.state = 'chase';
            sound.playAlertWarning(80);
          }
        }
      });

      // --- 7. RENDER WORLD (CAMERA TRANSLATED & DEPTH SORTED) ---
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(-camX, -camY);

      // A. Ground Tiles
      const startTileX = Math.floor(camX / PixelArtRenderer.TILE) * PixelArtRenderer.TILE;
      const startTileY = Math.floor(camY / PixelArtRenderer.TILE) * PixelArtRenderer.TILE;
      const endTileX = startTileX + visibleVW + PixelArtRenderer.TILE * 2;
      const endTileY = startTileY + visibleVH + PixelArtRenderer.TILE * 2;

      for (let x = startTileX; x < endTileX && x < MAP_W; x += PixelArtRenderer.TILE) {
        for (let y = startTileY; y < endTileY && y < MAP_H; y += PixelArtRenderer.TILE) {
          const seed = (x / 32) * 99 + y / 32;

          if (x < 64) {
            PixelArtRenderer.drawWaterStream(ctx, x, y, time);
          } else {
            PixelArtRenderer.drawGrassTile(ctx, x, y, seed);
          }
        }
      }

      // B. BUILD DEPTH-SORTED RENDER QUEUE (Y-AXIS SORTING)
      // Entities higher up on Y axis render behind entities lower down!
      type RenderQueueItem = { y: number; render: () => void };
      const renderQueue: RenderQueueItem[] = [];

      // 1. Bear Cave
      renderQueue.push({
        y: 100 + 40,
        render: () => PixelArtRenderer.drawBearCave(ctx, 100, 100, depositedLetters.length)
      });

      // 2. Bushes
      bushesRef.current.forEach((b) => {
        const isPlayerInThisBush = Math.hypot(player.x - (b.x + 20), player.y - (b.y + 20)) < 45;
        // If player is hiding in this bush, push bush depth down so it renders ON TOP of the player!
        const bushSortY = isPlayerInThisBush ? player.y + 100 : b.y + 24;

        renderQueue.push({
          y: bushSortY,
          render: () => PixelArtRenderer.drawBush(ctx, b.x, b.y)
        });
      });

      // 3. Trees
      treesRef.current.forEach((t) => {
        renderQueue.push({
          y: t.y + 60,
          render: () => PixelArtRenderer.drawTree(ctx, t.x, t.y, t.seed)
        });
      });

      // 4. Hives & Honey Sense Guidance
      hivesRef.current.forEach((hive) => {
        renderQueue.push({
          y: hive.y + 24,
          render: () => {
            PixelArtRenderer.drawHive(ctx, hive, time);

            // Honey Sense Radar Lines
            if (currentBear.id === 'sun' && !hive.isHarvested && abilityActiveTimerRef.current > 0) {
              ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
              ctx.lineWidth = 2;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(player.x + 16, player.y + 16);
              ctx.lineTo(hive.x + 16, hive.y + 16);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        });
      });

      // 5. Player Bear
      renderQueue.push({
        y: player.y + 24,
        render: () => {
          if (player.graceTimer > 0) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 2]);
            ctx.beginPath();
            ctx.arc(player.x + 16, player.y + 16, 26, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (player.isShielded) {
            ctx.strokeStyle = '#c084fc'; // elegant light purple lunar shield outline
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(player.x + 16, player.y + 16, 22, 0, Math.PI * 2);
            ctx.stroke();
          }

          const isSemiInvisible = currentBear.id === 'koala' && player.isInvisible;
          if (isSemiInvisible) {
            ctx.save();
            ctx.globalAlpha = 0.45; // beautiful semi-transparency
          }

          PixelArtRenderer.drawBear(
            ctx,
            player.x,
            player.y,
            currentBear,
            player.dir,
            isSneaking || isHidingInBush,
            player.isRolling,
            player.walkFrame,
            equippedHat,
            equippedTrail,
            time,
            player.health,
            player.maxHealth,
            player.stunTimer > 0,
            equippedArmor,
            player.hibernateTimer > 0
          );

          if (isSemiInvisible) {
            ctx.restore();
          }

          if (player.activeSpeechBubble) {
            ctx.save();
            ctx.font = 'bold 9px sans-serif';
            const textWidth = ctx.measureText(player.activeSpeechBubble).width;
            const paddingX = 6;
            const paddingY = 4;
            const rectW = textWidth + paddingX * 2;
            const rectH = 14;
            const bubbleX = player.x + 16;
            const bubbleY = player.y - 10;
            const rx = bubbleX - rectW / 2;
            const ry = bubbleY - rectH;

            // Draw bubble background
            ctx.fillStyle = '#fef3c7'; // warm amber-50
            ctx.strokeStyle = '#78350f'; // amber-900
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(rx, ry, rectW, rectH, 4);
            } else {
              ctx.rect(rx, ry, rectW, rectH);
            }
            ctx.fill();
            ctx.stroke();

            // Draw little triangle pointer pointing down
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.moveTo(bubbleX - 4, ry + rectH);
            ctx.lineTo(bubbleX, ry + rectH + 4);
            ctx.lineTo(bubbleX + 4, ry + rectH);
            ctx.closePath();
            ctx.fill();

            // Outlines for triangle
            ctx.beginPath();
            ctx.moveTo(bubbleX - 4, ry + rectH);
            ctx.lineTo(bubbleX, ry + rectH + 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(bubbleX + 4, ry + rectH);
            ctx.lineTo(bubbleX, ry + rectH + 4);
            ctx.stroke();

            // Text
            ctx.fillStyle = '#78350f';
            ctx.textAlign = 'center';
            ctx.fillText(player.activeSpeechBubble, bubbleX, ry + 10);
            ctx.restore();
          }
        }
      });

      // 6. Trailing Letters
      player.carriedLetters.forEach((letter, i) => {
        const trailX = player.x - Math.cos(time / 200 + i) * (20 + i * 16);
        const trailY = player.y - 10 - Math.sin(time / 200 + i) * 8;

        renderQueue.push({
          y: player.y + 20,
          render: () => {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(trailX, trailY, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(letter, trailX, trailY + 4);
            ctx.textAlign = 'left';
          }
        });
      });

      // SORT RENDER QUEUE BY ASCENDING Y-COORDINATE
      renderQueue.sort((a, b) => a.y - b.y);

      // EXECUTE ALL RENDERS IN SORTED ORDER
      renderQueue.forEach((item) => item.render());

      // C. OVERLAY EFFECTS (Roar Shockwave & Bees)
      if (player.roarWaveRadius > 0) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(player.x + 16, player.y + 16, player.roarWaveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Bees
      beesRef.current.forEach((bee) => {
        if (player.isFrozenBees) {
          // Draw icy frozen cube block around frozen bee
          ctx.fillStyle = 'rgba(165, 243, 252, 0.85)'; // Frost ice blue
          ctx.fillRect(bee.x - 9, bee.y - 9, 18, 18);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bee.x - 9, bee.y - 9, 18, 18);

          // Snowflake icon
          ctx.fillStyle = '#0284c7';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('❄️', bee.x, bee.y + 4);
          ctx.textAlign = 'left';
        } else {
          ctx.fillStyle = bee.state === 'chase' ? '#ef4444' : bee.state === 'scared' ? '#38bdf8' : '#f59e0b';
          ctx.fillRect(bee.x - 3, bee.y - 3, 6, 5);
          ctx.fillStyle = '#000';
          ctx.fillRect(bee.x - 1, bee.y - 3, 2, 5);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          const wingY = Math.sin(time / 30) > 0 ? -5 : -2;
          ctx.fillRect(bee.x - 2, bee.y + wingY, 4, 2);
        }
      });

      // D. Stealth Indicator
      if (isHidingInBush) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('🌿 CAMOUFLAGED', player.x - 25, player.y - 18);
      }

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    currentBear,
    depositedLetters,
    equippedArmor,
    equippedHat,
    equippedTrail,
    isSneaking,
    mobileMoveVector,
    onUpdateHealth
  ]);

  return (
    <div className="relative w-full max-w-[720px] aspect-[4/3] mx-auto flex flex-col items-center justify-center select-none">
      {/* Main Game Canvas */}
      <div className="relative w-full h-full bg-amber-950 border-2 sm:border-4 border-amber-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={VIEWPORT_W}
          height={VIEWPORT_H}
          style={{ imageRendering: 'pixelated' }}
          className="w-full h-full object-contain cursor-pointer"
        />
      </div>
    </div>
  );
};
