/**
 * 宠物系统模块
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { PET_CONFIG } from '../constants.js';
import { snd } from '../utils/sound.js';
import { recalculateDerivedStats } from './derived-stats.js';

/**
 * 获取所有宠物
 * @returns {Array} 宠物数组
 */
export function getAllPets() {
  return GameState.get('pets') || [];
}

/**
 * 获取宠物配置
 * @param {string} id - 宠物ID
 * @returns {Object|null} 宠物配置
 */
export function getPetConfig(id) {
  return PET_CONFIG.find(p => p.id === id) || null;
}

/**
 * 获取宠物
 * @param {string} id - 宠物ID
 * @returns {Object|null} 宠物对象
 */
export function getPet(id) {
  const pets = getAllPets();
  return pets.find(p => p.id === id) || null;
}

/**
 * 检查是否可以购买宠物
 * @param {string} id - 宠物ID
 * @returns {boolean} 是否可以购买
 */
export function canBuyPet(id) {
  const pet = getPet(id);
  if (!pet) return false;
  if (pet.owned) return false;
  
  const coins = GameState.get('coins') || 0;
  const config = getPetConfig(id);
  
  return coins >= config.cost;
}

/**
 * 购买宠物
 * @param {string} id - 宠物ID
 * @returns {boolean} 是否成功
 */
export function buyPet(id) {
  return safeExecute(() => {
    const pet = getPet(id);
    if (!pet) {
      throwError(ErrorCodes.PET_NOT_FOUND, { id });
    }
    
    if (pet.owned) {
      throwError(ErrorCodes.INVALID_STATE, { message: '宠物已拥有' });
    }
    
    const config = getPetConfig(id);
    const coins = GameState.get('coins') || 0;
    
    if (coins < config.cost) {
      throwError(ErrorCodes.INSUFFICIENT_COINS, { 
        required: config.cost, 
        current: coins 
      });
    }
    
    GameState.set('coins', coins - config.cost);
    
    const pets = getAllPets();
    const index = pets.findIndex(p => p.id === id);
    if (index >= 0) {
      pets[index].owned = true;
      pets[index].level = 1;
      GameState.set('pets', [...pets]);
      recalculateDerivedStats();
    }
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 激活宠物
 * @param {string} id - 宠物ID
 * @returns {boolean} 是否成功
 */
export function activatePet(id) {
  return safeExecute(() => {
    const pet = getPet(id);
    if (!pet || !pet.owned) {
      throwError(ErrorCodes.PET_NOT_FOUND, { id });
    }
    
    const pets = getAllPets();
    pets.forEach(p => p.active = p.id === id);
    GameState.set('pets', [...pets]);
    recalculateDerivedStats();
    
    return true;
  }, false);
}

/**
 * 升级宠物
 * @param {string} id - 宠物ID
 * @returns {boolean} 是否成功
 */
export function upgradePet(id) {
  return safeExecute(() => {
    const pet = getPet(id);
    if (!pet || !pet.owned) {
      throwError(ErrorCodes.PET_NOT_FOUND, { id });
    }
    
    const upgradeCost = calculatePetUpgradeCost(pet.level);
    const coins = GameState.get('coins') || 0;
    
    if (coins < upgradeCost) {
      throwError(ErrorCodes.INSUFFICIENT_COINS, { 
        required: upgradeCost, 
        current: coins 
      });
    }
    
    GameState.set('coins', coins - upgradeCost);
    
    const pets = getAllPets();
    const index = pets.findIndex(p => p.id === id);
    if (index >= 0) {
      pets[index].level++;
      GameState.set('pets', [...pets]);
      recalculateDerivedStats();
    }
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 计算宠物升级成本
 * @param {number} level - 当前等级
 * @returns {number} 升级成本
 */
function calculatePetUpgradeCost(level) {
  return Math.floor(1000 * Math.pow(1.5, level - 1));
}

/**
 * 计算宠物加成
 * @param {string} bonusType - 加成类型
 * @returns {number} 加成值
 */
export function calculatePetBonus(bonusType) {
  const pets = getAllPets();
  let bonus = 0;
  
  pets.forEach(pet => {
    if (pet.owned && pet.active) {
      if (pet.bonusType === bonusType || pet.bonusType === 'all') {
        bonus += pet.bonus * pet.level;
      }
    }
  });
  
  return bonus;
}

/**
 * 获取活跃宠物
 * @returns {Object|null} 活跃宠物
 */
export function getActivePet() {
  const pets = getAllPets();
  return pets.find(p => p.owned && p.active) || null;
}

/**
 * 检查宠物进化条件
 * @param {string} id - 宠物ID
 * @returns {Object} 进化信息
 */
export function checkPetEvolution(id) {
  const pet = getPet(id);
  if (!pet || !pet.owned) {
    return { canEvolve: false, reason: '宠物不存在或未拥有' };
  }
  
  const evolutionLevel = 10;
  if (pet.level < evolutionLevel) {
    return { 
      canEvolve: false, 
      reason: `需要等级${evolutionLevel}`,
      currentLevel: pet.level,
      requiredLevel: evolutionLevel
    };
  }
  
  return { 
    canEvolve: true, 
    currentLevel: pet.level,
    evolutionBonus: pet.bonus * 0.5
  };
}
