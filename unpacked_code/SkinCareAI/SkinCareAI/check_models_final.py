# check_models_final.py - 修复数据结构处理
import subprocess
import json
import sys


def check_ollama_models_final():
    """修复版：正确处理Ollama返回的Model对象"""
    print("=" * 60)
    print("Ollama模型检查 - 最终版")
    print("=" * 60)

    try:
        # 方法1：使用命令行（最可靠）
        print("\n1. 命令行检查...")
        result = subprocess.run(['ollama', 'list'],
                                capture_output=True, text=True, timeout=10)

        if result.returncode == 0:
            print("✓ Ollama服务正常")

            # 解析输出
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:
                print(f"\n已安装模型 ({len(lines) - 1} 个):")
                print("-" * 40)

                for line in lines[1:]:
                    if line.strip():
                        # 提取模型名称（第一列）
                        parts = line.split()
                        if parts:
                            model_name = parts[0]
                            print(f"  • {model_name}")

            # 检查关键模型
            output = result.stdout
            required_models = {
                "聊天模型": "qwen3:8b",
                "嵌入模型": "nomic-embed-text"
            }

            print("\n2. 模型状态检查:")
            print("-" * 40)

            all_ok = True
            for model_type, model_name in required_models.items():
                if model_name in output:
                    print(f"  ✅ {model_type}: {model_name} (已安装)")
                else:
                    print(f"  ❌ {model_type}: {model_name} (未安装)")
                    all_ok = False

            return all_ok

        else:
            print(f"❌ ollama list 失败: {result.stderr}")
            return False

    except FileNotFoundError:
        print("❌ Ollama未安装或不在PATH中")
        return False
    except Exception as e:
        print(f"❌ 检查出错: {e}")
        return False


def check_python_import():
    """检查Python包导入"""
    print("\n3. Python包检查:")
    print("-" * 40)

    required_packages = [
        "langchain_ollama",
        "langchain_chroma",
        "langchain_core",
        "chromadb"
    ]

    all_ok = True
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} (未安装)")
            all_ok = False

    return all_ok


def main():
    """主函数"""
    print("皮肤护理AI系统 - 最终检查工具")

    # 检查Ollama模型
    models_ok = check_ollama_models_final()

    # 检查Python包
    packages_ok = check_python_import()

    print("\n" + "=" * 60)

    if models_ok and packages_ok:
        print("✅ 所有检查通过！")
        print("\n下一步:")
        print("  1. 运行: python main_final.py")
        print("  2. 或运行: python skin_care_rag.py")
    else:
        print("⚠️ 检查未通过，请解决以下问题:")

        if not models_ok:
            print("\n  📥 安装缺失模型:")
            print("     ollama pull nomic-embed-text")

        if not packages_ok:
            print("\n  🔧 安装缺失包:")
            print("     pip install langchain-ollama langchain-chroma chromadb")

    print("=" * 60)


if __name__ == "__main__":
    main()