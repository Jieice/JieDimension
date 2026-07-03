# 金币大亨 · 架构文档

## 项目概述

金币大亨是一个模块化放置游戏，采用ES6模块架构，支持代码分割和按需加载。

## 目录结构

```
coin-tycoon/
├── index.html              # 入口HTML
├── package.json            # 项目配置
├── vitest.config.js        # 测试配置
├── css/
│   ├── base.css           # 基础样式（变量、重置、布局）
│   ├── components.css     # 组件样式
│   └── animations.css     # 动画样式
├── js/
│   ├── constants.js       # 常量配置
│   ├── main.js           # 主入口
│   ├── core/
│   │   ├── state.js      # 状态管理
│   │   └── error.js      # 错误处理
│   ├── systems/
│   │   ├── upgrades.js   # 升级系统
│   │   ├── boss.js       # Boss系统
│   │   ├── pets.js       # 宠物系统
│   │   ├── equipment.js  # 装备系统
│   │   ├── gacha.js      # 祈愿系统
│   │   └── abyss.js      # 深渊系统
│   └── utils/
│       ├── format.js     # 格式化工具
│       ├── dom.js        # DOM操作
│       ├── sound.js      # 音频管理
│       └── storage.js    # 存储管理
└── tests/
    ├── format.test.js    # 格式化测试
    └── error.test.js     # 错误处理测试
```

## 核心模块

### 1. 状态管理 (core/state.js)

集中式状态管理系统，支持订阅/通知机制。

```javascript
import { GameState } from './core/state.js';

// 获取状态
const coins = GameState.get('coins');

// 设置状态
GameState.set('coins', 1000);

// 订阅状态变更
GameState.subscribe('coins', (newVal, oldVal) => {
  console.log(`Coins changed: ${oldVal} -> ${newVal}`);
});
```

### 2. 错误处理 (core/error.js)

统一的错误处理机制。

```javascript
import { safeExecute, throwError, ErrorCodes } from './core/error.js';

// 安全执行
const result = safeExecute(() => {
  // 可能出错的代码
  if (coins < cost) {
    throwError(ErrorCodes.INSUFFICIENT_COINS);
  }
  return buyItem();
}, fallbackValue);
```

### 3. 常量配置 (constants.js)

所有游戏配置集中管理。

```javascript
import { GAME_CONFIG, UPGRADE_CONFIG, BOSS_CONFIG } from './constants.js';

// 使用配置
const saveKey = GAME_CONFIG.SAVE_KEY;
const upgradeCost = UPGRADE_CONFIG.click.base;
```

## 系统模块

### 升级系统 (systems/upgrades.js)

```javascript
import * as UpgradeSystem from './systems/upgrades.js';

// 购买升级
UpgradeSystem.buyUpgrade('click');

// 批量购买
UpgradeSystem.buyUpgradeMultiple('click', 10);

// 获取推荐
const recommendations = UpgradeSystem.getRecommendedUpgrades();
```

### Boss系统 (systems/boss.js)

```javascript
import * as BossSystem from './systems/boss.js';

// 攻击Boss
const result = BossSystem.attackBoss(damage);

// 生成新Boss
BossSystem.spawnNewBoss();
```

### 宠物系统 (systems/pets.js)

```javascript
import * as PetSystem from './systems/pets.js';

// 购买宠物
PetSystem.buyPet('cat');

// 激活宠物
PetSystem.activatePet('cat');

// 计算宠物加成
const bonus = PetSystem.calculatePetBonus('cps');
```

### 装备系统 (systems/equipment.js)

```javascript
import * as EquipmentSystem from './systems/equipment.js';

// 装备物品
EquipmentSystem.equipItem('weapon', item);

// 强化装备
EquipmentSystem.enhanceEquipment('weapon');

// 附魔装备
EquipmentSystem.enchantEquipment('weapon', 'critChance');
```

### Gacha系统 (systems/gacha.js)

```javascript
import * as GachaSystem from './systems/gacha.js';

// 单抽
const result = GachaSystem.doSingleGacha();

// 十连
const results = GachaSystem.doTenGacha();

// 获取保底进度
const pity = GachaSystem.getPityProgress();
```

### 深渊系统 (systems/abyss.js)

```javascript
import * as AbyssSystem from './systems/abyss.js';

// 开始深渊
AbyssSystem.startAbyss();

// 攻击敌人
AbyssSystem.attackAbyssEnemy(damage);

// 前进下一层
AbyssSystem.advanceFloor();

// 结束挑战
const rewards = AbyssSystem.endAbyss();
```

## 工具模块

### 格式化工具 (utils/format.js)

```javascript
import { fmt, formatTime, formatPercent } from './utils/format.js';

fmt(1000000);        // "1.00M"
formatTime(3661);    // "1小时1分钟"
formatPercent(0.5);  // "50.0%"
```

### DOM工具 (utils/dom.js)

```javascript
import { $, safeHtml, escapeHtml, delegate } from './utils/dom.js';

// 选择器
const el = $('element-id');

// 安全HTML
const html = safeHtml`<div>${userInput}</div>`;

// 事件委托
delegate(container, '.btn', 'click', (e, target) => {
  // 处理点击
});
```

### 存储工具 (utils/storage.js)

```javascript
import { save, load, exportSave, importSave } from './utils/storage.js';

// 保存
save(gameState);

// 加载
const state = load();

// 导出
const encoded = exportSave();

// 导入
importSave(encoded);
```

## CSS架构

### 变量系统 (base.css)

```css
:root {
  --p: #ffd700;      /* 主色 */
  --s: #00d4ff;      /* 辅助色 */
  --a: #ff6b6b;      /* 警告色 */
  --bg: #06060f;     /* 背景色 */
  --card: rgba(255,255,255,0.03);  /* 卡片背景 */
  --radius: 12px;    /* 圆角 */
  --transition: all .2s cubic-bezier(.4,0,.2,1);
}
```

### 主题切换

```javascript
document.querySelector('.app').dataset.theme = 'cyber';
// 可用主题: gold, cyber, sunset, ocean
```

## 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

## 扩展指南

### 添加新系统

1. 在 `js/systems/` 创建新模块
2. 导出系统函数
3. 在 `main.js` 中导入
4. 添加到 `constants.js` 配置

### 添加新UI组件

1. 在 `css/components.css` 添加样式
2. 使用CSS变量保持一致性
3. 在 `index.html` 添加HTML结构

### 添加新动画

1. 在 `css/animations.css` 定义 `@keyframes`
2. 创建对应的CSS类
3. 通过JS添加/移除类触发动画
