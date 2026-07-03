/**
 * Gacha祈愿系统模块
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { GACHA_CONFIG } from '../constants.js';
import { snd } from '../utils/sound.js';

/**
 * 祈愿池
 */
export const GACHA_POOLS = {
  STANDARD: 'standard',
  LIMITED: 'limited',
  WEAPON: 'weapon'
};

/**
 * 祈愿物品
 */
const GACHA_ITEMS = {
  // SR物品
  sr: [
    { id: 'sr_gold', name: '黄金圣杯', icon: '🏆', type: 'item', bonus: { cps: 0.1 } },
    { id: 'sr_diamond', name: '钻石之心', icon: '💎', type: 'item', bonus: { critDamage: 0.5 } },
    { id: 'sr_crown', name: '王者之冠', icon: '👑', type: 'item', bonus: { global: 0.05 } }
  ],
  // R物品
  r: [
    { id: 'r_sword', name: '精钢剑', icon: '🗡️', type: 'weapon', bonus: { click: 5 } },
    { id: 'r_shield', name: '铁盾', icon: '🛡️', type: 'armor', bonus: { cps: 2 } },
    { id: 'r_ring', name: '银戒指', icon: '💍', type: 'ring', bonus: { critChance: 2 } }
  ],
  // UC物品
  uc: [
    { id: 'uc_potion', name: '金币药水', icon: '🧪', type: 'consumable', bonus: { coins: 1000 } },
    { id: 'uc_scroll', name: '经验卷轴', icon: '📜', type: 'consumable', bonus: { exp: 100 } }
  ],
  // C物品
  c: [
    { id: 'c_coin', name: '金币袋', icon: '💰', type: 'consumable', bonus: { coins: 100 } },
    { id: 'c_iron', name: '铁矿石', icon: '🪨', type: 'material', bonus: { iron: 5 } }
  ]
};

/**
 * 执行单次祈愿
 * @param {string} pool - 祈愿池
 * @param {boolean} useTix - 是否使用祈愿券
 * @returns {Object} 祈愿结果
 */
export function doSingleGacha(pool = GACHA_POOLS.STANDARD, useTix = false) {
  return safeExecute(() => {
    const cost = useTix ? 1 : GACHA_CONFIG.COST_1;
    
    if (useTix) {
      const tix = GameState.get('gachaTix') || 0;
      if (tix < cost) {
        throwError(ErrorCodes.INSUFFICIENT_MATERIALS, { required: cost, current: tix });
      }
      GameState.decrement('gachaTix', cost);
    } else {
      const coins = GameState.get('coins') || 0;
      if (coins < cost) {
        throwError(ErrorCodes.INSUFFICIENT_COINS, { required: cost, current: coins });
      }
      GameState.decrement('coins', cost);
    }
    
    const result = pullGacha(pool);
    addGachaItem(result);
    
    GameState.increment('stats.gachaTotal');
    updatePity(result.rarity);
    
    snd(result.rarity === 'sr' ? 'achievement' : 'coin');
    
    return result;
  }, null);
}

/**
 * 执行十连祈愿
 * @param {string} pool - 祈愿池
 * @returns {Array} 祈愿结果数组
 */
export function doTenGacha(pool = GACHA_POOLS.STANDARD) {
  return safeExecute(() => {
    const cost = GACHA_CONFIG.COST_10;
    const coins = GameState.get('coins') || 0;
    
    if (coins < cost) {
      throwError(ErrorCodes.INSUFFICIENT_COINS, { required: cost, current: coins });
    }
    
    GameState.decrement('coins', cost);
    
    const results = [];
    for (let i = 0; i < 10; i++) {
      const result = pullGacha(pool);
      addGachaItem(result);
      updatePity(result.rarity);
      results.push(result);
    }
    
    GameState.increment('stats.gachaTotal', 10);
    
    // 十连保底：至少一个R或以上
    if (!results.some(r => ['sr', 'r'].includes(r.rarity))) {
      rollbackGachaReward(results[0]);
      const guaranteedR = pullSpecificRarity('r');
      results[0] = guaranteedR;
      addGachaItem(guaranteedR);
    }
    
    snd('big');
    
    return results;
  }, []);
}

/**
 * 回滚一次祈愿奖励
 * @param {Object} item - 祈愿结果
 */
function rollbackGachaReward(item) {
  if (!item) return;

  if (item.type === 'consumable') {
    Object.entries(item.bonus).forEach(([key, value]) => {
      if (key === 'exp') {
        GameState.decrement('player.exp', value);
        return;
      }

      GameState.decrement(key, value);
    });
    return;
  }

  if (item.type === 'material') {
    Object.entries(item.bonus).forEach(([key, value]) => {
      GameState.decrement(`materials.${key}`, value);
    });
    return;
  }

  const inventory = GameState.get('inventory') || [];
  const rollbackIndex = inventory.findIndex(invItem => invItem?.timestamp === item.timestamp && invItem?.id === item.id);

  if (rollbackIndex >= 0) {
    inventory.splice(rollbackIndex, 1);
    GameState.set('inventory', inventory);
  }
}

/**
 * 抽取祈愿
 * @param {string} pool - 祈愿池
 * @returns {Object} 抽取结果
 */
function pullGacha(pool) {
  const pity = GameState.get('gachaPity') || { sr: 0, ssr: 0 };
  
  // 检查保底
  if (pity.ssr >= GACHA_CONFIG.PITY_SSR) {
    GameState.set('gachaPity.ssr', 0);
    return pullSpecificRarity('sr');
  }
  
  if (pity.sr >= GACHA_CONFIG.PITY_SR) {
    GameState.set('gachaPity.sr', 0);
    return pullSpecificRarity('r');
  }
  
  // 正常抽取
  const rand = Math.random();
  let rarity;
  
  if (rand < GACHA_CONFIG.RARITY_WEIGHTS.sr) {
    rarity = 'sr';
  } else if (rand < GACHA_CONFIG.RARITY_WEIGHTS.sr + GACHA_CONFIG.RARITY_WEIGHTS.r) {
    rarity = 'r';
  } else if (rand < GACHA_CONFIG.RARITY_WEIGHTS.sr + GACHA_CONFIG.RARITY_WEIGHTS.r + GACHA_CONFIG.RARITY_WEIGHTS.uc) {
    rarity = 'uc';
  } else {
    rarity = 'c';
  }
  
  return pullSpecificRarity(rarity);
}

/**
 * 抽取指定稀有度
 * @param {string} rarity - 稀有度
 * @returns {Object} 抽取结果
 */
function pullSpecificRarity(rarity) {
  const items = GACHA_ITEMS[rarity] || GACHA_ITEMS.c;
  const item = items[Math.floor(Math.random() * items.length)];
  
  return {
    ...item,
    rarity,
    timestamp: Date.now()
  };
}

/**
 * 添加祈愿物品到背包
 * @param {Object} item - 物品
 */
function addGachaItem(item) {
  if (item.type === 'consumable') {
    // 消耗品直接使用
    Object.entries(item.bonus).forEach(([key, value]) => {
      if (key === 'exp') {
        GameState.increment('player.exp', value);
        return;
      }

      GameState.increment(key, value);
    });
  } else if (item.type === 'material') {
    // 材料添加到库存
    Object.entries(item.bonus).forEach(([key, value]) => {
      GameState.increment(`materials.${key}`, value);
    });
  } else {
    // 装备添加到背包
    const inventory = GameState.get('inventory') || [];
    inventory.push(item);
    GameState.set('inventory', inventory);
  }
}

/**
 * 更新保底计数
 * @param {string} rarity - 稀有度
 */
function updatePity(rarity) {
  if (rarity === 'sr') {
    GameState.set('gachaPity.ssr', 0);
    GameState.set('gachaPity.sr', 0);
  } else if (rarity === 'r') {
    GameState.set('gachaPity.sr', 0);
    GameState.increment('gachaPity.ssr');
  } else {
    GameState.increment('gachaPity.sr');
    GameState.increment('gachaPity.ssr');
  }
}

/**
 * 获取当前保底进度
 * @returns {Object} 保底进度
 */
export function getPityProgress() {
  const pity = GameState.get('gachaPity') || { sr: 0, ssr: 0 };
  return {
    sr: {
      current: pity.sr,
      max: GACHA_CONFIG.PITY_SR,
      percent: (pity.sr / GACHA_CONFIG.PITY_SR) * 100
    },
    ssr: {
      current: pity.ssr,
      max: GACHA_CONFIG.PITY_SSR,
      percent: (pity.ssr / GACHA_CONFIG.PITY_SSR) * 100
    }
  };
}

/**
 * 获取祈愿券数量
 * @returns {number} 祈愿券数量
 */
export function getGachaTickets() {
  return GameState.get('gachaTix') || 0;
}
