/**
 * 游戏主入口
 * Phaser 3 配置和启动
 */

// Phaser 游戏配置
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 960,
    backgroundColor: '#667eea',
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: GAME_CONFIG.GRAVITY
            },
            debug: false, // 设置为 true 可以看到物理调试信息
            enableSleeping: false
        }
    },
    scene: [
        BootScene,
        MenuScene,
        GameScene,
        GameOverScene,
        PauseScene  // PauseScene 必须在最后，确保渲染在最上层
    ]
};

// 创建游戏实例
const game = new Phaser.Game(config);

// 窗口大小调整处理
window.addEventListener('resize', () => {
    game.scale.refresh();
});

// 防止触摸滚动
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 游戏加载完成提示
window.addEventListener('load', () => {
    console.log('🎮 Fruit Merge Mania - Game Loaded!');
    console.log('📱 Optimized for mobile and desktop');
    console.log('🍎 Have fun merging fruits!');
});

