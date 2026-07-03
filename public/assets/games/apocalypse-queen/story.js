// 延迟引用 GameState（因为 GameState 定义在 game.js 中）
let _GS = () => window.GameState;

/**
 * 末世重生：囤货女王 - 完整剧情数据
 * 第一幕（Ep 1-20） + 第二幕（Ep 21-45） + 第三幕（Ep 46-60）
 */

// ==================== 第一幕：重生囤货·复仇篇 ====================
const Scenes_Act1 = {

    // ==================== 序章：重生觉醒 ====================
    prologue: {
        id: 'prologue',
        number: '序章',
        title: '死亡与重生',
        atmosphere: '黑暗中刺骨的寒意，逐渐被温暖取代',
        content: `
            <p>你死了。末世第七天，<span class="danger-text">零下四十度</span>的寒风中，你蜷缩在废弃商场的角落。</p>
            <p>曾经最信任的两个人——闺蜜<span class="danger-text">苏可欣</span>和男友<span class="danger-text">陈墨</span>——抢走了你最后的半瓶水和棉被。</p>
            <div class="memory-box">
                <div class="memory-text">"念晚，别怪我们，谁让你什么都舍不得用呢？"苏可欣笑着踩在你冻僵的手上，陈墨搂着她的腰，头也不回地走了。</div>
            </div>
            <p>意识消散的最后一刻，你发誓——如果能重来，绝不再做任人宰割的羔羊。</p>
            <p>猛然睁眼，温暖的光线涌入。手机屏幕显示：<span class="highlight">2024年12月1日，距离末世还有30天。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">我……回来了？</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'check_storage',
                label: '觉醒',
                text: '检查脑海中的神秘空间',
                nextScene: 'check_storage',
                effect: () => {
                    _GS().flags.reborn = true;
                    _GS().episode = 1;
                }
            },
            {
                id: 'memory_revenge',
                label: '回忆',
                text: '回忆前世末世的每一个细节',
                nextScene: 'memory_revenge',
                effect: () => {
                    _GS().flags.reborn = true;
                    _GS().episode = 1;
                    _GS().stats.intelligence += 1;
                }
            }
        ]
    },

    // ==================== 第1集 ====================
    check_storage: {
        id: 'check_storage',
        number: '第1集',
        title: '空间觉醒',
        atmosphere: '卧室里，阳光透过窗帘洒落，一切如常',
        content: `
            <p>你闭上眼，意念沉入脑海深处。一个<span class="highlight">100立方米的巨大空间</span>出现在意识中——空旷、静止、时间仿佛在这里凝固。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">前世我到死都不知道自己有这个能力……这一次，它就是我的底牌。</div>
                </div>
            </div>
            <p>你试着将床头柜上的一瓶矿泉水收入空间——意念一动，水瓶凭空消失，再一想，又回到手中。<span class="highlight">意念存取，随心所欲。</span></p>
            <p>手机震动，是苏可欣发来的消息："念念~周末一起逛街呀？新开了一家超好吃的甜品店！"</p>
            <div class="memory-box">
                <div class="memory-text">前世这条消息的下一幕，是苏可欣"不小心"把你推到了陈墨怀里——那是她精心策划的"偶遇"。</div>
            </div>
        `,
        choices: [
            {
                id: 'check_money',
                label: '规划',
                text: '清点全部资产，制定囤货计划',
                nextScene: 'check_money',
                effect: () => {
                    _GS().flags.storageUnlocked = true;
                    _GS().goldenFinger.level = 1;
                }
            },
            {
                id: 'fake_friend',
                label: '伪装',
                text: '回复苏可欣，维持表面关系',
                nextScene: 'fake_friend',
                effect: () => {
                    _GS().flags.storageUnlocked = true;
                    _GS().goldenFinger.level = 1;
                    _GS().relationships.suKexin += 10;
                    _GS().stats.charisma += 1;
                }
            }
        ]
    },

    // ==================== 隐藏场景：伪装闺蜜 ====================
    fake_friend: {
        id: 'fake_friend',
        number: '第1集·支线',
        title: '笑面虎',
        atmosphere: '手机屏幕的冷光映在脸上',
        content: `
            <p>你面无表情地打字："好呀~到时候叫上陈墨一起！"前世你不会这样主动，但这一次，<span class="highlight">你要让猎物自己走进陷阱。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">苏可欣，上辈子你抢我男友、夺我物资、踩着我活。这辈子……我会让你连求饶的机会都没有。</div>
                </div>
            </div>
            <p>苏可欣秒回一个开心的表情包。你放下手机，眼神冰冷。<span class="danger-text">30天，足够了。</span></p>
        `,
        choices: [
            {
                id: 'check_money',
                label: '行动',
                text: '清点资产，开始囤货倒计时',
                nextScene: 'check_money',
                effect: () => {
                    _GS().daysLeft = 29;
                }
            }
        ]
    },

    // ==================== 第2集 ====================
    check_money: {
        id: 'check_money',
        number: '第2集',
        title: '清点家底',
        atmosphere: '银行APP的余额页面，数字冰冷而真实',
        content: `
            <p>你打开所有银行账户：<span class="highlight">存款32万，理财15万，信用卡额度3万。</span>加上手里这套小公寓的市价，总资产约120万。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">120万……前世我攒了三年都没花出去，因为末世来得太快。这一次，每一分钱都要变成活下去的筹码。</div>
                </div>
            </div>
            <p>你迅速在脑海中列出优先级：食物和水是第一位的，其次是药品和御寒物资，然后是武器和工具。</p>
            <p>但有一个问题——<span class="danger-text">30天内大量采购必然引起注意</span>，尤其是苏可欣和陈墨就住在隔壁小区。</p>
            `,
        choices: [
            {
                id: 'plan_shopping',
                label: '分散采购',
                text: '制定多城市分散采购计划',
                nextScene: 'plan_shopping',
                effect: () => {
                    _GS().daysLeft = 28;
                    _GS().stats.intelligence += 1;
                }
            },
            {
                id: 'wholesale_route',
                label: '批发渠道',
                text: '直接联系批发商，大宗采购',
                nextScene: 'wholesale_route',
                effect: () => {
                    _GS().daysLeft = 28;
                    _GS().money -= 5000;
                    _GS().inventory.food.amount += 200;
                    _GS().inventory.water.amount += 100;
                }
            }
        ]
    },

    // ==================== 支线：批发渠道 ====================
    wholesale_route: {
        id: 'wholesale_route',
        number: '第2集·支线',
        title: '批发扫货',
        atmosphere: '城郊批发市场，人声鼎沸',
        content: `
            <p>你驱车来到城郊最大的食品批发市场。前世你从未来过这里，但网上查到的地址和前世记忆完美吻合。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">批发商老王</div>
                    <div class="dialogue-text">姑娘，你要这么多压缩饼干和罐头？开餐饮店的？</div>
                </div>
            </div>
            <p>你面不改色："对，公司团建用品。"当场下单<span class="highlight">500斤压缩饼干、300斤罐头、200升桶装水</span>，总计花费8000元。</p>
            <p>趁老王去仓库备货的间隙，你将已到手的货物<span class="highlight">全部收入储物空间</span>。等老王回来，你手里只剩一个小袋子。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">批发商老王</div>
                    <div class="dialogue-text">哎？姑娘，我刚才搬出来的货呢？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">哦，我朋友已经来拉走了。麻烦您送到这个地址就行。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'plan_shopping',
                label: '继续',
                text: '制定更详细的采购计划',
                nextScene: 'plan_shopping',
                effect: () => {
                    _GS().daysLeft = 27;
                }
            }
        ]
    },

    // ==================== 第3集 ====================
    memory_revenge: {
        id: 'memory_revenge',
        number: '第3集',
        title: '前世记忆',
        atmosphere: '深夜，独坐窗前，月光如霜',
        content: `
            <p>你强迫自己回忆前世末世的每一个细节。<span class="danger-text">这些记忆就是活下去的情报。</span></p>
            <div class="memory-box">
                <div class="memory-text">第1天：气温骤降至零下15度，全城停电。第3天：超市被抢空，有人为了一瓶水大打出手。第5天：第一波地震，老旧楼房倒塌过半。第7天：你死了。</div>
            </div>
            <p>但记忆中还有一些模糊的画面——末世第10天左右，似乎有<span class="highlight">军用直升机</span>飞过城市上空。第15天，你隐约听到收音机里提到"新秩序"三个字。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">"新秩序"……前世我到死都没搞清楚这三个字意味着什么。这一次，我要查清楚。</div>
                </div>
            </div>
            <p>你打开手机备忘录，开始记录前世的时间线。每一条都是血泪换来的情报。</p>
        `,
        choices: [
            {
                id: 'plan_shopping',
                label: '行动',
                text: '带着前世情报制定囤货计划',
                nextScene: 'plan_shopping',
                effect: () => {
                    _GS().daysLeft = 27;
                    _GS().flags.bossHintFound = true;
                    _GS().stats.intelligence += 2;
                }
            },
            {
                id: 'investigate_clue',
                label: '调查',
                text: '搜索"新秩序"相关信息',
                nextScene: 'investigate_clue',
                effect: () => {
                    _GS().daysLeft = 27;
                    _GS().flags.bossHintFound = true;
                    _GS().relationships.mysteriousMan += 10;
                    _GS().stats.intelligence += 1;
                }
            }
        ]
    },

    // ==================== 隐藏路线入口：调查线索 ====================
    investigate_clue: {
        id: 'investigate_clue',
        number: '第3集·隐藏',
        title: '暗流涌动',
        atmosphere: '深夜的网络搜索，屏幕蓝光闪烁',
        content: `
            <p>你搜索"新秩序"三个字，结果出人意料——网上竟然真的有一个同名组织，但信息极少，只有一个加密论坛的入口链接。</p>
            <p>你用前世无意中记下的一个密码尝试登录，竟然成功了。论坛里有一条置顶帖子：</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">匿名用户</div>
                    <div class="dialogue-text">"大清洗倒计时30天。准备好你的人，准备好你的物资。旧世界即将终结。"</div>
                </div>
            </div>
            <p>发帖时间——<span class="danger-text">正是你重生后的第一天。</span>这意味着有人比你更早知道末世要来。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">不是天灾那么简单……有人制造了这一切？不管怎样，先活下去再说。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'plan_shopping',
                label: '隐藏',
                text: '记住这个论坛，先专注囤货',
                nextScene: 'plan_shopping',
                effect: () => {
                    _GS().flags.hiddenRoute = true;
                    _GS().currentRoute = 'hidden';
                    _GS().daysLeft = 26;
                }
            }
        ]
    },

    // ==================== 第4集 ====================
    plan_shopping: {
        id: 'plan_shopping',
        number: '第4集',
        title: '囤货计划',
        atmosphere: '客厅地板上铺满了手写的采购清单',
        content: `
            <p>你花了一整夜制定详细的采购计划，按优先级分为四个阶段：</p>
            <p><span class="highlight">第一阶段（Day 1-10）：</span>食物、水、基础药品——生存底线。</p>
            <p><span class="highlight">第二阶段（Day 11-20）：</span>御寒衣物、燃料、发电机——对抗极寒。</p>
            <p><span class="highlight">第三阶段（Day 21-25）：</span>武器、工具、种子——长期生存。</p>
            <p><span class="highlight">第四阶段（Day 26-30）：</span>安全屋加固、父母安置——最后准备。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">50万预算，30天时间。每一分钱、每一分钟都不能浪费。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'buy_food',
                label: '采购',
                text: '立即出发，开始第一阶段采购',
                nextScene: 'buy_food',
                effect: () => {
                    _GS().daysLeft = 25;
                }
            },
            {
                id: 'extreme_mode',
                label: '极端囤货',
                text: '启动极端模式：卖房囤货',
                nextScene: 'extreme_mode',
                effect: () => {
                    _GS().daysLeft = 25;
                    _GS().flags.extremeStockpile = true;
                }
            }
        ]
    },

    // ==================== 支线：极端囤货模式 ====================
    extreme_mode: {
        id: 'extreme_mode',
        number: '第4集·支线',
        title: '破釜沉舟',
        atmosphere: '房产中介的办公室，签名的笔尖在纸上划过',
        content: `
            <p>你做了一个疯狂的决定——<span class="highlight">卖掉现在的公寓。</span>这套房子位于老旧小区，末世地震中必然倒塌。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">房产中介</div>
                    <div class="dialogue-text">林小姐，您确定要急售？这个价格比市场价低了不少……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">30天内能过户就行，价格好商量。现金越多越好。</div>
                </div>
            </div>
            <p>最终以<span class="highlight">85万</span>成交，加上原有存款，你的总资金飙升至<span class="highlight">137万</span>。代价是——你暂时没有住处了。</p>
        `,
        choices: [
            {
                id: 'buy_food',
                label: '囤货',
                text: '资金充足，全力采购',
                nextScene: 'buy_food',
                effect: () => {
                    _GS().money = 1370000;
                    _GS().daysLeft = 24;
                }
            }
        ]
    },

    // ==================== 第5集（爽点1：空间碾压式囤货） ====================
    buy_food: {
        id: 'buy_food',
        number: '第5集',
        title: '疯狂扫货',
        atmosphere: '超市里人潮涌动，购物车堆成小山',
        content: `
            <p>你推着三辆购物车走进大型超市，按照清单开始扫货。<span class="highlight">压缩饼干、午餐肉罐头、方便面、脱水蔬菜、大米、面粉……</span></p>
            <p>收银台前，店员目瞪口呆地看着你堆成山的商品。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">收银员</div>
                    <div class="dialogue-text">姐，您这是……开超市啊？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">公司采购，年底福利。帮我送到门口就行。</div>
                </div>
            </div>
            <p>出了超市门，你确认四周无人，意念一动——<span class="highlight">三车货物瞬间消失，全部收入储物空间。</span>推着空车回去还的时候，收银员的表情精彩极了。</p>
            <p>第一天战绩：<span class="highlight">食物储备+500人日份，花费12000元。</span>这只是开始。</p>
        `,
        choices: [
            {
                id: 'buy_water',
                label: '继续',
                text: '前往水站采购饮用水',
                nextScene: 'buy_water',
                effect: () => {
                    _GS().money -= 12000;
                    _GS().inventory.food.amount += 500;
                    _GS().goldenFinger.storageUsed += 15;
                    _GS().daysLeft = 23;
                }
            },
            {
                id: 'buy_medicine',
                label: '跳过',
                text: '食物够了，直接去买药品',
                nextScene: 'buy_medicine',
                effect: () => {
                    _GS().money -= 12000;
                    _GS().inventory.food.amount += 500;
                    _GS().goldenFinger.storageUsed += 15;
                    _GS().daysLeft = 23;
                }
            }
        ]
    },

    // ==================== 第6集 ====================
    buy_water: {
        id: 'buy_water',
        number: '第6集',
        title: '水源储备',
        atmosphere: '饮用水配送中心，叉车来往穿梭',
        content: `
            <p>你来到城郊的饮用水配送中心，直接找到经理谈大宗采购。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">水站经理</div>
                    <div class="dialogue-text">2000升桶装水？您是哪个单位的？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">应急物资储备，公司项目。能开票就行。</div>
                </div>
            </div>
            <p>你支付了<span class="highlight">6000元</span>订金，约定三天内分批送到指定仓库。当然，这个"仓库"只存在于你的脑子里。</p>
            <p>离开水站后，你又顺路去了两家大型超市，用同样的手法扫了<span class="highlight">300升瓶装水和大量净水片</span>。</p>
            <p>储物空间目前使用率：<span class="highlight">22%</span>。空间还很大，但钱在飞速减少。</p>
        `,
        choices: [
            {
                id: 'buy_medicine',
                label: '药品',
                text: '前往药店采购医疗物资',
                nextScene: 'buy_medicine',
                effect: () => {
                    _GS().money -= 6000;
                    _GS().inventory.water.amount += 2300;
                    _GS().goldenFinger.storageUsed += 8;
                    _GS().daysLeft = 22;
                }
            },
            {
                id: 'secure_location',
                label: '安全屋',
                text: '先找安全屋，再继续采购',
                nextScene: 'secure_location',
                effect: () => {
                    _GS().money -= 6000;
                    _GS().inventory.water.amount += 2300;
                    _GS().goldenFinger.storageUsed += 8;
                    _GS().daysLeft = 22;
                }
            }
        ]
    },

    // ==================== 第7集 ====================
    buy_medicine: {
        id: 'buy_medicine',
        number: '第7集',
        title: '药房扫荡',
        atmosphere: '连锁药店里，货架上的药品琳琅满目',
        content: `
            <p>你走进药店，直奔最关键的区域。<span class="highlight">抗生素、退烧药、止痛药、止血纱布、消毒酒精、碘伏……</span></p>
            <p>前世你亲眼看到有人因为一个小伤口感染而死。在末世，<span class="danger-text">最不起眼的病也能要命。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍⚕️</div>
                <div class="dialogue-content">
                    <div class="character-name">药剂师</div>
                    <div class="dialogue-text">抗生素是处方药，需要医生处方才能购买。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（掏出提前在网上挂的三个不同科室的号）我有三张处方，够吗？</div>
                </div>
            </div>
            <p>药剂师无语地看着你手里厚厚一沓处方。你微笑着说："最近身体不太好，多开点备用。"</p>
            <p>你在<span class="highlight">五家不同药店</span>分别采购，避免单一门店引起怀疑。总计花费<span class="highlight">8000元</span>，药品储备足够一个小型诊所使用。</p>
        `,
        choices: [
            {
                id: 'buy_weapons',
                label: '武器',
                text: '购买防身武器和工具',
                nextScene: 'buy_weapons',
                effect: () => {
                    _GS().money -= 8000;
                    _GS().inventory.medicine.amount += 50;
                    _GS().goldenFinger.storageUsed += 3;
                    _GS().daysLeft = 20;
                }
            },
            {
                id: 'secure_location',
                label: '安全屋',
                text: '优先解决住处问题',
                nextScene: 'secure_location',
                effect: () => {
                    _GS().money -= 8000;
                    _GS().inventory.medicine.amount += 50;
                    _GS().goldenFinger.storageUsed += 3;
                    _GS().daysLeft = 20;
                }
            }
        ]
    },

    // ==================== 第8集 ====================
    buy_weapons: {
        id: 'buy_weapons',
        number: '第8集',
        title: '武装自己',
        atmosphere: '户外用品店，墙上挂满了各种刀具',
        content: `
            <p>在国内获取真正的武器几乎不可能，但户外用品店有足够的替代品。</p>
            <p><span class="highlight">工兵铲、多功能刀具、弩弓、防刺手套、战术背心、强光手电……</span>你一样不落地扫进购物篮。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨</div>
                <div class="dialogue-content">
                    <div class="character-name">店员</div>
                    <div class="dialogue-text">姐，弩弓需要持证才能买，您有证吗？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（亮出提前考好的弩弓证）当然有。</div>
                </div>
            </div>
            <p>前世你连一把水果刀都没来得及拿。这一次，<span class="highlight">你不会让任何人靠近你三米之内。</span></p>
            <p>花费<span class="highlight">15000元</span>，武器装备基本齐全。你又在网上下单了防狼喷雾和电击棒，快递到不同的代收点。</p>
        `,
        choices: [
            {
                id: 'secure_location',
                label: '安全屋',
                text: '寻找末世中的避难所',
                nextScene: 'secure_location',
                effect: () => {
                    _GS().money -= 15000;
                    _GS().inventory.weapons.amount += 15;
                    _GS().goldenFinger.storageUsed += 5;
                    _GS().daysLeft = 19;
                }
            },
            {
                id: 'buy_clothes',
                label: '御寒',
                text: '极寒末世，先囤御寒物资',
                nextScene: 'buy_clothes',
                effect: () => {
                    _GS().money -= 15000;
                    _GS().inventory.weapons.amount += 15;
                    _GS().goldenFinger.storageUsed += 5;
                    _GS().daysLeft = 19;
                }
            }
        ]
    },

    // ==================== 支线：御寒物资 ====================
    buy_clothes: {
        id: 'buy_clothes',
        number: '第8集·支线',
        title: '极寒备战',
        atmosphere: '户外品牌折扣店，羽绒服堆积如山',
        content: `
            <p>你走进户外品牌折扣店，直奔最保暖的系列。<span class="highlight">极地羽绒服、保暖内衣、抓绒衣、防风裤、雪地靴、暖宝宝……</span></p>
            <p>前世零下四十度的记忆让你不寒而栗。那些没有御寒衣物的人，<span class="danger-text">活不过第一个夜晚。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">每种尺码各来三件。对，男女都有。</div>
                </div>
            </div>
            <p>店员以为你是代购，热情地帮你打包。你微笑着付款，<span class="highlight">20套顶级御寒装备，花费18000元。</span></p>
        `,
        choices: [
            {
                id: 'secure_location',
                label: '安全屋',
                text: '物资够了，该找住处了',
                nextScene: 'secure_location',
                effect: () => {
                    _GS().money -= 18000;
                    _GS().inventory.clothes.amount += 20;
                    _GS().goldenFinger.storageUsed += 4;
                    _GS().daysLeft = 18;
                }
            }
        ]
    },

    // ==================== 第9集 ====================
    secure_location: {
        id: 'secure_location',
        number: '第9集',
        title: '安全屋',
        atmosphere: '新建小区的售楼处，沙盘上的模型灯火通明',
        content: `
            <p>前世记忆告诉你，末世地震中倒塌的全是老旧建筑。<span class="highlight">新建的钢筋混凝土高层，抗震等级8级以上，才是末世中的堡垒。</span></p>
            <p>你来到城南新建的"翡翠湾"小区，这里的地基是整片岩层，前世地震中完好无损。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍💼</div>
                <div class="dialogue-content">
                    <div class="character-name">售楼小姐</div>
                    <div class="dialogue-text">林女士，我们这栋是整小区最好的位置，高层视野开阔，南北通透……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">我要顶楼。对，就是最高那一层。越贵越好。</div>
                </div>
            </div>
            <p>售楼小姐眼睛一亮。顶楼复式，<span class="highlight">总价210万</span>。你选择首付70万，贷款140万——反正末世后银行也不存在了。</p>
        `,
        choices: [
            {
                id: 'mortgage_apartment',
                label: '签约',
                text: '签下顶楼复式，打造末世堡垒',
                nextScene: 'mortgage_apartment',
                effect: () => {
                    _GS().money -= 700000;
                    _GS().daysLeft = 17;
                }
            },
            {
                id: 'underground_shelter',
                label: '地下',
                text: '寻找地下防空洞作为备用据点',
                nextScene: 'underground_shelter',
                effect: () => {
                    _GS().money -= 700000;
                    _GS().daysLeft = 17;
                    _GS().flags.secretBase = true;
                }
            }
        ]
    },

    // ==================== 隐藏路线：地下据点 ====================
    underground_shelter: {
        id: 'underground_shelter',
        number: '第9集·隐藏',
        title: '地下堡垒',
        atmosphere: '废弃防空洞入口，铁门锈迹斑斑',
        content: `
            <p>签下顶楼复式后，你根据前世记忆找到了一个被遗忘的地下防空洞。它位于城北老工业区地下20米，<span class="highlight">钢筋混凝土结构，自带通风系统和储水设施。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">前世这里成了幸存者的避难所，但后来被一伙武装人员占领了……这一次，它只属于我。</div>
                </div>
            </div>
            <p>你花了<span class="highlight">5000元</span>找锁匠换了最坚固的门锁，又在网上订购了监控摄像头和报警器。</p>
            <p>现在你有了<span class="highlight">两个据点</span>：地面上的顶楼复式和地下的防空洞。双保险。</p>
        `,
        choices: [
            {
                id: 'mortgage_apartment',
                label: '继续',
                text: '回到主线，装修安全屋',
                nextScene: 'mortgage_apartment',
                effect: () => {
                    _GS().money -= 5000;
                    _GS().daysLeft = 16;
                }
            }
        ]
    },

    // ==================== 第10集（关键节点：爽点2·免费段结尾·打脸高潮） ====================
    mortgage_apartment: {
        id: 'mortgage_apartment',
        number: '第10集',
        title: '偶遇仇人',
        atmosphere: '售楼处大厅，苏可欣挽着陈墨的手臂走进来',
        content: `
            <p>你正准备离开售楼处时，一个熟悉的声音从身后传来。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">念念？你怎么在这儿？你不是说最近手头紧吗？</div>
                </div>
            </div>
            <p>苏可欣挽着陈墨的手臂，脸上挂着虚伪的惊讶。陈墨看到你，眼神闪过一丝心虚。</p>
            <div class="memory-box">
                <div class="memory-text">前世这一天，苏可欣和陈墨就是在这里"偶遇"的。他们假装关心你，实际上是在打探你的经济状况，为末世后抢夺你的物资做准备。</div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（微笑）是啊，手头是紧。不过我男朋友帮我出了首付，买了顶楼复式。哦对了——</div>
                </div>
            </div>
            <p>你故意顿了顿，看着苏可欣挽着陈墨的手。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">你们也来看房？这个小区不错，不过顶楼已经卖完了哦。</div>
                </div>
            </div>
            <p>苏可欣的笑容僵在脸上。<span class="highlight">你看到了她眼中一闪而过的嫉妒和算计。</span></p>
        `,
        choices: [
            {
                id: 'visit_parents',
                label: '高冷离开',
                text: '不屑一顾，转身离开',
                nextScene: 'visit_parents',
                effect: () => {
                    _GS().flags.apartmentSecured = true;
                    _GS().relationships.suKexin -= 20;
                    _GS().relationships.chenMo -= 10;
                    _GS().flags.revengePhase1 = true;
                    _GS().daysLeft = 15;
                    _GS().stats.charisma += 1;
                }
            },
            {
                id: 'mock_enemy',
                label: '嘲讽',
                text: '故意炫耀，刺激苏可欣',
                nextScene: 'mock_enemy',
                effect: () => {
                    _GS().flags.apartmentSecured = true;
                    _GS().relationships.suKexin -= 30;
                    _GS().relationships.chenMo -= 15;
                    _GS().flags.revengePhase1 = true;
                    _GS().daysLeft = 15;
                    _GS().stats.charisma += 2;
                }
            }
        ]
    },

    // ==================== 支线：嘲讽仇人 ====================
    mock_enemy: {
        id: 'mock_enemy',
        number: '第10集·支线',
        title: '当众打脸',
        atmosphere: '售楼处大厅，所有人的目光聚集过来',
        content: `
            <p>你没有急着走，而是故意在苏可欣面前多停留了几秒。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">对了可欣，你之前不是说想让我帮你参考买房吗？我建议你量力而行，毕竟……有些人的经济条件，也就只配看看。</div>
                </div>
            </div>
            <p>苏可欣的脸色瞬间铁青。陈墨想说什么，但被你冰冷的目光钉在原地。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">林念晚，你什么意思？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">没什么意思。祝你们幸福。哦——如果"幸福"这个词对你们来说还有意义的话。</div>
                </div>
            </div>
            <p>你在苏可欣几乎要爆炸的表情中，优雅转身离开。<span class="highlight">第一巴掌，响了。</span></p>
        `,
        choices: [
            {
                id: 'visit_parents',
                label: '离开',
                text: '前往父母家，准备安置他们',
                nextScene: 'visit_parents',
                effect: () => {
                    _GS().daysLeft = 14;
                }
            }
        ]
    },

    // ==================== 第11集 ====================
    visit_parents: {
        id: 'visit_parents',
        number: '第11集',
        title: '父母安危',
        atmosphere: '父母家的小区，熟悉的梧桐树在风中摇曳',
        content: `
            <p>你站在父母家门口，深吸一口气。前世你没能救下他们——<span class="danger-text">末世第三天，他们住的老旧小区在地震中坍塌。</span></p>
            <div class="memory-box">
                <div class="memory-text">你接到母亲最后的电话："念念，别回来，楼在晃……"然后是轰隆一声，信号中断。那是你这辈子最绝望的时刻。</div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这一次，我不会让任何人伤害你们。哪怕拼上一切。</div>
                </div>
            </div>
            <p>你按下门铃。门开了，母亲惊讶地看着你。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林母</div>
                    <div class="dialogue-text">念念？怎么突然来了？也不提前说一声，妈给你做你爱吃的红烧排骨。</div>
                </div>
            </div>
            <p>看着母亲慈祥的笑容，你的眼眶微微泛红。但你知道，<span class="highlight">现在不是感伤的时候。</span></p>
        `,
        choices: [
            {
                id: 'prepare_parents',
                label: '坦白',
                text: '告诉父母真相，带他们搬走',
                nextScene: 'prepare_parents',
                effect: () => {
                    _GS().relationships.parents += 30;
                    _GS().daysLeft = 13;
                }
            },
            {
                id: 'persuade_parents',
                label: '善意的谎',
                text: '编造理由，让父母搬到新家',
                nextScene: 'persuade_parents',
                effect: () => {
                    _GS().relationships.parents += 10;
                    _GS().daysLeft = 13;
                }
            }
        ]
    },

    // ==================== 第12集 ====================
    prepare_parents: {
        id: 'prepare_parents',
        number: '第12集',
        title: '举家搬迁',
        atmosphere: '父母家的客厅，气氛凝重',
        content: `
            <p>你坐在父母对面，认真地看着他们。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">爸，妈，我要你们搬到我新买的房子去。越快越好。我知道你们会觉得突然，但请相信我。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林父</div>
                    <div class="dialogue-text">念念，你是不是遇到什么事了？你从小就不爱撒谎，有什么跟爸说。</div>
                </div>
            </div>
            <p>你沉默了几秒，然后说："爸，我做了个梦。一个很真实的梦。<span class="highlight">梦里这个小区塌了。</span>我知道你们不信，但求你们，就当是为了我，搬过去好不好？"</p>
            <p>母亲看着你泛红的眼眶，终于点了头。<span class="highlight">"好，妈信你。"</span></p>
        `,
        choices: [
            {
                id: 'apocalypse_begins',
                label: '加速',
                text: '快速安置父母，全力备战末世',
                nextScene: 'apocalypse_begins',
                effect: () => {
                    _GS().flags.parentsPrepared = true;
                    _GS().relationships.parents += 20;
                    _GS().daysLeft = 10;
                    _GS().money -= 30000;
                    _GS().inventory.food.amount += 100;
                    _GS().inventory.water.amount += 50;
                }
            },
            {
                id: 'secret_stockpile',
                label: '秘密囤货',
                text: '在父母新家也藏一批应急物资',
                nextScene: 'secret_stockpile',
                effect: () => {
                    _GS().flags.parentsPrepared = true;
                    _GS().relationships.parents += 20;
                    _GS().daysLeft = 10;
                    _GS().money -= 30000;
                    _GS().inventory.food.amount += 150;
                    _GS().inventory.water.amount += 80;
                    _GS().inventory.medicine.amount += 10;
                }
            }
        ]
    },

    // ==================== 支线：说服父母 ====================
    persuade_parents: {
        id: 'persuade_parents',
        number: '第12集·支线',
        title: '善意谎言',
        atmosphere: '温馨的客厅，茶杯冒着热气',
        content: `
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">妈，我换工作了，新公司福利特别好，分了一套大房子。但是离这儿太远了，我想让你们搬过来跟我住。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林母</div>
                    <div class="dialogue-text">真的？那我闺女出息了！不过这房子……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">顶楼复式，三百平，电梯直达。你们就当享福了。这周末就搬，我已经叫好搬家公司了。</div>
                </div>
            </div>
            <p>父母虽然有些犹豫，但最终还是被你说服了。你松了一口气——<span class="highlight">至少他们不会死在那栋老旧楼房里了。</span></p>
        `,
        choices: [
            {
                id: 'apocalypse_begins',
                label: '备战',
                text: '父母安顿好，全力迎接末世',
                nextScene: 'apocalypse_begins',
                effect: () => {
                    _GS().flags.parentsPrepared = true;
                    _GS().daysLeft = 10;
                    _GS().money -= 20000;
                }
            }
        ]
    },

    // ==================== 支线：秘密囤货 ====================
    secret_stockpile: {
        id: 'secret_stockpile',
        number: '第12集·支线',
        title: '双保险',
        atmosphere: '新家地下室的角落，你藏好了最后一箱物资',
        content: `
            <p>除了储物空间里的物资，你还在新家的隐蔽角落藏了一批应急储备。<span class="highlight">万一空间出了什么问题，至少还有备用的。</span></p>
            <p>你在衣柜夹层、床底暗格、厨房吊柜里分别藏了食物、水和药品。这些地方，<span class="highlight">只有你知道。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">永远不要把所有鸡蛋放在一个篮子里。这是末世生存的第一法则。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'apocalypse_begins',
                label: '末世将至',
                text: '最后倒计时，迎接天灾',
                nextScene: 'apocalypse_begins',
                effect: () => {
                    _GS().daysLeft = 8;
                }
            }
        ]
    },

    // ==================== 第13集 ====================
    apocalypse_begins: {
        id: 'apocalypse_begins',
        number: '第13集',
        title: '末世降临',
        atmosphere: '天空突然变暗，气温以肉眼可感的速度下降',
        content: `
            <p><span class="danger-text">2024年12月31日，下午三点十七分。</span></p>
            <p>你站在新家的落地窗前，看着天空从蔚蓝变成铅灰色。气温在十分钟内骤降了<span class="danger-text">20度</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">来了。和前世一模一样。</div>
                </div>
            </div>
            <p>手机上铺天盖地的新闻推送："<span class="danger-text">全球性异常降温！多地气温跌破零下30度！</span>""科学家称前所未见的气候事件！"</p>
            <p>窗外，街道上开始出现混乱。人们裹着被子冲进超市，交通堵塞，喇叭声此起彼伏。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（看着储物空间里堆积如山的物资）而我，已经准备好了。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'first_day',
                label: '坚守',
                text: '关好门窗，和家人待在安全屋里',
                nextScene: 'first_day',
                effect: () => {
                    _GS().flags.apocalypseStarted = true;
                    _GS().daysLeft = 0;
                    _GS().chapter = 2;
                }
            },
            {
                id: 'last_sweep',
                label: '最后扫货',
                text: '趁混乱再去扫一波物资',
                nextScene: 'last_sweep',
                effect: () => {
                    _GS().flags.apocalypseStarted = true;
                    _GS().daysLeft = 0;
                    _GS().chapter = 2;
                    _GS().money -= 10000;
                    _GS().inventory.food.amount += 200;
                    _GS().inventory.water.amount += 100;
                    _GS().inventory.tools.amount += 5;
                }
            },
            {
                id: 'battle_mutant_dog',
                label: '战斗',
                text: '一只变异猎犬挡住了去路！',
                nextScene: 'first_day',
                effect: () => { window.startBattle('mutant_dog'); }
            }
        ]
    },

    // ==================== 支线：最后扫货 ====================
    last_sweep: {
        id: 'last_sweep',
        number: '第13集·支线',
        title: '乱世扫货',
        atmosphere: '超市里人山人海，货架被抢得七零八落',
        content: `
            <p>你戴上口罩和帽子，混入超市的人群中。货架已经空了大半，但你的目标不是普通商品。</p>
            <p>你直奔被大多数人忽略的区域——<span class="highlight">五金工具、电池、蜡烛、打火机、绳索。</span>这些在末世中比食物更珍贵。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨</div>
                <div class="dialogue-content">
                    <div class="character-name">路人甲</div>
                    <div class="dialogue-text">别挤！这箱泡面是我先看到的！</div>
                </div>
            </div>
            <p>你冷眼旁观着人们的疯狂抢购，从容地将一箱箱工具收入储物空间。<span class="highlight">在混乱中保持冷静，是重生者的特权。</span></p>
        `,
        choices: [
            {
                id: 'first_day',
                label: '回家',
                text: '物资充足，返回安全屋',
                nextScene: 'first_day',
                effect: () => {
                    _GS().daysLeft = 0;
                }
            }
        ]
    },

    // ==================== 第14集 ====================
    first_day: {
        id: 'first_day',
        number: '第14集',
        title: '极寒第一夜',
        atmosphere: '窗外暴风雪呼啸，室内温暖如春',
        content: `
            <p>末世第一天夜晚。<span class="danger-text">室外温度零下35度，全城大面积停电。</span></p>
            <p>你的安全屋里，发电机嗡嗡运转，暖风机吹出热风。储物空间里的物资足够一家人吃上一年。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林母</div>
                    <div class="dialogue-text">念念，外面好可怕……隔壁王阿姨说楼下已经有人冻死了。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">妈，别担心。我们有足够的食物、水和取暖设备。只要待在家里，就不会有事。</div>
                </div>
            </div>
            <p>你透过窗户看到楼下蜷缩在寒风中的人群。<span class="highlight">前世你就是他们中的一员。</span>但这一次不同了。</p>
            <p>手机信号越来越弱，最后完全消失。<span class="danger-text">你正式与旧世界断联。</span></p>
        `,
        choices: [
            {
                id: 'enemy_knock',
                label: '等待',
                text: '安心休整，等待不可避免的访客',
                nextScene: 'enemy_knock',
                effect: () => {
                    _GS().stats.strength += 1;
                }
            },
            {
                id: 'patrol_night',
                label: '巡逻',
                text: '夜间巡逻，掌握周围情况',
                nextScene: 'patrol_night',
                effect: () => {
                    _GS().stats.strength += 2;
                    _GS().stats.intelligence += 1;
                    _GS().relationships.neighbor += 10;
                }
            }
        ]
    },

    // ==================== 支线：夜间巡逻 ====================
    patrol_night: {
        id: 'patrol_night',
        number: '第14集·支线',
        title: '暗夜侦察',
        atmosphere: '楼道里应急灯闪烁，寒风从缝隙中灌入',
        content: `
            <p>你穿上御寒装备，带上手电和工兵铲，沿着消防楼梯逐层巡查。</p>
            <p>整栋楼32层，目前只有不到10户人家有灯光——大部分是用蜡烛或应急灯。<span class="danger-text">没有电，没有暖气，这些人的日子不会太久。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👨</div>
                <div class="dialogue-content">
                    <div class="character-name">邻居张大哥</div>
                    <div class="dialogue-text">你是新搬来的吧？有吃的吗？我家已经断粮了……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（递给他两包压缩饼干）先撑过今晚。明天看看能不能组织大家一起想办法。</div>
                </div>
            </div>
            <p>你记下了每一户的情况。<span class="highlight">信息就是力量，在末世中尤其如此。</span></p>
        `,
        choices: [
            {
                id: 'enemy_knock',
                label: '返回',
                text: '回到安全屋，等待天亮',
                nextScene: 'enemy_knock',
                effect: () => {
                    _GS().inventory.food.amount -= 2;
                }
            }
        ]
    },

    // ==================== 第15集（爽点3：连环打脸开始） ====================
    enemy_knock: {
        id: 'enemy_knock',
        number: '第15集',
        title: '不速之客',
        atmosphere: '门铃急促响起，猫眼里是两张熟悉又可恨的脸',
        content: `
            <p>末世第三天。门铃响了。你从监控屏幕上看到了<span class="danger-text">苏可欣和陈墨</span>——他们裹着薄薄的外套，嘴唇冻得发紫。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">念念！开门啊！我们快冻死了！你家有暖气对不对？求求你让我们进去暖和一下！</div>
                </div>
            </div>
            <div class="memory-box">
                <div class="memory-text">前世，你毫不犹豫地打开了门。然后他们再也没有离开——吃你的、喝你的，最后连你的被子都抢走了。</div>
            </div>
            <p>你看着监控屏幕上两人狼狈的样子，嘴角微微上扬。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（对着门禁对讲机）哎呀，可欣？陈墨？你们怎么来了？可是我家太小了，怕是招待不了你们呢。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'reject_enemy',
                label: '冷酷拒绝',
                text: '不开门，让他们冻着',
                nextScene: 'reject_enemy',
                effect: () => {
                    _GS().relationships.suKexin -= 40;
                    _GS().relationships.chenMo -= 30;
                    _GS().flags.revengePhase2 = true;
                }
            },
            {
                id: 'toy_with_enemy',
                label: '猫捉老鼠',
                text: '开门让他们进来，然后……',
                nextScene: 'toy_with_enemy',
                effect: () => {
                    _GS().relationships.suKexin -= 20;
                    _GS().relationships.chenMo -= 15;
                    _GS().flags.revengePhase2 = true;
                    _GS().stats.charisma += 1;
                }
            }
        ]
    },

    // ==================== 第16集 ====================
    reject_enemy: {
        id: 'reject_enemy',
        number: '第16集',
        title: '闭门羹',
        atmosphere: '门外是刺骨寒风，门内是温暖如春',
        content: `
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">念念！你怎么能这样？我们是最好的朋友啊！你不会见死不救吧？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">最好的朋友？（轻笑）苏可欣，你确定要用这个词？</div>
                </div>
            </div>
            <p>门外沉默了几秒。然后陈墨的声音响起，带着讨好和心虚。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👨</div>
                <div class="dialogue-content">
                    <div class="character-name">陈墨</div>
                    <div class="dialogue-text">念晚，我知道我们之间有些误会。但现在是非常时期，能不能先让我们……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">陈墨，你有什么资格跟我说话？你和你现在搂着的这位，前世是怎么对我的，你们自己心里清楚。哦不对——你们不记得前世的事。但我记得。每一秒都记得。</div>
                </div>
            </div>
            <p>你关掉了门禁对讲机。<span class="highlight">门外传来绝望的拍门声，但你连眼皮都没抬一下。</span></p>
        `,
        choices: [
            {
                id: 'warehouse_upgrade',
                label: '无视',
                text: '他们不值得你浪费一秒钟',
                nextScene: 'warehouse_upgrade',
                effect: () => {
                    _GS().stats.strength += 1;
                }
            },
            {
                id: 'show_off_supplies',
                label: '炫耀',
                text: '故意在窗边吃热腾腾的面条',
                nextScene: 'show_off_supplies',
                effect: () => {
                    _GS().relationships.suKexin -= 30;
                    _GS().relationships.chenMo -= 20;
                    _GS().stats.charisma += 1;
                }
            }
        ]
    },

    // ==================== 支线：猫捉老鼠 ====================
    toy_with_enemy: {
        id: 'toy_with_enemy',
        number: '第16集·支线',
        title: '请君入瓮',
        atmosphere: '门开了，暖气扑面而来，苏可欣和陈墨如获大赦',
        content: `
            <p>你打开了门。苏可欣和陈墨几乎是扑进来的，跪在地上大口喘气。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">谢谢！谢谢你念念！我就知道你不会不管我们的！</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">别急。进来可以，但有条件。</div>
                </div>
            </div>
            <p>你给他们一人倒了一杯热水，然后慢条斯理地说：</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">你们可以在这里待一个小时暖和一下。然后，离开。如果你们敢偷任何东西——（你拍了拍腰间的工兵铲）后果自负。</div>
                </div>
            </div>
            <p>苏可欣和陈墨面面相觑。他们看到了你眼中的寒意——<span class="highlight">那不是开玩笑的眼神。</span></p>
        `,
        choices: [
            {
                id: 'kick_out_enemy',
                label: '驱逐',
                text: '一小时后把他们赶出去',
                nextScene: 'kick_out_enemy',
                effect: () => {
                    _GS().relationships.suKexin -= 50;
                    _GS().relationships.chenMo -= 40;
                }
            },
            {
                id: 'reject_enemy',
                label: '后悔',
                text: '不该心软，直接赶走',
                nextScene: 'reject_enemy',
                effect: () => {
                    _GS().relationships.suKexin -= 35;
                    _GS().relationships.chenMo -= 25;
                }
            }
        ]
    },

    // ==================== 支线：驱逐仇人 ====================
    kick_out_enemy: {
        id: 'kick_out_enemy',
        number: '第16集·支线',
        title: '扫地出门',
        atmosphere: '门口，寒风再次将温暖夺走',
        content: `
            <p>一个小时后，你准时站在门口。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">时间到了。请回吧。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">你疯了？！外面零下三十多度！你让我们出去就是送死！</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">送死？苏可欣，你似乎搞错了什么。我没有义务救你。就像前世——你没有义务不抢我的东西一样。对吧？</div>
                </div>
            </div>
            <p>苏可欣的表情从愤怒变成困惑——<span class="highlight">她显然不理解"前世"是什么意思。</span>但你不在乎。</p>
            <p>你关上了门。门外传来苏可欣歇斯底里的尖叫和陈墨的哀求。<span class="highlight">声音越来越远，最终被风雪吞没。</span></p>
        `,
        choices: [
            {
                id: 'warehouse_upgrade',
                label: '继续',
                text: '回到正轨，升级安全屋',
                nextScene: 'warehouse_upgrade',
                effect: () => {}
            }
        ]
    },

    // ==================== 支线：窗边炫耀 ====================
    show_off_supplies: {
        id: 'show_off_supplies',
        number: '第16集·支线',
        title: '窗边的面条',
        atmosphere: '温暖的室内，窗边，一碗热气腾腾的红烧牛肉面',
        content: `
            <p>你故意走到落地窗边，端着一碗热气腾腾的红烧牛肉面，慢条斯理地吃了起来。</p>
            <p>楼下，苏可欣和陈墨正蜷缩在楼栋入口处，抬头看到了你。<span class="highlight">他们的眼神从希望变成了绝望，又从绝望变成了扭曲的嫉妒。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（自言自语）好吃。真好吃。前世我连一口冷馒头都吃不上的时候，你们在吃什么来着？哦，对，我的午餐肉罐头。</div>
                </div>
            </div>
            <p>你喝完最后一口汤，对着窗外的两人举了举空碗，然后转身拉上了窗帘。</p>
            <p><span class="highlight">这一碗面，敬前世的自己。</span></p>
        `,
        choices: [
            {
                id: 'warehouse_upgrade',
                label: '继续',
                text: '升级安全屋防御',
                nextScene: 'warehouse_upgrade',
                effect: () => {}
            }
        ]
    },

    // ==================== 第17集 ====================
    warehouse_upgrade: {
        id: 'warehouse_upgrade',
        number: '第17集',
        title: '堡垒升级',
        atmosphere: '安全屋内，你正在加固门窗',
        content: `
            <p>末世第五天。第一波地震即将来临——前世记忆中，<span class="danger-text">明天下午两点，6.8级地震。</span></p>
            <p>你从储物空间取出提前准备好的加固材料：<span class="highlight">防爆贴膜、钢制门板、固定支架、应急绳索。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👨‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林父</div>
                    <div class="dialogue-text">念念，你什么时候准备的这些东西？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">爸，别问了。待会儿不管发生什么，都别出门。记住，别出门。</div>
                </div>
            </div>
            <p>你花了整整六个小时加固了所有门窗，又在客厅中央搭建了一个<span class="highlight">临时安全三角区</span>——用床垫和桌椅围成的避震空间。</p>
        `,
        choices: [
            {
                id: 'earthquake_hits',
                label: '等待',
                text: '在安全区等待地震到来',
                nextScene: 'earthquake_hits',
                effect: () => {
                    _GS().flags.warehouseUpgraded = true;
                    _GS().stats.strength += 1;
                }
            },
            {
                id: 'warn_neighbors',
                label: '警告',
                text: '通知邻居们准备地震',
                nextScene: 'warn_neighbors',
                effect: () => {
                    _GS().flags.warehouseUpgraded = true;
                    _GS().relationships.neighbor += 20;
                    _GS().stats.charisma += 1;
                }
            }
        ]
    },

    // ==================== 第18集（爽点4：地震中的碾压） ====================
    earthquake_hits: {
        id: 'earthquake_hits',
        number: '第18集',
        title: '地动山摇',
        atmosphere: '整栋楼剧烈摇晃，玻璃碎裂声震耳欲聋',
        content: `
            <p><span class="danger-text">下午两点整。大地开始颤抖。</span></p>
            <p>你早已带着父母躲进安全三角区。整栋楼发出令人牙酸的金属扭曲声，但新建的钢筋混凝土结构<em>纹丝不动</em>。</p>
            <div class="memory-box">
                <div class="memory-text">前世这场地震，你住的老旧楼房整栋坍塌。你在废墟下被压了两天，最后是路过的好心人把你挖出来的。而你的父母……没有等到救援。</div>
            </div>
            <p>地震持续了将近一分钟。停歇后，你立刻从储物空间取出应急装备，检查房屋结构。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">墙体无裂缝，承重柱完好，门窗框架变形但可修复。（松了一口气）这栋楼，扛住了。</div>
                </div>
            </div>
            <p>你从窗户望出去——<span class="danger-text">远处几栋老旧建筑已经倒塌，烟尘冲天。</span>哭喊声从四面八方传来。</p>
        `,
        choices: [
            {
                id: 'rescue_or_ignore',
                label: '冷静',
                text: '先确保自身安全，再考虑其他',
                nextScene: 'rescue_or_ignore',
                effect: () => {
                    _GS().flags.parentsSaved = true;
                }
            },
            {
                id: 'boss_hint',
                label: '异常',
                text: '地震中似乎看到了不该出现的东西',
                nextScene: 'boss_hint',
                effect: () => {
                    _GS().flags.parentsSaved = true;
                    _GS().flags.bossHintFound = true;
                }
            }
        ]
    },

    // ==================== 支线：警告邻居 ====================
    warn_neighbors: {
        id: 'warn_neighbors',
        number: '第17集·支线',
        title: '末日预言',
        atmosphere: '楼道里，你挨家挨户敲门',
        content: `
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">各位邻居，请听我说。明天下午两点会有强烈地震，请提前做好防护准备——躲在桌子下面，远离窗户，准备应急物资。</div>
                </div>
            </div>
            <p>大多数人将信将疑，但张大哥认真地点了头："林姑娘，我信你。你之前说的降温果然应验了。"</p>
            <p>你把多余的几床被子和一些压缩饼干分给了楼里的老人和孩子。<span class="highlight">不是心软，是投资。末世中，人情也是资源。</span></p>
        `,
        choices: [
            {
                id: 'earthquake_hits',
                label: '等待',
                text: '回到安全屋，等待地震',
                nextScene: 'earthquake_hits',
                effect: () => {
                    _GS().inventory.food.amount -= 10;
                }
            }
        ]
    },

    // ==================== 第19集 ====================
    boss_hint: {
        id: 'boss_hint',
        number: '第19集',
        title: '神秘信号',
        atmosphere: '地震后的废墟中，一个黑色的信号发射器在闪烁',
        content: `
            <p>地震刚停，你到楼顶检查天线设备时，发现了一个不该存在的东西——<span class="danger-text">一个军用级别的信号发射器，就安装在你楼顶的通风管道旁。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这不是物业装的……这是专业的军用通讯设备。谁会在我搬进来之前就把这东西装在这里？</div>
                </div>
            </div>
            <p>你检查了发射器的日志，发现最后一条信号记录是：<span class="danger-text">"新秩序·天眼·节点0734·状态正常"</span></p>
            <div class="memory-box">
                <div class="memory-text">"新秩序"——你在那个加密论坛上看到的三个字。这不是巧合。有人提前知道末世要来，甚至在你买下这套房子之前，就已经在布局了。</div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">看来这场末世，远没有我想象的那么简单。有人在背后操控一切。但现在还不是追查的时候——先解决眼前的问题。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'rescue_or_ignore',
                label: '暂且搁置',
                text: '记录线索，先处理眼前的危机',
                nextScene: 'rescue_or_ignore',
                effect: () => {
                    _GS().flags.bossHintFound = true;
                    _GS().relationships.mysteriousMan += 20;
                }
            },
            {
                id: 'trace_signal',
                label: '追踪',
                text: '尝试追踪信号来源',
                nextScene: 'trace_signal',
                effect: () => {
                    _GS().flags.bossHintFound = true;
                    _GS().flags.hiddenRoute = true;
                    _GS().relationships.mysteriousMan += 30;
                    _GS().stats.intelligence += 2;
                }
            }
        ]
    },

    // ==================== 隐藏路线：追踪信号 ====================
    trace_signal: {
        id: 'trace_signal',
        number: '第19集·隐藏',
        title: '暗夜追踪',
        atmosphere: '楼顶，寒风刺骨，信号发射器的指示灯在黑暗中闪烁',
        content: `
            <p>你用前世学到的基本电子知识，尝试反向追踪信号。发射器连接着一个加密频段，信号指向城北方向。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">城北……老工业区。那不就是地下防空洞的方向吗？</div>
                </div>
            </div>
            <p>你将发射器的数据拍照记录，然后小心翼翼地将其恢复原状。<span class="highlight">不打草惊蛇，是追踪者的基本素养。</span></p>
            <p>一个模糊的轮廓在你脑海中浮现——<span class="danger-text">一个在末世之前就已经布局了一切的神秘组织，一个叫做"新秩序"的影子。</span></p>
        `,
        choices: [
            {
                id: 'rescue_or_ignore',
                label: '返回',
                text: '先处理眼前事务，日后再查',
                nextScene: 'rescue_or_ignore',
                effect: () => {}
            }
        ]
    },

    // ==================== 第20集（关键节点：爽点5·第一大高潮·复仇完成） ====================
    rescue_or_ignore: {
        id: 'rescue_or_ignore',
        number: '第20集',
        title: '末世审判',
        atmosphere: '地震后的清晨，废墟中升起第一缕阳光',
        content: `
            <p>末世第七天。前世的今天，就是你死去的日子。</p>
            <p>你站在安全屋的阳台上，俯瞰着满目疮痍的城市。远处，老旧小区的废墟中还传来微弱的求救声。近处，你的新家完好无损。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">前世这一天，我冻死在废弃商场里。而今天，我站在30层的阳台上，穿着温暖的羽绒服，喝着热咖啡。</div>
                </div>
            </div>
            <p>楼下，你看到了两个熟悉的身影——<span class="danger-text">苏可欣和陈墨</span>。他们蜷缩在楼栋入口的避风处，衣衫褴褛，面容憔悴。</p>
            <p>七天，他们已经从光鲜亮丽的都市白领变成了末世中的流浪者。<span class="highlight">而你，是这座城市里活得最从容的人。</span></p>
        `,
        choices: [
            {
                id: 'final_confrontation',
                label: '最终审判',
                text: '下楼，与仇人做最后的了断',
                nextScene: 'final_confrontation',
                effect: () => {
                    _GS().flags.revengeComplete = true;
                }
            },
            {
                id: 'mercy_path',
                label: '冷漠路过',
                text: '他们已经不配让你浪费时间',
                nextScene: 'mercy_path',
                effect: () => {
                    _GS().flags.mercyShown = true;
                    _GS().flags.revengeComplete = true;
                    _GS().stats.intelligence += 1;
                }
            }
        ]
    },

    // ==================== 第20集高潮A：最终对峙 ====================
    final_confrontation: {
        id: 'final_confrontation',
        number: '第20集·高潮',
        title: '末世女王',
        atmosphere: '楼栋入口，寒风呼啸，两个狼狈的身影抬头仰望',
        content: `
            <p>你穿着厚实的极地羽绒服，戴着防风面罩，缓缓走到苏可欣和陈墨面前。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👱‍♀️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏可欣</div>
                    <div class="dialogue-text">念……念晚？你……你怎么……</div>
                </div>
            </div>
            <p>苏可欣瞪大了眼睛。她无法理解——为什么在所有人都冻得半死的时候，你却面色红润、衣着整洁。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">因为我比你聪明。因为我比你努力。因为我从不会把别人的善良当成理所当然。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👨</div>
                <div class="dialogue-content">
                    <div class="character-name">陈墨</div>
                    <div class="dialogue-text">念晚，我知道我对不起你。但现在能不能……</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">能不能什么？让你进来吃我的东西、穿我的衣服、睡我的床，然后像前世一样把我踢出去等死？</div>
                </div>
            </div>
            <p>陈墨愣住了。<span class="highlight">"前世"两个字像一把刀，精准地刺穿了他最后的防线。</span></p>
            <p>你从口袋里掏出一瓶矿泉水，放在他们面前。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这是最后一瓶。不是因为我心软，是因为我想让你们记住——在你们最落魄的时候，是你们曾经伤害过的人给了你们一线生机。而你们，不配得到更多。</div>
                </div>
            </div>
            <p>你转身走向电梯，背影笔直而冷冽。身后传来苏可欣的哭声和陈墨的沉默。</p>
            <p><span class="highlight">第一幕·完。复仇只是开始，真正的战斗还在后面。</span></p>
        `,
        choices: [
            {
                id: 'act1_finale',
                label: '第一幕终',
                text: '进入第二幕：新秩序的阴影',
                nextScene: 'act1_finale',
                effect: () => {
                    _GS().flags.revengeComplete = true;
                    _GS().chapter = 2;
                    _GS().inventory.water.amount -= 1;
                    _GS().relationships.suKexin = -100;
                    _GS().relationships.chenMo = -100;
                }
            }
        ]
    },

    // ==================== 第20集高潮B：冷漠路线 ====================
    mercy_path: {
        id: 'mercy_path',
        number: '第20集·高潮',
        title: '女王之路',
        atmosphere: '阳台上，你背对废墟，面向远方',
        content: `
            <p>你站在阳台上，目光掠过楼下蜷缩的苏可欣和陈墨，就像掠过两块无关紧要的石头。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（自言自语）前世我恨你们恨到骨子里。但现在……你们不过是一群在末世中挣扎的蝼蚁。不值得我浪费时间。</div>
                </div>
            </div>
            <p>你转身回到温暖的客厅。父母正在用你囤的食材做午饭，厨房里飘出饭菜的香气。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩‍🦳</div>
                <div class="dialogue-content">
                    <div class="character-name">林母</div>
                    <div class="dialogue-text">念念，快来吃饭。今天妈炖了排骨汤。</div>
                </div>
            </div>
            <p>你坐到餐桌前，看着热气腾腾的饭菜，看着安全的房子，看着健康的父母。</p>
            <p><span class="highlight">这就是重生者该有的样子——不纠结于过去，只掌控未来。</span></p>
            <p>窗外，风雪依旧。但你的世界，已经完全不同了。</p>
            <p><span class="highlight">第一幕·完。更大的风暴即将来临。</span></p>
        `,
        choices: [
            {
                id: 'act1_finale',
                label: '第一幕终',
                text: '进入第二幕：新秩序的阴影',
                nextScene: 'act1_finale',
                effect: () => {
                    _GS().flags.revengeComplete = true;
                    _GS().flags.mercyShown = true;
                    _GS().chapter = 2;
                }
            }
        ]
    },

    // ==================== 第一幕终章 ====================
    act1_finale: {
        id: 'act1_finale',
        number: '终章',
        title: '暴风将至',
        atmosphere: '夜幕降临，远方的天际线出现不自然的蓝光',
        content: `
            <p>末世第七天深夜。你站在阳台上，发现远方的天际线出现了一道诡异的<span class="danger-text">蓝色光芒</span>——不是闪电，不是火光，而是一种稳定的、人造的光源。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">那个方向……是城北老工业区。信号发射器指向的地方。</div>
                </div>
            </div>
            <p>你拿出之前拍下的发射器日志，再次确认——<span class="danger-text">"新秩序·天眼·节点0734"</span>。那个神秘组织，就在那里。</p>
            <div class="memory-box">
                <div class="memory-text">前世你在末世第10天左右看到的军用直升机，第15天听到的"新秩序"广播……一切都有了解释。有人在这场末世中建立了自己的势力。</div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👩</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">囤货、复仇、安置家人——第一阶段的任务已经完成。但真正的战斗才刚刚开始。"新秩序"……不管你们是谁，我都会找到你们。</div>
                </div>
            </div>
            <p><span class="highlight">第二幕预告：新秩序的阴影笼罩城市，变异生物开始出现，神秘人周天成即将登场。林念晚的末世征途，远未结束……</span></p>
        `,
        choices: [
            {
                id: 'act2_start',
                label: '进入第二幕',
                text: '新秩序的阴影（敬请期待）',
                nextScene: 'act2_start',
                effect: () => {
                    _GS().chapter = 2;
                    _GS().goldenFinger.level = 2;
                }
            }
        ]
    },

    // ==================== 第二幕入口占位 ====================
    act2_start: {
        id: 'act2_start',
        number: '第二幕',
        title: '敬请期待',
        atmosphere: '蓝色光芒在远方闪烁，新的冒险即将开始',
        content: `
            <p><span class="highlight">第二幕：新秩序的阴影</span></p>
            <p>末世第十天。气温持续下降，变异生物开始出现，神秘组织"新秩序"浮出水面。</p>
            <p>林念晚将面对比复仇更大的挑战——<span class="danger-text">生存、真相，以及一个叫做周天成的男人。</span></p>
            <p>更多精彩剧情，敬请期待……</p>
        `,
        choices: [
            {
                id: 'prologue',
                label: '重新开始',
                text: '回到序章，重新体验第一幕',
                nextScene: 'prologue',
                effect: () => {
                    // 重置游戏状态
                    Object.assign(_GS(), {
                        money: 500000, daysLeft: 30, chapter: 1, episode: 0,
                        currentRoute: 'main',
                        inventory: { food: { amount: 0, unit: '份', max: 500, icon: '🍚', name: '食物' }, water: { amount: 0, unit: '瓶', max: 300, icon: '💧', name: '饮用水' }, medicine: { amount: 0, unit: '盒', max: 100, icon: '💊', name: '药品' }, weapons: { amount: 0, unit: '件', max: 50, icon: '🔪', name: '武器' }, clothes: { amount: 0, unit: '套', max: 100, icon: '🧥', name: '衣物' }, fuel: { amount: 0, unit: '桶', max: 50, icon: '⛽', name: '燃料' }, tools: { amount: 0, unit: '件', max: 80, icon: '🔧', name: '工具' }, materials: { amount: 0, unit: '批', max: 200, icon: '🪵', name: '建材' } },
                        relationships: { suKexin: -100, chenMo: -100, parents: 50, neighbor: 0, mysteriousMan: 0 },
                        goldenFinger: { level: 1, storageUsed: 0, storageMax: 100 },
                    });
                    const flagKeys = Object.keys(_GS().flags);
                    flagKeys.forEach(k => _GS().flags[k] = false);
                }
            }
        ]
    },
};

// ==================== 第二幕：势力崛起·对抗篇 ====================
const Scenes_Act2 = {

    // ==================== Ep 21-25: 势力建立 ====================

    act2_base_build: {
        id: 'act2_base_build',
        number: '第21集',
        title: '安全屋升级',
        atmosphere: '晨光透过加固铁窗，照在堆满物资的仓库',
        content: `
            <p>末世第三十天。林念晚站在安全屋顶层，俯瞰着这座由废弃商场改建的据点。储物空间已升级至<span class="highlight">Lv.2（200m³）</span>，足够支撑一个小型团队的生存。</p>
            <p>苏可欣和陈墨的覆灭为她赢得了短暂的安宁，但林念晚知道，真正的风暴才刚刚开始。她重生一世，不是为了苟活，而是要在这末世中建立属于自己的秩序。</p>
            <p>楼下传来金属碰撞的声响——那是她在加固门窗。预感异能隐隐跳动，告诉她<span class="danger-text">七天之内，将有一批幸存者抵达附近</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">既然知道他们要来，不如提前做好准备。末世之中，人才是最稀缺的资源。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_survivors',
                label: '主动出击',
                text: '提前去侦察幸存者队伍',
                nextScene: 'act2_survivors',
                effect: () => { _GS().flags['主动侦察'] = true; _GS().relationships['陆远'] = (_GS().relationships['陆远'] || 0) + 5; }
            },
            {
                id: 'act2_survivors_passive',
                label: '以逸待劳',
                text: '加固安全屋等待幸存者上门',
                nextScene: 'act2_survivors',
                effect: () => { _GS().flags['以逸待劳'] = true; _GS().goldenFinger.energy += 10; }
            }
        ]
    },

    act2_survivors: {
        id: 'act2_survivors',
        number: '第22集',
        title: '幸存者求助',
        atmosphere: '乌云压城，远处传来零星枪声',
        content: `
            <p>三天后，预感应验了。一支约二十人的幸存者队伍出现在商场外围，衣衫褴褛，神色惊惶。队伍中有人受伤，有人在哭泣。</p>
            <p>领头的男人身材魁梧，目光警惕，手中紧握一根铁管。他叫赵铁柱，是附近工地的工头，末世后自发组织了这批人。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">这位……姑娘，我们不是来找麻烦的。我兄弟腿断了，还有三个孩子饿得不行，求你行行好。</div>
                </div>
            </div>
            <p>林念晚注意到队伍后方有一个沉默的男人，穿着洗得发白的军装，腰间别着一把军刀。<span class="highlight">那人的站姿笔直如松，眼神锐利如鹰——是个军人。</span></p>
        `,
        choices: [
            {
                id: 'act2_recruit_luyuan',
                label: '接纳全部',
                text: '打开大门，收留所有幸存者',
                nextScene: 'act2_recruit_luyuan',
                effect: () => { _GS().money -= 500; _GS().relationships['赵铁柱'] = 30; _GS().population = (_GS().population || 0) + 20; }
            },
            {
                id: 'act2_recruit_luyuan',
                label: '有条件接纳',
                text: '要求所有人服从管理方可进入',
                nextScene: 'act2_recruit_luyuan',
                effect: () => { _GS().flags['严格管理'] = true; _GS().relationships['赵铁柱'] = 20; _GS().population = (_GS().population || 0) + 20; }
            },
            {
                id: 'act2_recruit_luyuan',
                label: '只收强者',
                text: '只接纳能战斗的人',
                nextScene: 'act2_recruit_luyuan',
                effect: () => { _GS().flags['精英路线'] = true; _GS().relationships['赵铁柱'] = 5; _GS().population = (_GS().population || 0) + 8; }
            }
        ]
    },

    act2_recruit_luyuan: {
        id: 'act2_recruit_luyuan',
        number: '第23集',
        title: '陆远登场',
        atmosphere: '夜色深沉，安全屋内灯火通明',
        content: `
            <p>幸存者安顿下来后，林念晚注意到那个军人独自坐在角落，默默擦拭着军刀。她端着一碗热粥走了过去。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">……谢谢。我叫陆远，退伍前是特种侦察连的。末世那天，我的战友们都死了。</div>
                </div>
            </div>
            <p>他的声音很平静，但握刀的手微微发抖。林念晚的预感异能突然剧烈跳动——<span class="danger-text">这个男人将是她未来最重要的战友，也可能成为最大的变数</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">陆远，我需要一个能训练队伍、制定防御计划的人。你愿意留下来吗？</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_build_base',
                label: '坦诚相待',
                text: '告诉陆远自己的重生秘密',
                nextScene: 'act2_build_base',
                effect: () => { _GS().flags['信任陆远'] = true; _GS().relationships['陆远'] = 50; _GS().flags['重生秘密泄露_陆远'] = true; }
            },
            {
                id: 'act2_build_base',
                label: '合作提议',
                text: '只谈合作，不透露秘密',
                nextScene: 'act2_build_base',
                effect: () => { _GS().relationships['陆远'] = 30; }
            }
        ]
    },

    act2_build_base: {
        id: 'act2_build_base',
        number: '第24集',
        title: '基地建设',
        atmosphere: '机器轰鸣，工地上热火朝天',
        content: `
            <p>接下来的日子，林念晚全身心投入基地建设。陆远负责军事防御体系，赵铁柱带领工人加固建筑，而她则利用储物空间不断调拨物资。</p>
            <p>基地初具雏形：三层防御墙、独立供水系统、太阳能发电板、以及一个能容纳五十人的地下避难所。陆远甚至设计了一套简易的<span class="highlight">预警信号系统</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">林小姐，以目前的防御等级，能抵挡小型变异兽群。但如果遇到有组织的攻击……我们需要更多人手。</div>
                </div>
            </div>
            <p>就在这时，赵铁柱匆匆跑来报告：<span class="danger-text">"南边发现了一个大型幸存者基地，他们派人来了！"</span></p>
        `,
        choices: [
            {
                id: 'act2_fangqing',
                label: '亲自迎接',
                text: '去大门迎接来使，展示实力',
                nextScene: 'act2_fangqing',
                effect: () => { _GS().flags['强势外交'] = true; _GS().relationships['赵铁柱'] += 5; }
            },
            {
                id: 'act2_fangqing',
                label: '让陆远代劳',
                text: '让陆远代表自己谈判',
                nextScene: 'act2_fangqing',
                effect: () => { _GS().relationships['陆远'] += 10; }
            }
        ]
    },

    act2_fangqing: {
        id: 'act2_fangqing',
        number: '第25集',
        title: '方晴加入',
        atmosphere: '阴雨绵绵，来使队伍中有人高烧不退',
        content: `
            <p>大基地的来使共五人，领头的是个戴眼镜的中年男人，自称是"曙光基地"的外交官。但林念晚的目光被队伍中一个年轻女人吸引——她正蹲在地上，为一个发高烧的孩子检查体温。</p>
            <div class="dialogue-box">
                <div class="character-avatar">💉</div>
                <div class="dialogue-content">
                    <div class="character-name">方晴</div>
                    <div class="dialogue-text">这孩子是肺炎，不是变异感染。你们有阿莫西林吗？没有的话，用大蒜煮水也能暂时压制。</div>
                </div>
            </div>
            <p>方晴，前市第一人民医院的主治医师。末世后辗转多个基地，最终加入了曙光基地。但林念晚的预感告诉她：<span class="highlight">方晴的医术是末世中最珍贵的资源之一</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">方医生，曙光基地能给你什么？如果你来我这里，我可以保证药品和设备供应。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_big_base',
                label: '直接挖角',
                text: '当场邀请方晴加入自己的基地',
                nextScene: 'act2_big_base',
                effect: () => { _GS().relationships['方晴'] = 25; _GS().flags['方晴加入'] = true; _GS().inventory['医疗物资'] = (_GS().inventory['医疗物资'] || 0) + 30; }
            },
            {
                id: 'act2_big_base',
                label: '先礼后兵',
                text: '与曙光基地建立贸易关系，逐步拉拢方晴',
                nextScene: 'act2_big_base',
                effect: () => { _GS().money += 1000; _GS().relationships['方晴'] = 10; }
            }
        ]
    },

    // ==================== Ep 26-30: 大基地风云 ====================

    act2_big_base: {
        id: 'act2_big_base',
        number: '第26集',
        title: '进入大基地',
        atmosphere: '高墙耸立，铁门上焊着"曙光"二字',
        content: `
            <p>应曙光基地之邀，林念晚带着陆远和方晴前往谈判。曙光基地规模远超她的想象——围墙高达五米，内部有完整的农业区、武器库和指挥中心。</p>
            <p>基地首领是一个叫<span class="highlight">周天成</span>的男人。他穿着整洁的白衬衫，面带温和的微笑，仿佛末世从未发生过。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">林小姐，久仰大名。听说你的基地虽然不大，但物资储备令人惊叹。在这个时代，这可是了不起的成就。</div>
                </div>
            </div>
            <p>林念晚心头一凛。她的预感异能疯狂示警——<span class="danger-text">这个男人危险至极，远比任何变异兽都可怕</span>。</p>
        `,
        choices: [
            {
                id: 'act2_prophet_reveal',
                label: '谨慎应对',
                text: '保持低调，不暴露储物空间',
                nextScene: 'act2_prophet_reveal',
                effect: () => { _GS().flags['低调策略'] = true; _GS().relationships['周天成'] = 10; }
            },
            {
                id: 'act2_prophet_reveal',
                label: '展示实力',
                text: '适度展示物资能力，争取谈判筹码',
                nextScene: 'act2_prophet_reveal',
                effect: () => { _GS().flags['高调策略'] = true; _GS().relationships['周天成'] = 20; _GS().flags['先知身份暴露风险'] = true; }
            }
        ]
    },

    act2_prophet_reveal: {
        id: 'act2_prophet_reveal',
        number: '第27集',
        title: '先知身份曝光',
        atmosphere: '会议室灯光惨白，众人目光灼灼',
        content: `
            <p>谈判进行到一半，周天成突然话锋一转："林小姐，我听说你提前预知了三次天灾，救了不少人。有人甚至称你为'末世先知'。"</p>
            <p>全场寂静。林念晚面色不变，但心中警铃大作。<span class="danger-text">消息泄露了——有人在暗中监视她的基地。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">别紧张，我对先知只有敬意。在这个世界，预见未来的人比一整支军队都珍贵。我只想……合作。</div>
                </div>
            </div>
            <p>陆远的手悄悄按上了腰间的军刀。方晴推了推眼镜，目光在周天成和林念晚之间来回扫视。局势一触即发。</p>
        `,
        choices: [
            {
                id: 'act2_zhao_tiezhu',
                label: '坦然承认',
                text: '承认预知能力，但拒绝被利用',
                nextScene: 'act2_zhao_tiezhu',
                effect: () => { _GS().flags['公开先知身份'] = true; _GS().relationships['周天成'] += 15; _GS().relationships['陆远'] += 5; }
            },
            {
                id: 'act2_zhao_tiezhu',
                label: '巧妙回避',
                text: '说是运气好，淡化先知传言',
                nextScene: 'act2_zhao_tiezhu',
                effect: () => { _GS().flags['隐藏先知身份'] = true; _GS().relationships['周天成'] -= 5; }
            },
            {
                id: 'act2_zhao_tiezhu',
                label: '反将一军',
                text: '质疑周天成如何得知此事，暗示有内鬼',
                nextScene: 'act2_zhao_tiezhu',
                effect: () => { _GS().flags['反将一军'] = true; _GS().relationships['周天成'] -= 10; _GS().flags['怀疑内鬼'] = true; }
            }
        ]
    },

    act2_zhao_tiezhu: {
        id: 'act2_zhao_tiezhu',
        number: '第28集',
        title: '赵铁柱结盟',
        atmosphere: '篝火旁，酒碗碰撞声清脆',
        content: `
            <p>从曙光基地返回后，林念晚立刻召开内部会议。赵铁柱一拳砸在桌上："我就说那个周天成不是好东西！笑面虎一个！"</p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">林老大，你放心。我赵铁柱这条命是你救的。你说打谁，我第一个冲！我手下那二十号兄弟，个个都是硬骨头。</div>
                </div>
            </div>
            <p>陆远冷静地分析局势："周天成不会善罢甘休。他的基地有三千人，武器装备远超我们。<span class="danger-text">如果他想强攻，我们最多撑两天。</span>"</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">两天够了。我需要的不是硬扛，而是找到他的弱点。每个人都有弱点。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_conspiracy',
                label: '情报优先',
                text: '派陆远潜入曙光基地收集情报',
                nextScene: 'act2_conspiracy',
                effect: () => { _GS().flags['派遣间谍'] = true; _GS().relationships['陆远'] += 10; }
            },
            {
                id: 'act2_conspiracy',
                label: '联盟策略',
                text: '联络周边小基地，组建联盟对抗曙光',
                nextScene: 'act2_conspiracy',
                effect: () => { _GS().flags['组建联盟'] = true; _GS().money -= 800; _GS().population += 15; }
            }
        ]
    },

    act2_conspiracy: {
        id: 'act2_conspiracy',
        number: '第29集',
        title: '暗流涌动',
        atmosphere: '深夜，安全屋外巡逻队脚步声回荡',
        content: `
            <p>陆远带回了一个惊人的消息：曙光基地内部并非铁板一块。周天成虽然表面上是首领，但真正控制基地的是一支神秘的武装力量——他们自称<span class="danger-text">"新秩序"</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">新秩序的人不像是普通幸存者。他们的行动高度组织化，而且……我亲眼看到他们控制变异犬。那些狗听他们的命令。</div>
                </div>
            </div>
            <p>方晴神色凝重："我之前在曙光基地的实验室附近，闻到了奇怪的化学药剂味道。<span class="highlight">他们可能在用某种方式控制变异生物。</span>"</p>
            <p>林念晚闭上眼睛，预感异能如潮水般涌来。她看到了模糊的画面——一个巨大的地下实验室，成排的变异生物被关在笼子里，而站在中央的人……正是周天成。</p>
        `,
        choices: [
            {
                id: 'act2_crisis_base',
                label: '深入调查',
                text: '亲自潜入曙光基地的实验室',
                nextScene: 'act2_crisis_base',
                effect: () => { _GS().flags['亲自调查'] = true; _GS().goldenFinger.energy -= 20; }
            },
            {
                id: 'act2_crisis_base',
                label: '加强防御',
                text: '先确保基地安全，再图后计',
                nextScene: 'act2_crisis_base',
                effect: () => { _GS().flags['防御优先'] = true; _GS().inventory['防御材料'] = (_GS().inventory['防御材料'] || 0) + 50; }
            }
        ]
    },

    act2_crisis_base: {
        id: 'act2_crisis_base',
        number: '第30集',
        title: '基地危机',
        atmosphere: '警报声刺耳，火光映红了半边天空',
        content: `
            <p>深夜，刺耳的警报声撕裂了宁静。林念晚从睡梦中惊醒，预感异能疯狂跳动——<span class="danger-text">有变异兽群正在逼近基地！数量至少三百！</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">老大！北面围墙外全是变异兽！不是普通的兽群，它们……它们像是在有组织地进攻！</div>
                </div>
            </div>
            <p>陆远迅速判断："这不是自然行为。有人在驱赶它们。<span class="highlight">周天成在试探我们的实力。</span>"</p>
            <p>林念晚当机立断，从储物空间中取出大量燃油和武器。这一刻，她不再是一个人战斗——身后是二十多条信任她的生命。</p>
        `,
        choices: [
            {
                id: 'act2_investigate',
                label: '正面迎敌',
                text: '利用储物空间物资全力反击',
                nextScene: 'act2_investigate',
                effect: () => { _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 20; _GS().flags['击退兽群'] = true; _GS().relationships['赵铁柱'] += 15; _GS().relationships['陆远'] += 10; }
            },
            {
                id: 'act2_investigate',
                label: '诱敌深入',
                text: '故意打开一个缺口，将兽群引入陷阱区',
                nextScene: 'act2_investigate',
                effect: () => { _GS().flags['诱敌战术'] = true; _GS().inventory['燃油'] = (_GS().inventory['燃油'] || 0) - 30; _GS().flags['战术天才'] = true; }
            }
        ]
    },

    // ==================== Ep 31-35: 调查与觉醒 ====================

    act2_investigate: {
        id: 'act2_investigate',
        number: '第31集',
        title: '调查幕后黑手',
        atmosphere: '雨后的废墟，空气中弥漫着硝烟味',
        content: `
            <p>兽群退去后，林念晚在战场边缘发现了一个异常——一只变异狼的脖子上嵌着一个金属装置，上面刻着<span class="highlight">"NO"的标志</span>。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">"NO"……New Order，新秩序。这证实了我的猜测。周天成在用某种技术控制变异生物。</div>
                </div>
            </div>
            <p>方晴检查了装置后脸色大变："这是神经控制芯片，技术远超目前人类水平。<span class="danger-text">周天成背后可能有末世前就存在的秘密组织。</span>"</p>
            <p>林念晚握紧拳头。前世的记忆中，正是"新秩序"在末世后期控制了大部分变异生物，屠杀了无数幸存者。这一世，她绝不能让历史重演。</p>
        `,
        choices: [
            {
                id: 'act2_ability_awaken',
                label: '追踪信号',
                text: '利用装置追踪新秩序的据点',
                nextScene: 'act2_ability_awaken',
                effect: () => { _GS().flags['追踪新秩序'] = true; _GS().daysLeft -= 3; }
            },
            {
                id: 'act2_ability_awaken',
                label: '逆向研究',
                text: '让方晴研究装置，寻找破解方法',
                nextScene: 'act2_ability_awaken',
                effect: () => { _GS().flags['研究芯片'] = true; _GS().relationships['方晴'] += 15; }
            }
        ]
    },

    act2_ability_awaken: {
        id: 'act2_ability_awaken',
        number: '第32集',
        title: '异能觉醒',
        atmosphere: '雷电交加，紫色光芒从林念晚体内迸发',
        content: `
            <p>当夜，林念晚独自在安全屋顶层冥想，试图通过预感异能获取更多信息。突然，一道紫色的闪电劈中了附近的信号塔，巨大的能量波动涌入她的身体。</p>
            <p>剧痛之后是前所未有的清明。<span class="highlight">她的异能觉醒了——从模糊的预感升级为清晰的"未来视"。</span>她看到了三秒后的未来、三分钟后的未来，甚至三天后的片段。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这就是……真正的力量吗？前世我只有模糊的直觉，这一世竟然能看得如此清晰。</div>
                </div>
            </div>
            <p>但觉醒的代价同样巨大——<span class="danger-text">她的身体剧烈透支，储物空间的能量也大幅消耗</span>。未来视每次使用都会消耗生命力。</p>
        `,
        choices: [
            {
                id: 'act2_lin_xiaoyu',
                label: '测试能力',
                text: '立即测试未来视的极限',
                nextScene: 'act2_lin_xiaoyu',
                effect: () => { _GS().goldenFinger.level = 3; _GS().goldenFinger.energy -= 50; _GS().flags['未来视觉醒'] = true; }
            },
            {
                id: 'act2_lin_xiaoyu',
                label: '保守使用',
                text: '记录能力变化，暂不过度使用',
                nextScene: 'act2_lin_xiaoyu',
                effect: () => { _GS().goldenFinger.level = 3; _GS().goldenFinger.energy -= 20; _GS().flags['未来视觉醒'] = true; _GS().flags['保守觉醒'] = true; }
            }
        ]
    },

    act2_lin_xiaoyu: {
        id: 'act2_lin_xiaoyu',
        number: '第33集',
        title: '变异少女',
        atmosphere: '月光下，废墟中传来微弱的哭泣声',
        content: `
            <p>未来视觉醒后的第二天，林念晚在巡逻时感应到了一个异常信号。循着感觉，她在废墟深处发现了一个蜷缩在角落里的少女。</p>
            <p>少女约十五六岁，银白色的头发在月光下泛着微光。她的手臂上布满了<span class="highlight">淡蓝色的纹路，像是电路又像是血管</span>——那是变异的痕迹。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🌙</div>
                <div class="dialogue-content">
                    <div class="character-name">林小雨</div>
                    <div class="dialogue-text">别……别过来！我是怪物……我会伤害你们的！求你们快走！</div>
                </div>
            </div>
            <p>林念晚的未来视自动触发——她看到少女释放出一道蓝色的能量屏障，挡住了变异兽的攻击。<span class="highlight">这个女孩不是怪物，她是变异者中极罕见的"觉醒体"，拥有控制能量的能力。</span></p>
        `,
        choices: [
            {
                id: 'act2_boss_appear',
                label: '温柔接纳',
                text: '走上前拥抱少女，告诉她不是怪物',
                nextScene: 'act2_boss_appear',
                effect: () => { _GS().relationships['林小雨'] = 40; _GS().flags['林小雨加入'] = true; }
            },
            {
                id: 'act2_boss_appear',
                label: '理性评估',
                text: '先保持距离，观察她的能力',
                nextScene: 'act2_boss_appear',
                effect: () => { _GS().relationships['林小雨'] = 15; _GS().flags['观察林小雨'] = true; }
            }
        ]
    },

    act2_boss_appear: {
        id: 'act2_boss_appear',
        number: '第34集',
        title: '周天成登场',
        atmosphere: '浓雾弥漫，黑衣人从雾中走出',
        content: `
            <p>林小雨加入后的第三天，周天成亲自到访。他没有带大批随从，只身一人，穿着一尘不染的黑色风衣，微笑着站在安全屋大门前。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">林小姐，我亲自来是为了告诉你一件事——你收留的那个变异少女，是我一直在找的人。她的能力，是新秩序计划的关键。</div>
                </div>
            </div>
            <p>林念晚挡在林小雨身前，目光如刀。周天成却不以为意，继续说道：</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">当然，如果你愿意加入新秩序，我可以给你想要的一切——安全、权力、甚至……<span class="danger-text">逆转死亡的能力。</span>你不想救某个人吗？</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_truth',
                label: '严词拒绝',
                text: '明确拒绝周天成，宣战新秩序',
                nextScene: 'act2_truth',
                effect: () => { _GS().relationships['周天成'] = -50; _GS().flags['与新秩序宣战'] = true; _GS().relationships['林小雨'] += 20; }
            },
            {
                id: 'act2_truth',
                label: '虚与委蛇',
                text: '假意考虑，暗中准备反击',
                nextScene: 'act2_truth',
                effect: () => { _GS().relationships['周天成'] = -10; _GS().flags['假意合作'] = true; _GS().flags['获取情报机会'] = true; }
            },
            {
                id: 'act2_truth',
                label: '反试探',
                text: '追问"逆转死亡"的含义，试探他的底牌',
                nextScene: 'act2_truth',
                effect: () => { _GS().flags['逆转死亡线索'] = true; _GS().relationships['周天成'] -= 20; _GS().goldenFinger.energy -= 10; }
            }
        ]
    },

    act2_truth: {
        id: 'act2_truth',
        number: '第35集',
        title: '真相浮现',
        atmosphere: '地下档案室，微弱的灯光照亮旧报纸',
        content: `
            <p>周天成离开后，林念晚利用未来视回溯了他话语中的细节。她让陆远潜入曙光基地的档案室，找到了一份惊人的文件。</p>
            <p>文件显示：<span class="highlight">周天成并非普通幸存者。他是末世前一个秘密生物实验室的首席研究员，末世的爆发与他的实验有直接关系。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">💉</div>
                <div class="dialogue-content">
                    <div class="character-name">方晴</div>
                    <div class="dialogue-text">这份文件记载了一种名为"重生血清"的制剂。它能在特定条件下逆转细胞死亡……但需要觉醒体的能量作为催化剂。</div>
                </div>
            </div>
            <p>林念晚浑身冰冷。<span class="danger-text">周天成要林小雨，不是为了控制她，而是要用她的能量制造"重生血清"。而他自己……很可能已经使用了初代血清，这就是他能控制变异生物的原因。</span></p>
        `,
        choices: [
            {
                id: 'act2_identity_risk',
                label: '保护小雨',
                text: '加强林小雨的防护，不惜一切代价',
                nextScene: 'act2_identity_risk',
                effect: () => { _GS().flags['全力保护小雨'] = true; _GS().relationships['林小雨'] += 15; }
            },
            {
                id: 'act2_identity_risk',
                label: '主动出击',
                text: '趁周天成不备，突袭他的实验室',
                nextScene: 'act2_identity_risk',
                effect: () => { _GS().flags['突袭计划'] = true; _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 15; }
            }
        ]
    },

    // ==================== Ep 36-40: 身份暴露与第二高潮 ====================

    act2_identity_risk: {
        id: 'act2_identity_risk',
        number: '第36集',
        title: '身份暴露',
        atmosphere: '深夜，一封匿名信被塞进了安全屋大门',
        content: `
            <p>一封没有署名的信出现在安全屋门口。信上只有一行字：<span class="danger-text">"你不是第一次经历末世了，对吗？林念晚。"</span></p>
            <p>林念晚的手微微颤抖。重生——这是她最大的秘密，也是她最大的弱点。如果周天成知道了这件事，他就能预判她所有的决策。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">这封信的纸张是曙光基地内部使用的。有人在我们内部……或者周天成的情报网比我们想象的更广。</div>
                </div>
            </div>
            <p>方晴突然开口："林念晚，我需要问你一个问题。<span class="highlight">你真的……是从未来回来的吗？</span>"</p>
        `,
        choices: [
            {
                id: 'act2_betrayal',
                label: '对团队坦白',
                text: '向核心成员坦白重生真相',
                nextScene: 'act2_betrayal',
                effect: () => { _GS().flags['坦白重生'] = true; _GS().relationships['陆远'] += 20; _GS().relationships['方晴'] += 20; _GS().relationships['赵铁柱'] += 15; _GS().relationships['林小雨'] += 10; }
            },
            {
                id: 'act2_betrayal',
                label: '继续隐瞒',
                text: '否认重生，称信件是心理战',
                nextScene: 'act2_betrayal',
                effect: () => { _GS().flags['隐瞒重生'] = true; _GS().relationships['方晴'] -= 10; }
            }
        ]
    },

    act2_betrayal: {
        id: 'act2_betrayal',
        number: '第37集',
        title: '叛徒现身',
        atmosphere: '审讯室内，灯光昏暗，气氛压抑',
        content: `
            <p>经过排查，叛徒浮出水面——是赵铁柱手下的一个叫刘三的幸存者。他被周天成用"重生血清"的承诺收买，一直在暗中传递情报。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">刘三！我赵铁柱待你不薄！你居然出卖大家！</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">😈</div>
                <div class="dialogue-content">
                    <div class="character-name">刘三</div>
                    <div class="dialogue-text">铁柱哥，你不懂。周先生说了，末世结束后，他能让我们回到从前的生活。谁不想回去？</div>
                </div>
            </div>
            <p>林念晚冷冷地看着刘三。未来视告诉她——<span class="danger-text">刘三身上还藏着一个信号发射器，周天成此刻已经知道了基地的完整防御布局。</span></p>
        `,
        choices: [
            {
                id: 'act2_prepare_war',
                label: '果断处置',
                text: '没收发射器，将刘三永久驱逐',
                nextScene: 'act2_prepare_war',
                effect: () => { _GS().flags['驱逐叛徒'] = true; _GS().population -= 1; _GS().relationships['赵铁柱'] += 10; }
            },
            {
                id: 'act2_prepare_war',
                label: '将计就计',
                text: '利用刘三向周天成传递假情报',
                nextScene: 'act2_prepare_war',
                effect: () => { _GS().flags['反间计'] = true; _GS().flags['假情报'] = true; _GS().relationships['陆远'] += 15; }
            }
        ]
    },

    act2_prepare_war: {
        id: 'act2_prepare_war',
        number: '第38集',
        title: '战前准备',
        atmosphere: '全员备战，基地内弥漫着紧张气氛',
        content: `
            <p>林念晚知道，与周天成的决战不可避免。她召集所有核心成员，制定了详细的作战计划。</p>
            <p>陆远负责外围防御，利用地形设置三道防线。赵铁柱带领突击队，负责正面牵制。方晴准备了大量医疗物资和应急方案。而林小雨……<span class="highlight">她的能量屏障将成为最后的防线。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这一战，不是为了胜利，是为了生存。我们退无可退。身后就是我们的家，我们的亲人。谁都不许死。</div>
                </div>
            </div>
            <p>她从储物空间中取出了所有储备的武器、弹药和食物。<span class="danger-text">未来视显示，三天后黎明，新秩序将发动总攻。</span></p>
        `,
        choices: [
            {
                id: 'act2_siege_begin',
                label: '全面备战',
                text: '启动所有防御工事，进入最高警戒',
                nextScene: 'act2_siege_begin',
                effect: () => { _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 30; _GS().inventory['防御材料'] = (_GS().inventory['防御材料'] || 0) - 40; _GS().flags['最高警戒'] = true; }
            },
            {
                id: 'act2_siege_begin',
                label: '主动出击',
                text: '在敌人进攻前发动突袭，打乱部署',
                nextScene: 'act2_siege_begin',
                effect: () => { _GS().flags['先发制人'] = true; _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 40; _GS().relationships['陆远'] += 10; }
            }
        ]
    },

    act2_siege_begin: {
        id: 'act2_siege_begin',
        number: '第39集',
        title: '围攻开始',
        atmosphere: '黎明前的黑暗，大地在颤抖',
        content: `
            <p>第三天黎明，如未来视所预言，新秩序的军队如期而至。黑压压的人群从四面八方涌来，领头的是被芯片控制的变异兽群。</p>
            <p><span class="danger-text">变异巨狼、装甲蜥蜴、飞行蝠群——至少五百只变异生物，配合着两百名全副武装的新秩序士兵。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">第一道防线已接敌！变异巨狼冲撞力极强，普通路障挡不住！赵铁柱，带人上二楼用交叉火力压制！</div>
                </div>
            </div>
            <p>爆炸声、嘶吼声、枪声交织在一起。林念晚站在指挥台上，未来视不断闪现——她能看到敌人三秒后的动作，每一个指令都精准无比。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成（广播）</div>
                    <div class="dialogue-text">林念晚，交出那个女孩，我可以让其他人活。你是个聪明人，应该知道螳臂当车的下场。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_climax',
                label: '坚决抵抗',
                text: '拒绝投降，指挥全员死战到底',
                nextScene: 'act2_climax',
                effect: () => { _GS().flags['死战不退'] = true; _GS().relationships['赵铁柱'] += 20; _GS().relationships['陆远'] += 15; _GS().relationships['林小雨'] += 10; }
            },
            {
                id: 'act2_climax',
                label: '声东击西',
                text: '假装谈判，暗中让林小雨从地下通道撤离',
                nextScene: 'act2_climax',
                effect: () => { _GS().flags['声东击西'] = true; _GS().relationships['林小雨'] += 20; _GS().flags['小雨撤离'] = true; }
            }
        ]
    },

    act2_climax: {
        id: 'act2_climax',
        number: '第40集',
        title: '安全屋保卫战',
        atmosphere: '火海连天，安全屋在烈焰中巍然不动',
        content: `
            <p><span class="danger-text">【第二高潮】</span>战斗进入白热化。第一道防线被突破，第二道防线摇摇欲坠。赵铁柱身负重伤，仍挥舞着铁管站在缺口处。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">来啊！谁想过去，先从老子尸体上踏过去！</div>
                </div>
            </div>
            <p>就在这千钧一发之际，林小雨释放了全部力量——一道巨大的<span class="highlight">蓝色能量屏障</span>笼罩了整个基地，将所有变异生物隔绝在外。但她的身体开始崩溃，蓝色的纹路蔓延到脸上。</p>
            <p>林念晚的未来视看到了唯一的胜机——她冲向能量屏障的核心，将自己的异能注入其中。<span class="highlight">两个异能产生共鸣，爆发出前所未有的力量，将所有变异生物的芯片同时摧毁！</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">周天成……你的棋子，我全部打翻了。下一局，轮到我进攻了。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_aftermath',
                label: '乘胜追击',
                text: '趁新秩序溃败，发动反攻',
                nextScene: 'act2_aftermath',
                effect: () => { _GS().flags['乘胜追击'] = true; _GS().relationships['周天成'] -= 30; _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 10; }
            },
            {
                id: 'act2_aftermath',
                label: '休养生息',
                text: '趁敌人撤退，优先救治伤员',
                nextScene: 'act2_aftermath',
                effect: () => { _GS().flags['休养生息'] = true; _GS().relationships['方晴'] += 20; _GS().relationships['赵铁柱'] += 15; _GS().inventory['医疗物资'] = (_GS().inventory['医疗物资'] || 0) - 20; }
            }
        ]
    },

    // ==================== Ep 41-45: 终极危机 ====================

    act2_aftermath: {
        id: 'act2_aftermath',
        number: '第41集',
        title: '战后重建',
        atmosphere: '硝烟散去，阳光穿透云层洒在废墟上',
        content: `
            <p>安全屋保卫战以惨胜告终。基地损毁严重，三分之一的建筑需要重建。赵铁柱断了三根肋骨，方晴连续手术十八小时才稳住伤员。</p>
            <p>但最大的损失是林小雨——她过度使用能力后陷入昏迷，<span class="danger-text">蓝色的纹路正在缓慢吞噬她的身体</span>。方晴表示，如果不找到解决办法，她可能撑不过一个月。</p>
            <div class="dialogue-box">
                <div class="character-avatar">💉</div>
                <div class="dialogue-content">
                    <div class="character-name">方晴</div>
                    <div class="dialogue-text">她的身体正在被变异能量同化。唯一可能逆转的方法……就是周天成提到的"重生血清"。讽刺吗？敌人的武器，可能是救她的唯一希望。</div>
                </div>
            </div>
            <p>林念晚握着林小雨冰冷的手，做出了决定。</p>
        `,
        choices: [
            {
                id: 'act2_final_clue',
                label: '寻找血清',
                text: '出发寻找重生血清的配方',
                nextScene: 'act2_final_clue',
                effect: () => { _GS().flags['寻找血清'] = true; _GS().relationships['林小雨'] += 20; }
            },
            {
                id: 'act2_final_clue',
                label: '另寻他法',
                text: '让方晴研究替代方案，不依赖敌人',
                nextScene: 'act2_final_clue',
                effect: () => { _GS().flags['另寻他法'] = true; _GS().relationships['方晴'] += 15; _GS().daysLeft -= 5; }
            }
        ]
    },

    act2_final_clue: {
        id: 'act2_final_clue',
        number: '第42集',
        title: '最终线索',
        atmosphere: '地下实验室的残骸中，微光闪烁',
        content: `
            <p>陆远在战场废墟中找到了一个被炸毁的通讯设备，从中恢复了一段加密通讯。解码后，内容令人震惊——</p>
            <p><span class="highlight">周天成的新秩序总部不在曙光基地，而是在城市北部的地下军事掩体中。那里有完整的生物实验室和重生血清的生产线。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">通讯中还提到了一个代号——"创世纪"。似乎是周天成的终极计划。具体内容被加密了，但有一句话是明文："当创世纪完成，新世界将诞生。"</div>
                </div>
            </div>
            <p>林念晚的未来视再次触发。她看到了掩体入口的画面——<span class="danger-text">厚重的钢铁大门，两侧站着变异守卫，大门上刻着"新秩序"的标志。</span></p>
        `,
        choices: [
            {
                id: 'act2_journey_start',
                label: '立即出发',
                text: '带领核心团队直捣黄龙',
                nextScene: 'act2_journey_start',
                effect: () => { _GS().flags['直捣黄龙'] = true; _GS().goldenFinger.energy -= 30; }
            },
            {
                id: 'act2_journey_start',
                label: '充分准备',
                text: '花时间收集情报和物资后再出发',
                nextScene: 'act2_journey_start',
                effect: () => { _GS().flags['充分准备'] = true; _GS().money -= 500; _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) + 30; _GS().inventory['医疗物资'] = (_GS().inventory['医疗物资'] || 0) + 20; _GS().daysLeft -= 5; }
            }
        ]
    },

    act2_journey_start: {
        id: 'act2_journey_start',
        number: '第43集',
        title: '踏上征途',
        atmosphere: '清晨，队伍整装待发，目光坚定',
        content: `
            <p>林念晚将基地托付给赵铁柱，带领陆远、方晴和昏迷中的林小雨踏上征途。临行前，赵铁柱塞给她一个布包。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🔨</div>
                <div class="dialogue-content">
                    <div class="character-name">赵铁柱</div>
                    <div class="dialogue-text">林老大，这是我攒的所有弹药。你放心去，基地有我守着。你活着回来，我请你喝酒。</div>
                </div>
            </div>
            <p>通往北部掩体的道路危机四伏。未来视显示，路上将遭遇三波变异兽群和一个被新秩序控制的检查站。<span class="danger-text">但最大的危险，来自周天成本人——他已经知道林念晚在来的路上。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">走吧。这一世，我不会再让任何人死在我面前。周天成，你的末日到了。</div>
                </div>
            </div>
        `,
        choices: [
            {
                id: 'act2_danger_zone',
                label: '走大路',
                text: '沿高速公路前进，速度快但暴露风险高',
                nextScene: 'act2_danger_zone',
                effect: () => { _GS().flags['走大路'] = true; _GS().daysLeft -= 2; }
            },
            {
                id: 'act2_danger_zone',
                label: '走小路',
                text: '穿越废墟和地下通道，安全但缓慢',
                nextScene: 'act2_danger_zone',
                effect: () => { _GS().flags['走小路'] = true; _GS().daysLeft -= 4; _GS().inventory['医疗物资'] = (_GS().inventory['医疗物资'] || 0) - 10; }
            }
        ]
    },

    act2_danger_zone: {
        id: 'act2_danger_zone',
        number: '第44集',
        title: '危险地带',
        atmosphere: '废弃隧道中，回声阵阵，危机四伏',
        content: `
            <p>队伍在行进中遭遇了第一波变异兽群——一群速度极快的变异猎豹。陆远凭借军事素养指挥战斗，方晴用自制的燃烧瓶封锁了隧道入口。</p>
            <p>但真正的危机在第二波——一个被新秩序改造过的<span class="danger-text">变异巨人</span>挡住了去路。它身高五米，全身覆盖着金属甲片，芯片闪烁着红光。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎖️</div>
                <div class="dialogue-content">
                    <div class="character-name">陆远</div>
                    <div class="dialogue-text">这是新型改造体！普通武器根本打不穿它的甲片！林念晚，你的未来视能看到它的弱点吗？</div>
                </div>
            </div>
            <p>林念晚集中全部异能，未来视终于捕捉到了关键信息——<span class="highlight">金属甲片的连接处有一个拳头大小的缝隙，芯片就在缝隙后面。</span></p>
        `,
        choices: [
            {
                id: 'act2_finale',
                label: '精准打击',
                text: '让陆远射击缝隙中的芯片',
                nextScene: 'act2_finale',
                effect: () => { _GS().flags['精准打击'] = true; _GS().relationships['陆远'] += 15; _GS().inventory['武器弹药'] = (_GS().inventory['武器弹药'] || 0) - 5; }
            },
            {
                id: 'act2_finale',
                label: '异能突破',
                text: '林念晚亲自用异能摧毁芯片',
                nextScene: 'act2_finale',
                effect: () => { _GS().flags['异能突破'] = true; _GS().goldenFinger.energy -= 40; _GS().goldenFinger.level = 4; }
            }
        ]
    },

    act2_finale: {
        id: 'act2_finale',
        number: '第45集',
        title: '第二幕终章',
        atmosphere: '掩体入口在望，钢铁巨门上的标志在月光下闪烁',
        content: `
            <p>经过三天三夜的跋涉，林念晚终于站在了新秩序总部的入口前。巨大的钢铁大门在月光下泛着冷光，"新秩序"三个字如同烙印。</p>
            <p>陆远检查了外围防御："守卫比预想的少。周天成似乎在……<span class="highlight">等待我们。</span>"</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成（广播）</div>
                    <div class="dialogue-text">欢迎光临，末世先知。我等你很久了。进来吧——创世纪的真相，就在里面。你准备好了吗？</div>
                </div>
            </div>
            <p>方晴背着重伤的林小雨，目光坚定。陆远握紧军刀。林念晚深吸一口气，推开未来视的极限——她看到了门后的景象：无尽的实验舱、成排的变异生物、以及一个巨大的装置——<span class="danger-text">"创世纪"。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">（低声）前世我没能阻止这一切。这一世……结局会不同。</div>
                </div>
            </div>
            <p><span class="highlight">第二幕·势力崛起·对抗篇——完</span></p>
        `,
        choices: [
            {
                id: 'act3_start',
                label: '推门而入',
                text: '推开钢铁大门，直面周天成',
                nextScene: 'act3_start',
                effect: () => { _GS().flags['进入新秩序总部'] = true; _GS().flags['第二幕完成'] = true; }
            },
            {
                id: 'act3_start',
                label: '制定计划',
                text: '先观察入口防御，制定突入方案',
                nextScene: 'act3_start',
                effect: () => { _GS().flags['谨慎突入'] = true; _GS().flags['第二幕完成'] = true; _GS().relationships['陆远'] += 10; }
            }
        ]
    }
};


// ==================== 第三幕：终极决战·新秩序篇 ====================
const Scenes_Act3 = {

    // ============================================================
    // Ep 46 - 进入终极废墟区
    // ============================================================
    act3_wasteland: {
        id: 'act3_wasteland',
        number: '第46集',
        title: '废墟深渊',
        atmosphere: '灰烬漫天，大地龟裂，远处传来低沉咆哮',
        content: `
            <p>林念晚站在废墟边缘，眼前是一片被天灾彻底摧毁的死地。空气中弥漫着腐朽与硫磺的味道，地面上布满了深不见底的裂缝。</p>
            <p>储物空间Lv.3的容量已经塞满了物资，但面对这片未知领域，她心中第一次涌起真正的恐惧。<span class="danger-text">前方探测到大量变异生物活动痕迹，能量反应超出已知等级。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这就是终极期……比我想象的还要可怕。但退缩已经不是一个选项了。</div>
                </div>
            </div>
            <p>异能预感突然剧烈震动，仿佛在警告她——前方有一条不可回头的路。身后，幸存者基地的灯火在灰暗中摇曳，那是她守护的一切。</p>
        `,
        choices: [
            {
                id: 'act3_wasteland_fight',
                label: '战斗',
                text: '正面突破，清除前方变异生物',
                nextScene: 'act3_ruins_city',
                effect: () => {
                    _GS().stats.combat += 15;
                    _GS().resources.ammo -= 30;
                    _GS().flags.playstyle = _GS().flags.playstyle || 'aggressive';
                }
            },
            {
                id: 'act3_wasteland_stealth',
                label: '潜行',
                text: '利用废墟地形隐蔽前进',
                nextScene: 'act3_ruins_city',
                effect: () => {
                    _GS().stats.stealth += 15;
                    _GS().stats.morale += 5;
                    _GS().flags.playstyle = _GS().flags.playstyle || 'stealth';
                }
            },
            {
                id: 'act3_wasteland_scan',
                label: '侦查',
                text: '释放异能探测前方危险',
                nextScene: 'act3_ruins_city',
                effect: () => {
                    _GS().stats.ability += 10;
                    _GS().flags.scanned = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 47 - 废墟城市遭遇战
    // ============================================================
    act3_ruins_city: {
        id: 'act3_ruins_city',
        number: '第47集',
        title: '死城惊魂',
        atmosphere: '残垣断壁间，变异藤蔓缠绕着摩天大楼',
        content: `
            <p>进入废弃都市的核心区域，林念晚发现这里已经变成了变异生物的巢穴。巨大的藤蔓从建筑裂缝中生长出来，像是大地的血管在搏动。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这些藤蔓……它们在输送某种能量。这整座城市就像一个活着的有机体。</div>
                </div>
            </div>
            <p><span class="danger-text">突然，三只S级变异兽从废墟中跃出！它们的眼中闪烁着诡异的红光，行动比之前遇到的任何变异生物都要敏捷。</span></p>
            <p>战斗一触即发。林念晚迅速评估局势——硬拼消耗太大，但绕路可能陷入更大的包围。异能预感告诉她，这些变异兽是在<span class="highlight">守护某条通往地下的通道</span>。</p>
        `,
        choices: [
            {
                id: 'act3_ruins_fight',
                label: '战斗',
                text: '全力战斗，击杀三只S级变异兽',
                nextScene: 'act3_hidden_base',
                effect: () => {
                    _GS().stats.combat += 20;
                    _GS().resources.ammo -= 50;
                    _GS().stats.hp -= 20;
                    _GS().flags.killed_s_rank = true;
                }
            },
            {
                id: 'act3_ruins_lure',
                label: '智取',
                text: '用储物空间中的食物引开变异兽',
                nextScene: 'act3_hidden_base',
                effect: () => {
                    _GS().stats.intelligence += 15;
                    _GS().resources.food -= 20;
                    _GS().flags.lured_beasts = true;
                }
            },
            {
                id: 'act3_ruins_ability',
                label: '异能',
                text: '爆发异能震慑变异兽，强行通过',
                nextScene: 'act3_hidden_base',
                effect: () => {
                    _GS().stats.ability += 20;
                    _GS().stats.stamina -= 30;
                    _GS().flags.ability_burst = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 48 - 发现地下基地入口
    // ============================================================
    act3_hidden_base: {
        id: 'act3_hidden_base',
        number: '第48集',
        title: '深渊之门',
        atmosphere: '地下入口散发着幽蓝光芒，空气中充满能量波动',
        content: `
            <p>在变异兽守护的通道尽头，林念晚发现了一扇巨大的金属门。门上刻着陌生的符号，中央有一个正在缓缓旋转的能量核心。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">这些符号……我在末世前的科研档案中见过。这是"创世纪计划"的标志——天灾的源头就在这里面。</div>
                </div>
            </div>
            <p>异能预感疯狂示警。<span class="danger-text">这不是一个普通的实验室，而是一个庞大的地下城市。能量读数显示，深处有一个远超人类认知的力量源。</span></p>
            <p>金属门感应到她的靠近，缓缓开启。一股冰冷而强大的气息扑面而来。<span class="highlight">在门的内侧，她看到了一行字："欢迎回来，林念晚。"——她从未告诉过任何人她的全名。</span></p>
        `,
        choices: [
            {
                id: 'act3_hidden_enter',
                label: '深入',
                text: '毫不犹豫地进入地下基地',
                nextScene: 'act3_trap',
                effect: () => {
                    _GS().stats.courage += 15;
                    _GS().flags.entered_base = true;
                }
            },
            {
                id: 'act3_hidden_prepare',
                label: '准备',
                text: '先整理装备和物资再进入',
                nextScene: 'act3_trap',
                effect: () => {
                    _GS().stats.defense += 10;
                    _GS().stats.hp = Math.min(_GS().stats.hp + 20, 100);
                    _GS().flags.prepared = true;
                }
            },
            {
                id: 'act3_hidden_signal',
                label: '通讯',
                text: '向盟友发送坐标信号',
                nextScene: 'act3_trap',
                effect: () => {
                    _GS().flags.sent_signal = true;
                    _GS().stats.morale += 10;
                    _GS().flags.allies_informed = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 49 - 陷入Boss陷阱
    // ============================================================
    act3_trap: {
        id: 'act3_trap',
        number: '第49集',
        title: '困兽之斗',
        atmosphere: '金属墙壁缓缓合拢，红色警报灯疯狂闪烁',
        content: `
            <p>林念晚刚踏入基地核心区域，四周的金属墙壁便开始缓缓合拢。红色警报灯亮起，一个全息投影出现在她面前。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">等你很久了，林念晚。你的储物空间和异能……都是我计划的一部分。你以为你是天选之人？不，你只是我最好的作品。</div>
                </div>
            </div>
            <p><span class="danger-text">周天成——"新秩序"的首领，天灾的幕后推手。他揭示了惊人的真相：变异生物的源头、异能的觉醒、甚至末世本身，都源于他控制的"创世纪"能量。</span></p>
            <p>林念晚被困在一个不断缩小的空间里，毒气开始渗入。<span class="highlight">就在她即将失去意识的那一刻，储物空间深处有什么东西在剧烈震动——一个她从未注意过的隐藏区域正在觉醒。</span></p>
        `,
        choices: [
            {
                id: 'act3_trap_break',
                label: '突破',
                text: '燃烧异能强行破开金属墙壁',
                nextScene: 'act3_time_awaken',
                effect: () => {
                    _GS().stats.ability += 25;
                    _GS().stats.stamina -= 40;
                    _GS().stats.hp -= 15;
                    _GS().flags.broke_wall = true;
                }
            },
            {
                id: 'act3_trap_space',
                label: '空间',
                text: '尝试激活储物空间的隐藏功能',
                nextScene: 'act3_time_awaken',
                effect: () => {
                    _GS().stats.ability += 20;
                    _GS().flags.space_attempt = true;
                }
            },
            {
                id: 'act3_trap_stall',
                label: '拖延',
                text: '与周天成对话，争取时间寻找破绽',
                nextScene: 'act3_time_awaken',
                effect: () => {
                    _GS().stats.intelligence += 15;
                    _GS().flags.boss_info = true;
                    _GS().flags.stall_for_time = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 50 - 时间回溯觉醒
    // ============================================================
    act3_time_awaken: {
        id: 'act3_time_awaken',
        number: '第50集',
        title: '时间回溯',
        atmosphere: '时空裂缝撕开，金色光芒与黑暗交织',
        content: `
            <p>在生死存亡的瞬间，林念晚体内爆发出前所未有的力量。储物空间的隐藏区域彻底开启——<span class="highlight">那是"时间回溯"的力量，一个被刻意封印的终极异能。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">时间……在倒流？不，不是倒流，是我能看到时间的脉络了。周天成，你的每一个计划，我都看得清清楚楚。</div>
                </div>
            </div>
            <p>时间回溯让她看到了三分钟后的未来——周天成将释放终极变异武器，毁灭方圆百里内所有生命。她只有一次机会阻止这一切。</p>
            <p><span class="danger-text">但时间回溯的代价极大，每次使用都会消耗生命力。林念晚感到全身的细胞在加速衰老，她知道自己不可能无限次使用这个能力。</span></p>
        `,
        choices: [
            {
                id: 'act3_time_escape',
                label: '撤离',
                text: '利用时间回溯找到安全撤离路线',
                nextScene: 'act3_alliance',
                effect: () => {
                    _GS().flags.time_power = true;
                    _GS().stats.hp -= 10;
                    _GS().flags.escaped_trap = true;
                }
            },
            {
                id: 'act3_time_counter',
                label: '反击',
                text: '预判周天成的下一步，设下反陷阱',
                nextScene: 'act3_alliance',
                effect: () => {
                    _GS().flags.time_power = true;
                    _GS().stats.ability += 30;
                    _GS().stats.hp -= 20;
                    _GS().flags.counter_trap = true;
                }
            },
            {
                id: 'act3_time_spy',
                label: '窥探',
                text: '深入回溯，探查周天成的完整计划',
                nextScene: 'act3_alliance',
                effect: () => {
                    _GS().flags.time_power = true;
                    _GS().stats.intelligence += 25;
                    _GS().stats.hp -= 15;
                    _GS().flags.knows_full_plan = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 51 - 召集盟友
    // ============================================================
    act3_alliance: {
        id: 'act3_alliance',
        number: '第51集',
        title: '最后的集结',
        atmosphere: '黎明破晓，幸存者从四面八方汇聚',
        content: `
            <p>林念晚带着从周天成基地获取的情报回到幸存者营地。她召集了所有信任的伙伴——战士陈锋、医生苏瑶、工程师老张，以及沿途结识的各个幸存者团队。</p>
            <div class="dialogue-box">
                <div class="character-avatar">⚔️</div>
                <div class="dialogue-content">
                    <div class="character-name">陈锋</div>
                    <div class="dialogue-text">念晚，你说那个周天成能控制变异生物？那我们之前打的那些仗……都是他在背后操控？</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">没错。但我也发现了他的弱点——"创世纪"能量核心。只要摧毁它，所有变异生物都会失去控制。这是一场我们必须赢的战争。</div>
                </div>
            </div>
            <p><span class="highlight">林念晚展示了时间回溯的能力，赢得了所有人的信任。最终，一支由200名精锐战士组成的"黎明军团"正式成立。</span></p>
        `,
        choices: [
            {
                id: 'act3_alliance_full',
                label: '全力出击',
                text: '带领全部兵力正面进攻Boss基地',
                nextScene: 'act3_final_battle',
                effect: () => {
                    _GS().stats.combat += 20;
                    _GS().stats.morale += 15;
                    _GS().flags.full_army = true;
                    _GS().flags.army_size = 200;
                }
            },
            {
                id: 'act3_alliance_elite',
                label: '精英突袭',
                text: '只带核心小队秘密潜入',
                nextScene: 'act3_final_battle',
                effect: () => {
                    _GS().stats.stealth += 20;
                    _GS().flags.elite_team = true;
                    _GS().flags.army_size = 10;
                }
            },
            {
                id: 'act3_alliance_divide',
                label: '分兵作战',
                text: '兵分三路，同时攻击多个入口',
                nextScene: 'act3_final_battle',
                effect: () => {
                    _GS().stats.intelligence += 15;
                    _GS().stats.combat += 10;
                    _GS().flags.divided_forces = true;
                    _GS().flags.army_size = 200;
                }
            }
        ]
    },

    // ============================================================
    // Ep 52 - 终极决战开始
    // ============================================================
    act3_final_battle: {
        id: 'act3_final_battle',
        number: '第52集',
        title: '终极决战',
        atmosphere: '天空被变异能量染成血红色，大地震颤',
        content: `
            <p>黎明军团向周天成的地下基地发起了总攻。变异生物如潮水般涌来，天空被能量风暴撕裂，整个废墟区变成了一个巨大的战场。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">来吧，林念晚。让我看看"创世纪"最完美的作品，能走到哪一步。你的时间回溯……不过是我留给你的玩具罢了。</div>
                </div>
            </div>
            <p><span class="danger-text">周天成释放了终极变异武器——一只融合了数十种生物基因的SSS级变异巨兽。它身高超过五十米，每一次呼吸都会引发地震。</span></p>
            <p>战场陷入混乱。陈锋带领的正面部队伤亡惨重，苏瑶的医疗帐篷被波及。林念晚必须做出决定——是先解决巨兽，还是直取周天成？</p>
        `,
        choices: [
            {
                id: 'act3_battle_giant',
                label: '决战巨兽',
                text: '亲自迎战SSS级变异巨兽',
                nextScene: 'act3_boss_fight',
                effect: () => {
                    _GS().stats.combat += 25;
                    _GS().stats.hp -= 25;
                    _GS().flags.fought_giant = true;
                    _GS().flags.casualties = 'medium';
                }
            },
            {
                id: 'act3_battle_boss',
                label: '直取Boss',
                text: '趁乱绕过巨兽，直奔周天成',
                nextScene: 'act3_boss_fight',
                effect: () => {
                    _GS().stats.ability += 20;
                    _GS().flags.went_for_boss = true;
                    _GS().flags.casualties = 'heavy';
                }
            },
            {
                id: 'act3_battle_command',
                label: '指挥',
                text: '坐镇指挥，协调全军作战',
                nextScene: 'act3_boss_fight',
                effect: () => {
                    _GS().stats.intelligence += 20;
                    _GS().stats.morale += 10;
                    _GS().flags.commanded_battle = true;
                    _GS().flags.casualties = 'low';
                }
            }
        ]
    },

    // ============================================================
    // Ep 53 - Boss战第一阶段
    // ============================================================
    act3_boss_fight: {
        id: 'act3_boss_fight',
        number: '第53集',
        title: '宿命之战',
        atmosphere: '能量核心室中，两股力量激烈碰撞',
        content: `
            <p>林念晚终于与周天成面对面。能量核心室是一个巨大的球形空间，中央悬浮着一颗散发蓝光的能量球体——"创世纪"的核心。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">你知道我为什么创造末世吗？因为人类已经烂透了。只有毁灭，才能让真正的强者站出来。而你，林念晚，就是那个强者。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">你毁了整个世界，杀了无数人，就为了你那扭曲的理想？周天成，今天就是你的末日。</div>
                </div>
            </div>
            <p><span class="danger-text">周天成启动了能量核心的防御系统，整个空间开始坍缩。他自身也展现出惊人的力量——他同样拥有异能，而且已经进化到了超越人类极限的阶段。</span></p>
        `,
        choices: [
            {
                id: 'act3_boss1_time',
                label: '时间回溯',
                text: '使用时间回溯预判Boss攻击',
                nextScene: 'act3_boss_fight2',
                effect: () => {
                    _GS().stats.ability += 25;
                    _GS().stats.hp -= 20;
                    _GS().flags.used_time_in_fight = true;
                }
            },
            {
                id: 'act3_boss1_space',
                label: '空间压制',
                text: '用储物空间的力量封锁Boss行动',
                nextScene: 'act3_boss_fight2',
                effect: () => {
                    _GS().stats.ability += 15;
                    _GS().stats.defense += 15;
                    _GS().flags.used_space_in_fight = true;
                }
            },
            {
                id: 'act3_boss1_all_out',
                label: '全力爆发',
                text: '同时释放所有异能，以命相搏',
                nextScene: 'act3_boss_fight2',
                effect: () => {
                    _GS().stats.combat += 30;
                    _GS().stats.hp -= 35;
                    _GS().flags.all_out_attack = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 54 - Boss战第二阶段
    // ============================================================
    act3_boss_fight2: {
        id: 'act3_boss_fight2',
        number: '第54集',
        title: '绝境逢生',
        atmosphere: '能量核心濒临崩溃，空间裂缝不断扩大',
        content: `
            <p>周天成被逼入绝境，他做出了疯狂的决定——将自己与"创世纪"核心融合，试图获得神一般的力量。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">如果我不能统治新世界，那就让这个世界陪我一起毁灭！创世纪，终极指令——释放全部能量！</div>
                </div>
            </div>
            <p><span class="danger-text">核心能量开始失控，整座地下基地即将爆炸。冲击波足以摧毁地表方圆五百公里内的一切。林念晚只有不到五分钟的时间。</span></p>
            <p>时间回溯告诉她，<span class="highlight">只有一个办法能阻止爆炸——她必须进入能量核心内部，用自己的异能逆转核心的运行方向。但这样做的人，可能再也出不来了。</span></p>
        `,
        choices: [
            {
                id: 'act3_boss2_enter',
                label: '进入核心',
                text: '进入能量核心内部阻止爆炸',
                nextScene: 'act3_victory',
                effect: () => {
                    _GS().stats.hp -= 40;
                    _GS().flags.entered_core = true;
                    _GS().flags.heroic_choice = true;
                }
            },
            {
                id: 'act3_boss2_destroy',
                label: '摧毁核心',
                text: '从外部全力摧毁能量核心',
                nextScene: 'act3_victory',
                effect: () => {
                    _GS().stats.combat += 20;
                    _GS().stats.hp -= 30;
                    _GS().flags.destroyed_core = true;
                    _GS().flags.destruction_path = true;
                }
            },
            {
                id: 'act3_boss2_seal',
                label: '封印核心',
                text: '用储物空间封印能量核心',
                nextScene: 'act3_victory',
                effect: () => {
                    _GS().stats.ability += 25;
                    _GS().stats.hp -= 25;
                    _GS().flags.sealed_core = true;
                    _GS().flags.seal_path = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 55 - 击败Boss
    // ============================================================
    act3_victory: {
        id: 'act3_victory',
        number: '第55集',
        title: '黎明破晓',
        atmosphere: '爆炸的余波散去，第一缕阳光穿透阴霾',
        content: `
            <p>能量核心的蓝光终于熄灭。周天成的身体在失去核心支撑后迅速衰败，他跪倒在地，眼中满是不甘。</p>
            <div class="dialogue-box">
                <div class="character-avatar">🎭</div>
                <div class="dialogue-content">
                    <div class="character-name">周天成</div>
                    <div class="dialogue-text">你赢了……但你觉得这就结束了吗？创世纪的种子已经散布到全世界。没有了我，变异生物只会更加失控。你拯救不了任何人。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">也许你说得对。但至少，我试过了。而试过的人，永远不会输。</div>
                </div>
            </div>
            <p><span class="highlight">周天成消散在光芒中。随着核心的毁灭，散布在空气中的"创世纪"能量开始迅速衰减。远处，变异生物发出痛苦的嘶吼，然后纷纷倒下。天灾……终于要结束了。</span></p>
        `,
        choices: [
            {
                id: 'act3_victory_rest',
                label: '休整',
                text: '就地休整，救治伤员',
                nextScene: 'act3_aftermath',
                effect: () => {
                    _GS().stats.hp = Math.min(_GS().stats.hp + 30, 100);
                    _GS().stats.morale += 15;
                    _GS().flags.healed = true;
                }
            },
            {
                id: 'act3_victory_search',
                label: '搜索',
                text: '搜索基地，寻找有用资源和技术',
                nextScene: 'act3_aftermath',
                effect: () => {
                    _GS().resources.food += 50;
                    _GS().resources.ammo += 40;
                    _GS().resources.medicine += 30;
                    _GS().flags.looted_base = true;
                }
            },
            {
                id: 'act3_victory_return',
                label: '凯旋',
                text: '立刻返回幸存者基地宣布胜利',
                nextScene: 'act3_aftermath',
                effect: () => {
                    _GS().stats.morale += 25;
                    _GS().flags.early_return = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 56 - 战后废墟
    // ============================================================
    act3_aftermath: {
        id: 'act3_aftermath',
        number: '第56集',
        title: '废墟新生',
        atmosphere: '阳光重新照耀大地，但废墟中仍有危险潜伏',
        content: `
            <p>天灾结束后的第七天。变异生物大部分已经死亡或退化，但世界已经面目全非。城市变成了废墟，曾经繁华的文明只剩下断壁残垣。</p>
            <div class="dialogue-box">
                <div class="character-avatar">⚕️</div>
                <div class="dialogue-content">
                    <div class="character-name">苏瑶</div>
                    <div class="dialogue-text">念晚，幸存者基地的物资只够维持三个月。而且散落在各地的幸存者都在向这里聚集，我们很快就会面临严重的资源危机。</div>
                </div>
            </div>
            <p><span class="danger-text">更令人担忧的是，周天成临死前的话并非全是虚张声势。"创世纪"的残余能量仍在某些区域残留，少数变异生物不仅没有退化，反而变得更加狡猾和危险。</span></p>
            <p>林念晚站在基地的高处，望着远方。<span class="highlight">末世虽然结束了，但真正的挑战才刚刚开始——如何在废墟上重建文明。</span></p>
        `,
        choices: [
            {
                id: 'act3_aftermath_lead',
                label: '领导',
                text: '承担领袖责任，统筹重建工作',
                nextScene: 'act3_choice',
                effect: () => {
                    _GS().stats.leadership += 20;
                    _GS().flags.took_leadership = true;
                    _GS().stats.morale += 10;
                }
            },
            {
                id: 'act3_aftermath_scout',
                label: '探索',
                text: '独自外出探索，寻找更多资源和幸存者',
                nextScene: 'act3_choice',
                effect: () => {
                    _GS().stats.stealth += 15;
                    _GS().resources.food += 30;
                    _GS().flags.went_scouting = true;
                }
            },
            {
                id: 'act3_aftermath_research',
                label: '研究',
                text: '研究"创世纪"残余技术，寻找彻底净化方法',
                nextScene: 'act3_choice',
                effect: () => {
                    _GS().stats.intelligence += 20;
                    _GS().flags.researched_technology = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 57 - 关键抉择
    // ============================================================
    act3_choice: {
        id: 'act3_choice',
        number: '第57集',
        title: '命运岔路',
        atmosphere: '黄昏时分，幸存者基地召开大会',
        content: `
            <p>幸存者大会在基地中央广场举行。三百多名幸存者齐聚一堂，等待林念晚的决定。不同的派系提出了截然不同的方案。</p>
            <div class="dialogue-box">
                <div class="character-avatar">⚔️</div>
                <div class="dialogue-content">
                    <div class="character-name">陈锋</div>
                    <div class="dialogue-text">念晚，我们应该建立一个强有力的军事政府，统一管理所有资源。只有铁腕统治，才能防止再次出现像周天成那样的人。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">🧑‍🔬</div>
                <div class="dialogue-content">
                    <div class="character-name">老张</div>
                    <div class="dialogue-text">不对！我们应该共享技术和知识，建立民主自治的社区网络。每个人都有选择自己命运的权利。</div>
                </div>
            </div>
            <p><span class="highlight">林念晚知道，她的选择将决定人类文明的未来走向。每一条路都有代价，但没有一条路是完美的。</span></p>
        `,
        choices: [
            {
                id: 'act3_choice_control',
                label: '铁腕统治',
                text: '建立军事政府，集中控制一切资源',
                nextScene: 'act3_consequence',
                effect: () => {
                    _GS().flags.government_type = 'military';
                    _GS().stats.leadership += 15;
                    _GS().stats.morale -= 10;
                }
            },
            {
                id: 'act3_choice_democracy',
                label: '民主自治',
                text: '推动民主选举，建立社区自治网络',
                nextScene: 'act3_consequence',
                effect: () => {
                    _GS().flags.government_type = 'democracy';
                    _GS().stats.morale += 20;
                    _GS().stats.leadership += 10;
                }
            },
            {
                id: 'act3_choice_leave',
                label: '离开',
                text: '放弃领导权，独自踏上新的旅程',
                nextScene: 'act3_consequence',
                effect: () => {
                    _GS().flags.government_type = 'none';
                    _GS().flags.left_community = true;
                    _GS().stats.morale -= 5;
                }
            }
        ]
    },

    // ============================================================
    // Ep 58 - 承担后果
    // ============================================================
    act3_consequence: {
        id: 'act3_consequence',
        number: '第58集',
        title: '代价抉择',
        atmosphere: '夜幕降临，基地内暗流涌动',
        content: `
            <p>无论做出什么选择，后果都来得比想象中更快。一个深夜，林念晚收到了紧急消息——<span class="danger-text">北方发现了一个新的"创世纪"残余能量聚集点，而且那里出现了比之前更强大的变异生物。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">不可能……核心不是已经被摧毁了吗？难道还有其他的能量源？</div>
                </div>
            </div>
            <p>更令人震惊的是，侦察队带回了一个幸存者。他声称自己来自北方的一个大型幸存者聚居地，而那个聚居地正在被一个<span class="highlight">自称"新秩序继承者"的神秘人物</span>控制。</p>
            <p>林念晚意识到，周天成的死亡并没有终结一切。他的思想和"创世纪"的遗产，已经在更多人心中生根发芽。</p>
        `,
        choices: [
            {
                id: 'act3_consequence_north',
                label: '北上',
                text: '亲自带队北上，消灭新的威胁',
                nextScene: 'act3_finale',
                effect: () => {
                    _GS().stats.combat += 15;
                    _GS().flags.went_north = true;
                    _GS().stats.morale += 10;
                }
            },
            {
                id: 'act3_consequence_defend',
                label: '坚守',
                text: '留在基地巩固防御，派侦察队探查',
                nextScene: 'act3_finale',
                effect: () => {
                    _GS().stats.defense += 20;
                    _GS().flags.stayed_to_defend = true;
                }
            },
            {
                id: 'act3_consequence_negotiate',
                label: '谈判',
                text: '尝试与"继承者"进行谈判',
                nextScene: 'act3_finale',
                effect: () => {
                    _GS().stats.intelligence += 15;
                    _GS().flags.tried_negotiation = true;
                }
            }
        ]
    },

    // ============================================================
    // Ep 59 - 最终决战余波
    // ============================================================
    act3_finale: {
        id: 'act3_finale',
        number: '第59集',
        title: '终局前夜',
        atmosphere: '星空下，篝火旁，最后的宁静时刻',
        content: `
            <p>出发前的最后一个夜晚。林念晚独自坐在基地外围的山丘上，望着星空。末世前的星空她已很久没有认真看过了。</p>
            <div class="dialogue-box">
                <div class="character-avatar">⚔️</div>
                <div class="dialogue-content">
                    <div class="character-name">陈锋</div>
                    <div class="dialogue-text">睡不着？我也是。念晚，不管明天发生什么，我想让你知道——遇见你，是我在这个末世里最幸运的事。</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">陈锋……如果明天我没能回来，替我照顾好大家。储物空间里有足够所有人用一年的物资。</div>
                </div>
            </div>
            <p><span class="highlight">时间回溯的力量在这一刻自发启动，让林念晚看到了明天可能出现的所有未来。每一个未来都通向不同的结局，而选择权在她手中。</span></p>
        `,
        choices: [
            {
                id: 'act3_finale_sacrifice',
                label: '牺牲',
                text: '决定用自己的生命封印所有残余能量',
                nextScene: 'ending_sacrifice',
                effect: () => {
                    _GS().flags.ending = 'sacrifice';
                    _GS().flags.sacrifice_choice = true;
                }
            },
            {
                id: 'act3_finale_revenge',
                label: '复仇',
                text: '彻底消灭一切与"创世纪"相关的事物',
                nextScene: 'ending_revenge',
                effect: () => {
                    _GS().flags.ending = 'revenge';
                    _GS().flags.revenge_choice = true;
                }
            },
            {
                id: 'act3_finale_decide',
                label: '抉择',
                text: '等待明天，根据实际情况再做最终决定',
                nextScene: 'act3_ending',
                effect: () => {
                    _GS().flags.ending = 'pending';
                    _GS().stats.morale += 5;
                }
            }
        ]
    },

    // ============================================================
    // Ep 60 - 多结局分支
    // ============================================================
    act3_ending: {
        id: 'act3_ending',
        number: '第60集',
        title: '最终抉择',
        atmosphere: '黎明到来，命运的齿轮开始转动',
        content: `
            <p>最终的战斗结束了。"新秩序继承者"被击败，但"创世纪"的残余能量仍然存在于世界各地。林念晚站在战场中央，浑身是伤，但眼神坚定。</p>
            <p>她面前有两条路——<span class="highlight">留下来，用她的力量和智慧带领人类重建文明；或者离开，带着储物空间中的物资和技术，独自寻找一个没有纷争的角落。</span></p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">从末世第一天到现在，我一直在为生存而战。但现在……我第一次需要为"活着"的意义而选择。</div>
                </div>
            </div>
            <p><span class="danger-text">时间回溯最后一次启动，向她展示了两个清晰的未来。每一个都充满了希望，也充满了代价。这一次，没有正确的答案。</span></p>
        `,
        choices: [
            {
                id: 'act3_ending_leader',
                label: '成为领袖',
                text: '留下来，成为新世界的领袖',
                nextScene: 'ending_leader',
                effect: () => {
                    _GS().flags.ending = 'leader';
                }
            },
            {
                id: 'act3_ending_alone',
                label: '独自离开',
                text: '告别所有人，独自踏上旅途',
                nextScene: 'ending_lone_wolf',
                effect: () => {
                    _GS().flags.ending = 'lone_wolf';
                }
            }
        ]
    },

    // ============================================================
    // 结局一：独狼结局
    // ============================================================
    ending_lone_wolf: {
        id: 'ending_lone_wolf',
        number: '结局一',
        title: '独狼远行',
        atmosphere: '夕阳下，一个孤独的身影走向远方',
        content: `
            <p>林念晚选择了离开。在一个清晨，她悄悄收拾好储物空间中的物资，在桌上留下了一封信和足够所有人使用两年的物资清单。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚（独白）</div>
                    <div class="dialogue-text">我不是一个合格的领袖。我太习惯一个人战斗了。陈锋、苏瑶、老张……你们会做得比我更好。这个世界需要的不是一个英雄，而是一群愿意为彼此付出的人。</div>
                </div>
            </div>
            <p>她独自走向了荒野。储物空间里装满了物资和知识，异能依然强大。但这一次，她不再为任何人而战，只为自己。</p>
            <p><span class="highlight">在远方的地平线上，她看到了一片未被天灾触及的绿色。也许那里，就是她一直在寻找的归宿。</span></p>
            <div class="ending-summary">
                <h3>独狼结局达成</h3>
                <p>你选择了自由，但也选择了孤独。幸存者基地在你的物资帮助下逐渐壮大，但人们永远记得那个在黎明前悄然离去的身影。</p>
                <p>战斗统计：战斗力 MAX | 异能等级 MAX | 存活天数 180</p>
            </div>
        `,
        choices: [
            {
                id: 'restart',
                label: '重新开始',
                text: '重新开始游戏，探索其他结局',
                nextScene: 'prologue',
                effect: () => { location.reload(); }
            }
        ]
    },

    // ============================================================
    // 结局二：领袖结局
    // ============================================================
    ending_leader: {
        id: 'ending_leader',
        number: '结局二',
        title: '新世界之光',
        atmosphere: '朝阳升起，新的旗帜在废墟上飘扬',
        content: `
            <p>林念晚站到了幸存者面前，正式接受了领袖的身份。她利用"创世纪"残余技术中的有益部分，建立了一套全新的能源和农业体系。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">从今天起，我们不再只是幸存者。我们是新世界的建设者。末世教会了我们最宝贵的一课——只有团结，才能创造奇迹。</div>
                </div>
            </div>
            <p>在她的领导下，"新黎明"城在废墟上拔地而起。民主选举制度、社区自治网络、资源共享体系……一个全新的文明秩序逐渐成形。</p>
            <p><span class="highlight">三年后，"新黎明"成为了世界上最大的幸存者聚居地。林念晚站在城墙上，看着孩子们在阳光下奔跑嬉戏。她知道，这就是她一直在为之战斗的未来。</span></p>
            <div class="ending-summary">
                <h3>领袖结局达成</h3>
                <p>你成为了新世界的领袖，带领人类在废墟上重建了文明。"新黎明"城成为了希望的象征，而你的名字被铭刻在了历史的丰碑上。</p>
                <p>领导力 MAX | 士气 MAX | 幸存者数量 200+</p>
            </div>
        `,
        choices: [
            {
                id: 'restart',
                label: '重新开始',
                text: '重新开始游戏，探索其他结局',
                nextScene: 'prologue',
                effect: () => { location.reload(); }
            }
        ]
    },

    // ============================================================
    // 结局三：牺牲结局
    // ============================================================
    ending_sacrifice: {
        id: 'ending_sacrifice',
        number: '结局三',
        title: '最后的礼物',
        atmosphere: '金色光芒笼罩大地，一切归于宁静',
        content: `
            <p>林念晚做出了最终的决定。她将时间回溯和储物空间的力量融合，创造了一个巨大的封印法阵，将世界上所有残余的"创世纪"能量引入自己的体内。</p>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">陈锋，别哭。这是我自己的选择。带着大家好好活下去，替我看看这个世界变成什么样。我相信，一定会很美的。</div>
                </div>
            </div>
            <p><span class="danger-text">当最后一丝"创世纪"能量被吸收，林念晚的身体开始化为金色的光点。她微笑着，最后看了一眼这个她用生命守护的世界。</span></p>
            <p><span class="highlight">金色的光芒散去后，天空中出现了一道永恒的极光。幸存者们相信，那是林念晚在守护着他们。每年那一天，人们都会仰望天空，纪念那个为世界献出一切的女孩。</span></p>
            <div class="ending-summary">
                <h3>牺牲结局达成</h3>
                <p>你用生命换来了世界的彻底净化。变异生物永远消失，"创世纪"的威胁被彻底终结。你成为了传说，成为了永恒的极光。</p>
                <p>异能等级 MAX | 生命值 0 | 牺牲指数 MAX</p>
            </div>
        `,
        choices: [
            {
                id: 'restart',
                label: '重新开始',
                text: '重新开始游戏，探索其他结局',
                nextScene: 'prologue',
                effect: () => { location.reload(); }
            }
        ]
    },

    // ============================================================
    // 结局四：复仇结局
    // ============================================================
    ending_revenge: {
        id: 'ending_revenge',
        number: '结局四',
        title: '灰烬之王',
        atmosphere: '火焰吞噬一切，世界陷入第二次黑暗',
        content: `
            <p>林念晚的眼中只剩下复仇的火焰。她追踪"创世纪"的每一条线索，摧毁每一个残余据点，消灭每一个与周天成有关联的人。</p>
            <div class="dialogue-box">
                <div class="character-avatar">⚔️</div>
                <div class="dialogue-content">
                    <div class="character-name">陈锋</div>
                    <div class="dialogue-text">念晚，够了！你已经摧毁了所有的据点，杀了所有相关的人。你还要继续吗？你看看你自己，你已经不是原来的你了！</div>
                </div>
            </div>
            <div class="dialogue-box">
                <div class="character-avatar">👤</div>
                <div class="dialogue-content">
                    <div class="character-name">林念晚</div>
                    <div class="dialogue-text">不够。只要"创世纪"还有一丝残余，这个世界就永远不安全。我不会让周天成的遗产继续毒害任何人。</div>
                </div>
            </div>
            <p><span class="danger-text">最终，林念晚找到了"创世纪"的根源——一个隐藏在深海中的原始能量矿脉。她用尽全力引爆了它，彻底消灭了所有"创世纪"能量。但爆炸也引发了全球性的地质灾难，海啸、地震、火山同时爆发。</span></p>
            <p><span class="highlight">当一切平息，林念晚独自站在海岸线上。她消灭了所有的敌人，但也失去了所有的朋友和盟友。世界再次陷入黑暗，而她，成了这个灰烬世界中唯一的王。</span></p>
            <div class="ending-summary">
                <h3>复仇结局达成</h3>
                <p>你消灭了"创世纪"的一切痕迹，但也付出了惨痛的代价。盟友离去，世界再次破碎。你赢得了战争，却失去了和平。</p>
                <p>战斗力 MAX | 复仇值 MAX | 失去的一切：无法计算</p>
            </div>
        `,
        choices: [
            {
                id: 'restart',
                label: '重新开始',
                text: '重新开始游戏，探索其他结局',
                nextScene: 'prologue',
                effect: () => { location.reload(); }
            }
        ]
    }
,
    // ============================================================
    // 兜底场景
    // ============================================================
    default: {
        id: 'default',
        number: '---',
        title: '道路尽头',
        atmosphere: '未知领域',
        content: `<p>你来到了一条未知的道路...</p><p>这个区域尚未开发，请返回上一场景选择其他路线。</p>`,
        choices: [
            {
                id: 'restart',
                label: '重新开始',
                text: '重新开始游戏',
                nextScene: 'prologue',
                effect: () => { location.reload(); }
            }
        ]
    }
};


// ==================== 合并所有场景 ====================
const AllScenes = Object.assign({}, Scenes_Act1, Scenes_Act2, Scenes_Act3);
