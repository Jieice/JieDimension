import type { PlayerState } from '../entities/Player';
import { clamp, normalizeAngle } from '../utils/math';

export interface RayHit {
  distance: number;
  correctedDistance: number;
  vertical: boolean;
  wallType: number;
  angle: number;
}

const MAX_DEPTH = 24;
const MIN_DISTANCE = 0.0001;

export class Raycaster {
  public constructor(private readonly map: number[][]) {}

  public castRays(player: PlayerState, fov: number, rayCount: number): RayHit[] {
    const rays: RayHit[] = [];
    const startAngle = player.angle - fov / 2;
    const step = fov / rayCount;

    for (let index = 0; index < rayCount; index += 1) {
      const rayAngle = normalizeAngle(startAngle + step * index);
      rays.push(this.castSingleRay(player, rayAngle));
    }

    return rays;
  }

  public isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile === 0;
  }

  private castSingleRay(player: PlayerState, rayAngle: number): RayHit {
    const sin = Math.sin(rayAngle);
    const cos = Math.cos(rayAngle);

    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    const deltaDistX = Math.abs(1 / (cos === 0 ? Number.EPSILON : cos));
    const deltaDistY = Math.abs(1 / (sin === 0 ? Number.EPSILON : sin));

    let stepX = 0;
    let stepY = 0;
    let sideDistX = 0;
    let sideDistY = 0;

    if (cos < 0) {
      stepX = -1;
      sideDistX = (player.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - player.x) * deltaDistX;
    }

    if (sin < 0) {
      stepY = -1;
      sideDistY = (player.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - player.y) * deltaDistY;
    }

    let hitWall = 1;
    let vertical = false;
    let iterations = 0;

    while (iterations < 256) {
      iterations += 1;

      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        vertical = true;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        vertical = false;
      }

      hitWall = this.getTile(mapX + 0.5, mapY + 0.5);
      if (hitWall > 0) {
        break;
      }
    }

    const distance = vertical
      ? (mapX - player.x + (1 - stepX) / 2) / (cos === 0 ? Number.EPSILON : cos)
      : (mapY - player.y + (1 - stepY) / 2) / (sin === 0 ? Number.EPSILON : sin);

    const safeDistance = clamp(Math.abs(distance), MIN_DISTANCE, MAX_DEPTH);
    const correctedDistance = clamp(safeDistance * Math.cos(rayAngle - player.angle), MIN_DISTANCE, MAX_DEPTH);

    return {
      distance: safeDistance,
      correctedDistance,
      vertical,
      wallType: hitWall,
      angle: rayAngle,
    };
  }

  private getTile(x: number, y: number): number {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);
    const row = this.map[mapY];

    if (!row) {
      return 1;
    }

    return row[mapX] ?? 1;
  }
}
