import * as THREE from 'three';
import { InputManager } from '../core/InputManager.js';

const MOVE_SPEED = 8;
const MOUSE_SENSITIVITY = 0.002;
const PLAYER_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.4;
const MAX_HEALTH = 100;
const FIRE_COOLDOWN = 0.15;
const MAX_AMMO = 30;
const RELOAD_TIME = 1.5;

export class Player {
  private camera: THREE.PerspectiveCamera;
  private input: InputManager;
  private collider: (x: number, z: number) => boolean;
  private yaw = 0;
  private pitch = 0;
  private health = MAX_HEALTH;
  private ammo = MAX_AMMO;
  private fireCooldown = 0;
  private isReloading = false;
  private reloadTimer = 0;
  private dead = false;
  private velocityY = 0;
  private onGround = true;

  // Weapon bob
  private bobTime = 0;
  private weaponGroup: THREE.Group;
  private weaponMesh: THREE.Group;
  private muzzleFlash: THREE.PointLight;
  private recoilOffset = 0;

  constructor(camera: THREE.PerspectiveCamera, input: InputManager, collider: (x: number, z: number) => boolean) {
    this.camera = camera;
    this.input = input;
    this.collider = collider;

    // Weapon model (attached to camera)
    this.weaponGroup = new THREE.Group();
    this.weaponMesh = this.createWeaponModel();
    this.weaponGroup.add(this.weaponMesh);
    this.weaponGroup.position.set(0.3, -0.3, -0.5);
    camera.add(this.weaponGroup);

    // Muzzle flash light
    this.muzzleFlash = new THREE.PointLight(0xffd166, 0, 8);
    this.muzzleFlash.position.set(0, 0, -1.2);
    camera.add(this.muzzleFlash);
  }

  public update(delta: number): void {
    if (this.dead) return;

    // Mouse look
    const { x: mdx, y: mdy } = this.input.consumeMouseDelta();
    this.yaw -= mdx * MOUSE_SENSITIVITY;
    this.pitch -= mdy * MOUSE_SENSITIVITY;
    this.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.pitch));

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

    // Movement
    const forward = this.input.getForward();
    const strafe = this.input.getStrafe();
    const speed = MOVE_SPEED * delta;

    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);

    let moveX = 0;
    let moveZ = 0;

    if (forward !== 0) {
      moveX += sinY * forward * speed;
      moveZ += cosY * forward * speed;
    }
    if (strafe !== 0) {
      moveX += cosY * strafe * speed;
      moveZ -= sinY * strafe * speed;
    }

    // Collision - slide along walls
    const newX = this.camera.position.x + moveX;
    const newZ = this.camera.position.z + moveZ;

    if (!this.collides(newX, this.camera.position.z)) {
      this.camera.position.x = newX;
    }
    if (!this.collides(this.camera.position.x, newZ)) {
      this.camera.position.z = newZ;
    }

    // Keep on ground
    this.camera.position.y = PLAYER_HEIGHT;

    // Weapon bob
    const isMoving = forward !== 0 || strafe !== 0;
    if (isMoving) {
      this.bobTime += delta * 10;
    }
    const bobX = isMoving ? Math.sin(this.bobTime) * 0.02 : 0;
    const bobY = isMoving ? Math.abs(Math.cos(this.bobTime)) * 0.015 : 0;
    this.weaponGroup.position.set(0.3 + bobX, -0.3 + bobY, -0.5 + this.recoilOffset);

    // Recoil recovery
    this.recoilOffset *= 0.85;

    // Fire cooldown
    this.fireCooldown = Math.max(0, this.fireCooldown - delta);

    // Reload
    if (this.isReloading) {
      this.reloadTimer -= delta;
      if (this.reloadTimer <= 0) {
        this.ammo = MAX_AMMO;
        this.isReloading = false;
      }
    }

    // Auto reload when empty
    if (this.ammo <= 0 && !this.isReloading) {
      this.startReload();
    }

    // Muzzle flash fade
    this.muzzleFlash.intensity *= 0.8;
  }

  public onFire(): void {
    if (this.dead || this.isReloading) return;
    if (this.fireCooldown > 0) return;
    if (this.ammo <= 0) {
      this.startReload();
      return;
    }

    this.ammo--;
    this.fireCooldown = FIRE_COOLDOWN;
    this.recoilOffset = 0.08;
    this.muzzleFlash.intensity = 3;
  }

  public takeDamage(amount: number): void {
    if (this.dead) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.dead = true;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.camera.position.clone();
  }

  public getDirection(): THREE.Vector3 {
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(this.camera.quaternion);
    return dir;
  }

  public getHealth(): number { return this.health; }
  public getAmmo(): number { return this.ammo; }
  public isDead(): boolean { return this.dead; }

  private startReload(): void {
    this.isReloading = true;
    this.reloadTimer = RELOAD_TIME;
  }

  private collides(x: number, z: number): boolean {
    return this.collider(x - PLAYER_RADIUS, z - PLAYER_RADIUS)
      || this.collider(x + PLAYER_RADIUS, z - PLAYER_RADIUS)
      || this.collider(x - PLAYER_RADIUS, z + PLAYER_RADIUS)
      || this.collider(x + PLAYER_RADIUS, z + PLAYER_RADIUS);
  }

  private createWeaponModel(): THREE.Group {
    const group = new THREE.Group();

    // Gun body
    const bodyGeo = new THREE.BoxGeometry(0.06, 0.08, 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.25, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4a,
      metalness: 0.95,
      roughness: 0.2,
    });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(0, 0.02, -0.28);
    group.add(barrel);

    // Glow strip (cyberpunk accent)
    const stripGeo = new THREE.BoxGeometry(0.065, 0.008, 0.3);
    const stripMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7ff,
      emissive: 0x6ee7ff,
      emissiveIntensity: 2,
    });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(0, 0.045, -0.02);
    group.add(strip);

    // Grip
    const gripGeo = new THREE.BoxGeometry(0.04, 0.12, 0.06);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x111122,
      metalness: 0.5,
      roughness: 0.8,
    });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(0, -0.08, 0.05);
    grip.rotation.x = 0.2;
    group.add(grip);

    return group;
  }
}
