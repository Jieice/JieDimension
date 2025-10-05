/**
 * 主菜单场景
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0xf5f5f5);

        // 标题
        const title = this.add.text(width / 2, 180, 'Fruit Merge', {
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff4757',
            stroke: '#ffffff',
            strokeThickness: 8
        }).setOrigin(0.5);

        const subtitle = this.add.text(width / 2, 250, 'Mania', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffa502',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 添加简单的动画
        this.tweens.add({
            targets: [title, subtitle],
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 水果装饰
        this.addFruitDecorations();

        // 最高分显示
        const scoreManager = new ScoreManager();
        const highScore = scoreManager.getHighScore();

        this.add.text(width / 2, 400, '最高分 High Score', {
            fontSize: '24px',
            color: '#666666'
        }).setOrigin(0.5);

        this.add.text(width / 2, 450, highScore.toString(), {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ff4757'
        }).setOrigin(0.5);

        // 开始按钮
        this.createButton(width / 2, 580, '开始游戏 START', () => {
            this.scene.start('GameScene');
        });

        // 说明文字
        this.add.text(width / 2, 720, '点击屏幕投放水果\nTap to drop fruits', {
            fontSize: '20px',
            color: '#999999',
            align: 'center'
        }).setOrigin(0.5);

        // 版本信息
        this.add.text(width / 2, height - 30, 'v1.0 | Made with ❤️', {
            fontSize: '16px',
            color: '#cccccc'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // 按钮背景
        const bg = this.add.rectangle(0, 0, 300, 80, 0xff4757);
        bg.setStrokeStyle(4, 0xffffff);

        // 按钮文字
        const label = this.add.text(0, 0, text, {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.add([bg, label]);
        button.setSize(300, 80);
        button.setInteractive();

        // 悬停效果
        button.on('pointerover', () => {
            bg.setFillStyle(0xff6b6b);
            button.setScale(1.05);
        });

        button.on('pointerout', () => {
            bg.setFillStyle(0xff4757);
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

    addFruitDecorations() {
        const width = this.cameras.main.width;
        const fruits = ['🍒', '🍓', '🍇', '🍊', '🍋', '🥝'];
        const positions = [
            { x: 100, y: 180 },
            { x: width - 100, y: 180 },
            { x: 80, y: 400 },
            { x: width - 80, y: 400 },
            { x: 120, y: 650 },
            { x: width - 120, y: 650 }
        ];

        fruits.forEach((fruit, i) => {
            const pos = positions[i];
            const text = this.add.text(pos.x, pos.y, fruit, {
                fontSize: '48px'
            }).setOrigin(0.5);

            // 漂浮动画
            this.tweens.add({
                targets: text,
                y: pos.y - 20,
                duration: 2000 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // 旋转动画
            this.tweens.add({
                targets: text,
                angle: 360,
                duration: 4000 + i * 500,
                repeat: -1,
                ease: 'Linear'
            });
        });
    }
}

