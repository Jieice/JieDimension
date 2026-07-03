/**
 * Boss系统模块
 */

import { GameState } from '../core/state.js';
import { safeExecute, throwError, ErrorCodes } from '../core/error.js';
import { BOSS_CONFIG } from '../constants.js';
import { snd } from '../utils/sound.js';

/**
 * 获取当前Boss
 * @returns {Object} Boss对象
 */
export function getCurrentBoss() {
  return GameState.get('boss') || {};
}

/**
 * 计算Boss最大HP
 * @param {number} level - Boss等级
 * @returns {number} 最大HP
 */
export function calculateBossMaxHp(level) {
  return Math.floor(BOSS_CONFIG.BASE_HP * Math.pow(BOSS_CONFIG.HP_SCALE, level - 1));
}

/**
 * 计算Boss奖励
 * @param {number} level - Boss等级
 * @returns {Object} 奖励对象
 */
export function calculateBossReward(level) {
  const coins = Math.floor(BOSS_CONFIG.BASE_REWARD * Math.pow(BOSS_CONFIG.REWARD_SCALE, level - 1));
  const gems = Math.floor(level / 5) + 1;
  const materials = Math.min(level, 5);
  
  return { coins, gems, materials };
}

/**
 * 攻击Boss
 * @param {number} damage - 伤害值
 * @returns {Object} 攻击结果
 */
export function attackBoss(damage) {
  return safeExecute(() => {
    const boss = getCurrentBoss();
    if (!boss) {
      throwError(ErrorCodes.NOT_FOUND, { target: 'boss' });
    }
    
    const newHp = Math.max(0, boss.hp - damage);
    GameState.set('boss.hp', newHp);
    
    const defeated = newHp <= 0;
    
    if (defeated) {
      handleBossDefeat();
    }
    
    return { damage, newHp, defeated };
  }, { damage: 0, newHp: 0, defeated: false });
}

/**
 * 处理Boss被击败
 */
function handleBossDefeat() {
  const boss = getCurrentBoss();
  const reward = calculateBossReward(boss.level);
  
  GameState.increment('coins', reward.coins);
  GameState.increment('gems', reward.gems);
  GameState.increment('materials.iron', reward.materials);
  GameState.increment('boss.defeated');
  GameState.set('boss.level', boss.level + 1);
  
  snd('boss');
  
  spawnNewBoss();
}

/**
 * 生成新Boss
 */
export function spawnNewBoss() {
  const level = GameState.get('boss.level') || 1;
  const maxHp = calculateBossMaxHp(level);
  const reward = calculateBossReward(level);
  
  GameState.set('boss', {
    name: getBossName(level),
    avatar: getBossAvatar(level),
    hp: maxHp,
    maxHp,
    reward: reward.coins,
    gemReward: reward.gems,
    matReward: reward.materials,
    level,
    defeated: GameState.get('boss.defeated') || 0
  });
}

/**
 * 获取Boss名称
 * @param {number} level - Boss等级
 * @returns {string} Boss名称
 */
function getBossName(level) {
  const names = ['矿洞守护者', '黄金巨人', '水晶龙', '熔岩领主', '深渊之王', '传奇霸主'];
  return names[Math.min(level - 1, names.length - 1)] || `Boss Lv.${level}`;
}

/**
 * 获取Boss头像
 * @param {number} level - Boss等级
 * @returns {string} Boss头像emoji
 */
function getBossAvatar(level) {
  const avatars = ['👹', '👺', '🐲', '🔥', '💀', '👑'];
  return avatars[Math.min(level - 1, avatars.length - 1)] || '👹';
}

/**
 * 获取BossHP百分比
 * @returns {number} HP百分比 (0-100)
 */
export function getBossHpPercent() {
  const boss = getCurrentBoss();
  if (!boss || !boss.maxHp) return 0;
  return (boss.hp / boss.maxHp) * 100;
}

/**
 * 检查Boss是否低血量
 * @param {number} threshold - 阈值 (默认30%)
 * @returns {boolean} 是否低血量
 */
export function isBossLowHp(threshold = 30) {
  return getBossHpPercent() <= threshold;
}
