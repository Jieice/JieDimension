@echo off
echo ====================================
echo 部署到 GitHub Pages
echo ====================================
echo.

echo [1/5] 初始化 Git 仓库...
git init
echo.

echo [2/5] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/Jieice/JieDimension.git
echo.

echo [3/5] 添加所有文件...
git add .
echo.

echo [4/5] 提交更改...
git commit -m "重建网站: JieDimension Studio 游戏作品集"
echo.

echo [5/5] 强制推送到 GitHub (覆盖旧内容)...
git branch -M master
git push -f origin master
echo.

echo ====================================
echo 部署完成！
echo ====================================
echo.
echo 网站地址: https://jieice.github.io/JieDimension
echo.
echo 请等待 2-5 分钟让 GitHub Pages 构建完成
echo.
pause

