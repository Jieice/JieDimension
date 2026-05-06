import * as THREE from 'three';
import { InputManager } from './InputManager.js';
import { Player } from '../entities/Player.js';
import { World } from '../world/World.js';
import { EnemyManager } from '../systems/EnemyManager.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { HUD } from '../ui/HUD.js';

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private input: InputManager;
  private player: Player;
  private world: World;
  private enemies: EnemyManager;
  private combat: CombatSystem;
  private hud: HUD;
  private isLocked = false;
  private animationId = 0;

  constructor(host: HTMLElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    host.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070d);
    this.scene.fog = new THREE.FogExp2(0x05070d, 0.035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(2.5, 1.7, 1.5);

    // Systems
    this.input = new InputManager();
    this.world = new World(this.scene);
    this.player = new Player(this.camera, this.input, this.world.getCollider());
    this.enemies = new EnemyManager(this.scene, this.world.getCollider());
    this.combat = new CombatSystem(this.camera, this.scene);
    this.hud = new HUD();

    // Events
    this.input.onLockChange = (locked: boolean) => {
      this.isLocked = locked;
      const blocker = document.getElementById('blocker');
      if (blocker) blocker.style.display = locked ? 'none' : 'flex';
    };

    window.addEventListener('resize', this.handleResize);
  }

  public start(): void {
    this.animate();
  }

  public destroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
    this.input.destroy();
    this.renderer.dispose();
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.isLocked) {
      this.player.update(delta);
      this.enemies.update(delta, this.player.getPosition());

      // Combat
      if (this.input.wasFirePressed()) {
        const hit = this.combat.shoot(this.enemies.getEnemyMeshes());
        if (hit) {
          this.enemies.damageEnemy(hit.id, 34);
          this.hud.showHitMarker();
        } else {
          this.hud.showMissMarker();
        }
        this.player.onFire();
      }

      // Enemy contact damage
      const contactDamage = this.enemies.getContactDamage(this.player.getPosition(), delta);
      if (contactDamage > 0) {
        this.player.takeDamage(contactDamage);
        this.hud.showDamageIndicator();
      }

      // Check game over
      if (this.player.isDead()) {
        this.hud.showDeathScreen();
      }

      if (this.enemies.allDead()) {
        this.hud.showVictoryScreen();
      }
    }

    // Update HUD
    this.hud.update({
      health: this.player.getHealth(),
      maxHealth: 100,
      ammo: this.player.getAmmo(),
      maxAmmo: 30,
      enemyCount: this.enemies.aliveCount(),
    });

    this.renderer.render(this.scene, this.camera);
  };

  private readonly handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}
