/* ============================================================
   金币大亨 — 中英双语（跟随主站 localStorage['jiedim.lang']）
   · t(key, vars)    按 key 取词，支持 {var} 占位
   · tr(zh)          反向查表：把配置/存档里的中文原文译成英文
   · applyStatic()   替换页面里带 data-i18n / data-i18n-attr 的节点
   字典格式：{ key: [中文, English] }
   ============================================================ */

const DICT = {
  /* ---------- 页面静态 ---------- */
  'doc.title': ['金币大亨 · 深渊觉醒', 'Coin Tycoon · Abyss Awakening'],
  'app.title': ['金币大亨', 'Coin Tycoon'],
  'hud.coins': ['金币', 'Coins'],
  'hud.cps': ['/秒', '/ sec'],
  'hud.click': ['点击力', 'Click Power'],
  'btn.sound': ['音效', 'Sound'],
  'btn.theme': ['主题', 'Theme'],
  'btn.save': ['保存', 'Save'],
  'btn.settings': ['设置', 'Settings'],
  'card.chapter': ['第1章', 'Chapter 1'],
  'card.daily': ['日常任务', 'Daily Tasks'],
  'card.prestige': ['转生点', 'Prestige'],
  'card.prestige.unit': ['点', ' pts'],
  'panel.click.title': ['点击挖矿', 'Tap to Mine'],
  'panel.click.button': ['挖矿', 'MINE'],
  'panel.boss.title': ['Boss挑战', 'Boss Challenge'],
  'panel.boss.attack': ['攻击Boss', 'Attack Boss'],

  /* ---------- 导航标签 ---------- */
  'tab.up': ['升级', 'Upgrades'],
  'tab.sk': ['技能', 'Skills'],
  'tab.eq': ['装备', 'Equipment'],
  'tab.pt': ['宠物', 'Pets'],
  'tab.rs': ['研究', 'Research'],
  'tab.gt': ['祈愿', 'Gacha'],
  'tab.exp': ['远征', 'Expedition'],
  'tab.wboss': ['世界Boss', 'World Boss'],
  'tab.ach': ['成就', 'Achievements'],
  'tab.col': ['收藏', 'Collection'],

  /* ---------- 章节名（同时供反向查表使用） ---------- */
  'name.ch1': ['初入金矿', 'Into the Gold Mine'],
  'name.ch2': ['深入矿洞', 'Deep Caverns'],
  'name.ch3': ['黄金迷宫', 'Golden Labyrinth'],
  'name.ch4': ['巨龙巢穴', 'Dragon Lair'],
  'name.ch5': ['财富之巅', 'Peak of Wealth'],
  'name.ch6': ['传奇之路', 'Path of Legends'],

  /* ---------- 玩家称号 ---------- */
  'title.1': ['新手矿工', 'Novice Miner'],
  'title.5': ['初级矿工', 'Junior Miner'],
  'title.10': ['熟练矿工', 'Skilled Miner'],
  'title.20': ['资深矿工', 'Senior Miner'],
  'title.30': ['黄金矿工', 'Golden Miner'],
  'title.50': ['钻石矿工', 'Diamond Miner'],
  'title.100': ['传奇矿工', 'Legendary Miner'],

  /* ---------- Boss / 世界Boss / 深渊敌人 ---------- */
  'boss.1': ['矿洞守护者', 'Mine Guardian'],
  'boss.2': ['黄金巨人', 'Golden Giant'],
  'boss.3': ['水晶龙', 'Crystal Dragon'],
  'boss.4': ['熔岩领主', 'Lava Lord'],
  'boss.5': ['深渊之王', 'Abyss King'],
  'boss.6': ['传奇霸主', 'Legend Overlord'],
  'wboss.1': ['深渊领主', 'Abyss Lord'],
  'wboss.2': ['虚空巨兽', 'Void Behemoth'],
  'wboss.3': ['混沌之主', 'Chaos Lord'],
  'wboss.4': ['毁灭使者', 'Herald of Ruin'],
  'wboss.5': ['永恒守卫', 'Eternal Guardian'],
  'wboss.6': ['终焉之王', 'King of the End'],
  'abyss.1': ['深渊守卫', 'Abyss Guard'],
  'abyss.2': ['暗影猎手', 'Shadow Hunter'],
  'abyss.3': ['熔岩巨人', 'Magma Giant'],
  'abyss.4': ['冰霜恶魔', 'Frost Demon'],
  'abyss.5': ['虚空领主', 'Void Lord'],

  /* ---------- 升级项 ---------- */
  'up.click': ['点击强化', 'Reinforced Click'],
  'up.crit': ['暴击训练', 'Crit Training'],
  'up.critdmg': ['暴击伤害', 'Crit Damage'],
  'up.worker': ['雇佣工人', 'Hire Workers'],
  'up.factory': ['建造工厂', 'Build Factory'],
  'up.synergy': ['工厂协同', 'Factory Synergy'],
  'up.bank': ['建立银行', 'Found Bank'],
  'up.ai': ['AI助手', 'AI Assistant'],
  'up.click.d': ['+1/点击', '+1 / click'],
  'up.crit.d': ['+2%暴击率', '+2% crit chance'],
  'up.critdmg.d': ['+0.5x暴伤', '+0.5x crit dmg'],
  'up.worker.d': ['+1/秒', '+1 / sec'],
  'up.factory.d': ['+10/秒', '+10 / sec'],
  'up.synergy.d': ['+10%协同', '+10% synergy'],
  'up.bank.d': ['+100/秒', '+100 / sec'],
  'up.ai.d': ['+1K/秒', '+1K / sec'],

  /* ---------- 技能 ---------- */
  'sk.eff': ['高效点击', 'Efficient Click'],
  'sk.eff.d': ['点击+25%', '+25% click'],
  'sk.luk': ['幸运之手', 'Lucky Hand'],
  'sk.luk.d': ['暴击率+5%', '+5% crit chance'],
  'sk.pow': ['力量爆发', 'Power Surge'],
  'sk.pow.d': ['暴伤+1x', '+1x crit dmg'],
  'sk.au1': ['自动点击I', 'Auto Click I'],
  'sk.au1.d': ['每秒自动1次', '1 auto click / sec'],
  'sk.au2': ['自动点击II', 'Auto Click II'],
  'sk.au2.d': ['每秒+2', '+2 / sec'],
  'sk.idl': ['挂机大师', 'Idle Master'],
  'sk.idl.d': ['离线+25%', '+25% offline'],
  'sk.gld': ['黄金触感', 'Golden Touch'],
  'sk.gld.d': ['全局+10%', '+10% global'],
  'sk.gld2': ['点石成金', 'Midas Touch'],
  'sk.gld2.d': ['全局+20%', '+20% global'],
  'sk.evt': ['事件延长', 'Event Extender'],
  'sk.evt.d': ['事件+50%', '+50% events'],
  'sk.cmb': ['连击大师', 'Combo Master'],
  'sk.cmb.d': ['连击×2', 'Combo x2'],

  /* ---------- 宠物 ---------- */
  'pet.cat': ['矿猫', 'Mine Cat'],
  'pet.cat.d': ['每秒+10%', '+10% / sec'],
  'pet.dog': ['寻宝犬', 'Treasure Hound'],
  'pet.dog.d': ['点击+15%', '+15% click'],
  'pet.dragon': ['小龙', 'Baby Dragon'],
  'pet.dragon.d': ['全局+20%', '+20% global'],
  'pet.phoenix': ['凤凰', 'Phoenix'],
  'pet.phoenix.d': ['暴击率+10%', '+10% crit chance'],
  'pet.unicorn': ['独角兽', 'Unicorn'],
  'pet.unicorn.d': ['全属性+15%', '+15% all stats'],

  /* ---------- 研究 ---------- */
  'rs.r1': ['采矿效率I', 'Mining Efficiency I'],
  'rs.r1.d': ['每秒+20%', '+20% / sec'],
  'rs.r2': ['暴击研究I', 'Crit Research I'],
  'rs.r2.d': ['暴击率+5%', '+5% crit chance'],
  'rs.r3': ['点击强化I', 'Click Boost I'],
  'rs.r3.d': ['点击+25%', '+25% click'],
  'rs.r4': ['采矿效率II', 'Mining Efficiency II'],
  'rs.r4.d': ['每秒+40%', '+40% / sec'],
  'rs.r5': ['暴击研究II', 'Crit Research II'],
  'rs.r5.d': ['暴伤+1x', '+1x crit dmg'],
  'rs.r6': ['材料学', 'Material Science'],
  'rs.r6.d': ['Boss材料+1', '+1 Boss material'],
  'rs.r7': ['宠物训练', 'Pet Training'],
  'rs.r7.d': ['宠物效果×2', 'Pet effects x2'],
  'rs.r8': ['离线优化', 'Offline Tuning'],
  'rs.r8.d': ['离线+50%', '+50% offline'],
  'rs.r9': ['全局增幅', 'Global Boost'],
  'rs.r9.d': ['全局+30%', '+30% global'],
  'rs.r10': ['转生精通', 'Prestige Mastery'],
  'rs.r10.d': ['转生点+50%', '+50% prestige points'],

  /* ---------- 成就 ---------- */
  'ac.1': ['初次点击', 'First Click'],
  'ac.1.d': ['点击1次', 'Click once'],
  'ac.2': ['点击达人', 'Click Expert'],
  'ac.2.d': ['点击500次', 'Click 500 times'],
  'ac.3': ['点击大师', 'Click Master'],
  'ac.3.d': ['点击5K次', 'Click 5K times'],
  'ac.4': ['小有积蓄', 'Small Savings'],
  'ac.4.d': ['累计1K', 'Earn 1K total'],
  'ac.5': ['百万富翁', 'Millionaire'],
  'ac.5.d': ['累计1M', 'Earn 1M total'],
  'ac.6': ['暴击初现', 'First Crit'],
  'ac.6.d': ['暴击10次', 'Crit 10 times'],
  'ac.7': ['暴击专家', 'Crit Expert'],
  'ac.7.d': ['暴击100次', 'Crit 100 times'],
  'ac.8': ['初次胜利', 'First Victory'],
  'ac.8.d': ['击败1Boss', 'Defeat 1 Boss'],
  'ac.9': ['Boss猎人', 'Boss Hunter'],
  'ac.9.d': ['击败10Boss', 'Defeat 10 Bosses'],
  'ac.10': ['转生者', 'Prestige One'],
  'ac.10.d': ['转生1次', 'Prestige once'],

  /* ---------- 日常任务 ---------- */
  'dt.1': ['日常点击', 'Daily Clicks'],
  'dt.1.d': ['点击200次', 'Click 200 times'],
  'dt.2': ['日常收益', 'Daily Earnings'],
  'dt.2.d': ['赚取5K金币', 'Earn 5K coins'],
  'dt.3': ['日常Boss', 'Daily Boss'],
  'dt.3.d': ['攻击Boss10次', 'Attack the Boss 10 times'],
  'dt.4': ['日常祈愿', 'Daily Gacha'],
  'dt.4.d': ['祈愿1次', 'Pull the gacha once'],
  'dt.5': ['日常远征', 'Daily Expedition'],
  'dt.5.d': ['完成1次远征', 'Complete 1 expedition'],

  /* ---------- 时间挑战 ---------- */
  'tc.1': ['极速点击', 'Speed Clicking'],
  'tc.1.d': ['在30秒内点击100次', 'Click 100 times in 30s'],
  'tc.2': ['财富冲刺', 'Wealth Rush'],
  'tc.2.d': ['在60秒内赚取100K金币', 'Earn 100K coins in 60s'],
  'tc.3': ['暴击风暴', 'Crit Storm'],
  'tc.3.d': ['在45秒内触发20次暴击', 'Trigger 20 crits in 45s'],
  'tc.4': ['Boss猎杀', 'Boss Hunt'],
  'tc.4.d': ['在90秒内击败Boss', 'Defeat the Boss in 90s'],

  /* ---------- 祈愿物品 / 稀有度 ---------- */
  'gi.sr_gold': ['黄金圣杯', 'Golden Chalice'],
  'gi.sr_diamond': ['钻石之心', 'Diamond Heart'],
  'gi.sr_crown': ['王者之冠', "King's Crown"],
  'gi.r_sword': ['精钢剑', 'Fine Steel Sword'],
  'gi.r_shield': ['铁盾', 'Iron Shield'],
  'gi.r_ring': ['银戒指', 'Silver Ring'],
  'gi.uc_potion': ['金币药水', 'Coin Potion'],
  'gi.uc_scroll': ['经验卷轴', 'Scroll of Experience'],
  'gi.c_coin': ['金币袋', 'Coin Pouch'],
  'gi.c_iron': ['铁矿石', 'Iron Ore'],
  'rarity.common': ['普通', 'Common'],
  'rarity.uncommon': ['优秀', 'Uncommon'],
  'rarity.rare': ['稀有', 'Rare'],
  'rarity.epic': ['史诗', 'Epic'],
  'rarity.legendary': ['传说', 'Legendary'],

  /* ---------- 材料 / 通用名词 ---------- */
  'mat.iron': ['铁矿', 'Iron Ore'],
  'mat.crystal': ['水晶', 'Crystal'],
  'mat.dragonScale': ['龙鳞', 'Dragon Scale'],
  'mat.ancientGem': ['古宝石', 'Ancient Gem'],
  'mat.ticket': ['祈愿券', 'Gacha Ticket'],
  'slot.weapon': ['武器', 'Weapon'],
  'slot.armor': ['护甲', 'Armor'],
  'slot.ring': ['戒指', 'Ring'],
  'slot.empty': ['空', 'Empty'],
  'slot.item': ['物品', 'Item'],
  'name.abyss': ['深渊', 'Abyss'],

  /* ---------- 远征 ---------- */
  'exp.1': ['铁矿远征', 'Iron Ore Expedition'],
  'exp.1.d': ['派遣工人采集铁矿', 'Send workers to gather iron ore'],
  'exp.2': ['水晶探索', 'Crystal Survey'],
  'exp.2.d': ['深入洞穴寻找水晶', 'Venture into caves for crystals'],
  'exp.3': ['龙巢冒险', 'Dragon Lair Venture'],
  'exp.3.d': ['挑战龙巢获取龙鳞', 'Challenge the lair for dragon scales'],
  'exp.4': ['遗迹发掘', 'Ruins Excavation'],
  'exp.4.d': ['探索远古遗迹', 'Explore the ancient ruins'],

  /* ---------- 提示 / 通知 ---------- */
  'n.coins': ['金币不足！', 'Not enough coins!'],
  'n.iron': ['铁矿不足！', 'Not enough iron ore!'],
  'n.prestige': ['转生点不足！', 'Not enough prestige points!'],
  'n.resources': ['资源不足！', 'Not enough resources!'],
  'n.autoOn': ['自动购买已开启', 'Auto-buy enabled'],
  'n.autoOff': ['自动购买已关闭', 'Auto-buy disabled'],
  'n.saved': ['游戏已保存！', 'Game saved!'],
  'n.copied': ['存档已复制到剪贴板！', 'Save copied to clipboard!'],
  'n.importOk': ['存档导入成功！即将刷新...', 'Save imported. Reloading...'],
  'n.importFail': ['存档导入失败！', 'Import failed!'],
  'n.equipOk': ['装备成功！', 'Equipped!'],
  'n.enhanceFail': ['强化失败...', 'Enhance failed...'],
  'n.unequipped': ['已卸下装备', 'Unequipped'],
  'n.expSent': ['远征已派遣！', 'Expedition dispatched!'],
  'n.expClaimed': ['远征奖励已领取！', 'Expedition reward claimed!'],
  'n.wbossDown': ['🎉 世界Boss已被击败！奖励已发放。', '🎉 World Boss defeated! Rewards granted.'],
  'n.bossDown': ['🎉 Boss被击败！奖励已发放！', '🎉 Boss defeated! Rewards granted!'],
  'n.soundOn': ['音效已开启', 'Sound on'],
  'n.soundOff': ['音效已关闭', 'Sound off'],
  'n.crit': ['暴击!', 'CRIT!'],
  'n.achUnlocked': ['🏆 成就解锁', '🏆 Achievement Unlocked'],

  /* ---------- 界面文字 ---------- */
  'ui.autoBuy': ['自动购买', 'Auto-buy'],
  'ui.on': ['开', 'ON'],
  'ui.off': ['关', 'OFF'],
  'ui.max': ['最大', 'Max'],
  'ui.buy': ['购买', 'Buy'],
  'ui.learn': ['学习', 'Learn'],
  'ui.learned': ['✓ 已学', '✓ Learned'],
  'ui.equippedTitle': ['已装备', 'Equipped'],
  'ui.bag': ['背包', 'Bag'],
  'ui.bagEmpty': ['背包空空如也，去祈愿获取装备吧！', 'Your bag is empty — head to the Gacha!'],
  'ui.enhance': ['强化', 'Enhance'],
  'ui.unequip': ['卸下', 'Unequip'],
  'ui.equip': ['装备', 'Equip'],
  'ui.deploy': ['出战', 'Deploy'],
  'ui.done': ['✓ 完成', '✓ Done'],
  'ui.research': ['研究', 'Research'],
  'ui.gachaLog': ['祈愿记录', 'Gacha History'],
  'ui.gachaHint': ['点击按钮开始祈愿', 'Tap a button to start pulling'],
  'ui.expTitle': ['派遣远征', 'Send Expedition'],
  'ui.claim': ['领取', 'Claim'],
  'ui.send': ['派遣', 'Send'],
  'ui.colProgress': ['收藏进度', 'Collection Progress'],
  'ui.petCol': ['🐾 宠物收集', '🐾 Pets'],
  'ui.eqSlots': ['⚔️ 装备栏位', '⚔️ Gear Slots'],
  'ui.stats': ['📊 统计数据', '📊 Stats'],
  'ui.playTime': ['⏱ 游戏时长', '⏱ Play Time'],
  'ui.materials': ['材料仓库', 'Materials'],
  'ui.settings': ['⚙️ 设置', '⚙️ Settings'],
  'ui.sound': ['🔊 音效', '🔊 Sound'],
  'ui.compact': ['🎨 紧凑模式', '🎨 Compact Mode'],
  'ui.recommend': ['💡 推荐升级', '💡 Recommended Upgrades'],
  'ui.saveGame': ['💾 保存游戏', '💾 Save Game'],
  'ui.exportSave': ['📤 导出存档', '📤 Export Save'],
  'ui.importSave': ['📥 导入存档', '📥 Import Save'],
  'ui.resetGame': ['🗑️ 重置游戏', '🗑️ Reset Game'],
  'ui.close': ['关闭', 'Close'],
  'ui.cancel': ['取消', 'Cancel'],
  'ui.prestigeTitle': ['🔄 转生', '🔄 Prestige'],
  'ui.prestigeNote': ['转生将重置金币和升级，但保留：', 'Prestige resets coins and upgrades, but keeps:'],
  'ui.prestigeKeep.skills': ['技能（已学习的）', 'Skills (learned)'],
  'ui.rebirthTitle': ['✨ 重生', '✨ Rebirth'],
  'ui.rebirthNote': ['重生将重置大部分进度，但获得永久加成。', 'Rebirth resets most progress but grants permanent bonuses.'],
  'ui.rebirthBtn': ['✨ 重生', '✨ Rebirth'],
  'ui.condNotMet': ['条件不足', 'Requirements not met'],
  'ui.themeGold': ['金', 'Gold'],
  'ui.themeBlue': ['蓝', 'Blue'],
  'ui.themePurple': ['紫', 'Purple'],
  'ui.themeGreen': ['绿', 'Green'],

  /* ---------- 浏览器原生弹窗 ---------- */
  'prompt.export': ['复制以下存档代码：', 'Copy this save code:'],
  'prompt.import': ['粘贴存档代码：', 'Paste your save code:'],
  'confirm.reset': ['⚠️ 确定重置？所有进度将丢失！', '⚠️ Reset everything? All progress will be lost!'],

  /* ---------- 错误信息 ---------- */
  'err.unknown': ['发生错误，请刷新页面重试', 'Something went wrong. Please refresh the page.'],
  'err.generic': ['发生未知错误', 'An unknown error occurred'],
  'err.invalidArg': ['无效的参数', 'Invalid argument'],
  'err.notFound': ['资源未找到', 'Resource not found'],
  'err.noCoins': ['金币不足', 'Not enough coins'],
  'err.noMaterials': ['材料不足', 'Not enough materials'],
  'err.noGems': ['宝石不足', 'Not enough gems'],
  'err.noUpgrade': ['升级项不存在', 'Upgrade not found'],
  'err.noEquipment': ['装备不存在', 'Equipment not found'],
  'err.noPet': ['宠物不存在', 'Pet not found'],
  'err.badState': ['游戏状态无效', 'Invalid game state'],
  'err.saveFail': ['保存失败', 'Save failed'],
  'err.loadFail': ['加载失败', 'Load failed'],
  'err.locked': ['功能未解锁', 'Feature locked'],
  'err.lowLevel': ['等级不足', 'Level too low'],
  'err.chapterIncomplete': ['章节未完成', 'Chapter not completed'],
  'err.cooldown': ['技能冷却中', 'Skill on cooldown'],
  'err.challengeActive': ['挑战进行中', 'Challenge in progress'],
  'err.petOwned': ['宠物已拥有', 'Pet already owned'],
  'err.petMissing': ['宠物不存在或未拥有', 'Pet not found or not owned'],
  'err.abyssActive': ['深渊挑战进行中', 'Abyss challenge in progress'],
  'err.abyssCooldown': ['深渊冷却中', 'Abyss on cooldown'],
  'err.abyssNone': ['没有进行中的深渊挑战', 'No abyss challenge in progress'],

  /* ---------- 带变量的模板 ---------- */
  'tpl.maxBuy': ['可买{n}次', 'Buy {n}'],
  'tpl.synergy': ['{n}%协同', '{n}% synergy'],
  'tpl.effect': ['效果 {n}', 'Effect {n}'],
  'tpl.skillCost': ['消耗: {n} 转生点', 'Cost: {n} prestige'],
  'tpl.skillLearned': ['学会技能: {name}', 'Skill learned: {name}'],
  'tpl.prestigePts': ['转生点: {n}', 'Prestige: {n}'],
  'tpl.bonus': ['加成: {n}', 'Bonus: {n}'],
  'tpl.enhanceOk': ['强化成功！Lv.{n}', 'Enhance success! Lv.{n}'],
  'tpl.petBought': ['获得宠物: {name}！', 'Pet unlocked: {name}!'],
  'tpl.petDeployed': ['{name} 已出战！', '{name} deployed!'],
  'tpl.petUpgraded': ['{name} 升级成功！', '{name} upgraded!'],
  'tpl.petUpgrade': ['升级 💰{n}', 'Upgrade 💰{n}'],
  'tpl.researchCost': ['消耗: 🪨 {n} 铁矿', 'Cost: 🪨 {n} iron ore'],
  'tpl.researchDone': ['研究完成: {name}', 'Research complete: {name}'],
  'tpl.gachaTix': ['祈愿券: {n}', 'Tickets: {n}'],
  'tpl.gachaSingle': ['单抽 💰{n}', 'Single 💰{n}'],
  'tpl.gachaTen': ['十连 💰{n}', 'Ten-pull 💰{n}'],
  'tpl.pity': ['R保底: {a}/{b}', 'R pity: {a}/{b}'],
  'tpl.rewards': ['奖励: {list}', 'Rewards: {list}'],
  'tpl.expRunning': ['进行中...', 'In progress...'],
  'tpl.expRemaining': ['剩余: {t}', 'Remaining: {t}'],
  'tpl.wbossAtk': ['⚔️ 攻击 (使用点击力)', '⚔️ Attack (uses Click Power)'],
  'tpl.wbossContrib': ['你的贡献伤害: {n}', 'Your damage: {n}'],
  'tpl.wbossKill': ['世界Boss击败！获得 💰{n} + 龙鳞×5 + 祈愿券×2', 'World Boss down! +💰{n}, Dragon Scale x5, Ticket x2'],
  'tpl.clicks': ['点击: {n}', 'Clicks: {n}'],
  'tpl.gems': ['💎 宝石: {n}', '💎 Gems: {n}'],
  'tpl.tickets': ['🎫 祈愿券: {n}', '🎫 Tickets: {n}'],
  'tpl.prestigeTotal': ['累计收入: {n} / {t}', 'Lifetime earnings: {n} / {t}'],
  'tpl.prestigeGain': ['可获得: {n} 转生点', 'You gain: {n} prestige'],
  'tpl.prestigeBtn': ['🔄 转生 (获得{n}点)', '🔄 Prestige (+{n})'],
  'tpl.rebirthNeed': ['需要: {n}次转生', 'Requires: {n} prestiges'],
  'tpl.rebirthCur': ['当前: {n}次', 'Current: {n}'],
  'tpl.rebirthEff': ['效果: 全局倍率 +{n}0%', 'Effect: global multiplier +{n}0%'],
  'tpl.rebirthBtn': ['需要{n}次转生', 'Requires {n} prestiges'],
  'tpl.chapterDone': ['🎉 章节「{name}」完成！', '🎉 Chapter "{name}" complete!'],
  'tpl.levelUp': ['升级！达到 Lv.{n}', 'Level up! Now Lv.{n}'],
  'tpl.themeSwitch': ['主题切换: {name}', 'Theme: {name}'],
  'tpl.offline': ['离线收益: +{n} 金币 ({t})', 'Offline earnings: +{n} coins ({t})'],
  'tpl.prestigeOk': ['转生成功！获得 {n} 转生点', 'Prestige complete! +{n} prestige points'],
  'tpl.rebirthOk': ['重生成功！全局倍率 ×{n}', 'Rebirth complete! Global multiplier ×{n}'],
  'tpl.timeH': ['{h}小时{m}分钟', '{h}h {m}m'],
  'tpl.timeM': ['{m}分{s}秒', '{m}m {s}s'],
  'tpl.timeS': ['{s}秒', '{s}s'],
  'tpl.needLevel': ['需要等级{n}', 'Requires level {n}'],
  'tpl.rebirthTimes': ['{n}次重生', '{n} rebirths'],
};

let lang = 'zh';
try {
  lang = localStorage.getItem('jiedim.lang') === 'en' ? 'en' : 'zh';
} catch (e) { /* 非浏览器环境 */ }

function pick(zh, en) {
  return lang === 'en' ? en : zh;
}

export function t(key, vars) {
  const entry = Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : null;
  if (!entry) return key;
  let out = pick(entry[0], entry[1]);
  if (vars) {
    for (const name in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, name)) {
        out = out.split('{' + name + '}').join(vars[name]);
      }
    }
  }
  return out;
}

/* 中文原文 → 英文，用于配置表与存档里的固定名词 */
const REVERSE = {};
for (const key in DICT) {
  if (!Object.prototype.hasOwnProperty.call(DICT, key)) continue;
  const zh = DICT[key][0];
  if (zh.indexOf('{') !== -1 || zh.length < 2) continue;
  REVERSE[zh] = DICT[key][1];
}

export function tr(text) {
  if (lang !== 'en' || typeof text !== 'string') return text;
  return Object.prototype.hasOwnProperty.call(REVERSE, text) ? REVERSE[text] : text;
}

export function applyStatic(root) {
  const scope = root || document;
  const nodes = scope.querySelectorAll('[data-i18n]');
  for (let i = 0; i < nodes.length; i++) {
    const entry = DICT[nodes[i].getAttribute('data-i18n')];
    if (entry) nodes[i].textContent = pick(entry[0], entry[1]);
  }
  const attrNodes = scope.querySelectorAll('[data-i18n-attr]');
  for (let j = 0; j < attrNodes.length; j++) {
    const pairs = attrNodes[j].getAttribute('data-i18n-attr').split(',');
    for (let k = 0; k < pairs.length; k++) {
      const bits = pairs[k].split(':');
      const attr = bits[0].trim();
      const entry = DICT[(bits[1] || '').trim()];
      if (attr && entry) attrNodes[j].setAttribute(attr, pick(entry[0], entry[1]));
    }
  }
  const title = document.querySelector('title[data-i18n]');
  if (title) document.title = title.textContent;
}

export const i18nLang = lang;

if (typeof document !== 'undefined') {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
}
