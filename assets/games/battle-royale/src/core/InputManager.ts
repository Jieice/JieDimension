export class InputManager {
  private keys = new Set<string>();
  private mouseDeltaX = 0;
  private mouseDeltaY = 0;
  private firePressed = false;
  private fireConsumed = false;
  private _onLockChange: ((locked: boolean) => void) | null = null;

  public constructor() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);

    const blocker = document.getElementById('blocker');
    if (blocker) {
      blocker.addEventListener('click', this.requestLock);
    }
  }

  public set onLockChange(fn: (locked: boolean) => void) {
    this._onLockChange = fn;
  }

  public isLocked(): boolean {
    return document.pointerLockElement != null;
  }

  public getForward(): number {
    if (!this.isLocked()) return 0;
    return (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0)
         - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0);
  }

  public getStrafe(): number {
    if (!this.isLocked()) return 0;
    return (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
  }

  public consumeMouseDelta(): { x: number; y: number } {
    const dx = this.mouseDeltaX;
    const dy = this.mouseDeltaY;
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return { x: dx, y: dy };
  }

  public wasFirePressed(): boolean {
    if (this.firePressed && !this.fireConsumed) {
      this.fireConsumed = true;
      return true;
    }
    return false;
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  }

  private readonly requestLock = (): void => {
    this.renderer()?.requestPointerLock();
  };

  private renderer(): HTMLElement | null {
    return document.querySelector('canvas');
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    if (e.code === 'Space') e.preventDefault();
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (!this.isLocked()) return;
    this.mouseDeltaX += e.movementX;
    this.mouseDeltaY += e.movementY;
  };

  private readonly onMouseDown = (): void => {
    if (!this.isLocked()) {
      this.requestLock();
      return;
    }
    this.firePressed = true;
    this.fireConsumed = false;
  };

  private readonly onPointerLockChange = (): void => {
    this._onLockChange?.(this.isLocked());
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    this.firePressed = false;
    this.fireConsumed = false;
  };
}
