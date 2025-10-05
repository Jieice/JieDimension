/**
 * 水果配置文件
 * 定义所有水果的属性
 */

const FRUIT_CONFIG = [
    {
        level: 1,
        name: 'Cherry',
        nameCN: '樱桃',
        radius: 20,
        color: 0xff6b6b,
        colorHex: '#ff6b6b',
        score: 10,
        emoji: '🍒'
    },
    {
        level: 2,
        name: 'Strawberry',
        nameCN: '草莓',
        radius: 28,
        color: 0xff6b9d,
        colorHex: '#ff6b9d',
        score: 20,
        emoji: '🍓'
    },
    {
        level: 3,
        name: 'Grape',
        nameCN: '葡萄',
        radius: 34,
        color: 0xc44569,
        colorHex: '#c44569',
        score: 30,
        emoji: '🍇'
    },
    {
        level: 4,
        name: 'Orange',
        nameCN: '橙子',
        radius: 40,
        color: 0xffa502,
        colorHex: '#ffa502',
        score: 40,
        emoji: '🍊'
    },
    {
        level: 5,
        name: 'Lemon',
        nameCN: '柠檬',
        radius: 46,
        color: 0xffd32a,
        colorHex: '#ffd32a',
        score: 50,
        emoji: '🍋'
    },
    {
        level: 6,
        name: 'Kiwi',
        nameCN: '猕猴桃',
        radius: 52,
        color: 0x6ab04c,
        colorHex: '#6ab04c',
        score: 60,
        emoji: '🥝'
    },
    {
        level: 7,
        name: 'Apple',
        nameCN: '苹果',
        radius: 58,
        color: 0xff4757,
        colorHex: '#ff4757',
        score: 70,
        emoji: '🍎'
    },
    {
        level: 8,
        name: 'Pear',
        nameCN: '梨',
        radius: 64,
        color: 0xc7ecee,
        colorHex: '#c7ecee',
        score: 80,
        emoji: '🍐'
    },
    {
        level: 9,
        name: 'Peach',
        nameCN: '桃子',
        radius: 70,
        color: 0xffb8b8,
        colorHex: '#ffb8b8',
        score: 90,
        emoji: '🍑'
    },
    {
        level: 10,
        name: 'Watermelon',
        nameCN: '西瓜',
        radius: 80,
        color: 0x2ecc71,
        colorHex: '#2ecc71',
        score: 100,
        emoji: '🍉'
    }
];

// 游戏配置常量
const GAME_CONFIG = {
    // 容器配置
    CONTAINER_WIDTH: 550,
    CONTAINER_HEIGHT: 750,
    CONTAINER_Y: 150,

    // 游戏界线
    DANGER_LINE_Y: 100,

    // 水果生成配置
    DROP_ZONE_Y: 50,
    MAX_DROP_LEVEL: 5, // 最多生成到第5级水果

    // 物理参数
    GRAVITY: 1.2,
    FRICTION: 0.01,
    RESTITUTION: 0.3,
    DENSITY: 0.001,

    // 游戏机制
    DANGER_TIME: 2000, // 超出危险线2秒后游戏结束
    MERGE_DELAY: 100, // 合成延迟，避免连续合成

    // 分数倍率
    COMBO_MULTIPLIER: 1.5,

    // 颜色
    BG_COLOR: 0xf0f0f0,
    CONTAINER_COLOR: 0xffffff,
    DANGER_LINE_COLOR: 0xff4444,
    PREVIEW_LINE_COLOR: 0x999999
};

