# SkinCareAI 后端接入计划

更新日期：2026-04-12

## 当前状态

已建立轻量后端壳，并接入真实 API 初版：

- `server/src/index.mjs`
- `GET /api/health`
- `GET /api/models`
- `POST /api/chat`
- `POST /api/vision`
- `providers/openai-chat-adapter`
- `providers/openai-responses-adapter`
- `providers/anthropic-messages-adapter`
- `providers/gemini-native-adapter`

当前目的：

- 为未来真实 API 接入提供统一 adapter 结构
- 让前端开始使用真实 server，而不再只停留在 mock-only

## 当前边界

- 当前只接文本对话和图片理解的真实 API
- 不做 RAG
- 不做鉴权
- 不做数据库

## 未来真实接入建议路径

### 1. 当前 provider adapter 分层

- `providers/provider-adapter.mjs`
- `providers/mock-provider.mjs`
- `providers/openai-chat-adapter.mjs`
- `providers/openai-responses-adapter.mjs`
- `providers/anthropic-messages-adapter.mjs`
- `providers/gemini-native-adapter.mjs`

### 2. 保持前后接口形状稳定

前端当前已开始调用：

- `/api/models`
- `/api/chat`
- `/api/vision`

### 3. 后续建议增加

- 文本流式返回
- 更细的错误码归一
- provider 细分健康检测策略
- 真正的 fallback 观测指标

## 当前运行方式

```bash
cd server
npm run dev
```

默认地址：

- `http://127.0.0.1:8787`

## 下一步最合理的推进

- 继续扩充精选模型注册表
- 优化模型健康检测与状态缓存
- 在保持现有产品规则不变的前提下，完成更稳的真实联调
