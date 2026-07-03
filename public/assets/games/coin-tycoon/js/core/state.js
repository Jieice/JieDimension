/**
 * 游戏状态管理系统
 * 提供集中式状态管理，支持订阅/通知机制
 */

import { save, load } from '../utils/storage.js';
import { GAME_CONFIG } from '../constants.js';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeState(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const merged = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    merged[key] = isPlainObject(value) && isPlainObject(target[key])
      ? mergeState(target[key], value)
      : value;
  });

  return merged;
}

class GameStateManager {
  constructor() {
    this._state = {};
    this._listeners = new Map();
    this._computedCache = new Map();
    this._dirty = true;
  }

  /**
   * 初始化状态
   * @param {Object} initialState - 初始状态
   */
  init(initialState) {
    this._state = { ...initialState };
    this._dirty = true;
  }

  /**
   * 从存档加载状态
   */
  loadFromSave() {
    const saved = load();
    if (saved) {
      this._state = mergeState(this._state, saved);
      this._dirty = true;
    }
    return saved !== null;
  }

  /**
   * 保存状态
   */
  save() {
    return save(this._state);
  }

  /**
   * 获取状态值
   * @param {string} path - 状态路径 (如 'coins' 或 'player.level')
   * @returns {any} 状态值
   */
  get(path) {
    if (!path) return this._state;
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  }

  /**
   * 设置状态值
   * @param {string} path - 状态路径
   * @param {any} value - 新值
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this._state);
    
    const oldValue = target[lastKey];
    target[lastKey] = value;
    this._dirty = true;
    
    this._notify(path, value, oldValue);
  }

  /**
   * 批量设置状态
   * @param {Object} updates - 更新对象
   */
  setMultiple(updates) {
    Object.entries(updates).forEach(([path, value]) => {
      this.set(path, value);
    });
  }

  /**
   * 增加数值
   * @param {string} path - 状态路径
   * @param {number} amount - 增加量
   */
  increment(path, amount = 1) {
    const current = this.get(path) || 0;
    this.set(path, current + amount);
  }

  /**
   * 减少数值
   * @param {string} path - 状态路径
   * @param {number} amount - 减少量
   */
  decrement(path, amount = 1) {
    const current = this.get(path) || 0;
    this.set(path, Math.max(0, current - amount));
  }

  /**
   * 订阅状态变更
   * @param {string} path - 状态路径
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  subscribe(path, callback) {
    if (!this._listeners.has(path)) {
      this._listeners.set(path, new Set());
    }
    this._listeners.get(path).add(callback);
    
    return () => {
      this._listeners.get(path)?.delete(callback);
    };
  }

  /**
   * 订阅多个路径
   * @param {string[]} paths - 状态路径数组
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  subscribeMultiple(paths, callback) {
    const unsubscribers = paths.map(path => this.subscribe(path, callback));
    return () => unsubscribers.forEach(fn => fn());
  }

  /**
   * 通知订阅者
   * @param {string} path - 变更路径
   * @param {any} newValue - 新值
   * @param {any} oldValue - 旧值
   */
  _notify(path, newValue, oldValue) {
    this._listeners.forEach((callbacks, listenerPath) => {
      if (path === listenerPath || path.startsWith(listenerPath + '.') || listenerPath.startsWith(path + '.')) {
        callbacks.forEach(cb => {
          try {
            cb(newValue, oldValue, path);
          } catch (e) {
            console.error('Listener error:', e);
          }
        });
      }
    });
  }

  /**
   * 定义计算属性
   * @param {string} name - 属性名
   * @param {string[]} dependencies - 依赖路径
   * @param {Function} compute - 计算函数
   */
  defineComputed(name, dependencies, compute) {
    this._computedCache.set(name, { dependencies, compute, value: null, dirty: true });
    
    this.subscribeMultiple(dependencies, () => {
      const cached = this._computedCache.get(name);
      if (cached) {
        cached.dirty = true;
      }
    });
  }

  /**
   * 获取计算属性
   * @param {string} name - 属性名
   * @returns {any} 计算结果
   */
  getComputed(name) {
    const cached = this._computedCache.get(name);
    if (!cached) return undefined;
    
    if (cached.dirty) {
      cached.value = cached.compute(this._state);
      cached.dirty = false;
    }
    
    return cached.value;
  }

  /**
   * 重置状态
   * @param {Object} initialState - 初始状态
   */
  reset(initialState) {
    this._state = { ...initialState };
    this._dirty = true;
    this._computedCache.forEach(cached => cached.dirty = true);
    this._notify('', this._state, null);
  }

  /**
   * 获取整个状态对象（只读）
   * @returns {Object} 状态快照
   */
  getState() {
    return { ...this._state };
  }

  /**
   * 检查状态是否脏
   * @returns {boolean}
   */
  isDirty() {
    return this._dirty;
  }

  /**
   * 标记状态为干净
   */
  markClean() {
    this._dirty = false;
  }
}

// 导出单例
export const GameState = new GameStateManager();

// 导出类供测试使用
export { GameStateManager };
