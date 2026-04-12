# SkinCareAI 病例图片内容层接入说明

更新日期：2026-04-12

## 当前状态

病例图片层当前只完成“结构准备”，未批量落真实图片。

已具备：

- `src/content/clinical-images/types.ts`
- `src/content/clinical-images/source-registry.json`
- `src/content/clinical-images/manifest.ts`
- `public/clinical-images/*` 占位目录

## 当前能力

- 可登记图片来源
- 可登记图片占位条目
- 可通过 `relatedKnowledgeEntryIds` 与知识条目建立关联
- 可在未来直接替换占位为真实图片路径
- 已为图片与知识条目建立双向关联字段

## 当前边界

- 不批量下载公开图片
- 不默认任何公开图片都可直接商用或公开展示
- 不把候选来源直接当成已授权素材

## 最小接入流程

1. 确认病例图片来源
2. 确认授权 / 使用范围
3. 放入 `public/clinical-images/<disease>/`
4. 更新 `clinical-images/manifest.ts`
5. 补齐 `sourceId`、`path`、`usagePermissionNote`
6. 与知识条目建立 `relatedKnowledgeEntryIds`

## 下一步建议

- 先接最小演示集：
  - 痤疮
  - 湿疹 / 皮炎
  - 真菌感染
  - 银屑病
- 每类先 2 到 3 张足够
- 接入后优先只做知识页或后台内容层演示，不急着做病例图分析功能
