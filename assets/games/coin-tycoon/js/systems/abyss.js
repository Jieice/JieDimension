/**
 * 深渊系统模块
 * 无限挑战模式，第3次重生后解锁
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { ABYSS_CONFIG } from '../constants.js';
import { snd } from '../utils/sound.js';

/**
 * 深渊状态
 */
export const ABYSS_STATE = {
  LOCKED: 'locked',
  READY: 'ready',
  IN_PROGRESS: 'in_progress',
  COOLDOWN: 'cooldown'
};

/**
 * 检查深渊是否解锁
 * @returns {boolean} 是否解锁
 */
export function isAbyssUnlocked() {
  const rebirthCount = GameState.get('rebirth.count') || 0;
  return rebirthCount >= ABYSS_CONFIG.UNLOCK_REBIRTH;
}

/**
 * 获取深渊状态
 * @returns {string} 深渊状态
 */
export function getAbyssState() {
  if (!isAbyssUnlocked()) {
    return ABYSS_STATE.LOCKED;
  }
  
  const abyss = GameState.get('abyss') || {};
  
  if (abyss.currentFloor > 0) {
    return ABYSS_STATE.IN_PROGRESS;
  }
  
  if (abyss.cooldown > 0) {
    return ABYSS_STATE.COOLDOWN;
  }
  
  return ABYSS_STATE.READY;
}

/**
 * 获取深渊数据
 * @returns {Object} 深渊数据
 */
export function getAbyssData() {
  return GameState.get('abyss') || {
    currentFloor: 0,
    highestFloor: 0,
    enemy: null,
    rewards: { essence: 0, materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 }, gachaTix: 0 },
    cooldown: 0
  };
}

/**
 * 开始深渊挑战
 * @returns {boolean} 是否成功
 */
export function startAbyss() {
  return safeExecute(() => {
    if (!isAbyssUnlocked()) {
      throwError(ErrorCodes.FEATURE_LOCKED, { feature: '深渊', requirement: `${ABYSS_CONFIG.UNLOCK_REBIRTH}次重生` });
    }
    
    const state = getAbyssState();
    if (state === ABYSS_STATE.IN_PROGRESS) {
      throwError(ErrorCodes.CHALLENGE_ACTIVE, { message: '深渊挑战进行中' });
    }
    
    if (state === ABYSS_STATE.COOLDOWN) {
      throwError(ErrorCodes.ON_COOLDOWN, { message: '深渊冷却中' });
    }
    
    // 初始化深渊
    const abyss = getAbyssData();
    abyss.currentFloor = 1;
    abyss.enemy = generateEnemy(1);
    
    GameState.set('abyss', abyss);
    
    snd('upgrade');
    
    return true;
  }, false);
}

/**
 * 生成深渊敌人
 * @param {number} floor - 层数
 * @returns {Object} 敌人对象
 */
function generateEnemy(floor) {
  const baseHp = ABYSS_CONFIG.BASE_ENEMY_HP;
  const hp = Math.floor(baseHp * Math.pow(ABYSS_CONFIG.HP_SCALE, floor - 1));
  
  const enemyTypes = [
    { name: '深渊守卫', icon: '👹', type: 'guard' },
    { name: '暗影猎手', icon: '👻', type: 'hunter' },
    { name: '熔岩巨人', icon: '🗿', type: 'giant' },
    { name: '冰霜恶魔', icon: '❄️', type: 'demon' },
    { name: '虚空领主', icon: '🌀', type: 'lord' }
  ];
  
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  
  return {
    ...enemyType,
    floor,
    hp,
    maxHp: hp,
    attack: Math.floor(floor * 0.5) + 1
  };
}

/**
 * 攻击深渊敌人
 * @param {number} damage - 伤害值
 * @returns {Object} 攻击结果
 */
export function attackAbyssEnemy(damage) {
  return safeExecute(() => {
    const abyss = getAbyssData();
    
    if (!abyss.enemy || abyss.currentFloor === 0) {
      throwError(ErrorCodes.INVALID_STATE, { message: '没有进行中的深渊挑战' });
    }

    if (abyss.enemy.hp <= 0) {
      return { damage: 0, newHp: 0, defeated: false };
    }
    
    const newHp = Math.max(0, abyss.enemy.hp - damage);
    abyss.enemy.hp = newHp;
    
    const defeated = newHp <= 0;
    
    if (defeated) {
      handleEnemyDefeat(abyss);
    }
    
    GameState.set('abyss', abyss);
    
    return { damage, newHp, defeated };
  }, { damage: 0, newHp: 0, defeated: false });
}

/**
 * 处理敌人击败
 * @param {Object} abyss - 深渊数据
 */
function handleEnemyDefeat(abyss) {
  const floor = abyss.currentFloor;
  
  // 计算奖励
  const essenceGain = Math.floor(floor * ABYSS_CONFIG.REWARD_SCALE);
  const materialGain = Math.floor(floor * 0.5);
  
  abyss.rewards.essence += essenceGain;
  abyss.rewards.materials.iron += materialGain;
  abyss.rewards.materials.crystal += Math.floor(materialGain * 0.3);
  
  if (floor % 10 === 0) {
    abyss.rewards.gachaTix += 1;
    abyss.rewards.materials.dragonScale += 1;
  }
  
  if (floor % 50 === 0) {
    abyss.rewards.materials.ancientGem += 1;
  }
  
  // 更新最高层
  if (floor > abyss.highestFloor) {
    abyss.highestFloor = floor;
  }
  
  snd('boss');
}

/**
 * 前进到下一层
 * @returns {Object} 新敌人或null
 */
export function advanceFloor() {
  return safeExecute(() => {
    const abyss = getAbyssData();
    
    if (abyss.currentFloor === 0) {
      throwError(ErrorCodes.INVALID_STATE, { message: '没有进行中的深渊挑战' });
    }
    
    // 如果当前敌人未击败，不能前进
    if (abyss.enemy && abyss.enemy.hp > 0) {
      return abyss.enemy;
    }
    
    abyss.currentFloor++;
    abyss.enemy = generateEnemy(abyss.currentFloor);
    
    GameState.set('abyss', abyss);
    
    return abyss.enemy;
  }, null);
}

/**
 * 结束深渊挑战
 * @returns {Object} 结算奖励
 */
export function endAbyss() {
  return safeExecute(() => {
    const abyss = getAbyssData();
    
    if (abyss.currentFloor === 0) {
      throwError(ErrorCodes.INVALID_STATE, { message: '没有进行中的深渊挑战' });
    }
    
    const rewards = { ...abyss.rewards };
    
    // 发放奖励
    GameState.increment('rebirth.essence', rewards.essence);
    GameState.increment('gachaTix', rewards.gachaTix);
    
    Object.entries(rewards.materials).forEach(([mat, amount]) => {
      GameState.increment(`materials.${mat}`, amount);
    });
    
    // 重置深渊
    abyss.currentFloor = 0;
    abyss.enemy = null;
    abyss.rewards = { essence: 0, materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 }, gachaTix: 0 };
    abyss.cooldown = 300; // 5分钟冷却
    
    GameState.set('abyss', abyss);
    
    snd('big');
    
    return rewards;
  }, null);
}

/**
 * 获取深渊进度
 * @returns {Object} 进度信息
 */
export function getAbyssProgress() {
  const abyss = getAbyssData();
  
  return {
    currentFloor: abyss.currentFloor,
    highestFloor: abyss.highestFloor,
    enemyHp: abyss.enemy ? abyss.enemy.hp : 0,
    enemyMaxHp: abyss.enemy ? abyss.enemy.maxHp : 0,
    pendingRewards: { ...abyss.rewards },
    cooldown: abyss.cooldown
  };
}

/**
 * 更新深渊冷却
 */
export function updateAbyssCooldown() {
  const abyss = getAbyssData();
  if (abyss.cooldown > 0) {
    abyss.cooldown--;
    GameState.set('abyss.cooldown', abyss.cooldown);
  }
}
