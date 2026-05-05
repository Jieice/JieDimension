const PRESSED_KEYS = new Set<string>();

const POSITIVE_KEYS = ['KeyW', 'ArrowUp'];
const NEGATIVE_KEYS = ['KeyS', 'ArrowDown'];
const LEFT_KEYS = ['KeyA'];
const RIGHT_KEYS = ['KeyD'];
const TURN_LEFT_KEYS = ['ArrowLeft', 'KeyQ'];
const TURN_RIGHT_KEYS = ['ArrowRight', 'KeyE'];
const START_KEYS = ['Enter', 'Space'];
const FIRE_KEYS = ['Space'];
const MOUSE_TURN_SENSITIVITY = 0.002;

export class InputController {
  private surface: HTMLElement | null = null;
  private lookDelta = 0;
  private pointerLocked = false;

  public constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  public attachSurface(surface: HTMLElement): void {
    if (this.surface) {
      this.surface.removeEventListener('click', this.handleSurfaceClick);
    }

    this.surface = surface;
    this.surface.tabIndex = Math.max(this.surface.tabIndex, 0);
    this.surface.addEventListener('click', this.handleSurfaceClick);
  }

  public getMovementAxis(): number {
    return this.getAxis(POSITIVE_KEYS, NEGATIVE_KEYS);
  }

  public getStrafeAxis(): number {
    return this.getAxis(RIGHT_KEYS, LEFT_KEYS);
  }

  public getTurnAxis(): number {
    return this.getAxis(TURN_RIGHT_KEYS, TURN_LEFT_KEYS);
  }

  public isStartPressed(): boolean {
    return START_KEYS.some((code) => PRESSED_KEYS.has(code));
  }

  public isFirePressed(): boolean {
    return FIRE_KEYS.some((code) => PRESSED_KEYS.has(code));
  }

  public consumeLookDelta(): number {
    const delta = this.lookDelta;
    this.lookDelta = 0;
    return delta;
  }

  public isPointerLocked(): boolean {
    return this.pointerLocked;
  }

  public destroy(): void {
    if (this.surface) {
      this.surface.removeEventListener('click', this.handleSurfaceClick);
      this.surface = null;
    }

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    PRESSED_KEYS.clear();
    this.lookDelta = 0;
    this.pointerLocked = false;
  }

  private getAxis(positive: string[], negative: string[]): number {
    const forward = positive.some((code) => PRESSED_KEYS.has(code)) ? 1 : 0;
    const backward = negative.some((code) => PRESSED_KEYS.has(code)) ? 1 : 0;
    return forward - backward;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    PRESSED_KEYS.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    PRESSED_KEYS.delete(event.code);
  };

  private readonly handleBlur = (): void => {
    PRESSED_KEYS.clear();
    this.lookDelta = 0;
  };

  private readonly handleMouseMove = (event: MouseEvent): void => {
    if (!this.pointerLocked) {
      return;
    }

    this.lookDelta += event.movementX * MOUSE_TURN_SENSITIVITY;
  };

  private readonly handlePointerLockChange = (): void => {
    this.pointerLocked = document.pointerLockElement === this.surface;
    if (!this.pointerLocked) {
      this.lookDelta = 0;
    }
  };

  private readonly handleSurfaceClick = (): void => {
    if (!this.surface) {
      return;
    }

    this.surface.focus();
    this.surface.requestPointerLock();
  };
}
