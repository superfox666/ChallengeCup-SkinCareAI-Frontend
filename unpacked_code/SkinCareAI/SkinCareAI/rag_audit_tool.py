# rag_audit_tool.py - RAG系统审计工具
import sys
import os
import json
from datetime import datetime
import numpy as np
from collections import Counter


class RAGAuditor:
    """RAG系统审计工具"""

    def __init__(self, ai_system, knowledge_base_path="data"):
        self.ai_system = ai_system
        self.knowledge_base_path = knowledge_base_path

    def audit_response(self, question, ground_truth=None):
        """
        审计单个回答

        Args:
            question: 问题
            ground_truth: 标准答案（可选）
        """
        print("=" * 60)
        print("🔍 单问题审计")
        print("=" * 60)

        print(f"问题: {question}")

        # 获取回答
        result = self.ai_system.ask(question, show_sources=True)
        answer = result.get("answer", "")
        sources = result.get("sources", [])

        print(f"\n🤖 AI回答:")
        print("-" * 40)
        print(answer)
        print("-" * 40)

        # 分析来源
        if sources:
            print(f"\n📚 引用的知识库文档 ({len(sources)} 个):")
            source_counter = Counter()

            for i, source in enumerate(sources, 1):
                # 提取文档来源
                source_str = str(source)
                if 'metadata' in source_str and 'source' in source_str:
                    # 尝试解析
                    import re
                    match = re.search(r"source='([^']+)'", source_str)
                    if match:
                        doc_path = match.group(1)
                        doc_name = os.path.basename(doc_path)
                        source_counter[doc_name] += 1
                        print(f"  {i}. {doc_name}")
                    else:
                        print(f"  {i}. 未知来源")
                else:
                    print(f"  {i}. 无法解析来源")

            print(f"\n📊 文档引用统计:")
            for doc, count in source_counter.most_common():
                print(f"  • {doc}: {count} 次")

        # 如果有标准答案，比较
        if ground_truth:
            similarity = self._calculate_similarity(answer, ground_truth)
            print(f"\n✅ 与标准答案相似度: {similarity:.2%}")

            if similarity < 0.5:
                print("⚠️ 警告: 回答与标准答案差异较大")

        return {
            "question": question,
            "answer": answer,
            "sources": [str(s) for s in sources],
            "similarity": similarity if ground_truth else None
        }

    def batch_audit(self, questions_file="test_questions.json"):
        """
        批量审计

        Args:
            questions_file: 包含测试问题的JSON文件
        """
        print("=" * 60)
        print("📊 批量审计")
        print("=" * 60)

        # 加载测试问题
        if os.path.exists(questions_file):
            with open(questions_file, "r", encoding="utf-8") as f:
                test_data = json.load(f)
        else:
            # 使用默认测试问题
            test_data = {
                "questions": [
                    {"text": "痤疮怎么治疗？", "category": "常见疾病"},
                    {"text": "湿疹的中医辨证分型有哪些？", "category": "中医理论"},
                    {"text": "敏感肌如何选择护肤品？", "category": "日常护理"},
                    {"text": "皮肤屏障受损怎么修复？", "category": "皮肤健康"},
                    {"text": "紫外线对皮肤有什么伤害？", "category": "防晒知识"}
                ]
            }

        results = []

        for i, item in enumerate(test_data["questions"], 1):
            print(f"\n[{i}/{len(test_data['questions'])}] 审计: {item['text']}")

            result = self.audit_response(item["text"])
            result["category"] = item.get("category", "未知")
            results.append(result)

        # 生成审计报告
        self._generate_audit_report(results)

        return results

    def _calculate_similarity(self, text1, text2):
        """计算文本相似度（简化版）"""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        if not text1 or not text2:
            return 0

        try:
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            return similarity
        except:
            return 0

    def _generate_audit_report(self, results):
        """生成审计报告"""
        report = {
            "audit_time": datetime.now().isoformat(),
            "total_questions": len(results),
            "questions_with_sources": sum(1 for r in results if r.get("sources")),
            "results": results
        }

        # 统计
        categories = {}
        for r in results:
            cat = r.get("category", "未知")
            if cat not in categories:
                categories[cat] = {"count": 0, "with_sources": 0}
            categories[cat]["count"] += 1
            if r.get("sources"):
                categories[cat]["with_sources"] += 1

        report["category_stats"] = categories

        # 保存报告
        report_file = f"rag_audit_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"\n" + "=" * 60)
        print(f"📄 审计报告已生成: {report_file}")
        print("=" * 60)

        # 打印摘要
        print(f"\n📊 审计摘要:")
        print(f"  • 审计时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  • 测试问题数: {len(results)}")
        print(f"  • 有知识库来源的问题: {report['questions_with_sources']}")
        print(f"  • 知识库覆盖率: {report['questions_with_sources'] / len(results) * 100:.1f}%")

        print(f"\n📂 分类统计:")
        for category, stats in categories.items():
            coverage = stats["with_sources"] / stats["count"] * 100
            print(f"  • {category}: {stats['count']}题, 覆盖率: {coverage:.1f}%")


# 使用示例
if __name__ == "__main__":
    try:
        from scripts.skin_care_ai import SkinCareAI

        print("初始化皮肤护理AI系统...")
        ai = SkinCareAI(use_rag=True)

        auditor = RAGAuditor(ai)

        # 交互式审计
        print("\n选择审计模式:")
        print("1. 单问题审计")
        print("2. 批量审计")
        print("3. 退出")

        choice = input("\n请输入选择 (1/2/3): ").strip()

        if choice == "1":
            question = input("请输入要审计的问题: ").strip()
            if question:
                auditor.audit_response(question)

        elif choice == "2":
            print("\n正在执行批量审计...")
            auditor.batch_audit()

        else:
            print("退出审计工具")

    except Exception as e:
        print(f"❌ 审计出错: {e}")
        import traceback

        traceback.print_exc()