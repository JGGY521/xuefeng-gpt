@echo off
chcp 65001 >nul
title 🏗️ 雪峰GPT - 赛博毒奶版张雪峰

echo.
echo   ╔═══════════════════════════════════════╗
echo   ║       🏗️  雪峰GPT 启动中...          ║
echo   ║                                      ║
echo   ║   赛博毒奶版张雪峰，在线发癫         ║
echo   ║   信哥的，都飞升了！                 ║
echo   ╚═══════════════════════════════════════╝
echo.

:: 检查 node_modules 有没有装
if not exist "node_modules" (
    echo   📦 首次运行，安装依赖中...
    echo.
    call npm install
    echo.
)

:: 启动
echo   🚀 打开浏览器访问：http://localhost:3000
echo.
start http://localhost:3000
node server.js

pause
