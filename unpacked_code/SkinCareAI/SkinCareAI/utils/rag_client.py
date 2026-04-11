import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from backend.scripts.skin_care_ai import SkinCareAI
import threading
import time


class RAGClient:
    """RAG客户端封装"""

    def __init__(self, use_rag=True):
        self.ai = None
        self.use_rag = use_rag
        self.is_initialized = False
        self.init_error = None

    def initialize(self):
        """初始化AI系统"""
        try:
            print("正在初始化皮肤护理AI系统...")
            self.ai = SkinCareAI(use_rag=self.use_rag)
            self.is_initialized = True
            print("AI系统初始化成功！")
            return True
        except Exception as e:
            self.init_error = str(e)
            print(f"AI系统初始化失败: {e}")
            return False

    def ask_question(self, question):
        """提问并获取回答"""
        if not self.is_initialized or not self.ai:
            return "❌ AI系统未初始化，请检查后端服务"

        try:
            # 调用现有的ask方法
            answer = self.ai.ask(question, show_sources=False)
            return answer
        except Exception as e:
            return f"❌ 处理问题时出错: {str(e)}"

    def get_system_info(self):
        """获取系统信息"""
        if not self.is_initialized:
            return "系统未初始化"

        info = {
            "模式": "RAG模式" if self.use_rag else "纯LLM模式",
            "状态": "运行正常",
            "模型": self.ai.llm.model if hasattr(self.ai, 'llm') else "未知"
        }
        return info