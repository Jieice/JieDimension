/**
 * 格式化工具函数
 */

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/**
 * 格式化数字为可读字符串
 * @param {number} n - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
export function fmt(n) {
  if (n < 1000) return Math.floor(n).toString();
  if (n < 10000) return (n / 1000).toFixed(2) + 'K';
  
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  if (tier >= SUFFIXES.length) {
    return n.toExponential(2);
  }
  
  const suffix = SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = n / scale;
  
  return scaled.toFixed(2) + suffix;
}

/**
 * 格式化时间（秒转为 时:分:秒）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间
 */
export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}小时${m}分钟`;
  }
  if (m > 0) {
    return `${m}分${s}秒`;
  }
  return `${s}秒`;
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期
 */
export function formatDate(date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * 格式化百分比
 * @param {number} value - 值 (0-1)
 * @param {number} decimals - 小数位数
 * @returns {string} 百分比字符串
 */
export function formatPercent(value, decimals = 1) {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * 格式化倍率
 * @param {number} value - 倍率值
 * @returns {string} 倍率字符串
 */
export function formatMultiplier(value) {
  return '×' + value.toFixed(2);
}

/**
 * 解析格式化数字
 * @param {string} str - 格式化字符串 (如 "1.5K")
 * @returns {number} 数值
 */
export function parseFormatted(str) {
  const match = str.match(/^([\d.]+)([KMBT]?)$/i);
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  const suffix = match[2].toUpperCase();
  
  const multipliers = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  return num * (multipliers[suffix] || 1);
}
