/**
 * 升级系统模块
 * 处理所有升级相关的逻辑
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { UPGRADE_CONFIG } from '../constants.js';
import { fmt } from '../utils/format.js';
import { snd } from '../utils/sound.js';
import { recalculateDerivedStats } from './derived-stats.js';

/**
 * 计算升级成本
 * @param {Object} upgrade - 升级对象
 * @returns {number} 升级成本
 */
export function calculateCost(upgrade) {
  return Math.floor(upgrade.base * Math.pow(upgrade.mult, upgrade.level));
}

/**
 * 获取升级配置
 * @param {string} key - 升级键
 * @returns {Object|null} 升级配置
 */
export function getUpgradeConfig(key) {
  return UPGRADE_CONFIG[key] || null;
}

/**
 * 获取升级名称
 * @param {string} key - 升级键
 * @returns {string} 升级名称
 */
export function getUpgradeName(key) {
  const config = getUpgradeConfig(key);
  return config ? config.name : key;
}

/**
 * 获取升级描述
 * @param {string} key - 升级键
 * @returns {string} 升级描述
 */
export function getUpgradeDesc(key) {
  const config = getUpgradeConfig(key);
  return config ? config.desc : '';
}

/**
 * 检查是否可以购买升级
 * @param {string} key - 升级键
 * @returns {boolean} 是否可以购买
 */
export function canBuyUpgrade(key) {
  const upgrade = GameState.get(`upgrades.${key}`);
  if (!upgrade) return false;
  
  const cost = calculateCost(upgrade);
  const coins = GameState.get('coins') || 0;
  
  return coins >= cost;
}

/**
 * 获取最大可购买次数
 * @param {string} key - 升级键
 * @returns {number} 最大可购买次数
 */
export function getMaxBuyCount(key) {
  const upgrade = GameState.get(`upgrades.${key}`);
  if (!upgrade) return 0;
  
  let count = 0;
  let tempCoins = GameState.get('coins') || 0;
  let tempLevel = upgrade.level;
  
  while (count < 1000) {
    const cost = Math.floor(upgrade.base * Math.pow(upgrade.mult, tempLevel));
    if (tempCoins < cost) break;
    tempCoins -= cost;
    tempLevel++;
    count++;
  }
  
  return count;
}

/**
 * 购买升级
 * @param {string} key - 升级键
 * @returns {boolean} 是否成功
 */
export function buyUpgrade(key) {
  return safeExecute(() => {
    const upgrade = GameState.get(`upgrades.${key}`);
    if (!upgrade) {
      throwError(ErrorCodes.UPGRADE_NOT_FOUND, { key });
    }
    
    const cost = calculateCost(upgrade);
    const coins = GameState.get('coins') || 0;
    
    if (coins < cost) {
      throwError(ErrorCodes.INSUFFICIENT_COINS, { 
        required: cost, 
        current: coins 
      });
    }
    
    GameState.set('coins', coins - cost);
    GameState.increment(`upgrades.${key}.level`);
    recalculateDerivedStats();
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 批量购买升级
 * @param {string} key - 升级键
 * @param {number|string} count - 购买次数或'max'
 * @returns {number} 实际购买次数
 */
export function buyUpgradeMultiple(key, count = 1) {
  return safeExecute(() => {
    const upgrade = GameState.get(`upgrades.${key}`);
    if (!upgrade) {
      throwError(ErrorCodes.UPGRADE_NOT_FOUND, { key });
    }
    
    const targetCount = count === 'max' ? 1000 : count;
    let bought = 0;
    
    while (bought < targetCount) {
      const cost = calculateCost(upgrade);
      const coins = GameState.get('coins') || 0;
      
      if (coins < cost) break;
      
      GameState.set('coins', coins - cost);
      GameState.increment(`upgrades.${key}.level`);
      bought++;
    }
    
    if (bought > 0) {
      recalculateDerivedStats();
      snd('upgrade');
    }
    
    return bought;
  }, 0);
}

/**
 * 计算升级效果
 * @param {string} key - 升级键
 * @returns {number} 当前效果值
 */
export function calculateUpgradeEffect(key) {
  const upgrade = GameState.get(`upgrades.${key}`);
  if (!upgrade) return 0;
  
  return upgrade.level * upgrade.eff;
}

/**
 * 获取所有升级状态
 * @returns {Object} 升级状态对象
 */
export function getAllUpgrades() {
  return GameState.get('upgrades') || {};
}

/**
 * 重置所有升级
 */
export function resetAllUpgrades() {
  Object.keys(UPGRADE_CONFIG).forEach(key => {
    GameState.set(`upgrades.${key}.level`, 0);
  });
  recalculateDerivedStats();
}

/**
 * 获取升级摘要
 * @returns {Array} 升级摘要数组
 */
export function getUpgradeSummary() {
  const upgrades = getAllUpgrades();
  
  return Object.entries(upgrades).map(([key, upgrade]) => ({
    key,
    name: getUpgradeName(key),
    level: upgrade.level,
    cost: calculateCost(upgrade),
    effect: calculateUpgradeEffect(key),
    canBuy: canBuyUpgrade(key),
    maxBuy: getMaxBuyCount(key)
  }));
}

/**
 * 获取推荐升级
 * @returns {Array} 推荐升级数组
 */
export function getRecommendedUpgrades() {
  const summary = getUpgradeSummary();
  const cps = GameState.get('coinsPerSecond') || 0;
  
  return summary
    .filter(u => u.canBuy)
    .map(u => {
      const config = getUpgradeConfig(u.key);
      const cpsGain = ['worker', 'factory', 'bank', 'ai'].includes(u.key) 
        ? config.eff 
        : 0;
      const clickGain = u.key === 'click' ? config.eff : 0;
      const critGain = u.key === 'crit' ? config.eff : 0;
      
      const efficiency = (cpsGain + clickGain * cps / 10 + critGain * 0.5) / Math.max(1, u.cost);
      
      return { ...u, efficiency };
    })
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 3);
}
