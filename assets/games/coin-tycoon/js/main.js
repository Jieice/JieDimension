/**
 * 游戏主入口
 * 初始化所有系统并启动游戏
 */

import { GameState } from './core/state.js';
import { setupGlobalErrorHandler, GameError } from './core/error.js';
import { 
  GAME_CONFIG, 
  UPGRADE_CONFIG, 
  SKILL_CONFIG, 
  PET_CONFIG, 
  RESEARCH_CONFIG,
  CHAPTER_CONFIG,
  ACHIEVEMENT_CONFIG,
  DAILY_TASK_CONFIG,
  TIME_CHALLENGE_CONFIG,
  CHAPTER_THEMES
} from './constants.js';
import { save, load, AutoSaveManager } from './utils/storage.js';
import { snd, resumeAudioContext } from './utils/sound.js';
import { $, createElement, delegate } from './utils/dom.js';

// 导入系统模块
import * as UpgradeSystem from './systems/upgrades.js';
import * as BossSystem from './systems/boss.js';
import * as PetSystem from './systems/pets.js';
import { recalculateDerivedStats } from './systems/derived-stats.js';

/**
 * 创建初始游戏状态
 */
export function createInitialState() {
  return {
    coins: 0,
    totalEarned: 0,
    lifetimeEarned: 0,
    clickPower: 1,
    coinsPerSecond: 0,
    critChance: 5,
    critDamage: 2,
    globalMultiplier: 1,
    soundOn: true,
    theme: 'gold',
    backgroundEnabled: true,
    buyMultiplier: 1,
    
    player: {
      level: 1,
      exp: 0,
      expNext: 100,
      title: '新手矿工',
      avatar: '🧑‍💼'
    },
    
    chapters: CHAPTER_CONFIG.GOALS.map((goal, i) => ({
      id: i + 1,
      name: CHAPTER_CONFIG.NAMES[i],
      goal,
      done: false
    })),
    curChapter: 0,
    
    boss: {
      name: '矿洞守护者',
      avatar: '👹',
      hp: 1000,
      maxHp: 1000,
      reward: 500,
      gemReward: 1,
      matReward: 1,
      level: 1,
      defeated: 0
    },
    
    materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 },
    inventory: [],
    gachaTix: 0,
    gachaPity: { sr: 0, ssr: 0 },
    
    equipment: {
      weapon: { id: null, name: '无', icon: '⚔️', bonus: 0, level: 0 },
      armor: { id: null, name: '无', icon: '🛡️', bonus: 0, level: 0 },
      ring: { id: null, name: '无', icon: '💍', bonus: 0, level: 0 }
    },
    
    upgrades: Object.fromEntries(
      Object.entries(UPGRADE_CONFIG).map(([key, config]) => [
        key, 
        { level: 0, base: config.base, mult: config.mult, eff: config.eff }
      ])
    ),
    
    skills: [...SKILL_CONFIG],
    pets: PET_CONFIG.map(p => ({ ...p, owned: false, active: false, level: 1 })),
    research: [...RESEARCH_CONFIG],
    achievements: [...ACHIEVEMENT_CONFIG],
    dailyTasks: [...DAILY_TASK_CONFIG],
    
    prestige: { points: 0, mult: 1, count: 0 },
    rebirth: { count: 0, mult: 1, essence: 0 },
    
    stats: {
      clicks: 0,
      crits: 0,
      playTime: 0,
      gachaTotal: 0,
      expCompleted: 0,
      wbossDmg: 0
    },
    
    abilities: {
      frenzy: { cd: 0, dur: 10, base: 30, on: false },
      golden: { cd: 0, dur: 15, base: 60, on: false },
      lucky: { cd: 0, dur: 20, base: 90, on: false },
      mg: { cd: 0, base: 60 }
    },
    
    events: { active: null, timer: 0, mult: 1 },
    combo: { count: 0, timer: null, last: 0 },
    autoClicks: 0,
    abyss: {
      currentFloor: 0,
      highestFloor: 0,
      enemy: null,
      rewards: {
        essence: 0,
        materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 },
        gachaTix: 0
      },
      cooldown: 0
    },
    
    qolSettings: {
      autoBuyEnabled: false,
      autoBuyInterval: 5000,
      autoCollectEnabled: false,
      showRecommendations: true,
      compactMode: false
    },
    
    autoBuy: {
      enabled: false,
      interval: 5000,
      priority: ['click', 'worker', 'factory', 'bank', 'ai', 'crit', 'critdmg', 'synergy'],
      lastRun: 0
    },
    
    lastSave: Date.now()
  };
}

/**
 * 游戏类
 */
class Game {
  constructor() {
    this.state = GameState;
    this.autoSaveManager = null;
    this.gameLoopId = null;
  }
  
  /**
   * 初始化游戏
   */
  init() {
    setupGlobalErrorHandler();
    
    const initialState = createInitialState();
    this.state.init(initialState);
    
    const loaded = this.state.loadFromSave();
    if (!loaded) {
      console.log('No save found, using initial state');
    }
    recalculateDerivedStats();
    
    this.autoSaveManager = new AutoSaveManager(() => this.state.save());
    this.autoSaveManager.start();
    
    this.startGameLoop();
    this.setupEventListeners();
    
    console.log('Game initialized');
  }
  
  /**
   * 启动游戏循环
   */
  startGameLoop() {
    this.gameLoopId = setInterval(() => this.gameLoop(), GAME_CONFIG.GAME_LOOP_INTERVAL);
  }
  
  /**
   * 游戏循环
   */
  gameLoop() {
    const cps = this.state.get('coinsPerSecond') || 0;
    if (cps > 0) {
      this.state.increment('coins', cps / 10);
      this.state.increment('totalEarned', cps / 10);
      this.state.increment('lifetimeEarned', cps / 10);
    }
    
    this.state.increment('stats.playTime');
    
    this.updateUI();
  }
  
  /**
   * 更新UI
   */
  updateUI() {
    const coins = this.state.get('coins') || 0;
    const cps = this.state.get('coinsPerSecond') || 0;
    const clickPower = this.state.get('clickPower') || 1;
    
    const coinsEl = $('hd-coins');
    const cpsEl = $('hd-cps');
    
    if (coinsEl) coinsEl.textContent = this.formatNumber(coins);
    if (cpsEl) cpsEl.textContent = this.formatNumber(cps);
  }
  
  /**
   * 格式化数字
   */
  formatNumber(n) {
    if (n < 1000) return Math.floor(n).toString();
    if (n < 1000000) return (n / 1000).toFixed(2) + 'K';
    if (n < 1000000000) return (n / 1000000).toFixed(2) + 'M';
    return (n / 1000000000).toFixed(2) + 'B';
  }
  
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    document.addEventListener('click', () => {
      resumeAudioContext();
    }, { once: true });
  }
  
  /**
   * 处理点击
   */
  handleClick() {
    const clickPower = this.state.get('clickPower') || 1;
    const critChance = this.state.get('critChance') || 5;
    const critDamage = this.state.get('critDamage') || 2;
    
    let earned = clickPower;
    let isCrit = false;
    
    if (Math.random() * 100 < critChance) {
      earned *= critDamage;
      isCrit = true;
      this.state.increment('stats.crits');
      snd('crit');
    } else {
      snd('coin');
    }
    
    this.state.increment('coins', earned);
    this.state.increment('totalEarned', earned);
    this.state.increment('lifetimeEarned', earned);
    this.state.increment('stats.clicks');
    
    return { earned, isCrit };
  }
  
  /**
   * 保存游戏
   */
  save() {
    return this.state.save();
  }
  
  /**
   * 重置游戏
   */
  reset() {
    if (confirm('确定重置？所有进度将丢失！')) {
      localStorage.removeItem(GAME_CONFIG.SAVE_KEY);
      location.reload();
    }
  }
}

// 导出游戏实例
export const game = new Game();

// 自动初始化
if (typeof window !== 'undefined') {
  window.game = game;
  window.addEventListener('DOMContentLoaded', () => {
    game.init();
  });
}
