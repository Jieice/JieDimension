/**
 * 装备系统模块
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { snd } from '../utils/sound.js';
import { recalculateDerivedStats } from './derived-stats.js';

/**
 * 装备槽位
 */
export const EQUIPMENT_SLOTS = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  RING: 'ring'
};

/**
 * 装备稀有度
 */
export const RARITY = {
  COMMON: { name: '普通', color: '#9e9e9e', mult: 1 },
  UNCOMMON: { name: '优秀', color: '#4CAF50', mult: 1.2 },
  RARE: { name: '稀有', color: '#2196F3', mult: 1.5 },
  EPIC: { name: '史诗', color: '#9C27B0', mult: 2 },
  LEGENDARY: { name: '传说', color: '#FF9800', mult: 3 }
};

/**
 * 获取所有装备
 * @returns {Object} 装备对象
 */
export function getAllEquipment() {
  return GameState.get('equipment') || {};
}

/**
 * 获取装备槽
 * @param {string} slot - 槽位
 * @returns {Object|null} 装备对象
 */
export function getEquipment(slot) {
  const equipment = getAllEquipment();
  return equipment[slot] || null;
}

/**
 * 装备物品
 * @param {string} slot - 槽位
 * @param {Object} item - 物品
 * @returns {boolean} 是否成功
 */
export function equipItem(slot, item) {
  return safeExecute(() => {
    if (!Object.values(EQUIPMENT_SLOTS).includes(slot)) {
      throwError(ErrorCodes.INVALID_ARGUMENT, { slot });
    }
    
    const equipment = getAllEquipment();
    const oldItem = equipment[slot];
    
    // 如果有旧装备，放回背包
    if (oldItem && oldItem.id) {
      const inventory = GameState.get('inventory') || [];
      inventory.push(oldItem);
      GameState.set('inventory', inventory);
    }

    const inventory = GameState.get('inventory') || [];
    const nextInventory = inventory.filter(invItem => invItem?.id !== item?.id);
    GameState.set('inventory', nextInventory);
     
    // 装备新物品
    GameState.set(`equipment.${slot}`, item);
    recalculateDerivedStats();
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 卸下装备
 * @param {string} slot - 槽位
 * @returns {boolean} 是否成功
 */
export function unequipItem(slot) {
  return safeExecute(() => {
    const equipment = getAllEquipment();
    const item = equipment[slot];
    
    if (!item || !item.id) {
      return false;
    }
    
    const inventory = GameState.get('inventory') || [];
    inventory.push(item);
    
    GameState.set('inventory', inventory);
    GameState.set(`equipment.${slot}`, { id: null, name: '无', icon: getSlotIcon(slot), bonus: 0, level: 0 });
    recalculateDerivedStats();
    
    return true;
  }, false);
}

/**
 * 获取槽位图标
 * @param {string} slot - 槽位
 * @returns {string} 图标
 */
function getSlotIcon(slot) {
  const icons = {
    [EQUIPMENT_SLOTS.WEAPON]: '⚔️',
    [EQUIPMENT_SLOTS.ARMOR]: '🛡️',
    [EQUIPMENT_SLOTS.RING]: '💍'
  };
  return icons[slot] || '❓';
}

/**
 * 强化装备
 * @param {string} slot - 槽位
 * @returns {Object} 强化结果
 */
export function enhanceEquipment(slot) {
  return safeExecute(() => {
    const item = getEquipment(slot);
    if (!item || !item.id) {
      throwError(ErrorCodes.EQUIPMENT_NOT_FOUND, { slot });
    }
    
    const cost = calculateEnhanceCost(item.level);
    const coins = GameState.get('coins') || 0;
    
    if (coins < cost) {
      throwError(ErrorCodes.INSUFFICIENT_COINS, { required: cost, current: coins });
    }
    
    GameState.set('coins', coins - cost);
    
    // 强化成功率 90% - level * 2%
    const successRate = Math.max(50, 90 - item.level * 2);
    const success = Math.random() * 100 < successRate;
    
    if (success) {
      GameState.set(`equipment.${slot}.level`, item.level + 1);
      GameState.set(`equipment.${slot}.bonus`, item.bonus * 1.1);
      recalculateDerivedStats();
      snd('upgrade');
    } else {
      snd('error');
    }
    
    return { success, newLevel: success ? item.level + 1 : item.level };
  }, { success: false });
}

/**
 * 计算强化成本
 * @param {number} level - 当前等级
 * @returns {number} 成本
 */
function calculateEnhanceCost(level) {
  return Math.floor(1000 * Math.pow(1.5, level));
}

/**
 * 附魔装备
 * @param {string} slot - 槽位
 * @param {string} enchantType - 附魔类型
 * @returns {boolean} 是否成功
 */
export function enchantEquipment(slot, enchantType) {
  return safeExecute(() => {
    const item = getEquipment(slot);
    if (!item || !item.id) {
      throwError(ErrorCodes.EQUIPMENT_NOT_FOUND, { slot });
    }
    
    const materials = GameState.get('materials') || {};
    const cost = { crystal: 10, ancientGem: 1 };
    
    for (const [mat, amount] of Object.entries(cost)) {
      if ((materials[mat] || 0) < amount) {
        throwError(ErrorCodes.INSUFFICIENT_MATERIALS, { material: mat, required: amount });
      }
    }
    
    // 扣除材料
    for (const [mat, amount] of Object.entries(cost)) {
      GameState.set(`materials.${mat}`, materials[mat] - amount);
    }
    
    // 添加附魔属性
    const enchants = GameState.get(`equipment.${slot}.enchants`) || [];
    enchants.push({
      type: enchantType,
      value: getEnchantValue(enchantType)
    });
    GameState.set(`equipment.${slot}.enchants`, enchants);
    recalculateDerivedStats();
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 获取附魔值
 * @param {string} type - 附魔类型
 * @returns {number} 附魔值
 */
function getEnchantValue(type) {
  const values = {
    attack: 5,
    defense: 3,
    critChance: 2,
    critDamage: 0.5
  };
  return values[type] || 1;
}

/**
 * 计算装备总加成
 * @returns {Object} 加成对象
 */
export function calculateTotalBonus() {
  const equipment = getAllEquipment();
  const bonus = {
    click: 0,
    cps: 0,
    critChance: 0,
    critDamage: 0
  };
  
  Object.values(equipment).forEach(item => {
    if (item && item.bonus) {
      bonus.cps += item.bonus * 0.5;
      bonus.click += item.bonus * 0.3;
    }
    
    if (item && item.enchants) {
      item.enchants.forEach(enchant => {
        if (bonus[enchant.type] !== undefined) {
          bonus[enchant.type] += enchant.value;
        }
      });
    }
  });
  
  return bonus;
}
