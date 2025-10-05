/**
 * 分数管理器
 * 处理分数、最高分、本地存储
 */

class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.comboCount = 0;
        this.comboTimer = null;
    }

    /**
     * 增加分数
     */
    addScore(points) {
        // 应用连击倍率
        if (this.comboCount > 0) {
            points = Math.floor(points * GAME_CONFIG.COMBO_MULTIPLIER);
        }

        this.currentScore += points;

        // 更新最高分
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }

        // 增加连击
        this.addCombo();

        return points;
    }

    /**
     * 增加连击
     */
    addCombo() {
        this.comboCount++;

        // 重置连击计时器
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
        }

        // 2秒后重置连击
        this.comboTimer = setTimeout(() => {
            this.comboCount = 0;
        }, 2000);
    }

    /**
     * 获取当前分数
     */
    getScore() {
        return this.currentScore;
    }

    /**
     * 获取最高分
     */
    getHighScore() {
        return this.highScore;
    }

    /**
     * 重置当前分数
     */
    reset() {
        this.currentScore = 0;
        this.comboCount = 0;
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
        }
    }

    /**
     * 加载最高分
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem('fruitMergeHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            console.warn('LocalStorage not available');
            return 0;
        }
    }

    /**
     * 保存最高分
     */
    saveHighScore() {
        try {
            localStorage.setItem('fruitMergeHighScore', this.highScore.toString());
        } catch (e) {
            console.warn('Failed to save high score');
        }
    }

    /**
     * 获取连击数
     */
    getCombo() {
        return this.comboCount;
    }
}

