import * as THREE from 'three';

const MAX_RANGE = 100;

export class CombatSystem {
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private raycaster = new THREE.Raycaster();

  // Impact decal pool
  private impactPool: THREE.Mesh[] = [];
  private impactIndex = 0;

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

  public shoot(enemies: { id: string; mesh: THREE.Object3D }[]): { id: string } | null {
    // Raycast from camera center
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    this.raycaster.far = MAX_RANGE;

    // Check hits against enemy meshes
    const meshes = enemies.map(e => e.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      // Find which enemy was hit
      let hitObject = hit.object;
      while (hitObject.parent && !meshes.includes(hitObject)) {
        hitObject = hitObject.parent;
      }

      const enemy = enemies.find(e => e.mesh === hitObject);
      if (enemy) {
        // Spawn impact at hit point
        this.spawnImpact(hit.point, hit.face?.normal);

        // Muzzle tracer
        this.spawnTracer(hit.point);

        return { id: enemy.id };
      }
    }

    // Miss - show tracer to max range
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

    // Fade out
    const mat = decal.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.8;

    const startTime = Date.now();
    const fade = (): void => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0.5) {
        decal.visible = false;
        return;
      }
      mat.opacity = 0.8 * (1 - elapsed / 0.5);
      requestAnimationFrame(fade);
    };
    fade();
  }

  private spawnTracer(endPoint: THREE.Vector3): void {
    const start = this.camera.position.clone();
    const direction = endPoint.clone().sub(start);
    const length = direction.length();

    const geo = new THREE.BufferGeometry().setFromPoints([start, endPoint]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x6ee7ff,
      transparent: true,
      opacity: 0.6,
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);

    // Quick fade
    const startTime = Date.now();
    const fade = (): void => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0.08) {
        this.scene.remove(line);
        geo.dispose();
        mat.dispose();
        return;
      }
      mat.opacity = 0.6 * (1 - elapsed / 0.08);
      requestAnimationFrame(fade);
    };
    fade();
  }
}
