/**
 * 错误处理系统
 * 提供统一的错误处理机制
 */

import { t, tr } from '../i18n.js';

/**
 * 游戏错误类
 */
export class GameError extends Error {
  constructor(code, message, context = {}) {
    super(message);
    this.name = 'GameError';
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }

  toString() {
    return `[${this.code}] ${this.message}`;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

/**
 * 错误代码枚举
 */
export const ErrorCodes = {
  // 通用错误
  UNKNOWN: 'UNKNOWN',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  NOT_FOUND: 'NOT_FOUND',
  
  // 游戏逻辑错误
  INSUFFICIENT_COINS: 'INSUFFICIENT_COINS',
  INSUFFICIENT_MATERIALS: 'INSUFFICIENT_MATERIALS',
  INSUFFICIENT_GEMS: 'INSUFFICIENT_GEMS',
  UPGRADE_NOT_FOUND: 'UPGRADE_NOT_FOUND',
  EQUIPMENT_NOT_FOUND: 'EQUIPMENT_NOT_FOUND',
  PET_NOT_FOUND: 'PET_NOT_FOUND',
  
  // 状态错误
  INVALID_STATE: 'INVALID_STATE',
  SAVE_FAILED: 'SAVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',
  
  // 功能锁定错误
  FEATURE_LOCKED: 'FEATURE_LOCKED',
  LEVEL_TOO_LOW: 'LEVEL_TOO_LOW',
  CHAPTER_NOT_COMPLETED: 'CHAPTER_NOT_COMPLETED',
  
  // 冷却错误
  ON_COOLDOWN: 'ON_COOLDOWN',
  CHALLENGE_ACTIVE: 'CHALLENGE_ACTIVE'
};

/**
 * 错误代码 → 词典键（文案随站点语言切换）
 */
const ErrorKeys = {
  [ErrorCodes.UNKNOWN]: 'err.generic',
  [ErrorCodes.INVALID_ARGUMENT]: 'err.invalidArg',
  [ErrorCodes.NOT_FOUND]: 'err.notFound',
  [ErrorCodes.INSUFFICIENT_COINS]: 'err.noCoins',
  [ErrorCodes.INSUFFICIENT_MATERIALS]: 'err.noMaterials',
  [ErrorCodes.INSUFFICIENT_GEMS]: 'err.noGems',
  [ErrorCodes.UPGRADE_NOT_FOUND]: 'err.noUpgrade',
  [ErrorCodes.EQUIPMENT_NOT_FOUND]: 'err.noEquipment',
  [ErrorCodes.PET_NOT_FOUND]: 'err.noPet',
  [ErrorCodes.INVALID_STATE]: 'err.badState',
  [ErrorCodes.SAVE_FAILED]: 'err.saveFail',
  [ErrorCodes.LOAD_FAILED]: 'err.loadFail',
  [ErrorCodes.FEATURE_LOCKED]: 'err.locked',
  [ErrorCodes.LEVEL_TOO_LOW]: 'err.lowLevel',
  [ErrorCodes.CHAPTER_NOT_COMPLETED]: 'err.chapterIncomplete',
  [ErrorCodes.ON_COOLDOWN]: 'err.cooldown',
  [ErrorCodes.CHALLENGE_ACTIVE]: 'err.challengeActive'
};

/**
 * 创建游戏错误
 * @param {string} code - 错误代码
 * @param {Object} context - 错误上下文
 * @returns {GameError}
 */
export function createError(code, context = {}) {
  const message = context.message
    ? tr(context.message)
    : t(ErrorKeys[code] || 'err.generic');
  return new GameError(code, message, context);
}

/**
 * 抛出游戏错误
 * @param {string} code - 错误代码
 * @param {Object} context - 错误上下文
 * @throws {GameError}
 */
export function throwError(code, context = {}) {
  throw createError(code, context);
}

/**
 * 安全执行函数
 * @param {Function} fn - 要执行的函数
 * @param {any} fallback - 失败时的返回值
 * @param {Function} errorHandler - 错误处理函数
 * @returns {any}
 */
export function safeExecute(fn, fallback = null, errorHandler = null) {
  try {
    return fn();
  } catch (error) {
    console.error('[GameError]', error);
    
    if (errorHandler) {
      errorHandler(error);
    } else {
      showDefaultError(error);
    }
    
    return fallback;
  }
}

/**
 * 异步安全执行
 * @param {Function} fn - 要执行的异步函数
 * @param {any} fallback - 失败时的返回值
 * @param {Function} errorHandler - 错误处理函数
 * @returns {Promise<any>}
 */
export async function safeExecuteAsync(fn, fallback = null, errorHandler = null) {
  try {
    return await fn();
  } catch (error) {
    console.error('[GameError]', error);
    
    if (errorHandler) {
      errorHandler(error);
    } else {
      showDefaultError(error);
    }
    
    return fallback;
  }
}

/**
 * 显示默认错误提示
 * @param {Error} error - 错误对象
 */
function showDefaultError(error) {
  const message = error instanceof GameError 
    ? error.message 
    : t('err.unknown');
  
  showNotification(message, 'error');
}

/**
 * 显示通知（简化版）
 * @param {string} message - 消息
 * @param {string} type - 类型
 */
function showNotification(message, type = 'info') {
  if (typeof window === 'undefined') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }
  
  // 直接操作 DOM 显示通知
  const container = document.getElementById('notification-container');
  if (container) {
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * 全局错误处理器
 */
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
    showDefaultError(event.error);
    event.preventDefault();
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Rejection]', event.reason);
    showDefaultError(event.reason);
    event.preventDefault();
  });
}

/**
 * 断言函数
 * @param {boolean} condition - 条件
 * @param {string} code - 错误代码
 * @param {Object} context - 错误上下文
 */
export function assert(condition, code, context = {}) {
  if (!condition) {
    throwError(code, context);
  }
}

/**
 * 类型检查
 * @param {any} value - 值
 * @param {string} type - 期望类型
 * @param {string} name - 变量名
 */
export function assertType(value, type, name = 'value') {
  const actualType = typeof value;
  if (actualType !== type) {
    throwError(ErrorCodes.INVALID_ARGUMENT, { 
      name, 
      expected: type, 
      actual: actualType 
    });
  }
}

/**
 * 范围检查
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} name - 变量名
 */
export function assertRange(value, min, max, name = 'value') {
  if (typeof value !== 'number' || value < min || value > max) {
    throwError(ErrorCodes.INVALID_ARGUMENT, { 
      name, 
      expected: `${min}-${max}`, 
      actual: value 
    });
  }
}
