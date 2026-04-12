# SkinCareAI 需求覆盖矩阵

更新日期：2026-04-12

| 需求项 | 来源 | 当前状态 | 对应文件 | 备注 |
|---|---|---|---|---|
| 文本对话输入 | 原始文档 P0 | 已完成 | `web/src/features/chat/composer.tsx` | 支持 Enter 发送、Shift+Enter 换行、IME 保护 |
| 单图上传入口 | 原始文档 P0 | 已完成 | `web/src/features/chat/composer.tsx` | 仅支持单图，符合当前阶段边界 |
| 消息流展示 | 原始文档 P0 | 已完成 | `web/src/features/chat/message-list.tsx` | 区分用户与 AI 消息 |
| 多轮对话历史 | 原始文档 P0 | 已完成 | `web/src/stores/use-chat-store.ts` | 本地持久化已接入 |
| 加载状态 | 原始文档 P0 | 已完成 | `web/src/features/chat/typing-indicator.tsx` | 生成中禁重发 |
| 新建对话按钮 | 原始文档 / 后续拍板 | 已完成 | `web/src/features/sidebar/new-conversation-button.tsx` | 左侧显式入口，不依赖模型切换 |
| 会话重命名 | 原始文档扩展 | 已完成 | `web/src/features/sidebar/conversation-list-item.tsx` | 行内重命名 |
| 会话删除 | 原始文档扩展 | 已完成 | `web/src/features/sidebar/conversation-list-item.tsx` | 带确认弹窗 |
| 对话分组 / 标签 | 原始文档扩展 | 未完成 | - | 按阶段延后 |
| `/knowledge` 独立入口 | 原始文档扩展 | 已完成 | `web/src/app/router.tsx` | 顶部导航进入 |
| 科普页固定文章 / 卡片 | 原始文档扩展 | 已完成 | `web/src/features/knowledge/knowledge-page.tsx` | 已切换到本地结构化知识包 |
| 科普页搜索 / RAG | 原始文档扩展 | 未完成 | - | 当前明确不做 |
| 一个模型一个会话 | 后续拍板规则 | 已完成 | `web/src/stores/use-chat-store.ts` | 不允许跨模型续写上下文 |
| 切模型默认新建会话 | 后续拍板规则 | 已完成 | `web/src/app/app-shell.tsx` | 已落地 |
| 非视觉模型图片 handoff | 后续拍板规则 | 已完成 | `web/src/app/app-shell.tsx` | 自动切到视觉模型新会话 |
| Provider-agnostic / mock-first | 后续拍板规则 | 已完成 | `web/src/lib/provider-adapter.ts`, `web/src/lib/mock-adapter.ts` | 已保留 mock fallback，同时开始接真实 server |
| 右侧栏边界 | 后续拍板规则 | 已完成 | `web/src/features/layout/chat-context-rail-panel.tsx` | 仅品牌卡、能力卡、免责声明 |
| Logo 方案 A | 后续拍板规则 | 已完成 | `web/src/features/sidebar/brand-block.tsx` | 抠图版 + 浅底圆片 |
| 本地知识包基础层 | 后续阶段目标 | 已完成 | `web/src/content/knowledge/` | 已从硬编码数组切换到结构化内容，当前总条目数 21 |
| 知识包校验机制 | 后续阶段目标 | 已完成 | `web/scripts/validate-knowledge.mjs` | schema + registry + manifest 校验 |
| manifest 自动生成 | 本轮工作线 C | 已完成 | `web/scripts/generate-knowledge-manifest.mjs` | 不再手工维护 manifest，按 displayOrder 自动刷新 |
| `/knowledge` 精选 / 全部 | 本轮工作线 D | 已完成 | `web/src/features/knowledge/knowledge-page.tsx` | 精选与全部分层已落地 |
| 病例图片内容层结构 | 后续阶段目标 | 部分完成 | `web/src/content/clinical-images/` | 已有 manifest/registry/占位与知识条目关联，但无真实图片 |
| 轻量后端壳 | 本轮工作线 F | 已完成 | `server/` | 已具备真实 API adapter 架构与 mock fallback |
| 真实文本对话接入 | 真实 API 阶段 | 已完成 | `server/src/index.mjs`, `server/src/providers/`, `web/src/lib/server-adapter.ts` | `/api/chat` 已打到真实模型 |
| 真实图片理解接入 | 真实 API 阶段 | 已完成 | `server/src/index.mjs`, `server/src/providers/`, `web/src/lib/server-adapter.ts` | `/api/vision` 已打到真实模型 |
| 精选模型注册表 | 真实 API 阶段 | 已完成 | `server/src/registry/curated-models.mjs` | 当前为 16 个精选模型 |
| 模型健康状态 | 真实 API 阶段 | 已完成 | `server/src/services/model-health.mjs` | 当前为轻量检测和缓存 |
| 外部白名单资料引入 | 后续阶段目标 | 部分完成 | `web/src/content/knowledge/sources/source-registry.json` | 仅登记候选来源，未抓取正文 |
| 搜索框 / 本地检索 | 未来规划 | 未完成 | - | 当前明确不做 |
| 真实 API | 未来规划 | 未完成 | - | 当前明确不接 |
