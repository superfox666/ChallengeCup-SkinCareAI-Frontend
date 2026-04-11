# scripts/vector_store.py

import os
import pickle
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from config.config import (
    CHROMA_DB_PATH,
    CHROMA_COLLECTION_NAME,
    EMBEDDING_MODEL,
    OLLAMA_BASE_URL
)

class VectorStoreManager:
    """向量数据库管理器"""
    
    def __init__(self):
        # 初始化嵌入模型
        self.embeddings = OllamaEmbeddings(
            model=EMBEDDING_MODEL,
            base_url=OLLAMA_BASE_URL
        )
        self.vector_store = None
    
    def create_vector_store(self, documents, collection_name=None):
        """创建向量数据库"""
        print("正在创建向量数据库...")
        
        if collection_name is None:
            collection_name = CHROMA_COLLECTION_NAME
        
        # 创建向量存储
        self.vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=CHROMA_DB_PATH,
            collection_name=collection_name
        )
        
        # 持久化保存
        self.vector_store.persist()
        print(f"✓ 向量数据库创建完成")
        print(f"  位置：{CHROMA_DB_PATH}")
        print(f"  集合：{collection_name}")
        print(f"  文档数：{len(documents)}")
        
        return self.vector_store
    
    def load_vector_store(self, collection_name=None):
        """加载已有的向量数据库"""
        if collection_name is None:
            collection_name = CHROMA_COLLECTION_NAME
        
        print(f"正在加载向量数据库：{collection_name}")
        
        self.vector_store = Chroma(
            persist_directory=CHROMA_DB_PATH,
            embedding_function=self.embeddings,
            collection_name=collection_name
        )
        
        # 获取文档数量
        collection_count = self.vector_store._collection.count()
        print(f"✓ 向量数据库加载完成")
        print(f"  文档数量：{collection_count}")
        
        return self.vector_store
    
    def get_retriever(self, k=5):
        """获取检索器"""
        if not self.vector_store:
            self.load_vector_store()
        
        return self.vector_store.as_retriever(
            search_kwargs={"k": k}
        )
    
    def search_similar(self, query, k=5):
        """搜索相似文档"""
        if not self.vector_store:
            self.load_vector_store()
        
        results = self.vector_store.similarity_search(query, k=k)
        return results
    
    def test_retrieval(self):
        """测试检索功能"""
        test_queries = [
            "痤疮怎么治疗？",
            "湿疹的中医治疗方法",
            "皮肤干燥如何护理"
        ]
        
        for query in test_queries:
            print(f"\n查询：{query}")
            print("-" * 50)
            results = self.search_similar(query, k=2)
            
            for i, doc in enumerate(results, 1):
                source = doc.metadata.get('source', '未知')
                content_preview = doc.page_content[:100] + "..."
                print(f"{i}. 来源：{source}")
                print(f"   内容：{content_preview}")
            print()

if __name__ == "__main__":
    # 测试向量数据库
    manager = VectorStoreManager()
    
    # 检查是否已有处理好的文档
    chunks_path = "data/processed/chunks.pkl"
    
    if os.path.exists(chunks_path):
        print("加载已处理的文档...")
        with open(chunks_path, "rb") as f:
            chunks = pickle.load(f)
        
        # 创建向量数据库
        vector_store = manager.create_vector_store(chunks)
        
        # 测试检索
        print("\n测试检索功能：")
        manager.test_retrieval()
    else:
        print("未找到处理好的文档，请先运行 document_processor.py")
        print("运行命令：python scripts/document_processor.py")