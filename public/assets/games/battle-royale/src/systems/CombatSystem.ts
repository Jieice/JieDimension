import * as THREE from 'three';

const MAX_RANGE = 100;

interface TimedEffect {
  startTime: number;
  duration: number;
  update: (elapsed: number, progress: number) => boolean; // returns false when done
  cleanup: () => void;
}

export class CombatSystem {
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private raycaster = new THREE.Raycaster();

  // Impact decal pool
  private impactPool: THREE.Mesh[] = [];
  private impactIndex = 0;

  // Timed effects (tracers, impacts)
  private effects: TimedEffect[] = [];

  constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;

    // Pre-create impact decals
    const decalGeo = new THREE.CircleGeometry(0.15, 8);
    const decalMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    for (let i = 0; i < 10; i++) {
      const decal = new THREE.Mesh(decalGeo, decalMat.clone());
      decal.visible = false;
      this.scene.add(decal);
      this.impactPool.push(decal);
    }
  }

  public update(): void {
    const now = Date.now();
    this.effects = this.effects.filter((fx) => {
      const elapsed = (now - fx.startTime) / 1000;
      if (elapsed >= fx.duration) {
        fx.cleanup();
        return false;
      }
      return fx.update(elapsed, elapsed / fx.duration);
    });
  }

  public shoot(enemies: { id: string; mesh: THREE.Object3D }[]): { id: string } | null {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    this.raycaster.far = MAX_RANGE;

    const meshes = enemies.map(e => e.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      let hitObject = hit.object;
      while (hitObject.parent && !meshes.includes(hitObject)) {
        hitObject = hitObject.parent;
      }

      const enemy = enemies.find(e => e.mesh === hitObject);
      if (enemy) {
        this.spawnImpact(hit.point, hit.face?.normal);
        this.spawnTracer(hit.point);
        return { id: enemy.id };
      }
    }

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const endPoint = this.camera.position.clone().add(dir.multiplyScalar(MAX_RANGE));
    this.spawnTracer(endPoint);

    return null;
  }

  private spawnImpact(position: THREE.Vector3, normal?: THREE.Vector3): void {
    const decal = this.impactPool[this.impactIndex];
    this.impactIndex = (this.impactIndex + 1) % this.impactPool.length;

    decal.position.copy(position);
    if (normal) {
      decal.position.addScaledVector(normal, 0.01);
      decal.lookAt(position.clone().add(normal));
    }
    decal.visible = true;

    const mat = decal.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.8;

    const startTime = Date.now();
    this.effects.push({
      startTime,
      duration: 0.5,
      update: (_elapsed, progress) => {
        mat.opacity = 0.8 * (1 - progress);
        return true;
      },
      cleanup: () => { decal.visible = false; },
    });
  }

  private spawnTracer(endPoint: THREE.Vector3): void {
    const start = this.camera.position.clone();
    const geo = new THREE.BufferGeometry().setFromPoints([start, endPoint]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.6,
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);

    this.effects.push({
      startTime: Date.now(),
      duration: 0.08,
      update: (_elapsed, progress) => {
        mat.opacity = 0.6 * (1 - progress);
        return true;
      },
      cleanup: () => {
        this.scene.remove(line);
        geo.dispose();
        mat.dispose();
      },
    });
  }
}
