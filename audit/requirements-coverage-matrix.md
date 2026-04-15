# SkinCareAI 需求覆盖矩阵

更新日期：2026-04-14

| 需求项 | 来源 | 当前状态 | 对应文件 | 备注 |
|---|---|---|---|---|
| 文本对话输入 | 原始需求 P0 | 已完成 | `web/src/features/chat/composer.tsx` | 支持 Enter 发送、Shift+Enter 换行、IME 保护 |
| 单图上传入口 | 原始需求 P0 | 已完成 | `web/src/features/chat/composer.tsx` | 支持点击上传、拖拽、粘贴 |
| 消息流展示 | 原始需求 P0 | 已完成 | `web/src/features/chat/message-list.tsx` | 区分用户与 AI |
| 多轮对话历史 | 原始需求 P0 | 已完成 | `web/src/stores/use-chat-store.ts` | 本地持久化已接入 |
| 加载状态 | 原始需求 P0 | 已完成 | `web/src/features/chat/typing-indicator.tsx` | 流式和等待态都有体现 |
| `/knowledge` 独立入口 | 原始需求扩展 | 已完成 | `web/src/app/app-shell.tsx` | 顶部导航进入 |
| 结构化知识页 | 后续拍板 | 已完成 | `web/src/features/knowledge/knowledge-page.tsx` | 本地知识包驱动 |
| 会话重命名 | 扩展需求 | 已完成 | `web/src/features/sidebar/conversation-list-item.tsx` | 行内改名 |
| 会话删除 | 扩展需求 | 已完成 | `web/src/features/sidebar/conversation-list-item.tsx` | 带确认弹窗 |
| 新建对话 | 扩展需求 | 已完成 | `web/src/features/sidebar/new-conversation-button.tsx` | 左侧显式入口 |
| 一模型一会话 | 后续拍板规则 | 已完成 | `web/src/stores/use-chat-store.ts` | 不允许跨模型续写上下文 |
| 切换模型默认新建会话 | 后续拍板规则 | 已完成 | `web/src/app/app-shell.tsx` | 已落地 |
| 非视觉模型图片 handoff | 后续拍板规则 | 已完成 | `web/src/app/app-shell.tsx` | 自动切到视觉模型新会话 |
| 模型工作台 | Endgame Sprint | 已完成 | `web/src/features/topbar/top-bar.tsx` | 默认推荐模型、帮助入口、状态摘要已收口 |
| 模型选择器分类 | Endgame Sprint | 已完成 | `web/src/features/topbar/model-selector.tsx` | 通用 / 文本 / 图片 / 推理 / 低成本 |
| 会话搜索 | Endgame Sprint | 已完成 | `web/src/features/sidebar/conversation-list.tsx` | 本轮新增 |
| 会话时间分组 | Endgame Sprint | 已完成 | `web/src/features/sidebar/conversation-list.tsx` | 本轮新增 |
| 复制回答 | Endgame Sprint | 已完成 | `web/src/features/chat/message-item.tsx` | 本轮新增 |
| 复制当前会话 | UX Market Research | 已完成 | `web/src/app/app-shell.tsx`, `web/src/lib/share-utils.ts` | 复制当前会话快照，适合作为答辩材料 |
| 导出当前会话 Markdown | UX Market Research | 已完成 | `web/src/app/app-shell.tsx`, `web/src/lib/share-utils.ts` | 本轮确定的最小导出策略 |
| 系统分享会话快照 | UX Market Research | 已完成 | `web/src/app/app-shell.tsx` | 仅在支持 `navigator.share` 的设备上显示 |
| 桌面侧边栏收起 / 展开 | Endgame Sprint | 已完成 | `web/src/app/app-shell.tsx`, `web/src/stores/use-ui-store.ts` | 本轮新增 |
| 主题切换 | 后续拍板规则 | 已完成 | `web/src/features/topbar/top-bar.tsx`, `web/src/index.css` | 深色 / 浅色 / 柔和 |
| tooltip / 帮助入口 | Endgame Sprint | 已完成 | `web/src/components/ui/info-hint.tsx` | 桌面为 popover，小屏改为底部 drawer |
| 最小病例图演示集区块 | Endgame Sprint | 已完成 | `web/src/features/knowledge/knowledge-page.tsx` | 已接入正式内容层 |
| 正式病例图演示目录 | Endgame Sprint | 已完成 | `web/public/clinical-images/demo/` | 目录已建立，待真实图替换 |
| 轻量专家会诊 | Endgame Sprint | 已完成 | `web/src/features/consult/expert-consult-panel.tsx` | 当前为可演示版，待运行级验证 |
| 最终 QA 清单 | Demo Packaging | 已完成 | `audit/final-qa-checklist.md` | 已建立 |
| 当前使用说明 | Demo Packaging | 已完成 | `docs/final-usage-guide.md` | 已建立 |
| 当前答辩演示说明 | Demo Packaging | 已完成 | `docs/demo-packaging-guide.md` | 已建立 |

## 当前仍未完成

- 真实病例图逐张授权替换。
- 真实 `server` 启动后的 `/api/models`、`/api/chat`、`/api/chat/stream`、`/api/vision` 运行级确认。
- 更完整的多主题、多视口截图矩阵。
