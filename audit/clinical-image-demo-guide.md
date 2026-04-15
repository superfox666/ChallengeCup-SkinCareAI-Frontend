# SkinCareAI 病例图演示集指南

更新日期：2026-04-15

## 1. 示例图片现在在哪里

当前演示图片放在：

- `web/public/clinical-images/demo/acne/`
- `web/public/clinical-images/demo/eczema-dermatitis/`
- `web/public/clinical-images/demo/fungal/`
- `web/public/clinical-images/demo/psoriasis/`

当前已接入的真实演示图：

- `web/public/clinical-images/demo/eczema-dermatitis/cdc-phil-4506-eczema.jpg`
- `web/public/clinical-images/demo/fungal/cdc-phil-4811-ringworm.jpg`
- `web/public/clinical-images/demo/fungal/cdc-phil-17271-tinea-barbae.jpg`

## 2. 真图以后放哪里

以后新增真实图片时，继续放在：

- `web/public/clinical-images/demo/<disease>/`

建议按病种分目录，不要混放。

## 3. manifest 怎么改

清单文件：

- `web/src/content/clinical-images/manifest.ts`

每次新增图片后需要同步改：

1. `id`
2. `disease`
3. `path`
4. `source`
5. `status`
6. `updatedAt`
7. `relatedKnowledgeEntryIds`
8. `usagePermissionNote`

如果是新来源，还要同步改：

- `web/src/content/clinical-images/source-registry.json`

如果来源状态或用途范围有新增类型，还要同步改：

- `web/src/content/clinical-images/types.ts`

## 4. 演示时推荐用哪几张

推荐优先顺序：

1. `cdc-phil-4506-eczema.jpg`
2. `cdc-phil-4811-ringworm.jpg`
3. `cdc-phil-17271-tinea-barbae.jpg`

原因：

- 这三张已经正式接入
- 来源清楚
- 路径稳定
- 当前 `/knowledge` 口径已经与它们对齐

## 5. 怎样测试图片问诊链路

1. 启动前端和后端。
2. 打开聊天页。
3. 选择 `Qwen 3 VL Flash`。
4. 上传上述任意一张图片。
5. 输入一句简短问题，例如“这张图更像什么类型的皮肤问题？”。
6. 发送后观察：
   - 图片预览是否出现
   - 加载态是否出现
   - 图文回复是否返回

## 6. 如果要测试 handoff

1. 先切到不支持图片的文本模型。
2. 再上传图片。
3. 确认系统是否提示并切到视觉模型新会话。

## 7. 当前来源与用途边界

- 当前首批真实图来自 CDC PHIL。
- 当前前台用途是演示，不是完整图库。
- 不要把未审核图片、网络随手抓图或 AI 生成图混入这个目录当正式演示图。

## 8. 当前讲法

可以说：

- 已接入首批真实病例图
- 病例图区块、目录、manifest 和来源约束都已固定

不要说：

- 已经建成完整真实病例图库
- 所有图都可无限制公开复用
