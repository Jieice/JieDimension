/**
 * UI 渲染与事件绑定模块
 * 负责所有标签页的动态渲染和交互逻辑
 */

import { GameState } from './core/state.js';
import { $, createElement, delegate, qs, qsa } from './utils/dom.js';
import { fmt, formatTime, formatPercent } from './utils/format.js';
import { snd, setSoundEnabled, isSoundEnabled } from './utils/sound.js';
import { save, exportSave, importSave, clearSave, calculateOfflineEarnings } from './utils/storage.js';
import { recalculateDerivedStats } from './systems/derived-stats.js';
import * as UpgradeSystem from './systems/upgrades.js';
import * as BossSystem from './systems/boss.js';
import * as PetSystem from './systems/pets.js';
import * as EquipmentSystem from './systems/equipment.js';
import * as GachaSystem from './systems/gacha.js';
import * as AbyssSystem from './systems/abyss.js';
import {
  GAME_CONFIG, UPGRADE_CONFIG, SKILL_CONFIG, PET_CONFIG,
  RESEARCH_CONFIG, ACHIEVEMENT_CONFIG, DAILY_TASK_CONFIG,
  CHAPTER_CONFIG, PRESTIGE_CONFIG, REBIRTH_CONFIG,
  TITLES, BOSS_CONFIG, GACHA_CONFIG, ABYSS_CONFIG,
  TIME_CHALLENGE_CONFIG
} from './constants.js';

// ==================== 通知 ====================

export function notify(message, type = 'info') {
  const container = $('notification-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ==================== 数字弹出特效 ====================

export function showNumberPop(value, isCrit, x, y) {
  const el = document.createElement('div');
  el.className = 'number-pop';
  el.textContent = (isCrit ? '暴击! ' : '+') + fmt(value);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = isCrit ? '#ef4444' : '#fbbf24';
  if (isCrit) el.style.fontSize = '1.8rem';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// ==================== 粒子特效 ====================

export function spawnParticles(x, y, count = 6) {
  const colors = ['#fbbf24', '#fef08a', '#f97316', '#38bdf8'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--tx', (Math.random() - 0.5) * 120 + 'px');
    p.style.setProperty('--ty', (Math.random() - 0.5) * 120 + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

// ==================== 成就弹窗 ====================

export function showAchievementPopup(achievement) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <span class="icon">${achievement.icon}</span>
    <div>
      <div style="font-size:.7rem;color:var(--txm);margin-bottom:2px">🏆 成就解锁</div>
      <div class="text">${achievement.name}</div>
      <div style="font-size:.7rem;color:var(--txm);margin-top:2px">${achievement.desc}</div>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3500);
  snd('achievement');
}

// ==================== 顶部栏完整更新 ====================

export function updateFullUI() {
  const s = GameState;

  // 顶部数值
  const coins = s.get('coins') || 0;
  const cps = s.get('coinsPerSecond') || 0;
  const clickPower = s.get('clickPower') || 1;

  const el = (id) => $(id);
  if (el('hd-coins')) el('hd-coins').textContent = fmt(coins);
  if (el('hd-cps')) el('hd-cps').textContent = fmt(cps);
  if (el('hd-click')) el('hd-click').textContent = fmt(clickPower);

  // 玩家信息
  const player = s.get('player') || {};
  if (el('player-level')) el('player-level').textContent = player.level || 1;
  if (el('player-title')) el('player-title').textContent = player.title || '新手矿工';
  if (el('player-exp-bar')) {
    const pct = player.expNext > 0 ? Math.min(100, (player.exp / player.expNext) * 100) : 0;
    el('player-exp-bar').style.width = pct + '%';
  }

  // 章节信息
  const chapters = s.get('chapters') || [];
  const curChapter = s.get('curChapter') || 0;
  const chapter = chapters[curChapter];
  if (el('chapter-name')) el('chapter-name').textContent = chapter ? chapter.name : '第1章';
  if (el('chapter-progress') && chapter) {
    const pct = Math.min(100, (s.get('lifetimeEarned') || 0) / chapter.goal * 100);
    el('chapter-progress').textContent = Math.floor(pct) + '%';
  }
  if (el('chapter-bar') && chapter) {
    const pct = Math.min(100, (s.get('lifetimeEarned') || 0) / chapter.goal * 100);
    el('chapter-bar').style.width = pct + '%';
  }

  // 日常任务
  const dailyTasks = s.get('dailyTasks') || [];
  const dailyPts = dailyTasks.reduce((sum, t) => sum + (t.claimed ? t.pts : 0), 0);
  if (el('daily-pts')) el('daily-pts').textContent = dailyPts;
  if (el('daily-bar')) el('daily-bar').style.width = Math.min(100, dailyPts / 50 * 100) + '%';

  // 转生点
  const prestige = s.get('prestige') || {};
  if (el('prestige-pts')) el('prestige-pts').textContent = prestige.points || 0;

  // Boss 信息
  const boss = s.get('boss') || {};
  if (el('boss-level')) el('boss-level').textContent = boss.level || 1;
  if (el('boss-name')) el('boss-name').textContent = boss.name || '矿洞守护者';
  if (el('boss-hp')) el('boss-hp').textContent = fmt(boss.hp || 0);
  if (el('boss-max-hp')) el('boss-max-hp').textContent = fmt(boss.maxHp || 1000);
  if (el('boss-hp-bar')) {
    const pct = boss.maxHp > 0 ? (boss.hp / boss.maxHp) * 100 : 0;
    el('boss-hp-bar').style.width = pct + '%';
    el('boss-hp-bar').classList.toggle('low', pct <= 30);
  }
}

// ==================== 升级标签页 ====================

let buyMultiplier = 1;

export function renderUpgrades() {
  const container = $('tc-up');
  if (!container) return;

  const summary = UpgradeSystem.getUpgradeSummary();
  const recommended = UpgradeSystem.getRecommendedUpgrades().map(r => r.key);

  let html = `
    <div class="multiplier-bar">
      <div class="quick-actions">
        <button class="mult-btn ${buyMultiplier === 1 ? 'active' : ''}" data-mult="1">×1</button>
        <button class="mult-btn ${buyMultiplier === 10 ? 'active' : ''}" data-mult="10">×10</button>
        <button class="mult-btn ${buyMultiplier === 100 ? 'active' : ''}" data-mult="100">×100</button>
        <button class="mult-btn ${buyMultiplier === 'max' ? 'active' : ''}" data-mult="max">最大</button>
      </div>
      <button class="sm-btn orange" id="auto-buy-toggle">自动购买: 关</button>
    </div>
  `;

  summary.forEach(u => {
    const isRec = recommended.includes(u.key);
    const isSyn = u.key === 'synergy';
    const costText = buyMultiplier === 1
      ? fmt(u.cost)
      : buyMultiplier === 'max'
        ? `可买${u.maxBuy}次`
        : `×${buyMultiplier}`;
    html += `
      <div class="u-item ${isSyn ? 'syn' : ''} ${isRec ? 'recommended' : ''}" data-key="${u.key}">
        <div class="u-info">
          <div class="u-name">${u.name}</div>
          <div class="u-desc">${getUpgradeDesc(u.key)}</div>
          <div class="u-lvl">
            <span class="badge lv">Lv.${u.level}</span>
            <span class="badge ef">${u.name === '工厂协同' ? (u.level * 10).toFixed(0) + '%协同' : '效果 ' + u.effect.toFixed(1)}</span>
          </div>
        </div>
        <button class="u-btn" data-buy="${u.key}" ${!u.canBuy ? 'disabled' : ''}>
          <span class="cost">💰 ${costText}</span>
          <span>购买</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  // 绑定倍率按钮
  container.querySelectorAll('.mult-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.mult;
      buyMultiplier = val === 'max' ? 'max' : parseInt(val);
      renderUpgrades();
    });
  });

  // 绑定购买按钮
  container.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.buy;
      const result = buyMultiplier === 1
        ? UpgradeSystem.buyUpgrade(key)
        : UpgradeSystem.buyUpgradeMultiple(key, buyMultiplier);
      if (result) {
        renderUpgrades();
        updateFullUI();
      }
    });
  });

  // 自动购买开关
  const autoBtn = $('auto-buy-toggle');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      const enabled = !GameState.get('autoBuy.enabled');
      GameState.set('autoBuy.enabled', enabled);
      autoBtn.textContent = `自动购买: ${enabled ? '开' : '关'}`;
      autoBtn.classList.toggle('auto-on', enabled);
      notify(enabled ? '自动购买已开启' : '自动购买已关闭', 'info');
    });
  }
}

function getUpgradeDesc(key) {
  const config = UPGRADE_CONFIG[key];
  return config ? config.desc : '';
}

// ==================== 技能标签页 ====================

export function renderSkills() {
  const container = $('tc-sk');
  if (!container) return;

  const skills = GameState.get('skills') || [];
  const prestigePts = GameState.get('prestige.points') || 0;

  let html = `<div style="margin-bottom:12px;color:var(--txm);font-size:.8rem">
    转生点: <span style="color:var(--pd);font-weight:700">${prestigePts}</span>
  </div>`;

  skills.forEach((skill, i) => {
    const owned = skill.owned || skill.active || skill.unlocked;
    html += `
      <div class="sk-item ${owned ? 'ok' : ''}">
        <div class="u-info">
          <div class="sk-name">${skill.name}</div>
          <div class="sk-desc">${skill.desc}</div>
          <div class="sk-cost">消耗: ${skill.cost} 转生点</div>
        </div>
        <button class="sk-btn" data-skill-idx="${i}" ${owned || prestigePts < skill.cost ? 'disabled' : ''}>
          ${owned ? '✓ 已学' : '学习'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('[data-skill-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.skillIdx);
      buySkill(idx);
    });
  });
}

function buySkill(idx) {
  const skills = GameState.get('skills') || [];
  const skill = skills[idx];
  if (!skill) return;
  if (skill.owned || skill.active || skill.unlocked) return;

  const prestigePts = GameState.get('prestige.points') || 0;
  if (prestigePts < skill.cost) {
    notify('转生点不足！', 'error');
    return;
  }

  GameState.set('prestige.points', prestigePts - skill.cost);
  skills[idx].owned = true;
  GameState.set('skills', [...skills]);
  recalculateDerivedStats();
  snd('upgrade');
  notify(`学会技能: ${skill.name}`, 'success');
  renderSkills();
  updateFullUI();
}

// ==================== 装备标签页 ====================

export function renderEquipment() {
  const container = $('tc-eq');
  if (!container) return;

  const equipment = GameState.get('equipment') || {};
  const inventory = GameState.get('inventory') || [];

  // 已装备
  const slots = [
    { key: 'weapon', name: '武器', icon: '⚔️' },
    { key: 'armor', name: '护甲', icon: '🛡️' },
    { key: 'ring', name: '戒指', icon: '💍' }
  ];

  let html = '<div style="font-weight:700;font-size:.85rem;margin-bottom:8px;color:var(--p)">已装备</div>';
  html += '<div class="eq-grid">';
  slots.forEach(slot => {
    const item = equipment[slot.key] || {};
    const hasItem = item.id !== null && item.id !== undefined;
    html += `
      <div class="eq-card ${hasItem ? 'filled' : ''}">
        <div class="eq-slot-icon">${hasItem ? (item.icon || slot.icon) : slot.icon}</div>
        <div class="eq-slot-name">${hasItem ? item.name : '空'}</div>
        <div class="eq-slot-bonus">${hasItem ? '加成: ' + (item.bonus || 0).toFixed(1) : ''}</div>
        ${hasItem ? `<div style="font-size:.6rem;color:var(--txm)">Lv.${item.level || 0}</div>` : ''}
        <div style="margin-top:6px;display:flex;gap:4px;justify-content:center">
          ${hasItem ? `
            <button class="sm-btn green" data-enhance="${slot.key}" style="font-size:.6rem;padding:3px 8px">强化</button>
            <button class="sm-btn orange" data-unequip="${slot.key}" style="font-size:.6rem;padding:3px 8px">卸下</button>
          ` : ''}
        </div>
      </div>
    `;
  });
  html += '</div>';

  // 背包
  html += '<div style="font-weight:700;font-size:.85rem;margin:12px 0 8px;color:var(--s)">背包</div>';
  if (inventory.length === 0) {
    html += '<div style="color:var(--txm);font-size:.8rem;text-align:center;padding:20px">背包空空如也，去祈愿获取装备吧！</div>';
  } else {
    inventory.forEach((item, i) => {
      const rarity = item.rarity || 'c';
      const rarityNames = { sr: 'SR', r: 'R', uc: 'UC', c: 'C' };
      const rarityColors = { sr: '#FF9800', r: '#2196F3', uc: '#4CAF50', c: '#9e9e9e' };
      html += `
        <div class="u-item" style="border-left:3px solid ${rarityColors[rarity] || '#9e9e9e'}">
          <div class="u-info">
            <div class="u-name">${item.icon || ''} ${item.name} <span style="color:${rarityColors[rarity]};font-size:.65rem">[${rarityNames[rarity] || 'C'}]</span></div>
            <div class="u-desc">${item.type === 'weapon' ? '武器' : item.type === 'armor' ? '护甲' : item.type === 'ring' ? '戒指' : '物品'}</div>
          </div>
          <button class="sm-btn green" data-equip-idx="${i}" data-equip-type="${item.type}">装备</button>
        </div>
      `;
    });
  }

  container.innerHTML = html;

  // 绑定装备按钮
  container.querySelectorAll('[data-equip-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.equipIdx);
      const type = btn.dataset.equipType;
      const slotMap = { weapon: 'weapon', armor: 'armor', ring: 'ring' };
      const slot = slotMap[type] || 'weapon';
      const inventory = GameState.get('inventory') || [];
      if (inventory[idx]) {
        const result = EquipmentSystem.equipItem(slot, inventory[idx]);
        if (result) {
          snd('upgrade');
          notify('装备成功！', 'success');
          renderEquipment();
          updateFullUI();
        }
      }
    });
  });

  // 绑定强化按钮
  container.querySelectorAll('[data-enhance]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.dataset.enhance;
      const result = EquipmentSystem.enhanceEquipment(slot);
      if (result) {
        notify(result.success ? `强化成功！Lv.${result.newLevel}` : '强化失败...', result.success ? 'success' : 'warning');
        renderEquipment();
        updateFullUI();
      }
    });
  });

  // 绑定卸下按钮
  container.querySelectorAll('[data-unequip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.dataset.unequip;
      EquipmentSystem.unequipItem(slot);
      notify('已卸下装备', 'info');
      renderEquipment();
      updateFullUI();
    });
  });
}

// ==================== 宠物标签页 ====================

export function renderPets() {
  const container = $('tc-pt');
  if (!container) return;

  const pets = GameState.get('pets') || [];

  let html = '';
  pets.forEach((pet, i) => {
    const upgradeCost = Math.floor(1000 * Math.pow(1.5, (pet.level || 1) - 1));
    html += `
      <div class="pet-card ${pet.owned ? 'owned' : ''} ${pet.active ? 'active' : ''}">
        <div class="pet-icon">${pet.icon}</div>
        <div class="pet-info">
          <div class="pet-name">${pet.name} ${pet.owned ? `<span class="pet-level">Lv.${pet.level || 1}</span>` : ''}</div>
          <div class="pet-desc">${pet.desc}</div>
          ${!pet.owned ? `<div class="sk-cost">💰 ${fmt(pet.cost)}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${!pet.owned ? `<button class="sm-btn green" data-pet-buy="${i}">购买</button>` : ''}
          ${pet.owned && !pet.active ? `<button class="sm-btn orange" data-pet-activate="${i}">出战</button>` : ''}
          ${pet.owned ? `<button class="sm-btn purple" data-pet-upgrade="${i}" style="font-size:.6rem">升级 💰${fmt(upgradeCost)}</button>` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('[data-pet-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.petBuy);
      const result = PetSystem.buyPet(pets[idx].id);
      if (result) {
        notify(`获得宠物: ${pets[idx].name}！`, 'success');
        renderPets();
        updateFullUI();
      } else {
        notify('金币不足！', 'error');
      }
    });
  });

  container.querySelectorAll('[data-pet-activate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.petActivate);
      PetSystem.activatePet(pets[idx].id);
      notify(`${pets[idx].name} 已出战！`, 'success');
      renderPets();
      updateFullUI();
    });
  });

  container.querySelectorAll('[data-pet-upgrade]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.petUpgrade);
      const result = PetSystem.upgradePet(pets[idx].id);
      if (result) {
        notify(`${pets[idx].name} 升级成功！`, 'success');
        renderPets();
        updateFullUI();
      } else {
        notify('金币不足！', 'error');
      }
    });
  });
}

// ==================== 研究标签页 ====================

export function renderResearch() {
  const container = $('tc-rs');
  if (!container) return;

  const research = GameState.get('research') || [];
  const materials = GameState.get('materials') || {};

  let html = '<div style="margin-bottom:12px;display:flex;gap:12px;flex-wrap:wrap;color:var(--txm);font-size:.75rem">';
  html += `<span>🪨 铁: <b style="color:var(--tx2)">${materials.iron || 0}</b></span>`;
  html += `<span>💎 水晶: <b style="color:var(--tx2)">${materials.crystal || 0}</b></span>`;
  html += `<span>🐉 龙鳞: <b style="color:var(--tx2)">${materials.dragonScale || 0}</b></span>`;
  html += `<span>🔮 古宝石: <b style="color:var(--tx2)">${materials.ancientGem || 0}</b></span>`;
  html += '</div>';

  research.forEach((item, i) => {
    const owned = item.owned || item.active || item.unlocked;
    const matCost = item.cost;
    const canAfford = (materials.iron || 0) >= matCost;
    html += `
      <div class="sk-item ${owned ? 'ok' : ''}">
        <div class="u-info">
          <div class="sk-name">${item.name}</div>
          <div class="sk-desc">${item.desc}</div>
          <div class="sk-cost">消耗: 🪨 ${fmt(matCost)} 铁矿</div>
        </div>
        <button class="sk-btn" data-research-idx="${i}" ${owned || !canAfford ? 'disabled' : ''}>
          ${owned ? '✓ 完成' : '研究'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('[data-research-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.researchIdx);
      buyResearch(idx);
    });
  });
}

function buyResearch(idx) {
  const research = GameState.get('research') || [];
  const item = research[idx];
  if (!item) return;
  if (item.owned || item.active || item.unlocked) return;

  const materials = GameState.get('materials') || {};
  if ((materials.iron || 0) < item.cost) {
    notify('铁矿不足！', 'error');
    return;
  }

  GameState.set('materials.iron', materials.iron - item.cost);
  research[idx].owned = true;
  GameState.set('research', [...research]);
  recalculateDerivedStats();
  snd('upgrade');
  notify(`研究完成: ${item.name}`, 'success');
  renderResearch();
  updateFullUI();
}

// ==================== 祈愿标签页 ====================

export function renderGacha() {
  const container = $('tc-gt');
  if (!container) return;

  const coins = GameState.get('coins') || 0;
  const tix = GameState.get('gachaTix') || 0;
  const pity = GachaSystem.getPityProgress();

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
      <div style="color:var(--txm);font-size:.8rem">
        祈愿券: <span style="color:var(--pp);font-weight:700">${tix}</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="m-btn" id="gacha-1" ${coins < GACHA_CONFIG.COST_1 && tix < 1 ? 'disabled' : ''}>
          单抽 💰${GACHA_CONFIG.COST_1}
        </button>
        <button class="m-btn" id="gacha-10" ${coins < GACHA_CONFIG.COST_10 ? 'disabled' : ''}>
          十连 💰${GACHA_CONFIG.COST_10}
        </button>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:.75rem;color:var(--txm);margin-bottom:4px">R保底: ${pity.sr.current}/${pity.sr.max}</div>
      <div style="height:6px;background:var(--card2);border-radius:6px;overflow:hidden">
        <div style="height:100%;width:${pity.sr.percent}%;background:linear-gradient(90deg,var(--s),var(--p));border-radius:6px;transition:width .3s"></div>
      </div>
    </div>
    <div style="font-weight:700;font-size:.85rem;margin-bottom:8px;color:var(--p)">祈愿记录</div>
    <div id="gacha-results" style="min-height:60px;color:var(--txm);font-size:.8rem;text-align:center;padding:12px">
      点击按钮开始祈愿
    </div>
  `;

  container.innerHTML = html;

  const gacha1Btn = $('gacha-1');
  const gacha10Btn = $('gacha-10');

  if (gacha1Btn) {
    gacha1Btn.addEventListener('click', () => {
      const useTix = (GameState.get('gachaTix') || 0) >= 1 && coins < GACHA_CONFIG.COST_1;
      const result = GachaSystem.doSingleGacha('standard', useTix);
      if (result) {
        showGachaResults([result]);
        renderGacha();
        updateFullUI();
      } else {
        notify('资源不足！', 'error');
      }
    });
  }

  if (gacha10Btn) {
    gacha10Btn.addEventListener('click', () => {
      const results = GachaSystem.doTenGacha('standard');
      if (results && results.length > 0) {
        showGachaResults(results);
        renderGacha();
        updateFullUI();
      } else {
        notify('金币不足！', 'error');
      }
    });
  }
}

function showGachaResults(results) {
  const container = $('gacha-results');
  if (!container) return;

  const rarityNames = { sr: 'SR', r: 'R', uc: 'UC', c: 'C' };
  const rarityColors = { sr: '#FF9800', r: '#2196F3', uc: '#4CAF50', c: '#9e9e9e' };

  let html = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
  results.forEach(r => {
    html += `
      <div style="padding:8px 12px;background:var(--card);border-radius:var(--radius-sm);border:1px solid ${rarityColors[r.rarity]};text-align:center;min-width:70px">
        <div style="font-size:1.3rem">${r.icon || '?'}</div>
        <div style="font-size:.7rem;font-weight:700;color:${rarityColors[r.rarity]}">[${rarityNames[r.rarity]}]</div>
        <div style="font-size:.65rem;color:var(--tx2)">${r.name}</div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

// ==================== 远征标签页 ====================

export function renderExpedition() {
  const container = $('tc-exp');
  if (!container) return;

  const expeditions = [
    { id: 'exp1', name: '铁矿远征', desc: '派遣工人采集铁矿', time: 60, reward: { iron: 20 }, cost: 500 },
    { id: 'exp2', name: '水晶探索', desc: '深入洞穴寻找水晶', time: 180, reward: { crystal: 10 }, cost: 2000 },
    { id: 'exp3', name: '龙巢冒险', desc: '挑战龙巢获取龙鳞', time: 600, reward: { dragonScale: 5 }, cost: 10000 },
    { id: 'exp4', name: '遗迹发掘', desc: '探索远古遗迹', time: 1800, reward: { ancientGem: 2, gachaTix: 1 }, cost: 50000 }
  ];

  const expeditionState = GameState.get('expeditionState') || {};

  let html = '<div style="font-weight:700;font-size:.85rem;margin-bottom:12px;color:var(--p)">派遣远征</div>';

  expeditions.forEach(exp => {
    const state = expeditionState[exp.id];
    const isActive = state && state.endTime > Date.now();
    const isComplete = state && state.endTime > 0 && state.endTime <= Date.now() && !state.claimed;

    html += `
      <div class="u-item">
        <div class="u-info">
          <div class="u-name">${exp.name}</div>
          <div class="u-desc">${exp.desc}</div>
          <div class="u-desc">奖励: ${Object.entries(exp.reward).map(([k, v]) => {
            const names = { iron: '铁矿', crystal: '水晶', dragonScale: '龙鳞', ancientGem: '古宝石', gachaTix: '祈愿券' };
            return `${names[k] || k}×${v}`;
          }).join(', ')}</div>
          <div class="sk-cost">💰 ${fmt(exp.cost)} · ⏱ ${formatTime(exp.time)}</div>
          ${isActive ? `<div class="sk-cost" id="exp-timer-${exp.id}">进行中...</div>` : ''}
        </div>
        ${isComplete ? `<button class="sm-btn green" data-exp-claim="${exp.id}">领取</button>` : ''}
        ${!isActive && !isComplete ? `<button class="sm-btn orange" data-exp-start="${exp.id}" ${GameState.get('coins') < exp.cost ? 'disabled' : ''}>派遣</button>` : ''}
      </div>
    `;
  });

  container.innerHTML = html;

  // 绑定派遣按钮
  container.querySelectorAll('[data-exp-start]').forEach(btn => {
    btn.addEventListener('click', () => {
      const expId = btn.dataset.expStart;
      const exp = expeditions.find(e => e.id === expId);
      if (!exp) return;
      const coins = GameState.get('coins') || 0;
      if (coins < exp.cost) { notify('金币不足！', 'error'); return; }
      GameState.set('coins', coins - exp.cost);
      const state = GameState.get('expeditionState') || {};
      state[expId] = { endTime: Date.now() + exp.time * 1000, reward: exp.reward, claimed: false };
      GameState.set('expeditionState', state);
      snd('upgrade');
      notify('远征已派遣！', 'success');
      renderExpedition();
      updateFullUI();
      updateDailyProgress('expedition', 1);
    });
  });

  // 绑定领取按钮
  container.querySelectorAll('[data-exp-claim]').forEach(btn => {
    btn.addEventListener('click', () => {
      const expId = btn.dataset.expClaim;
      const state = (GameState.get('expeditionState') || {})[expId];
      if (!state) return;
      // 发放奖励
      Object.entries(state.reward).forEach(([k, v]) => {
        if (k === 'gachaTix') GameState.increment('gachaTix', v);
        else GameState.increment(`materials.${k}`, v);
      });
      state.claimed = true;
      const expeditionState = GameState.get('expeditionState') || {};
      expeditionState[expId] = state;
      GameState.set('expeditionState', expeditionState);
      snd('big');
      notify('远征奖励已领取！', 'success');
      renderExpedition();
      updateFullUI();
    });
  });

  // 更新计时器
  updateExpeditionTimers(expeditions);
}

function updateExpeditionTimers(expeditions) {
  const state = GameState.get('expeditionState') || {};
  expeditions.forEach(exp => {
    const s = state[exp.id];
    if (s && s.endTime > Date.now() && !s.claimed) {
      const timerEl = $(`exp-timer-${exp.id}`);
      if (timerEl) {
        const remaining = Math.max(0, Math.floor((s.endTime - Date.now()) / 1000));
        timerEl.textContent = `剩余: ${formatTime(remaining)}`;
      }
    }
  });
}

// ==================== 世界Boss标签页 ====================

export function renderWorldBoss() {
  const container = $('tc-wboss');
  if (!container) return;

  const wboss = GameState.get('worldBoss') || {
    name: '深渊领主',
    hp: 10000,
    maxHp: 10000,
    level: 1,
    timer: 3600,
    active: false
  };

  const isDefeated = wboss.hp <= 0;
  const pct = wboss.maxHp > 0 ? (Math.max(0, wboss.hp) / wboss.maxHp * 100) : 0;

  let html = `
    <div style="text-align:center;padding:16px">
      <div style="font-size:2.5rem;margin-bottom:8px">💀</div>
      <div style="font-weight:700;font-size:1rem;color:var(--a);margin-bottom:4px">${wboss.name}</div>
      <div style="font-size:.75rem;color:var(--txm);margin-bottom:12px">Lv.${wboss.level || 1}</div>
      <div style="max-width:300px;margin:0 auto">
        <div style="height:12px;background:var(--card2);border-radius:12px;overflow:hidden;margin-bottom:4px">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--a),#dc2626);border-radius:12px;transition:width .3s"></div>
        </div>
        <div style="font-size:.7rem;color:var(--txm)">${fmt(Math.max(0, wboss.hp))} / ${fmt(wboss.maxHp)}</div>
      </div>
      <div style="margin-top:16px">
        <button class="m-btn" id="wboss-atk" ${isDefeated ? 'disabled' : ''}>
          ⚔️ 攻击 (使用点击力)
        </button>
      </div>
      <div style="margin-top:12px;font-size:.75rem;color:var(--txm)">
        你的贡献伤害: <span style="color:var(--og);font-weight:700">${fmt(GameState.get('stats.wbossDmg') || 0)}</span>
      </div>
      ${isDefeated ? '<div style="margin-top:12px;color:var(--ok);font-weight:700">🎉 世界Boss已被击败！奖励已发放。</div>' : ''}
    </div>
  `;

  container.innerHTML = html;

  const atkBtn = $('wboss-atk');
  if (atkBtn && !isDefeated) {
    atkBtn.addEventListener('click', () => {
      const clickPower = GameState.get('clickPower') || 1;
      const critChance = GameState.get('critChance') || 5;
      const critDamage = GameState.get('critDamage') || 2;
      let dmg = clickPower;
      let isCrit = Math.random() * 100 < critChance;
      if (isCrit) dmg *= critDamage;

      const wboss = GameState.get('worldBoss') || {};
      wboss.hp = Math.max(0, (wboss.hp || 0) - dmg);
      GameState.set('worldBoss', wboss);
      GameState.increment('stats.wbossDmg', dmg);
      updateDailyProgress('bossAtk', 1);

      if (wboss.hp <= 0) {
        // 击败奖励
        const reward = Math.floor(5000 * Math.pow(1.5, (wboss.level || 1) - 1));
        GameState.increment('coins', reward);
        GameState.increment('materials.dragonScale', 5);
        GameState.increment('gachaTix', 2);
        snd('boss');
        notify(`世界Boss击败！获得 💰${fmt(reward)} + 龙鳞×5 + 祈愿券×2`, 'success');
        document.querySelector('.app')?.classList.add('shake-screen');
        setTimeout(() => document.querySelector('.app')?.classList.remove('shake-screen'), 500);
        // 重生世界Boss
        setTimeout(() => {
          const newLevel = (wboss.level || 1) + 1;
          GameState.set('worldBoss', {
            name: getWorldBossName(newLevel),
            hp: Math.floor(10000 * Math.pow(1.8, newLevel - 1)),
            maxHp: Math.floor(10000 * Math.pow(1.8, newLevel - 1)),
            level: newLevel,
            timer: 3600,
            active: true
          });
          renderWorldBoss();
        }, 2000);
      } else {
        snd('coin');
      }

      renderWorldBoss();
      updateFullUI();
    });
  }
}

function getWorldBossName(level) {
  const names = ['深渊领主', '虚空巨兽', '混沌之主', '毁灭使者', '永恒守卫', '终焉之王'];
  return names[Math.min(level - 1, names.length - 1)] || `世界Boss Lv.${level}`;
}

// ==================== 成就标签页 ====================

export function renderAchievements() {
  const container = $('tc-ach');
  if (!container) return;

  const achievements = GameState.get('achievements') || [];
  const stats = GameState.get('stats') || {};

  let html = '';
  achievements.forEach((ach, i) => {
    const unlocked = ach.unlocked || ach.completed || ach.done;
    let current = 0;
    switch (ach.cond) {
      case 'clicks': current = stats.clicks || 0; break;
      case 'earn': current = GameState.get('lifetimeEarned') || 0; break;
      case 'crits': current = stats.crits || 0; break;
      case 'boss': current = GameState.get('boss.defeated') || 0; break;
      case 'prestige': current = GameState.get('prestige.count') || 0; break;
    }
    const pct = Math.min(100, current / ach.tgt * 100);

    html += `
      <div class="ach-item ${unlocked ? 'unlocked' : ''}">
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-name">${ach.name} ${unlocked ? '✓' : ''}</div>
          <div class="ach-desc">${ach.desc}</div>
          <div style="font-size:.65rem;color:var(--txm);margin-top:2px">${fmt(current)}/${fmt(ach.tgt)} (${Math.floor(pct)}%)</div>
          <div class="ach-bonus">${ach.bonus}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==================== 收藏标签页 ====================

export function renderCollection() {
  const container = $('tc-col');
  if (!container) return;

  const inventory = GameState.get('inventory') || [];
  const equipment = GameState.get('equipment') || {};
  const pets = GameState.get('pets') || [];

  // 统计
  const ownedPets = pets.filter(p => p.owned).length;
  const totalPets = pets.length;
  const equippedSlots = Object.values(equipment).filter(e => e && e.id).length;
  const totalSlots = 3;

  let html = `
    <div style="font-weight:700;font-size:.85rem;margin-bottom:12px;color:var(--p)">收藏进度</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px">
      <div class="u-item" style="margin:0">
        <div class="u-info">
          <div class="u-name">🐾 宠物收集</div>
          <div class="u-desc">${ownedPets}/${totalPets}</div>
        </div>
      </div>
      <div class="u-item" style="margin:0">
        <div class="u-info">
          <div class="u-name">⚔️ 装备栏位</div>
          <div class="u-desc">${equippedSlots}/${totalSlots}</div>
        </div>
      </div>
      <div class="u-item" style="margin:0">
        <div class="u-info">
          <div class="u-name">📊 统计数据</div>
          <div class="u-desc">点击: ${fmt(GameState.get('stats.clicks') || 0)}</div>
        </div>
      </div>
      <div class="u-item" style="margin:0">
        <div class="u-info">
          <div class="u-name">⏱ 游戏时长</div>
          <div class="u-desc">${formatTime((GameState.get('stats.playTime') || 0) / 10)}</div>
        </div>
      </div>
    </div>
    <div style="font-weight:700;font-size:.85rem;margin-bottom:8px;color:var(--s)">材料仓库</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
  `;

  const materials = GameState.get('materials') || {};
  const matInfo = [
    { key: 'iron', name: '铁矿', icon: '🪨' },
    { key: 'crystal', name: '水晶', icon: '💎' },
    { key: 'dragonScale', name: '龙鳞', icon: '🐉' },
    { key: 'ancientGem', name: '古宝石', icon: '🔮' }
  ];

  matInfo.forEach(m => {
    html += `
      <div class="u-item" style="margin:0">
        <div class="u-info">
          <div class="u-name">${m.icon} ${m.name}</div>
          <div class="u-desc" style="color:var(--p);font-weight:700">${fmt(materials[m.key] || 0)}</div>
        </div>
      </div>
    `;
  });

  html += `
    </div>
    <div style="margin-top:12px;font-size:.75rem;color:var(--txm)">
      💎 宝石: <span style="color:var(--s);font-weight:700">${GameState.get('gems') || 0}</span> ·
      🎫 祈愿券: <span style="color:var(--pp);font-weight:700">${GameState.get('gachaTix') || 0}</span>
    </div>
  `;

  container.innerHTML = html;
}

// ==================== 设置面板 ====================

export function showSettingsModal() {
  const existing = document.querySelector('.modal-ov');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-ov';
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px;text-align:left">
      <h2>⚙️ 设置</h2>
      <div style="margin-top:16px">
        <div class="qol-option">
          <span>🔊 音效</span>
          <label class="toggle-switch">
            <input type="checkbox" id="set-sound" ${isSoundEnabled() ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="qol-option">
          <span>🎨 紧凑模式</span>
          <label class="toggle-switch">
            <input type="checkbox" id="set-compact" ${GameState.get('qolSettings.compactMode') ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="qol-option">
          <span>💡 推荐升级</span>
          <label class="toggle-switch">
            <input type="checkbox" id="set-recommend" ${GameState.get('qolSettings.showRecommendations') !== false ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        <button class="sm-btn green" id="set-save">💾 保存游戏</button>
        <button class="sm-btn orange" id="set-export">📤 导出存档</button>
        <button class="sm-btn purple" id="set-import">📥 导入存档</button>
        <button class="sm-btn" style="background:var(--a)" id="set-reset">🗑️ 重置游戏</button>
      </div>
      <div style="margin-top:12px;text-align:center">
        <button class="m-btn" id="set-close">关闭</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 音效
  $('set-sound').addEventListener('change', (e) => {
    setSoundEnabled(e.target.checked);
    GameState.set('soundOn', e.target.checked);
  });

  // 紧凑模式
  $('set-compact').addEventListener('change', (e) => {
    GameState.set('qolSettings.compactMode', e.target.checked);
    document.body.classList.toggle('compact-mode', e.target.checked);
  });

  // 推荐
  $('set-recommend').addEventListener('change', (e) => {
    GameState.set('qolSettings.showRecommendations', e.target.checked);
  });

  // 保存
  $('set-save').addEventListener('click', () => {
    GameState.save();
    notify('游戏已保存！', 'success');
  });

  // 导出
  $('set-export').addEventListener('click', () => {
    const data = exportSave();
    if (data) {
      navigator.clipboard.writeText(data).then(() => {
        notify('存档已复制到剪贴板！', 'success');
      }).catch(() => {
        prompt('复制以下存档代码：', data);
      });
    }
  });

  // 导入
  $('set-import').addEventListener('click', () => {
    const data = prompt('粘贴存档代码：');
    if (data) {
      const result = importSave(data);
      if (result) {
        notify('存档导入成功！即将刷新...', 'success');
        setTimeout(() => location.reload(), 1000);
      } else {
        notify('存档导入失败！', 'error');
      }
    }
  });

  // 重置
  $('set-reset').addEventListener('click', () => {
    if (confirm('⚠️ 确定重置？所有进度将丢失！')) {
      clearSave();
      location.reload();
    }
  });

  // 关闭
  $('set-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ==================== 转生面板 ====================

export function showPrestigeModal() {
  const coins = GameState.get('lifetimeEarned') || 0;
  const canPrestige = coins >= PRESTIGE_CONFIG.THRESHOLD;
  const pointsGain = Math.floor(Math.sqrt(coins / PRESTIGE_CONFIG.THRESHOLD) * PRESTIGE_CONFIG.POINTS_MULTIPLIER);

  const existing = document.querySelector('.modal-ov');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-ov';
  overlay.innerHTML = `
    <div class="modal" style="max-width:380px">
      <h2>🔄 转生</h2>
      <div style="margin:16px 0;color:var(--tx2);font-size:.85rem">
        <p>转生将重置金币和升级，但保留：</p>
        <ul style="margin:8px 0 0 16px;color:var(--txm);font-size:.8rem">
          <li>技能（已学习的）</li>
          <li>宠物</li>
          <li>研究</li>
          <li>装备</li>
        </ul>
        <div style="margin-top:12px;padding:12px;background:var(--card);border-radius:var(--radius-sm)">
          <div>累计收入: <span style="color:var(--p)">${fmt(coins)}</span> / ${fmt(PRESTIGE_CONFIG.THRESHOLD)}</div>
          <div style="margin-top:4px">可获得: <span style="color:var(--pd);font-weight:700">${pointsGain} 转生点</span></div>
        </div>
      </div>
      <button class="m-btn" id="prestige-btn" ${!canPrestige ? 'disabled' : ''} style="${canPrestige ? 'background:linear-gradient(145deg,var(--pp),#7e22ce)' : ''}">
        ${canPrestige ? `🔄 转生 (获得${pointsGain}点)` : '条件不足'}
      </button>
      <div style="margin-top:8px">
        <button class="m-btn" id="prestige-close" style="background:var(--card2);color:var(--txm);box-shadow:none">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  $('prestige-btn').addEventListener('click', () => {
    if (!canPrestige) return;
    doPrestige(pointsGain);
    overlay.remove();
  });

  $('prestige-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function doPrestige(pointsGain) {
  // 保留
  const skills = GameState.get('skills') || [];
  const pets = GameState.get('pets') || [];
  const research = GameState.get('research') || [];
  const equipment = GameState.get('equipment') || {};
  const inventory = GameState.get('inventory') || [];
  const achievements = GameState.get('achievements') || [];
  const materials = GameState.get('materials') || {};
  const gems = GameState.get('gems') || 0;
  const gachaTix = GameState.get('gachaTix') || 0;
  const gachaPity = GameState.get('gachaPity') || { sr: 0, ssr: 0 };

  // 重置
  const fresh = createFreshState();
  fresh.skills = skills;
  fresh.pets = pets;
  fresh.research = research;
  fresh.equipment = equipment;
  fresh.inventory = inventory;
  fresh.achievements = achievements;
  fresh.materials = materials;
  fresh.gems = gems;
  fresh.gachaTix = gachaTix;
  fresh.gachaPity = gachaPity;
  fresh.prestige.points = (GameState.get('prestige.points') || 0) + pointsGain;
  fresh.prestige.count = (GameState.get('prestige.count') || 0) + 1;
  fresh.prestige.mult = 1 + fresh.prestige.count * 0.1;

  GameState.init(fresh);
  recalculateDerivedStats();
  GameState.save();
  snd('prestige');
  notify(`转生成功！获得 ${pointsGain} 转生点`, 'success');
  renderAllTabs();
  updateFullUI();
}

// ==================== 重生面板 ====================

export function showRebirthModal() {
  const prestigeCount = GameState.get('prestige.count') || 0;
  const canRebirth = prestigeCount >= REBIRTH_CONFIG.PRESTIGE_THRESHOLD;

  const existing = document.querySelector('.modal-ov');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-ov';
  overlay.innerHTML = `
    <div class="modal" style="max-width:380px">
      <h2>✨ 重生</h2>
      <div style="margin:16px 0;color:var(--tx2);font-size:.85rem">
        <p>重生将重置大部分进度，但获得永久加成。</p>
        <div style="margin-top:12px;padding:12px;background:var(--card);border-radius:var(--radius-sm)">
          <div>需要: <span style="color:var(--pd)">${REBIRTH_CONFIG.PRESTIGE_THRESHOLD}次转生</span></div>
          <div style="margin-top:4px">当前: <span style="color:var(--s)">${prestigeCount}次</span></div>
          <div style="margin-top:4px">效果: 全局倍率 +${(GameState.get('rebirth.count') || 0) + 1}0%</div>
        </div>
      </div>
      <button class="m-btn" id="rebirth-btn" ${!canRebirth ? 'disabled' : ''} style="${canRebirth ? 'background:linear-gradient(145deg,var(--s),#0284c7)' : ''}">
        ${canRebirth ? '✨ 重生' : `需要${REBIRTH_CONFIG.PRESTIGE_THRESHOLD}次转生`}
      </button>
      <div style="margin-top:8px">
        <button class="m-btn" id="rebirth-close" style="background:var(--card2);color:var(--txm);box-shadow:none">取消</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  $('rebirth-btn').addEventListener('click', () => {
    if (!canRebirth) return;
    doRebirth();
    overlay.remove();
  });

  $('rebirth-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function doRebirth() {
  const fresh = createFreshState();
  const oldRebirthCount = GameState.get('rebirth.count') || 0;
  fresh.rebirth.count = oldRebirthCount + 1;
  fresh.rebirth.mult = 1 + (oldRebirthCount + 1) * 0.1;
  fresh.globalMultiplier = fresh.rebirth.mult;

  GameState.init(fresh);
  recalculateDerivedStats();
  GameState.save();
  snd('rebirth');
  notify(`重生成功！全局倍率 ×${fresh.rebirth.mult.toFixed(1)}`, 'success');
  renderAllTabs();
  updateFullUI();
}

function createFreshState() {
  // 导入 createInitialState 的逻辑（避免循环依赖）
  return {
    coins: 0,
    totalEarned: 0,
    lifetimeEarned: 0,
    clickPower: 1,
    coinsPerSecond: 0,
    critChance: 5,
    critDamage: 2,
    globalMultiplier: 1,
    soundOn: true,
    theme: 'gold',
    backgroundEnabled: true,
    buyMultiplier: 1,
    player: { level: 1, exp: 0, expNext: 100, title: '新手矿工', avatar: '🧑‍💼' },
    chapters: CHAPTER_CONFIG.GOALS.map((goal, i) => ({
      id: i + 1, name: CHAPTER_CONFIG.NAMES[i], goal, done: false
    })),
    curChapter: 0,
    boss: { name: '矿洞守护者', avatar: '👹', hp: 1000, maxHp: 1000, reward: 500, gemReward: 1, matReward: 1, level: 1, defeated: 0 },
    materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 },
    gems: 0,
    inventory: [],
    gachaTix: 0,
    gachaPity: { sr: 0, ssr: 0 },
    equipment: {
      weapon: { id: null, name: '无', icon: '⚔️', bonus: 0, level: 0 },
      armor: { id: null, name: '无', icon: '🛡️', bonus: 0, level: 0 },
      ring: { id: null, name: '无', icon: '💍', bonus: 0, level: 0 }
    },
    upgrades: Object.fromEntries(
      Object.entries(UPGRADE_CONFIG).map(([key, config]) => [
        key, { level: 0, base: config.base, mult: config.mult, eff: config.eff }
      ])
    ),
    skills: SKILL_CONFIG.map(s => ({ ...s })),
    pets: PET_CONFIG.map(p => ({ ...p, owned: false, active: false, level: 1 })),
    research: RESEARCH_CONFIG.map(r => ({ ...r })),
    achievements: ACHIEVEMENT_CONFIG.map(a => ({ ...a })),
    dailyTasks: DAILY_TASK_CONFIG.map(d => ({ ...d, progress: 0, claimed: false })),
    prestige: { points: 0, mult: 1, count: 0 },
    rebirth: { count: 0, mult: 1, essence: 0 },
    stats: { clicks: 0, crits: 0, playTime: 0, gachaTotal: 0, expCompleted: 0, wbossDmg: 0 },
    abilities: {
      frenzy: { cd: 0, dur: 10, base: 30, on: false },
      golden: { cd: 0, dur: 15, base: 60, on: false },
      lucky: { cd: 0, dur: 20, base: 90, on: false },
      mg: { cd: 0, base: 60 }
    },
    events: { active: null, timer: 0, mult: 1 },
    combo: { count: 0, timer: null, last: 0 },
    autoClicks: 0,
    abyss: {
      currentFloor: 0, highestFloor: 0, enemy: null,
      rewards: { essence: 0, materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 }, gachaTix: 0 },
      cooldown: 0
    },
    qolSettings: { autoBuyEnabled: false, autoBuyInterval: 5000, autoCollectEnabled: false, showRecommendations: true, compactMode: false },
    autoBuy: { enabled: false, interval: 5000, priority: ['click', 'worker', 'factory', 'bank', 'ai', 'crit', 'critdmg', 'synergy'], lastRun: 0 },
    worldBoss: { name: '深渊领主', hp: 10000, maxHp: 10000, level: 1, timer: 3600, active: true },
    expeditionState: {},
    lastSave: Date.now()
  };
}

// ==================== 日常任务系统 ====================

export function updateDailyProgress(type, amount = 1) {
  const tasks = GameState.get('dailyTasks') || [];
  let changed = false;
  tasks.forEach((task, i) => {
    if (task.type === type && !task.claimed) {
      task.progress = (task.progress || 0) + amount;
      changed = true;
    }
  });
  if (changed) {
    GameState.set('dailyTasks', [...tasks]);
    checkDailyCompletion();
  }
}

function checkDailyCompletion() {
  const tasks = GameState.get('dailyTasks') || [];
  tasks.forEach(task => {
    if ((task.progress || 0) >= task.tgt && !task.claimed) {
      // 自动提示
    }
  });
}

export function renderDailyTasks() {
  // 在日常卡片区域渲染（可选，目前日常信息在左侧面板显示）
}

// ==================== 成就检测 ====================

export function checkAchievements() {
  const achievements = GameState.get('achievements') || [];
  const stats = GameState.get('stats') || {};
  let newUnlocks = [];

  achievements.forEach((ach, i) => {
    if (ach.unlocked || ach.completed || ach.done) return;

    let current = 0;
    switch (ach.cond) {
      case 'clicks': current = stats.clicks || 0; break;
      case 'earn': current = GameState.get('lifetimeEarned') || 0; break;
      case 'crits': current = stats.crits || 0; break;
      case 'boss': current = GameState.get('boss.defeated') || 0; break;
      case 'prestige': current = GameState.get('prestige.count') || 0; break;
    }

    if (current >= ach.tgt) {
      achievements[i].unlocked = true;
      newUnlocks.push(ach);
    }
  });

  if (newUnlocks.length > 0) {
    GameState.set('achievements', [...achievements]);
    newUnlocks.forEach(ach => showAchievementPopup(ach));
  }
}

// ==================== 章节推进 ====================

export function checkChapterProgress() {
  const chapters = GameState.get('chapters') || [];
  const curChapter = GameState.get('curChapter') || 0;
  const lifetimeEarned = GameState.get('lifetimeEarned') || 0;

  if (curChapter < chapters.length) {
    const chapter = chapters[curChapter];
    if (chapter && !chapter.done && lifetimeEarned >= chapter.goal) {
      chapters[curChapter].done = true;
      GameState.set('chapters', [...chapters]);
      GameState.set('curChapter', curChapter + 1);
      notify(`🎉 章节「${chapter.name}」完成！`, 'success');
      snd('achievement');
      document.querySelector('.app')?.classList.add('chapter-transition');
      setTimeout(() => document.querySelector('.app')?.classList.remove('chapter-transition'), 600);
    }
  }
}

// ==================== 等级/经验系统 ====================

export function addExp(amount) {
  const player = GameState.get('player') || {};
  player.exp = (player.exp || 0) + amount;
  GameState.set('player.exp', player.exp);

  // 升级检查
  while (player.exp >= player.expNext) {
    player.exp -= player.expNext;
    player.level++;
    player.expNext = Math.floor(100 * Math.pow(1.2, player.level - 1));

    // 更新称号
    let title = '新手矿工';
    const sortedTitles = Object.entries(TITLES).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    for (const [lvl, t] of sortedTitles) {
      if (player.level >= parseInt(lvl)) { title = t; break; }
    }
    player.title = title;

    GameState.set('player', { ...player });
    snd('upgrade');
    notify(`升级！达到 Lv.${player.level}`, 'success');
  }

  GameState.set('player', { ...player });
}

// ==================== 深渊标签页 ====================

export function renderAbyss() {
  const container = $('tc-abyss');
  if (!container) return;

  // 深渊在祈愿标签后面，但我们没有单独的深渊标签
  // 把深渊功能放在祈愿标签下方或使用一个独立区域
  // 实际上 HTML 中没有深渊标签，我们把它加到祈愿标签页底部
}

// ==================== 渲染所有标签页 ====================

export function renderAllTabs() {
  renderUpgrades();
  renderSkills();
  renderEquipment();
  renderPets();
  renderResearch();
  renderGacha();
  renderExpedition();
  renderWorldBoss();
  renderAchievements();
  renderCollection();
}

// ==================== 设置所有事件监听 ====================

export function setupAllEventListeners(game) {
  // Boss 攻击按钮
  const bossAtkBtn = $('boss-atk-btn');
  if (bossAtkBtn) {
    bossAtkBtn.addEventListener('click', (e) => {
      const clickPower = GameState.get('clickPower') || 1;
      const critChance = GameState.get('critChance') || 5;
      const critDamage = GameState.get('critDamage') || 2;
      let dmg = clickPower;
      let isCrit = Math.random() * 100 < critChance;
      if (isCrit) dmg *= critDamage;

      const result = BossSystem.attackBoss(dmg);
      if (result.defeated) {
        notify('🎉 Boss被击败！奖励已发放！', 'success');
        snd('boss');
        document.querySelector('.app')?.classList.add('shake-screen');
        setTimeout(() => document.querySelector('.app')?.classList.remove('shake-screen'), 500);
        updateDailyProgress('bossAtk', 1);
        // 检查成就
        setTimeout(() => checkAchievements(), 100);
      } else {
        snd('coin');
        updateDailyProgress('bossAtk', 1);
      }

      // 伤害数字
      const rect = bossAtkBtn.getBoundingClientRect();
      showNumberPop(dmg, isCrit, rect.left + rect.width / 2, rect.top);
      updateFullUI();
    });
  }

  // 顶部按钮
  $('btn-sound')?.addEventListener('click', () => {
    const enabled = !isSoundEnabled();
    setSoundEnabled(enabled);
    GameState.set('soundOn', enabled);
    notify(enabled ? '音效已开启' : '音效已关闭', 'info');
  });

  $('btn-theme')?.addEventListener('click', () => {
    const themes = ['gold', 'blue', 'purple', 'green'];
    const current = GameState.get('theme') || 'gold';
    const idx = themes.indexOf(current);
    const next = themes[(idx + 1) % themes.length];
    GameState.set('theme', next);
    notify(`主题切换: ${next}`, 'info');
  });

  $('btn-save')?.addEventListener('click', () => {
    GameState.save();
    notify('游戏已保存！', 'success');
  });

  $('btn-settings')?.addEventListener('click', () => {
    showSettingsModal();
  });

  // 转生卡片区点击
  const prestigeCard = document.querySelector('.prestige-card');
  if (prestigeCard) {
    prestigeCard.style.cursor = 'pointer';
    prestigeCard.addEventListener('click', () => {
      showPrestigeModal();
    });
  }

  // 标签切换时渲染对应内容
  document.querySelectorAll('.nav-t').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.t;
      // 延迟渲染确保 tab 已显示
      requestAnimationFrame(() => {
        switch (tab) {
          case 'up': renderUpgrades(); break;
          case 'sk': renderSkills(); break;
          case 'eq': renderEquipment(); break;
          case 'pt': renderPets(); break;
          case 'rs': renderResearch(); break;
          case 'gt': renderGacha(); break;
          case 'exp': renderExpedition(); break;
          case 'wboss': renderWorldBoss(); break;
          case 'ach': renderAchievements(); break;
          case 'col': renderCollection(); break;
        }
      });
    });
  });
}

// ==================== 自动购买循环 ====================

export function processAutoBuy() {
  if (!GameState.get('autoBuy.enabled')) return;

  const now = Date.now();
  const lastRun = GameState.get('autoBuy.lastRun') || 0;
  const interval = GameState.get('autoBuy.interval') || 5000;

  if (now - lastRun < interval) return;

  const priority = GameState.get('autoBuy.priority') || [];
  for (const key of priority) {
    if (UpgradeSystem.canBuyUpgrade(key)) {
      UpgradeSystem.buyUpgrade(key);
      GameState.set('autoBuy.lastRun', now);
      return; // 每次只买一个
    }
  }
}

// ==================== 远征计时器更新 ====================

export function processExpeditionTimers() {
  const container = $('tc-exp');
  if (!container || !container.classList.contains('on')) return;
  // 只在远征标签可见时更新
  renderExpedition();
}

// ==================== 深渊冷却更新 ====================

export function processAbyssCooldown() {
  AbyssSystem.updateAbyssCooldown();
}
