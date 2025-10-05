/**
 * 启动场景
 * 加载资源和初始化
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 显示加载进度
        this.createLoadingBar();

        // 这里可以加载图片、音效等资源
        // 由于我们使用代码绘制图形，暂时不需要加载外部资源

        // 模拟加载时间
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(250, 280, 300 * value, 30);
        });
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0x667eea);

        // 标题
        this.add.text(width / 2, height / 2 - 100, 'Fruit Merge Mania', {
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 50, '水果合成狂热', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 加载进度条背景
        this.add.rectangle(width / 2, height / 2 + 100, 320, 50, 0x222222).setOrigin(0.5);

        // 进度条
        this.progressBar = this.add.graphics();
    }

    create() {
        // 加载完成，立即跳转到主菜单（优化加载速度）
        this.scene.start('MenuScene');
    }
}

