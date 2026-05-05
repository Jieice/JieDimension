export interface Scene {
  resize(width: number, height: number): void;
  update(deltaSeconds: number): void;
}
