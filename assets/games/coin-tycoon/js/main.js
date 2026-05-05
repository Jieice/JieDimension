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
import { save, load, AutoSaveManager, calculateOfflineEarnings } from './utils/storage.js';
import { snd, resumeAudioContext, setSoundEnabled } from './utils/sound.js';
import { $, createElement, delegate } from './utils/dom.js';
import { fmt } from './utils/format.js';

// 导入系统模块
import * as UpgradeSystem from './systems/upgrades.js';
import * as BossSystem from './systems/boss.js';
import * as PetSystem from './systems/pets.js';
import { recalculateDerivedStats } from './systems/derived-stats.js';

// 导入UI模块
import {
  updateFullUI,
  renderAllTabs,
  setupAllEventListeners,
  showNumberPop,
  spawnParticles,
  notify,
  checkAchievements,
  checkChapterProgress,
  addExp,
  updateDailyProgress,
  processAutoBuy,
  processExpeditionTimers,
  processAbyssCooldown
} from './ui.js';

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
    gems: 0,
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

    skills: SKILL_CONFIG.map(s => ({ ...s })),
    pets: PET_CONFIG.map(p => ({ ...p, owned: false, active: false, level: 1 })),
    research: RESEARCH_CONFIG.map(r => ({ ...r })),
    achievements: ACHIEVEMENT_CONFIG.map(a => ({ ...a })),
    dailyTasks: DAILY_TASK_CONFIG.map(d => ({ ...d, progress: 0, claimed: false })),

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

    worldBoss: {
      name: '深渊领主',
      hp: 10000,
      maxHp: 10000,
      level: 1,
      timer: 3600,
      active: true
    },

    expeditionState: {},

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
    this.tickCount = 0;
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

    // 确保新字段存在（兼容旧存档）
    this.migrateSave();

    recalculateDerivedStats();

    // 离线收益
    if (loaded) {
      this.processOfflineEarnings();
    }

    // 恢复音效设置
    const soundOn = this.state.get('soundOn');
    if (soundOn !== undefined) {
      setSoundEnabled(soundOn);
    }

    this.autoSaveManager = new AutoSaveManager(() => this.state.save());
    this.autoSaveManager.start();

    this.startGameLoop();
    this.setupEventListeners();

    // 渲染所有UI
    renderAllTabs();
    updateFullUI();

    console.log('Game initialized');
  }

  /**
   * 兼容旧存档，确保新字段存在
   */
  migrateSave() {
    // gems 字段
    if (this.state.get('gems') === undefined) {
      this.state.set('gems', 0);
    }
    // worldBoss 字段
    if (!this.state.get('worldBoss')) {
      this.state.set('worldBoss', {
        name: '深渊领主', hp: 10000, maxHp: 10000, level: 1, timer: 3600, active: true
      });
    }
    // expeditionState 字段
    if (!this.state.get('expeditionState')) {
      this.state.set('expeditionState', {});
    }
    // dailyTasks progress 字段
    const tasks = this.state.get('dailyTasks') || [];
    tasks.forEach(t => {
      if (t.progress === undefined) t.progress = 0;
      if (t.claimed === undefined) t.claimed = false;
    });
    this.state.set('dailyTasks', tasks);
  }

  /**
   * 处理离线收益
   */
  processOfflineEarnings() {
    const state = this.state.getState();
    const offline = calculateOfflineEarnings(state);
    if (offline.earnings > 0) {
      this.state.increment('coins', offline.earnings);
      this.state.increment('totalEarned', offline.earnings);
      this.state.increment('lifetimeEarned', offline.earnings);
      notify(`离线收益: +${fmt(offline.earnings)} 金币 (${formatTime(offline.offlineTime)})`, 'success');
    }
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

    // 自动点击
    const autoClicks = this.state.get('autoClicks') || 0;
    if (autoClicks > 0) {
      for (let i = 0; i < autoClicks; i++) {
        this.handleClick(true);
      }
    }

    this.tickCount++;

    // 每10 tick (1秒) 更新一次UI（减少DOM操作）
    if (this.tickCount % 10 === 0) {
      updateFullUI();
      checkChapterProgress();
      processAutoBuy();
      processAbyssCooldown();
    }

    // 每30 tick (3秒) 检查一次远征和成就
    if (this.tickCount % 30 === 0) {
      processExpeditionTimers();
      checkAchievements();
    }
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    // 恢复 AudioContext
    document.addEventListener('click', () => {
      resumeAudioContext();
    }, { once: true });

    // 设置所有UI事件
    setupAllEventListeners(this);
  }

  /**
   * 处理点击
   */
  handleClick(isAuto = false) {
    const clickPower = this.state.get('clickPower') || 1;
    const critChance = this.state.get('critChance') || 5;
    const critDamage = this.state.get('critDamage') || 2;

    let earned = clickPower;
    let isCrit = false;

    if (Math.random() * 100 < critChance) {
      earned *= critDamage;
      isCrit = true;
      this.state.increment('stats.crits');
      if (!isAuto) snd('crit');
    } else {
      if (!isAuto) snd('coin');
    }

    this.state.increment('coins', earned);
    this.state.increment('totalEarned', earned);
    this.state.increment('lifetimeEarned', earned);
    this.state.increment('stats.clicks');

    // 经验值（每次点击获得少量经验）
    addExp(1);

    // 日常任务
    if (!isAuto) {
      updateDailyProgress('clicks', 1);
      updateDailyProgress('earn', earned);
    }

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

// 导入格式化时间（用于离线收益显示）
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}小时${m}分钟`;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

// 导出游戏实例
export const game = new Game();

// 自动初始化
if (typeof window !== 'undefined') {
  window.game = game;
  window.showNumberPop = showNumberPop;
  window.addEventListener('DOMContentLoaded', () => {
    game.init();
  });
}
