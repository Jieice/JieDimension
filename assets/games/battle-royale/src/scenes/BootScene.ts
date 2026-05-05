import { Container, Graphics, Text } from 'pixi.js';

import type { InputController } from '../runtime/InputController';

export class BootScene {
  public readonly container = new Container();

  private readonly sky = new Graphics();
  private readonly overlay = new Graphics();
  private readonly title = new Text({
    text: 'CYBERSTORM ARENA',
    style: {
      fill: 0x6ee7ff,
      fontFamily: 'Arial',
      fontSize: 40,
      fontWeight: '700',
      letterSpacing: 6,
    },
  });
  private readonly subtitle = new Text({
    text: 'PRESS ENTER OR SPACE TO DROP IN',
    style: {
      fill: 0xb7c6d9,
      fontFamily: 'Arial',
      fontSize: 16,
      letterSpacing: 1.5,
    },
  });
  private readonly hud = new Text({
    text: 'PHASE 2 READY\nWASD MOVE · SPACE FIRE\nENTER / SPACE START',
    style: {
      fill: 0xf7fbff,
      fontFamily: 'Arial',
      fontSize: 14,
      letterSpacing: 1.2,
    },
  });
  private elapsed = 0;
  private viewportWidth: number;
  private viewportHeight: number;
  private started = false;

  public constructor(
    private readonly baseWidth: number,
    private readonly baseHeight: number,
    private readonly input: InputController,
    private readonly onStart: () => void,
  ) {
    this.viewportWidth = baseWidth;
    this.viewportHeight = baseHeight;
    this.container.addChild(this.sky, this.overlay, this.title, this.subtitle, this.hud);
  }

  public resize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.drawScene();

    this.title.anchor.set(0.5);
    this.title.position.set(width / 2, height * 0.16);

    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(width / 2, height * 0.25);

    this.hud.anchor.set(0.5);
    this.hud.position.set(width / 2, height * 0.62);
  }

  public update(deltaSeconds: number): void {
    this.elapsed += deltaSeconds;

    if (!this.started && this.input.isStartPressed()) {
      this.started = true;
      this.onStart();
      return;
    }

    this.drawScene();

    const pulse = 0.78 + Math.sin(this.elapsed * 2.4) * 0.12;
    this.title.alpha = pulse;
    this.subtitle.alpha = 0.65 + Math.sin(this.elapsed * 1.8) * 0.08;
    this.overlay.alpha = 0.18 + Math.sin(this.elapsed * 4) * 0.03;
  }

  private drawScene(): void {
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const horizon = height * 0.5;

    this.sky.clear();
    this.sky.rect(0, 0, width, horizon).fill({ color: 0x05070d, alpha: 1 });
    this.sky.rect(0, horizon, width, height - horizon).fill({ color: 0x070b14, alpha: 1 });
    this.sky.circle(width * 0.76, height * 0.18, Math.min(width, height) * 0.085).fill(0xff3ea5);
    this.sky.stroke({ color: 0x6ee7ff, alpha: 0.22, width: 4 });

    this.overlay.clear();
    for (let y = 0; y < height; y += 6) {
      this.overlay.rect(0, y, width, 2).fill({ color: 0xffffff, alpha: 0.05 });
    }

    this.overlay.rect(0, 0, width, height).stroke({ color: 0x6ee7ff, alpha: 0.16, width: 3 });

    const scale = Math.min(width / this.baseWidth, height / this.baseHeight);
    this.title.scale.set(Math.max(scale, 0.75));
    this.subtitle.scale.set(Math.max(scale, 0.85));
    this.hud.scale.set(Math.max(scale, 0.9));
  }
}
