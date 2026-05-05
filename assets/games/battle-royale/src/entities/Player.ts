import { normalizeAngle } from '../utils/math';

export interface PlayerState {
  x: number;
  y: number;
  angle: number;
  health: number;
  ammo: number;
  isAlive: boolean;
}

export interface PlayerUpdateIntent {
  movement: number;
  strafe: number;
  turn: number;
}

const MOVE_SPEED = 2.8;
const TURN_SPEED = 1.9;
const PLAYER_RADIUS = 0.2;
const DEFAULT_HEALTH = 100;
const DEFAULT_AMMO = 8;
const FIRE_COOLDOWN_SECONDS = 0.25;

export interface PlayerSpawnState extends Pick<PlayerState, 'x' | 'y' | 'angle'> {
  health?: number;
  ammo?: number;
  isAlive?: boolean;
}

export class Player {
  private readonly state: PlayerState;
  private fireCooldownRemaining = 0;

  public constructor(initialState: PlayerSpawnState) {
    const health = initialState.health ?? DEFAULT_HEALTH;

    this.state = {
      x: initialState.x,
      y: initialState.y,
      angle: initialState.angle,
      health,
      ammo: initialState.ammo ?? DEFAULT_AMMO,
      isAlive: initialState.isAlive ?? health > 0,
    };
  }

  public get snapshot(): PlayerState {
    return { ...this.state };
  }

  public update(deltaSeconds: number, intent: PlayerUpdateIntent, isWalkable: (x: number, y: number) => boolean): void {
    this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - deltaSeconds);

    if (!this.state.isAlive) {
      return;
    }

    this.state.angle = normalizeAngle(this.state.angle + intent.turn * TURN_SPEED * deltaSeconds);

    const cos = Math.cos(this.state.angle);
    const sin = Math.sin(this.state.angle);

    const forwardX = cos * intent.movement;
    const forwardY = sin * intent.movement;
    const strafeX = -sin * intent.strafe;
    const strafeY = cos * intent.strafe;

    const velocityX = (forwardX + strafeX) * MOVE_SPEED * deltaSeconds;
    const velocityY = (forwardY + strafeY) * MOVE_SPEED * deltaSeconds;

    const nextX = this.state.x + velocityX;
    const nextY = this.state.y + velocityY;

    if (this.canOccupy(nextX, this.state.y, isWalkable)) {
      this.state.x = nextX;
    }

    if (this.canOccupy(this.state.x, nextY, isWalkable)) {
      this.state.y = nextY;
    }
  }

  public tryFire(): boolean {
    if (!this.state.isAlive || this.state.ammo <= 0 || this.fireCooldownRemaining > 0) {
      return false;
    }

    this.state.ammo -= 1;
    this.fireCooldownRemaining = FIRE_COOLDOWN_SECONDS;
    return true;
  }

  public applyDamage(amount: number): void {
    if (amount <= 0 || !this.state.isAlive) {
      return;
    }

    this.state.health = Math.max(0, this.state.health - amount);
    this.state.isAlive = this.state.health > 0;
  }

  public restart(spawnState: PlayerSpawnState): void {
    const health = spawnState.health ?? DEFAULT_HEALTH;

    this.state.x = spawnState.x;
    this.state.y = spawnState.y;
    this.state.angle = spawnState.angle;
    this.state.health = health;
    this.state.ammo = spawnState.ammo ?? DEFAULT_AMMO;
    this.state.isAlive = spawnState.isAlive ?? health > 0;
    this.fireCooldownRemaining = 0;
  }

  public applyPickup(updatedState: PlayerState): void {
    this.state.health = updatedState.health;
    this.state.ammo = updatedState.ammo;
    this.state.isAlive = this.state.health > 0;
  }

  private canOccupy(x: number, y: number, isWalkable: (x: number, y: number) => boolean): boolean {
    return (
      isWalkable(x - PLAYER_RADIUS, y - PLAYER_RADIUS)
      && isWalkable(x + PLAYER_RADIUS, y - PLAYER_RADIUS)
      && isWalkable(x - PLAYER_RADIUS, y + PLAYER_RADIUS)
      && isWalkable(x + PLAYER_RADIUS, y + PLAYER_RADIUS)
    );
  }
}
