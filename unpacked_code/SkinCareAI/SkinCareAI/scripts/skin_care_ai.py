from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
# 从 langchain-classic 中导入旧的链函数
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from config.config import CHAT_MODEL, OLLAMA_BASE_URL, TOP_K_RESULTS

from scripts.vector_store import VectorStoreManager
class SkinCareAI:
    """皮肤护理AI核心系统"""
    
    def __init__(self):
        # 初始化聊天模型
        self.llm = ChatOllama(
            model=CHAT_MODEL,
            base_url=OLLAMA_BASE_URL,
            temperature=0.3,
            num_predict=1000,
            system="""你是一个专业的皮肤科AI助手，拥有丰富的中西医皮肤科知识。
            请结合中医和西医的视角，为用户提供专业、准确、实用的皮肤护理建议。
            
            回答要求：
            1. 先分析症状可能的原因
            2. 分别提供中医和西医的治疗思路
            3. 给出具体的治疗方案和建议
            4. 提醒注意事项和禁忌
            5. 如果信息不足，请明确说明并建议就医"""
        )
        
        # 初始化向量存储管理器
        self.vector_manager = VectorStoreManager()
        self.retriever = self.vector_manager.get_retriever(k=TOP_K_RESULTS)
        
        # 创建提示模板
        self.prompt_template = self._create_prompt_template()
        
        # 创建RAG链
        self.qa_chain = self._create_qa_chain()
    
    def _create_prompt_template(self):
        """创建专业提示模板"""
        template = """请你作为专业的皮肤科医生，结合中西医知识回答用户问题。

请根据以下上下文信息进行回答，这些信息来自权威的皮肤科医学资料：

{context}

用户问题：{input}

请按照以下结构组织你的回答：

【症状分析】
- 简要分析可能的疾病类型
- 中医辨证分型（如：风热证、湿热证等）
- 西医诊断思路

【治疗建议】
[中医治疗]
- 治疗原则
- 常用方剂或中药
- 针灸、拔罐等外治法建议

[西医治疗]
- 常用药物（外用药、口服药）
- 物理治疗方法
- 日常护理建议

【中西医结合方案】
- 如何结合中西医优势
- 具体的联合治疗方案
- 疗程和注意事项

【生活调理】
- 饮食建议
- 生活习惯调整
- 皮肤护理要点

【重要提醒】
- 建议就医的情况
- 药物使用注意事项
- 禁忌和副作用说明

请确保回答专业、准确、实用，并用清晰的中文呈现。"""

        return ChatPromptTemplate.from_template(template)
    
    def _create_qa_chain(self):
        """创建RAG问答链"""
        # 创建文档链
        document_chain = create_stuff_documents_chain(
            llm=self.llm,
            prompt=self.prompt_template
        )
        
        # 创建检索链
        retrieval_chain = create_retrieval_chain(
            retriever=self.retriever,
            combine_docs_chain=document_chain
        )
        
        return retrieval_chain
    
    def ask(self, question):
        """回答问题"""
        print(f"\n📋 用户提问：{question}")
        print("🔍 正在检索相关知识并生成回答...")
        
        try:
            # 执行问答
            result = self.qa_chain.invoke({"input": question})
            
            # 提取结果
            answer = result.get("answer", "抱歉，未能生成回答。")
            source_docs = result.get("context", [])
            
            # 显示回答
            print("\n" + "="*60)
            print("💡 AI回答：")
            print("="*60)
            print(answer)
            
            # 显示参考来源
            if source_docs:
                print("\n📚 参考来源：")
                print("-" * 40)
                for i, doc in enumerate(source_docs[:3], 1):
                    source = doc.metadata.get('source', '未知来源')
                    page = doc.metadata.get('page', '')
                    print(f"{i}. {source} {f'第{page}页' if page else ''}")
            
            return {
                "answer": answer,
                "sources": source_docs
            }
            
        except Exception as e:
            error_msg = f"处理问题时出错：{str(e)}"
            print(f"❌ {error_msg}")
            return {"answer": "抱歉，处理问题时出现错误。", "error": str(e)}
    
    def batch_ask(self, questions):
        """批量回答问题"""
        results = []
        for question in questions:
            print(f"\n处理问题：{question}")
            result = self.ask(question)
            results.append(result)
            print("\n" + "="*60)
        return results
    
    def interactive_mode(self):
        """交互式问答模式"""
        print("="*70)
        print("🧬 皮肤护理AI系统已启动")
        print("💊 基于中西医结合知识库")
        print("📖 输入 'quit' 或 'exit' 退出")
        print("="*70)
        
        while True:
            try:
                # 获取用户输入
                print("\n" + "-"*40)
                question = input("请输入你的皮肤问题：").strip()
                
                # 退出条件
                if question.lower() in ['quit', 'exit', '退出']:
                    print("\n感谢使用，祝你皮肤健康！👋")
                    break
                
                if not question:
                    print("⚠️ 问题不能为空，请重新输入")
                    continue
                
                # 处理问题
                self.ask(question)
                
            except KeyboardInterrupt:
                print("\n\n程序已终止")
                break
            except Exception as e:
                print(f"\n❌ 发生错误：{e}")

if __name__ == "__main__":
    # 初始化AI系统
    print("正在初始化皮肤护理AI系统...")
    ai = SkinCareAI()
    
    # 测试问题
    test_questions = [
        "脸上长痘痘怎么办？",
        "湿疹怎么治疗？中医和西医有什么不同？",
        "皮肤干燥脱屑如何护理？",
        "敏感肌肤应该用什么护肤品？"
    ]
    
    print("\n🧪 系统测试：")
    for question in test_questions:
        ai.ask(question)
    
    # 进入交互模式
    ai.interactive_mode()