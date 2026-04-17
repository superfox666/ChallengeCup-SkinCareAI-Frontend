# SkinCareAI 功能回归矩阵 v2

更新日期：2026-04-16

说明：
- 本表对应“先回归功能，再压缩布局，再做增强功能，最后截图验收”的实施顺序。
- “截图/证据”字段使用本轮浏览器截图文件名、构建结果和接口实测结果。
- “是否回归”分为：`是`、`部分`、`否`。

| 功能名 | 上一版入口 | 当前入口 | 当前状态 | 是否回归 | 截图 / 证据 | 修复责任区 |
| --- | --- | --- | --- | --- | --- | --- |
| 文本问答 | `/chat` 输入框 | `聊天` 标签页输入框 | 可发送、可返回、可复制回答 | 是 | `chat-1366-default.png`、浏览器实测 | `web/src/app/app-shell.tsx`、`web/src/features/chat/*` |
| 流式输出 | `/chat` | `聊天` 标签页 | SSE 链路已恢复；浏览器主链路可正常返回 | 是 | `/api/chat/stream` 网络 200、浏览器实测 | `web/src/app/app-shell.tsx` |
| 图片上传 | `/chat` 上传按钮 | `聊天` 标签页上传按钮 | 入口保留，文案恢复 | 是 | `chat-1366-default.png` | `web/src/features/chat/composer.tsx` |
| 图片拖拽 / 粘贴 | `/chat` | `聊天` 标签页输入区 | 代码链路保留，本轮未单独重新截屏 | 部分 | 代码回归检查 | `web/src/features/chat/composer.tsx` |
| 非视觉模型图片 handoff | 文本模型会话 | 文本模型会话内上传图片 | 自动切到视觉模型并新建会话的逻辑保留 | 是 | 代码回归检查、提示文案恢复 | `web/src/app/app-shell.tsx` |
| 模型切换即新会话 | 模型选择器 | `模型` 标签页模型卡 | 已验证切到 `GPT-5.4 mini` 后新建空会话 | 是 | 浏览器实测、`chat-1366-models-top.png` | `web/src/app/app-shell.tsx`、`web/src/features/topbar/model-selector.tsx` |
| 会话搜索 | 侧栏 | 左上抽屉 | 已迁入抽屉，搜索框保留 | 是 | `chat-1366-drawer.png` | `web/src/features/sidebar/conversation-list.tsx` |
| 会话时间分组 | 侧栏 | 左上抽屉会话树 | 分组保留 | 是 | `chat-1366-drawer.png` | `web/src/features/sidebar/conversation-list.tsx` |
| 会话重命名 | 侧栏列表项 | 左上抽屉会话树 | 已验证生成中仍可重命名 | 是 | 2026-04-17 Playwright 实测 | `web/src/features/sidebar/conversation-list-item.tsx` |
| 会话标签 | 原需求新增 | 左上抽屉会话树 | 已补标签编辑与标签搜索 | 是 | 2026-04-17 Playwright 实测 | `web/src/features/sidebar/conversation-list.tsx`、`web/src/features/sidebar/conversation-list-item.tsx` |
| 会话归档 / 恢复 | 原需求新增 | 左上抽屉会话树 | 已补进行中 / 已归档视图与归档恢复入口 | 是 | 2026-04-17 Playwright 实测 | `web/src/features/sidebar/conversation-list.tsx`、`web/src/stores/use-chat-store.ts` |
| 会话删除 | 侧栏列表项 | 左上抽屉会话树 | 入口保留，删除流程仍可用 | 是 | 代码回归检查、交互入口复核 | `web/src/features/sidebar/conversation-list-item.tsx` |
| 复制回答 | 消息卡尾部 | 消息卡尾部 | 已验证可点击 | 是 | 浏览器实测 | `web/src/features/chat/message-item.tsx` |
| 复制会话 | 顶栏 | 顶栏 icon-only 按钮 | 已验证，成功提示恢复 | 是 | 浏览器实测 | `web/src/app/app-shell.tsx`、`web/src/lib/share-utils.ts` |
| 导出 Markdown | 顶栏 | 顶栏 icon-only 按钮 | 已验证，可下载 `.md` | 是 | Playwright 下载记录 | `web/src/app/app-shell.tsx`、`web/src/lib/share-utils.ts` |
| 原生分享 | 顶栏 | 顶栏 icon-only 按钮 | UI 与调用保留；浏览器环境未完整弹出系统面板 | 部分 | 按钮存在、代码链路保留 | `web/src/app/app-shell.tsx` |
| 工作区切换 | 顶部说明块 | 轻量 icon-only 标签条 | 已重写，不再占大面积空间 | 是 | `chat-1366-default.png` | `web/src/features/layout/chat-workspace-deck.tsx` |
| 左上角覆盖式抽屉 | 原侧栏 / 说明区 | 圆形汉堡按钮 | 已实现覆盖式，不挤压主布局 | 是 | `chat-1366-drawer.png` | `web/src/app/app-shell.tsx` |
| Logo 常驻显著展示 | 原总览块 | 顶栏左上常驻 | 已放大并常驻 | 是 | `chat-1366-default.png`、`knowledge-1366-default.png` | `web/src/features/topbar/top-bar.tsx`、`web/src/features/sidebar/brand-block.tsx` |
| 帮助 tooltip | 顶栏帮助按钮 | 顶栏帮助按钮 hover/focus | 已验证，中文正常，无 `\\uXXXX` | 是 | `chat-1366-tooltip.png` | `web/src/components/ui/info-hint.tsx` |
| disclaimer | 右侧说明区 | 顶栏短提示 + 抽屉 / 右侧卡片 | 已恢复短可见提示与详细说明 | 是 | `chat-1366-default.png`、`chat-1366-drawer.png` | `web/src/features/context-rail/disclaimer-card.tsx` |
| 模型状态语义 | 模型选择器 | `模型` 标签页 | `unknown + available=true` 已显示为“可用 / 未测速” | 是 | `chat-1366-models-top.png` | `web/src/lib/model-config.ts` |
| 模型工作台内部滚动 | 顶栏浮层 | `模型` 标签页 | 已验证可滚到 `Qwen Plus Latest` 底部卡片 | 是 | `chat-1366-models-bottom.png` | `web/src/features/topbar/model-selector.tsx` |
| `/knowledge` 首页 | `/knowledge` | `/knowledge` | 首屏入口完整，无整页纵向滚动 | 是 | `knowledge-1366-default.png`、JS scroll 检查 | `web/src/features/knowledge/knowledge-page.tsx` |
| `knowledge` 分类切换 | `/knowledge` | 分类 chips | 已验证可切到“西医常见问题” | 是 | `knowledge-1366-filter.png` | `web/src/features/knowledge/knowledge-page.tsx` |
| 待补占位文案清理 | `/knowledge` | `/knowledge` | 已替换为“来源审核中 / 样例整理中”等产品级文案 | 是 | `knowledge-1366-default.png` | `web/src/features/knowledge/knowledge-page.tsx` |
| 轻量专家会诊 | 右侧面板 | 顶栏按钮打开右侧 Sheet | 已可运行 | 是 | `chat-1366-consult-done.png` | `web/src/features/consult/expert-consult-panel.tsx` |
| 裁决者总结 | 会诊面板底部 | 会诊 Sheet 底部 | 已输出裁决者总结 | 是 | `chat-1366-consult-done.png` | `web/src/features/consult/expert-consult-panel.tsx` |
| 构建与 lint | 工程级要求 | `npm run build` / `npm run lint` | 均已通过 | 是 | 2026-04-16 构建日志 | `web/` |

## 本轮重点结论

- 桌面端 `1366x768` 下，`/chat` 与 `/knowledge` 的 `documentElement.scrollHeight === clientHeight`，主入口不依赖整页纵向滚动。
- 高风险功能未出现“为了压缩布局而剪掉功能”的回归。
- 仍需后续补一轮更细的人手验收项：
  - 真实系统分享面板
  - 图片拖拽 / 粘贴的再次截图验收
