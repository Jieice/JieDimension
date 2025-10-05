/**
 * 暂停场景
 * 显示暂停界面和继续按钮
 */

class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        console.log('PauseScene created!', width, height);

        // 半透明背景遮罩（更深的颜色）- 深度1000，最上层
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setInteractive();
        overlay.setDepth(1000);

        // 防止点击穿透 - 简单吸收事件
        overlay.on('pointerdown', () => {
            // 不做任何事，只是阻止点击穿透到下面的游戏场景
        });

        // 暂停状态提示背景
        const statusBg = this.add.rectangle(width / 2, 200, 600, 150, 0xff4757);
        statusBg.setStrokeStyle(6, 0xffffff);
        statusBg.setDepth(1001);

        // 暂停标题 - 更大更明显
        const pauseText = this.add.text(width / 2, 180, '⏸️ 游戏已暂停', {
            fontSize: '56px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(1002);

        // 英文提示
        const pauseSubText = this.add.text(width / 2, 230, 'GAME PAUSED', {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1002);

        // 暂停标题动画
        this.tweens.add({
            targets: [statusBg, pauseText, pauseSubText],
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 提示信息框
        const tipsBg = this.add.rectangle(width / 2, 340, 700, 80, 0x333333, 0.9);
        tipsBg.setStrokeStyle(3, 0x666666);
        tipsBg.setDepth(1001);

        const tipsText = this.add.text(width / 2, 340, '💡 点击下方按钮继续游戏或选择其他操作\nClick button below to continue or choose other options', {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1002);

        // 继续按钮 - 更大更明显
        this.createButton(width / 2, 450, '▶️ 继续游戏 RESUME', () => {
            this.resumeGame();
        }, 0x2ecc71, 500, 90);

        // 重新开始按钮
        this.createButton(width / 2, 570, '🔄 重新开始 RESTART', () => {
            this.scene.stop('PauseScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        }, 0xffa502, 400, 70);

        // 返回菜单按钮
        this.createButton(width / 2, 670, '🏠 返回菜单 MENU', () => {
            this.scene.stop('PauseScene');
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        }, 0xff4757, 400, 70);

        // 底部提示
        this.add.text(width / 2, 780, '游戏进度已保存，可以安全退出\nProgress saved, safe to exit', {
            fontSize: '16px',
            color: '#999999',
            align: 'center'
        }).setOrigin(0.5).setDepth(1002);
    }

    createButton(x, y, text, callback, color, width = 400, height = 70) {
        const button = this.add.container(x, y);
        button.setDepth(1003);  // 按钮在最上层

        // 按钮背景
        const bg = this.add.rectangle(0, 0, width, height, color);
        bg.setStrokeStyle(5, 0xffffff);

        // 按钮文字 - 根据按钮大小调整字体
        const fontSize = height > 80 ? '28px' : '24px';
        const label = this.add.text(0, 0, text, {
            fontSize: fontSize,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        button.add([bg, label]);
        button.setSize(width, height);
        button.setInteractive();

        // 悬停效果
        button.on('pointerover', () => {
            bg.setFillStyle(this.lightenColor(color));
            button.setScale(1.05);
        });

        button.on('pointerout', () => {
            bg.setFillStyle(color);
            button.setScale(1);
        });

        // 点击效果
        button.on('pointerdown', () => {
            button.setScale(0.95);
        });

        button.on('pointerup', () => {
            button.setScale(1);
            callback();
        });

        return button;
    }

    lightenColor(color) {
        // 简单的颜色变亮算法
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;

        const newR = Math.min(255, r + 30);
        const newG = Math.min(255, g + 30);
        const newB = Math.min(255, b + 30);

        return (newR << 16) | (newG << 8) | newB;
    }

    resumeGame() {
        // 关闭暂停场景
        this.scene.stop('PauseScene');
        // 恢复游戏场景
        this.scene.resume('GameScene');
    }
}

