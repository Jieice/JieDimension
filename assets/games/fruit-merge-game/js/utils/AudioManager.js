/**
 * 音频管理器
 * 处理所有音效和背景音乐
 */

class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.enabled = this.loadSoundSettings();
        this.sounds = {};
    }

    /**
     * 初始化音效
     */
    init() {
        // 注意：这里使用代码生成音效，因为没有音频文件
        // 实际项目中应该加载真实的音频文件

        // 暂时不加载音效，避免错误
        // 可以后续添加真实的音频文件
        console.log('Audio Manager initialized (no audio files yet)');
    }

    /**
     * 播放音效
     */
    play(soundName, volume = 1) {
        if (!this.enabled) return;

        // 简单的音效播放（需要实际音频文件）
        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName].play({ volume });
            } catch (e) {
                console.warn('Failed to play sound:', soundName);
            }
        }
    }

    /**
     * 切换音效开关
     */
    toggle() {
        this.enabled = !this.enabled;
        this.saveSoundSettings();
        return this.enabled;
    }

    /**
     * 获取音效状态
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * 加载音效设置
     */
    loadSoundSettings() {
        try {
            const saved = localStorage.getItem('fruitMergeSoundEnabled');
            return saved === null ? true : saved === 'true';
        } catch (e) {
            return true;
        }
    }

    /**
     * 保存音效设置
     */
    saveSoundSettings() {
        try {
            localStorage.setItem('fruitMergeSoundEnabled', this.enabled.toString());
        } catch (e) {
            console.warn('Failed to save sound settings');
        }
    }

    /**
     * 播放合成音效
     */
    playMerge(level) {
        // 根据等级播放不同音调的音效
        this.play('merge', 0.5);
    }

    /**
     * 播放掉落音效
     */
    playDrop() {
        this.play('drop', 0.3);
    }

    /**
     * 播放游戏结束音效
     */
    playGameOver() {
        this.play('gameover', 0.7);
    }
}

