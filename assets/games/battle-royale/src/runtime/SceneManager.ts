import { Container } from 'pixi.js';

import type { Scene } from './Scene';

type SceneWithContainer = Scene & { container: Container };

export class SceneManager {
  private currentScene: SceneWithContainer | null = null;

  public constructor(private readonly root: Container) {}

  public setScene(scene: SceneWithContainer): void {
    if (this.currentScene) {
      this.root.removeChild(this.currentScene.container);
    }

    this.currentScene = scene;
    this.root.addChild(scene.container);
  }

  public resize(width: number, height: number): void {
    this.currentScene?.resize(width, height);
  }

  public update(deltaSeconds: number): void {
    this.currentScene?.update(deltaSeconds);
  }
}
