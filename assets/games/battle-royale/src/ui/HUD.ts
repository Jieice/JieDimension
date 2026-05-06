export interface HUDState {
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  enemyCount: number;
}

export class HUD {
  private container: HTMLElement;
  private healthBar: HTMLElement;
  private healthText: HTMLElement;
  private ammoText: HTMLElement;
  private enemyText: HTMLElement;
  private crosshair: HTMLElement;
  private hitMarker: HTMLElement;
  private damageOverlay: HTMLElement;
  private deathScreen: HTMLElement;
  private victoryScreen: HTMLElement;

  constructor() {
    // Create HUD container
    this.container = document.createElement('div');
    this.container.id = 'hud';
    this.container.style.cssText = `
      position: fixed; inset: 0; z-index: 50;
      pointer-events: none; font-family: 'Courier New', monospace;
      color: #f7fbff;
    `;
    document.body.appendChild(this.container);

    // Crosshair
    this.crosshair = this.createCrosshair();

    // Health bar
    this.healthBar = this.createHealthBar();
    this.healthText = this.createText('100', '12px', 'left: 20px; bottom: 60px;');
    this.container.appendChild(this.healthText);

    // Ammo
    this.ammoText = this.createText('30 / 30', '14px', 'right: 20px; bottom: 20px;');
    this.ammoText.style.color = '#6ee7ff';
    this.container.appendChild(this.ammoText);

    // Enemy count
    this.enemyText = this.createText('HOSTILES: 5', '12px', 'right: 20px; bottom: 50px;');
    this.enemyText.style.color = '#ff3ea5';
    this.container.appendChild(this.enemyText);

    // Hit marker
    this.hitMarker = document.createElement('div');
    this.hitMarker.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 20px; height: 20px;
      opacity: 0; transition: opacity 0.1s;
    `;
    this.hitMarker.innerHTML = `
      <svg viewBox="0 0 20 20" width="20" height="20">
        <line x1="3" y1="3" x2="8" y2="8" stroke="#ffd166" stroke-width="2"/>
        <line x1="17" y1="3" x2="12" y2="8" stroke="#ffd166" stroke-width="2"/>
        <line x1="3" y1="17" x2="8" y2="12" stroke="#ffd166" stroke-width="2"/>
        <line x1="17" y1="17" x2="12" y2="12" stroke="#ffd166" stroke-width="2"/>
      </svg>
    `;
    this.container.appendChild(this.hitMarker);

    // Damage overlay
    this.damageOverlay = document.createElement('div');
    this.damageOverlay.style.cssText = `
      position: fixed; inset: 0;
      background: radial-gradient(ellipse at center, transparent 50%, rgba(255, 32, 78, 0.4) 100%);
      opacity: 0; transition: opacity 0.3s;
      pointer-events: none;
    `;
    this.container.appendChild(this.damageOverlay);

    // Death screen
    this.deathScreen = document.createElement('div');
    this.deathScreen.style.cssText = `
      position: fixed; inset: 0; z-index: 60;
      display: none; align-items: center; justify-content: center;
      background: rgba(139, 3, 3, 0.6);
      backdrop-filter: blur(4px);
    `;
    this.deathScreen.innerHTML = `
      <div style="text-align: center;">
        <h1 style="font-size: 3rem; color: #ff6b6b; letter-spacing: 6px;">ELIMINATED</h1>
        <p style="color: #ff6b6b; margin-top: 1rem; letter-spacing: 2px;">LIFE SIGNS LOST</p>
      </div>
    `;
    document.body.appendChild(this.deathScreen);

    // Victory screen
    this.victoryScreen = document.createElement('div');
    this.victoryScreen.style.cssText = `
      position: fixed; inset: 0; z-index: 60;
      display: none; align-items: center; justify-content: center;
      background: rgba(5, 7, 13, 0.7);
      backdrop-filter: blur(4px);
    `;
    this.victoryScreen.innerHTML = `
      <div style="text-align: center;">
        <h1 style="font-size: 3rem; color: #ffd166; letter-spacing: 6px;">SECTOR CLEARED</h1>
        <p style="color: #6ee7ff; margin-top: 1rem; letter-spacing: 2px;">ALL HOSTILES ELIMINATED</p>
      </div>
    `;
    document.body.appendChild(this.victoryScreen);

    // Scanline overlay
    const scanlines = document.createElement('div');
    scanlines.style.cssText = `
      position: fixed; inset: 0; z-index: 51;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px
      );
      pointer-events: none;
    `;
    document.body.appendChild(scanlines);
  }

  public update(state: HUDState): void {
    const healthPct = (state.health / state.maxHealth) * 100;
    this.healthBar.style.width = `${healthPct}%`;

    if (healthPct <= 30) {
      this.healthBar.style.background = '#ff204e';
    } else if (healthPct <= 60) {
      this.healthBar.style.background = '#ffd166';
    } else {
      this.healthBar.style.background = '#6ee7ff';
    }

    this.healthText.textContent = `HP ${Math.ceil(state.health)}`;
    this.ammoText.textContent = `${state.ammo} / ${state.maxAmmo}`;
    this.enemyText.textContent = `HOSTILES: ${state.enemyCount}`;
  }

  public showHitMarker(): void {
    this.hitMarker.style.opacity = '1';
    setTimeout(() => { this.hitMarker.style.opacity = '0'; }, 150);
  }

  public showMissMarker(): void {
    // Brief crosshair color change handled via CSS
  }

  public showDamageIndicator(): void {
    this.damageOverlay.style.opacity = '1';
    setTimeout(() => { this.damageOverlay.style.opacity = '0'; }, 400);
  }

  public showDeathScreen(): void {
    this.deathScreen.style.display = 'flex';
  }

  public showVictoryScreen(): void {
    this.victoryScreen.style.display = 'flex';
  }

  private createCrosshair(): HTMLElement {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 24px; height: 24px;
    `;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <line x1="12" y1="4" x2="12" y2="10" stroke="#ff3ea5" stroke-width="1.5" opacity="0.8"/>
        <line x1="12" y1="14" x2="12" y2="20" stroke="#ff3ea5" stroke-width="1.5" opacity="0.8"/>
        <line x1="4" y1="12" x2="10" y2="12" stroke="#ff3ea5" stroke-width="1.5" opacity="0.8"/>
        <line x1="14" y1="12" x2="20" y2="12" stroke="#ff3ea5" stroke-width="1.5" opacity="0.8"/>
        <circle cx="12" cy="12" r="2" fill="none" stroke="#ffd166" stroke-width="1" opacity="0.5"/>
      </svg>
    `;
    this.container.appendChild(el);
    return el;
  }

  private createHealthBar(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed; left: 20px; bottom: 30px;
      width: 200px; height: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(110, 231, 255, 0.3);
      border-radius: 2px; overflow: hidden;
    `;

    const bar = document.createElement('div');
    bar.style.cssText = `
      width: 100%; height: 100%;
      background: #6ee7ff;
      transition: width 0.3s, background 0.3s;
      box-shadow: 0 0 8px rgba(110, 231, 255, 0.5);
    `;
    wrapper.appendChild(bar);
    this.container.appendChild(wrapper);
    this.healthBar = bar;
    return bar;
  }

  private createText(text: string, size: string, position: string): HTMLElement {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; ${position}
      font-size: ${size}; letter-spacing: 1.5px;
      text-shadow: 0 0 8px rgba(110, 231, 255, 0.5);
    `;
    el.textContent = text;
    return el;
  }
}
