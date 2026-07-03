/**
 * DOM操作工具函数
 */

/**
 * 简化的元素选择器
 * @param {string} id - 元素ID
 * @returns {HTMLElement} DOM元素
 */
export function $(id) {
  return document.getElementById(id);
}

/**
 * 查询选择器
 * @param {string} selector - CSS选择器
 * @param {HTMLElement} parent - 父元素
 * @returns {HTMLElement} DOM元素
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * 查询所有匹配元素
 * @param {string} selector - CSS选择器
 * @param {HTMLElement} parent - 父元素
 * @returns {NodeList} DOM元素列表
 */
export function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * 创建元素
 * @param {string} tag - 标签名
 * @param {Object} attrs - 属性对象
 * @param {string|HTMLElement|Array} children - 子元素
 * @returns {HTMLElement} 创建的元素
 */
export function createElement(tag, attrs = {}, children = null) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([k, v]) => el.dataset[k] = v);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          el.appendChild(child);
        }
      });
    } else if (typeof children === 'string') {
      el.textContent = children;
    } else if (children instanceof HTMLElement) {
      el.appendChild(children);
    }
  }
  
  return el;
}

/**
 * 安全的HTML转义
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, c => escapeMap[c]);
}

/**
 * 安全的HTML模板字符串
 * @param {TemplateStringsArray} strings - 模板字符串
 * @param {...any} values - 插值
 * @returns {string} 安全的HTML字符串
 */
export function safeHtml(strings, ...values) {
  const escaped = values.map(v => {
    if (typeof v === 'string') {
      return escapeHtml(v);
    }
    if (v == null) {
      return '';
    }
    return String(v);
  });
  return strings.reduce((result, str, i) => result + str + (escaped[i] || ''), '');
}

/**
 * 设置元素内容（安全方式）
 * @param {HTMLElement} el - 目标元素
 * @param {string} content - 内容
 * @param {boolean} isHtml - 是否为HTML
 */
export function setContent(el, content, isHtml = false) {
  if (!el) return;

  if (isHtml) {
    el.innerHTML = content;
  } else {
    el.textContent = content;
  }
}

/**
 * 显示/隐藏元素
 * @param {HTMLElement} el - 目标元素
 * @param {boolean} show - 是否显示
 */
export function toggleDisplay(el, show) {
  if (!el) return;
  el.style.display = show ? '' : 'none';
}

/**
 * 添加/移除类
 * @param {HTMLElement} el - 目标元素
 * @param {string} className - 类名
 * @param {boolean} add - 是否添加
 */
export function toggleClass(el, className, add) {
  if (!el) return;
  el.classList.toggle(className, add);
}

/**
 * 批量添加事件监听
 * @param {NodeList|Array} elements - 元素列表
 * @param {string} event - 事件名
 * @param {Function} handler - 处理函数
 */
export function addEventListeners(elements, event, handler) {
  if (!elements || typeof elements.forEach !== 'function') return;
  elements.forEach(el => el.addEventListener(event, handler));
}

/**
 * 事件委托
 * @param {HTMLElement} parent - 父元素
 * @param {string} selector - 子元素选择器
 * @param {string} event - 事件名
 * @param {Function} handler - 处理函数
 */
export function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e, target);
    }
  });
}
