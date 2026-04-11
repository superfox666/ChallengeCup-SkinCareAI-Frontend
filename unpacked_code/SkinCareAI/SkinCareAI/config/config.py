# config/config.py - 最终优化版
# 皮肤护理AI系统配置

# Ollama配置
OLLAMA_BASE_URL = "http://localhost:11434"

# 模型配置 - 根据你的选择
CHAT_MODEL = "qwen3:8b"                    # 聊天模型
EMBEDDING_MODEL = "nomic-embed-text"     # 嵌入模型

# 向量数据库配置
CHROMA_DB_PATH = "chroma_db"
CHROMA_COLLECTION_NAME = "skin_care_knowledge"

# 检索配置
TOP_K_RESULTS = 5
SIMILARITY_THRESHOLD = 0.7

# 文本处理配置
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# 知识库路径
KNOWLEDGE_PATHS = {
    "tcm": "data/中医皮肤科",
    "western": "data/西医皮肤科",
    "integrated": "data/中西医结合"
}

# 系统提示词
SYSTEM_PROMPT = """你是一个专业的皮肤科医生，拥有中西医结合的知识背景。
请根据用户的问题，提供专业、准确、实用的皮肤护理建议。
回答时请：1. 先分析问题类型（痤疮、湿疹、过敏等）
2. 提供中西医不同的治疗思路
3. 给出具体的护理建议
4. 提醒注意事项和就医建议
请用中文回答，语言亲切专业。"""