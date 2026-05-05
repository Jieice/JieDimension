/**
 * 末世重生：囤货女王 - 互动叙事游戏引擎
 * MVP版本 v1.0
 */

// ==================== 游戏状态管理 ====================
const GameState = {
    // 核心状态
    currentScene: 'prologue',
    daysLeft: 30,
    money: 500000,
    episode: 0,
    
    // 金手指系统
    goldenFinger: {
        level: 1,
        energy: 100,
        storageCapacity: 100, // 立方米
        storageUsed: 0,
        abilities: ['储物空间', '前世记忆']
    },
    
    // 角色关系
    relationships: {
        '苏可欣': -100,  // 前世仇人
        '陈墨': -100,    // 前世仇人
        '林父': 50,      // 父亲
        '林母': 50,      // 母亲
        // story.js 使用的关系
        suKexin: -100,
        chenMo: -100,
        mysteriousMan: 0,
        parents: 50,
        neighbor: 0,
    },
    
    // 物资库存
    inventory: {
        food: { amount: 0, unit: '份', max: 500, icon: '🍚', name: '食物' },
        water: { amount: 0, unit: '瓶', max: 300, icon: '💧', name: '饮用水' },
        medicine: { amount: 0, unit: '盒', max: 100, icon: '💊', name: '药品' },
        weapons: { amount: 0, unit: '件', max: 50, icon: '🔪', name: '武器' },
        fuel: { amount: 0, unit: '桶', max: 50, icon: '⛽', name: '燃料' },
        tools: { amount: 0, unit: '件', max: 80, icon: '🔧', name: '工具' },
        clothes: { amount: 0, unit: '套', max: 100, icon: '🧥', name: '衣物' },
        materials: { amount: 0, unit: '批', max: 200, icon: '🪵', name: '建材' }
    },
    
    // 角色属性
    stats: {
        intelligence: 0,
        charisma: 0,
        strength: 0,
        combat: 0,
        stealth: 0,
        morale: 0,
        ability: 0,
        stamina: 0,
        courage: 0,
        defense: 0,
        hp: 100,
        leadership: 0,
    },
    
    // 剧情标志
    flags: {
        hasReborn: false,
        hasCheckedStorage: false,
        hasMetParents: false,
        knowsEnemyLocation: false,
        firstShoppingDone: false,
        // story.js 使用的标志
        reborn: false,
        storageUnlocked: false,
        bossHintFound: false,
        hiddenRoute: false,
        extremeStockpile: false,
        secretBase: false,
        apartmentSecured: false,
        revengePhase1: false,
        parentsPrepared: false,
        apocalypseStarted: false,
        revengePhase2: false,
        warehouseUpgraded: false,
        parentsSaved: false,
        revengeComplete: false,
        mercyShown: false,
        playstyle: null,
        scanned: false,
        killed_s_rank: false,
        lured_beasts: false,
        ability_burst: false,
        entered_base: false,
        prepared: false,
        sent_signal: false,
        allies_informed: false,
        broke_wall: false,
        space_attempt: false,
        boss_info: false,
        stall_for_time: false,
        time_power: false,
        escaped_trap: false,
        counter_trap: false,
        knows_full_plan: false,
        full_army: false,
        army_size: 0,
        elite_team: false,
        divided_forces: false,
        fought_giant: false,
        casualties: null,
        went_for_boss: false,
        commanded_battle: false,
        used_time_in_fight: false,
        used_space_in_fight: false,
        all_out_attack: false,
        entered_core: false,
        heroic_choice: false,
        destroyed_core: false,
        destruction_path: false,
        sealed_core: false,
        seal_path: false,
        healed: false,
        looted_base: false,
        early_return: false,
        took_leadership: false,
        went_scouting: false,
        researched_technology: false,
        government_type: null,
        left_community: false,
        went_north: false,
        stayed_to_defend: false,
        tried_negotiation: false,
        ending: null,
        sacrifice_choice: false,
        revenge_choice: false,
    },
    
    // 历史记录
    history: [],
    
    // 当前章节
    chapter: '第一幕：重生囤货'
};

// ==================== 场景数据 ====================
// 场景数据已移至 story.js

// ==================== 游戏引擎核心 ====================

// ==================== 背景特效系统 ====================

// 场景背景色映射
const SceneBGMap = {
    // 末世前 - 暖色调
    'prologue':          '#0a0a12',
    'rebirth_morning':   '#0c0b10',
    'golden_finger':     '#0b0a10',
    'storage_test':      '#0a0b10',
    'memory_parents':    '#0c0a0e',
    'plan_start':        '#0b0b10',
    'first_shopping':    '#0a0c10',
    'supermarket':       '#0b0c10',
    'bulk_purchase':     '#0a0b10',
    'meet_parents':      '#0c0b0e',
    'convince_father':   '#0b0a0e',
    'mother_secret':     '#0c0a0e',
    'enemy_appears':     '#100a0a',
    'su_kexin_encounter':'#100a0a',
    'chen_mo_warning':   '#100a0a',
    'warehouse_base':    '#0a0b10',
    'stockpile_food':    '#0a0c0e',
    'stockpile_water':   '#0a0b10',
    'stockpile_medicine':'#0a0c0e',
    'stockpile_weapons': '#0c0a0a',
    'vehicle_prep':      '#0a0b10',
    'extreme_weather':   '#0a0c10',
    'news_broadcast':    '#0c0a0a',
    'final_preparation': '#0a0a10',
    'reconnect_friend':  '#0a0c0e',
    'ally_joins':        '#0a0c10',
    'enemy_schemes':     '#100a0a',
    'counter_plan':      '#0c0a0a',
    'showdown_sukexin':  '#100808',
    'chen_mo_betrayal':  '#100808',
    'revenge_cold':      '#100808',
    // 末世降临 - 冷蓝色
    'apocalypse_begins': '#060810',
    'first_night':       '#050810',
    'rescue_mission':    '#060810',
    'survival_camp':     '#060a10',
    'new_order_threat':  '#080610',
    'boss_emerges':      '#0a0608',
    // 结局
    'ending_lone_wolf':  '#080810',
    'ending_leader':     '#0a0a08',
    'ending_sacrifice':  '#08080c',
    'ending_revenge':    '#0a0606',
};

// 获取场景背景色
function getSceneBG(sceneId) {
    return SceneBGMap[sceneId] || '#080810';
}

// 设置场景背景色（平滑过渡）
function setSceneBackground(sceneId) {
    const bg = getSceneBG(sceneId);
    document.documentElement.style.setProperty('--scene-bg', bg);
    document.body.style.background = bg;
}

// ==================== 下雨动效系统 ====================
const RainSystem = {
    canvas: null,
    ctx: null,
    drops: [],
    splashes: [],
    running: false,
    intensity: 0.6, // 0-1
    wind: -1.5,

    init() {
        this.canvas = document.getElementById('rainCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.running = true;
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createDrop() {
        return {
            x: Math.random() * this.canvas.width * 1.2 - this.canvas.width * 0.1,
            y: -10 - Math.random() * 100,
            length: 8 + Math.random() * 16,
            speed: 6 + Math.random() * 8,
            opacity: 0.08 + Math.random() * 0.15,
            width: 0.5 + Math.random() * 0.8,
        };
    },

    createSplash(x, y) {
        return {
            x, y,
            radius: 0,
            maxRadius: 2 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.15,
            speed: 0.3 + Math.random() * 0.3,
        };
    },

    update() {
        // 根据场景调整雨量
        const scene = GameState.currentScene || '';
        if (scene.includes('apocalypse') || scene.includes('night') || scene.includes('survival') || scene.includes('rescue')) {
            this.intensity = Math.min(1, this.intensity + 0.005);
        } else if (scene.includes('shopping') || scene.includes('supermarket') || scene.includes('warehouse')) {
            this.intensity = Math.max(0.2, this.intensity - 0.005);
        }

        // 添加新雨滴
        const targetDrops = Math.floor(80 * this.intensity);
        while (this.drops.length < targetDrops) {
            this.drops.push(this.createDrop());
        }

        // 更新雨滴
        for (let i = this.drops.length - 1; i >= 0; i--) {
            const d = this.drops[i];
            d.y += d.speed;
            d.x += this.wind;

            if (d.y > this.canvas.height) {
                // 溅射效果
                if (Math.random() < 0.3) {
                    this.splashes.push(this.createSplash(d.x, this.canvas.height - 2));
                }
                this.drops[i] = this.createDrop();
            }
        }

        // 更新溅射
        for (let i = this.splashes.length - 1; i >= 0; i--) {
            const s = this.splashes[i];
            s.radius += s.speed;
            s.opacity -= 0.015;
            if (s.opacity <= 0 || s.radius >= s.maxRadius) {
                this.splashes.splice(i, 1);
            }
        }
    },

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 画雨滴
        for (const d of this.drops) {
            this.ctx.beginPath();
            this.ctx.moveTo(d.x, d.y);
            this.ctx.lineTo(d.x + this.wind * 1.5, d.y + d.length);
            this.ctx.strokeStyle = `rgba(180, 200, 230, ${d.opacity})`;
            this.ctx.lineWidth = d.width;
            this.ctx.stroke();
        }

        // 画溅射
        for (const s of this.splashes) {
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI, true);
            this.ctx.strokeStyle = `rgba(180, 200, 230, ${s.opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        }
    },

    animate() {
        if (!this.running) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
};

// ==================== 折叠面板 ====================
let tabPanelOpen = false;

function toggleTabPanel() {
    tabPanelOpen = !tabPanelOpen;
    const body = document.getElementById('tabBody');
    const arrow = document.getElementById('tabArrow');
    if (body) body.classList.toggle('open', tabPanelOpen);
    if (arrow) arrow.classList.toggle('open', tabPanelOpen);
}

// ==================== 初始化 ====================

function initGame() {
    RainSystem.init();
    updateStatusBar();
}

// 创建灰烬粒子效果（已替换为Canvas雨效）
function createAshParticles() {
    // 已废弃 - 由 RainSystem 替代
}

// 开始游戏（新游戏）
function startGame() {
    // 重置游戏状态
    resetGameState();
    
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.getElementById('gameContainer');
    
    startScreen.classList.add('hidden');
    setTimeout(() => {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        loadScene('prologue');
    }, 500);
}

// 继续游戏（读取自动存档）
function continueGame() {
    if (!hasAutoSave()) {
        showToast('❌ 没有找到存档');
        return;
    }
    
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.getElementById('gameContainer');
    
    // 读取自动存档
    const data = localStorage.getItem(AUTO_SAVE_KEY);
    const saveData = JSON.parse(data);
    Object.assign(GameState, saveData.gameState);
    
    startScreen.classList.add('hidden');
    setTimeout(() => {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        loadScene(GameState.currentScene);
        updateStatusBar();
        showToast('📂 已继续游戏');
    }, 500);
}

// 重置游戏状态
function resetGameState() {
    GameState.currentScene = 'prologue';
    GameState.daysLeft = 30;
    GameState.money = 500000;
    GameState.episode = 0;
    GameState.goldenFinger = {
        level: 1, energy: 100, storageCapacity: 100,
        storageUsed: 0, abilities: ['储物空间', '前世记忆']
    };
    GameState.stats = {
        intelligence: 0, charisma: 0, strength: 0, combat: 0,
        stealth: 0, morale: 0, ability: 0, stamina: 0,
        courage: 0, defense: 0, hp: 100, leadership: 0,
    };
    GameState.relationships = {
        '苏可欣': -100, '陈墨': -100, '林父': 50, '林母': 50,
        suKexin: -100, chenMo: -100, mysteriousMan: 0, parents: 50, neighbor: 0
    };
    GameState.inventory = {
        food: { amount: 0, unit: '份', max: 500, icon: '🍚', name: '食物' },
        water: { amount: 0, unit: '瓶', max: 300, icon: '💧', name: '饮用水' },
        medicine: { amount: 0, unit: '盒', max: 100, icon: '💊', name: '药品' },
        weapons: { amount: 0, unit: '件', max: 50, icon: '🔪', name: '武器' },
        fuel: { amount: 0, unit: '桶', max: 50, icon: '⛽', name: '燃料' },
        tools: { amount: 0, unit: '件', max: 80, icon: '🔧', name: '工具' },
        clothes: { amount: 0, unit: '套', max: 100, icon: '🧥', name: '衣物' },
        materials: { amount: 0, unit: '批', max: 200, icon: '🪵', name: '建材' }
    };
    GameState.flags = {
        hasReborn: false, hasCheckedStorage: false, hasMetParents: false,
        knowsEnemyLocation: false, firstShoppingDone: false,
        reborn: false, storageUnlocked: false, bossHintFound: false,
        hiddenRoute: false, extremeStockpile: false, secretBase: false,
        apartmentSecured: false, revengePhase1: false, parentsPrepared: false,
        apocalypseStarted: false, revengePhase2: false, warehouseUpgraded: false,
        parentsSaved: false, revengeComplete: false, mercyShown: false,
        playstyle: null, scanned: false, killed_s_rank: false, lured_beasts: false,
        ability_burst: false, entered_base: false, prepared: false,
        sent_signal: false, allies_informed: false, broke_wall: false,
        space_attempt: false, boss_info: false, stall_for_time: false,
        time_power: false, escaped_trap: false, counter_trap: false,
        knows_full_plan: false, full_army: false, army_size: 0,
        elite_team: false, divided_forces: false, fought_giant: false,
        casualties: null, went_for_boss: false, commanded_battle: false,
        used_time_in_fight: false, used_space_in_fight: false, all_out_attack: false,
        entered_core: false, heroic_choice: false, destroyed_core: false,
        destruction_path: false, sealed_core: false, seal_path: false,
        healed: false, looted_base: false, early_return: false,
        took_leadership: false, went_scouting: false, researched_technology: false,
        government_type: null, left_community: false, went_north: false,
        stayed_to_defend: false, tried_negotiation: false, ending: null,
        sacrifice_choice: false, revenge_choice: false,
    };
    GameState.history = [];
    GameState.chapter = '第一幕：重生囤货';
    EndingScores.lone_wolf = 0;
    EndingScores.leader = 0;
    EndingScores.sacrifice = 0;
    EndingScores.revenge = 0;
}

// 加载场景（分步展示，不滚动页面）
function loadScene(sceneId) {
    const scene = AllScenes[sceneId] || AllScenes.default;
    GameState.currentScene = sceneId;
    
    // 切换场景背景色
    setSceneBackground(sceneId);
    
    // 更新场景信息
    document.getElementById('sceneNumber').textContent = scene.number;
    document.getElementById('sceneTitle').textContent = scene.title;
    document.getElementById('sceneAtmosphere').textContent = scene.atmosphere;
    
    // 更新状态栏
    updateStatusBar();
    
    // 分步展示内容
    const contentEl = document.getElementById('sceneContent');
    contentEl.innerHTML = '';
    contentEl.scrollTop = 0;
    
    // 解析HTML内容为段落块
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = scene.content;
    
    // 如果是默认场景，追加状态摘要
    if (sceneId === 'default') {
        const summaryDiv = document.createElement('div');
        summaryDiv.innerHTML = generateStatusSummary();
        tempDiv.appendChild(summaryDiv);
    }
    
    // 收集所有顶级子元素
    const blocks = Array.from(tempDiv.children);
    
    // 逐块淡入展示
    let delay = 0;
    blocks.forEach((block, i) => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(10px)';
        block.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        contentEl.appendChild(block);
        
        setTimeout(() => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
        }, delay);
        
        delay += 120; // 每块间隔120ms
    });
    
    // 延迟显示选择按钮（内容展示完后）
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';
    choicesContainer.style.opacity = '0';
    choicesContainer.style.transition = 'opacity 0.4s ease';
    
    setTimeout(() => {
        // 安全检查：确保 choices 存在且是数组
        if (!scene.choices || !Array.isArray(scene.choices)) {
            console.error('场景缺少 choices:', sceneId, scene);
            choicesContainer.innerHTML = '<div style="color:#e74c3c;padding:10px;">错误：该场景没有定义选项</div>';
            choicesContainer.style.opacity = '1';
            return;
        }
        
        scene.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-label">${choice.label}</span>${choice.text}`;
            btn.onclick = () => makeChoice(choice);
            choicesContainer.appendChild(btn);
        });
        choicesContainer.style.opacity = '1';
        
        // 场景加载完成后，自动保存并显示AI主动提示
        setTimeout(() => {
            saveGame('auto');
            showProactiveHint();
        }, 600);
    }, delay + 200);
}

// 做出选择
function makeChoice(choice) {
    try {
        // 执行选择效果
        if (choice.effect) {
            choice.effect();
        }
    } catch (e) {
        console.error('选择效果执行出错:', e);
        // 继续执行，不阻断流程
    }
    
    // 记录历史
    GameState.history.push({
        scene: GameState.currentScene,
        choice: choice.text,
        timestamp: new Date().toISOString()
    });
    
    // 更新结局分数
    updateEndingScores(choice.text);
    
    // 加载下一个场景
    loadScene(choice.nextScene);
}

// 更新状态栏
function updateStatusBar() {
    document.getElementById('daysLeft').textContent = GameState.daysLeft + '天';
    document.getElementById('money').textContent = formatMoney(GameState.money);
    document.getElementById('chapterIndicator').textContent = GameState.chapter;
    
    // 更新底部面板
    updateInventoryPanel();
    updateRelationshipPanel();
}

function formatMoney(amount) {
    if (amount >= 10000) return (amount / 10000).toFixed(1) + '万';
    return amount.toLocaleString();
}

// 生成状态摘要
function generateStatusSummary() {
    const inv = GameState.inventory;
    return `
        <div class="stats-panel" style="margin-top: 20px;">
            <div class="stat-item">
                <div class="stat-icon">🍚</div>
                <div class="stat-name">食物</div>
                <div class="stat-value">${inv.food ? inv.food.amount : 0}单位</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">💧</div>
                <div class="stat-name">水源</div>
                <div class="stat-value">${inv.water ? inv.water.amount : 0}单位</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">💊</div>
                <div class="stat-name">药品</div>
                <div class="stat-value">${inv.medicine ? inv.medicine.amount : 0}单位</div>
            </div>
        </div>
        <p style="margin-top: 20px;">剩余资金：${formatMoney(GameState.money)}</p>
    `;
}

// ==================== AI作死结局系统 ====================

// 本地作死检测（API失败时的兜底）
function localDeathCheck(action) {
    const a = action.toLowerCase();
    
    // 明显作死行为
    const deathActions = [
        { keywords: ['告诉苏可欣', '告诉陈墨', '暴露重生', '说出真相'], 
          result: '💀 [作死结局] 你把重生的秘密告诉了苏可欣。她先是一脸震惊，然后露出了你熟悉的笑容——和前世一模一样的笑容。三天后，你再次在寒冷中醒来，物资被洗劫一空。有些错误，犯了两次的人，不配重生。' },
        { keywords: ['一个人出去', '单独行动', '不带武器'],
          result: '⚠️ [警告] 末世中单独行动极其危险。变异生物随时可能出现，没有武器更是自杀行为。建议先准备好装备再外出。' },
        { keywords: ['自杀', '不想活了', '放弃'],
          result: '💀 [作死结局] 你选择了放弃。在末世第七天，你安静地闭上了眼睛。这一次，没有重生。系统提示：生存意志归零，金手指已回收。' },
        { keywords: ['相信周天成', '加入新秩序', '信任boss'],
          result: '💀 [作死结局] 你选择了相信周天成。他的笑容温和而真诚——和你前世看到的最后一模一样。当你意识到不对时，控制芯片已经植入了你的后颈。欢迎加入"新秩序"，或者说...欢迎成为傀儡。' },
    ];
    
    for (const da of deathActions) {
        if (da.keywords.some(k => a.includes(k))) {
            if (da.result.startsWith('💀')) {
                return `<div class="death-ending">${da.result}</div>
                    <button class="death-restart-btn" onclick="location.reload()">🔄 重新开始</button>`;
            }
            return da.result;
        }
    }
    
    // 默认：合理行动
    return `💡 [建议] 这个想法不错！但为了获得最佳体验，建议通过下方的选择按钮来推进剧情。你的自由行动可能会触发意想不到的后果哦...`;
}

// 处理自由行动（AI作死结局判断）
async function handleFreeAction(action) {
    const response = document.getElementById('aiResponse');
    const btn = document.getElementById('aiSendBtn');
    
    btn.disabled = true;
    btn.textContent = '命运裁决中...';
    response.classList.remove('show');
    
    const model = AI_MODELS[currentModelIndex];
    const currentScene = AllScenes[GameState.currentScene];
    
    const prompt = `你是《末世重生：囤货女王》游戏的"命运裁判"。

【当前场景】${currentScene?.title}（${currentScene?.number}）
【当前状态】资金${(GameState.money/10000).toFixed(1)}万 · 末世倒计时${GameState.daysLeft}天 · 物资充足度${getStorageUsage()}%
【主角人设】林念晚，重生者，拥有储物空间金手指，性格强势独立，绝不软弱

【玩家行动】"${action}"

请判断这个行动是否合理（符合末世重生爽文女主的人设和当前局势）：

1. 如果行动**合理**（符合主线逻辑），回复：
   💡 [建议] 一句话说明这个行动的合理性和可能结果，然后建议玩家通过选择按钮推进剧情。
   
2. 如果行动**危险但不致命**（有风险但可以尝试），回复：
   ⚠️ [警告] 描述这个行动的风险和可能的负面后果，但不要Game Over。

3. 如果行动**明显作死**（完全不符合人设/自杀行为/信任仇人/暴露重生身份等），回复：
   💀 [作死结局] 生成一段100字左右的短剧情，描述林念晚因为这个愚蠢的决定而走向毁灭，最后以"GAME OVER"结尾。要有戏剧性和讽刺感。

控制在150字以内。用中文。`;

    try {
        const res = await fetch(model.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${model.key}`
            },
            body: JSON.stringify({
                model: model.model,
                messages: [
                    { role: 'system', content: '你是命运裁判，冷酷无情，只根据逻辑和末世生存法则做判断。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 300
            })
        });
        
        if (!res.ok) throw new Error('API失败');
        const data = await res.json();
        const reply = data.choices[0].message.content;
        
        // 检测是否是作死结局
        if (reply.includes('💀') || reply.includes('GAME OVER')) {
            response.innerHTML = `<div class="death-ending">${reply}</div>
                <button class="death-restart-btn" onclick="location.reload()">🔄 重新开始</button>`;
            response.classList.add('show');
        } else {
            response.innerHTML = reply;
            response.classList.add('show');
        }
    } catch (e) {
        // API失败时用本地判断
        const localResult = localDeathCheck(action);
        response.innerHTML = localResult;
        response.classList.add('show');
    }
    
    btn.disabled = false;
    btn.textContent = '发送';
}

// ==================== AI对话功能（多模型） ====================

const AI_MODELS = [
    { id: 'mimo',    name: 'Mimo',    url: 'https://fufu.iqach.top/v1/chat/completions',      key: 'sk-OpnLdsBZcnx7lpwiVKwva1tV856l3sbeFjSE1LqlSfB8PU04', model: 'mimo-v2.5-pro' },
    { id: 'gemini',  name: 'Gemini',  url: 'https://sun.meowai.net/v1/chat/completions',      key: 'sk-OpnLdsBZcnx7lpwiVKwva1tV856l3sbeFjSE1LqlSfB8PU04', model: 'gemini-3.1-pro' },
];

let currentModelIndex = 0;

// 初始化模型选择器
function initModelSelector() {
    const container = document.getElementById('modelSelector');
    if (!container) return;
    container.innerHTML = '';
    AI_MODELS.forEach((m, i) => {
        const btn = document.createElement('button');
        btn.className = 'model-btn' + (i === currentModelIndex ? ' active' : '');
        btn.textContent = m.name;
        btn.title = m.model;
        btn.onclick = () => switchModel(i);
        container.appendChild(btn);
    });
}

function switchModel(index) {
    currentModelIndex = index;
    document.querySelectorAll('.model-btn').forEach((b, i) => {
        b.classList.toggle('active', i === index);
    });
}

// 发送到AI
async function sendToAI() {
    const input = document.getElementById('aiInput');
    const btn = document.getElementById('aiSendBtn');
    const response = document.getElementById('aiResponse');
    
    const question = input.value.trim();
    if (!question) return;
    
    // 检测是否是自由行动（而非提问）
    const actionKeywords = ['我要', '我想', '我去', '我决定', '让我', '我去找', '我要去', '我直接', '不如我', '干脆我'];
    const questionKeywords = ['？', '?', '怎么', '什么', '为什么', '是谁', '多少', '哪里', '如何', '分析', '建议', '内心', '风格'];
    
    const isAction = actionKeywords.some(k => question.includes(k)) && !questionKeywords.some(k => question.includes(k));
    
    if (isAction) {
        input.value = '';
        return handleFreeAction(question);
    }
    
    btn.disabled = true;
    btn.textContent = '思考中...';
    response.classList.remove('show');
    
    const model = AI_MODELS[currentModelIndex];
    
    try {
        const answer = await callAI(model, question);
        response.innerHTML = `<span style="color:var(--text-muted);font-size:11px;">[${model.name} · ${model.model}]</span><br>${answer}`;
        response.classList.add('show');
    } catch (error) {
        // 当前模型失败 → 自动尝试另一个模型
        const fallback = AI_MODELS.find((_, i) => i !== currentModelIndex);
        if (fallback) {
            try {
                const answer = await callAI(fallback, question);
                response.innerHTML = `<span style="color:var(--accent-gold);font-size:11px;">[自动切换 ${fallback.name}]</span><br>${answer}`;
                response.classList.add('show');
            } catch (e2) {
                response.innerHTML = generateLocalResponse(question);
                response.classList.add('show');
            }
        } else {
            response.innerHTML = generateLocalResponse(question);
            response.classList.add('show');
        }
    }
    
    btn.disabled = false;
    btn.textContent = '发送';
    input.value = '';
}

// 通用AI调用
async function callAI(model, question) {
    const systemPrompt = buildSystemPrompt();
    
    const res = await fetch(model.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${model.key}`
        },
        body: JSON.stringify({
            model: model.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question }
            ],
            temperature: 0.7,
            max_tokens: 400
        })
    });
    
    if (!res.ok) throw new Error(`${model.name} API ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

// 构建系统提示（包含完整游戏状态和历史）
function buildSystemPrompt() {
    const currentScene = AllScenes[GameState.currentScene];
    const choiceHistory = GameState.history.slice(-5).map(h => h.choice).join(' → ');
    
    return `你是《末世重生：囤货女王》游戏的AI助手，扮演林念晚的"潜意识"和"战略顾问"。

【当前状态】
- 场景：${currentScene?.title || '未知'}（${currentScene?.number || '?'}）
- 资金：${(GameState.money / 10000).toFixed(1)}万
- 末世倒计时：${GameState.daysLeft}天
- 物资：食物${GameState.inventory.food.amount} | 水${GameState.inventory.water.amount} | 药品${GameState.inventory.medicine.amount}
- 金手指：Lv.${GameState.goldenFinger.level}（${GameState.goldenFinger.energy}%）
- 盟友：${Object.entries(GameState.relationships).filter(([k,v]) => v > 0).map(([k]) => k).join(', ') || '无'}

【玩家历史选择】${choiceHistory || '暂无'}

【你的角色】
1. 回答剧情、策略、角色问题
2. 根据历史选择分析玩家风格（激进/谨慎/仁慈/冷酷）
3. 必要时生成林念晚的"内心独白"（用💭标记）
4. 给出符合末世重生爽文风格的建议

回答控制在200字内，语气要符合林念晚强势独立的性格。`;
}

// 生成主动提示（场景切换时自动调用）
async function generateProactiveHint() {
    const model = AI_MODELS[currentModelIndex];
    const currentScene = AllScenes[GameState.currentScene];
    
    const prompt = `作为林念晚的潜意识，用第一人称生成一段简短的"内心想法"或"战略提醒"（50字内）。

当前场景：${currentScene?.title}
氛围：${currentScene?.atmosphere}
可选行动：${currentScene?.choices.map(c => c.text).join(' / ')}

要求：
- 用第一人称"我"
- 体现重生者的先知优势和强势性格
- 可以是对某个选择的倾向，或对局势的判断
- 格式：💭 [内心独白]`;

    try {
        const res = await fetch(model.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${model.key}`
            },
            body: JSON.stringify({
                model: model.model,
                messages: [
                    { role: 'system', content: '你是林念晚的潜意识，强势、冷静、有复仇决心。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });
        
        if (!res.ok) return null;
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        return null;
    }
}

// 显示主动提示
async function showProactiveHint() {
    const response = document.getElementById('aiResponse');
    const hint = await generateProactiveHint();
    
    if (hint) {
        response.innerHTML = `<span style="color:var(--accent-mystic);font-size:11px;">[💭 林念晚的内心]</span><br>${hint}`;
        response.classList.add('show');
        
        // 5秒后自动隐藏
        setTimeout(() => {
            response.classList.remove('show');
        }, 8000);
    }
}

// 分析玩家风格
function analyzePlayerStyle() {
    const history = GameState.history;
    if (history.length < 3) return null;
    
    const keywords = {
        aggressive: ['复仇', '战斗', '杀', '消灭', '攻击', '冷酷'],
        cautious: ['准备', '储备', '谨慎', '观察', '调查', '计划'],
        benevolent: ['救', '帮助', '保护', '仁慈', '原谅', '合作'],
        ruthless: ['拒绝', '抛弃', '利用', '背叛', '独吞', '碾压']
    };
    
    const scores = { aggressive: 0, cautious: 0, benevolent: 0, ruthless: 0 };
    
    history.forEach(h => {
        const text = h.choice.toLowerCase();
        Object.entries(keywords).forEach(([style, words]) => {
            words.forEach(w => {
                if (text.includes(w)) scores[style]++;
            });
        });
    });
    
    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (dominant[1] === 0) return null;
    
    const styleNames = {
        aggressive: '激进战斗型',
        cautious: '谨慎谋划型',
        benevolent: '仁慈领袖型',
        ruthless: '冷酷独狼型'
    };
    
    return styleNames[dominant[0]];
}

// 生成本地回复（备用）
function generateLocalResponse(question) {
    const q = question.toLowerCase();
    
    // 特殊指令：分析玩家风格
    if (q.includes('分析') || q.includes('风格') || q.includes('我的选择')) {
        const style = analyzePlayerStyle();
        const history = GameState.history;
        
        if (!style || history.length < 3) {
            return `<strong>📊 风格分析</strong><br><br>
            你还没有做出足够的选择来形成风格。<br><br>
            继续游戏，你的选择模式会逐渐显现。`;
        }
        
        const recentChoices = history.slice(-5).map((h, i) => `${i+1}. ${h.choice}`).join('<br>');
        
        return `<strong>📊 你的游戏风格：${style}</strong><br><br>
        <strong>最近选择：</strong><br>${recentChoices}<br><br>
        <strong>风格解读：</strong><br>
        ${style === '激进战斗型' ? '你倾向于主动出击，用力量解决问题。这种风格在前期很爽，但要注意保存实力。' : ''}
        ${style === '谨慎谋划型' ? '你善于未雨绸缪，步步为营。这是末世生存的最佳策略。' : ''}
        ${style === '仁慈领袖型' ? '你愿意帮助他人，建立联盟。但要注意别被白眼狼背叛。' : ''}
        ${style === '冷酷独狼型' ? '你只相信自己，对敌人毫不留情。这种风格最符合林念晚的复仇人设。' : ''}`;
    }
    
    // 特殊指令：生成内心独白
    if (q.includes('内心') || q.includes('独白') || q.includes('心理')) {
        const currentScene = AllScenes[GameState.currentScene];
        const thoughts = [
            `💭 「${currentScene?.title || '这一刻'}... 前世的我绝对想不到，命运还能给我第二次机会。这一世，我要让所有人都记住我的名字。」`,
            `💭 「时间紧迫，但我不能慌乱。每一步都要算准，每一个选择都要为最终胜利服务。苏可欣、陈墨... 你们等着。」`,
            `💭 「储物空间里的物资是我的底牌，但真正的力量来自这里——」林念晚点了点自己的太阳穴，「重生的记忆。」`,
            `💭 「父母还在等我。前世我没能保护他们，这一世... 就算与全世界为敌，我也要让他们活下去。」`,
            `💭 「有人在暗中观察我。那种被窥视的感觉... 是周天成的人吗？看来我得加快脚步了。」`
        ];
        return thoughts[Math.floor(Math.random() * thoughts.length)];
    }
    
    // 特殊指令：场景建议
    if (q.includes('怎么办') || q.includes('建议') || q.includes('提示')) {
        const currentScene = AllScenes[GameState.currentScene];
        const choices = currentScene?.choices || [];
        
        if (choices.length === 0) return `<strong>💡 当前无可用选择</strong>`;
        
        const tips = choices.map((c, i) => {
            let hint = '';
            if (c.label === '复仇' || c.text.includes('复仇') || c.text.includes('杀')) hint = '（爽点选项，推进仇恨线）';
            if (c.label === '采购' || c.text.includes('买') || c.text.includes('囤')) hint = '（资源积累，长期收益）';
            if (c.label === '行动' && c.text.includes('父母')) hint = '（亲情线，解锁盟友）';
            if (c.label === '决策' && c.text.includes('抵押')) hint = '（高风险高回报）';
            return `• ${c.text} ${hint}`;
        }).join('<br>');
        
        return `<strong>💡 当前可选行动：</strong><br><br>${tips}<br><br><span style="color:var(--text-muted);font-size:12px;">提示：根据你的风格，选择最符合你人设的选项。</span>`;
    }
    
    if (q.includes('储物') || q.includes('空间')) {
        return `<strong>📦 关于储物空间：</strong><br><br>
        你的储物空间目前等级为${GameState.goldenFinger.level}，容量100立方米，具有<span class="highlight">时间静止</span>特性。<br><br>
        已存储：食物${GameState.inventory.food.amount}单位、水${GameState.inventory.water.amount}单位、药品${GameState.inventory.medicine.amount}单位。<br><br>
        升级条件：囤积物资总价值达到100万。`;
    }
    
    if (q.includes('仇人') || q.includes('苏可欣') || q.includes('陈墨')) {
        return `<strong>⚔️ 关于仇人：</strong><br><br>
        <span class="danger-text">苏可欣</span>：你的前世闺蜜，背叛了你并抢走物资。目前关系：敌对(-100)<br><br>
        <span class="danger-text">陈墨</span>：你的前世男友，与苏可欣合谋背叛。目前关系：敌对(-100)<br><br>
        他们现在住在市中心的公寓里（你租给他们的）。`;
    }
    
    if (q.includes('资金') || q.includes('钱')) {
        return `<strong>💰 资金状况：</strong><br><br>
        当前可用资金：<span class="highlight">${(GameState.money / 10000).toFixed(1)}万</span><br><br>
        建议优先采购：食物 > 水 > 药品 > 武器<br><br>
        提示：可以考虑抵押房产获取更多资金。`;
    }
    
    if (q.includes('末世') || q.includes('时间')) {
        return `<strong>⏰ 末世倒计时：</strong><br><br>
        距离末世降临还有 <span class="danger-text">${GameState.daysLeft}天</span><br><br>
        末世类型：极寒 + 地震 + 变异生物<br><br>
        建议：尽快完成物资囤积和避难所建设！`;
    }
    
    if (q.includes('父母') || q.includes('家人')) {
        return `<strong>👨‍👩‍👧 关于家人：</strong><br><br>
        父亲：关系值 ${GameState.relationships['林父']}<br>
        母亲：关系值 ${GameState.relationships['林母']}<br><br>
        ${GameState.flags.hasMetParents ? '他们已经同意跟你去安全屋了。' : '你还没有告诉他们真相，建议尽快沟通。'}`;
    }

    // 结局相关查询
    if (q.includes('结局') || q.includes('ending') || q.includes('最终')) {
        const tendency = getEndingTendency();
        const recommended = getRecommendedEnding();

        if (typeof tendency === 'string') {
            return `<strong>🔮 结局预测</strong><br><br>${tendency}<br><br>继续做出选择，你的结局倾向会逐渐显现。`;
        }

        const bars = tendency.map(t => {
            const info = getEndingInfo(
                t.name === '独狼' ? 'lone_wolf' :
                t.name === '领袖' ? 'leader' :
                t.name === '牺牲' ? 'sacrifice' : 'revenge'
            );
            return `${info.icon} ${info.name}：${t.pct}%`;
        }).join('<br>');

        let result = `<strong>🔮 结局预测</strong><br><br>${bars}`;

        if (recommended) {
            const recInfo = getEndingInfo(recommended);
            result += `<br><br>🎯 当前倾向：<strong style="color:${recInfo.color}">${recInfo.icon} ${recInfo.name}</strong>`;
            result += `<br><span style="color:var(--text-muted);font-size:12px;">${recInfo.desc}</span>`;
        }

        return result;
    }
    
    // 分析玩家风格
    const style = analyzePlayerStyle();
    const styleText = style ? `<br><br><span style="color:var(--accent-gold);">📊 你的风格：${style}</span>` : '';
    
    return `<strong>🤖 AI助手</strong>${styleText}<br><br>
    我是林念晚的潜意识，也是你的战略顾问。<br><br>
    💡 你可以问我：<br>
    • "分析我的选择" — 获得风格分析<br>
    • "现在该怎么办？" — 获得场景建议<br>
    • "储物空间/仇人/资金/末世时间" — 查询状态<br>
    • "生成内心独白" — 让AI写一段林念晚的心理活动<br><br>
    当前场景：${AllScenes[GameState.currentScene]?.title || '未知'}`;
}

// 监听Enter键
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initModelSelector();
    updateContinueButton();
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendToAI();
            }
        });
    }
});

// 快速提问
function quickAsk(text) {
    const input = document.getElementById('aiInput');
    input.value = text;
    sendToAI();
}

// ==================== 结局判定系统 ====================
const EndingScores = {
    lone_wolf: 0,    // 独狼值
    leader: 0,       // 领袖值
    sacrifice: 0,    // 牺牲值
    revenge: 0       // 复仇值
};

// 结局判定关键词映射
const EndingKeywords = {
    lone_wolf: {
        add: ['独自', '一个人', '不需要', '拒绝帮助', '独自行动', '不信任', '独来独往', '抛弃盟友', '不需要任何人'],
        sub: ['合作', '帮助', '保护', '联盟', '团队', '一起']
    },
    leader: {
        add: ['建立', '组织', '领导', '基地', '招募', '训练', '团结', '秩序', '管理', '指挥', '号召'],
        sub: ['独自', '一个人', '抛弃', '独来独往']
    },
    sacrifice: {
        add: ['保护', '拯救', '牺牲', '代替', '挡在', '不惜一切', '宁愿自己', '守护'],
        sub: ['利用', '抛弃', '牺牲别人', '不管']
    },
    revenge: {
        add: ['复仇', '消灭', '杀死', '报复', '惩罚', '让她们付出代价', '绝不原谅', '碾死', '血债血偿'],
        sub: ['原谅', '放下', '算了', '不值得']
    }
};

// 根据选择更新结局分数
function updateEndingScores(choiceText) {
    const text = choiceText.toLowerCase();

    Object.entries(EndingKeywords).forEach(([ending, keywords]) => {
        keywords.add.forEach(k => { if (text.includes(k)) EndingScores[ending] += 2; });
        keywords.sub.forEach(k => { if (text.includes(k)) EndingScores[ending] -= 1; });
    });

    // 确保分数不为负
    Object.keys(EndingScores).forEach(k => { EndingScores[k] = Math.max(0, EndingScores[k]); });
}

// 获取推荐结局
function getRecommendedEnding() {
    const scores = EndingScores;
    const max = Math.max(scores.lone_wolf, scores.leader, scores.sacrifice, scores.revenge);

    if (max === 0) return null; // 没有足够数据

    if (scores.lone_wolf === max) return 'lone_wolf';
    if (scores.leader === max) return 'leader';
    if (scores.sacrifice === max) return 'sacrifice';
    if (scores.revenge === max) return 'revenge';
    return null;
}

// 获取结局倾向描述
function getEndingTendency() {
    const scores = EndingScores;
    const total = scores.lone_wolf + scores.leader + scores.sacrifice + scores.revenge;
    if (total === 0) return '尚未形成倾向';

    const tendencies = [];
    if (scores.lone_wolf > 0) tendencies.push({ name: '独狼', pct: Math.round(scores.lone_wolf / total * 100), score: scores.lone_wolf });
    if (scores.leader > 0) tendencies.push({ name: '领袖', pct: Math.round(scores.leader / total * 100), score: scores.leader });
    if (scores.sacrifice > 0) tendencies.push({ name: '牺牲', pct: Math.round(scores.sacrifice / total * 100), score: scores.sacrifice });
    if (scores.revenge > 0) tendencies.push({ name: '复仇', pct: Math.round(scores.revenge / total * 100), score: scores.revenge });

    tendencies.sort((a, b) => b.score - a.score);
    return tendencies;
}

// 获取结局详细信息
function getEndingInfo(endingId) {
    const endings = {
        lone_wolf: {
            name: '独狼结局',
            icon: '🐺',
            color: '#3498db',
            desc: '你选择独自面对末世，不依赖任何人。在击败周天成后，你带着储物空间消失在废墟之中，成为传说中的独行侠。',
            requirement: '倾向于独自行动，不信任他人'
        },
        leader: {
            name: '领袖结局',
            icon: '👑',
            color: '#f39c12',
            desc: '你建立了"新黎明"城，成为末世中最有影响力的领袖。幸存者们尊称你为"黎明女王"。',
            requirement: '倾向于建立组织、团结他人'
        },
        sacrifice: {
            name: '牺牲结局',
            icon: '✨',
            color: '#9b59b6',
            desc: '在最终决战中，你选择用自己的生命封印变异源。你的身体化为极光，永远守护着这个世界。',
            requirement: '倾向于保护他人、自我牺牲'
        },
        revenge: {
            name: '复仇结局',
            icon: '⚔️',
            color: '#e74c3c',
            desc: '你彻底消灭了周天成和新秩序，但也失去了所有盟友。站在废墟之上，你终于完成了复仇...代价是一切。',
            requirement: '倾向于复仇、惩罚敌人'
        }
    };
    return endings[endingId] || null;
}

// 渲染结局预测（在能力面板中显示）
function renderEndingPrediction() {
    const tendency = getEndingTendency();
    const recommended = getRecommendedEnding();

    let html = '<div class="ending-prediction">';

    if (typeof tendency === 'string') {
        html += `<div class="ending-none">${tendency}</div>`;
    } else {
        html += '<div class="ending-bars">';
        tendency.forEach(t => {
            const info = getEndingInfo(
                t.name === '独狼' ? 'lone_wolf' :
                t.name === '领袖' ? 'leader' :
                t.name === '牺牲' ? 'sacrifice' : 'revenge'
            );
            if (info) {
                html += `
                    <div class="ending-bar-item">
                        <span class="ending-bar-icon">${info.icon}</span>
                        <span class="ending-bar-name">${info.name}</span>
                        <div class="ending-bar-bg"><div class="ending-bar-fill" style="width:${t.pct}%;background:${info.color}"></div></div>
                        <span class="ending-bar-pct" style="color:${info.color}">${t.pct}%</span>
                    </div>
                `;
            }
        });
        html += '</div>';

        if (recommended) {
            const recInfo = getEndingInfo(recommended);
            html += `<div class="ending-recommend" style="color:${recInfo.color}">
                🎯 当前倾向：${recInfo.icon} ${recInfo.name}
            </div>`;
        }
    }

    html += '</div>';
    return html;
}

// ==================== 战斗系统 ====================
const BattleState = {
    inBattle: false,
    enemy: null,
    playerHP: 100,
    playerMaxHP: 100,
    enemyHP: 0,
    enemyMaxHP: 0,
    turn: 0,
    log: []
};

// 变异生物数据库
const MonsterDB = [
    { id: 'mutant_dog', name: '变异猎犬', icon: '🐕‍🦺', hp: 40, attack: 8, defense: 3, exp: 10,
      description: '被极寒辐射变异的野犬，速度极快' },
    { id: 'frost_wolf', name: '冰霜巨狼', icon: '🐺', hp: 80, attack: 15, defense: 8, exp: 25,
      description: '末世北方的顶级掠食者' },
    { id: 'mutant_rat', name: '巨型变异鼠', icon: '🐀', hp: 25, attack: 5, defense: 2, exp: 5,
      description: '成群出没的变异鼠类' },
    { id: 'ice_zombie', name: '冰冻丧尸', icon: '🧟', hp: 60, attack: 12, defense: 5, exp: 20,
      description: '被极寒病毒感染的人类' },
    { id: 'frost_bear', name: '极寒巨熊', icon: '🐻‍❄️', hp: 150, attack: 25, defense: 15, exp: 50,
      description: 'Boss级变异生物，极其危险' },
    { id: 'corrupted_human', name: '堕落者', icon: '👤', hp: 100, attack: 20, defense: 10, exp: 40,
      description: '被新秩序控制芯片操控的人类' },
];

// 开始战斗
function startBattle(monsterId) {
    const monster = MonsterDB.find(m => m.id === monsterId);
    if (!monster) return;

    BattleState.inBattle = true;
    BattleState.enemy = monster;
    BattleState.playerHP = 100 + GameState.goldenFinger.level * 20;
    BattleState.playerMaxHP = BattleState.playerHP;
    BattleState.enemyHP = monster.hp;
    BattleState.enemyMaxHP = monster.hp;
    BattleState.turn = 0;
    BattleState.log = [`⚔️ ${monster.name}出现了！${monster.description}`];

    renderBattle();
}

// 玩家攻击
function playerAttack() {
    if (!BattleState.inBattle) return;
    BattleState.turn++;

    const baseDamage = 10 + GameState.goldenFinger.level * 5;
    const damage = Math.max(1, baseDamage - BattleState.enemy.defense + Math.floor(Math.random() * 6));
    BattleState.enemyHP = Math.max(0, BattleState.enemyHP - damage);
    BattleState.log.push(`🗡️ 你对${BattleState.enemy.name}造成了 ${damage} 点伤害！`);

    if (BattleState.enemyHP <= 0) {
        battleVictory();
        return;
    }

    enemyAttack();
    renderBattle();
}

// 使用物品（药品回血）
function playerUseItem() {
    if (!BattleState.inBattle) return;
    BattleState.turn++;

    const med = GameState.inventory.medicine;
    if (!med || med.amount <= 0) {
        BattleState.log.push('❌ 没有药品了！');
        renderBattle();
        return;
    }

    consumeItem('medicine', 1);
    const heal = 30;
    BattleState.playerHP = Math.min(BattleState.playerMaxHP, BattleState.playerHP + heal);
    BattleState.log.push(`💊 使用药品，恢复了 ${heal} 点生命值！`);

    enemyAttack();
    renderBattle();
}

// 使用金手指（储物空间砸人）
function playerUseSkill() {
    if (!BattleState.inBattle) return;
    BattleState.turn++;

    if (BattleState.enemy.attack >= 20) {
        BattleState.log.push('⚡ 金手指能量不足，无法对强敌使用！');
        enemyAttack();
        renderBattle();
        return;
    }

    const damage = 25 + GameState.goldenFinger.level * 10;
    BattleState.enemyHP = Math.max(0, BattleState.enemyHP - damage);
    BattleState.log.push(`📦 储物空间重击！对${BattleState.enemy.name}造成了 ${damage} 点伤害！`);

    if (BattleState.enemyHP <= 0) {
        battleVictory();
        return;
    }

    enemyAttack();
    renderBattle();
}

// 逃跑
function playerFlee() {
    if (!BattleState.inBattle) return;

    const fleeChance = 0.4 + GameState.goldenFinger.level * 0.1;
    if (Math.random() < fleeChance) {
        BattleState.log.push('🏃 成功逃脱！');
        BattleState.inBattle = false;
        renderBattle();
        setTimeout(() => {
            document.getElementById('battleContainer').style.display = 'none';
        }, 1500);
    } else {
        BattleState.log.push('❌ 逃跑失败！');
        BattleState.turn++;
        enemyAttack();
        renderBattle();
    }
}

// 敌人攻击
function enemyAttack() {
    const damage = Math.max(1, BattleState.enemy.attack - 5 + Math.floor(Math.random() * 4));
    BattleState.playerHP = Math.max(0, BattleState.playerHP - damage);
    BattleState.log.push(`🔴 ${BattleState.enemy.name}对你造成了 ${damage} 点伤害！`);

    if (BattleState.playerHP <= 0) {
        battleDefeat();
    }
}

// 战斗胜利
function battleVictory() {
    BattleState.log.push(`🎉 你击败了${BattleState.enemy.name}！获得 ${BattleState.enemy.exp} 经验值！`);
    BattleState.inBattle = false;
    renderBattle();

    // 恢复部分生命值
    BattleState.playerHP = Math.min(BattleState.playerMaxHP, Math.floor(BattleState.playerMaxHP * 0.7));
}

// 战斗失败
function battleDefeat() {
    BattleState.log.push('💀 你被击败了...但在最后一刻，储物空间爆发出了金光，将你传送回了安全屋。');
    BattleState.inBattle = false;
    BattleState.playerHP = Math.floor(BattleState.playerMaxHP * 0.3);
    renderBattle();
}

// 渲染战斗界面
function renderBattle() {
    const container = document.getElementById('battleContainer');
    if (!container) return;

    container.style.display = 'block';

    const e = BattleState.enemy;
    const playerPct = Math.round((BattleState.playerHP / BattleState.playerMaxHP) * 100);
    const enemyPct = Math.round((BattleState.enemyHP / BattleState.enemyMaxHP) * 100);
    const playerColor = playerPct > 60 ? '#2ecc71' : playerPct > 30 ? '#f39c12' : '#e74c3c';
    const enemyColor = enemyPct > 60 ? '#2ecc71' : enemyPct > 30 ? '#f39c12' : '#e74c3c';

    const logHTML = BattleState.log.slice(-4).map(l => `<div class="battle-log-entry">${l}</div>`).join('');

    container.innerHTML = `
        <div class="battle-header">⚔️ 战斗 · 第${BattleState.turn}回合</div>
        <div class="battle-field">
            <div class="battle-unit enemy-unit">
                <span class="battle-icon">${e.icon}</span>
                <div class="battle-unit-info">
                    <span class="battle-name">${e.name}</span>
                    <div class="battle-hp-bar"><div class="battle-hp-fill" style="width:${enemyPct}%;background:${enemyColor}"></div></div>
                    <span class="battle-hp-text">${BattleState.enemyHP}/${BattleState.enemyMaxHP}</span>
                </div>
            </div>
            <div class="battle-vs">VS</div>
            <div class="battle-unit player-unit">
                <span class="battle-icon">👩</span>
                <div class="battle-unit-info">
                    <span class="battle-name">林念晚</span>
                    <div class="battle-hp-bar"><div class="battle-hp-fill" style="width:${playerPct}%;background:${playerColor}"></div></div>
                    <span class="battle-hp-text">${BattleState.playerHP}/${BattleState.playerMaxHP}</span>
                </div>
            </div>
        </div>
        <div class="battle-log">${logHTML}</div>
        <div class="battle-actions">
            ${BattleState.inBattle ? `
                <button class="battle-btn attack" onclick="playerAttack()">🗡️ 攻击</button>
                <button class="battle-btn item" onclick="playerUseItem()">💊 药品(${GameState.inventory.medicine?.amount || 0})</button>
                <button class="battle-btn skill" onclick="playerUseSkill()">📦 金手指</button>
                <button class="battle-btn flee" onclick="playerFlee()">🏃 逃跑</button>
            ` : `
                <button class="battle-btn attack" onclick="endBattle()">✅ 继续</button>
            `}
        </div>
    `;
}

// 结束战斗（关闭界面）
function endBattle() {
    const container = document.getElementById('battleContainer');
    if (container) container.style.display = 'none';
}

// ==================== 存档系统 ====================
const SAVE_KEY = 'apocalypse_queen_saves';
const AUTO_SAVE_KEY = 'apocalypse_queen_autosave';

// 保存游戏
function saveGame(slotId = 'auto') {
    const saveData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        gameState: JSON.parse(JSON.stringify(GameState)),
        sceneTitle: AllScenes[GameState.currentScene]?.title || '未知',
        sceneNumber: AllScenes[GameState.currentScene]?.number || '?',
        playTime: calculatePlayTime()
    };
    
    if (slotId === 'auto') {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
        showToast('💾 已自动保存');
    } else {
        const saves = loadSaveList();
        saves[slotId] = saveData;
        localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
        showToast(`💾 已保存到存档${slotId}`);
    }
    
    updateContinueButton();
    return true;
}

// 读取游戏
function loadGame(slotId = 'auto') {
    let saveData;
    
    if (slotId === 'auto') {
        const data = localStorage.getItem(AUTO_SAVE_KEY);
        if (!data) return false;
        saveData = JSON.parse(data);
    } else {
        const saves = loadSaveList();
        if (!saves[slotId]) return false;
        saveData = saves[slotId];
    }
    
    // 恢复游戏状态
    Object.assign(GameState, saveData.gameState);
    
    // 重新加载场景
    loadScene(GameState.currentScene);
    updateStatusBar();
    
    showToast('📂 存档已读取');
    closeSaveMenu();
    return true;
}

// 删除存档
function deleteSave(slotId) {
    if (slotId === 'auto') {
        localStorage.removeItem(AUTO_SAVE_KEY);
    } else {
        const saves = loadSaveList();
        delete saves[slotId];
        localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
    }
    updateSaveMenu();
    updateContinueButton();
}

// 加载存档列表
function loadSaveList() {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : {};
}

// 检查是否有自动存档
function hasAutoSave() {
    return !!localStorage.getItem(AUTO_SAVE_KEY);
}

// 计算游戏时间（简化版）
function calculatePlayTime() {
    return GameState.history.length * 2; // 假设每个场景2分钟
}

// 格式化时间
function formatTime(minutes) {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
}

// 格式化日期
function formatDate(isoString) {
    const date = new Date(isoString);
    return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 显示提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: rgba(231, 76, 60, 0.9); color: white;
        padding: 10px 24px; border-radius: 20px;
        font-size: 14px; z-index: 1000;
        animation: fadeInOut 2s ease forwards;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// 打开存档菜单
function openSaveMenu() {
    const menu = document.getElementById('saveMenu');
    if (menu) {
        menu.style.display = 'flex';
        updateSaveMenu();
    }
}

// 关闭存档菜单
function closeSaveMenu() {
    const menu = document.getElementById('saveMenu');
    if (menu) menu.style.display = 'none';
}

// 更新存档菜单显示
function updateSaveMenu() {
    const container = document.getElementById('saveSlots');
    if (!container) return;
    
    const saves = loadSaveList();
    const autoSave = localStorage.getItem(AUTO_SAVE_KEY);
    
    let html = '';
    
    // 自动存档
    if (autoSave) {
        const data = JSON.parse(autoSave);
        html += createSaveSlotHTML('auto', data, true);
    } else {
        html += createEmptySlotHTML('auto', '自动存档', true);
    }
    
    // 手动存档槽
    for (let i = 1; i <= 3; i++) {
        if (saves[i]) {
            html += createSaveSlotHTML(i, saves[i], false);
        } else {
            html += createEmptySlotHTML(i, `存档 ${i}`, false);
        }
    }
    
    container.innerHTML = html;
}

// 创建存档槽HTML
function createSaveSlotHTML(slotId, data, isAuto) {
    return `
        <div class="save-slot" data-slot="${slotId}">
            <div class="save-info">
                <div class="save-title">${isAuto ? '🔄 自动存档' : `💾 存档 ${slotId}`}</div>
                <div class="save-detail">${data.sceneNumber} · ${data.sceneTitle}</div>
                <div class="save-meta">${formatDate(data.timestamp)} · 游戏时长${formatTime(data.playTime)}</div>
            </div>
            <div class="save-actions">
                <button class="save-action-btn load" onclick="loadGame('${slotId}')">读取</button>
                ${!isAuto ? `<button class="save-action-btn save" onclick="saveGame('${slotId}')">覆盖</button>` : ''}
                <button class="save-action-btn delete" onclick="deleteSave('${slotId}')">删除</button>
            </div>
        </div>
    `;
}

// 创建空存档槽HTML
function createEmptySlotHTML(slotId, title, isAuto) {
    return `
        <div class="save-slot empty" data-slot="${slotId}">
            <div class="save-info">
                <div class="save-title">${isAuto ? '🔄 自动存档' : title}</div>
                <div class="save-detail">空存档槽</div>
            </div>
            <div class="save-actions">
                ${!isAuto ? `<button class="save-action-btn save" onclick="saveGame('${slotId}')">保存</button>` : ''}
            </div>
        </div>
    `;
}

// 更新开始界面的继续游戏按钮
function updateContinueButton() {
    const btn = document.getElementById('continueBtn');
    if (btn) {
        btn.style.display = hasAutoSave() ? 'block' : 'none';
    }
}

// ==================== 物资辅助函数 ====================

// 获取总物资数
function getTotalItems() {
    let total = 0;
    Object.values(GameState.inventory).forEach(item => {
        total += (typeof item === 'object' && item.amount !== undefined) ? item.amount : (typeof item === 'number' ? item : 0);
    });
    return total;
}

// 获取存储空间使用率
function getStorageUsage() {
    const total = getTotalItems();
    const capacity = GameState.goldenFinger.storageCapacity;
    return Math.min(100, Math.round((total / capacity) * 100));
}

// 添加物资
function addItem(key, amount) {
    if (GameState.inventory[key]) {
        GameState.inventory[key].amount = Math.min(
            GameState.inventory[key].max,
            GameState.inventory[key].amount + amount
        );
    }
}

// 消耗物资
function consumeItem(key, amount) {
    if (GameState.inventory[key]) {
        GameState.inventory[key].amount = Math.max(0, GameState.inventory[key].amount - amount);
    }
}

// 计算每日消耗（末世开始后）
function dailyConsumption() {
    if (GameState.daysLeft > 0) return 0; // 末世前不消耗
    consumeItem('food', 3);
    consumeItem('water', 2);
    consumeItem('fuel', 1);
    return 6; // 总消耗
}

// ==================== 面板渲染函数 ====================

// 物资面板
function updateInventoryPanel() {
    const panel = document.getElementById('inventoryPanel');
    if (!panel) return;
    
    const usage = getStorageUsage();
    const capacity = GameState.goldenFinger.storageCapacity;
    const total = getTotalItems();
    
    let html = `
        <div class="inv-header">
            <span class="inv-title">🎒 储物空间</span>
            <span class="inv-usage">${total}/${capacity} (${usage}%)</span>
        </div>
        <div class="inv-bar-bg"><div class="inv-bar-fill" style="width:${usage}%"></div></div>
        <div class="inv-grid">
    `;
    
    Object.entries(GameState.inventory).forEach(([key, item]) => {
        const pct = Math.round((item.amount / item.max) * 100);
        const color = pct > 70 ? 'var(--accent-gold)' : pct > 30 ? 'var(--text-secondary)' : 'var(--accent-danger)';
        html += `
            <div class="inv-item" onclick="showItemDetail('${key}')">
                <span class="inv-icon">${item.icon}</span>
                <div class="inv-info">
                    <span class="inv-name">${item.name}</span>
                    <div class="inv-mini-bar"><div class="inv-mini-fill" style="width:${pct}%;background:${color}"></div></div>
                </div>
                <span class="inv-amount" style="color:${color}">${item.amount}</span>
            </div>
        `;
    });
    
    html += '</div>';
    panel.innerHTML = html;
}

// 关系面板
function updateRelationshipPanel() {
    const panel = document.getElementById('relationshipPanel');
    if (!panel) return;
    
    let html = `
        <div class="rel-header">
            <span class="rel-title">👥 人物关系</span>
        </div>
        <div class="rel-list">
    `;
    
    Object.entries(GameState.relationships).forEach(([name, value]) => {
        let status, statusColor, emoji;
        if (value >= 80) { status = '挚友'; statusColor = '#2ecc71'; emoji = '💚'; }
        else if (value >= 50) { status = '友好'; statusColor = '#27ae60'; emoji = '🤝'; }
        else if (value >= 20) { status = '中立'; statusColor = '#f39c12'; emoji = '😐'; }
        else if (value >= -20) { status = '冷淡'; statusColor = '#e67e22'; emoji = '❄️'; }
        else if (value >= -60) { status = '敌意'; statusColor = '#e74c3c'; emoji = '😠'; }
        else { status = '死敌'; statusColor = '#c0392b'; emoji = '💀'; }
        
        const barWidth = Math.abs(value);
        const barColor = value >= 0 ? '#2ecc71' : '#e74c3c';
        
        html += `
            <div class="rel-item">
                <span class="rel-emoji">${emoji}</span>
                <span class="rel-name">${name}</span>
                <div class="rel-bar-bg">
                    <div class="rel-bar-fill" style="width:${barWidth}%;background:${barColor}"></div>
                </div>
                <span class="rel-value" style="color:${statusColor}">${value > 0 ? '+' : ''}${value}</span>
                <span class="rel-status" style="color:${statusColor}">${status}</span>
            </div>
        `;
    });
    
    html += '</div>';
    panel.innerHTML = html;
}

// 能力面板
function updateAbilitiesPanel() {
    const panel = document.getElementById('abilitiesPanel');
    if (!panel) return;
    
    const gf = GameState.goldenFinger;
    panel.innerHTML = `
        <div class="rel-header">
            <span class="rel-title">⚡ 金手指能力</span>
        </div>
        <div class="ability-list">
            <div class="ability-item">
                <span class="ability-icon">📦</span>
                <div class="ability-info">
                    <span class="ability-name">储物空间</span>
                    <span class="ability-desc">Lv.${gf.level} · ${gf.storageCapacity}m³ · 时间静止</span>
                </div>
                <span class="ability-status" style="color:var(--accent-gold)">已激活</span>
            </div>
            <div class="ability-item">
                <span class="ability-icon">🧠</span>
                <div class="ability-info">
                    <span class="ability-name">前世记忆</span>
                    <span class="ability-desc">末世事件预知 · 关键情报</span>
                </div>
                <span class="ability-status" style="color:var(--accent-gold)">已激活</span>
            </div>
            <div class="ability-item">
                <span class="ability-icon">⚡</span>
                <div class="ability-info">
                    <span class="ability-name">异能预感</span>
                    <span class="ability-desc">${gf.level >= 2 ? '危险预警 · 未来视' : '未解锁（Lv.2觉醒）'}</span>
                </div>
                <span class="ability-status" style="color:${gf.level >= 2 ? 'var(--accent-gold)' : 'var(--text-muted)'}">${gf.level >= 2 ? '已激活' : '🔒'}</span>
            </div>
            <div class="ability-item">
                <span class="ability-icon">⏪</span>
                <div class="ability-info">
                    <span class="ability-name">时间回溯</span>
                    <span class="ability-desc">${gf.level >= 3 ? '回溯3秒 · 改变瞬间' : '未解锁（Lv.3觉醒）'}</span>
                </div>
                <span class="ability-status" style="color:${gf.level >= 3 ? 'var(--accent-gold)' : 'var(--text-muted)'}">${gf.level >= 3 ? '已激活' : '🔒'}</span>
            </div>
        </div>
        <div class="energy-bar">
            <span>能量</span>
            <div class="inv-bar-bg"><div class="inv-bar-fill" style="width:${gf.energy}%;background:var(--accent-mystic)"></div></div>
            <span>${gf.energy}%</span>
        </div>
        ${renderEndingPrediction()}
    `;
}

// 切换标签页
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.textContent.includes(
            tabName === 'inventory' ? '物资' : tabName === 'relationships' ? '关系' : '能力'
        ));
    });
    document.getElementById('inventoryPanel').style.display = tabName === 'inventory' ? 'block' : 'none';
    document.getElementById('relationshipPanel').style.display = tabName === 'relationships' ? 'block' : 'none';
    document.getElementById('abilitiesPanel').style.display = tabName === 'abilities' ? 'block' : 'none';
    if (tabName === 'abilities') updateAbilitiesPanel();
}

// 物资详情弹窗
function showItemDetail(key) {
    const item = GameState.inventory[key];
    if (!item) return;
    const response = document.getElementById('aiResponse');
    response.innerHTML = `<strong>${item.icon} ${item.name}</strong><br>
        数量：${item.amount}/${item.max} ${item.unit}<br>
        储存率：${Math.round((item.amount/item.max)*100)}%<br>
        <span style="color:var(--text-muted);font-size:11px;">点击物资面板中的物品可查看详情</span>`;
    response.classList.add('show');
}

// 导出游戏状态（用于调试）
window.GameState = GameState;
window.AllScenes = AllScenes;
window.quickAsk = quickAsk;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.deleteSave = deleteSave;
window.openSaveMenu = openSaveMenu;
window.closeSaveMenu = closeSaveMenu;
window.continueGame = continueGame;
window.resetGameState = resetGameState;
window.switchTab = switchTab;
window.startBattle = startBattle;
window.playerAttack = playerAttack;
window.playerUseItem = playerUseItem;
window.playerUseSkill = playerUseSkill;
window.playerFlee = playerFlee;
window.endBattle = endBattle;
window.showItemDetail = showItemDetail;
window.handleFreeAction = handleFreeAction;
window.toggleTabPanel = toggleTabPanel;
window.setSceneBackground = setSceneBackground;
