import type { PlayerState } from '../entities/Player';
import { normalizeAngle } from '../utils/math';

export interface EnemyState {
  id: string;
  x: number;
  y: number;
  health: number;
  radius: number;
  isAlive: boolean;
}

export interface HitscanShotResult {
  didHit: boolean;
  hitEnemyId: string | null;
  enemies: EnemyState[];
}

export interface PickupState {
  id: string;
  x: number;
  y: number;
  type: 'ammo' | 'health';
  amount: number;
}

export interface PickupResult {
  player: PlayerState;
  remainingPickups: PickupState[];
}

const MAX_HIT_RANGE = 6;
const AIM_CONE_RADIANS = Math.PI / 12;
const SHOT_DAMAGE = 50;
const PLAYER_COLLISION_RADIUS = 0.2;
const ENEMY_CONTACT_DAMAGE_PER_SECOND = 24;
const ENEMY_RANGED_DAMAGE_PER_SECOND = 16;
const ENEMY_RANGED_RANGE = 4;
const ENEMY_MOVE_SPEED = 1.8;
const PICKUP_RADIUS = 0.5;

type CollisionMap = readonly (readonly number[])[];

export function resolveHitscanShot(player: PlayerState, enemies: EnemyState[], map?: CollisionMap): HitscanShotResult {
  let bestEnemyId: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const enemy of enemies) {
    if (!enemy.isAlive) {
      continue;
    }

    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.hypot(dx, dy);

    if (distance > MAX_HIT_RANGE) {
      continue;
    }

    const angleToEnemy = Math.atan2(dy, dx);
    const angleDelta = normalizeRelativeAngle(angleToEnemy - player.angle);
    const angularAllowance = AIM_CONE_RADIANS + Math.atan2(enemy.radius, Math.max(distance, 0.0001));

    if (Math.abs(angleDelta) > angularAllowance) {
      continue;
    }

    if (map && isShotBlockedByWall(player.x, player.y, enemy.x, enemy.y, map)) {
      continue;
    }

    if (distance < bestDistance) {
      bestDistance = distance;
      bestEnemyId = enemy.id;
    }
  }

  if (!bestEnemyId) {
    return {
      didHit: false,
      hitEnemyId: null,
      enemies: enemies.map((enemy) => ({ ...enemy })),
    };
  }

  return {
    didHit: true,
    hitEnemyId: bestEnemyId,
    enemies: enemies.map((enemy) => {
      if (enemy.id !== bestEnemyId) {
        return { ...enemy };
      }

      const health = Math.max(0, enemy.health - SHOT_DAMAGE);
      return {
        ...enemy,
        health,
        isAlive: health > 0,
      };
    }),
  };
}

export function resolveEnemyContactDamage(player: PlayerState, enemies: EnemyState[], deltaSeconds: number): number {
  let totalDamage = 0;

  for (const enemy of enemies) {
    if (!enemy.isAlive) {
      continue;
    }

    const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (distance > PLAYER_COLLISION_RADIUS + enemy.radius) {
      continue;
    }

    totalDamage += ENEMY_CONTACT_DAMAGE_PER_SECOND * deltaSeconds;
  }

  return Math.round(totalDamage);
}

export function resolveEnemyRangedDamage(
  player: PlayerState,
  enemies: EnemyState[],
  deltaSeconds: number,
  map: CollisionMap,
): number {
  let totalDamage = 0;

  for (const enemy of enemies) {
    if (!enemy.isAlive) {
      continue;
    }

    const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (distance > ENEMY_RANGED_RANGE) {
      continue;
    }

    if (isShotBlockedByWall(enemy.x, enemy.y, player.x, player.y, map)) {
      continue;
    }

    totalDamage += ENEMY_RANGED_DAMAGE_PER_SECOND * deltaSeconds;
  }

  return Math.round(totalDamage);
}

export function resolveEnemyMovement(
  player: PlayerState,
  enemies: EnemyState[],
  deltaSeconds: number,
  isWalkable: (x: number, y: number) => boolean,
): EnemyState[] {
  return enemies.map((enemy) => {
    if (!enemy.isAlive) {
      return { ...enemy };
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 0.001) {
      return { ...enemy };
    }

    const dirX = dx / distance;
    const dirY = dy / distance;
    const moveDistance = ENEMY_MOVE_SPEED * deltaSeconds;
    const nextX = enemy.x + dirX * moveDistance;
    const nextY = enemy.y + dirY * moveDistance;

    if (isWalkable(nextX, nextY)) {
      return { ...enemy, x: nextX, y: nextY };
    }

    return { ...enemy };
  });
}

export function resolvePickups(player: PlayerState, pickups: PickupState[]): PickupResult {
  let updatedPlayer = { ...player };
  const remaining: PickupState[] = [];

  for (const pickup of pickups) {
    const distance = Math.hypot(pickup.x - player.x, pickup.y - player.y);
    if (distance > PICKUP_RADIUS) {
      remaining.push(pickup);
      continue;
    }

    if (pickup.type === 'ammo') {
      updatedPlayer = { ...updatedPlayer, ammo: updatedPlayer.ammo + pickup.amount };
    } else if (pickup.type === 'health') {
      updatedPlayer = { ...updatedPlayer, health: updatedPlayer.health + pickup.amount };
    }
  }

  return { player: updatedPlayer, remainingPickups: remaining };
}

export function hasPlayerWon(enemies: EnemyState[]): boolean {
  return enemies.every((enemy) => !enemy.isAlive);
}

function normalizeRelativeAngle(angle: number): number {
  const normalized = normalizeAngle(angle);
  return normalized > Math.PI ? normalized - Math.PI * 2 : normalized;
}

function isShotBlockedByWall(startX: number, startY: number, endX: number, endY: number, map: CollisionMap): boolean {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(distance / 0.05));

  for (let step = 1; step < steps; step += 1) {
    const t = step / steps;
    const sampleX = startX + dx * t;
    const sampleY = startY + dy * t;

    if (!isWalkable(sampleX, sampleY, map)) {
      return true;
    }
  }

  return false;
}

function isWalkable(x: number, y: number, map: CollisionMap): boolean {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  return map[tileY]?.[tileX] === 0;
}
