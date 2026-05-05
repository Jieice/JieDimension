import { describe, expect, it } from 'vitest';

import { Player } from './Player';

describe('Player combat state', () => {
  it('exposes default combat values in the snapshot', () => {
    const player = new Player({ x: 2.5, y: 2.5, angle: 0 });

    expect(player.snapshot.health).toBe(100);
    expect(player.snapshot.ammo).toBe(8);
    expect(player.snapshot.isAlive).toBe(true);
  });

  it('fires once and spends ammo when the weapon is ready', () => {
    const player = new Player({ x: 2.5, y: 2.5, angle: 0 });

    const fired = player.tryFire();

    expect(fired).toBe(true);
    expect(player.snapshot.ammo).toBe(7);
  });

  it('cannot fire again until cooldown time has elapsed', () => {
    const player = new Player({ x: 2.5, y: 2.5, angle: 0 });

    expect(player.tryFire()).toBe(true);
    expect(player.tryFire()).toBe(false);

    player.update(0.3, { movement: 0, strafe: 0, turn: 0 }, () => true);

    expect(player.tryFire()).toBe(true);
  });

  it('becomes dead after taking lethal damage', () => {
    const player = new Player({ x: 2.5, y: 2.5, angle: 0 });

    player.applyDamage(150);

    expect(player.snapshot.health).toBe(0);
    expect(player.snapshot.isAlive).toBe(false);
    expect(player.tryFire()).toBe(false);
  });

  it('can restart with fresh state after death', () => {
    const player = new Player({ x: 2.5, y: 2.5, angle: 0 });

    player.applyDamage(150);
    expect(player.snapshot.isAlive).toBe(false);

    player.restart({ x: 3.5, y: 3.5, angle: 0 });

    expect(player.snapshot.x).toBe(3.5);
    expect(player.snapshot.y).toBe(3.5);
    expect(player.snapshot.health).toBe(100);
    expect(player.snapshot.ammo).toBe(8);
    expect(player.snapshot.isAlive).toBe(true);
    expect(player.tryFire()).toBe(true);
  });
});
