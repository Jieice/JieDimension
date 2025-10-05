@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════╗
echo ║   🚀 JieDimension Studio - 快速部署        ║
echo ╚════════════════════════════════════════════╝
echo.
echo 正在准备部署...
echo.

echo [1/4] 📋 检查文件状态...
git status --short
echo.

echo [2/4] ➕ 添加所有更改...
git add .
echo ✓ 文件已添加
echo.

echo [3/4] 💾 提交更改...
git commit -m "添加水果合成游戏 - 可在线试玩的HTML5游戏"
echo ✓ 提交完成
echo.

echo [4/4] 🌐 推送到 GitHub...
git push origin master
echo.

if %errorlevel% equ 0 (
    echo ╔════════════════════════════════════════════╗
    echo ║   ✅ 部署成功！                            ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo 📍 网站地址：
    echo    https://jieice.github.io/JieDimension/
    echo.
    echo 🎮 游戏地址：
    echo    https://jieice.github.io/JieDimension/games/fruit-merge/
    echo.
    echo ⏰ 请等待 2-3 分钟让 GitHub Pages 构建完成
    echo.
    echo 📊 查看构建状态：
    echo    https://github.com/Jieice/JieDimension/actions
    echo.
) else (
    echo ╔════════════════════════════════════════════╗
    echo ║   ❌ 部署失败                              ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. 需要输入 GitHub 凭据
    echo 3. 推送冲突
    echo.
    echo 请检查错误信息并重试
    echo.
)

pause

