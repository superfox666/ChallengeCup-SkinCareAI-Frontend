@echo off
echo ========================================
echo 皮肤护理AI系统 - 一键安装工具
echo ========================================
echo.

echo 1. 检查Ollama服务...
ollama list > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama未运行
    echo   请先运行: ollama serve
    pause
    exit /b 1
)
echo ✓ Ollama服务正常

echo.
echo 2. 安装Qwen3嵌入模型...
echo   正在安装 qwen3-embedding:8b...
ollama pull qwen3-embedding:8b

echo.
echo 3. 安装Python依赖...
pip install langchain-ollama langchain-chroma chromadb langchain-core

echo.
echo 4. 创建配置文件...
if not exist config mkdir config

(
echo # config/config.py
echo OLLAMA_BASE_URL = "http://localhost:11434"
echo CHAT_MODEL = "qwen3:8b"
echo EMBEDDING_MODEL = "qwen3-embedding:8b"
echo CHROMA_DB_PATH = "chroma_db"
echo CHROMA_COLLECTION_NAME = "skin_care_knowledge"
echo TOP_K_RESULTS = 5
echo SYSTEM_PROMPT = """你是一个专业的皮肤科医生，请用中文回答皮肤相关问题。"""
) > config\config.py

echo.
echo 5. 运行检查...
python check_models_final.py

echo.
echo ========================================
echo ✅ 安装完成！
echo.
echo 运行命令:
echo   1. 检查模型: python check_models_final.py
echo   2. 运行系统: python main_final.py
echo ========================================
pause