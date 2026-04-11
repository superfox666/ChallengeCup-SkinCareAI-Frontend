# SkinCareAI 知识文本清洗说明

更新日期：2026-04-11

## 1. 本轮采用的保守白名单

用于 Batch 2A `/knowledge` 静态卡片版的上游文本，只保留以下 3 份：

- `unpacked_code/SkinCareAI/SkinCareAI/data/中医皮肤科/基础理论.txt`
- `unpacked_code/SkinCareAI/SkinCareAI/data/西医皮肤科/1.txt`
- `unpacked_code/SkinCareAI/SkinCareAI/data/中西医结合/综合治疗.txt`

## 2. 本轮排除内容

- `中医皮肤科/测试标记.txt`
  - 原因：测试残留，不可公开展示。
- `西医皮肤科/常见疾病.txt`
  - 原因：末尾存在明显脏数据“阿德撒咔咔药用于治疗牛血病”。
- `中医皮肤科/1.txt`
  - 原因：与 `基础理论.txt` 内容重复。
- `中西医结合/1.txt`
  - 原因：与 `综合治疗.txt` 内容重复。
- `data/processed/chunks.pkl`
  - 原因：前端静态展示不需要。

## 3. 清洗后前端展示策略

第一版不直接展示 txt 原文，而是改写为静态知识卡片。

### 中医皮肤基础

- 整体观念
- 风证要点
- 湿证与热证

### 西医常见问题

- 痤疮基础认知
- 湿疹基础认知

### 中西医结合方案

- 痤疮中西医结合方案
- 湿疹中西医结合方案

## 4. 前端卡片字段

每张卡片统一整理为：

- `title`
- `summary`
- `keyPoints`
- `category`
- `safetyNote`
- `sourceLabel`

其中 `sourceLabel` 仅作为内部清洗追踪字段存在于前端数据，不做来源引用卡片展示。

## 5. Batch 2A 页面边界

- 只做静态卡片。
- 不做搜索。
- 不做 RAG。
- 不做引用卡片。
- 不做知识社区、论坛、投稿类扩展。

## 6. 后续建议

- 若进入下一轮知识增强，先继续做文本去重、术语统一和风险审校。
- 若接入搜索或检索增强，需先建立单独的清洗后知识源目录，不应直接读取当前原始 txt。
