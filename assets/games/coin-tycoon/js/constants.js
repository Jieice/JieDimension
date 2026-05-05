/**
 * 游戏常量配置
 * 所有魔法数字和配置值集中管理
 */

// 游戏基础配置
export const GAME_CONFIG = {
  SAVE_KEY: 'gtAbyss2',
  SAVE_INTERVAL: 5000,
  GAME_LOOP_INTERVAL: 100,
  AUTO_BUY_INTERVAL: 5000,
  MAX_PARTICLES: 150,
  MAX_CONFETTI: 50,
  MAX_BG_PARTICLES: 100
};

// 转生配置
export const PRESTIGE_CONFIG = {
  THRESHOLD: 1_000_000,
  POINTS_MULTIPLIER: 1.5
};

// 重生配置
export const REBIRTH_CONFIG = {
  PRESTIGE_THRESHOLD: 5
};

// 暴击配置
export const CRIT_CONFIG = {
  BASE_CHANCE: 5,
  BASE_DAMAGE: 2,
  MAX_CHANCE: 100
};

// 章节配置
export const CHAPTER_CONFIG = {
  GOALS: [1000, 10000, 100000, 1000000, 10000000, 100000000],
  NAMES: ['初入金矿', '深入矿洞', '黄金迷宫', '巨龙巢穴', '财富之巅', '传奇之路']
};

// 升级配置
export const UPGRADE_CONFIG = {
  click: { base: 10, mult: 1.5, eff: 1, name: '点击强化', desc: '+1/点击' },
  crit: { base: 100, mult: 1.8, eff: 2, name: '暴击训练', desc: '+2%暴击率' },
  critdmg: { base: 200, mult: 2, eff: 0.5, name: '暴击伤害', desc: '+0.5x暴伤' },
  worker: { base: 50, mult: 1.15, eff: 1, name: '雇佣工人', desc: '+1/秒' },
  factory: { base: 500, mult: 1.15, eff: 10, name: '建造工厂', desc: '+10/秒' },
  synergy: { base: 2000, mult: 2, eff: 0.1, name: '工厂协同', desc: '+10%协同' },
  bank: { base: 5000, mult: 1.15, eff: 100, name: '建立银行', desc: '+100/秒' },
  ai: { base: 50000, mult: 1.15, eff: 1000, name: 'AI助手', desc: '+1K/秒' }
};

// 技能配置
export const SKILL_CONFIG = [
  { id: 'eff', name: '高效点击', desc: '点击+25%', cost: 1, eff: 0.25, type: 'click' },
  { id: 'luk', name: '幸运之手', desc: '暴击率+5%', cost: 2, eff: 5, type: 'crit' },
  { id: 'pow', name: '力量爆发', desc: '暴伤+1x', cost: 3, eff: 1, type: 'critdmg' },
  { id: 'au1', name: '自动点击I', desc: '每秒自动1次', cost: 5, eff: 1, type: 'auto' },
  { id: 'au2', name: '自动点击II', desc: '每秒+2', cost: 10, eff: 2, type: 'auto' },
  { id: 'idl', name: '挂机大师', desc: '离线+25%', cost: 5, eff: 0.25, type: 'offline' },
  { id: 'gld', name: '黄金触感', desc: '全局+10%', cost: 8, eff: 0.1, type: 'global' },
  { id: 'gld2', name: '点石成金', desc: '全局+20%', cost: 15, eff: 0.2, type: 'global' },
  { id: 'evt', name: '事件延长', desc: '事件+50%', cost: 7, eff: 0.5, type: 'event' },
  { id: 'cmb', name: '连击大师', desc: '连击×2', cost: 12, eff: 2, type: 'combo' }
];

// 宠物配置
export const PET_CONFIG = [
  { id: 'cat', name: '矿猫', icon: '🐱', cost: 500, bonusType: 'cps', bonus: 0.1, desc: '每秒+10%' },
  { id: 'dog', name: '寻宝犬', icon: '🐕', cost: 2000, bonusType: 'click', bonus: 0.15, desc: '点击+15%' },
  { id: 'dragon', name: '小龙', icon: '🐲', cost: 50000, bonusType: 'global', bonus: 0.2, desc: '全局+20%' },
  { id: 'phoenix', name: '凤凰', icon: '🦅', cost: 200000, bonusType: 'crit', bonus: 10, desc: '暴击率+10%' },
  { id: 'unicorn', name: '独角兽', icon: '🦄', cost: 1000000, bonusType: 'all', bonus: 0.15, desc: '全属性+15%' }
];

// 研究配置
export const RESEARCH_CONFIG = [
  { id: 'r1', name: '采矿效率I', desc: '每秒+20%', cost: 1000, bonus: { type: 'cps', val: 0.2 } },
  { id: 'r2', name: '暴击研究I', desc: '暴击率+5%', cost: 2000, bonus: { type: 'crit', val: 5 } },
  { id: 'r3', name: '点击强化I', desc: '点击+25%', cost: 3000, bonus: { type: 'click', val: 0.25 } },
  { id: 'r4', name: '采矿效率II', desc: '每秒+40%', cost: 10000, bonus: { type: 'cps', val: 0.4 } },
  { id: 'r5', name: '暴击研究II', desc: '暴伤+1x', cost: 15000, bonus: { type: 'critdmg', val: 1 } },
  { id: 'r6', name: '材料学', desc: 'Boss材料+1', cost: 8000, bonus: { type: 'mat', val: 1 } },
  { id: 'r7', name: '宠物训练', desc: '宠物效果×2', cost: 25000, bonus: { type: 'pet', val: 2 } },
  { id: 'r8', name: '离线优化', desc: '离线+50%', cost: 5000, bonus: { type: 'offline', val: 0.5 } },
  { id: 'r9', name: '全局增幅', desc: '全局+30%', cost: 50000, bonus: { type: 'global', val: 0.3 } },
  { id: 'r10', name: '转生精通', desc: '转生点+50%', cost: 100000, bonus: { type: 'prestige', val: 0.5 } }
];

// Boss配置
export const BOSS_CONFIG = {
  BASE_HP: 1000,
  HP_SCALE: 1.5,
  BASE_REWARD: 500,
  REWARD_SCALE: 1.3
};

// Gacha配置
export const GACHA_CONFIG = {
  COST_1: 100,
  COST_10: 900,
  PITY_SR: 30,
  PITY_SSR: 100,
  RARITY_WEIGHTS: {
    sr: 0.05,
    r: 0.25,
    uc: 0.35,
    c: 0.35
  }
};

// 深渊配置
export const ABYSS_CONFIG = {
  UNLOCK_REBIRTH: 3,
  BASE_ENEMY_HP: 100,
  HP_SCALE: 1.15,
  REWARD_SCALE: 1.1
};

// 时间挑战配置
export const TIME_CHALLENGE_CONFIG = [
  { id: 'tc1', name: '极速点击', desc: '在30秒内点击100次', type: 'clicks', target: 100, timeLimit: 30, reward: { coins: 10000, materials: { iron: 50 } } },
  { id: 'tc2', name: '财富冲刺', desc: '在60秒内赚取100K金币', type: 'earn', target: 100000, timeLimit: 60, reward: { coins: 50000, gachaTix: 3 } },
  { id: 'tc3', name: '暴击风暴', desc: '在45秒内触发20次暴击', type: 'crits', target: 20, timeLimit: 45, reward: { coins: 25000, materials: { crystal: 30 } } },
  { id: 'tc4', name: 'Boss猎杀', desc: '在90秒内击败Boss', type: 'bossDefeat', target: 1, timeLimit: 90, reward: { coins: 100000, materials: { dragonScale: 20 } } }
];

// 日常任务配置
export const DAILY_TASK_CONFIG = [
  { id: 'dt1', name: '日常点击', desc: '点击200次', tgt: 200, pts: 10, type: 'clicks' },
  { id: 'dt2', name: '日常收益', desc: '赚取5K金币', tgt: 5000, pts: 10, type: 'earn' },
  { id: 'dt3', name: '日常Boss', desc: '攻击Boss10次', tgt: 10, pts: 15, type: 'bossAtk' },
  { id: 'dt4', name: '日常祈愿', desc: '祈愿1次', tgt: 1, pts: 10, type: 'gacha' },
  { id: 'dt5', name: '日常远征', desc: '完成1次远征', tgt: 1, pts: 15, type: 'expedition' }
];

// 章节主题配置
export const CHAPTER_THEMES = {
  1: { name: '初入金矿', bg1: '#1a0f00', bg2: '#2d1810', accent: '#ffd700', particleType: 'gold' },
  2: { name: '深入矿洞', bg1: '#001a1a', bg2: '#002233', accent: '#00d4ff', particleType: 'crystal' },
  3: { name: '黄金迷宫', bg1: '#1a1500', bg2: '#2d2800', accent: '#ffd700', particleType: 'sparkle' },
  4: { name: '巨龙巢穴', bg1: '#1a0000', bg2: '#2d0a0a', accent: '#ff4444', particleType: 'fire' },
  5: { name: '财富之巅', bg1: '#0f001a', bg2: '#1a002d', accent: '#9b59b6', particleType: 'star' },
  6: { name: '传奇之路', bg1: '#0a0a1a', bg2: '#15152d', accent: 'rainbow', particleType: 'rainbow' }
};

// 玩家称号配置
export const TITLES = {
  1: '新手矿工',
  5: '初级矿工',
  10: '熟练矿工',
  20: '资深矿工',
  30: '黄金矿工',
  50: '钻石矿工',
  100: '传奇矿工'
};

// 离线收益配置
export const OFFLINE_CONFIG = {
  BASE_MULTIPLIER: 0.5,
  SKILL_MULTIPLIER: 0.75,
  MIN_OFFLINE_SECONDS: 60
};

// 成就配置
export const ACHIEVEMENT_CONFIG = [
  { id: 'ac1', name: '初次点击', desc: '点击1次', icon: '👆', cond: 'clicks', tgt: 1, bonus: 'click+5%' },
  { id: 'ac2', name: '点击达人', desc: '点击500次', icon: '🖱️', cond: 'clicks', tgt: 500, bonus: 'click+10%' },
  { id: 'ac3', name: '点击大师', desc: '点击5K次', icon: '⚡', cond: 'clicks', tgt: 5000, bonus: 'click+15%' },
  { id: 'ac4', name: '小有积蓄', desc: '累计1K', icon: '💰', cond: 'earn', tgt: 1000, bonus: 'cps+10%' },
  { id: 'ac5', name: '百万富翁', desc: '累计1M', icon: '💎', cond: 'earn', tgt: 1000000, bonus: 'global+10%' },
  { id: 'ac6', name: '暴击初现', desc: '暴击10次', icon: '💥', cond: 'crits', tgt: 10, bonus: 'crit+3%' },
  { id: 'ac7', name: '暴击专家', desc: '暴击100次', icon: '🎯', cond: 'crits', tgt: 100, bonus: 'critdmg+0.5x' },
  { id: 'ac8', name: '初次胜利', desc: '击败1Boss', icon: '🏆', cond: 'boss', tgt: 1, bonus: 'click+10%' },
  { id: 'ac9', name: 'Boss猎人', desc: '击败10Boss', icon: '⚔️', cond: 'boss', tgt: 10, bonus: 'cps+20%' },
  { id: 'ac10', name: '转生者', desc: '转生1次', icon: '🔄', cond: 'prestige', tgt: 1, bonus: 'global+15%' }
];
