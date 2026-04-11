@echo off
echo ========================================
echo   皮肤护理AI系统启动脚本
echo ========================================
echo.

REM 检查虚拟环境
if not exist "venv" (
    echo 正在创建虚拟环境...
    python -m venv venv
)

REM 激活虚拟环境
call venv\Scripts\activate

REM 检查依赖
if not exist "requirements.txt" (
    echo 正在生成requirements.txt...
    pip freeze > requirements.txt
)

REM 运行主程序
echo.
echo 正在启动皮肤护理AI系统...
echo.
python main.py

pause