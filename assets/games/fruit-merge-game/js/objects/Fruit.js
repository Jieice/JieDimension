/**
 * 水果类
 * 管理单个水果的创建、渲染和物理属性
 */

class Fruit {
    constructor(scene, x, y, level) {
        this.scene = scene;
        this.level = level;
        this.config = FRUIT_CONFIG[level - 1];

        // 创建水果的物理刚体和图形
        this.createFruit(x, y);

        // 标记为已合成（避免重复合成）
        this.isMerging = false;

        // 合成标记
        this.justCreated = true;
        setTimeout(() => {
            this.justCreated = false;
        }, 200);
    }

    /**
     * 创建水果
     */
    createFruit(x, y) {
        const radius = this.config.radius;

        // 创建圆形刚体
        this.body = this.scene.matter.add.circle(x, y, radius, {
            restitution: GAME_CONFIG.RESTITUTION,
            friction: GAME_CONFIG.FRICTION,
            density: GAME_CONFIG.DENSITY,
            label: 'fruit'
        });

        // 存储水果等级信息到刚体
        this.body.fruitLevel = this.level;
        this.body.fruitObject = this;

        // 创建图形显示
        this.graphics = this.scene.add.graphics();
        this.updateGraphics();

        // 创建文字显示（emoji）
        this.text = this.scene.add.text(0, 0, this.config.emoji, {
            fontSize: `${radius * 1.2}px`,
            align: 'center'
        });
        this.text.setOrigin(0.5, 0.5);
    }

    /**
     * 更新图形显示
     */
    updateGraphics() {
        const radius = this.config.radius;
        const color = this.config.color;

        this.graphics.clear();

        // 绘制阴影
        this.graphics.fillStyle(0x000000, 0.1);
        this.graphics.fillCircle(5, 5, radius);

        // 绘制渐变圆形
        this.graphics.fillStyle(color, 1);
        this.graphics.fillCircle(0, 0, radius);

        // 绘制高光
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillCircle(-radius * 0.3, -radius * 0.3, radius * 0.4);

        // 绘制边框
        this.graphics.lineStyle(2, 0xffffff, 0.5);
        this.graphics.strokeCircle(0, 0, radius);
    }

    /**
     * 更新位置（每帧调用）
     */
    update() {
        if (this.body && this.graphics && this.text) {
            // 同步图形位置到物理刚体
            this.graphics.x = this.body.position.x;
            this.graphics.y = this.body.position.y;
            this.text.x = this.body.position.x;
            this.text.y = this.body.position.y;

            // 同步旋转
            this.graphics.rotation = this.body.angle;
        }
    }

    /**
     * 销毁水果
     */
    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
        if (this.text) {
            this.text.destroy();
            this.text = null;
        }
        if (this.body) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }
    }

    /**
     * 获取位置
     */
    getPosition() {
        return this.body ? this.body.position : null;
    }

    /**
     * 获取等级
     */
    getLevel() {
        return this.level;
    }

    /**
     * 设置深度
     */
    setDepth(depth) {
        if (this.graphics) {
            this.graphics.setDepth(depth);
        }
        if (this.text) {
            this.text.setDepth(depth);
        }
        return this;
    }

    /**
     * 创建合成特效
     */
    createMergeEffect() {
        const pos = this.getPosition();
        if (!pos) return;

        // 创建粒子效果
        const particles = this.scene.add.particles(pos.x, pos.y);

        // 创建简单的爆炸效果
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const particle = this.scene.add.circle(pos.x, pos.y, 5, this.config.color);

            // 简单的粒子动画
            this.scene.tweens.add({
                targets: particle,
                x: pos.x + vx * 0.5,
                y: pos.y + vy * 0.5,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }
}

