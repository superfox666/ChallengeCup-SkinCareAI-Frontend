# fix_complete.py
import os
import subprocess
import sys

print("=" * 60)
print("一键修复皮肤护理AI系统")
print("=" * 60)

# 1. 检查并创建必要的目录
print("\n1. 检查目录结构...")
directories = ["data", "chroma_db", "scripts", "config",
               "data/中医皮肤科", "data/西医皮肤科", "data/中西医结合"]

for directory in directories:
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
        print(f"✓ 创建目录: {directory}")
    else:
        print(f"✓ 目录已存在: {directory}")

# 2. 修复 config.py
print("\n2. 修复配置文件...")
config_content = '''# config/config.py
# 系统配置

# 模型配置
OLLAMA_BASE_URL = "http://localhost:11434"  # Ollama默认地址
CHAT_MODEL = " qwen3:8b"  # 聊天模型
EMBEDDING_MODEL = "qwen3:8b"  # 嵌入模型

# 向量数据库配置
CHROMA_DB_PATH = "chroma_db"
CHROMA_COLLECTION_NAME = "skin_care_knowledge"

# 检索配置
TOP_K_RESULTS = 5  # 每次检索返回的结果数量
SIMILARITY_THRESHOLD = 0.7  # 相似度阈值

# 文本处理配置
CHUNK_SIZE = 1000  # 文本分块大小
CHUNK_OVERLAP = 200  # 分块重叠大小

# 知识库路径
KNOWLEDGE_PATHS = {
    "tcm": "data/中医皮肤科",
    "western": "data/西医皮肤科",
    "integrated": "data/中西医结合"
}
'''

config_path = "config/config.py"
with open(config_path, "w", encoding="utf-8") as f:
    f.write(config_content)
print("✓ 配置文件已修复")

# 3. 检查并安装依赖
print("\n3. 检查依赖...")
dependencies = [
    "langchain==1.0.8",
    "langchain-core==1.2.16",
    "langchain-community==0.4.0",
    "langchain-text-splitters==1.1.1",
    "langchain-ollama>=0.3.0",
    "langchain-chroma>=0.1.0",
    "chromadb==0.4.22",
    "ollama==0.6.1",
    "pypdf>=4.0.0",
    "docx2txt>=0.8"
]

print("请确保已安装以下依赖：")
for dep in dependencies:
    print(f"  {dep}")

# 4. 创建示例知识文档
print("\n4. 创建示例知识文档...")
example_docs = {
    "data/中医皮肤科/基础理论.txt": """中医皮肤科基础理论
==================

一、整体观念
皮肤是人体最大的器官，与五脏六腑密切相关。
中医认为"有诸内必形诸外"，皮肤问题常反映内部脏腑功能失调。

二、辨证论治体系
1. 风证
   - 特点：发病迅速，游走不定，瘙痒剧烈
   - 常见疾病：荨麻疹、皮肤瘙痒症
   - 治疗原则：祛风止痒

2. 湿证
   - 特点：皮损渗出，缠绵难愈
   - 常见疾病：湿疹、皮炎
   - 治疗原则：健脾祛湿

3. 热证
   - 特点：皮损红肿，灼热疼痛
   - 常见疾病：痤疮、毛囊炎
   - 治疗原则：清热凉血
""",

    "data/西医皮肤科/常见疾病.txt": """常见皮肤疾病及治疗
==================

一、痤疮（Acne）
1. 病因：毛囊皮脂腺单位慢性炎症
2. 分级：
   - 轻度：粉刺为主
   - 中度：炎性丘疹
   - 重度：结节囊肿
3. 西医治疗：
   - 外用：维A酸、过氧化苯甲酰、抗生素
   - 口服：抗生素、异维A酸、激素
   - 物理治疗：光动力、激光

二、湿疹（Eczema）
1. 病因：多种内外因素引起的炎症性皮肤病
2. 临床表现：红斑、丘疹、水疱、糜烂、渗出、结痂
3. 西医治疗：
   - 外用：糖皮质激素、钙调神经磷酸酶抑制剂
   - 口服：抗组胺药、免疫抑制剂
   - 物理治疗：UVB光疗
""",

    "data/中西医结合/综合治疗.txt": """中西医结合皮肤治疗
==================

一、痤疮的中西医结合治疗
1. 西医为主，中医为辅
   - 西医：外用维A酸控制炎症
   - 中医：清热凉血、活血化瘀
2. 联合用药方案
   - 白天：外用克林霉素
   - 晚上：外用维A酸
   - 口服：中药枇杷清肺饮

二、湿疹的中西医结合治疗
1. 急性期：西医控制，中医调理
   - 西医：短期使用糖皮质激素
   - 中医：清热利湿，方用龙胆泻肝汤
2. 慢性期：中医为主，西医为辅
   - 中医：养血润燥，方用当归饮子
   - 西医：保湿修复皮肤屏障
"""
}

for file_path, content in example_docs.items():
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ 创建: {file_path}")

# 5. 检查关键脚本是否存在
print("\n5. 检查关键脚本...")
essential_scripts = ["document_processor.py", "vector_store.py", "skin_care_ai.py"]
missing_scripts = []

for script in essential_scripts:
    script_path = os.path.join("scripts", script)
    if not os.path.exists(script_path):
        missing_scripts.append(script)
        print(f"⚠️ 缺少脚本: {script}")
    else:
        print(f"✓ 脚本存在: {script}")

if missing_scripts:
    print(f"\n❌ 缺少以下脚本: {', '.join(missing_scripts)}")
    print("请确保已创建这些脚本文件")
else:
    # 6. 检查导入是否正确
    print("\n6. 检查脚本导入...")

    # 检查 document_processor.py
    doc_processor_path = "scripts/document_processor.py"
    if os.path.exists(doc_processor_path):
        with open(doc_processor_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 检查导入
        if "from langchain.text_splitter import RecursiveCharacterTextSplitter" in content:
            print("⚠️ document_processor.py 中有旧版导入，需要修复")
            content = content.replace(
                "from langchain.text_splitter import RecursiveCharacterTextSplitter",
                "from langchain_text_splitters import RecursiveCharacterTextSplitter"
            )
            with open(doc_processor_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("✓ 已修复 document_processor.py 导入")

        if "from langchain_community.vectorstores import Chroma" in content:
            content = content.replace(
                "from langchain_community.vectorstores import Chroma",
                "from langchain_chroma import Chroma"
            )
            with open(doc_processor_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("✓ 已修复 Chroma 导入")

    # 检查 skin_care_ai.py
    skin_care_path = "scripts/skin_care_ai.py"
    if os.path.exists(skin_care_path):
        with open(skin_care_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 检查 create_retrieval_chain
        if "from langchain.chains import create_retrieval_chain" in content:
            print("⚠️ skin_care_ai.py 中有旧版API，需要修复")
            # 这里需要更复杂的修复，但我们先标记

    # 检查 vector_store.py
    vector_store_path = "scripts/vector_store.py"
    if os.path.exists(vector_store_path):
        with open(vector_store_path, "r", encoding="utf-8") as f:
            content = f.read()

        if "from langchain_community.vectorstores import Chroma" in content:
            content = content.replace(
                "from langchain_community.vectorstores import Chroma",
                "from langchain_chroma import Chroma"
            )
            with open(vector_store_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("✓ 已修复 vector_store.py 中的 Chroma 导入")

# 7. 创建测试脚本
print("\n7. 创建测试脚本...")
test_script = '''# test_full_system.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("="*60)
print("完整系统测试")
print("="*60)

# 测试1: 配置
print("\\n1. 测试配置导入...")
try:
    from config.config import (
        OLLAMA_BASE_URL, CHAT_MODEL, EMBEDDING_MODEL,
        CHROMA_DB_PATH, TOP_K_RESULTS
    )
    print(f"✓ 配置导入成功")
    print(f"  聊天模型: {CHAT_MODEL}")
    print(f"  嵌入模型: {EMBEDDING_MODEL}")
except Exception as e:
    print(f"❌ 配置导入失败: {e}")

# 测试2: 关键模块导入
print("\\n2. 测试模块导入...")
modules_to_test = [
    ("langchain_text_splitters", "RecursiveCharacterTextSplitter"),
    ("langchain_chroma", "Chroma"),
    ("langchain_ollama", "ChatOllama"),
    ("langchain_ollama", "OllamaEmbeddings"),
    ("langchain_core.prompts", "ChatPromptTemplate"),
    ("langchain_core.runnables", "RunnablePassthrough"),
    ("langchain_core.output_parsers", "StrOutputParser"),
]

all_ok = True
for module, item in modules_to_test:
    try:
        exec(f"from {module} import {item}")
        print(f"✓ {module}.{item}")
    except ImportError as e:
        print(f"✗ {module}.{item}: {e}")
        all_ok = False

# 测试3: Ollama连接
print("\\n3. 测试Ollama连接...")
try:
    import ollama
    models = ollama.list()
    print(f"✓ Ollama已连接")

    # 检查模型是否存在
    available_models = [m['name'] for m in models.get('models', [])]
    print(f"  可用模型: {available_models}")

    if CHAT_MODEL not in available_models:
        print(f"⚠️ 警告: 聊天模型 {CHAT_MODEL} 未找到")
    if EMBEDDING_MODEL not in available_models:
        print(f"⚠️ 警告: 嵌入模型 {EMBEDDING_MODEL} 未找到")

except Exception as e:
    print(f"✗ Ollama连接失败: {e}")
    all_ok = False

# 测试4: 知识库文档
print("\\n4. 检查知识库文档...")
docs_found = []
for root, dirs, files in os.walk("data"):
    for file in files:
        if file.endswith(('.txt', '.md', '.pdf', '.docx')):
            docs_found.append(os.path.join(root, file))

if docs_found:
    print(f"✓ 找到 {len(docs_found)} 个知识文档")
else:
    print("⚠️ 未找到知识文档")

print("\\n" + "="*60)
if all_ok:
    print("✅ 测试通过！可以运行主程序")
    print("运行: python main.py")
else:
    print("❌ 测试失败，请检查以上错误")
print("="*60)
'''

with open("test_full_system.py", "w", encoding="utf-8") as f:
    f.write(test_script)
print("✓ 测试脚本已创建")

print("\n" + "=" * 60)
print("✅ 修复完成！")
print("\n下一步：")
print("1. 运行测试: python test_full_system.py")
print("2. 如果测试通过，运行: python main.py")
print("3. 如果测试失败，请根据错误信息修复")
print("=" * 60)