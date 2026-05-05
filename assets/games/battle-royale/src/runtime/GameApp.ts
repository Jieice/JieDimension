import { Application, Container } from 'pixi.js';

import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';
import { InputController } from './InputController';
import { SceneManager } from './SceneManager';

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export class GameApp {
  private readonly app = new Application();
  private readonly stage = new Container();
  private readonly input = new InputController();
  private readonly sceneManager = new SceneManager(this.stage);

  public constructor(private readonly host: HTMLElement) {}

  public async start(): Promise<void> {
    await this.app.init({
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      antialias: true,
      background: '#05070d',
      resolution: Math.max(window.devicePixelRatio || 1, 1),
      autoDensity: true,
    });

    this.host.replaceChildren(this.app.canvas);
    this.input.attachSurface(this.app.canvas);
    this.host.dataset.ready = 'true';

    const bootScene = new BootScene(BASE_WIDTH, BASE_HEIGHT, this.input, () => {
      this.sceneManager.setScene(new GameScene(BASE_WIDTH, BASE_HEIGHT, this.input));
      this.sceneManager.resize(window.innerWidth, window.innerHeight);
    });

    this.app.stage.addChild(this.stage);
    this.sceneManager.setScene(bootScene);
    this.sceneManager.resize(window.innerWidth, window.innerHeight);

    this.app.ticker.add((ticker) => {
      this.sceneManager.update(ticker.deltaMS / 1000);
    });

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  private readonly handleResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.renderer.resize(width, height);
    this.sceneManager.resize(width, height);
  };
}
