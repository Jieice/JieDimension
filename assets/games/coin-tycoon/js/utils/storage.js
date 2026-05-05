/**
 * 存储管理工具
 */

import { GAME_CONFIG, OFFLINE_CONFIG } from '../constants.js';

/**
 * 保存游戏状态
 * @param {Object} state - 游戏状态对象
 */
export function save(state) {
  try {
    state.lastSave = Date.now();
    const serialized = JSON.stringify(state);
    localStorage.setItem(GAME_CONFIG.SAVE_KEY, serialized);
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

/**
 * 加载游戏状态
 * @returns {Object|null} 游戏状态对象或null
 */
export function load() {
  try {
    const serialized = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

/**
 * 清除存档
 */
export function clearSave() {
  try {
    localStorage.removeItem(GAME_CONFIG.SAVE_KEY);
    return true;
  } catch (e) {
    console.error('Clear save failed:', e);
    return false;
  }
}

/**
 * 导出存档为字符串
 * @returns {string} Base64编码的存档
 */
export function exportSave() {
  const data = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
  if (!data) return null;
  return btoa(encodeURIComponent(data));
}

/**
 * 导入存档
 * @param {string} encoded - Base64编码的存档
 * @returns {boolean} 是否成功
 */
export function importSave(encoded) {
  try {
    const data = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object') {
      localStorage.setItem(GAME_CONFIG.SAVE_KEY, JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Import save failed:', e);
    return false;
  }
}

/**
 * 获取存档信息
 * @returns {Object|null} 存档信息
 */
export function getSaveInfo() {
  const data = load();
  if (!data) return null;
  
  return {
    lastSave: data.lastSave ? new Date(data.lastSave) : null,
    coins: data.coins || 0,
    level: data.player?.level || 1,
    prestigeCount: data.prestige?.count || 0,
    rebirthCount: data.rebirth?.count || 0,
    playTime: data.stats?.playTime || 0
  };
}

/**
 * 计算离线收益
 * @param {Object} state - 游戏状态
 * @returns {Object} 离线收益信息
 */
export function calculateOfflineEarnings(state) {
  const now = Date.now();
  const offlineTime = (now - (state.lastSave || now)) / 1000;
  
  if (offlineTime < OFFLINE_CONFIG.MIN_OFFLINE_SECONDS) {
    return { earnings: 0, offlineTime: 0 };
  }
  
  const cps = state.coinsPerSecond || 0;
  if (cps <= 0) {
    return { earnings: 0, offlineTime };
  }

  const hasOfflineBonus = Boolean(state.hasOfflineSkill) || hasUnlockedOfflineBonus(state);
  
  const multiplier = hasOfflineBonus
    ? OFFLINE_CONFIG.SKILL_MULTIPLIER 
    : OFFLINE_CONFIG.BASE_MULTIPLIER;
  
  const earnings = Math.floor(cps * offlineTime * multiplier);
  
  return { earnings, offlineTime, multiplier };
}

function hasUnlockedOfflineBonus(state) {
  return hasUnlockedOfflineSkill(state?.skills) || hasUnlockedOfflineResearch(state?.research);
}

function hasUnlockedOfflineSkill(skills = []) {
  return skills.some(skill => {
    if (skill?.type !== 'offline') {
      return false;
    }

    return skill?.owned === true
      || skill?.active === true
      || skill?.purchased === true
      || skill?.unlocked === true
      || skill?.done === true
      || skill?.completed === true;
  });
}

function hasUnlockedOfflineResearch(research = []) {
  return research.some(item => {
    if (item?.bonus?.type !== 'offline') {
      return false;
    }

    return item?.owned === true
      || item?.active === true
      || item?.purchased === true
      || item?.unlocked === true
      || item?.done === true
      || item?.completed === true;
  });
}

/**
 * 自动保存管理器
 */
export class AutoSaveManager {
  constructor(saveFn, interval = GAME_CONFIG.SAVE_INTERVAL) {
    this.saveFn = saveFn;
    this.interval = interval;
    this.timerId = null;
  }
  
  start() {
    if (this.timerId) return;
    this.timerId = setInterval(() => this.saveFn(), this.interval);
  }
  
  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  
  restart() {
    this.stop();
    this.start();
  }
}
