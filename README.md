# JieDimension Studio - 界维互动工作室官方网站

这是界维互动工作室的官方网站，使用 Jekyll 构建，部署在 GitHub Pages 上。

🌐 **网站地址**：https://jieice.github.io/JieDimension/

---

## 📚 文档导航

- **[项目结构说明](docs/项目结构说明.md)** - 了解项目文件组织
- **[维护指南](docs/维护指南.md)** - 日常维护和更新操作
- **[快速参考](docs/快速参考.md)** - 常用命令和模板速查
- **[部署指南](docs/部署指南.md)** - GitHub Pages 部署详细步骤

📂 **更多文档**：查看 [docs/](docs/) 文件夹

---

## 🎮 关于我们

界维互动是一个独立游戏开发工作室，专注于创新游戏体验的探索。

目前正在开发：
- **《面具之下》** - PC心理恐怖游戏
- **《界维守卫》** - 移动端挂机射击游戏
- **HTML5创意游戏** - 网页游戏（开发中）

## 🚀 本地运行

### 环境要求
- Ruby 2.7+
- Jekyll 4.3+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

2. 安装依赖
```bash
bundle install
```

3. 运行本地服务器
```bash
bundle exec jekyll serve
```

4. 在浏览器访问 `http://localhost:4000`

## 📁 项目结构

```
.
├── _config.yml          # Jekyll 配置文件
├── _layouts/            # 页面布局模板
│   ├── default.html
│   ├── post.html
│   └── game.html
├── _games/              # 游戏作品页面
├── _posts/              # 博客文章
├── assets/
│   └── css/
│       └── main.css     # 主样式文件
├── index.html           # 首页
├── games.html           # 游戏作品集页面
├── blog.html            # 博客列表页面
└── about.md             # 关于页面
```

## 🎨 主题特色

- **暗色护眼设计** - 舒适的深色主题，减少眼睛疲劳
- **响应式布局** - 完美适配手机、平板和桌面设备
- **游戏卡片展示** - 精美的游戏作品展示卡片
- **博客功能** - 支持 Markdown 格式的开发日志

## 📝 添加内容

### 添加游戏作品

在 `_games/` 目录下创建新的 Markdown 文件：

```markdown
---
title: 游戏名称
platform: 平台
icon: 🎮
status: 开发状态
date: 2025-10-05
links:
  - text: 链接文字
    url: "#"
    external: true
---

游戏介绍内容...
```

### 添加博客文章

在 `_posts/` 目录下创建文件，格式为 `YYYY-MM-DD-title.md`：

```markdown
---
layout: post
title: 文章标题
date: 2025-10-05 20:00:00 +0800
author: 作者
tags: [标签1, 标签2]
---

文章内容...
```

## 🌐 部署到 GitHub Pages

1. 在 GitHub 上创建新仓库
2. 将代码推送到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支作为源
5. 等待几分钟，网站就会自动部署

## 📧 联系方式

- **邮箱**: 3348149202@qq.com
- **工作室**: 界维互动 (JieDimension Studio)

## 📄 许可证

本项目仅用于展示界维互动工作室的游戏作品和开发日志。

---

© 2025 JieDimension Studio - 界维互动

