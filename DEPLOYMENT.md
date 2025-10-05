# GitHub Pages 部署指南

本指南将帮助你把这个 Jekyll 网站部署到 GitHub Pages。

## 📋 准备工作

1. 拥有 GitHub 账号
2. 安装 Git
3. 本地测试网站运行正常

## 🚀 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 `+` 号，选择 `New repository`
3. 仓库名称有两种选择：
   - **个人/组织主页**：`YOUR_USERNAME.github.io`（推荐）
   - **项目页面**：任意名称，如 `jiedimension-studio`

### 2. 配置 _config.yml

修改 `_config.yml` 文件中的配置：

```yaml
# 如果是个人主页 (username.github.io)
url: https://YOUR_USERNAME.github.io
baseurl: ""

# 如果是项目页面 (username.github.io/project-name)
url: https://YOUR_USERNAME.github.io
baseurl: "/project-name"
```

**重要**：将 `YOUR_USERNAME` 替换为你的 GitHub 用户名！

### 3. 推送代码到 GitHub

在项目根目录打开终端/命令行：

```bash
# 初始化 Git 仓库（如果还没初始化）
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: JieDimension Studio website"

# 推送到 GitHub
git push -u origin main
```

如果推送失败，可能需要先创建 `main` 分支：
```bash
git branch -M main
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Pages`
4. 在 `Source` 下拉菜单中选择：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. 点击 `Save`
6. 等待几分钟，页面会显示网站地址

### 5. 访问你的网站

- **个人主页**: `https://YOUR_USERNAME.github.io`
- **项目页面**: `https://YOUR_USERNAME.github.io/project-name`

## 🔧 常见问题

### 网站样式显示不正常

检查 `_config.yml` 中的 `baseurl` 设置：
- 个人主页应该设置为 `""`
- 项目页面应该设置为 `/project-name`

### 网站没有更新

1. 检查 GitHub Actions 构建状态（仓库的 Actions 标签页）
2. 等待几分钟后刷新浏览器（可能需要硬刷新 Ctrl+F5）
3. 清除浏览器缓存

### Jekyll 构建失败

查看 GitHub Actions 的错误日志，常见问题：
- `_config.yml` 格式错误
- Markdown 文件 Front Matter 格式错误
- 插件不兼容（GitHub Pages 只支持部分插件）

## 🎨 自定义域名（可选）

如果你有自己的域名：

1. 在域名提供商处添加 DNS 记录：
   ```
   类型: CNAME
   名称: www (或 @)
   值: YOUR_USERNAME.github.io
   ```

2. 在仓库根目录的 `CNAME` 文件中写入你的域名：
   ```
   www.yourdomain.com
   ```

3. 在 GitHub Pages 设置中输入自定义域名并保存

## 📝 更新网站

每次修改后：

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Pages 会自动重新构建并发布。

## 🔐 私有仓库

GitHub Pages 可以在私有仓库中使用（需要 GitHub Pro），但生成的网站仍然是公开的。

## 📚 进一步阅读

- [GitHub Pages 官方文档](https://docs.github.com/pages)
- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [Markdown 语法指南](https://www.markdownguide.org/)

---

祝你部署顺利！如有问题，欢迎发邮件到 3348149202@qq.com 咨询。

