# scripts/document_processor.py

import os
from pathlib import Path
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    UnstructuredMarkdownLoader,
    Docx2txtLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config.config import KNOWLEDGE_PATHS, CHUNK_SIZE, CHUNK_OVERLAP
import pickle


class DocumentProcessor:
    """文档处理器：加载和分割文档"""

    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", "。", "；", "，", " ", ""]
        )

    def load_documents_from_directory(self, directory_path):
        """从目录加载所有文档"""
        documents = []
        abs_directory_path = os.path.abspath(directory_path)

        if not os.path.exists(abs_directory_path):
            print(f"目录不存在: {abs_directory_path}")
            return documents

        # 支持的文件类型
        supported_extensions = {
            '.txt': TextLoader,
            '.pdf': PyPDFLoader,
            '.md': UnstructuredMarkdownLoader,
            '.docx': Docx2txtLoader,
        }

        # 遍历目录
        for file_path in Path(abs_directory_path).rglob("*"):
            if file_path.suffix.lower() in supported_extensions:
                try:
                    loader_class = supported_extensions[file_path.suffix.lower()]
                    # 优先用 UTF-8 加载
                    loader = loader_class(str(file_path.resolve()), encoding='utf-8')
                    loaded_docs = loader.load()
                    documents.extend(loaded_docs)
                    print(f"✓ 已加载: {file_path.name}")
                except UnicodeDecodeError:
                    # 如果 UTF-8 失败，再尝试 GBK
                    loader = loader_class(str(file_path.resolve()), encoding='gbk')
                    loaded_docs = loader.load()
                    documents.extend(loaded_docs)
                    print(f"✓ 已加载(GBK): {file_path.name}")
                except Exception as e:
                    print(f"✗ 加载失败 {file_path.name}: {e}")

        return documents

    def split_documents(self, documents):
        """分割文档为chunks"""
        if not documents:
            print("没有文档可分割")
            return []

        chunks = self.text_splitter.split_documents(documents)
        print(f"文档分割完成：共 {len(documents)} 个文档 -> {len(chunks)} 个chunks")
        return chunks

    def process_all_knowledge(self):
        """处理所有知识库文档"""
        all_chunks = []

        for category, path in KNOWLEDGE_PATHS.items():
            print(f"\n处理 {category} 知识库...")
            docs = self.load_documents_from_directory(path)
            if docs:
                chunks = self.split_documents(docs)
                all_chunks.extend(chunks)
                print(f"  {category}: {len(chunks)} 个chunks")
            else:
                print(f"  {category}: 没有找到文档")

        # 保存处理结果
        if all_chunks:
            os.makedirs("data/processed", exist_ok=True)
            with open("data/processed/chunks.pkl", "wb") as f:
                pickle.dump(all_chunks, f)
            print(f"\n✓ 所有文档处理完成，共 {len(all_chunks)} 个chunks")

        return all_chunks


if __name__ == "__main__":
    processor = DocumentProcessor()
    chunks = processor.process_all_knowledge()

    if chunks:
        print(f"\n示例chunk预览：")
        print("-" * 50)
        print(f"来源：{chunks[0].metadata.get('source', '未知')}")
        print(f"内容（前200字符）：{chunks[0].page_content[:200]}...")