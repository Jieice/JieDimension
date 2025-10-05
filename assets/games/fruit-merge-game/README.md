# 🍎 Fruit Merge Mania - 水果合成狂热

一个基于 HTML5 的水果合成游戏，灵感来自"合成大西瓜"。

## 🎮 游戏玩法

- 点击屏幕投放水果
- 相同水果碰撞自动合成更大的水果
- 挑战合成最大的西瓜
- 不要让容器溢出！

## 🚀 快速开始

### 在线游玩
直接用浏览器打开 `index.html` 即可！

### 本地服务器（推荐）
```bash
# 方法 1: 使用 Python
python -m http.server 8000

# 方法 2: 使用 Node.js
npx http-server

# 方法 3: 使用 VS Code 的 Live Server 插件
```

然后访问：`http://localhost:8000`

## 🛠️ 技术栈

- **Phaser 3** - HTML5 游戏框架
- **Matter.js** - 2D 物理引擎（Phaser 内置）
- **纯 JavaScript** - 无需构建工具
- **响应式设计** - 适配手机和桌面

## 📁 项目结构

```
fruit-merge-game/
├── index.html              # 主页面
├── css/
│   └── style.css          # 全局样式
├── js/
│   ├── main.js            # 游戏入口
│   ├── scenes/            # 游戏场景
│   │   ├── BootScene.js   # 启动场景
│   │   ├── MenuScene.js   # 主菜单
│   │   ├── GameScene.js   # 游戏主场景
│   │   └── GameOverScene.js # 游戏结束
│   ├── objects/
│   │   └── Fruit.js       # 水果类
│   └── utils/
│       ├── FruitConfig.js # 水果配置
│       ├── ScoreManager.js # 分数管理
│       └── AudioManager.js # 音频管理
└── README.md              # 本文件
```

## 🎨 游戏特色

- ✨ 10 种不同的水果（樱桃→西瓜）
- 🎯 真实的物理碰撞效果
- 📱 完美适配移动端和桌面端
- 🏆 本地最高分保存
- 🎵 音效系统（可开关）
- 🌈 精美的视觉效果
- 💯 连击得分系统

## 🎯 水果等级

1. 🍒 樱桃 (Cherry)
2. 🍓 草莓 (Strawberry)
3. 🍇 葡萄 (Grape)
4. 🍊 橙子 (Orange)
5. 🍋 柠檬 (Lemon)
6. 🥝 猕猴桃 (Kiwi)
7. 🍎 苹果 (Apple)
8. 🍐 梨 (Pear)
9. 🍑 桃子 (Peach)
10. 🍉 西瓜 (Watermelon)

## 🔧 自定义配置

编辑 `js/utils/FruitConfig.js` 来调整：
- 水果大小和颜色
- 物理参数（重力、摩擦力等）
- 游戏难度
- 容器大小

## 📦 打包上传

### 准备上传到游戏平台

1. **压缩项目**
   ```bash
   # 将所有文件打包成 .zip
   zip -r fruit-merge-game.zip fruit-merge-game/
   ```

2. **上传到 Itch.io**
   - 登录 Itch.io 账号
   - Create new project
   - Upload .zip 文件
   - 设置为 HTML 项目
   - 主文件：index.html

3. **上传到 CrazyGames**
   - 登录 CrazyGames 开发者后台
   - Upload game
   - 上传 .zip 文件
   - 填写游戏信息
   - 提交审核

## 🎨 美术资源

目前使用：
- Emoji 表情符号（🍒🍓🍇🍊等）
- 代码绘制的圆形和渐变
- 纯色背景

### 升级建议：
1. 使用真实的水果图片素材
2. 添加背景音乐
3. 增加粒子特效
4. 设计自定义字体

### 免费素材推荐：
- Kenney.nl - 免费游戏素材
- OpenGameArt.org - 开源游戏美术
- Freesound.org - 免费音效

## 🐛 已知问题

- [ ] 音效系统需要实际音频文件
- [ ] 暂停功能暂未完全实现
- [ ] 缺少粒子特效库

## 🚧 待开发功能

- [ ] 道具系统（炸弹、时间暂停等）
- [ ] 在线排行榜
- [ ] 每日挑战
- [ ] 成就系统
- [ ] 多种主题皮肤
- [ ] 分享功能

## 📄 许可证

MIT License - 可自由使用、修改和商用

## 👨‍💻 开发者

基于 Phaser 3 框架开发
游戏概念灵感来自"合成大西瓜"

## 🎉 鸣谢

- Phaser 3 - 强大的游戏框架
- Matter.js - 优秀的物理引擎
- 所有支持独立游戏开发的玩家

---

## 🎮 开始游戏吧！

打开 `index.html` 开始你的合成之旅！

**祝你玩得开心！Have Fun! 🍎🎮**

