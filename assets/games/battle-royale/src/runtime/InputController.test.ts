import { beforeEach, describe, expect, it } from 'vitest';

import { InputController } from './InputController';

class FakeWindow extends EventTarget {}

class FakeDocument extends EventTarget {
  public pointerLockElement: HTMLElement | null = null;
}

class FakeSurface extends EventTarget {
  public tabIndex = -1;
  public focusCalls = 0;
  public requestPointerLockCalls = 0;

  public focus(): void {
    this.focusCalls += 1;
  }

  public requestPointerLock(): void {
    this.requestPointerLockCalls += 1;
  }
}

const defineEventProperty = <T, K extends keyof T>(event: Event, key: K, value: T[K]): void => {
  Object.defineProperty(event, key, {
    configurable: true,
    value,
  });
};

describe('InputController', () => {
  let fakeWindow: FakeWindow;
  let fakeDocument: FakeDocument;
  let surface: FakeSurface;

  beforeEach(() => {
    fakeWindow = new FakeWindow();
    fakeDocument = new FakeDocument();
    surface = new FakeSurface();

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: fakeWindow as unknown as Window & typeof globalThis,
    });

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: fakeDocument as unknown as Document,
    });
  });

  it('requests pointer lock on click and converts locked mouse movement into look delta', () => {
    const input = new InputController();
    input.attachSurface(surface as unknown as HTMLElement);

    surface.dispatchEvent(new Event('click'));

    expect(surface.focusCalls).toBe(1);
    expect(surface.requestPointerLockCalls).toBe(1);
    expect(surface.tabIndex).toBe(0);

    fakeDocument.pointerLockElement = surface as unknown as HTMLElement;
    fakeDocument.dispatchEvent(new Event('pointerlockchange'));

    const mouseMove = new Event('mousemove');
    defineEventProperty<MouseEvent, 'movementX'>(mouseMove, 'movementX', 24);
    fakeWindow.dispatchEvent(mouseMove);

    expect(input.isPointerLocked()).toBe(true);
    expect(input.consumeLookDelta()).toBeCloseTo(0.048, 5);
    expect(input.consumeLookDelta()).toBe(0);

    input.destroy();
  });

  it('ignores mouse movement when pointer lock is inactive', () => {
    const input = new InputController();
    input.attachSurface(surface as unknown as HTMLElement);

    const mouseMove = new Event('mousemove');
    defineEventProperty<MouseEvent, 'movementX'>(mouseMove, 'movementX', 30);
    fakeWindow.dispatchEvent(mouseMove);

    expect(input.isPointerLocked()).toBe(false);
    expect(input.consumeLookDelta()).toBe(0);

    input.destroy();
  });
});
