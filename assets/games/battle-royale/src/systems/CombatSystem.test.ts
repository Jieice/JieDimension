import { describe, expect, it } from 'vitest';

import type { PlayerState } from '../entities/Player';
import { hasPlayerWon, resolveEnemyContactDamage, resolveEnemyMovement, resolveEnemyRangedDamage, resolveHitscanShot, resolvePickups } from './CombatSystem';

const basePlayer: PlayerState = {
  x: 2.5,
  y: 2.5,
  angle: 0,
  health: 100,
  ammo: 8,
  isAlive: true,
};

describe('CombatSystem', () => {
  it('hits the closest living enemy that is inside the aim cone and range', () => {
    const result = resolveHitscanShot(basePlayer, [
      { id: 'far', x: 5.4, y: 2.55, health: 100, radius: 0.35, isAlive: true },
      { id: 'near', x: 4.2, y: 2.52, health: 100, radius: 0.35, isAlive: true },
    ]);

    expect(result.hitEnemyId).toBe('near');
    expect(result.didHit).toBe(true);
    expect(result.enemies.find((enemy) => enemy.id === 'near')?.health).toBe(50);
    expect(result.enemies.find((enemy) => enemy.id === 'far')?.health).toBe(100);
  });

  it('does not hit enemies outside the aim cone', () => {
    const result = resolveHitscanShot(basePlayer, [
      { id: 'wide', x: 4.2, y: 4.4, health: 100, radius: 0.35, isAlive: true },
    ]);

    expect(result.didHit).toBe(false);
    expect(result.hitEnemyId).toBeNull();
    expect(result.enemies[0].health).toBe(100);
  });

  it('marks an enemy dead after lethal damage', () => {
    const result = resolveHitscanShot(basePlayer, [
      { id: 'weak', x: 4.2, y: 2.5, health: 40, radius: 0.35, isAlive: true },
    ]);

    expect(result.didHit).toBe(true);
    expect(result.enemies[0].health).toBe(0);
    expect(result.enemies[0].isAlive).toBe(false);
  });

  it('does not hit an enemy when a wall blocks the shot path', () => {
    const result = resolveHitscanShot(
      basePlayer,
      [{ id: 'blocked', x: 5.5, y: 2.5, health: 100, radius: 0.35, isAlive: true }],
      [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
      ],
    );

    expect(result.didHit).toBe(false);
    expect(result.hitEnemyId).toBeNull();
    expect(result.enemies[0].health).toBe(100);
  });

  it('applies contact damage when a living enemy overlaps the player', () => {
    const damage = resolveEnemyContactDamage(
      basePlayer,
      [{ id: 'close', x: 2.9, y: 2.5, health: 100, radius: 0.35, isAlive: true }],
      0.5,
    );

    expect(damage).toBe(12);
  });

  it('ignores dead and non-overlapping enemies for contact damage', () => {
    const damage = resolveEnemyContactDamage(
      basePlayer,
      [
        { id: 'dead', x: 2.8, y: 2.5, health: 0, radius: 0.35, isAlive: false },
        { id: 'far', x: 4.2, y: 2.5, health: 100, radius: 0.35, isAlive: true },
      ],
      1,
    );

    expect(damage).toBe(0);
  });

  it('applies ranged damage when a living enemy has line of sight to the player', () => {
    const damage = resolveEnemyRangedDamage(
      basePlayer,
      [{ id: 'shooter', x: 5.5, y: 2.5, health: 100, radius: 0.35, isAlive: true }],
      0.5,
      [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
      ],
    );

    expect(damage).toBe(8);
  });

  it('does not apply ranged damage through walls or from dead enemies', () => {
    const damage = resolveEnemyRangedDamage(
      basePlayer,
      [
        { id: 'dead', x: 5.5, y: 2.5, health: 0, radius: 0.35, isAlive: false },
        { id: 'blocked', x: 5.5, y: 2.5, health: 100, radius: 0.35, isAlive: true },
      ],
      1,
      [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
      ],
    );

    expect(damage).toBe(0);
  });

  it('moves living enemies toward the player', () => {
    const enemies = resolveEnemyMovement(
      basePlayer,
      [{ id: 'chase', x: 5.5, y: 2.5, health: 100, radius: 0.35, isAlive: true }],
      1,
      () => true,
    );

    const moved = enemies.find((e) => e.id === 'chase');
    expect(moved?.x).toBeLessThan(5.5);
  });

  it('does not move dead enemies', () => {
    const enemies = resolveEnemyMovement(
      basePlayer,
      [{ id: 'dead', x: 5.5, y: 2.5, health: 0, radius: 0.35, isAlive: false }],
      1,
      () => true,
    );

    const moved = enemies.find((e) => e.id === 'dead');
    expect(moved?.x).toBe(5.5);
  });

  it('picks up ammo when player overlaps an ammo pickup', () => {
    const result = resolvePickups(
      { ...basePlayer, ammo: 2 },
      [{ id: 'ammo1', x: 2.5, y: 2.5, type: 'ammo', amount: 4 }],
    );

    expect(result.player.ammo).toBe(6);
    expect(result.remainingPickups).toHaveLength(0);
  });

  it('picks up health when player overlaps a health pickup', () => {
    const result = resolvePickups(
      { ...basePlayer, health: 50 },
      [{ id: 'health1', x: 2.5, y: 2.5, type: 'health', amount: 25 }],
    );

    expect(result.player.health).toBe(75);
    expect(result.remainingPickups).toHaveLength(0);
  });

  it('ignores pickups that are not close enough', () => {
    const result = resolvePickups(
      basePlayer,
      [{ id: 'far', x: 5.5, y: 5.5, type: 'ammo', amount: 4 }],
    );

    expect(result.player.ammo).toBe(8);
    expect(result.remainingPickups).toHaveLength(1);
  });

  it('declares victory when all enemies are dead', () => {
    expect(
      hasPlayerWon([
        { id: 'dead1', x: 2.5, y: 2.5, health: 0, radius: 0.35, isAlive: false },
        { id: 'dead2', x: 4.5, y: 2.5, health: 0, radius: 0.35, isAlive: false },
      ]),
    ).toBe(true);
  });

  it('does not declare victory while a living enemy remains', () => {
    expect(
      hasPlayerWon([
        { id: 'dead1', x: 2.5, y: 2.5, health: 0, radius: 0.35, isAlive: false },
        { id: 'alive', x: 4.5, y: 2.5, health: 100, radius: 0.35, isAlive: true },
      ]),
    ).toBe(false);
  });
});
