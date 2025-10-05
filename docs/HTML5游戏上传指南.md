# 🌐 HTML5 游戏上传指南

HTML5 游戏可以直接放在网站中，让访客在线试玩！

---

## 🎮 HTML5 游戏的优势

- ✅ 可以直接在网页中运行
- ✅ 无需下载安装
- ✅ 跨平台（PC、手机、平板都能玩）
- ✅ 可以嵌入到游戏介绍页面
- ✅ 提升用户体验

---

## 📂 文件结构

### 推荐结构

```
assets/games/
├── game1/                      # 第一个游戏
│   ├── index.html             # 游戏入口文件
│   ├── game.js                # 游戏逻辑
│   ├── style.css              # 游戏样式
│   ├── assets/                # 游戏资源
│   │   ├── images/
│   │   ├── sounds/
│   │   └── ...
│   └── README.md              # 游戏说明（可选）
│
└── game2/                      # 第二个游戏
    └── ...
```

### 实际路径

```
D:\Blog\assets\games\your-game\
```

---

## 📤 上传步骤

### 方法一：从 Godot/其他引擎导出

**如果你用 Godot 开发**：

1. **导出为 HTML5**
   - 在 Godot 中：项目 → 导出
   - 选择 "HTML5"
   - 导出到临时文件夹

2. **复制导出文件**
   ```
   将导出的所有文件复制到：
   D:\Blog\assets\games\your-game\
   ```

3. **检查文件**
   - 确保有 `index.html`
   - 确保所有资源文件都在
   - 测试：双击 `index.html` 看能否运行

**其他引擎**（Unity、Phaser 等）：
- 导出为 WebGL/HTML5
- 复制所有文件到游戏文件夹

---

### 方法二：手写的 HTML5 游戏

如果你是纯手写代码：

1. **创建游戏文件夹**
   ```bash
   mkdir assets\games\my-game
   ```

2. **放入你的游戏文件**
   - `index.html` - 游戏入口
   - `game.js` - 游戏逻辑
   - `style.css` - 样式
   - 图片、音频等资源

3. **确保相对路径正确**
   ```html
   <!-- ✅ 正确 -->
   <img src="assets/player.png">
   
   <!-- ❌ 错误 -->
   <img src="/assets/player.png">
   ```

---

## 🎯 在网站中展示

### 1. 更新游戏页面

编辑 `_games/html5-game.md`：

```markdown
---
title: 我的 HTML5 游戏
platform: Web / HTML5
icon: 🌐
status: 可在线试玩
date: 2025-10-05
links:
  - text: 全屏试玩
    url: "/JieDimension/assets/games/my-game/index.html"
    external: false
---

## 游戏简介

这是一款可以直接在浏览器中玩的游戏！

## 在线试玩

<div style="text-align: center; margin: 2rem 0;">
  <iframe 
    src="/JieDimension/assets/games/my-game/index.html" 
    width="800" 
    height="600" 
    frameborder="0"
    style="border: 2px solid var(--border-color); border-radius: 8px;">
  </iframe>
</div>

<div style="text-align: center; margin-top: 1rem;">
  <a href="/JieDimension/assets/games/my-game/index.html" 
     target="_blank" 
     class="btn">
    全屏模式 🎮
  </a>
</div>

## 游戏特色

- **特色1**：描述
- **特色2**：描述

## 操作方法

- **移动**：方向键/WASD
- **跳跃**：空格
- **射击**：鼠标左键

## 开发技术

使用 [Godot Engine / Phaser / 纯 JavaScript] 开发
```

### 2. iframe 参数说明

```html
<iframe 
  src="/JieDimension/assets/games/my-game/index.html"  <!-- 游戏路径 -->
  width="800"           <!-- 宽度（像素） -->
  height="600"          <!-- 高度（像素） -->
  frameborder="0"       <!-- 无边框 -->
  allowfullscreen       <!-- 允许全屏 -->
  style="border: 2px solid var(--border-color);">
</iframe>
```

### 3. 响应式嵌入（推荐）

让游戏在移动端也能正常显示：

```html
<div style="position: relative; padding-bottom: 75%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem auto;">
  <iframe 
    src="/JieDimension/assets/games/my-game/index.html"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid var(--border-color); border-radius: 8px;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```

---

## 📏 文件大小建议

### ✅ 可以接受

| 文件类型 | 大小限制 | 说明 |
|---------|---------|------|
| HTML/JS/CSS | 无限制 | 文本文件很小 |
| 图片 | < 5MB 总计 | 优化后上传 |
| 音频 | < 2MB 总计 | 使用 MP3/OGG |
| 整个游戏 | < 10MB | 推荐范围 |

### ⚠️ 需要优化

如果游戏文件 > 10MB：

1. **压缩图片**
   - 使用 TinyPNG.com
   - 降低分辨率
   - 使用雪碧图（Sprite Sheet）

2. **压缩音频**
   - 使用 MP3 格式
   - 降低比特率（128kbps 足够）
   - 考虑只保留必要音效

3. **压缩代码**
   - 使用代码压缩工具
   - 移除注释和空格

4. **考虑外部加载**
   - 大资源放 CDN 或云存储
   - 按需加载资源

---

## 🧪 测试清单

上传前务必测试：

### 本地测试

- [ ] 双击 `index.html` 能正常运行
- [ ] 所有图片资源都显示正常
- [ ] 音频能正常播放
- [ ] 游戏逻辑运行正常
- [ ] 移动端测试（如果支持）

### 路径检查

- [ ] 所有资源使用相对路径
- [ ] 没有使用绝对路径（`C:\` 或 `/`）
- [ ] 路径大小写正确

### 部署后测试

1. 推送到 GitHub
2. 等待构建完成
3. 访问游戏页面
4. 测试嵌入的游戏能否运行
5. 测试全屏模式链接

---

## 🔧 常见问题

### Q1: 游戏显示空白？

**可能原因**：

1. **路径错误**
   ```javascript
   // ❌ 错误
   loadImage('/assets/player.png');
   
   // ✅ 正确
   loadImage('assets/player.png');
   ```

2. **资源未加载**
   - 检查浏览器控制台（F12）
   - 查看是否有 404 错误

3. **CORS 问题**（本地测试）
   - 使用本地服务器测试
   - 或直接推送到 GitHub 测试

### Q2: 游戏太大无法加载？

**解决方法**：

1. 优化资源（见上面的"文件大小建议"）
2. 添加加载进度条
3. 考虑使用外部 CDN

### Q3: 手机上玩不了？

**检查**：

1. 游戏是否支持触摸操作
2. 使用响应式 iframe 嵌入
3. 测试不同屏幕尺寸

### Q4: 游戏运行卡顿？

**优化方向**：

1. 降低图片分辨率
2. 减少粒子效果
3. 优化代码逻辑
4. 使用对象池

---

## 📝 完整示例

### 游戏文件结构

```
assets/games/space-shooter/
├── index.html
├── game.js
├── style.css
└── assets/
    ├── images/
    │   ├── player.png        # 50KB
    │   ├── enemy.png         # 40KB
    │   └── background.jpg    # 200KB
    └── sounds/
        ├── shoot.mp3         # 30KB
        └── explosion.mp3     # 50KB

总计：约 370KB ✓
```

### 游戏页面示例

文件：`_games/space-shooter.md`

```markdown
---
title: 太空射击
platform: Web / HTML5
icon: 🚀
status: 在线试玩
date: 2025-10-05
---

## 游戏简介

一款简单有趣的太空射击游戏！

## 在线试玩

<div style="position: relative; padding-bottom: 75%; height: 0; overflow: hidden; max-width: 800px; margin: 2rem auto;">
  <iframe 
    src="/JieDimension/assets/games/space-shooter/index.html"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid #4a4f5f; border-radius: 12px;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>

<div style="text-align: center; margin-top: 1rem;">
  <a href="/JieDimension/assets/games/space-shooter/index.html" 
     target="_blank" 
     class="btn">
    全屏游玩 🎮
  </a>
</div>

## 操作说明

- **移动飞船**：方向键 ← →
- **射击**：空格键
- **暂停**：P 键

## 游戏目标

击败所有敌人，获得最高分！

---

*使用 HTML5 Canvas 开发*
```

---

## 🚀 部署流程

1. **准备游戏文件**
   ```bash
   # 复制到项目
   复制游戏文件夹到 D:\Blog\assets\games\
   ```

2. **创建/更新游戏页面**
   ```bash
   编辑 _games/your-game.md
   添加游戏介绍和 iframe
   ```

3. **本地测试**（可选）
   ```bash
   bundle exec jekyll serve
   访问 http://localhost:4000/JieDimension/games/
   ```

4. **推送到 GitHub**
   ```bash
   双击 deploy.bat
   或手动：
   git add .
   git commit -m "添加 HTML5 游戏"
   git push
   ```

5. **等待构建**（2-3分钟）

6. **访问测试**
   ```
   https://jieice.github.io/JieDimension/games/your-game/
   ```

---

## 💡 进阶技巧

### 1. 添加加载进度

```javascript
// 在游戏中显示加载进度
let loadedAssets = 0;
let totalAssets = 10;

function updateLoadingBar() {
  let progress = (loadedAssets / totalAssets) * 100;
  document.getElementById('progress').style.width = progress + '%';
}
```

### 2. 全屏按钮

```javascript
function toggleFullscreen() {
  let elem = document.getElementById('game-canvas');
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
```

### 3. 移动端适配

```javascript
// 检测触摸事件
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);

// 虚拟按钮
<button id="jump-btn" ontouchstart="jump()">跳跃</button>
```

---

## 📚 相关资源

- **游戏引擎**：
  - Godot Engine (推荐)
  - Phaser 3
  - PixiJS
  - Three.js (3D)

- **教程**：
  - MDN Web Docs - Canvas API
  - Godot HTML5 导出文档

- **工具**：
  - TinyPNG - 图片压缩
  - Audacity - 音频编辑

---

**最后更新**：2025-10-05  
**相关文档**：[文件管理指南](文件管理指南.md) | [维护指南](维护指南.md)

