# SkinCareAI Mock Server Shell

这是当前阶段的轻量后端壳，已开始接入真实模型路由，同时保留 mock fallback。

## 当前能力

- `GET /api/health`
- `GET /api/models`
- `POST /api/chat`
- `POST /api/vision`
- 真实 adapter:
  - OpenAI Chat
  - OpenAI Responses
  - Anthropic Messages
  - Gemini Native

## 当前边界

- 当前重点是文本对话和图片理解的真实接入
- 仍不接音频、视频、图片生成
- 不做 RAG
- 不做鉴权

## 运行方式

```bash
cd server
npm run dev
```

默认监听：

- `http://127.0.0.1:8787`

## 环境变量

复制 `.env.example` 为 `.env` 后可调整：

- `PORT`
- `HOST`
- `MOCK_PROVIDER_ID`

## 说明

当前服务端壳的目标不是完成真实聊天，而是先把未来接入真实 API 的目录、路由和 provider adapter 结构搭好。
