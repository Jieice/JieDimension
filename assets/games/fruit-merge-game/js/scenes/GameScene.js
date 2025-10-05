/**
 * 游戏主场景 - 完全重写版本
 * 确保所有位置计算正确
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 初始化管理器
        this.scoreManager = new ScoreManager();
        this.audioManager = new AudioManager(this);
        this.audioManager.init();

        // 游戏状态
        this.gameOver = false;
        this.dangerTimer = null;
        this.currentFruit = null;
        this.nextFruitLevel = this.getRandomFruitLevel();
        this.fruits = [];
        this.canDrop = true;

        // 创建背景
        this.add.rectangle(width / 2, height / 2, width, height, 0xf0f0f0);

        // 创建容器（核心部分）
        this.createContainer();

        // 创建UI
        this.createUI();

        // 创建当前水果
        this.createCurrentFruit();

        // 设置输入监听
        this.setupInput();

        // 碰撞监听
        this.setupCollisions();
    }

    createContainer() {
        const centerX = this.cameras.main.width / 2;

        // 容器参数
        const containerWidth = 550;
        const containerHeight = 750;
        const containerTop = 150;  // 容器顶部Y坐标
        const containerCenterY = containerTop + containerHeight / 2;

        // 绘制容器背景
        this.add.rectangle(centerX, containerCenterY, containerWidth, containerHeight, 0xffffff);

        // 物理边界
        const wallThickness = 20;

        // 左墙
        this.matter.add.rectangle(
            centerX - containerWidth / 2,
            containerCenterY,
            wallThickness,
            containerHeight,
            { isStatic: true, label: 'wall' }
        );

        // 右墙
        this.matter.add.rectangle(
            centerX + containerWidth / 2,
            containerCenterY,
            wallThickness,
            containerHeight,
            { isStatic: true, label: 'wall' }
        );

        // 底部
        this.matter.add.rectangle(
            centerX,
            containerTop + containerHeight,
            containerWidth,
            wallThickness,
            { isStatic: true, label: 'ground' }
        );

        // 危险线
        const dangerLineY = containerTop + 100;
        this.dangerLine = this.add.rectangle(centerX, dangerLineY, containerWidth, 3, 0xff4444, 0.6);

        // 危险线闪烁动画
        this.tweens.add({
            targets: this.dangerLine,
            alpha: 0.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // 保存容器边界（关键！）
        this.containerBounds = {
            left: centerX - containerWidth / 2,
            right: centerX + containerWidth / 2,
            top: containerTop,
            bottom: containerTop + containerHeight,
            centerX: centerX,
            dangerY: dangerLineY
        };

        console.log('Container bounds:', this.containerBounds);
    }

    createUI() {
        const width = this.cameras.main.width;

        // 分数显示 - 左上角
        this.scoreText = this.add.text(30, 30, 'Score: 0', {
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#333333',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 12 }
        }).setDepth(100);  // UI在最上层

        // 最高分显示
        this.highScoreText = this.add.text(30, 90, `Best: ${this.scoreManager.getHighScore()}`, {
            fontSize: '24px',
            color: '#666666',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 8 }
        }).setDepth(100);

        // 右侧UI容器
        const rightX = width - 30;

        // Next 标签
        this.add.text(rightX, 30, 'Next:', {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#666666',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 8 }
        }).setOrigin(1, 0).setDepth(100);

        // 下一个水果
        const nextConfig = FRUIT_CONFIG[this.nextFruitLevel - 1];
        this.nextFruitEmoji = this.add.text(rightX - 40, 100, nextConfig.emoji, {
            fontSize: '52px'
        }).setOrigin(0.5).setDepth(100);

        // 暂停按钮 - 确保可见
        this.pauseButton = this.add.text(rightX, 180, '⏸\n暂停', {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 20, y: 15 },
            align: 'center'
        }).setOrigin(1, 0).setInteractive().setDepth(100);

        // 暂停按钮交互
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.setStyle({ backgroundColor: '#ff5252' });
            this.pauseButton.setScale(1.05);
        });

        this.pauseButton.on('pointerout', () => {
            this.pauseButton.setStyle({ backgroundColor: '#ff6b6b' });
            this.pauseButton.setScale(1);
        });

        this.pauseButton.on('pointerdown', () => {
            this.pauseButton.setScale(0.95);
        });

        this.pauseButton.on('pointerup', () => {
            this.pauseButton.setScale(1);
            this.pauseGame();
        });

        console.log('Pause button created at:', rightX, 180);
    }

    pauseGame() {
        console.log('Pausing game...');
        this.scene.pause('GameScene');
        this.scene.launch('PauseScene');
    }

    createCurrentFruit() {
        // 水果生成位置：容器顶部往下50像素
        const spawnX = this.containerBounds.centerX;
        const spawnY = this.containerBounds.top + 60;

        console.log('Creating fruit at:', spawnX, spawnY);

        this.currentFruit = new Fruit(this, spawnX, spawnY, this.nextFruitLevel);
        this.currentFruit.body.isStatic = true;

        // 设置深度，确保在UI下面，但在容器上面
        this.currentFruit.setDepth(10);

        // 预览线
        if (this.previewLine) {
            this.previewLine.destroy();
        }
        this.previewLine = this.add.graphics();
        this.previewLine.setDepth(5); // 预览线在水果下面
        this.updatePreviewLine(spawnX);
    }

    setupInput() {
        // 鼠标/触摸移动
        this.input.on('pointermove', (pointer) => {
            if (this.gameOver || !this.canDrop || !this.currentFruit) return;

            // 限制在容器范围内
            let x = Phaser.Math.Clamp(
                pointer.x,
                this.containerBounds.left + 60,
                this.containerBounds.right - 60
            );

            // 更新水果位置
            const spawnY = this.containerBounds.top + 60;
            this.matter.body.setPosition(this.currentFruit.body, { x, y: spawnY });

            // 更新预览线
            this.updatePreviewLine(x);
        });

        // 点击投放
        this.input.on('pointerdown', (pointer) => {
            if (this.gameOver || !this.canDrop) return;

            // 检查是否点击了UI元素
            if (pointer.y < 150) return; // 避免点击顶部UI时投放

            this.dropFruit(pointer.x);
        });
    }

    updatePreviewLine(x) {
        if (!this.previewLine) return;

        this.previewLine.clear();
        this.previewLine.lineStyle(3, 0x999999, 0.6);

        const startY = this.containerBounds.top + 100;
        const endY = this.containerBounds.bottom - 30;

        this.previewLine.lineBetween(x, startY, x, endY);
    }

    dropFruit(x) {
        if (!this.currentFruit || !this.canDrop) return;

        // 限制范围
        x = Phaser.Math.Clamp(
            x,
            this.containerBounds.left + 60,
            this.containerBounds.right - 60
        );

        const spawnY = this.containerBounds.top + 60;

        // 释放水果
        this.matter.body.setStatic(this.currentFruit.body, false);
        this.matter.body.setPosition(this.currentFruit.body, { x, y: spawnY });

        // 添加到列表
        this.fruits.push(this.currentFruit);

        // 清除预览线
        this.previewLine.clear();

        // 播放音效
        this.audioManager.playDrop();

        // 准备下一个水果
        this.canDrop = false;
        this.time.delayedCall(600, () => {
            this.prepareNextFruit();
        });
    }

    prepareNextFruit() {
        this.nextFruitLevel = this.getRandomFruitLevel();

        // 更新预览
        const nextConfig = FRUIT_CONFIG[this.nextFruitLevel - 1];
        this.nextFruitEmoji.setText(nextConfig.emoji);

        // 创建新水果
        this.createCurrentFruit();

        this.canDrop = true;
    }

    getRandomFruitLevel() {
        return Phaser.Math.Between(1, GAME_CONFIG.MAX_DROP_LEVEL);
    }

    setupCollisions() {
        this.matter.world.setGravity(0, GAME_CONFIG.GRAVITY);

        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                if (pair.bodyA.label === 'fruit' && pair.bodyB.label === 'fruit') {
                    this.handleFruitCollision(pair.bodyA, pair.bodyB);
                }
            });
        });
    }

    handleFruitCollision(bodyA, bodyB) {
        const fruitA = bodyA.fruitObject;
        const fruitB = bodyB.fruitObject;

        if (!fruitA || !fruitB) return;
        if (fruitA.isMerging || fruitB.isMerging) return;
        if (fruitA.justCreated || fruitB.justCreated) return;

        if (fruitA.getLevel() === fruitB.getLevel() && fruitA.getLevel() < 10) {
            this.mergeFruits(fruitA, fruitB);
        }
    }

    mergeFruits(fruitA, fruitB) {
        fruitA.isMerging = true;
        fruitB.isMerging = true;

        const posA = fruitA.getPosition();
        const posB = fruitB.getPosition();
        const mergeX = (posA.x + posB.x) / 2;
        const mergeY = (posA.y + posB.y) / 2;

        // 特效
        fruitA.createMergeEffect();

        // 移除旧水果
        this.removeFruit(fruitA);
        this.removeFruit(fruitB);

        // 创建新水果
        const newLevel = fruitA.getLevel() + 1;
        const newFruit = new Fruit(this, mergeX, mergeY, newLevel);
        this.fruits.push(newFruit);

        // 加分
        const points = FRUIT_CONFIG[newLevel - 1].score;
        this.scoreManager.addScore(points);
        this.updateScore();

        // 音效
        this.audioManager.playMerge(newLevel);

        // 西瓜祝贺
        if (newLevel === 10) {
            this.showCongrats();
        }
    }

    removeFruit(fruit) {
        const index = this.fruits.indexOf(fruit);
        if (index > -1) {
            this.fruits.splice(index, 1);
        }
        fruit.destroy();
    }

    updateScore() {
        this.scoreText.setText(`Score: ${this.scoreManager.getScore()}`);
        this.highScoreText.setText(`Best: ${this.scoreManager.getHighScore()}`);
    }

    showCongrats() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const text = this.add.text(centerX, centerY, '🎉 西瓜！WATERMELON! 🎉', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#2ecc71',
            stroke: '#ffffff',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            scale: 1.3,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    update() {
        // 更新当前水果（等待投放的水果）
        if (this.currentFruit && this.currentFruit.update) {
            this.currentFruit.update();
        }

        // 更新所有已投放的水果
        this.fruits.forEach(fruit => {
            if (fruit && fruit.update) {
                fruit.update();
            }
        });

        // 检查游戏结束
        this.checkGameOver();
    }

    checkGameOver() {
        if (this.gameOver) return;

        let fruitAboveLine = false;

        this.fruits.forEach(fruit => {
            const pos = fruit.getPosition();
            if (pos && pos.y < this.containerBounds.dangerY) {
                fruitAboveLine = true;
            }
        });

        if (fruitAboveLine) {
            if (!this.dangerTimer) {
                this.dangerTimer = this.time.delayedCall(GAME_CONFIG.DANGER_TIME, () => {
                    this.endGame();
                });
            }
        } else {
            if (this.dangerTimer) {
                this.dangerTimer.remove();
                this.dangerTimer = null;
            }
        }
    }

    endGame() {
        if (this.gameOver) return;

        this.gameOver = true;
        this.canDrop = false;

        this.audioManager.playGameOver();

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', {
                score: this.scoreManager.getScore(),
                highScore: this.scoreManager.getHighScore()
            });
        });
    }
}
