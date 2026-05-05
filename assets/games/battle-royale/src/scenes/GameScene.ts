import { Container, Graphics, Text } from 'pixi.js';

import { Player } from '../entities/Player';
import type { PlayerState } from '../entities/Player';
import type { InputController } from '../runtime/InputController';
import { hasPlayerWon, resolveEnemyContactDamage, resolveEnemyMovement, resolveEnemyRangedDamage, resolveHitscanShot, resolvePickups } from '../systems/CombatSystem';
import type { EnemyState, PickupState } from '../systems/CombatSystem';
import { Raycaster } from '../systems/Raycaster';
import { clamp } from '../utils/math';
import { WORLD_MAP } from './worldMap';

const FIELD_OF_VIEW = Math.PI / 3;
const MAX_RAYS = 180;
const MINIMAP_SCALE = 18;
const ENEMY_COLOR = 0xff6b6b;

const INITIAL_ENEMIES: EnemyState[] = [
  { id: 'e1', x: 4.5, y: 2.5, health: 100, radius: 0.35, isAlive: true },
  { id: 'e2', x: 8.5, y: 5.5, health: 100, radius: 0.35, isAlive: true },
  { id: 'e3', x: 9.5, y: 9.5, health: 100, radius: 0.35, isAlive: true },
];

const INITIAL_PICKUPS: PickupState[] = [
  { id: 'ammo1', x: 6.5, y: 3.5, type: 'ammo', amount: 5 },
  { id: 'health1', x: 3.5, y: 7.5, type: 'health', amount: 30 },
];

const PLAYER_SPAWN = { x: 2.5, y: 1.5, angle: 0.46 } as const;

export interface EnemyProjection {
  projectedX: number;
  markerHeight: number;
  markerWidth: number;
  top: number;
  alpha: number;
  distance: number;
  aimProximity: number;
  threat: number;
}

export interface CombatFeedbackState {
  recoilOffset: number;
  recoilKick: number;
  muzzleFlashAlpha: number;
  damageVignetteAlpha: number;
  hitConfirmAlpha: number;
}

export interface WeaponBobState {
  x: number;
  y: number;
  sway: number;
}

export interface EnemyDeathBurstState {
  ringAlpha: number;
  shockwaveRadius: number;
  verticalScatter: number;
}

export interface EnemyDeathImpactState {
  shockRadius: number;
  shockAlpha: number;
  verticalSmear: number;
  fragmentSpread: number;
}

export interface LowHealthDangerState {
  vignetteAlpha: number;
  heartbeatAlpha: number;
  hudPulse: number;
}

export interface HudDangerPresentationState {
  frameAlpha: number;
  scanlineAlpha: number;
  jitter: number;
  warningText: string;
}

export interface DamageDirectionState {
  alpha: number;
  scale: number;
  strokeAlpha: number;
}

export interface WeaponPresentationState {
  centerX: number;
  baseY: number;
  bodyTopY: number;
  slideTopY: number;
  muzzleY: number;
  baseLeft: number;
  baseRight: number;
  bodyHalfWidth: number;
  barrelHalfWidth: number;
  screenWidth: number;
  screenHeight: number;
  gripInset: number;
}

export interface EnemyIdleMotionState {
  verticalOffset: number;
  swayOffset: number;
  glowPulse: number;
}

export interface WeaponFiringState {
  slideOffset: number;
  muzzleBloomAlpha: number;
  barrelScale: number;
}

export interface EnemySilhouetteState {
  shoulderScale: number;
  waistInset: number;
  headGlowAlpha: number;
  warningAlpha: number;
}

export interface WeaponMotionBlendState {
  bodyLag: number;
  slideTravel: number;
  sightDrift: number;
  casingGlow: number;
}

export interface CrosshairFeedbackState {
  coreRadius: number;
  confirmAlpha: number;
  spikeLength: number;
  killRingRadius: number;
  killRingAlpha: number;
}

export interface EnemyLockPressureState {
  ringAlpha: number;
  bracketAlpha: number;
  pulseRadius: number;
  hudStress: number;
}

export interface EnemyPoseState {
  lift: number;
  twist: number;
  collapse: number;
  headDrop: number;
  armYaw: number;
}

export interface WeaponDepthState {
  rearOffset: number;
  midOffset: number;
  frontOffset: number;
  frontScale: number;
  shadowSpread: number;
}

export interface RecoilRecoveryState {
  returnSpeed: number;
  settleAlpha: number;
  residualKick: number;
}

export interface HudSegment {
  title: string;
  primary: string;
  secondary: string;
  accent: string;
  emphasis: 'stable' | 'warning' | 'critical';
}

export interface HudSegmentSet {
  left: HudSegment;
  center: HudSegment;
  right: HudSegment;
}

export interface HudLineInput {
  health: number;
  ammo: number;
  livingEnemies: number;
  shotMessage: string;
  hasWon: boolean;
  isAlive: boolean;
  pointerLocked: boolean;
}

export type DamageDirection = 'front' | 'right' | 'back' | 'left';

export function advanceFeedbackPulse(value: number, deltaSeconds: number, decayPerSecond: number): number {
  return Math.max(0, value - deltaSeconds * decayPerSecond);
}

export function getCombatFeedbackState(
  hitFlash: number,
  lastShotPower: number,
  lastDamagePulse: number,
): CombatFeedbackState {
  return {
    recoilOffset: lastShotPower * 28,
    recoilKick: lastShotPower * 14,
    muzzleFlashAlpha: clamp(lastShotPower * 1.25, 0, 0.92),
    damageVignetteAlpha: clamp(lastDamagePulse * 0.42, 0, 0.42),
    hitConfirmAlpha: clamp((hitFlash - 0.45) / 0.55, 0, 1),
  };
}

export function getWeaponBobState(movementIntensity: number, elapsedSeconds: number): WeaponBobState {
  if (movementIntensity <= 0) {
    return { x: 0, y: 0, sway: 0 };
  }

  const cycle = elapsedSeconds * 7.5;

  return {
    x: Math.sin(cycle) * 2.8 * movementIntensity,
    y: Math.abs(Math.cos(cycle * 0.9)) * 3.6 * movementIntensity,
    sway: Math.sin(cycle * 0.55) * 0.035 * movementIntensity,
  };
}

export function getEnemyHitFlashAlpha(hitPulse: number): number {
  return clamp(hitPulse * 0.9, 0, 0.9);
}

export function getKillConfirmAlpha(killPulse: number): number {
  return clamp(killPulse * 1.05, 0, 1);
}

export function getEnemyDeathBurstState(deathPulse: number): EnemyDeathBurstState {
  return {
    ringAlpha: clamp(deathPulse * 0.82, 0, 0.82),
    shockwaveRadius: 28 + deathPulse * 30,
    verticalScatter: deathPulse * 16,
  };
}

export function getEnemyDeathImpactState(deathPulse: number, threat: number): EnemyDeathImpactState {
  const death = clamp(deathPulse, 0, 1);
  const danger = clamp(threat, 0, 1);

  return {
    shockRadius: 34 + death * 26 + danger * 6,
    shockAlpha: clamp(death * (0.74 + danger * 0.1), 0, 0.9),
    verticalSmear: death * 18 + danger * 5.5,
    fragmentSpread: 10 + death * 18 + danger * 7.5,
  };
}

export function getLowHealthDangerState(health: number, elapsedSeconds: number): LowHealthDangerState {
  const danger = clamp((35 - health) / 20, 0, 1);
  if (danger <= 0) {
    return {
      vignetteAlpha: 0,
      heartbeatAlpha: 0,
      hudPulse: 0,
    };
  }

  const heartbeat = (Math.sin(elapsedSeconds * 7.5) + 1) * 0.5;

  return {
    vignetteAlpha: clamp(0.16 + danger * 0.24, 0, 0.4),
    heartbeatAlpha: clamp(0.12 + danger * 0.28 + heartbeat * 0.16, 0, 0.7),
    hudPulse: clamp(danger * (0.1 + heartbeat * 0.16), 0, 0.32),
  };
}

export function getHudDangerPresentationState(
  health: number,
  elapsedSeconds: number,
  pointerLocked: boolean,
): HudDangerPresentationState {
  const danger = getLowHealthDangerState(health, elapsedSeconds);
  const lockBias = pointerLocked ? 0.08 : 0;

  return {
    frameAlpha: clamp(0.1 + danger.vignetteAlpha * 0.75 + lockBias, 0.08, 0.46),
    scanlineAlpha: clamp(0.03 + danger.heartbeatAlpha * 0.16, 0.03, 0.16),
    jitter: clamp(danger.hudPulse * 4.2, 0, 1.2),
    warningText: health <= 20 ? 'CRITICAL CONDITION' : health <= 40 ? 'PRESSURE RISING' : 'SYSTEM STABLE',
  };
}

export function getCrosshairFeedbackState(
  hitFlash: number,
  hitConfirmAlpha: number,
  killPulse: number,
  aimProximity: number,
): CrosshairFeedbackState {
  const hit = clamp(hitConfirmAlpha, 0, 1);
  const flash = clamp(hitFlash, 0, 1);
  const kill = clamp(killPulse, 0, 1);
  const aim = clamp(aimProximity, 0, 1);

  return {
    coreRadius: 8 + flash * 3 + hit * 3,
    confirmAlpha: clamp(hit * 0.74 + flash * 0.16, 0, 0.9),
    spikeLength: 18 + hit * 8 + aim * 5,
    killRingRadius: 22 + kill * 18 + hit * 2,
    killRingAlpha: clamp(kill * 0.82 + hit * 0.08, 0, 0.9),
  };
}

export function getEnemyLockPressureState(
  aimProximity: number,
  threat: number,
  distanceRatio: number,
): EnemyLockPressureState {
  const aim = clamp(aimProximity, 0, 1);
  const danger = clamp(threat, 0, 1);
  const distance = clamp(distanceRatio, 0, 1);
  const closeness = 1 - distance;
  const pressure = aim * 0.56 + danger * 0.28 + closeness * 0.16;

  return {
    ringAlpha: clamp(pressure * 0.72, 0, 0.82),
    bracketAlpha: clamp(aim * 0.24 + danger * 0.18 + closeness * 0.12, 0, 0.72),
    pulseRadius: 42 - aim * 10 - danger * 6 - closeness * 8,
    hudStress: clamp(pressure * 0.9 + closeness * 0.08, 0, 1),
  };
}

export function getRecoilRecoveryState(shotPower: number): RecoilRecoveryState {
  const shot = clamp(shotPower, 0, 1);

  return {
    returnSpeed: shot * (1.25 + shot * 0.75),
    settleAlpha: clamp(shot * (0.68 + shot * 0.22), 0, 0.9),
    residualKick: clamp(shot * (1.05 + (1 - shot) * 0.3), 0, 1.1),
  };
}

export function getDamageDirectionState(direction: DamageDirection, pulse: number): DamageDirectionState {
  if (pulse <= 0) {
    return {
      alpha: 0,
      scale: 1,
      strokeAlpha: 0,
    };
  }

  const emphasis = direction === 'front' || direction === 'back' ? 1 : 0.92;
  const scaleBias = direction === 'front' || direction === 'back' ? 0.02 : 0;

  return {
    alpha: clamp((0.2 + pulse * 0.34) * emphasis, 0, 0.58),
    scale: 1 + pulse * 0.12 + scaleBias,
    strokeAlpha: clamp((0.18 + pulse * 0.24) * emphasis, 0, 0.46),
  };
}

export function getWeaponPresentationState(
  width: number,
  height: number,
  bob: Pick<WeaponBobState, 'x' | 'y' | 'sway'>,
  recoilOffset: number,
): WeaponPresentationState {
  const centerX = width * 0.5 + bob.x;
  const baseY = height - 16 + bob.y;
  const bodyHalfWidth = clamp(width * 0.082, 68, 112);
  const bodyTopY = height - 86 + recoilOffset * 0.42 + bob.y;
  const slideTopY = height - 132 + recoilOffset * 0.58 + bob.y;
  const barrelHalfWidth = bodyHalfWidth * 0.22;
  const screenWidth = bodyHalfWidth * 0.34;
  const screenHeight = 24;
  const gripInset = bodyHalfWidth * 0.44;

  return {
    centerX,
    baseY,
    bodyTopY,
    slideTopY,
    muzzleY: slideTopY - 24,
    baseLeft: centerX - bodyHalfWidth,
    baseRight: centerX + bodyHalfWidth,
    bodyHalfWidth,
    barrelHalfWidth,
    screenWidth,
    screenHeight,
    gripInset,
  };
}

export function getEnemyIdleMotionState(elapsedSeconds: number, hitPulse: number): EnemyIdleMotionState {
  const settle = 1 - clamp(hitPulse, 0, 1);
  const cycle = elapsedSeconds * 5.4;

  return {
    verticalOffset: Math.sin(cycle) * 2.3 - hitPulse * 4.2,
    swayOffset: Math.sin(cycle * 0.7) * 3.2 * settle,
    glowPulse: 1.02 + Math.sin(cycle * 1.15) * 0.09 * settle,
  };
}

export function getWeaponFiringState(shotPower: number, muzzleFlashAlpha: number): WeaponFiringState {
  const power = clamp(shotPower, 0, 1);

  return {
    slideOffset: power * 14,
    muzzleBloomAlpha: clamp(muzzleFlashAlpha * (0.8 + power * 0.32), 0, 1),
    barrelScale: 1 + power * 0.12,
  };
}

export function getEnemySilhouetteState(
  aimProximity: number,
  threat: number,
  hitPulse: number,
): EnemySilhouetteState {
  const centerBias = clamp(aimProximity, 0, 1);
  const danger = clamp(threat, 0, 1);
  const impact = clamp(hitPulse, 0, 1);

  return {
    shoulderScale: 1 + centerBias * 0.12 + danger * 0.08 + impact * 0.04,
    waistInset: 0.24 - centerBias * 0.05 - danger * 0.04 + impact * 0.015,
    headGlowAlpha: clamp(0.08 + centerBias * 0.18 + danger * 0.16 + impact * 0.12, 0, 0.62),
    warningAlpha: clamp(danger * 0.24 + centerBias * 0.08 + impact * 0.18, 0, 0.72),
  };
}

export function getWeaponMotionBlendState(movementIntensity: number, firingPower: number): WeaponMotionBlendState {
  const move = clamp(movementIntensity, 0, 1);
  const fire = clamp(firingPower, 0, 1);

  return {
    bodyLag: move * 3.4 + fire * 1.1,
    slideTravel: fire * (9 + move * 3.5),
    sightDrift: move * 0.018 - fire * 0.006,
    casingGlow: clamp(fire * 0.22 + move * 0.08, 0, 0.45),
  };
}

export function getEnemyPoseState(hitPulse: number, deathPulse: number, threat: number): EnemyPoseState {
  const hit = clamp(hitPulse, 0, 1);
  const death = clamp(deathPulse, 0, 1);
  const danger = clamp(threat, 0, 1);

  return {
    lift: hit * 10 + danger * 1.5 - death * 4,
    twist: hit * 0.18 + danger * 0.04 + death * 0.06,
    collapse: death * 0.82,
    headDrop: hit * 4 + death * 16,
    armYaw: 1 + hit * 0.16 - death * 0.44,
  };
}

export function getWeaponDepthState(movementIntensity: number, firingPower: number): WeaponDepthState {
  const move = clamp(movementIntensity, 0, 1);
  const fire = clamp(firingPower, 0, 1);

  return {
    rearOffset: fire * 1.8,
    midOffset: fire * 4.4 + move * 0.9,
    frontOffset: fire * 8.6 + move * 1.8,
    frontScale: 1 + fire * 0.08,
    shadowSpread: 10 + move * 8 + fire * 7,
  };
}

export function buildHudSegments({
  health,
  ammo,
  livingEnemies,
  shotMessage,
  hasWon,
  isAlive,
  pointerLocked,
}: HudLineInput): HudSegmentSet {
  const emphasis: HudSegment['emphasis'] = hasWon ? 'stable' : health <= 30 ? 'critical' : health <= 60 ? 'warning' : 'stable';
  const controlPrimary = hasWon
    ? 'PRESS FIRE TO REDEPLOY'
    : isAlive
      ? pointerLocked
        ? 'MOUSE TO AIM // WASD TO STRAFE'
        : 'CLICK TO LOCK // WASD TO MOVE'
      : 'PRESS FIRE TO REDEPLOY';
  const controlSecondary = hasWon
    ? 'SECTOR CLEARED'
    : isAlive
      ? pointerLocked
        ? 'SPACE TO FIRE // ESC TO BREAK LOCK'
        : 'MOUSE TO AIM // SPACE TO FIRE'
      : 'ELIMINATED';

  return {
    left: {
      title: 'STATUS',
      primary: `HEALTH ${health.toFixed(0)}`,
      secondary: `AMMO ${ammo}`,
      accent: health <= 30 ? 'CRITICAL CONDITION' : health <= 60 ? 'ARMOR SHAKING' : 'COMBAT READY',
      emphasis,
    },
    center: {
      title: 'ENGAGEMENT',
      primary: `HOSTILES ${livingEnemies}`,
      secondary: hasWon ? 'KILLBOX SILENT' : isAlive ? 'THREAT VECTOR ACTIVE' : 'LIFE SIGNS LOST',
      accent: shotMessage,
      emphasis: hasWon ? 'stable' : livingEnemies > 2 ? 'warning' : 'stable',
    },
    right: {
      title: 'CONTROL',
      primary: controlPrimary,
      secondary: controlSecondary,
      accent: pointerLocked ? 'LOCKED IN' : 'LOCK REQUIRED',
      emphasis: pointerLocked ? 'stable' : 'warning',
    },
  };
}

export function buildHudLines({
  health,
  ammo,
  livingEnemies,
  shotMessage,
  hasWon,
  isAlive,
  pointerLocked,
}: HudLineInput): string[] {
  const segments = buildHudSegments({
    health,
    ammo,
    livingEnemies,
    shotMessage,
    hasWon,
    isAlive,
    pointerLocked,
  });
  const statusLine = `${segments.left.title} // ${segments.left.primary}   //   ${segments.left.secondary}`;
  const combatLine = `${segments.center.title} // ${segments.center.primary}   //   ${segments.center.accent}`;
  const guidanceLine = `${segments.right.title} // ${segments.right.primary} // ${segments.right.secondary}`;

  return [statusLine, combatLine, guidanceLine];
}

export function getDamageDirectionIndicator(relativeAngle: number): DamageDirection {
  const normalized = ((relativeAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const shifted = normalized > Math.PI ? normalized - Math.PI * 2 : normalized;

  if (shifted >= -Math.PI / 4 && shifted < Math.PI / 4) {
    return 'front';
  }

  if (shifted >= Math.PI / 4 && shifted < (3 * Math.PI) / 4) {
    return 'right';
  }

  if (shifted >= -(3 * Math.PI) / 4 && shifted < -Math.PI / 4) {
    return 'left';
  }

  return 'back';
}

export function getRelativeAngleToPoint(
  player: Pick<PlayerState, 'x' | 'y' | 'angle'>,
  targetX: number,
  targetY: number,
): number {
  const angleToTarget = Math.atan2(targetY - player.y, targetX - player.x);
  let relativeAngle = angleToTarget - player.angle;

  while (relativeAngle > Math.PI) {
    relativeAngle -= Math.PI * 2;
  }

  while (relativeAngle < -Math.PI) {
    relativeAngle += Math.PI * 2;
  }

  return relativeAngle;
}

export function projectEnemyMarker(
  enemy: Pick<EnemyState, 'x' | 'y'>,
  player: Pick<PlayerState, 'x' | 'y' | 'angle'>,
  width: number,
  horizon: number,
  height: number,
): EnemyProjection | null {
  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  const distance = Math.hypot(dx, dy);
  const relativeAngle = getRelativeAngleToPoint(player, enemy.x, enemy.y);

  if (Math.abs(relativeAngle) > FIELD_OF_VIEW * 0.5) {
    return null;
  }

  const projectedX = ((relativeAngle + FIELD_OF_VIEW * 0.5) / FIELD_OF_VIEW) * width;
  const markerHeight = clamp(320 / Math.max(distance, 0.5), 28, height * 0.4);
  const markerWidth = markerHeight * 0.58;
  const aimProximity = clamp(1 - Math.abs(projectedX - width * 0.5) / (width * 0.34), 0, 1);
  const threat = clamp(1 - distance / 8, 0.12, 1);

  return {
    projectedX,
    markerHeight,
    markerWidth,
    top: horizon - markerHeight * 0.56,
    alpha: clamp(1 - distance / 12, 0.5, 0.96),
    distance,
    aimProximity,
    threat,
  };
}

export class GameScene {
  public readonly container = new Container();

  private readonly sky = new Graphics();
  private readonly world = new Graphics();
  private readonly overlay = new Graphics();
  private readonly minimap = new Graphics();
  private readonly banner = new Text({
    text: 'PHASE 2 // ENTERED THE ARENA',
    style: {
      fill: 0x6ee7ff,
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 3,
    },
  });
  private readonly hud = new Text({
    text: '',
    style: {
      fill: 0xf7fbff,
      fontFamily: 'Arial',
      fontSize: 14,
      letterSpacing: 1.2,
    },
  });
  private readonly warningText = new Text({
    text: '',
    style: {
      fill: 0xffd166,
      fontFamily: 'Courier New',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 1.6,
    },
  });
  private readonly player = new Player(PLAYER_SPAWN);
  private readonly raycaster = new Raycaster(WORLD_MAP.map((row) => [...row]));
  private enemies: EnemyState[] = INITIAL_ENEMIES.map((enemy) => ({ ...enemy }));
  private pickups: PickupState[] = INITIAL_PICKUPS.map((pickup) => ({ ...pickup }));
  private elapsed = 0;
  private viewportWidth: number;
  private viewportHeight: number;
  private firingLatch = false;
  private hitFlash = 0;
  private shotMessage = `${INITIAL_ENEMIES.length} HOSTILES ONLINE`;
  private restartLatch = false;
  private shotKick = 0;
  private damagePulse = 0;
  private movementBob = 0;
  private killPulse = 0;
  private damageDirectionPulse = 0;
  private lastDamageDirection: DamageDirection = 'front';
  private enemyHitPulses = new Map<string, number>();
  private enemyDeathPulses = new Map<string, number>();

  public constructor(
    private readonly baseWidth: number,
    private readonly baseHeight: number,
    private readonly input: InputController,
  ) {
    this.viewportWidth = baseWidth;
    this.viewportHeight = baseHeight;
    this.container.addChild(this.sky, this.world, this.overlay, this.minimap, this.banner, this.hud, this.warningText);
  }

  public resize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.banner.anchor.set(0.5);
    this.banner.position.set(width / 2, height * 0.08);
    this.drawScene();
  }

  public update(deltaSeconds: number): void {
    this.elapsed += deltaSeconds;
    this.hitFlash = advanceFeedbackPulse(this.hitFlash, deltaSeconds, 2.5);
    this.shotKick = advanceFeedbackPulse(this.shotKick, deltaSeconds, 5.5);
    this.damagePulse = advanceFeedbackPulse(this.damagePulse, deltaSeconds, 2.2);
    this.movementBob = advanceFeedbackPulse(this.movementBob, deltaSeconds, 3.2);
    this.killPulse = advanceFeedbackPulse(this.killPulse, deltaSeconds, 2.6);
    this.damageDirectionPulse = advanceFeedbackPulse(this.damageDirectionPulse, deltaSeconds, 2.8);
    for (const [enemyId, pulse] of this.enemyHitPulses.entries()) {
      const nextPulse = advanceFeedbackPulse(pulse, deltaSeconds, 3.4);
      if (nextPulse > 0) {
        this.enemyHitPulses.set(enemyId, nextPulse);
      } else {
        this.enemyHitPulses.delete(enemyId);
      }
    }
    for (const [enemyId, pulse] of this.enemyDeathPulses.entries()) {
      const nextPulse = advanceFeedbackPulse(pulse, deltaSeconds, 2.4);
      if (nextPulse > 0) {
        this.enemyDeathPulses.set(enemyId, nextPulse);
      } else {
        this.enemyDeathPulses.delete(enemyId);
      }
    }

    const player = this.player.snapshot;
    if (hasPlayerWon(this.enemies)) {
      const wantsRestart = this.input.isFirePressed();
      this.shotMessage = 'ALL HOSTILES ELIMINATED';
      if (wantsRestart && !this.restartLatch) {
        this.restartGame();
      }
      this.restartLatch = wantsRestart;
      this.drawScene();
      this.updateHud();
      return;
    }

    if (!player.isAlive) {
      const wantsRestart = this.input.isFirePressed();
      if (wantsRestart && !this.restartLatch) {
        this.restartGame();
      }
      this.restartLatch = wantsRestart;
      this.drawScene();
      this.updateHud();
      return;
    }
    this.restartLatch = false;

    const beforeMove = this.player.snapshot;
    const safeDelta = Math.max(deltaSeconds, 0.001);
    this.player.update(
      safeDelta,
      {
        movement: this.input.getMovementAxis(),
        strafe: this.input.getStrafeAxis(),
        turn: this.input.getTurnAxis() + this.input.consumeLookDelta() / safeDelta,
      },
      (x, y) => this.raycaster.isWalkable(x, y),
    );
    const afterMove = this.player.snapshot;
    const movedDistance = Math.hypot(afterMove.x - beforeMove.x, afterMove.y - beforeMove.y);
    if (movedDistance > 0.0001) {
      this.movementBob = Math.min(1, this.movementBob + movedDistance * 7.5);
    }

    const wantsFire = this.input.isFirePressed();
    if (wantsFire && !this.firingLatch && this.player.tryFire()) {
      const shotResult = resolveHitscanShot(this.player.snapshot, this.enemies, WORLD_MAP);
      this.enemies = shotResult.enemies;
      this.hitFlash = shotResult.didHit ? 1 : 0.45;
      this.shotKick = 1;
      if (shotResult.hitEnemyId) {
        this.enemyHitPulses.set(shotResult.hitEnemyId, 1);
        const hitEnemy = this.enemies.find((enemyState) => enemyState.id === shotResult.hitEnemyId);
        if (hitEnemy && !hitEnemy.isAlive) {
          this.killPulse = 1;
          this.enemyDeathPulses.set(hitEnemy.id, 1);
        }
      }
      this.shotMessage = shotResult.didHit
        ? this.describeShotResult(shotResult.hitEnemyId)
        : 'SHOT MISSED';
    }
    this.firingLatch = wantsFire;

    this.enemies = resolveEnemyMovement(
      this.player.snapshot,
      this.enemies,
      deltaSeconds,
      (x, y) => this.raycaster.isWalkable(x, y),
    );

    const contactDamage = resolveEnemyContactDamage(this.player.snapshot, this.enemies, deltaSeconds);
    const rangedDamage = resolveEnemyRangedDamage(this.player.snapshot, this.enemies, deltaSeconds, WORLD_MAP);
    const totalDamage = contactDamage + rangedDamage;
    if (totalDamage > 0) {
      this.player.applyDamage(totalDamage);
      this.hitFlash = Math.max(this.hitFlash, 0.7);
      this.damagePulse = Math.min(1, this.damagePulse + totalDamage / 32);
      this.damageDirectionPulse = 1;
      this.lastDamageDirection = this.getIncomingDamageDirection(this.player.snapshot);
      this.shotMessage = `UNDER FIRE · -${totalDamage} HP`;
    }

    const pickupResult = resolvePickups(this.player.snapshot, this.pickups);
    if (pickupResult.remainingPickups.length !== this.pickups.length) {
      this.player.applyPickup(pickupResult.player);
      this.pickups = pickupResult.remainingPickups;
    }

    this.drawScene();

    this.updateHud();
  }

  private updateHud(): void {
    const player = this.player.snapshot;
    const hasWon = hasPlayerWon(this.enemies);
    this.banner.alpha = 0.7 + Math.sin(this.elapsed * 2.5) * 0.12;
    this.overlay.alpha = 0.18 + Math.sin(this.elapsed * 4) * 0.03;
    this.hud.text = buildHudLines({
      health: player.health,
      ammo: player.ammo,
      livingEnemies: this.getLivingEnemyCount(),
      shotMessage: this.shotMessage,
      hasWon,
      isAlive: player.isAlive,
      pointerLocked: this.input.isPointerLocked(),
    }).join('\n');
  }

  private restartGame(): void {
    this.player.restart(PLAYER_SPAWN);
    this.enemies = INITIAL_ENEMIES.map((enemy) => ({ ...enemy }));
    this.pickups = INITIAL_PICKUPS.map((pickup) => ({ ...pickup }));
    this.hitFlash = 0;
    this.shotKick = 0;
    this.damagePulse = 0;
    this.movementBob = 0;
    this.killPulse = 0;
    this.damageDirectionPulse = 0;
    this.lastDamageDirection = 'front';
    this.enemyHitPulses.clear();
    this.enemyDeathPulses.clear();
    this.shotMessage = `${INITIAL_ENEMIES.length} HOSTILES ONLINE`;
  }

  private drawScene(): void {
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const horizon = height * 0.5;
    const player = this.player.snapshot;
    const feedback = getCombatFeedbackState(this.hitFlash, this.shotKick, this.damagePulse);
    const bob = getWeaponBobState(this.movementBob, this.elapsed);
    const weapon = getWeaponPresentationState(width, height, bob, feedback.recoilOffset);
    const weaponFiring = getWeaponFiringState(this.shotKick, feedback.muzzleFlashAlpha);
    const weaponBlend = getWeaponMotionBlendState(this.movementBob, this.shotKick);
    const weaponDepth = getWeaponDepthState(this.movementBob, this.shotKick);
    const recoilRecovery = getRecoilRecoveryState(this.shotKick);
    const killConfirmAlpha = getKillConfirmAlpha(this.killPulse);
    const dangerState = getLowHealthDangerState(player.health, this.elapsed);
    const hudDangerPresentation = getHudDangerPresentationState(player.health, this.elapsed, this.input.isPointerLocked());
    const nearestVisibleThreat = this.enemies
      .filter((enemy) => enemy.isAlive)
      .map((enemy) => projectEnemyMarker(enemy, player, width, horizon, height))
      .filter((projection): projection is EnemyProjection => projection !== null)
      .reduce<EnemyProjection | null>((best, projection) => {
        if (!best) {
          return projection;
        }

        const bestScore = best.aimProximity * 0.58 + best.threat * 0.28 + (1 - clamp(best.distance / 12, 0, 1)) * 0.14;
        const projectionScore =
          projection.aimProximity * 0.58 + projection.threat * 0.28 + (1 - clamp(projection.distance / 12, 0, 1)) * 0.14;
        return projectionScore > bestScore ? projection : best;
      }, null);
    const lockPressure = nearestVisibleThreat
      ? getEnemyLockPressureState(
          nearestVisibleThreat.aimProximity,
          nearestVisibleThreat.threat,
          clamp(nearestVisibleThreat.distance / 12, 0, 1),
        )
      : getEnemyLockPressureState(0, 0, 1);
    const crosshairFeedback = getCrosshairFeedbackState(
      this.hitFlash,
      feedback.hitConfirmAlpha,
      this.killPulse,
      clamp(0.38 + feedback.hitConfirmAlpha * 0.4 + killConfirmAlpha * 0.22 + lockPressure.hudStress * 0.28, 0, 1),
    );
    const rayCount = clamp(Math.floor(width / 8), 96, MAX_RAYS);
    const rays = this.raycaster.castRays(player, FIELD_OF_VIEW, rayCount);
    const columnWidth = width / rays.length;

    this.sky.clear();
    this.sky.rect(0, 0, width, horizon).fill({ color: 0x05070d, alpha: 1 });
    this.sky.circle(width * 0.76, height * 0.18, Math.min(width, height) * 0.085).fill(0xff3ea5);
    this.sky.stroke({ color: 0x6ee7ff, alpha: 0.22, width: 4 });
    this.sky.rect(0, horizon * 0.72, width, horizon * 0.28).fill({ color: 0xff3ea5, alpha: 0.06 });

    this.world.clear();
    this.world.rect(0, horizon, width, height - horizon).fill(0x070b14);
    this.world.rect(0, horizon - 4, width, 8).fill({ color: 0xffd166, alpha: 0.08 });

    for (let row = 1; row <= 12; row += 1) {
      const depth = row / 12;
      const y = horizon + (height - horizon) * depth * depth;
      this.world.moveTo(0, y);
      this.world.lineTo(width, y);
    }

    for (let index = 0; index < rays.length; index += 1) {
      const ray = rays[index];
      const shade = ray.wallType === 2 ? 0xff3ea5 : 0x6ee7ff;
      const brightness = ray.vertical ? 0.78 : 1;
      const wallHeight = Math.min(height * 0.9, (height / ray.correctedDistance) * 0.88);
      const top = horizon - wallHeight / 2;
      const alpha = clamp(1 - ray.distance / 20, 0.2, 0.92) * brightness;

      this.world.rect(index * columnWidth, top, columnWidth + 1, wallHeight).fill({ color: shade, alpha });
      this.world.rect(index * columnWidth, top, columnWidth + 1, wallHeight * 0.12).fill({ color: 0xffffff, alpha: alpha * 0.15 });
    }

    this.world.stroke({ color: 0x8b5cf6, alpha: 0.35, width: 1.5 });

    this.overlay.clear();
    for (let y = 0; y < height; y += 6) {
      this.overlay.rect(0, y, width, 2).fill({ color: 0xffffff, alpha: 0.035 + hudDangerPresentation.scanlineAlpha * 0.3 });
    }

    this.overlay.roundRect(18, 18, Math.min(width * 0.28, 280), 112, 14).fill({ color: 0x020611, alpha: 0.46 });
    this.overlay.roundRect(18, 18, Math.min(width * 0.28, 280), 112, 14).stroke({ color: 0x6ee7ff, alpha: 0.18, width: 2 });
    this.overlay.rect(0, 0, width, height).stroke({ color: 0x6ee7ff, alpha: 0.16 + hudDangerPresentation.frameAlpha * 0.34, width: 3 });

    const crosshairX = width * 0.5 + hudDangerPresentation.jitter * Math.sin(this.elapsed * 24) * 1.4;
    const crosshairY = horizon - feedback.recoilOffset + bob.y * 0.2 + hudDangerPresentation.jitter * Math.cos(this.elapsed * 27) * 1.1;
    const crosshairGap =
      8 +
      feedback.recoilKick * 0.14 +
      recoilRecovery.residualKick * 3.8 +
      crosshairFeedback.coreRadius * 0.32 +
      lockPressure.hudStress * 1.8;

    if (lockPressure.ringAlpha > 0.02) {
      this.overlay.circle(crosshairX, crosshairY, lockPressure.pulseRadius).stroke({
        color: 0xff5d73,
        alpha: lockPressure.ringAlpha,
        width: 1.8 + lockPressure.hudStress * 1.4,
      });
      this.overlay.circle(crosshairX, crosshairY, lockPressure.pulseRadius * 0.72).stroke({
        color: 0xffffff,
        alpha: lockPressure.ringAlpha * 0.5,
        width: 1.2,
      });
    }

    if (lockPressure.bracketAlpha > 0.02) {
      const bracketReach = lockPressure.pulseRadius + 10;
      const bracketSize = 10 + lockPressure.hudStress * 6;
      this.overlay.moveTo(crosshairX - bracketReach, crosshairY - bracketSize);
      this.overlay.lineTo(crosshairX - bracketReach, crosshairY - bracketReach * 0.18);
      this.overlay.lineTo(crosshairX - bracketReach + bracketSize, crosshairY - bracketReach * 0.18);
      this.overlay.moveTo(crosshairX + bracketReach, crosshairY - bracketSize);
      this.overlay.lineTo(crosshairX + bracketReach, crosshairY - bracketReach * 0.18);
      this.overlay.lineTo(crosshairX + bracketReach - bracketSize, crosshairY - bracketReach * 0.18);
      this.overlay.moveTo(crosshairX - bracketReach, crosshairY + bracketSize);
      this.overlay.lineTo(crosshairX - bracketReach, crosshairY + bracketReach * 0.18);
      this.overlay.lineTo(crosshairX - bracketReach + bracketSize, crosshairY + bracketReach * 0.18);
      this.overlay.moveTo(crosshairX + bracketReach, crosshairY + bracketSize);
      this.overlay.lineTo(crosshairX + bracketReach, crosshairY + bracketReach * 0.18);
      this.overlay.lineTo(crosshairX + bracketReach - bracketSize, crosshairY + bracketReach * 0.18);
      this.overlay.stroke({
        color: 0xffd166,
        alpha: lockPressure.bracketAlpha,
        width: 1.5 + lockPressure.hudStress * 1.2,
      });
    }

    this.overlay.moveTo(crosshairX, crosshairY - crosshairGap - crosshairFeedback.spikeLength * 0.42);
    this.overlay.lineTo(crosshairX, crosshairY - crosshairGap);
    this.overlay.moveTo(crosshairX, crosshairY + crosshairGap);
    this.overlay.lineTo(crosshairX, crosshairY + crosshairGap + crosshairFeedback.spikeLength * 0.42);
    this.overlay.moveTo(crosshairX - crosshairGap - crosshairFeedback.spikeLength * 0.44, crosshairY);
    this.overlay.lineTo(crosshairX - crosshairGap, crosshairY);
    this.overlay.moveTo(crosshairX + crosshairGap, crosshairY);
    this.overlay.lineTo(crosshairX + crosshairGap + crosshairFeedback.spikeLength * 0.44, crosshairY);
    this.overlay.stroke({
      color: this.hitFlash > 0 ? 0xffffff : 0xff3ea5,
      alpha: 0.66 + this.hitFlash * 0.18 + crosshairFeedback.confirmAlpha * 0.12 + lockPressure.hudStress * 0.08,
      width: 2 + crosshairFeedback.confirmAlpha * 0.4 + recoilRecovery.settleAlpha * 0.55,
    });
    this.overlay.circle(crosshairX, crosshairY, crosshairFeedback.coreRadius).stroke({
      color: 0xffd166,
      alpha: 0.16 + crosshairFeedback.confirmAlpha * 0.42 + lockPressure.ringAlpha * 0.2,
      width: 1.5 + recoilRecovery.settleAlpha * 0.5,
    });

    if (feedback.hitConfirmAlpha > 0) {
      this.overlay.circle(crosshairX, crosshairY, 10 + feedback.hitConfirmAlpha * 8).stroke({
        color: 0xffffff,
        alpha: 0.5 + feedback.hitConfirmAlpha * 0.45,
        width: 2,
      });
    }

    if (killConfirmAlpha > 0) {
      this.overlay.circle(crosshairX, crosshairY, crosshairFeedback.killRingRadius).stroke({
        color: 0xffd166,
        alpha: 0.42 + crosshairFeedback.killRingAlpha * 0.48,
        width: 2.4 + killConfirmAlpha,
      });
      this.overlay.moveTo(crosshairX, crosshairY - 24);
      this.overlay.lineTo(crosshairX + 24, crosshairY);
      this.overlay.lineTo(crosshairX, crosshairY + 24);
      this.overlay.lineTo(crosshairX - 24, crosshairY);
      this.overlay.closePath();
      this.overlay.stroke({ color: 0xffffff, alpha: 0.35 + killConfirmAlpha * 0.4, width: 2.2 });
    }

    for (const enemy of this.enemies) {
      if (!enemy.isAlive) {
        const deathPulse = this.enemyDeathPulses.get(enemy.id) ?? 0;
        if (deathPulse > 0) {
          this.drawEnemyDeathBurst(enemy, player, width, horizon, height, deathPulse);
        }
        continue;
      }

      this.drawEnemyMarker(enemy, player, width, horizon, height, this.enemyHitPulses.get(enemy.id) ?? 0);
    }

    if (this.hitFlash > 0) {
      this.overlay.rect(0, 0, width, height).fill({ color: 0xffffff, alpha: this.hitFlash * 0.08 });
    }

    if (feedback.muzzleFlashAlpha > 0) {
      this.overlay.moveTo(weapon.centerX, weapon.baseY - 16);
      this.overlay.lineTo(weapon.centerX - 26 * weaponFiring.barrelScale, weapon.muzzleY + 22 - feedback.recoilOffset);
      this.overlay.lineTo(weapon.centerX, weapon.muzzleY - 18 - feedback.recoilOffset - feedback.recoilKick);
      this.overlay.lineTo(weapon.centerX + 26 * weaponFiring.barrelScale, weapon.muzzleY + 22 - feedback.recoilOffset);
      this.overlay.closePath();
      this.overlay.fill({ color: 0xffd166, alpha: weaponFiring.muzzleBloomAlpha });
      this.overlay.moveTo(weapon.centerX, weapon.baseY - 26);
      this.overlay.lineTo(weapon.centerX - 14 * weaponFiring.barrelScale, weapon.muzzleY + 8 - feedback.recoilOffset);
      this.overlay.lineTo(weapon.centerX, weapon.muzzleY - 4 - feedback.recoilOffset - feedback.recoilKick);
      this.overlay.lineTo(weapon.centerX + 14 * weaponFiring.barrelScale, weapon.muzzleY + 8 - feedback.recoilOffset);
      this.overlay.closePath();
      this.overlay.fill({ color: 0xffffff, alpha: weaponFiring.muzzleBloomAlpha * 0.72 });
    }

    this.overlay.moveTo(weapon.baseLeft, weapon.baseY + weaponDepth.rearOffset);
    this.overlay.lineTo(
      weapon.centerX - weapon.gripInset - weaponBlend.bodyLag,
      weapon.bodyTopY + weaponBlend.bodyLag + weaponDepth.rearOffset,
    );
    this.overlay.lineTo(
      weapon.centerX + weapon.gripInset + weaponBlend.bodyLag,
      weapon.bodyTopY + weaponBlend.bodyLag + weaponDepth.rearOffset,
    );
    this.overlay.lineTo(weapon.baseRight, weapon.baseY + weaponDepth.rearOffset);
    this.overlay.closePath();
    this.overlay.fill({ color: 0x111827, alpha: 0.94 });

    this.overlay.moveTo(weapon.centerX - weapon.gripInset * 0.76, weapon.bodyTopY + weaponDepth.midOffset);
    this.overlay.lineTo(weapon.centerX - weapon.bodyHalfWidth * 0.26, weapon.slideTopY + 14 + weaponDepth.midOffset);
    this.overlay.lineTo(weapon.centerX + weapon.bodyHalfWidth * 0.26, weapon.slideTopY + 14 + weaponDepth.midOffset);
    this.overlay.lineTo(weapon.centerX + weapon.gripInset * 0.76, weapon.bodyTopY + weaponDepth.midOffset);
    this.overlay.closePath();
    this.overlay.fill({ color: 0x1f2937, alpha: 0.96 });

    this.overlay.roundRect(
      weapon.centerX - weapon.bodyHalfWidth * 0.18 * weaponDepth.frontScale,
      weapon.slideTopY + weaponFiring.slideOffset + weaponBlend.slideTravel + weaponDepth.frontOffset,
      weapon.bodyHalfWidth * 0.36 * weaponDepth.frontScale,
      52,
      8,
    ).fill({ color: 0x374151, alpha: 0.98 });
    this.overlay.roundRect(
      weapon.centerX - weapon.bodyHalfWidth * 0.18 * weaponDepth.frontScale,
      weapon.slideTopY + weaponFiring.slideOffset + weaponBlend.slideTravel + weaponDepth.frontOffset,
      weapon.bodyHalfWidth * 0.36 * weaponDepth.frontScale,
      52,
      8,
    ).stroke({ color: 0xf8fafc, alpha: 0.14, width: 1.5 });

    this.overlay.roundRect(
      weapon.centerX - weapon.barrelHalfWidth * weaponDepth.frontScale + weaponBlend.sightDrift * width,
      weapon.muzzleY + weaponDepth.frontOffset,
      weapon.barrelHalfWidth * 2 * weaponDepth.frontScale,
      30,
      5,
    ).fill({ color: 0x4b5563, alpha: 0.95 });
    this.overlay.roundRect(
      weapon.centerX - weapon.barrelHalfWidth * 0.56 * weaponDepth.frontScale + weaponBlend.sightDrift * width,
      weapon.muzzleY - 10 + weaponDepth.frontOffset,
      weapon.barrelHalfWidth * 1.12 * weaponDepth.frontScale,
      12,
      4,
    ).fill({ color: 0x9ca3af, alpha: 0.92 });

    this.overlay.moveTo(weapon.centerX - weapon.bodyHalfWidth * 0.54, weapon.baseY);
    this.overlay.lineTo(weapon.centerX - weapon.bodyHalfWidth * 0.26, weapon.baseY);
    this.overlay.lineTo(weapon.centerX - weapon.bodyHalfWidth * 0.12, weapon.baseY - 38);
    this.overlay.lineTo(weapon.centerX - weapon.bodyHalfWidth * 0.3, weapon.bodyTopY + 10);
    this.overlay.closePath();
    this.overlay.fill({ color: 0x0f172a, alpha: 0.96 });

    this.overlay.moveTo(weapon.centerX + weapon.bodyHalfWidth * 0.54, weapon.baseY);
    this.overlay.lineTo(weapon.centerX + weapon.bodyHalfWidth * 0.26, weapon.baseY);
    this.overlay.lineTo(weapon.centerX + weapon.bodyHalfWidth * 0.12, weapon.baseY - 38);
    this.overlay.lineTo(weapon.centerX + weapon.bodyHalfWidth * 0.3, weapon.bodyTopY + 10);
    this.overlay.closePath();
    this.overlay.fill({ color: 0x0b1220, alpha: 0.88 });

    this.overlay.roundRect(
      weapon.centerX - weapon.screenWidth * 0.5,
      weapon.slideTopY + 18 + weaponFiring.slideOffset + weaponDepth.midOffset,
      weapon.screenWidth,
      weapon.screenHeight,
      5,
    ).fill({
      color: 0x6ee7ff,
      alpha: 0.22 + feedback.muzzleFlashAlpha * 0.18 + weaponBlend.casingGlow,
    });
    this.overlay.roundRect(
      weapon.centerX - weapon.screenWidth * 0.5,
      weapon.slideTopY + 18 + weaponFiring.slideOffset,
      weapon.screenWidth,
      weapon.screenHeight,
      5,
    ).stroke({ color: 0xffffff, alpha: 0.18, width: 1.2 });

    if (lockPressure.hudStress > 0.04) {
      this.overlay.rect(0, 0, width, height).stroke({
        color: 0xff5d73,
        alpha: lockPressure.hudStress * 0.14,
        width: 2 + lockPressure.hudStress * 2,
      });
    }

    if (feedback.damageVignetteAlpha > 0) {
      const edge = Math.min(width, height) * 0.16;
      this.overlay.rect(0, 0, width, edge).fill({ color: 0xff204e, alpha: feedback.damageVignetteAlpha });
      this.overlay.rect(0, height - edge, width, edge).fill({ color: 0xff204e, alpha: feedback.damageVignetteAlpha * 0.88 });
      this.overlay.rect(0, 0, edge, height).fill({ color: 0xff204e, alpha: feedback.damageVignetteAlpha * 0.92 });
      this.overlay.rect(width - edge, 0, edge, height).fill({ color: 0xff204e, alpha: feedback.damageVignetteAlpha * 0.92 });
    }

    if (dangerState.vignetteAlpha > 0) {
      const edge = Math.min(width, height) * 0.22;
      this.overlay.rect(0, 0, width, edge).fill({ color: 0x8a0303, alpha: dangerState.vignetteAlpha * 0.72 });
      this.overlay.rect(0, height - edge, width, edge).fill({ color: 0x8a0303, alpha: dangerState.vignetteAlpha });
      this.overlay.rect(0, 0, edge, height).fill({ color: 0x8a0303, alpha: dangerState.vignetteAlpha * 0.8 });
      this.overlay.rect(width - edge, 0, edge, height).fill({ color: 0x8a0303, alpha: dangerState.vignetteAlpha * 0.8 });
      this.overlay.circle(width * 0.5, horizon, 54 + dangerState.heartbeatAlpha * 16).stroke({
        color: 0xff6b6b,
        alpha: dangerState.heartbeatAlpha,
        width: 2 + dangerState.hudPulse * 6,
      });
      this.overlay.roundRect(22, height - 118, Math.min(width * 0.3, 320), 34, 8).fill({
        color: 0x3f0404,
        alpha: 0.18 + hudDangerPresentation.frameAlpha * 0.52,
      });
      this.overlay.roundRect(22, height - 118, Math.min(width * 0.3, 320), 34, 8).stroke({
        color: 0xff6b6b,
        alpha: 0.24 + hudDangerPresentation.frameAlpha * 0.4,
        width: 1.6,
      });
    }

    if (this.damageDirectionPulse > 0) {
      this.drawDamageDirectionIndicator(width, height, this.lastDamageDirection, this.damageDirectionPulse);
    }

    this.drawMinimap(player);

    const scale = Math.min(width / this.baseWidth, height / this.baseHeight);
    this.banner.scale.set(Math.max(scale, 0.85));
    this.hud.scale.set(Math.max(scale, 0.9));
    this.hud.alpha = 0.92 + dangerState.hudPulse * 0.08;
    this.hud.position.set(32, height - 170);

    if (hudDangerPresentation.frameAlpha > 0.18) {
      const warningX = 32;
      const warningY = height - 112;
      this.overlay.moveTo(warningX, warningY);
      this.overlay.lineTo(warningX + 18, warningY + 16);
      this.overlay.lineTo(warningX, warningY + 32);
      this.overlay.closePath();
      this.overlay.fill({ color: 0xffd166, alpha: 0.24 + hudDangerPresentation.frameAlpha * 0.6 });
      this.overlay.stroke({ color: 0xffffff, alpha: 0.18 + hudDangerPresentation.frameAlpha * 0.4, width: 1.2 });
      this.warningText.text = hudDangerPresentation.warningText;
      this.warningText.position.set(56, height - 114);
      this.warningText.alpha = 0.42 + hudDangerPresentation.frameAlpha * 0.9;
      this.warningText.visible = true;
    } else {
      this.warningText.visible = false;
    }
  }

  private drawMinimap(player: PlayerState): void {
    const mapWidth = WORLD_MAP[0].length * MINIMAP_SCALE;
    const mapHeight = WORLD_MAP.length * MINIMAP_SCALE;

    this.minimap.clear();
    this.minimap.roundRect(18, 18, mapWidth + 16, mapHeight + 16, 12).fill({ color: 0x020611, alpha: 0.68 });
    this.minimap.roundRect(18, 18, mapWidth + 16, mapHeight + 16, 12).stroke({ color: 0x6ee7ff, alpha: 0.28, width: 2 });

    for (let y = 0; y < WORLD_MAP.length; y += 1) {
      for (let x = 0; x < WORLD_MAP[y].length; x += 1) {
        const tile = WORLD_MAP[y][x];
        const color = tile === 0 ? 0x111827 : tile === 2 ? 0xff3ea5 : 0x6ee7ff;
        this.minimap.rect(26 + x * MINIMAP_SCALE, 26 + y * MINIMAP_SCALE, MINIMAP_SCALE - 2, MINIMAP_SCALE - 2).fill({
          color,
          alpha: tile === 0 ? 0.4 : 0.7,
        });
      }
    }

    const playerX = 26 + player.x * MINIMAP_SCALE;
    const playerY = 26 + player.y * MINIMAP_SCALE;
    const lookDistance = MINIMAP_SCALE * 1.3;

    for (const enemy of this.enemies) {
      const enemyX = 26 + enemy.x * MINIMAP_SCALE;
      const enemyY = 26 + enemy.y * MINIMAP_SCALE;
      this.minimap.circle(enemyX, enemyY, 4).fill({ color: ENEMY_COLOR, alpha: enemy.isAlive ? 0.95 : 0.25 });
    }

    for (const pickup of this.pickups) {
      const pickupX = 26 + pickup.x * MINIMAP_SCALE;
      const pickupY = 26 + pickup.y * MINIMAP_SCALE;
      const color = pickup.type === 'ammo' ? 0x6ee7ff : 0x7dff6b;
      this.minimap.circle(pickupX, pickupY, 3).fill({ color, alpha: 0.9 });
    }

    this.minimap.circle(playerX, playerY, 5).fill(player.isAlive ? 0xffffff : 0xff6b6b);
    this.minimap.moveTo(playerX, playerY);
    this.minimap.lineTo(
      playerX + Math.cos(player.angle) * lookDistance,
      playerY + Math.sin(player.angle) * lookDistance,
    );
    this.minimap.stroke({ color: 0xffffff, alpha: 0.95, width: 2 });
  }

  private drawEnemyMarker(
    enemy: EnemyState,
    player: PlayerState,
    width: number,
    horizon: number,
    height: number,
    hitPulse: number,
  ): void {
    const projection = projectEnemyMarker(enemy, player, width, horizon, height);
    if (!projection) {
      return;
    }

    const silhouette = getEnemySilhouetteState(projection.aimProximity, projection.threat, hitPulse);
    const pose = getEnemyPoseState(hitPulse, this.enemyDeathPulses.get(enemy.id) ?? 0, projection.threat);
    const lockPressure = getEnemyLockPressureState(
      projection.aimProximity,
      projection.threat,
      clamp(projection.distance / 12, 0, 1),
    );

    const bodyLeft = projection.projectedX - projection.markerWidth / 2;
    const bodyRight = projection.projectedX + projection.markerWidth / 2;
    const bodyBottom = projection.top + projection.markerHeight;
    const glowWidth = projection.markerWidth * (1.1 + projection.aimProximity * 0.28) * silhouette.shoulderScale;
    const glowLeft = projection.projectedX - glowWidth / 2;
    const headRadius = projection.markerWidth * 0.16;
    const headY = projection.top + projection.markerHeight * 0.2;
    const shoulderY = projection.top + projection.markerHeight * 0.34;
    const torsoBottomY = projection.top + projection.markerHeight * 0.8;
    const legInset = projection.markerWidth * (0.12 + silhouette.waistInset * 0.4);
    const alertAlpha = 0.18 + projection.threat * 0.18;
    const hitFlashAlpha = getEnemyHitFlashAlpha(hitPulse);
    const hitLift = hitPulse * 10;
    const idleMotion = getEnemyIdleMotionState(this.elapsed, hitPulse);
    const shoulderSpread = projection.markerWidth * 0.18 * silhouette.shoulderScale;
    const waistInset = projection.markerWidth * silhouette.waistInset;
    const poseLift = pose.lift - pose.headDrop * 0.15;
    const collapseWidth = projection.markerWidth * pose.collapse * 0.16;
    const leftShoulder = bodyLeft + shoulderSpread + idleMotion.swayOffset * 0.5 + pose.twist * projection.markerWidth;
    const rightShoulder = bodyRight - shoulderSpread + idleMotion.swayOffset * 0.5 - pose.twist * projection.markerWidth;
    const leftWaist = bodyLeft + waistInset + idleMotion.swayOffset * 0.28 + collapseWidth;
    const rightWaist = bodyRight - waistInset + idleMotion.swayOffset * 0.28 - collapseWidth;
    const leftLeg = bodyLeft + legInset + idleMotion.swayOffset * 0.18 + collapseWidth * 0.4;
    const rightLeg = bodyRight - legInset + idleMotion.swayOffset * 0.18 - collapseWidth * 0.4;

    this.overlay.roundRect(
      glowLeft,
      projection.top - projection.markerHeight * 0.06 - hitLift * 0.2 - poseLift * 0.18 + idleMotion.verticalOffset * 0.35,
      glowWidth * idleMotion.glowPulse,
      projection.markerHeight * 1.08,
      14,
    ).fill({
      color: hitFlashAlpha > 0 ? 0xffffff : 0xff3ea5,
      alpha:
        projection.alpha * (0.16 + projection.aimProximity * 0.16) +
        hitFlashAlpha * 0.18 +
        silhouette.warningAlpha * 0.08 +
        lockPressure.hudStress * 0.08,
    });

    if (lockPressure.ringAlpha > 0.04) {
      this.overlay.circle(
        projection.projectedX + idleMotion.swayOffset * 0.5,
        headY + projection.markerHeight * 0.22 + idleMotion.verticalOffset * 0.7,
        lockPressure.pulseRadius * 0.36,
      ).stroke({
        color: 0xffd166,
        alpha: lockPressure.ringAlpha * 0.7,
        width: 1.6 + lockPressure.hudStress,
      });
    }

    this.overlay.moveTo(
      projection.projectedX + idleMotion.swayOffset * 0.35,
      projection.top + projection.markerHeight * 0.08 - hitLift - poseLift + idleMotion.verticalOffset + pose.collapse * projection.markerHeight * 0.08,
    );
    this.overlay.lineTo(leftShoulder, shoulderY - hitLift * 0.75 - poseLift * 0.6 + idleMotion.verticalOffset + pose.armYaw * 0.6);
    this.overlay.lineTo(leftWaist, torsoBottomY - hitLift * 0.25 + idleMotion.verticalOffset * 0.76 + pose.collapse * projection.markerHeight * 0.1);
    this.overlay.lineTo(leftLeg, bodyBottom + idleMotion.verticalOffset * 0.45 + pose.collapse * projection.markerHeight * 0.12);
    this.overlay.lineTo(rightLeg, bodyBottom + idleMotion.verticalOffset * 0.45 + pose.collapse * projection.markerHeight * 0.12);
    this.overlay.lineTo(rightWaist, torsoBottomY - hitLift * 0.25 + idleMotion.verticalOffset * 0.76 + pose.collapse * projection.markerHeight * 0.1);
    this.overlay.lineTo(rightShoulder, shoulderY - hitLift * 0.75 - poseLift * 0.6 + idleMotion.verticalOffset - pose.armYaw * 0.6);
    this.overlay.closePath();
    this.overlay.fill({
      color: hitFlashAlpha > 0.08 ? 0xffffff : ENEMY_COLOR,
      alpha: projection.alpha,
    });
    this.overlay.stroke({
      color: 0xffffff,
      alpha: 0.76 + projection.aimProximity * 0.18 + hitFlashAlpha * 0.1,
      width: 2.2 + hitFlashAlpha * 0.8,
    });

    this.overlay.circle(
      projection.projectedX + idleMotion.swayOffset * 0.62 + pose.twist * projection.markerWidth * 0.24,
      headY - hitLift * 0.85 + idleMotion.verticalOffset + pose.headDrop,
      headRadius,
    ).fill({
      color: 0xffffff,
      alpha: 0.9,
    });
    this.overlay.circle(
      projection.projectedX + idleMotion.swayOffset * 0.62 + pose.twist * projection.markerWidth * 0.24,
      headY - hitLift * 0.85 + idleMotion.verticalOffset + pose.headDrop,
      headRadius * 1.6,
    ).stroke({
      color: 0xffd166,
      alpha: silhouette.headGlowAlpha,
      width: 1.8,
    });
    this.overlay.circle(
      projection.projectedX + idleMotion.swayOffset * 0.62 + pose.twist * projection.markerWidth * 0.24,
      headY - hitLift * 0.85 + idleMotion.verticalOffset + pose.headDrop,
      headRadius,
    ).stroke({
      color: hitFlashAlpha > 0 ? 0xffd166 : 0xff3ea5,
      alpha: 0.85 + hitFlashAlpha * 0.08,
      width: 2 + hitFlashAlpha * 0.5,
    });

    this.overlay.roundRect(
      projection.projectedX - projection.markerWidth * 0.14,
      projection.top + projection.markerHeight * 0.36 - hitLift * 0.55 + idleMotion.verticalOffset * 0.82,
      projection.markerWidth * 0.28,
      projection.markerHeight * 0.12,
      4,
    ).fill({ color: 0xffffff, alpha: Math.min(0.94, projection.alpha) });

    if (hitFlashAlpha > 0) {
      this.overlay.roundRect(
        bodyLeft - projection.markerWidth * 0.06,
        projection.top - projection.markerHeight * 0.04 - hitLift * 0.2,
        projection.markerWidth * 1.12,
        projection.markerHeight * 0.96,
        10,
      ).stroke({ color: 0xffd166, alpha: hitFlashAlpha, width: 2.4 });
    }

    this.overlay.moveTo(projection.projectedX + idleMotion.swayOffset * 0.24, bodyBottom - projection.markerHeight * 0.18 + idleMotion.verticalOffset * 0.52);
    this.overlay.lineTo(projection.projectedX + idleMotion.swayOffset * 0.24, bodyBottom + projection.markerHeight * 0.02 + idleMotion.verticalOffset * 0.52);
    this.overlay.stroke({
      color: 0xffd166,
      alpha: 0.18 + projection.aimProximity * 0.28,
      width: 2,
    });

    if (projection.threat > 0.45) {
      this.overlay.roundRect(
        projection.projectedX - projection.markerWidth * 0.5,
        projection.top - 18,
        projection.markerWidth,
        8,
        4,
      ).fill({ color: 0xff5d73, alpha: alertAlpha + silhouette.warningAlpha + lockPressure.hudStress * 0.14 });
    }
  }

  private drawEnemyDeathBurst(
    enemy: Pick<EnemyState, 'x' | 'y'>,
    player: PlayerState,
    width: number,
    horizon: number,
    height: number,
    deathPulse: number,
  ): void {
    const projection = projectEnemyMarker(enemy, player, width, horizon, height);
    if (!projection) {
      return;
    }

    const burst = getEnemyDeathBurstState(deathPulse);
    const impact = getEnemyDeathImpactState(deathPulse, projection.threat);
    const centerX = projection.projectedX;
    const centerY = projection.top + projection.markerHeight * 0.48;

    this.overlay.roundRect(
      centerX - impact.fragmentSpread * 0.85,
      centerY - impact.verticalSmear * 0.7,
      impact.fragmentSpread * 1.7,
      impact.verticalSmear * 1.4,
      10,
    ).fill({ color: 0xff5d73, alpha: impact.shockAlpha * 0.24 });

    this.overlay.circle(centerX, centerY, impact.shockRadius).stroke({
      color: 0xffffff,
      alpha: impact.shockAlpha,
      width: 2.8,
    });
    this.overlay.circle(centerX, centerY, burst.shockwaveRadius).stroke({
      color: 0xffd166,
      alpha: burst.ringAlpha,
      width: 2.5,
    });
    this.overlay.circle(centerX, centerY, burst.shockwaveRadius * 0.58).stroke({
      color: 0xffffff,
      alpha: burst.ringAlpha * 0.78,
      width: 1.8,
    });
    this.overlay.moveTo(centerX, centerY - burst.verticalScatter);
    this.overlay.lineTo(centerX - projection.markerWidth * 0.65 - impact.fragmentSpread * 0.18, centerY + burst.verticalScatter * 0.45 + impact.verticalSmear * 0.2);
    this.overlay.lineTo(centerX + projection.markerWidth * 0.65 + impact.fragmentSpread * 0.18, centerY + burst.verticalScatter * 0.45 + impact.verticalSmear * 0.2);
    this.overlay.closePath();
    this.overlay.fill({ color: 0xff5d73, alpha: burst.ringAlpha * 0.34 });
  }

  private getLivingEnemyCount(): number {
    return this.enemies.filter((enemy) => enemy.isAlive).length;
  }

  private getIncomingDamageDirection(player: PlayerState): DamageDirection {
    let nearestEnemy: EnemyState | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const enemy of this.enemies) {
      if (!enemy.isAlive) {
        continue;
      }

      const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    }

    if (!nearestEnemy) {
      return 'front';
    }

    return getDamageDirectionIndicator(getRelativeAngleToPoint(player, nearestEnemy.x, nearestEnemy.y));
  }

  private drawDamageDirectionIndicator(
    width: number,
    height: number,
    direction: DamageDirection,
    pulse: number,
  ): void {
    const indicator = getDamageDirectionState(direction, pulse);
    const alpha = indicator.alpha;
    const edge = Math.min(width, height) * 0.12;
    const reach = edge * indicator.scale;

    if (direction === 'front') {
      this.overlay.moveTo(width * 0.5, edge * 0.2);
      this.overlay.lineTo(width * 0.5 - reach * 0.7, reach);
      this.overlay.lineTo(width * 0.5 + reach * 0.7, reach);
    } else if (direction === 'back') {
      this.overlay.moveTo(width * 0.5, height - edge * 0.2);
      this.overlay.lineTo(width * 0.5 - reach * 0.7, height - reach);
      this.overlay.lineTo(width * 0.5 + reach * 0.7, height - reach);
    } else if (direction === 'left') {
      this.overlay.moveTo(edge * 0.2, height * 0.5);
      this.overlay.lineTo(reach, height * 0.5 - reach * 0.7);
      this.overlay.lineTo(reach, height * 0.5 + reach * 0.7);
    } else {
      this.overlay.moveTo(width - edge * 0.2, height * 0.5);
      this.overlay.lineTo(width - reach, height * 0.5 - reach * 0.7);
      this.overlay.lineTo(width - reach, height * 0.5 + reach * 0.7);
    }

    this.overlay.closePath();
    this.overlay.fill({ color: 0xffd166, alpha });
    this.overlay.stroke({
      color: 0xffffff,
      alpha: indicator.strokeAlpha,
      width: 2 + pulse * 0.7 + ((direction === 'front' || direction === 'back') ? 0.45 : 0),
    });
  }

  private describeShotResult(hitEnemyId: string | null): string {
    if (!hitEnemyId) {
      return 'SHOT MISSED';
    }

    const hitEnemy = this.enemies.find((enemy) => enemy.id === hitEnemyId);

    if (!hitEnemy) {
      return 'TARGET LOST';
    }

    return hitEnemy.isAlive ? `HIT ${hitEnemy.id.toUpperCase()} · ${hitEnemy.health} HP` : `ELIMINATED ${hitEnemy.id.toUpperCase()}`;
  }
}
