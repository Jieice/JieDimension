/**
 * 回归测试：已确认运行时 bug
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GameStateManager, GameState } from '../js/core/state.js';
import { GAME_CONFIG } from '../js/constants.js';
import { createInitialState, game } from '../js/main.js';
import { startAbyss, attackAbyssEnemy, getAbyssData } from '../js/systems/abyss.js';
import { equipItem } from '../js/systems/equipment.js';
import { buyUpgrade } from '../js/systems/upgrades.js';
import { activatePet } from '../js/systems/pets.js';
import { calculateOfflineEarnings } from '../js/utils/storage.js';
import { doTenGacha } from '../js/systems/gacha.js';
import { attackBoss, calculateBossReward } from '../js/systems/boss.js';
import { addEventListeners, setContent, toggleClass, toggleDisplay } from '../js/utils/dom.js';

function createBaseState() {
  return {
    coins: 10000,
    gems: 0,
    inventory: [],
    materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 },
    stats: { gachaTotal: 0, playTime: 0 },
    player: { level: 1, exp: 0, expNext: 100 },
    prestige: { count: 0 },
    rebirth: { count: 0, essence: 0 },
    equipment: {
      weapon: { id: null, name: '无', icon: '⚔️', bonus: 0, level: 0 },
      armor: { id: null, name: '无', icon: '🛡️', bonus: 0, level: 0 },
      ring: { id: null, name: '无', icon: '💍', bonus: 0, level: 0 }
    },
    lastSave: Date.now()
  };
}

describe('Regression tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    GameState.init(createBaseState());
  });

  it('loadFromSave should preserve missing nested default fields when save is partial', () => {
    const state = new GameStateManager();
    const initialState = {
      player: { level: 1, exp: 0, expNext: 100, title: '新手矿工' },
      stats: { clicks: 0, crits: 0, playTime: 0 }
    };

    state.init(initialState);
    localStorage.setItem(GAME_CONFIG.SAVE_KEY, JSON.stringify({
      player: { level: 7 },
      stats: { playTime: 123 }
    }));

    state.loadFromSave();

    expect(state.get('player')).toEqual({
      level: 7,
      exp: 0,
      expNext: 100,
      title: '新手矿工'
    });
    expect(state.get('stats')).toEqual({
      clicks: 0,
      crits: 0,
      playTime: 123
    });
  });

  it('createInitialState should include inventory gacha and abyss defaults used by systems', () => {
    const initial = createInitialState();

    expect(initial.inventory).toEqual([]);
    expect(initial.gachaTix).toBe(0);
    expect(initial.gachaPity).toEqual({ sr: 0, ssr: 0 });
    expect(initial.abyss).toEqual({
      currentFloor: 0,
      highestFloor: 0,
      enemy: null,
      rewards: {
        essence: 0,
        materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 },
        gachaTix: 0
      },
      cooldown: 0
    });
  });

  it('main should expose the game instance on window for the click handler bridge', () => {
    expect(window.game).toBe(game);
  });

  it('doTenGacha should not grant an extra item when replacing first pull for guarantee', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.95);

    const results = doTenGacha();

    expect(results).toHaveLength(10);
    const inventory = GameState.get('inventory');
    expect(inventory).toHaveLength(10);
    expect(GameState.get('stats.gachaTotal')).toBe(10);

    randomSpy.mockRestore();
  });

  it('doTenGacha guarantee replacement should not delete unrelated inventory items', () => {
    const existingItem = {
      id: 'kept-item',
      name: '已拥有物品',
      icon: '📦',
      type: 'weapon',
      bonus: 1,
      level: 0,
      timestamp: 1
    };

    GameState.set('inventory', [existingItem]);

    const randomValues = [];
    for (let i = 0; i < 10; i++) {
      randomValues.push(0.95, 0);
    }
    randomValues.push(0);

    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => randomValues.shift() ?? 0);

    const results = doTenGacha();
    const inventory = GameState.get('inventory');

    expect(results).toHaveLength(10);
    expect(inventory).toHaveLength(2);
    expect(inventory[0]).toEqual(existingItem);
    expect(inventory[1].rarity).toBe('r');

    randomSpy.mockRestore();
  });

  it('calculateOfflineEarnings should use offline config without throwing', () => {
    const state = {
      lastSave: Date.now() - 120000,
      coinsPerSecond: 10,
      hasOfflineSkill: false
    };

    expect(() => calculateOfflineEarnings(state)).not.toThrow();

    const result = calculateOfflineEarnings(state);
    expect(result.earnings).toBeGreaterThan(0);
    expect(result.offlineTime).toBeGreaterThanOrEqual(60);
  });

  it('calculateOfflineEarnings should apply offline multiplier from unlocked skill data without hasOfflineSkill flag', () => {
    const state = {
      lastSave: Date.now() - 120000,
      coinsPerSecond: 10,
      skills: [
        { id: 'idl', type: 'offline', owned: true }
      ],
      research: []
    };

    const result = calculateOfflineEarnings(state);
    expect(result.multiplier).toBe(0.75);
  });

  it('equipItem should remove the equipped item from inventory', () => {
    const sword = {
      id: 'r_sword',
      name: '精钢剑',
      icon: '🗡️',
      type: 'weapon',
      bonus: 5,
      level: 0
    };

    GameState.set('inventory', [sword]);

    expect(equipItem('weapon', sword)).toBe(true);
    expect(GameState.get('equipment.weapon')).toEqual(sword);
    expect(GameState.get('inventory')).toEqual([]);
  });

  it('attackAbyssEnemy should not grant the same floor rewards twice', () => {
    GameState.set('rebirth.count', 3);
    GameState.set('abyss', {
      currentFloor: 0,
      highestFloor: 0,
      enemy: null,
      rewards: { essence: 0, materials: { iron: 0, crystal: 0, dragonScale: 0, ancientGem: 0 }, gachaTix: 0 },
      cooldown: 0
    });

    expect(startAbyss()).toBe(true);

    const enemyHp = getAbyssData().enemy.hp;
    const firstAttack = attackAbyssEnemy(enemyHp);
    const rewardsAfterFirstKill = structuredClone(getAbyssData().rewards);
    const secondAttack = attackAbyssEnemy(1);

    expect(firstAttack.defeated).toBe(true);
    expect(secondAttack.defeated).toBe(false);
    expect(getAbyssData().rewards).toEqual(rewardsAfterFirstKill);
  });

  it('doTenGacha should apply exp consumables to player.exp instead of root exp', () => {
    GameState.set('coins', 10000);

    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

    doTenGacha();

    expect(GameState.get('player.exp')).toBe(1000);
    expect(GameState.get('exp')).toBeUndefined();

    randomSpy.mockRestore();
  });

  it('attackBoss should grant gems and material rewards on defeat', () => {
    GameState.set('boss', {
      name: '测试Boss',
      avatar: '👹',
      hp: 10,
      maxHp: 10,
      reward: 0,
      gemReward: 0,
      matReward: 0,
      level: 5,
      defeated: 0
    });

    const reward = calculateBossReward(5);
    const result = attackBoss(10);

    expect(result.defeated).toBe(true);
    expect(GameState.get('gems')).toBe(reward.gems);
    expect(GameState.get('materials.iron')).toBe(reward.materials);
  });

  it('dom helpers should safely ignore missing targets', () => {
    expect(() => setContent(null, 'x')).not.toThrow();
    expect(() => toggleDisplay(null, true)).not.toThrow();
    expect(() => toggleClass(null, 'on', true)).not.toThrow();
    expect(() => addEventListeners(null, 'click', () => {})).not.toThrow();
  });

  it('buyUpgrade should recalculate derived click and crit stats', () => {
    const initial = createInitialState();
    initial.coins = 1000;
    GameState.init(initial);

    expect(GameState.get('clickPower')).toBe(1);
    expect(GameState.get('critChance')).toBe(5);
    expect(GameState.get('critDamage')).toBe(2);

    expect(buyUpgrade('click')).toBe(true);
    expect(buyUpgrade('crit')).toBe(true);
    expect(buyUpgrade('critdmg')).toBe(true);

    expect(GameState.get('clickPower')).toBe(2);
    expect(GameState.get('critChance')).toBe(7);
    expect(GameState.get('critDamage')).toBe(2.5);
  });

  it('buyUpgrade should recalculate derived coinsPerSecond', () => {
    const initial = createInitialState();
    initial.coins = 1000;
    GameState.init(initial);

    expect(GameState.get('coinsPerSecond')).toBe(0);

    expect(buyUpgrade('worker')).toBe(true);
    expect(buyUpgrade('factory')).toBe(true);

    expect(GameState.get('coinsPerSecond')).toBe(11);
  });

  it('activatePet should recalculate derived stats for active pet bonuses', () => {
    const initial = createInitialState();
    initial.pets = initial.pets.map(pet => {
      if (pet.id === 'dog' || pet.id === 'phoenix') {
        return { ...pet, owned: true, level: 2 };
      }

      return pet;
    });
    GameState.init(initial);

    expect(activatePet('dog')).toBe(true);
    expect(GameState.get('clickPower')).toBeCloseTo(1.3);
    expect(GameState.get('critChance')).toBe(5);

    expect(activatePet('phoenix')).toBe(true);
    expect(GameState.get('clickPower')).toBe(1);
    expect(GameState.get('critChance')).toBe(25);
  });

  it('equipItem should recalculate derived stats from equipment bonuses and enchants', () => {
    const initial = createInitialState();
    const sword = {
      id: 'test-sword',
      name: '测试剑',
      icon: '🗡️',
      type: 'weapon',
      bonus: 10,
      level: 0,
      enchants: [{ type: 'critChance', value: 3 }]
    };
    const ring = {
      id: 'test-ring',
      name: '测试戒指',
      icon: '💍',
      type: 'ring',
      bonus: 0,
      level: 0,
      enchants: [{ type: 'critDamage', value: 1.5 }]
    };

    initial.inventory = [sword, ring];
    GameState.init(initial);

    expect(equipItem('weapon', sword)).toBe(true);
    expect(equipItem('ring', ring)).toBe(true);

    expect(GameState.get('clickPower')).toBe(4);
    expect(GameState.get('coinsPerSecond')).toBe(5);
    expect(GameState.get('critChance')).toBe(8);
    expect(GameState.get('critDamage')).toBe(3.5);
  });
});
