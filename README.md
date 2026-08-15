# JieDimension · 界维互动工作室

独立游戏开发者 Jieice 的个人作品集网站，展示已上线游戏、Game Jam 原型与技术博客。

Indie game developer portfolio for Jieice — released games, Game Jam prototypes, and a tech blog. Bilingual (zh-CN / en) with a sakura-pink cute theme (樱色物语) built on pure static HTML/CSS/JS (no build step).

## Structure / 目录

```
public/                 # Static site root (deployed as-is)
├── index.html          # Single-page portfolio
├── 404.html
├── css/styles.css      # Theme + layout
├── js/
│   ├── i18n.js         # zh/en translations
│   ├── main.js         # Nav, scroll, language toggle
│   └── blog.js         # Markdown blog loader (uses marked.js)
├── content/posts/      # Markdown blog posts with YAML frontmatter
├── content/posts.json  # Blog metadata manifest
├── assets/
│   ├── images/         # Game cover images & screenshots
│   ├── games/          # Browser-playable web games
│   └── js/             # Vendored marked.js + highlight.js
├── play/               # Hosted open-source games (A Dark Room, etc.)
├── favicon/
└── og/
.github/workflows/deploy.yml  # GitHub Pages deployment
```

## Deploy / 部署

Push to `master` — GitHub Actions copies `public/` to `dist/` and ships it to GitHub Pages at **www.jiece.art**.

## Featured Games / 已上线游戏

- 《班后钓鱼》(After-Work Fishing) — TapTap [app/890877](https://www.taptap.cn/app/890877)
- 《界维守卫》(Dimension Defender) — TapTap app/893652

## Tech / 技术栈

Pure static HTML/CSS/JS · marked.js for markdown · highlight.js for code · IntersectionObserver for scroll reveals · localStorage for language persistence. No framework, no build step.

## License

MIT — see [LICENSE](./LICENSE).
