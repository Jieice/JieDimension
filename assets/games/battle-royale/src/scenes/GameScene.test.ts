import { describe, expect, it } from 'vitest';

import { Player } from '../entities/Player';
import { Raycaster } from '../systems/Raycaster';
import {
  advanceFeedbackPulse,
  buildHudLines,
  buildHudSegments,
  getCombatFeedbackState,
  getCrosshairFeedbackState,
  getEnemyLockPressureState,
  getEnemyDeathImpactState,
  getEnemyPoseState,
  getDamageDirectionState,
  getDamageDirectionIndicator,
  getEnemyIdleMotionState,
  getEnemyDeathBurstState,
  getEnemyHitFlashAlpha,
  getEnemySilhouetteState,
  getHudDangerPresentationState,
  getKillConfirmAlpha,
  getLowHealthDangerState,
  getRelativeAngleToPoint,
  getRecoilRecoveryState,
  getWeaponDepthState,
  getWeaponFiringState,
  getWeaponMotionBlendState,
  getWeaponPresentationState,
  getWeaponBobState,
  projectEnemyMarker,
} from './GameScene';
import { WORLD_MAP } from './worldMap';

describe('GameScene spawn viability', () => {
  it('allows the default spawn to move forward on the first update', () => {
    const player = new Player({ x: 2.5, y: 1.5, angle: 0.46 });
    const raycaster = new Raycaster(WORLD_MAP.map((row) => [...row]));

    const before = player.snapshot;
    player.update(0.1, { movement: 1, strafe: 0, turn: 0 }, (x, y) => raycaster.isWalkable(x, y));
    const after = player.snapshot;

    expect(after.x).toBeGreaterThan(before.x);
  });

  it('starts with the closest enemy near the center of the first-person view', () => {
    const player = { x: 2.5, y: 1.5, angle: 0.46 };
    const projection = projectEnemyMarker({ x: 4.5, y: 2.5 }, player, 1280, 360, 720);

    expect(projection).not.toBeNull();
    expect(getRelativeAngleToPoint(player, 4.5, 2.5)).toBeLessThanOrEqual(Math.PI / 12);
    expect(projection?.projectedX).toBeGreaterThan(440);
    expect(projection?.projectedX).toBeLessThan(840);
    expect(projection?.markerHeight).toBeGreaterThanOrEqual(120);
    expect(projection?.aimProximity).toBeGreaterThan(0.7);
    expect(projection?.threat).toBeGreaterThan(0.6);
    expect(projection?.alpha).toBeGreaterThan(0.7);
  });

  it('treats distant edge-of-fov enemies as lower-threat targets', () => {
    const player = { x: 2.5, y: 1.5, angle: 0.46 };
    const projection = projectEnemyMarker({ x: 9.5, y: 9.5 }, player, 1280, 360, 720);

    expect(projection).not.toBeNull();
    expect(projection?.aimProximity).toBeLessThan(0.25);
    expect(projection?.threat).toBeLessThan(0.2);
    expect(projection?.alpha).toBe(0.5);
  });
});

describe('GameScene combat feedback helpers', () => {
  it('creates strong weapon feedback after a fresh shot', () => {
    const feedback = getCombatFeedbackState(1, 1, 0);

    expect(feedback.recoilOffset).toBeGreaterThanOrEqual(24);
    expect(feedback.recoilKick).toBeGreaterThanOrEqual(12);
    expect(feedback.muzzleFlashAlpha).toBeGreaterThan(0.9);
    expect(feedback.hitConfirmAlpha).toBe(1);
    expect(feedback.damageVignetteAlpha).toBe(0);
  });

  it('creates edge damage feedback without fake hit confirm', () => {
    const feedback = getCombatFeedbackState(0.2, 0, 1);

    expect(feedback.recoilOffset).toBe(0);
    expect(feedback.muzzleFlashAlpha).toBe(0);
    expect(feedback.damageVignetteAlpha).toBeGreaterThan(0.35);
    expect(feedback.hitConfirmAlpha).toBe(0);
  });

  it('decays feedback pulses over time without going negative', () => {
    expect(advanceFeedbackPulse(1, 0.1, 3)).toBeCloseTo(0.7);
    expect(advanceFeedbackPulse(0.2, 0.2, 2)).toBe(0);
  });

  it('adds visible weapon bob only while moving', () => {
    const idleBob = getWeaponBobState(0, 0.5);
    const movingBob = getWeaponBobState(1, 0.5);

    expect(idleBob.x).toBe(0);
    expect(idleBob.y).toBe(0);
    expect(idleBob.sway).toBe(0);
    expect(Math.abs(movingBob.x)).toBeGreaterThan(1);
    expect(movingBob.y).toBeGreaterThan(1);
    expect(Math.abs(movingBob.sway)).toBeGreaterThan(0.01);
  });

  it('turns enemy damage pulses into a short bright flash', () => {
    expect(getEnemyHitFlashAlpha(1)).toBeGreaterThan(0.8);
    expect(getEnemyHitFlashAlpha(0.25)).toBeGreaterThan(0.15);
    expect(getEnemyHitFlashAlpha(0)).toBe(0);
  });

  it('amplifies kill confirms beyond a normal hit flash', () => {
    expect(getKillConfirmAlpha(1)).toBeGreaterThan(0.9);
    expect(getKillConfirmAlpha(0.4)).toBeGreaterThan(0.35);
    expect(getKillConfirmAlpha(0)).toBe(0);
  });

  it('maps incoming damage angles to directional indicators', () => {
    expect(getDamageDirectionIndicator(0)).toBe('front');
    expect(getDamageDirectionIndicator(Math.PI / 2)).toBe('right');
    expect(getDamageDirectionIndicator(-Math.PI / 2)).toBe('left');
    expect(getDamageDirectionIndicator(Math.PI)).toBe('back');
  });

  it('creates a strong but decaying death burst for fresh eliminations', () => {
    const freshBurst = getEnemyDeathBurstState(1);
    const fadingBurst = getEnemyDeathBurstState(0.35);

    expect(freshBurst.ringAlpha).toBeGreaterThan(0.7);
    expect(freshBurst.shockwaveRadius).toBeGreaterThan(40);
    expect(freshBurst.verticalScatter).toBeGreaterThan(10);
    expect(fadingBurst.ringAlpha).toBeLessThan(freshBurst.ringAlpha);
    expect(getEnemyDeathBurstState(0).ringAlpha).toBe(0);
  });

  it('enters a strong danger state at low health without affecting healthy states', () => {
    const healthyState = getLowHealthDangerState(92, 0.25);
    const dangerState = getLowHealthDangerState(18, 0.25);

    expect(healthyState.vignetteAlpha).toBe(0);
    expect(healthyState.heartbeatAlpha).toBe(0);
    expect(healthyState.hudPulse).toBe(0);
    expect(dangerState.vignetteAlpha).toBeGreaterThan(0.22);
    expect(dangerState.heartbeatAlpha).toBeGreaterThan(0.3);
    expect(dangerState.hudPulse).toBeGreaterThan(0.15);
  });

  it('smooths damage direction overlays with pulse and emphasis', () => {
    const idleState = getDamageDirectionState('left', 0);
    const activeState = getDamageDirectionState('left', 1);

    expect(idleState.alpha).toBe(0);
    expect(idleState.scale).toBe(1);
    expect(activeState.alpha).toBeGreaterThan(0.45);
    expect(activeState.scale).toBeGreaterThan(1.05);
    expect(activeState.strokeAlpha).toBeGreaterThan(0.3);
  });

  it('builds a layered weapon presentation with body, slide and muzzle anchors', () => {
    const weapon = getWeaponPresentationState(640, 720, { x: 4, y: 6, sway: 0.02 }, 10);

    expect(weapon.baseLeft).toBeLessThan(weapon.centerX);
    expect(weapon.baseRight).toBeGreaterThan(weapon.centerX);
    expect(weapon.bodyTopY).toBeLessThan(weapon.baseY);
    expect(weapon.slideTopY).toBeLessThan(weapon.bodyTopY);
    expect(weapon.barrelHalfWidth).toBeLessThan(weapon.bodyHalfWidth);
    expect(weapon.screenWidth).toBeLessThan(weapon.bodyHalfWidth);
    expect(weapon.muzzleY).toBeLessThan(weapon.slideTopY);
  });

  it('creates subtle enemy idle motion without affecting hit reactions', () => {
    const idleA = getEnemyIdleMotionState(0.2, 0);
    const idleB = getEnemyIdleMotionState(0.6, 0);
    const hitState = getEnemyIdleMotionState(0.6, 1);

    expect(Math.abs(idleA.verticalOffset - idleB.verticalOffset)).toBeGreaterThan(0.5);
    expect(idleA.glowPulse).toBeGreaterThanOrEqual(0.9);
    expect(idleA.glowPulse).toBeLessThanOrEqual(1.2);
    expect(hitState.verticalOffset).toBeLessThan(idleB.verticalOffset);
    expect(hitState.swayOffset).toBe(0);
  });

  it('creates layered firing dynamics for slide travel and muzzle bloom', () => {
    const idleFiring = getWeaponFiringState(0, 0);
    const activeFiring = getWeaponFiringState(1, 0.4);

    expect(idleFiring.slideOffset).toBe(0);
    expect(idleFiring.muzzleBloomAlpha).toBe(0);
    expect(activeFiring.slideOffset).toBeGreaterThan(8);
    expect(activeFiring.muzzleBloomAlpha).toBeGreaterThan(0.4);
    expect(activeFiring.barrelScale).toBeGreaterThan(1);
  });

  it('builds a more threatening enemy silhouette as targets become centered and dangerous', () => {
    const edgeTarget = getEnemySilhouetteState(0.1, 0.2, 0);
    const centerThreat = getEnemySilhouetteState(0.95, 0.85, 0.4);

    expect(centerThreat.shoulderScale).toBeGreaterThan(edgeTarget.shoulderScale);
    expect(centerThreat.headGlowAlpha).toBeGreaterThan(edgeTarget.headGlowAlpha);
    expect(centerThreat.warningAlpha).toBeGreaterThan(0.2);
    expect(centerThreat.waistInset).toBeLessThan(edgeTarget.waistInset);
  });

  it('blends weapon motion across movement and firing states', () => {
    const idle = getWeaponMotionBlendState(0, 0);
    const moving = getWeaponMotionBlendState(1, 0);
    const movingAndFiring = getWeaponMotionBlendState(1, 1);

    expect(idle.bodyLag).toBe(0);
    expect(idle.slideTravel).toBe(0);
    expect(moving.bodyLag).toBeGreaterThan(2);
    expect(Math.abs(moving.sightDrift)).toBeGreaterThan(0.01);
    expect(movingAndFiring.slideTravel).toBeGreaterThan(moving.slideTravel);
    expect(movingAndFiring.casingGlow).toBeGreaterThan(0.2);
  });

  it('formats HUD copy like combat UI instead of raw debug telemetry', () => {
    const lines = buildHudLines({
      health: 72,
      ammo: 9,
      livingEnemies: 2,
      shotMessage: 'HIT E1 · 45 HP',
      hasWon: false,
      isAlive: true,
      pointerLocked: true,
    });

    expect(lines[0]).toContain('HEALTH 72');
    expect(lines[0]).toContain('AMMO 9');
    expect(lines[1]).toContain('HOSTILES 2');
    expect(lines.join(' ')).not.toMatch(/POS|HDG/);
    expect(lines[2]).toContain('MOUSE TO AIM');
  });

  it('pushes enemy pose into a stronger hit and collapse silhouette during damage and death', () => {
    const idlePose = getEnemyPoseState(0, 0, 0.8);
    const hitPose = getEnemyPoseState(0.85, 0, 0.8);
    const deathPose = getEnemyPoseState(0.4, 1, 0.8);

    expect(hitPose.lift).toBeGreaterThan(idlePose.lift);
    expect(hitPose.twist).toBeGreaterThan(idlePose.twist);
    expect(hitPose.collapse).toBe(0);
    expect(deathPose.collapse).toBeGreaterThan(0.6);
    expect(deathPose.headDrop).toBeGreaterThan(hitPose.headDrop);
    expect(deathPose.armYaw).toBeLessThan(hitPose.armYaw);
  });

  it('separates weapon depth layers so recoil pushes the front assembly hardest', () => {
    const idleDepth = getWeaponDepthState(0, 0);
    const movingDepth = getWeaponDepthState(1, 0);
    const firingDepth = getWeaponDepthState(1, 1);

    expect(idleDepth.rearOffset).toBe(0);
    expect(idleDepth.frontOffset).toBe(0);
    expect(movingDepth.shadowSpread).toBeGreaterThan(idleDepth.shadowSpread);
    expect(firingDepth.frontOffset).toBeGreaterThan(firingDepth.midOffset);
    expect(firingDepth.midOffset).toBeGreaterThan(firingDepth.rearOffset);
    expect(firingDepth.frontScale).toBeGreaterThan(1);
  });

  it('builds segmented HUD blocks instead of a flat debug stack', () => {
    const segments = buildHudSegments({
      health: 28,
      ammo: 9,
      livingEnemies: 2,
      shotMessage: 'HIT E1 · 45 HP',
      hasWon: false,
      isAlive: true,
      pointerLocked: true,
    });

    expect(segments.left.title).toBe('STATUS');
    expect(segments.left.primary).toContain('HEALTH 28');
    expect(segments.center.title).toBe('ENGAGEMENT');
    expect(segments.center.accent).toContain('HIT E1');
    expect(segments.right.title).toBe('CONTROL');
    expect(segments.right.primary).toContain('MOUSE TO AIM');
    expect(segments.left.emphasis).toBe('critical');
  });

  it('creates a heavier enemy death impact state for fresh eliminations', () => {
    const freshImpact = getEnemyDeathImpactState(1, 0.85);
    const fadingImpact = getEnemyDeathImpactState(0.3, 0.4);

    expect(freshImpact.shockRadius).toBeGreaterThan(56);
    expect(freshImpact.shockAlpha).toBeGreaterThan(0.75);
    expect(freshImpact.verticalSmear).toBeGreaterThan(18);
    expect(freshImpact.fragmentSpread).toBeGreaterThan(fadingImpact.fragmentSpread);
    expect(getEnemyDeathImpactState(0, 0.5).shockAlpha).toBe(0);
  });

  it('builds layered crosshair feedback that escalates from hit confirm to kill confirm', () => {
    const idle = getCrosshairFeedbackState(0, 0, 0, 0);
    const hit = getCrosshairFeedbackState(0.9, 0.8, 0, 0.65);
    const kill = getCrosshairFeedbackState(0.9, 0.8, 1, 0.65);

    expect(idle.coreRadius).toBeLessThan(hit.coreRadius);
    expect(hit.confirmAlpha).toBeGreaterThan(0.65);
    expect(hit.spikeLength).toBeGreaterThan(idle.spikeLength);
    expect(kill.killRingRadius).toBeGreaterThan(hit.killRingRadius);
    expect(kill.killRingAlpha).toBeGreaterThan(hit.killRingAlpha);
  });

  it('turns low-health danger into a more aggressive HUD presentation state', () => {
    const stableHud = getHudDangerPresentationState(82, 0.2, false);
    const criticalHud = getHudDangerPresentationState(14, 0.2, true);

    expect(stableHud.frameAlpha).toBeLessThan(0.2);
    expect(stableHud.scanlineAlpha).toBeLessThan(0.08);
    expect(criticalHud.frameAlpha).toBeGreaterThan(0.32);
    expect(criticalHud.scanlineAlpha).toBeGreaterThan(0.1);
    expect(criticalHud.jitter).toBeGreaterThan(0.6);
    expect(criticalHud.warningText).toContain('CRITICAL');
  });

  it('builds lock pressure that spikes when a dangerous enemy is centered and close', () => {
    const edgePressure = getEnemyLockPressureState(0.12, 0.2, 0.85);
    const centeredThreat = getEnemyLockPressureState(0.96, 0.92, 0.18);

    expect(centeredThreat.ringAlpha).toBeGreaterThan(edgePressure.ringAlpha);
    expect(centeredThreat.bracketAlpha).toBeGreaterThan(0.3);
    expect(centeredThreat.pulseRadius).toBeLessThan(edgePressure.pulseRadius);
    expect(centeredThreat.hudStress).toBeGreaterThan(edgePressure.hudStress);
  });

  it('gives front and rear damage indicators more weight than side glances', () => {
    const side = getDamageDirectionState('left', 0.85);
    const front = getDamageDirectionState('front', 0.85);
    const back = getDamageDirectionState('back', 0.85);

    expect(front.alpha).toBeGreaterThan(side.alpha);
    expect(back.strokeAlpha).toBeGreaterThan(side.strokeAlpha);
    expect(front.scale).toBeGreaterThan(side.scale);
  });

  it('keeps recoil recovery snappy up front but smoother in the tail', () => {
    const freshShot = getRecoilRecoveryState(1);
    const settling = getRecoilRecoveryState(0.45);
    const idle = getRecoilRecoveryState(0);

    expect(freshShot.returnSpeed).toBeGreaterThan(settling.returnSpeed);
    expect(freshShot.settleAlpha).toBeGreaterThan(settling.settleAlpha);
    expect(settling.residualKick).toBeGreaterThan(0.5);
    expect(idle.returnSpeed).toBe(0);
  });

  it('pushes a critical locked HUD into a more unstable combat state than an unlocked warning state', () => {
    const unlockedWarning = getHudDangerPresentationState(24, 0.35, false);
    const lockedCritical = getHudDangerPresentationState(8, 0.35, true);

    expect(lockedCritical.frameAlpha).toBeGreaterThan(unlockedWarning.frameAlpha);
    expect(lockedCritical.scanlineAlpha).toBeGreaterThan(unlockedWarning.scanlineAlpha);
    expect(lockedCritical.jitter).toBeGreaterThan(unlockedWarning.jitter);
    expect(lockedCritical.warningText).toContain('CRITICAL');
  });

  it('turns a high-threat kill into a brighter tighter death impact than a low-threat cleanup', () => {
    const cleanupKill = getEnemyDeathImpactState(1, 0.15);
    const executionKill = getEnemyDeathImpactState(1, 1);

    expect(executionKill.shockRadius).toBeGreaterThan(cleanupKill.shockRadius);
    expect(executionKill.shockAlpha).toBeGreaterThan(0.82);
    expect(executionKill.verticalSmear).toBeGreaterThan(cleanupKill.verticalSmear);
    expect(executionKill.fragmentSpread).toBeGreaterThan(cleanupKill.fragmentSpread);
  });
});
