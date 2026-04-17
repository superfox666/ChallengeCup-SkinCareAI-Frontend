# 模型逐个验收表

更新日期：2026-04-16

测试方法：
- 先请求 `GET /api/models` 获取当前模型清单。
- 再对每个模型执行一次最小文本请求 `POST /api/chat`。
- 不修改任何 `Base URL`、`API key`、中转站配置或 provider 链路。
- 本轮逐测重点是“可选中 + 可发请求 + 返回状态 + 是否有正文 + fallback 情况”，不是回答质量打分。

说明：
- `返回状态` 为接口 HTTP 状态。
- `返回来源` 为服务端返回的 `providerId`。
- `fallback` 为是否降级到本地 mock。
- `演示影响` 仅判断是否影响主链路可用性。

| 模型名 | selectable | requestOk | 耗时(ms) | 返回状态 | 返回来源 | fallback | 演示影响 | 备注 |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| GPT-5.4 mini | 是 | 是 | 12721 | 200 | openai | 否 | 低 | 返回正常正文 |
| GPT-5.4 | 是 | 是 | 1307 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| Qwen Plus Latest | 是 | 是 | 27152 | 200 | qwen | 否 | 中 | 可用但响应较慢 |
| Qwen 3.6 Plus | 是 | 是 | 370 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| DeepSeek Chat | 是 | 是 | 16042 | 200 | deepseek | 否 | 低 | 返回正常正文 |
| DeepSeek R1 | 是 | 是 | 30007 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| DeepSeek V3.1 | 是 | 是 | 5698 | 200 | deepseek | 否 | 低 | 返回正常正文 |
| DeepSeek R1 0528 | 是 | 是 | 30008 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| Qwen 3 235B Instruct | 是 | 是 | 11070 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 235B Thinking | 是 | 是 | 30006 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| Kimi K2 Instruct | 是 | 是 | 5842 | 200 | kimi | 否 | 低 | 返回正常正文 |
| Kimi K2 Thinking | 是 | 是 | 5007 | 200 | kimi | 否 | 低 | 返回正常正文 |
| Claude Sonnet 4.6 | 是 | 是 | 27906 | 200 | anthropic | 否 | 中 | 可用但响应较慢 |
| Claude Opus 4.6 Thinking | 是 | 是 | 7170 | 200 | anthropic | 否 | 低 | 返回正常正文 |
| Qwen 3 VL Flash | 是 | 是 | 6859 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 VL Plus | 是 | 是 | 8478 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 VL 32B Thinking | 是 | 是 | 30010 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| Qwen 3 VL 235B Thinking | 是 | 是 | 30004 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| Qwen 3 VL 32B Instruct | 是 | 是 | 12320 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 VL 8B Instruct | 是 | 是 | 10781 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 VL 30B Thinking | 是 | 是 | 13875 | 200 | qwen | 否 | 低 | 返回正常正文 |
| Qwen 3 VL 235B Instruct | 是 | 是 | 12366 | 200 | qwen | 否 | 低 | 返回正常正文 |
| GPT-4o All | 是 | 是 | 10431 | 200 | openai | 否 | 低 | 返回正常正文 |
| Llama 3.2 90B Vision | 是 | 是 | 4302 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| o3 Pro All | 是 | 是 | 2063 | 200 | mock | 是 | 中 | 当前触发 mock fallback，但前端链路可用 |
| GPT-5.4 Nano | 是 | 是 | 15188 | 200 | openai | 否 | 低 | 返回正常正文 |

## 汇总

- 模型总数：26
- 可在前端选中的模型：26 / 26
- 最小文本请求返回 200：26 / 26
- 返回非空正文：26 / 26
- 真实上游返回：17 / 26
- mock fallback：9 / 26
  - `GPT-5.4`
  - `Qwen 3.6 Plus`
  - `DeepSeek R1`
  - `DeepSeek R1 0528`
  - `Qwen 3 235B Thinking`
  - `Qwen 3 VL 32B Thinking`
  - `Qwen 3 VL 235B Thinking`
  - `Llama 3.2 90B Vision`
  - `o3 Pro All`

## 解释

- 这 9 个 fallback 不代表前端功能丢失，而是当前上游不可用或超时后，服务端按既有回退策略返回 mock。
- 本轮逐测覆盖的是“最小文本连通性”。视觉模型的图片输入链路，本轮通过前端上传、切模保草稿和 handoff 做了 UI 级复测，但没有对 11 个视觉模型逐个喂图跑满量回归。
