import * as THREE from 'three';

const ENEMY_SPEED = 3.5;
const ENEMY_HEALTH = 100;
const CONTACT_DAMAGE_PER_SECOND = 20;
const CONTACT_RADIUS = 1.2;
const ENEMY_RADIUS = 0.5;

interface EnemyData {
  id: string;
  mesh: THREE.Group;
  health: number;
  maxHealth: number;
  alive: boolean;
  hitTimer: number;
  deathTimer: number;
}

const ENEMY_SPAWNS = [
  { id: 'e1', x: 50, z: 50 },
  { id: 'e2', x: 14, z: 50 },
  { id: 'e3', x: 50, z: 14 },
  { id: 'e4', x: 30, z: 30 },
  { id: 'e5', x: 45, z: 20 },
];

export class EnemyManager {
  private scene: THREE.Scene;
  private collider: (x: number, z: number) => boolean;
  private enemies: EnemyData[] = [];

  constructor(scene: THREE.Scene, collider: (x: number, z: number) => boolean) {
    this.scene = scene;
    this.collider = collider;

    for (const spawn of ENEMY_SPAWNS) {
      const mesh = this.createEnemyMesh();
      mesh.position.set(spawn.x, 0, spawn.z);
      this.scene.add(mesh);

      this.enemies.push({
        id: spawn.id,
        mesh,
        health: ENEMY_HEALTH,
        maxHealth: ENEMY_HEALTH,
        alive: true,
        hitTimer: 0,
        deathTimer: 0,
      });
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        enemy.deathTimer += delta;
        // Sink into ground and fade
        if (enemy.mesh.position.y > -2) {
          enemy.mesh.position.y -= delta * 1.5;
          const fadeAlpha = Math.max(0, 1 - enemy.deathTimer);
          enemy.mesh.traverse((child) => {
            if ((child as THREE.Mesh).material) {
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).transparent = true;
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = fadeAlpha;
            }
          });
        }
        continue;
      }

      // Hit flash recovery
      if (enemy.hitTimer > 0) {
        enemy.hitTimer -= delta;
      }

      // Move toward player
      const dx = playerPos.x - enemy.mesh.position.x;
      const dz = playerPos.z - enemy.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist > CONTACT_RADIUS) {
        const dirX = dx / dist;
        const dirZ = dz / dist;
        const speed = ENEMY_SPEED * delta;
        const nextX = enemy.mesh.position.x + dirX * speed;
        const nextZ = enemy.mesh.position.z + dirZ * speed;

        // Collision with walls (slide)
        if (!this.collides(nextX, enemy.mesh.position.z, ENEMY_RADIUS)) {
          enemy.mesh.position.x = nextX;
        }
        if (!this.collides(enemy.mesh.position.x, nextZ, ENEMY_RADIUS)) {
          enemy.mesh.position.z = nextZ;
        }
      }

      // Face player
      enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);

      // Hover animation
      enemy.mesh.position.y = Math.sin(Date.now() * 0.003 + enemy.mesh.position.x) * 0.15;

      // Update material flash
      const bodyMesh = enemy.mesh.children[0] as THREE.Mesh;
      if (bodyMesh) {
        const mat = bodyMesh.material as THREE.MeshStandardMaterial;
        if (enemy.hitTimer > 0) {
          mat.emissiveIntensity = 3;
          mat.emissive.set(0xffffff);
        } else {
          mat.emissiveIntensity = 0.5;
          mat.emissive.set(0xff3ea5);
        }
      }
    }
  }

  public damageEnemy(id: string, amount: number): void {
    const enemy = this.enemies.find(e => e.id === id);
    if (!enemy || !enemy.alive) return;

    enemy.health -= amount;
    enemy.hitTimer = 0.15;

    if (enemy.health <= 0) {
      enemy.alive = false;
      enemy.health = 0;
      this.spawnDeathEffect(enemy.mesh.position.clone());
    }
  }

  public getContactDamage(playerPos: THREE.Vector3, delta: number): number {
    let totalDamage = 0;
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      const dist = enemy.mesh.position.distanceTo(playerPos);
      if (dist < CONTACT_RADIUS) {
        totalDamage += CONTACT_DAMAGE_PER_SECOND * delta;
      }
    }
    return totalDamage;
  }

  public getEnemyMeshes(): { id: string; mesh: THREE.Object3D }[] {
    return this.enemies
      .filter(e => e.alive)
      .map(e => ({ id: e.id, mesh: e.mesh }));
  }

  public aliveCount(): number {
    return this.enemies.filter(e => e.alive).length;
  }

  public allDead(): boolean {
    return this.enemies.every(e => !e.alive);
  }

  private collides(x: number, z: number, r: number): boolean {
    return this.collider(x - r, z - r)
      || this.collider(x + r, z - r)
      || this.collider(x - r, z + r)
      || this.collider(x + r, z + r);
  }

  private createEnemyMesh(): THREE.Group {
    const group = new THREE.Group();

    // Body - angular humanoid shape
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.4, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2a0a1a,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xff3ea5,
      emissiveIntensity: 0.5,
      transparent: true,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.2;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeo = new THREE.OctahedronGeometry(0.3, 0);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xff3ea5,
      emissive: 0xff3ea5,
      emissiveIntensity: 2,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.2;
    head.castShadow = true;
    group.add(head);

    // Eye visor
    const visorGeo = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 3,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.25, -0.2);
    group.add(visor);

    // Arms
    for (const side of [-1, 1]) {
      const armGeo = new THREE.BoxGeometry(0.2, 1.0, 0.2);
      const armMat = new THREE.MeshStandardMaterial({
        color: 0x1a0a1a,
        metalness: 0.8,
        roughness: 0.3,
      });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(side * 0.55, 1.1, 0);
      group.add(arm);
    }

    // Legs
    for (const side of [-1, 1]) {
      const legGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
      const legMat = new THREE.MeshStandardMaterial({
        color: 0x1a0a1a,
        metalness: 0.8,
        roughness: 0.3,
      });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(side * 0.2, 0.4, 0);
      group.add(leg);
    }

    // Health bar background
    const hpBgGeo = new THREE.PlaneGeometry(1, 0.1);
    const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const hpBg = new THREE.Mesh(hpBgGeo, hpBgMat);
    hpBg.position.y = 2.8;
    group.add(hpBg);

    // Health bar fill
    const hpGeo = new THREE.PlaneGeometry(1, 0.08);
    const hpMat = new THREE.MeshBasicMaterial({ color: 0xff3ea5, side: THREE.DoubleSide });
    const hp = new THREE.Mesh(hpGeo, hpMat);
    hp.position.y = 2.8;
    hp.position.z = -0.01;
    hp.name = 'healthBar';
    group.add(hp);

    return group;
  }

  private spawnDeathEffect(position: THREE.Vector3): void {
    // Particle burst
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y + 1;
      positions[i * 3 + 2] = position.z;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6,
        (Math.random() - 0.5) * 8,
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xff3ea5,
      size: 0.2,
      transparent: true,
    });
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    // Animate particles
    const startTime = Date.now();
    const animateParticles = (): void => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 1.5) {
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
        return;
      }

      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x * 0.016;
        posArray[i * 3 + 1] += velocities[i].y * 0.016;
        posArray[i * 3 + 2] += velocities[i].z * 0.016;
        velocities[i].y -= 9.8 * 0.016;
      }
      geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - elapsed / 1.5;

      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // Flash light
    const flash = new THREE.PointLight(0xff3ea5, 20, 10);
    flash.position.copy(position).y += 1;
    this.scene.add(flash);

    let flashIntensity = 20;
    const fadeFlash = (): void => {
      flashIntensity *= 0.9;
      flash.intensity = flashIntensity;
      if (flashIntensity > 0.1) {
        requestAnimationFrame(fadeFlash);
      } else {
        this.scene.remove(flash);
      }
    };
    fadeFlash();
  }
}
