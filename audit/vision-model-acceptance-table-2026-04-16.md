# 视觉模型逐个验收表

更新日期：2026-04-16

测试方法：
- 使用同一张本地样图 `web/public/clinical-images/demo/eczema-dermatitis/cdc-phil-4506-eczema.jpg`。
- 对全部 11 个 `supportsVision = true` 的模型逐个请求 `POST /api/vision`。
- 提示词固定为中文皮肤图像问诊结构化问题，不修改任何 `Base URL`、`API key`、provider 或回退策略。
- 本轮逐测重点是“图片链路可用 + 返回非空正文 + 是否触发 fallback”，不是图像诊断质量排名。

说明：
- `返回状态` 为接口 HTTP 状态。
- `返回来源` 为服务端返回的 `providerId`。
- `fallback` 为是否降级到本地 mock。
- `演示影响` 仅判断是否影响图像问诊主链路可用性。

| 模型名 | selectable | requestOk | 耗时(ms) | 返回状态 | 返回来源 | fallback | 演示影响 | 备注 |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| Qwen 3 VL Flash | 是 | 是 | 16793 | 200 | qwen | 否 | 低 | 返回正常图像分析正文 |
| Qwen 3 VL Plus | 是 | 是 | 30008 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| Qwen 3 VL 32B Thinking | 是 | 是 | 30017 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| Qwen 3 VL 235B Thinking | 是 | 是 | 30021 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| Qwen 3 VL 32B Instruct | 是 | 是 | 16852 | 200 | qwen | 否 | 低 | 返回正常图像分析正文 |
| Qwen 3 VL 8B Instruct | 是 | 是 | 17379 | 200 | qwen | 否 | 低 | 返回正常图像分析正文 |
| Qwen 3 VL 30B Thinking | 是 | 是 | 18232 | 200 | qwen | 否 | 低 | 返回正常图像分析正文 |
| Qwen 3 VL 235B Instruct | 是 | 是 | 30016 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| GPT-4o All | 是 | 是 | 30006 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| Llama 3.2 90B Vision | 是 | 是 | 8378 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |
| o3 Pro All | 是 | 是 | 1788 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但图片链路可用 |

## 汇总

- 视觉模型总数：11
- 逐个请求成功：11 / 11
- 返回非空正文：11 / 11
- 真实上游返回：4 / 11
- mock fallback：7 / 11
  - `Qwen 3 VL Plus`
  - `Qwen 3 VL 32B Thinking`
  - `Qwen 3 VL 235B Thinking`
  - `Qwen 3 VL 235B Instruct`
  - `GPT-4o All`
  - `Llama 3.2 90B Vision`
  - `o3 Pro All`

## 结论

- 11 个视觉模型的图片输入链路已经全部跑过一轮，不再是“只验证了上传 UI，没有逐个喂图”。
- 当前未闭环点已经从“有没有逐个测”收口为“部分模型上游当前不可用或超时，触发 mock fallback”。
- 问题位置在上游可用性，不在前端上传、会话切换、图片保留或 `/api/vision` 路由本身。
