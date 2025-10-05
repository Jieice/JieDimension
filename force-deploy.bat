@echo off
echo ====================================
echo 强制重新部署
echo ====================================
echo.

echo [1/6] 清理旧的 Git 配置...
rmdir /s /q .git 2>nul
echo.

echo [2/6] 重新初始化 Git...
git init
echo.

echo [3/6] 配置 Git...
git config user.name "Jieice"
git config user.email "3348149202@qq.com"
echo.

echo [4/6] 添加所有文件（包括 GitHub Actions）...
git add .
git add .github/workflows/jekyll.yml -f
echo.

echo [5/6] 提交更改...
git commit -m "重建网站: JieDimension Studio 游戏作品集 + GitHub Actions"
echo.

echo [6/6] 强制推送到 GitHub...
git branch -M master
git remote add origin https://github.com/Jieice/JieDimension.git
git push -f origin master
echo.

echo ====================================
echo 部署完成！
echo ====================================
echo.
echo 下一步操作：
echo 1. 访问 https://github.com/Jieice/JieDimension/actions
echo 2. 查看构建进度
echo 3. 等待构建完成后访问网站
echo.
echo 网站地址: https://jieice.github.io/JieDimension
echo.
pause

