---
title: Planet Drop / 星球合成
platform: Web / HTML5
image: /assets/images/games/planet-drop.png
image_avif: /assets/images/games/planet-drop.avif
status: 在线游玩 | itch.io
featured: true
feature_order: 1
date: 2025-10-06
links:
  - text: 🎮 在 itch.io 上游玩
    url: "https://jieice.itch.io/planet-drop"
    external: true
  - text: 🚀 提交到 CrazyGames
    url: "#"
    external: false
---

## 游戏简介

一款轻松休闲的太空主题合成益智游戏！点击投放星球，合并相同星球创造更大的星球，最终目标是合成恒星！

### 🌟 游戏特色

- **🔥 连击系统** - 3秒内连续合成触发最高2.5倍分数加成
- **⭐ 幸运星球** - 金色光圈星球提供双倍积分
- **🌟 恒星诞生** - 合成11级恒星时的华丽粒子特效
- **🎨 精美画面** - 使用Kenney.nl专业太空素材
- **🌐 多语言支持** - 支持英文和中文切换
- **🎵 轻松音效** - 独立BGM和音效音量控制

---

## 🎮 在线游玩

### 推荐：在 itch.io 上游玩

<div style="text-align: center; margin: 2rem 0;">
  <iframe 
    frameborder="0" 
    src="https://itch.io/embed/3060688?linkback=true&amp;border_width=2&amp;bg_color=0d1117&amp;fg_color=ffffff&amp;link_color=58a6ff&amp;border_color=30363d" 
    width="100%" 
    height="169"
    style="max-width: 552px; border-radius: 8px;">
    <a href="https://jieice.itch.io/planet-drop">Planet Drop by JieDimension</a>
  </iframe>
</div>

<div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin: 2rem 0; border-left: 4px solid var(--accent-primary);">
  <p style="margin-bottom: 1rem;">
    💡 <strong>提示</strong>：游戏在 itch.io 上完全免费游玩！
  </p>
  <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 1.5rem;">
    <li>点击上方按钮直接在 itch.io 上游玩</li>
    <li>支持PC和移动设备</li>
    <li>无需下载，浏览器直接运行</li>
    <li>自动保存最高分（本地存储）</li>
  </ul>
</div>

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://jieice.itch.io/planet-drop" 
     target="_blank" 
     class="btn"
     style="font-size: 1.1rem; padding: 1rem 2rem; margin: 0.5rem;">
    🚀 在 itch.io 上游玩
  </a>
  <a href="{{ '/games/' | relative_url }}" 
     class="btn btn-secondary"
     style="margin: 0.5rem;">
    ← 返回游戏列表
  </a>
</div>

---

## 🕹️ 游戏玩法

### 基本规则

1. **投放星球**：点击屏幕投放星球到容器中
2. **合成升级**：两个相同星球碰撞会自动合成更大的星球
3. **连击加成**：3秒内连续合成触发连击倍数（最高×2.5）
4. **避免溢出**：星球不能超过顶部红线，否则游戏结束

### 操作方法

- **投放星球**：鼠标点击 / 触摸屏幕
- **暂停游戏**：点击右上角 ⏸ Pause 按钮
- **切换语言**：主菜单点击 EN/中文 按钮
- **音效控制**：主菜单点击设置按钮

### 进阶技巧

- 💡 **观察下一个**：屏幕右侧显示下一个星球
- 💡 **连击是关键**：快速连续合成获得高分加成
- 💡 **注意幸运星球**：金色光圈双倍积分
- 💡 **平衡布局**：避免一侧堆积过高
- 💡 **F2秘技**：开发者模式（彩蛋）

---

## 🪐 星球进化链

```
Level 1 → Level 2 → Level 3 → Level 4 → Level 5
   ↓
Level 6 → Level 7 → Level 8 → Level 9 → Level 10
   ↓
Level 11 🌟 恒星！（最终目标）
```

**每次合成会有华丽的粒子特效！**

---

## 🎯 挑战目标

| 难度 | 目标分数 | 称号 |
|------|---------|------|
| 🌱 新手 | 1,000 分 | 星际学徒 |
| 🌿 进阶 | 5,000 分 | 合成高手 |
| 🌲 高手 | 15,000 分 | 星球大师 |
| 🌳 专家 | 30,000+ 分 | 宇宙传奇 |

**你能创造恒星吗？挑战看看吧！**

---

## ⭐ 连击系统详解

连击系统是获得高分的关键！

```
3秒内连续合成：
1次合成 = 正常分数
2次合成 = ×1.5 倍分数 🔥
3次合成 = ×2.0 倍分数 🔥🔥
4+次合成 = ×2.5 倍分数 🔥🔥🔥
```

**屏幕上会显示连击特效和倍数提示！**

---

## 💻 技术实现

- **游戏引擎**：Phaser 3.70
- **物理引擎**：Matter.js（支持休眠优化）
- **多语言**：自定义LanguageManager
- **音频管理**：独立BGM和SFX控制
- **性能优化**：粒子数量控制、物理迭代优化
- **响应式设计**：支持PC和移动设备

---

## 📱 移动端支持

本游戏完全支持移动设备：

- ✅ 触摸操作优化
- ✅ 自适应屏幕尺寸
- ✅ 竖屏和横屏都支持
- ✅ 自动暂停（切换标签时）

---

## 🌐 平台发布

**已发布：**
- ✅ **itch.io** - 免费游玩
- ⏳ **CrazyGames** - 审核中
- 📅 **更多平台** - 即将推出

**立即访问：**
- 🎮 [在 itch.io 上游玩](https://jieice.itch.io/planet-drop)

---

## 🎨 关于这个游戏

**Planet Drop** 是一款受经典"合成游戏"启发的太空主题益智游戏。使用纯Web技术开发，无需下载即可畅玩。

游戏特别优化了：
- 流畅的物理模拟
- 华丽的粒子特效
- 直观的操作体验
- 快速的加载速度
- 多语言支持

---

## 🔧 开发信息

- **开发者**：界维互动 (JieDimension Studio)
- **引擎**：Phaser 3 + Matter.js
- **美术素材**：Kenney.nl
- **类型**：休闲益智 / 合成游戏
- **首发日期**：2025-10-06
- **版本**：v1.6

---

## 🐛 开发者彩蛋

游戏内按 **F2** 激活开发者模式：
- `1-9/0` - 生成指定等级星球
- `S` - 生成两个10级星球（触发恒星合成）
- `C` - 触发连击显示测试

**发现更多隐藏功能吧！** 🛠️

---

## 📊 更新日志

### v1.6 (2025-10-06)
- ✨ 多语言支持（英文/中文）
- 🔊 分离BGM和音效控制
- 🎮 新增游戏说明场景
- 🐛 修复"球不掉落"问题
- ⚡ 性能优化（粒子、物理）
- 🛠️ 完善开发者模式

---

<div style="text-align: center; margin: 3rem 0; padding: 2rem; background: var(--bg-secondary); border-radius: 12px;">
  <h3 style="margin-bottom: 1rem;">💬 反馈与建议</h3>
  <p style="color: var(--text-secondary); margin-bottom: 1rem;">
    喜欢这个游戏吗？有什么建议或发现了Bug？
  </p>
  <p>
    欢迎在 itch.io 上留言或发送邮件到：
    <a href="mailto:jieice@vip.qq.com">jieice@vip.qq.com</a>
  </p>
</div>

---

**享受星际合成的乐趣！** 🚀🌟

