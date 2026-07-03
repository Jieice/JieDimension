/**
 * 游戏结束场景
 */

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
        this.isNewRecord = this.finalScore === this.highScore && this.finalScore > 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0xf0f0f0);

        // 游戏结束标题
        const gameOverText = this.add.text(width / 2, 150, 'Game Over', {
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff4757',
            stroke: '#ffffff',
            strokeThickness: 8
        }).setOrigin(0.5);

        // 游戏结束标题动画
        gameOverText.setScale(0);
        this.tweens.add({
            targets: gameOverText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // 新纪录提示
        if (this.isNewRecord) {
            const newRecordText = this.add.text(width / 2, 230, '🎉 NEW RECORD! 新纪录! 🎉', {
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#ffa502',
                stroke: '#ffffff',
                strokeThickness: 4
            }).setOrigin(0.5);

            // 闪烁动画
            this.tweens.add({
                targets: newRecordText,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        // 分数面板
        this.createScorePanel();

        // 按钮
        this.createButton(width / 2, 550, '再来一次 RETRY', () => {
            this.scene.start('GameScene');
        }, 0xff4757);

        this.createButton(width / 2, 650, '返回菜单 MENU', () => {
            this.scene.start('MenuScene');
        }, 0x4b7bec);

        // 鼓励文字
        this.addEncouragementText();
    }

    createScorePanel() {
        const width = this.cameras.main.width;
        const panelY = this.isNewRecord ? 320 : 280;

        // 面板背景
        const panel = this.add.rectangle(width / 2, panelY + 80, 400, 200, 0xffffff);
        panel.setStrokeStyle(4, 0xcccccc);

        // 你的分数
        this.add.text(width / 2, panelY, 'Your Score', {
            fontSize: '24px',
            color: '#666666'
        }).setOrigin(0.5);

        const scoreText = this.add.text(width / 2, panelY + 50, this.finalScore.toString(), {
            fontSize: '56px',
            fontStyle: 'bold',
            color: '#ff4757'
        }).setOrigin(0.5);

        // 分数动画
        let displayScore = 0;
        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 1000,
            onUpdate: (tween) => {
                displayScore = Math.floor(tween.getValue());
                scoreText.setText(displayScore.toString());
            }
        });

        // 最高分
        this.add.text(width / 2, panelY + 120, `High Score: ${this.highScore}`, {
            fontSize: '20px',
            color: '#999999'
        }).setOrigin(0.5);

        // 水果装饰
        const fruits = ['🍒', '🍓', '🍊', '🍉'];
        const positions = [
            { x: width / 2 - 180, y: panelY + 80 },
            { x: width / 2 + 180, y: panelY + 80 },
            { x: width / 2 - 180, y: panelY + 160 },
            { x: width / 2 + 180, y: panelY + 160 }
        ];

        fruits.forEach((fruit, i) => {
            const pos = positions[i];
            const emoji = this.add.text(pos.x, pos.y, fruit, {
                fontSize: '32px'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: emoji,
                angle: 360,
                duration: 3000 + i * 500,
                repeat: -1,
                ease: 'Linear'
            });
        });
    }

    createButton(x, y, text, callback, color) {
        const button = this.add.container(x, y);

        // 按钮背景
        const bg = this.add.rectangle(0, 0, 350, 70, color);
        bg.setStrokeStyle(4, 0xffffff);

        // 按钮文字
        const label = this.add.text(0, 0, text, {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.add([bg, label]);
        button.setSize(350, 70);
        button.setInteractive();

        // 按钮动画
        button.setAlpha(0);
        button.setScale(0.8);
        this.tweens.add({
            targets: button,
            alpha: 1,
            scale: 1,
            duration: 300,
            delay: y === 550 ? 200 : 400
        });

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

    addEncouragementText() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 根据分数给出不同的鼓励语
        let message = '';
        if (this.finalScore >= 1000) {
            message = '太厉害了！Master Level! 🏆';
        } else if (this.finalScore >= 500) {
            message = '很棒！Great Job! 🌟';
        } else if (this.finalScore >= 200) {
            message = '不错！Nice Try! 👍';
        } else {
            message = '继续加油！Keep Going! 💪';
        }

        this.add.text(width / 2, height - 50, message, {
            fontSize: '20px',
            color: '#999999'
        }).setOrigin(0.5);
    }
}

