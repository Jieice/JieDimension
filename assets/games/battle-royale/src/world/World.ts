import * as THREE from 'three';

// Map layout: 0 = empty, 1 = wall, 2 = special wall
const MAP_DATA: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const CELL_SIZE = 4;
const WALL_HEIGHT = 5;

export class World {
  private scene: THREE.Scene;
  private collider: (x: number, z: number) => boolean;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.collider = this.buildCollider();
    this.buildScene();
    this.addLighting();
  }

  public getCollider(): (x: number, z: number) => boolean {
    return this.collider;
  }

  private buildCollider(): (x: number, z: number) => boolean {
    return (x: number, z: number): boolean => {
      const mapX = Math.floor(x / CELL_SIZE);
      const mapZ = Math.floor(z / CELL_SIZE);
      if (mapX < 0 || mapZ < 0 || mapX >= MAP_DATA[0].length || mapZ >= MAP_DATA.length) {
        return true;
      }
      return MAP_DATA[mapZ][mapX] !== 0;
    };
  }

  private buildScene(): void {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(MAP_DATA[0].length * CELL_SIZE, MAP_DATA.length * CELL_SIZE);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      metalness: 0.8,
      roughness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(
      (MAP_DATA[0].length * CELL_SIZE) / 2,
      0,
      (MAP_DATA.length * CELL_SIZE) / 2,
    );
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Grid lines on floor (cyberpunk style)
    const gridHelper = new THREE.GridHelper(
      Math.max(MAP_DATA[0].length, MAP_DATA.length) * CELL_SIZE,
      Math.max(MAP_DATA[0].length, MAP_DATA.length) * 2,
      0x1a2744,
      0x0d1525,
    );
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);

    // Ceiling
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x080c16,
      metalness: 0.6,
      roughness: 0.6,
    });
    const ceiling = new THREE.Mesh(floorGeo.clone(), ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(
      (MAP_DATA[0].length * CELL_SIZE) / 2,
      WALL_HEIGHT,
      (MAP_DATA.length * CELL_SIZE) / 2,
    );
    this.scene.add(ceiling);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.7,
      roughness: 0.3,
    });

    const specialWallMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a2e,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xff3ea5,
      emissiveIntensity: 0.15,
    });

    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7ff,
      emissive: 0x6ee7ff,
      emissiveIntensity: 1.5,
    });

    const neonPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff3ea5,
      emissive: 0xff3ea5,
      emissiveIntensity: 1.5,
    });

    for (let z = 0; z < MAP_DATA.length; z++) {
      for (let x = 0; x < MAP_DATA[z].length; x++) {
        const cell = MAP_DATA[z][x];
        if (cell === 0) continue;

        const mat = cell === 2 ? specialWallMat : wallMat;
        const wallGeo = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
        const wall = new THREE.Mesh(wallGeo, mat);
        wall.position.set(
          x * CELL_SIZE + CELL_SIZE / 2,
          WALL_HEIGHT / 2,
          z * CELL_SIZE + CELL_SIZE / 2,
        );
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.scene.add(wall);

        // Neon edge strips on walls
        if (Math.random() > 0.6) {
          const stripGeo = new THREE.BoxGeometry(CELL_SIZE + 0.05, 0.08, 0.08);
          const stripMat = Math.random() > 0.5 ? neonCyanMat : neonPinkMat;
          const strip = new THREE.Mesh(stripGeo, stripMat);
          strip.position.set(
            x * CELL_SIZE + CELL_SIZE / 2,
            2.5 + Math.random() * 1.5,
            z * CELL_SIZE + CELL_SIZE / 2 - CELL_SIZE / 2 - 0.01,
          );
          this.scene.add(strip);
        }
      }
    }

    // Decorative pillars in open areas
    const pillarPositions = [
      [4, 4], [11, 4], [4, 11], [11, 11],
      [7.5, 2], [7.5, 13],
    ];
    for (const [px, pz] of pillarPositions) {
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, WALL_HEIGHT, 8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        metalness: 0.9,
        roughness: 0.2,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px * CELL_SIZE, WALL_HEIGHT / 2, pz * CELL_SIZE);
      pillar.castShadow = true;
      this.scene.add(pillar);

      // Neon ring around pillar
      const ringGeo = new THREE.TorusGeometry(0.45, 0.04, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x6ee7ff,
        emissive: 0x6ee7ff,
        emissiveIntensity: 2,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(px * CELL_SIZE, 1.5, pz * CELL_SIZE);
      ring.rotation.x = Math.PI / 2;
      this.scene.add(ring);
    }
  }

  private addLighting(): void {
    // Ambient
    const ambient = new THREE.AmbientLight(0x1a2744, 1.2);
    this.scene.add(ambient);

    // Overhead lights (cyberpunk colored)
    const lightPositions = [
      { pos: [8 * CELL_SIZE, WALL_HEIGHT - 0.5, 8 * CELL_SIZE], color: 0x6ee7ff, intensity: 30 },
      { pos: [4 * CELL_SIZE, WALL_HEIGHT - 0.5, 4 * CELL_SIZE], color: 0xff3ea5, intensity: 15 },
      { pos: [12 * CELL_SIZE, WALL_HEIGHT - 0.5, 12 * CELL_SIZE], color: 0xff3ea5, intensity: 15 },
      { pos: [4 * CELL_SIZE, WALL_HEIGHT - 0.5, 12 * CELL_SIZE], color: 0xffd166, intensity: 12 },
      { pos: [12 * CELL_SIZE, WALL_HEIGHT - 0.5, 4 * CELL_SIZE], color: 0xffd166, intensity: 12 },
    ];

    for (const light of lightPositions) {
      const pointLight = new THREE.PointLight(light.color, light.intensity, 30);
      pointLight.position.set(light.pos[0], light.pos[1], light.pos[2]);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 512;
      pointLight.shadow.mapSize.height = 512;
      this.scene.add(pointLight);

      // Light fixture visual
      const fixtureGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
      const fixtureMat = new THREE.MeshStandardMaterial({
        color: light.color,
        emissive: light.color,
        emissiveIntensity: 3,
      });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(light.pos[0], light.pos[1] + 0.1, light.pos[2]);
      this.scene.add(fixture);
    }

    // Hemisphere light for subtle fill
    const hemi = new THREE.HemisphereLight(0x6ee7ff, 0x05070d, 0.15);
    this.scene.add(hemi);
  }
}
