# main_final.py - 完整优化版
import sys
import os
import time
from typing import Optional

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


class SkinCareAISystem:
    """皮肤护理AI系统 - 优化版"""

    def __init__(self):
        self.config = self._load_config()
        self.llm = None
        self.embeddings = None
        self.vector_store = None
        self.retriever = None
        self.chain = None

    def _load_config(self):
        """加载配置"""
        try:
            from config.config import (
                OLLAMA_BASE_URL,
                CHAT_MODEL,
                EMBEDDING_MODEL,
                CHROMA_DB_PATH,
                CHROMA_COLLECTION_NAME,
                TOP_K_RESULTS,
                SYSTEM_PROMPT
            )

            return {
                'ollama_url': OLLAMA_BASE_URL,
                'chat_model': CHAT_MODEL,
                'embedding_model': EMBEDDING_MODEL,
                'chroma_path': CHROMA_DB_PATH,
                'collection_name': CHROMA_COLLECTION_NAME,
                'top_k': TOP_K_RESULTS,
                'system_prompt': SYSTEM_PROMPT
            }

        except ImportError:
            print("⚠️ 配置文件不存在，使用默认配置")
            return {
                'ollama_url': 'http://localhost:11434',
                'chat_model': 'qwen3:8b',
                'embedding_model': 'nomic-embed-text',
                'chroma_path': 'chroma_db',
                'collection_name': 'skin_care_knowledge',
                'top_k': 5,
                'system_prompt': '你是一个专业的皮肤科医生，请用中文回答皮肤相关问题。'
            }

    def initialize_models(self):
        """初始化模型"""
        print("🤖 初始化AI模型...")

        try:
            from langchain_ollama import ChatOllama, OllamaEmbeddings
            from langchain_chroma import Chroma
            from langchain_core.prompts import ChatPromptTemplate
            from langchain_core.output_parsers import StrOutputParser
            from langchain_core.runnables import RunnablePassthrough

            # 1. 初始化聊天模型
            print(f"  加载聊天模型: {self.config['chat_model']}")
            self.llm = ChatOllama(
                model=self.config['chat_model'],
                base_url=self.config['ollama_url'],
                temperature=0.3,
                num_predict=2048
            )

            # 2. 初始化嵌入模型
            print(f"  加载嵌入模型: {self.config['embedding_model']}")
            self.embeddings = OllamaEmbeddings(
                model=self.config['embedding_model'],
                base_url=self.config['ollama_url']
            )

            # 3. 初始化向量数据库
            print(f"  加载向量数据库: {self.config['chroma_path']}")
            self.vector_store = Chroma(
                persist_directory=self.config['chroma_path'],
                embedding_function=self.embeddings,
                collection_name=self.config['collection_name']
            )

            self.retriever = self.vector_store.as_retriever(
                search_kwargs={"k": self.config['top_k']}
            )

            # 4. 创建RAG链
            print("  创建RAG链...")

            # 提示词模板
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", self.config['system_prompt']),
                ("human", """基于以下知识库内容回答用户问题：

相关背景知识：
{context}

用户问题：
{question}

请提供专业回答：""")
            ])

            # 创建链
            self.chain = (
                    {"context": self.retriever, "question": RunnablePassthrough()}
                    | prompt_template
                    | self.llm
                    | StrOutputParser()
            )

            print("✅ 模型初始化完成")
            return True

        except ImportError as e:
            print(f"❌ 导入失败: {e}")
            print("  请安装: pip install langchain-ollama langchain-chroma")
            return False
        except Exception as e:
            print(f"❌ 初始化失败: {e}")
            return False

    def ask(self, question: str) -> str:
        """回答问题"""
        if not self.chain:
            return "❌ 系统未初始化，请先运行 initialize_models()"

        try:
            return self.chain.invoke(question)
        except Exception as e:
            return f"❌ 回答时出错: {e}"

    def chat_loop(self):
        """交互式聊天循环"""
        if not self.initialize_models():
            print("❌ 系统初始化失败")
            return

        print("\n" + "=" * 60)
        print("💬 皮肤护理AI助手")
        print(f"模型: {self.config['chat_model']} + {self.config['embedding_model']}")
        print("输入 '退出' 结束对话")
        print("=" * 60)

        while True:
            try:
                question = input("\n👤 你的问题: ").strip()

                if not question:
                    continue

                if question.lower() in ['退出', 'quit', 'exit', 'q']:
                    print("\n👋 再见！")
                    break

                print("\n🤖 AI正在思考...")
                start_time = time.time()

                answer = self.ask(question)

                end_time = time.time()
                print(f"\n💡 AI回答 (耗时: {end_time - start_time:.2f}秒):")
                print("-" * 40)
                print(answer)
                print("-" * 40)

            except KeyboardInterrupt:
                print("\n\n👋 用户中断，再见！")
                break
            except Exception as e:
                print(f"\n❌ 出错: {e}")


def main():
    """主函数"""
    print("=" * 60)
    print("皮肤护理AI系统 - 最终版")
    print("=" * 60)

    # 简单检查Ollama
    try:
        import subprocess
        result = subprocess.run(['ollama', 'list'],
                                capture_output=True, text=True, timeout=5)

        if result.returncode != 0:
            print("❌ Ollama服务异常")
            print("  请确保 ollama serve 正在运行")
            return

        # 检查关键模型
        output = result.stdout
        if 'qwen3:8b' not in output:
            print("❌ 未找到聊天模型: qwen3:8b")
            print("  运行: ollama pull qwen3:8b")
            return

        if 'qwen3-embedding:8b' not in output:
            print("⚠️ 未找到嵌入模型: nomic-embed-text")
            print("  运行: ollama pull nomic-embed-text")
            print("  或使用现有模型继续...")

    except FileNotFoundError:
        print("❌ Ollama未安装")
        print("  请从 https://ollama.com/download 下载安装")
        return

    # 创建并运行系统
    system = SkinCareAISystem()
    system.chat_loop()


if __name__ == "__main__":
    main()