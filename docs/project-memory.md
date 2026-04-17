# SkinCareAI Project Memory

## 2026-04-13

### 当前阶段

- 当前处于 `Endgame Sprint + Final QA + Demo Packaging` 阶段。
- 项目已经不是 mock-only 原型，而是接入真实 API 之后的产品化封板阶段。
- 当前重点不是补底层，不是继续扩知识条目，而是把 UX、视觉、QA、演示链路和收尾文档推进到接近正式答辩成品。
- 当前记忆恢复和后续判断都应以本地仓库 `F:\ChallengeCup-SkinCareAI-Frontend` 为主依据，GitHub 只作为辅助对照。

### 当前稳定规则

- 一个模型一个会话。
- 切换模型默认创建新会话，不混上下文。
- 非视觉模型上传图片时，必须 handoff 到推荐视觉模型的新会话。
- 主题切换、模型状态、模型列表、知识页和上传链路不能回退。
- 当前不做 RAG、不做复杂鉴权、不做大型社区页。

### 当前已完成能力

- `server/` 已提供：
  - `/api/health`
  - `/api/models`
  - `/api/chat`
  - `/api/chat/stream`
  - `/api/vision`
- 文本问答、图片理解、流式返回、多会话持久化已经打通。
- `/knowledge` 已切到结构化知识包驱动，不再是硬编码空壳。
- 病例图内容层已有 `manifest + source registry + placeholder` 基础结构。

### 本轮真正做了什么

- 重新恢复项目记忆，重新读取需求、API 文档、交接记录、审计文档和关键前后端结构。
- 重做聊天页顶部 `TopBar`，压缩原先宽屏下过瘦过高的说明卡，强化默认推荐模型、主题帮助说明和模型工作台层级。
- 重做模型选择器，补充分类候选数量、默认通用模型卡、帮助入口和更明确的推荐起点表达。
- 调整了 `app-shell` 三栏比例，给中间主聊天区更多宽度。
- 修正了三栏 stretch 问题，避免左侧会话列把整页高度拖长。
- 收缩并精简了右侧说明 rail，减少与顶部模型摘要的重复信息，缩短品牌展示卡高度。
- 给左侧会话列表补了搜索和按时间分组能力。
- 增加了桌面端侧边栏收起 / 展开能力。
- 给 AI 回答补了“复制回答”按钮。
- 增加了轻量专家会诊入口与并排结果面板。
- 修复了文本和图片 fallback / handoff 场景下的重复用户消息问题。
- 把帮助弹层改成带边界碰撞处理的 fixed overlay，避免弹到页面外。
- 调整了轻量专家会诊 Sheet 宽度，避免结果卡被挤成竖条。
- 在消息较少时补了“继续追问建议”卡，减轻主聊天区大面积空洞。
- 统一了 server 未联通时的页面口径，不再同时出现“真实已接入”和 `Provider: mock / unknown` 的混乱表述。
- 在 `/knowledge` 页面接入了“最小病例图演示集”区块，把病例图准备状态正式挂到前端展示层。
- 建立了正式演示目录：
  - `web/public/clinical-images/demo/acne/`
  - `web/public/clinical-images/demo/eczema-dermatitis/`
  - `web/public/clinical-images/demo/fungal/`
  - `web/public/clinical-images/demo/psoriasis/`
- 新增封板文档：
  - `audit/clinical-image-demo-guide.md`
  - `audit/final-qa-checklist.md`
  - `audit/endgame-market-research-notes.md`
  - `docs/final-usage-guide.md`
  - `docs/demo-packaging-guide.md`

### 本轮真正验证了什么

- 新建对话
- 模型切换
- 文本问答
- 图片上传
- 图片粘贴
- 图片拖拽
- 非视觉模型 handoff
- 会话搜索
- 会话时间分组
- 会话重命名
- 会话删除
- 复制回答
- 主题切换
- `/knowledge` 导航与分类切换
- 病例图区块帮助入口
- 轻量专家会诊（图片问题）
- 轻量专家会诊（文本问题）
- 移动端会话侧边栏 Sheet
- 移动端右侧说明区 Sheet
- 帮助弹层边界不越界
- 三栏布局不再被左侧列拖成长页

### 本轮没验证成的是什么

- `build`
- `lint`
- 真实 server 启动后的真接口回归
- 移动端侧边栏 Sheet 入口的最终点击验证
- 多主题、多视口的全量截图矩阵

### 当前成品度判断

- 当前已经比上一轮更接近“可正式答辩演示”的状态。
- 主链路、handoff、知识页、病例图区块和轻量专家会诊都已经不只是写了代码，而是至少完成了一轮浏览器侧运行验证。
- 但仍未到可以正式封板的程度，因为工程级检查和真实 server QA 还没有闭环。

### 当前最大风险

- 当前 server 未启动，真实接口回归仍缺失。
- 大屏投放时仍有“消息少时主区偏空”的残余问题，但已较上一轮明显收敛。
- `knowledge` 在移动端仍然很长，滚动成本高。
- 病例图如果被误讲成“真实图库已完备”，会带来版权和专业性风险。
- 当前工具链异常影响最后一轮自动化和半自动化回归。

### 当前推荐答辩演示顺序

1. 先展示聊天主页整体三栏结构和主题切换。
2. 讲“默认推荐模型 + 一个模型一个会话”的规则。
3. 演示文本提问和流式 / fallback 回答。
4. 演示非视觉模型带图时自动 handoff 到视觉模型的新会话。
5. 演示会话搜索、时间分组、重命名、删除和复制回答。
6. 演示轻量专家会诊。
7. 切到 `/knowledge` 展示结构化知识包和最小病例图演示集区块。
8. 最后强调免责声明、真实 API 路由和病例图授权边界。

### 当前默认模型推荐

- 当前本地 fallback 默认通用模型：`Skin Core`
- 当前本地 fallback 默认图片模型：`Vision Insight`
- 当前本地 fallback 偏专业文本模型：`Clinical Notes`
- 若真实 server 恢复，再以真实模型池映射结果为准

### 当前专家会诊完成度

- 已有轻量版前端实现：
  - 围绕当前单条问题发起
  - 自动挑选 2 到 3 个代表模型
  - 并排展示简要结论和差异观察
- 浏览器侧已验证：
  - 图片问题可发起
  - 文本问题可发起
  - 结果面板可展示简要结论和差异观察
- 当前仍需真实 server 条件下验证：
  - 接口回包稳定性
  - 图片问题时的模型选择是否符合预期
  - fallback 展示是否清晰

### 当前病例图目录与接入方式

- 正式目录：
  - `web/public/clinical-images/demo/acne/`
  - `web/public/clinical-images/demo/eczema-dermatitis/`
  - `web/public/clinical-images/demo/fungal/`
  - `web/public/clinical-images/demo/psoriasis/`
- 当前接入方式：
  - 先通过 `web/src/content/clinical-images/manifest.ts` 维护占位条目
  - 页面已挂“最小病例图演示集”区块
  - 后续逐张授权审核后再把真实图片替换进 demo 目录

### 当前剩余任务

- 恢复 shell 工具并跑完 `build / lint`
- 启动本地 server 并验证真实 `/api/models`、`/api/chat`、`/api/chat/stream`、`/api/vision`
- 继续补多主题、多视口截图回归
- 如果还有余量，只补最值得做的 1 到 2 个高感知功能，不再扩大战线

### 当前执行阻塞

- 当前 shell 工具因 PowerShell 启动异常不可用。
- 因此 `build / lint / server` 级验证仍需在工具恢复后补做。

## 2026-04-14

### 本轮做了哪些市场调研

- 继续对标 ChatGPT、Claude、Gemini、Perplexity 的首屏、模型选择、右侧辅助区、知识页组织方式。
- 核心结论不是“加更多功能”，而是继续减解释、减高度、减阅读负担，让页面更像成熟产品。

### 每个对标产品学到了什么

- ChatGPT：首屏更克制，默认入口更直接。
- Claude：工作区感更强，左侧与主区关系更稳。
- Gemini：浅色主题更清楚，轻亮层级更好。
- Perplexity：右侧辅助区和多模型对照更服务当前任务。

### 哪些结论落到了哪些模块

- `web/src/features/topbar/top-bar.tsx`
- `web/src/features/sidebar/brand-block.tsx`
- `web/src/features/context-rail/brand-showcase-card.tsx`
- `web/src/features/context-rail/model-capability-card.tsx`
- `web/src/features/chat/empty-state.tsx`
- `web/src/features/knowledge/knowledge-page.tsx`
- `web/src/index.css`
- `audit/endgame-market-research-notes.md`

### 当前最明显提升了哪些体验

- 首屏更克制，不再像一块说明板。
- 左侧品牌区更轻。
- 右 rail 更像当前演示辅助区。
- `knowledge` 移动端长度进一步收敛。
- 浅色主题边界和层次更清楚。

### 当前还剩哪些 UX 问题

- `knowledge` 移动端仍偏长，但已较上一轮收敛。
- 浅色主题仍然比深色弱一点。
- 少消息状态下主区完整感仍可继续打磨。

### 当前是否接近可以开始人工验收

- 已经明显接近。
- 但仍建议先补最后一轮真实前端 + 真实接口页面回看，再开始正式人工验收。

## 第 3 轮（2026-04-14，本次接管续做）

### 本轮做了哪些市场调研

- 补查了 ChatGPT、Claude、Gemini、Perplexity 在会话组织、分享快照、帮助入口和文件 / 图片入口上的官方资料。
- 这轮明确把“分享 / 导出策略”和“帮助问号在移动端怎么处理”从模糊想法收成了产品决策。

### 每个对标产品学到了什么

- ChatGPT：共享快照路径清晰，适合学“会话级分享动作靠近内容本身”。
- Claude：Projects / 分享更像工作区补充能力，适合学“轻量上下文管理 + 快照分享”。
- Gemini：复杂能力藏在 Gems 和文件入口里，适合学“默认少解释，进阶再展开”。
- Perplexity：Thread 动作靠近当前答案，适合学“复制 / 分享 / 导出不另起中心页”。

### 哪些结论落到了哪些模块

- `web/src/app/app-shell.tsx`
- `web/src/features/topbar/top-bar.tsx`
- `web/src/components/ui/info-hint.tsx`
- `web/src/features/chat/message-item.tsx`
- `web/src/lib/share-utils.ts`
- `audit/endgame-market-research-notes.md`
- `audit/requirements-coverage-matrix.md`
- `audit/final-qa-checklist.md`

### 当前最明显提升了哪些体验

- 聊天页顶部已经有明确的会话级分享主路径：复制会话、导出 Markdown、系统分享。
- 帮助问号在移动端不再像试验品，已改成 drawer 式底部弹层。
- 首屏进一步减少了阅读负担，状态条比上一轮更像成熟 AI 产品。
- `build` 和 `lint` 已经补跑通过，当前代码状态比上一轮更稳。

### 当前还剩哪些 UX 问题

- `knowledge` 移动端仍然偏长，是最主要的剩余 UX 尾项。
- 模型工作台虽然已经减负，但在小屏下仍偏高。
- 浅色主题已经清楚很多，但离最成熟的 Gemini / ChatGPT 轻亮层级仍有一点距离。

### 当前是否接近可以开始人工验收

- 已经更接近了，且比上一轮更像成熟产品页。
- 如果下一步能补真实 server 真链路回归，再做一轮人工讲解式走查，就可以进入正式人工验收。

## 第 4 轮（2026-04-14，Final Acceptance Prep）

### 本轮做了哪些市场调研

- 继续以 ChatGPT、Claude、Gemini、Perplexity 的官方资料为主，对模型选择、分享 / 导出 / 复制、帮助入口、侧边栏、空状态、少消息状态、图片输入、知识页分类、轻量专家会诊、主题切换、右侧说明区做逐功能对标。
- 这轮不再谈“模块级参考”，而是直接给每个核心功能下 1 到 3 条可落地决策。

### 每个对标产品学到了什么

- ChatGPT：默认入口克制、会话级分享清楚、Projects 心智明确。
- Claude：Projects 和分享都是工作区补充能力，文件与上下文关系更稳。
- Gemini：Gems 和文件入口把复杂能力藏进次级层，浅色层级比当前更干净。
- Perplexity：Thread / Space 组织和 `Copy / Share / Export` 靠近当前内容，更像工作流。

### 哪些结论落到了哪些模块

- `web/src/features/knowledge/knowledge-page.tsx`
- `web/src/features/knowledge/knowledge-card.tsx`
- `web/src/features/topbar/top-bar.tsx`
- `web/src/features/topbar/model-ui.tsx`
- `web/src/features/context-rail/brand-showcase-card.tsx`
- `web/src/features/context-rail/disclaimer-card.tsx`
- `web/src/features/chat/message-list.tsx`
- `web/src/features/consult/expert-consult-panel.tsx`
- `web/src/index.css`
- `server/src/utils/http.mjs`
- `audit/final-qa-checklist.md`
- `audit/endgame-market-research-notes.md`
- `docs/final-usage-guide.md`
- `docs/demo-packaging-guide.md`
- `audit/current-phase-summary.md`

### 当前最明显提升了哪些体验

- `knowledge` 移动端比上一轮更短，导览和卡片都更像“先扫读、再展开”。
- 空会话首屏的模型工作台改成 compact 版，解释感进一步下降。
- 浅色主题边框、阴影和卡片层级更清楚，投屏感比上一轮强。
- 轻量专家会诊改为打开即自动跑，不再出现“点开发现还没开始”的尴尬。
- 后端请求体已兼容 UTF-8 BOM，避免部分 Windows 请求直接把 server 打崩。

### 当前还剩哪些 UX 问题

- `knowledge` 移动端虽然明显收短，但仍不是完全理想长度。
- 侧边栏收起后，主聊天区首屏仍会显得偏空。
- 右 rail 仍略长，尤其免责声明卡在深色大屏上还占一定注意力。
- 系统分享仍需真实设备确认原生面板行为。

### 当前是否接近可以开始人工验收

- 这轮结束后，项目比上一轮更接近人工验收准备完成。
- 但当前我仍不建议立刻开始最终人工验收，因为还剩几个硬项：
  - 真实病例图仍未接入
  - `qwen-plus-latest` 文本链路出现过超时 fallback
  - 系统分享缺少真机确认
  - `knowledge` 移动端仍有最后一小段可收空间
## 第6轮（2026-04-14，外部 URL 登录态复核）

### 本轮确认

- 当前 `C:\Users\luo\.codex\config.toml` 已恢复为外部 provider：
  - `model_provider = "gptcodex"`
  - `base_url = "https://gptcodex.top"`
  - `wire_api = "responses"`
  - `requires_openai_auth = true`
- 当前 `codex login status` 显示的是 `Logged in using an API key`，不是纯 ChatGPT 账户登录态。
- 本地 `auth.json` 同时保留了 `OPENAI_API_KEY` 和 OpenAI tokens，但从 CLI 状态看，当前活跃登录方式仍是 API key。

### 本轮判断

- “短问题能用，聊天记录一长就卡住”更像外部网关对长上下文请求的处理时间、上下文长度或流式转发有上限。
- 这类故障日志是 `524`，更符合上游处理超时；如果是登录态冲突，通常更像 `401` 或 `403`。
- 因此，本轮倾向判断：主因不是“没有先退出官方账号再接 API”，而是外部 URL 在长对话场景下超时。

### 后续建议

- 如果继续走这条外部链路，优先排查外部服务的上下文窗口、请求体大小限制、Cloudflare 超时和高 `reasoning_effort` 带来的时延。
- 若只是为了排除登录态混用，可单独做一次 `codex logout` 后仅用目标 API 方式重登，但这更像排除项，不是当前最像根因的项。
## 第7轮（2026-04-14，Codex 外部 Provider 最终结论调研）

### 本轮调研范围

- 官方文档：
  - Codex `Configuration Reference`
  - Codex `CLI`
  - Codex `Windows`
  - Help Center《在你的 ChatGPT 套餐中使用 Codex》
  - OpenAI Models 文档
- 社区与评论区：
  - OpenAI Developer Community
  - `openai/codex` GitHub issues / discussions

### 本轮最终判断

- `codex logout` 不是你当前这个“短问题能用、长上下文容易卡死”的首要修复项。
- 官方 `codex logout -> codex` 的指导，是“从 API key 模式切回 ChatGPT 订阅模式”时使用，不是说“只要接外部 provider 就必须先退出官方账号”。
- 你的当前配置是自定义 provider + `requires_openai_auth = true`。官方文档明确说明这代表“这个 provider 使用 OpenAI authentication”；它本身不是错误配置。
- 真正更像根因的，是外部 gateway / proxy 在长上下文、长推理、长流式输出时超时或兼容性不足，尤其是 `Responses API`、SSE 持续时间、Cloudflare / 代理超时、Windows 环境稳定性这几项。

### 支撑依据

- 官方配置文档说明：
  - `model_provider` 默认是 `openai`
  - 自定义 provider 合法
  - `model_providers.<id>.requires_openai_auth` 的含义是“该 provider 使用 OpenAI authentication”
  - `stream_idle_timeout_ms` 默认是 `300000`
- 官方 Help Center 说明：
  - 只有“之前通过 API key 使用过 Codex CLI，现在要切回 ChatGPT 订阅访问”时，才明确要求 `codex logout` 再 `codex`
  - 长会话、复杂任务、更多上下文会明显消耗更多额度和资源
- 官方社区 / GitHub 问题反馈说明：
  - 多个用户在复杂任务、长推理、长流式输出时遇到超时或 stream disconnected
  - Windows 上相关问题更多，官方也一直强调 Windows 最佳体验优先 WSL2
  - 官方讨论明确提醒：如果你接了自定义 LLM proxy / gateway，需要确保它真正支持 `Responses API`

### 对你当前 case 的结论

- 这轮最像的根因不是“没先退出官方账号再接 API”。
- 更像是：你这条外部 `https://gptcodex.top` 链路对短请求没问题，但对长会话请求处理不稳，导致上游超时后返回 `524`。
- 如果你只是想做一次最干净的排除法，可以测试一次：
  - `codex logout`
  - 再只用目标方式重新登录
  - 保持同一份外部 provider 配置复测
- 但按目前证据，这更像验证项，不是首修项。
## 第8轮（2026-04-14，是否改用 Chat Completions 结论）

### 本轮结论

- 不建议把当前 Codex 外部 provider 正式切到 `chat/completions` 作为长期方案。
- 官方在 2025-12-09 明确宣布：Codex 正在废弃 `chat/completions`，计划于 2026 年 2 月初彻底移除。
- 当前日期是 2026-04-14，因此从官方路线看，应默认把 `chat/completions` 视为不再可靠的旧兼容层，而不是推荐解法。

### 关键依据

- 官方 discussion #7782 明确写明：
  - `responses` API 是 Codex 的目标接口
  - 若自定义 provider 还在用 `wire_api = "chat"`，需要迁移到 `wire_api = "responses"`
  - 企业代理 / 网关应确保支持 `responses` API
- 官方 models 文档说明最新模型通过 `Responses API` 提供，部分新模型甚至是 `Responses API only`
- GitHub issue 反馈表明：
  - 某些 Azure / 代理只暴露 `chat/completions`，会导致 Codex 不兼容
  - 但这类 case 属于“代理兼容性补洞”，不是官方建议方向

### 对当前 case 的含义

- 如果外部 `https://gptcodex.top` 只在短请求上勉强兼容、长请求经常 `524`，把它切到 `chat/completions` 也许可能作为临时诊断手段，但不应当作为长期配置目标。
- 更合理的长期方案是：
  - 让该外部 gateway 真正稳定支持 `Responses API`
  - 或降低长请求压力，例如降低 `reasoning_effort`、缩短上下文、减少长流式请求

## 第9轮（2026-04-14，Regression Hunt + Human-eye Feature Audit）

### 本轮先做了什么

- 接管上一轮上下文后，没有继续泛泛总结，直接进入回退排查。
- 先按用户要求给出“10 个最严重问题 / 10 个最可能扣分项 / 10 个待截图状态 / 10 个待点击功能 / 最小成功标准”。
- 然后优先追查页面“缩小 / 空白 / 错列”。

### 本轮确认的两个真根因

- 根因 1：布局回退
  - 不是浏览器缩放。
  - `AppShell` 三栏布局和 `TopBar` 双栏布局在 `xl` 提前叠加，导致 `1280 / 1366` 下主区宽度被双重压缩。
  - 结果是标题区、导航、主题切换和模型工作台看起来像“整页缩小 / 错列”。
- 根因 2：轻量专家会诊回退
  - 打开弹窗后一度停在“待开始”。
  - 真根因是 `ExpertConsultPanel` 的 auto-run effect 在 React `StrictMode` 下被重放吞掉。
  - 之前在调度前就写入 `autoRunKeyRef`，第一次 effect 清理后定时器被清掉，第二次又直接跳过。

### 本轮代码修复

- 布局修复：
  - `web/src/app/app-shell.tsx`
  - `web/src/features/topbar/top-bar.tsx`
- 会诊自动触发修复：
  - `web/src/features/consult/expert-consult-panel.tsx`

### 本轮新增真实点击 / 真实事件验证

- 已重新验证：
  - 非视觉模型图片 handoff：成功，自动切到 `Qwen 3 VL Flash` 新会话，旧会话未混上下文
  - 轻量专家会诊：成功，打开后自动发起并返回结果
  - 会话搜索：成功，输入 `Plus` 后只剩匹配项
  - 会话重命名：成功
  - 会话删除：成功
  - 复制会话：成功，底部 notice 明确出现
  - 复制回答：成功，按钮即时变成“已复制”
  - `/knowledge` 精选 / 全部：成功
  - `/knowledge` 分类切换：成功
  - 主题切换：成功，深色 / 浅色 / 柔和均能切换
  - 桌面侧边栏收起：成功，但收起后主区仍偏空
  - 移动端会话列表 drawer：成功
  - 移动端右侧说明区 drawer：成功
  - 移动端帮助入口 drawer：成功
- 已通过真实 DOM 事件补测：
  - 图片粘贴上传：成功，出现 `paste-demo.png`
  - 图片拖拽上传：成功，出现 `drop-demo.png`

### 本轮实测截图

- 桌面：
  - `chat-consult-auto-run.png`
  - `chat-search-plus.png`
  - `knowledge-light-home.png`
  - `knowledge-integrated-category.png`
  - `chat-soft-sidebar-collapsed.png`
  - `chat-paste-upload.png`
  - `chat-drop-upload.png`
- 移动端：
  - `knowledge-mobile-full.png`

### 本轮新增判断

- 浏览器当前 `visualViewport.scale = 1`，即 `100%`，可排除缩放误判。
- 移动端系统分享按钮在当前环境下可见，但原生面板行为仍未完成真机确认。
- 当前仍不建议开始最终人工验收。
- 现在剩余阻塞项只剩：
  - 真实病例图仍未接入
  - `qwen-plus-latest` 文本链路仍有超时 fallback 风险
  - 系统分享仍缺真机确认
  - `knowledge` 移动端仍偏长

## 第10轮（2026-04-14，Final Pre-Demo Freeze 收口）

### 当前阶段

- 当前阶段：`Final Pre-Demo Freeze`
- 目标：把项目推进到“下一轮用户可以正式开始人工验收和录视频”的前一格，而不是继续喊“接近封板”。

### 本轮真正做了什么

- 修了一个新的真实阻塞：页面首开不再默认强制 `refresh=1` 拉全量模型健康检查。
- `useModelStore` 改成：如果刷新失败但当前已经有真实模型列表，就保留当前真实模型而不是回退到 mock。
- `AppShell` 改成首开优先 `loadModels(false)`，把“刷新状态”留给人工主动触发。
- `AppShell` 收起侧边栏后的主区比例再次加宽，右 rail 略收窄。
- `message-list.tsx` 把少消息态追问区压成更紧凑的按钮组，并降低少消息态容器高度。
- `knowledge-page.tsx` 继续压移动端长度：
  - 顶部说明更短
  - “怎么测试 / 怎么讲”改成移动端折叠
  - “使用说明”改成移动端折叠
- `knowledge-card.tsx` 在移动端继续压摘要高度和卡片内边距。
- 右 rail 三张卡继续压缩：
  - 品牌卡更短
  - 模型能力卡合并成更聚焦的“当前定位”
  - 免责声明压成更短 bullet
- `index.css` 增强了 light / soft 主题的边框、阴影和对比度。

### 本轮重新验证了什么

- 浏览器复验：
  - 聊天页深色桌面
  - 聊天页浅色桌面
  - 聊天页移动端
  - 聊天页侧边栏展开态
  - 模型选择器展开态
  - 轻量专家会诊展开态
  - `/knowledge` 桌面
  - `/knowledge` 移动端
  - 移动端会话侧栏 Sheet
  - 移动端右侧说明区 Sheet
- 构建与质量：
  - `npm run build` 通过
  - `npm run lint` 通过
- 真接口：
  - `GET /api/health` 通过
  - `GET /api/models` 通过
  - `POST /api/chat` with `qwen3-vl-flash` 通过
  - `POST /api/chat/stream` 通过
  - `POST /api/vision` 通过
  - `POST /api/chat` with `qwen-plus-latest` 本轮单测通过，但历史超时风险仍保留

### 本轮新增截图资产

- 页面级：
  - `page-chat-dark-desktop.png`
  - `page-chat-1280-dark.png`
  - `page-chat-sidebar-expanded.png`
  - `page-chat-mobile.png`
  - `page-chat-mobile-sidebar-sheet.png`
  - `page-chat-mobile-rail-sheet.png`
  - `page-knowledge-desktop.png`
  - `knowledge-mobile-postfix.png`
- 状态 / 部件级：
  - `state-empty-chat.png`
  - `state-model-selector-open.png`
  - `state-consult-open.png`
  - `crop-sidebar-brand.png`
  - `crop-sidebar-list.png`
  - `crop-top-hero.png`
  - `crop-model-workspace.png`
  - `crop-empty-state.png`
  - `crop-composer.png`
  - `crop-rail-brand.png`
  - `crop-rail-model-capability.png`
  - `crop-rail-disclaimer.png`
  - `crop-knowledge-topbar.png`
  - `crop-knowledge-hero.png`
  - `crop-knowledge-categories.png`
  - `crop-knowledge-card.png`
  - `crop-knowledge-usage.png`

### 本轮后的判断

- 当前比第9轮更接近正式人工验收准备完成，但仍不建议直接宣布“现在就能开最终验收”。
- 剩余未过项仍是这 4 个：
  - 真实病例图未正式接入
  - `qwen-plus-latest` 仍不适合作为主演示文本模型
  - 系统分享仍缺真机原生面板确认
  - `/knowledge` 移动端虽然明显变短，但还没有完全消灭尾项

### 下一轮建议

- 下一轮如果要正式开始人工验收，先只围绕这 4 个未过项做最终确认，不再扩 UI。
- 若没有真实病例图和系统分享真机验证，人工验收可以开始，但必须明确按“有边界的预验收”来做，不要直接宣布完全封板。

## 第11轮（2026-04-15，Final Demo Lock 收尾）

### 当前阶段

- 当前阶段从“Final Pre-Demo Freeze”推进到“Final Demo Lock”。
- 目标不是继续扩功能，而是把项目推进到“下一轮即可正式人工验收 + 录屏预演”的状态。

### 修正原因

- 第10轮文档仍保留了“真实病例图未正式接入”的旧口径，但当前代码、`manifest`、来源注册表和 `/knowledge` 页面已经完成首批真实图接入。
- 因此本轮只在文档层明确修正口径，不回写历史记录，把修正原因留在这里。

### 本轮完成

- 真实病例图正式接入状态已在文档层同步：
  - 已确认 3 张 CDC PHIL 真实图落地到 `web/public/clinical-images/demo/`
  - `/knowledge` 已改成“已接入真实图 / 待补正式图”的前台口径
- 模型分层口径已同步：
  - `Qwen 3 VL Flash` 继续作为主文本 + 主图片演示路径
  - `GPT-5.4 mini` 作为稳定文本备选
  - `Qwen 3.6 Plus` 作为中文文本主备之一
  - `qwen-plus-latest` 明确降为“保留备选”，不再进入主演示文本路径
- `/knowledge` 移动端继续做了最后一轮轻量压缩：
  - 分类切换按钮改成更紧凑的移动端 chips
  - 分类说明文案移动端默认隐藏，减少首屏长度
- 本轮同步重写并校正了这些文档：
  - `audit/final-qa-checklist.md`
  - `audit/endgame-market-research-notes.md`
  - `audit/clinical-image-demo-guide.md`
  - `docs/final-usage-guide.md`
  - `docs/demo-packaging-guide.md`

### 本轮确认仍未完全闭环的点

- 系统分享代码路径已通过浏览器模拟，但仍缺真实移动设备原生面板确认。
- `/knowledge` 移动端已明显收口，但仍只建议作为次级展示页面，不建议在手机竖屏上长时间停留。

### 当前判断

- 主链路已经锁定，回退问题、模型排序、真实病例图口径和主要页面观感都已收口。
- 现在可以进入下一轮正式人工验收与录屏预演准备。
- 但在正式宣布“完全封板”之前，仍建议先补一轮系统分享真机确认。

### 下一轮建议

- 优先用真实移动设备点一次系统分享，确认原生分享面板正常弹出。
- 人工验收与录屏预演优先走聊天页主链路，`/knowledge` 只看首屏、分类切换和病例图区块。

## 第12轮（2026-04-15，Final Packaging + Handoff Readiness + Documentation Freeze）

### 当前阶段

- 当前阶段从“最终演示锁定”推进到“最终交付封装与可交接整理”。
- 目标不再是补功能，而是让别人拿到仓库后能直接知道怎么启动、怎么演示、怎么验收、哪些边界还没完全闭环。

### 本轮做了什么

- 新增并重写了根目录 `README.md`，统一项目简介、功能总览、技术栈、目录结构、前后端启动方式、页面入口、图片目录、演示路径、注意事项和已知限制。
- 重写了 `docs/final-usage-guide.md`，把它改成面向接手者和使用者的说明文档，而不是开发碎片记录。
- 重写了 `docs/demo-packaging-guide.md`，明确建议演示顺序、录屏优先路径、主模型/备选模型、API 波动兜底和不建议录的功能。
- 重写了 `audit/final-qa-checklist.md`，改成可打勾的验收清单，覆盖功能、页面、响应式、录屏前检查和真机分享检查。
- 重写了 `audit/clinical-image-demo-guide.md`，写清示例图片目录、后续真图放置规则、`manifest` / `source-registry` 更新方式和图片问诊测试路径。
- 删除了 `web/README.md` 这个 Vite 默认脚手架文档，避免交付时出现与项目无关的模板说明。
- 收紧了右 rail 和顶部少量展示文案，重点减少说明墙感：
  - `web/src/features/context-rail/brand-showcase-card.tsx`
  - `web/src/features/context-rail/model-capability-card.tsx`
  - `web/src/features/context-rail/disclaimer-card.tsx`
  - `web/src/features/topbar/top-bar.tsx`
- 做了安全清理：
  - 已删除根目录大部分 `.codex-*.log`
  - 已删除 `web/dev-server.log`
  - 已删除 `web/dist/`

### 本轮验证

- `web` 下 `npm run build` 通过。
- `web` 下 `npm run lint` 通过。
- `GET /api/health` 返回正常。
- `GET /api/models` 返回正常，模型分层口径与当前文档一致。
- 浏览器快速复核了 `/chat` 和 `/knowledge`：
  - 当前页面可正常加载
  - 当前会话下无新的 console error
  - 之前看到的 `manifest.ts` 404 是旧的 Vite HMR 残留日志，不是当前页面仍在报错

### 本轮清理时保留了什么

- 保留 `.git_backup_web/`，因为它更像历史 git 备份，当前不宜贸然删除。
- 保留 `project_source/` 和 `unpacked_code/`，因为它们仍可能有交接追溯价值。
- 保留 `docs/前端要求(3).docx`、`docs/新建 DOCX 文档.docx`、`docs/新建 文本文档.txt` 这类上游需求材料，作为本地真相的一部分。

### 本轮没完全闭环的点

- `系统分享` 仍缺真实移动设备上的原生分享面板确认。
- 根目录还剩 2 个 `.codex-regression-web*.log` 未删掉，因为当时被活动进程占用；它们不是交付必需文件，后续在结束相关进程后可再清理。
- `/knowledge` 移动端虽然已压缩，但仍建议在人工验收和录屏里作为补充页面，不作为手机主讲页面。

### 当前判断

- 现在已经达到“可交接、可运行、可讲解、可开始人工验收”的状态。
- 如果下一轮进入正式人工验收，优先走聊天页主链路；若要宣布完全封板，建议再补一次真实手机上的系统分享确认。
## 第13轮（2026-04-15，Release Candidate Freeze + Runtime Stability Fix）

### 当前阶段

- 当前阶段从“Final Packaging / Handoff Readiness”修正为 `Release Candidate Freeze + Runtime Stability Fix`。
- 修正原因：上一轮把“文档齐了”误判成了“页面已经稳了”，但这轮实测确认，真正的 blocker 仍然是运行时布局稳定性，而不是说明文档。

### 本轮做了什么

- 重新按运行时链路复测了 `/chat` 和 `/knowledge`：
  - 冷启动打开
  - hard refresh
  - 新标签页重新打开
  - 路由往返
  - 主题切换后刷新
  - 侧边栏收起后刷新
  - 模型工作台展开后刷新
  - 有会话状态刷新
  - 有图片预览状态刷新
- 重新截图并做人眼复核，重点看“是不是像坏了”，而不是只看控制台。

### 本轮确认的根因

- 真正复现到的核心问题不是浏览器缩放，而是布局策略本身：
  - 少消息会话在重开 / 新标签页里仍然会把 `MessageList` 放在输入区前面，导致输入区掉出首屏。
  - 宽屏下展开模型工作台时，`TopBar` 内部标题区和工作台共用同一行高度，工作台一变高，就把这一整行抬高，形成明显“大空白 / 只显示一部分”的错觉。

### 本轮代码修复

- `web/src/app/app-shell.tsx`
  - 新增 `isCompactConversation`。
  - 把 `<= 3` 条消息的会话改成“输入区优先、消息区在后”。
  - 非空会话的 `Composer` 改为紧凑版。
- `web/src/features/chat/message-list.tsx`
  - 继续压缩少消息状态的最小高度和最大高度，减少首屏空白。
- `web/src/features/chat/composer.tsx`
  - 新增 `compact` 模式。
  - 已有会话时把输入区高度和内边距压缩，避免出现大块空白输入板。
- `web/src/features/topbar/top-bar.tsx`
  - 把展开工作台改成覆盖式浮层，不再参与首屏主布局高度。
  - 浮层背景加实，减少底层内容透出导致的“没渲染完整”错觉。

### 本轮复核结论

- `/knowledge` 在 1280 和移动端首屏未再复现“左窄右空”的明显错列。
- `/chat` 冷启动和收起侧边栏后的刷新现在都能保持输入入口回到首屏附近。
- 新标签页重新打开时，之前那种“首屏像被切断 / 中间大片空白”的问题已可稳定复现并已完成针对性修复。
- 图片预览状态下刷新没有再出现布局塌陷，但图片草稿本身不会跨刷新保留；这是当前行为，不算本轮新增 bug。

### 本轮验证

- `npm run build` 通过。
- `npm run lint` 通过。

### 当前仍未完全通过的点

- `系统分享` 仍缺真机原生分享面板确认。
- 图片草稿预览刷新后不会保留，只确认了“刷新不塌布局”，未把它做成持久草稿。
- 仍需下一轮按正式人工验收口径做最后一次全集复核，再决定是否放行。

### 下一轮建议

- 不再扩功能。
- 只围绕正式人工验收前的最后 blocker 做收口：
  - 真机系统分享确认
  - 最终人工验收截图和录屏预演
  - 若用户仍能复现新的 runtime 回退，再按同样方法继续锁根因

## 第14轮（2026-04-15，Chat 布局稳定性阻塞修复）
### 当前阶段

- 本轮只处理 `/chat` 布局稳定性 blocker，不扩功能、不补新文档、不做其他页面微调。
- 修正原因：上一轮把“可交接”判断得过于乐观，但用户复测后确认 `/chat` 仍存在刷新后退化、三栏不稳、首屏像被截断的问题。

### 本轮做了什么

- 在 `web/src/stores/use-ui-store.ts` 里把 UI store 持久化版本升级到 `version: 2`。
- 新增 `migrate`，把旧 `skincareai-ui-store` 迁移成只保留 `theme`，强制把 `sidebarCollapsed` 和 `modelWorkspaceExpanded` 重置为 `false`。
- `partialize` 不再持久化 `sidebarCollapsed` 和 `modelWorkspaceExpanded`，避免旧 `localStorage` 把桌面端直接带进坏布局。
- 在 `web/src/app/app-shell.tsx` 里新增 `isDesktopWide`，基于 `(min-width: 1280px)` 监听桌面宽屏。
- 桌面宽屏下如果检测到 `sidebarCollapsed === true`，会自动重置成 `false`。
- 聊天页外层 grid 不再根据 `sidebarCollapsed` 在两栏和三栏之间切换，桌面布局固定为：
  - `lg`：左栏 + 中栏
  - `xl` 及以上：左栏固定宽 + 中栏自适应 + 右栏固定宽
- 桌面端左侧 sidebar 始终渲染，不再因为本地状态丢失。
- `web/src/features/topbar/top-bar.tsx` 补了默认值，避免缺省参数把顶部布局带进异常分支。

### 本轮怎么验证

- `npm run build` 通过。
- `npm run lint` 通过。
- 用浏览器和 Playwright 复测了：
  - 1366 冷启动 `/chat`
  - 1440 宽 `/chat`
  - `/chat` 刷新后
  - 新窗口重新打开 `/chat`
  - `/knowledge` 冷启动
- 手动写入旧版本地状态后，再刷新验证迁移：
  - 旧值里含 `sidebarCollapsed: true` 和 `modelWorkspaceExpanded: true`
  - 刷新后自动迁移成只保留 `theme`
  - 桌面仍恢复稳定三栏
- 1366 宽下外层主 grid 实测为 `272px 726.667px 288px`，说明桌面端三栏已锁住。

### 本轮结论

- 本轮范围内最关键的 `/chat` 布局 blocker 已修掉，桌面端刷新、重开、新窗口不再默认退化成两栏坏态。
- 工作台展开仍走覆盖式路径，没有重新参与主布局列宽切换。
- 下一轮如果用户开始人工验收，应优先围绕聊天页主链路复核，不要再让旧本地状态干扰判断。

## 第15轮（2026-04-15，Chat 布局收尾修复）
### 当前阶段

- 本轮继续只修 `/chat` 布局收尾，不扩功能、不补文档、不改 API。
- 修正原因：用户最新截图确认上一轮虽然修掉了三栏退化，但仍残留首屏不完整、右上卡裁切、工作台浮层过大、底部卡片遮挡和左右栏底部安全区不足的问题。

### 本轮做了什么

- `web/src/app/app-shell.tsx`
  - 把聊天页桌面列宽微调为更紧凑的 `264 / 1fr / 300` 与 `272 / 1fr / 312`。
  - 外层最大宽度提高到 `2160px`，避免超宽屏右侧出现明显废白。
  - 左右栏高度改成 `100dvh` 口径，减少桌面端底部可视区域误差。
- `web/src/features/layout/chat-sidebar-panel.tsx`
  - 侧栏改成 `overflow-hidden + pb-3`，避免底部最后一条会话贴边。
- `web/src/features/sidebar/conversation-list.tsx`
  - 列表面板和内部滚动区增加底部缓冲，左栏滚到底时最后几条会话不再只露半截。
- `web/src/features/sidebar/brand-block.tsx`
  - 放大品牌 Logo 外框、内圈和头像本体，同时略微压缩品牌区纵向占用。
- `web/src/features/context-rail/brand-showcase-card.tsx`
  - 不再用窄横幅裁切品牌图，改成完整徽标头部展示，彻底避免“只露一条边”的坏态。
  - 修正新增文件里的中文乱码，改用 Unicode 转义锁定文本。
- `web/src/features/layout/chat-context-rail-panel.tsx`
  - 右栏增加 `overscroll-contain`、右侧滚动余量和底部缓冲。
- `web/src/features/context-rail/model-capability-card.tsx`
  - 压缩卡片内部纵向间距，避免“适合场景”被挤出可见区。
- `web/src/features/context-rail/disclaimer-card.tsx`
  - 收紧头部间距并补足底部留白，让“使用说明”完整落在右栏底部。
- `web/src/features/topbar/top-bar.tsx`
  - 收紧首屏 hero 垂直占用。
  - 工作台展开层改成右对齐、安全宽度、限定最大高度的 overlay，不再全宽硬展开。
- `web/src/features/topbar/model-selector.tsx`
  - 模型选择器展开层改成跟随容器宽度、受视口上限约束，并限制内部滚动高度。
- `web/src/features/chat/composer.tsx`
  - 压缩 composer 外边距和 textarea 高度，保证输入区更容易留在首屏。
- `web/src/features/chat/message-list.tsx`
  - 压缩空态、少消息态和长消息态的高度上限。
  - 给滚动内容增加顶部和底部安全内边距，减少“复制回答”消息卡顶部被切的现象。

### 本轮怎么验证

- `npm run build` 通过。
- `npm run lint` 通过。
- 重新截图并做人眼复核：
  - `chat-coldstart-1366-postfix.png`
  - `chat-history-final-1366-v2.png`
  - `chat-left-bottom-and-workspace-open.png`
  - `chat-page-bottom-final.png`
  - `chat-light-final-clean.png`
  - `chat-small-900-final.png`
- 重点复核了：
  - 桌面冷启动首屏
  - 有历史会话首屏
  - 左栏滚到底
  - 工作台展开
  - 页面滚到底
  - 浅色主题
  - 900 宽小屏

### 本轮结论

- 右上演示卡不再出现顶部图案只露细边的裁切坏态，改成完整徽标头。
- 左上品牌 Logo 已放大到首眼可辨识，不再像缩略图。
- 工作台展开层已经收成安全尺寸，在 1366 宽下实测不越右边界、不越下边界。
- 左栏底部会话、右栏底部“使用说明”、主区底部消息卡都较上一轮更完整，滚动责任比之前清楚。
- 当前 `/chat` 桌面布局已经达到“可以进入最终人工验收”的状态，但人工验收仍建议优先围绕聊天页主链路，重点盯真实浏览器窗口下的最终投屏观感。

## 第16轮（2026-04-15，运行说明口头交接）
### 当前阶段

- 本轮没有继续改代码，只向用户补充本地运行方法，方便立即手动查看页面是否还有明显错误。

### 本轮说明了什么

- 确认前端启动目录为 `web/`，脚本是 `npm run dev`。
- 确认后端启动目录为 `server/`，脚本是 `npm run dev`。
- 明确默认访问地址：
  - 前端：`http://127.0.0.1:5173/chat`
  - 科普页：`http://127.0.0.1:5173/knowledge`
  - 后端健康检查：`http://127.0.0.1:8787/api/health`
- 提醒如果是第一次运行，需要分别在 `web/` 和 `server/` 下执行 `npm install`。

### 当前结论

- 用户已经可以按最短步骤自行启动前后端并进入页面做人工目检。
## 第7轮（2026-04-16，标签工作区重构 + 独立滚动修复）

### 本轮用户要求

- 不再把聊天、说明、模型和会话管理强行塞进同一屏。
- 改成顶部标签页式切换，同一时间只看一个工作区。
- 每个工作区内部要能单独滚动，尤其是聊天框、模型页、总览页。
- logo 需要更大，模型切换区需要更大、更清楚，支持分类筛选。
- 尽量只改用户明确点名的问题，避免连锁改动。

### 本轮实际完成

- 恢复了 `web/src/features/chat/composer.tsx`，解除当前分支因文件缺失导致的 `build` 阻塞。
- 保留并收紧了 `ChatWorkspaceDeck` 思路，把工作区切换改成更清晰的顶部横向卡片条。
- 空会话默认停留在“总览”卡；发起消息、handoff 到视觉模型、切入已有会话时自动回到“聊天”卡。
- 给聊天页各工作区重新划分滚动责任：
  - 聊天卡内部消息区独立滚动
  - 总览卡内部独立滚动
  - 模型卡在桌面端为分栏独立滚动，小屏下退回整张模型卡内部滚动
- 放大了左上品牌 logo 和总览品牌展示，减少“logo 太小”的问题。
- 放大并重构了模型选择器：
  - 顶部分类筛选按钮更大
  - 模型候选卡更大
  - inline 模式下支持整块高度约束与内部滚动
- 给通用 `ScrollArea` 增加了更稳的 `overflow-hidden`/`min-h-0` 约束，减少“看起来有内容但组件自己滚不动”的问题。

### 本轮验证

- `cd web && npm run build` 通过。
- `cd web && npm run lint` 通过。
- 浏览器实测 `http://127.0.0.1:5173/chat`：
  - 1366 宽下聊天卡消息区存在独立滚动容器，滚动不再依赖整页。
  - 1366 宽下总览/模型/会话/聊天四个顶部标签可切换。
  - 900 宽下模型页已修正为内部滚动，不再把底部模型卡裁掉。
  - 页面无新的 console error。

### 本轮市场调研结论

- 当前这类 AI 产品的主流做法，确实更偏向“工作区切换”而不是“超长单页堆叠”：
  - OpenAI 的 Projects in ChatGPT：把文件、指令和对话组织到单独项目空间。
  - Anthropic 的 Claude Projects：强调在独立项目中管理上下文与资料。
  - Google 的 Gems：把不同任务能力做成可切换的专用入口。
  - Perplexity Spaces：也是按空间/主题聚合上下文，而不是把所有控制块堆在一个视图里。
- 因此当前前端采用顶部标签切换，是符合大厂产品组织方式的，不是临时折中。

### 当前剩余注意点

- 本轮没有继续动 `knowledge` 页主体结构，只围绕聊天主工作区收口。
- 仓库里仍然存在一批早于本轮的未提交修改，当前没有主动回滚，避免覆盖用户已有工作。

## 第17轮（2026-04-16，全量回归修复与紧凑重构实施验收）
### 当前阶段

- 本轮已经从“只做布局修补”切到“功能回归 + 紧凑壳层 + 证据化验收”。
- 执行顺序按用户要求落地为：先读 memory，再修编译，再跑功能，再做浏览器截图，再补审计文档。
- 继续遵守硬约束：没有修改任何硬编码上游配置、`Base URL`、`API key`、中转站接法。

### 本轮完成

- 修掉了当前分支最后一个显式编译阻塞：`web/src/app/app-shell.tsx` 里的未使用变量 `modelsLoaded`。
- 确认 `web` 当前状态下：
  - `npm run build` 通过
  - `npm run lint` 通过
- 重新拉起并验证了本地前端、后端：
  - 前端：`http://127.0.0.1:4173`
  - 后端：`http://127.0.0.1:8787`
- 用浏览器逐项复核了这轮重构后的主界面：
  - 左上角圆形汉堡按钮可打开覆盖式抽屉
  - 抽屉不挤压主布局
  - 顶栏 icon-only 高频操作可用
  - 工作区切换已经收成轻量标签条
  - `聊天` 标签页保留主消息区与输入区
  - `模型` 标签页可切换分类，内部可滚到最后一个模型
  - 帮助 tooltip 中文正常显示，没有 `\uXXXX`
  - `/knowledge` 首屏导览、分类切换、案例演示集可见
  - 多专家会诊 Sheet 可运行，3 位专家 + 1 位裁决者结构成立
- 本轮实际补拍的截图证据包括：
  - `chat-1366-default.png`
  - `chat-1366-drawer.png`
  - `chat-1366-models-top.png`
  - `chat-1366-models-bottom.png`
  - `chat-1366-tooltip.png`
  - `chat-1366-consult-running.png`
  - `chat-1366-consult-done.png`
  - `knowledge-1366-default.png`
  - `knowledge-1366-filter.png`
  - `chat-1440-default.png`
  - `chat-1920-default.png`
  - `chat-768x1024-default.png`
  - `chat-390x844-default.png`
- 在 `1366x768` 下，已实测：
  - `/chat` 页面无整体纵向滚动
  - `/knowledge` 页面无整体纵向滚动
  - 首屏主入口不需要靠整页下滑寻找

### 本轮新增审计资产

- 新增了 `audit/requirements-coverage-matrix-v2.md`
- 新增了 `audit/final-qa-checklist-v2.md`
- 新增了 `audit/model-acceptance-table-2026-04-16.md`
- 新增了 `audit/visual-budget-table-2026-04-16.md`
- 新增了 `audit/verification-evidence-2026-04-16.md`

### 本轮模型逐测结果

- 通过直接调用本地 `/api/chat`，对 16 个模型做了最小文本连通性验收。
- 结果：
  - 16 / 16 可在前端选中
  - 16 / 16 请求返回 HTTP 200
  - 13 / 16 真实上游返回
  - 3 / 16 走 mock fallback
- 当前 fallback 模型：
  - `Qwen 3.6 Plus`
  - `Llama 3.2 90B Vision`
  - `o3 Pro All`
- 这说明本轮前端没有把模型入口剪掉，且服务端回退策略仍在工作。

### 本轮结论

- 这轮已经把“功能不能丢”和“页面不能挤成一坨”两件事一起落到了当前代码与截图证据里。
- 桌面端主入口已经满足“标签页 + 抽屉切换，不依赖整页纵向滚动”。
- 当前版本已经具备继续做人工验收的基础，不再是只靠描述判断。

### 本轮仍未完全闭环的点

- 真机原生分享面板仍缺最后一轮设备级确认。
- 图片拖拽、图片粘贴还缺这轮新的可视化截图。
- 会话重命名、会话删除还缺这轮新的可视化截图。
- 视觉模型逐个“带图输入”尚未做满量回归；本轮逐测重点是模型连通性与前台入口保留。

## 第18轮（2026-04-16，v3 定向修复补丁与可视完整性复测）
### 当前阶段

- 本轮不再改主架构，继续保留 `顶部栏 + 工作区标签页 + 左上角覆盖式抽屉`。
- 实际执行顺序按 v3 计划落地为：先复用上一轮补丁基线，再查浏览器真实裁切点，再做定向压缩和滚动修复，最后复跑 `build/lint + Playwright`。
- 继续遵守硬约束：没有修改任何硬编码上游配置、`Base URL`、`API key`、中转站接法，也没有改 provider 注册表。

### 本轮完成

- 升级了 `InfoHint`，现在支持 `auto | tooltip | popover | sheet`，长帮助不再硬塞进小 tooltip。
- 修掉了工作抽屉的双层滚动问题：
  - `ConversationList` 新增 `scrollMode="parent"`
  - 抽屉主体成为唯一纵向滚动拥有者
  - 在 `1366x768` 下，底部“使用帮助 / 免责声明”可通过同一个滚动条到达
- 压缩了聊天输入区和追问建议块：
  - `composer` 默认高度更低
  - helper 文案改成短标签 + 详情提示
  - `继续追问` 改成更紧凑的 chips，减少消息区被挤压
- 修掉了空白回答的前端呈现风险：
  - `message-item` 对空字符串返回增加显式错误提示
  - 对高比例 `? / ？ / �` 的疑似乱码返回增加可读警告态
  - 复制回答统一复制最终展示文本
- 修掉了模型页最核心的“滑不下去”问题：
  - `ModelSelector` 改成更紧凑的固定头
  - 固定头只保留标题、分类 chips 和必要状态
  - “默认通用模型”从固定头移到滚动列表首项
  - 左列列表滚动区从 `0px` 提升到实测约 `153px`，可独立滚到最后一个模型
  - 右列说明区继续保持独立滚动到底
- 继续压缩了模型页顶部总结卡，减少左列被顶部说明吃掉的高度。
- 重做了 `knowledge` 页的首屏空间分配：
  - 顶部 hero 缩短
  - `guideItems` 默认折叠，只保留短摘要和“展开阅读提示”
  - `病例图演示集` 默认折叠成摘要模式，只展示病种覆盖和样例状态
  - 主知识卡片重新回到首屏可见范围

### 本轮验证

- `cd web && npm run build` 通过。
- `cd web && npm run lint` 通过。
- 浏览器复测地址：
  - 前端：`http://127.0.0.1:5173`
  - 后端：`http://127.0.0.1:8787`
- 关键浏览器复测结论：
  - 抽屉底部内容可达，帮助卡和免责声明卡不再悬空裁切
  - 模型页左列列表区可滚动到底，右列说明区也能到底
  - `knowledge` 页在 `1366x768` 下，首屏已经能直接看到主知识卡片的第一排顶部
  - `gpt-5.4` 前端实测发送文本后，回答正文正常显示，不再出现“空白气泡”
  - 聊天消息区可独立滚回顶部，能够重新看到回答开头
  - Playwright 控制台无新的 error

### 本轮新增截图证据

- `chat-1366-current.png`
- `drawer-bottom-1366.png`
- `knowledge-1366-after.png`
- `models-1366-after.png`
- `models-1366-final.png`
- `models-1366-bottom.png`
- `chat-gpt54-visible.png`
- `chat-gpt54-top.png`
- `help-popover.png`

### 本轮结论

- 这一轮重点把“能不能看全、能不能滚到底、`gpt-5.4` 会不会空白”这三件事落到了真实页面里，而不是只停留在代码层猜测。
- 当前最关键的桌面端痛点已经被定向修复：
  - 抽屉可达
  - 模型页可滚
  - 知识页首屏主内容回归
  - `gpt-5.4` 正文可见

### 本轮仍未完全闭环的点

- 还没有把“每一个模型都做一次 UI 层最小可用请求”的截图矩阵跑满。
- 移动端 `390x844` 和平板 `768x1024` 的本轮新截图还没补齐。
- 原生分享、会话重命名、会话删除、图片拖拽/粘贴仍缺这一轮的新证据截图。

## 第19轮（2026-04-16，后续实施计划整理）
### 当前阶段

- 本轮不直接继续改代码，先基于第17轮和第18轮的落地结果整理下一阶段实施计划。
- 计划原则保持不变：
  - 不改已认可的主结构
  - 不动任何上游硬编码配置
  - 只补未闭环项和证据链

### 本轮输出

- 明确了下一阶段实施顺序：
  - 第一步：补齐模型逐个 UI 请求验收
  - 第二步：补齐图片拖拽、图片粘贴、会话重命名、会话删除、原生分享的可视化截图证据
  - 第三步：补齐 `390x844`、`768x1024`、`1440x900` 的新一轮响应式截图
  - 第四步：复核会诊、知识页折叠态、帮助弹层在不同尺寸下的完整性
  - 第五步：更新审计文档和最终验收结论

### 当前判断

- 主结构层的问题已经不是当前最高优先级。
- 下一阶段重点已经从“修布局骨架”切换为“补功能验收矩阵”和“补截图证据链”。

## 第20轮（2026-04-16，v3.5 整体布局优化与语气功能实施）
### 当前阶段

- 本轮已经按 `SkinCareAI 定向修复与整体布局优化计划 v3.5` 进入实施，不再停留在计划阶段。
- 继续遵守硬约束：
  - 没有修改任何上游硬编码配置、`Base URL`、`API key`、中转站接法
  - 没有新增或修改后端 API
  - 没有推翻 `顶部栏 + 工作区标签页 + 左上角覆盖式抽屉` 主架构

### 本轮完成

- 把 `/chat` 工作区从 `overview | chat | models` 收敛为 `chat | models`：
  - `overview` 已退出主工作区标签
  - 新建会话、切换模型建新会话、选中会话、冷启动默认都回到 `聊天`
  - 原 overview 的低频说明迁移回抽屉与模型页
- 重做了顶栏：
  - 缩小顶栏垂直占用
  - 放大左上 Logo 视觉盒与图形本体
  - 右侧只保留 `主路由 + 主题切换 + 帮助 + 更多工具`
  - `专家会诊 / 复制会话 / 导出 Markdown / 系统分享` 已收纳进 `更多工具`
- 重写了聊天工作区条：
  - 只保留 `聊天 / 模型`
  - 去掉 `消息数` 的重复显示
  - 仅保留很短的当前模型提示
- 新增了聊天主区的极短状态条：
  - 当前模型
  - 消息数
  - handoff / notice 短提示
  - 模型定位短摘要
- 重做了 `Composer`：
  - 结构改成 `短标签 + 文本框 + 高级设置 + 操作行`
  - helper 长文案改进 `InfoHint`
  - 上传、发送、高级设置保留常显
- 落地了回复语气选择：
  - 新增 `tonePreset`
  - 新增 `showAdvancedComposerTools`
  - 语气选项为：`专业严谨 / 通俗解释 / 安抚陪伴 / 魔性整活`
  - 语气偏好持久化为全局设置
  - 请求链路已实现“显示输入”和“请求输入”分离，用户气泡仍展示原文
- 加强了语气注入策略：
  - 新增 `web/src/lib/tone-preset.ts`
  - 语气提示词改为更强制的隐藏风格指令，避免回答风格差异过弱
- 压缩了空会话态：
  - 缩小标题、图标、说明和起始按钮高度
  - 保留 3 个起始问题
  - 避免空态再次压缩聊天主区
- 继续压缩了知识页首屏：
  - 顶部 hero 更短
  - 右上规则卡更轻
  - 阅读提示与使用说明继续弱化
  - 第一排知识卡保持首屏更早可见
- 继续压缩了模型页右栏说明卡：
  - `当前模型能力` 与 `使用说明` 更紧凑
  - 右栏信息密度下降，但功能未删
- 扩充了抽屉内容：
  - 新增 `产品介绍 / 使用方式`
  - 抽屉底部现在完整承接低频说明入口

### 本轮验证

- `cd web && npm run build` 通过。
- `cd web && npm run lint` 通过。
- 本轮固定验收实例：
  - 前端：`http://127.0.0.1:4173`
  - 后端：`http://127.0.0.1:8787`
- 浏览器实测已确认：
  - 顶栏明显比旧版更薄
  - Logo 在左上角更显眼
  - 工作区条只剩 `聊天 / 模型`
  - `更多工具` 已替代顶栏分散工具群
  - 抽屉顶部和底部内容都可达
  - 模型页顶部与底部都能截图到有效内容
  - 知识页首屏主知识卡已重新回到首屏可见区
  - `Composer` 高级设置可展开
  - 语气选项 UI 可用，且不会污染用户原始输入展示
- 本轮新增截图证据：
  - `v35-chat-1366-default.png`
  - `v35-chat-1366-more-tools.png`
  - `v35-chat-1366-tone-expanded.png`
  - `v35-chat-1366-models-top.png`
  - `v35-chat-1366-models-bottom.png`
  - `v35-chat-1366-drawer-top.png`
  - `v35-chat-1366-drawer-bottom.png`
  - `v35-knowledge-1366-default.png`

### 本轮结论

- v3.5 最核心的布局目标已经落到当前代码里：
  - 首屏主焦点回到聊天区
  - 顶栏降噪
  - Logo 放大
  - overview 退出工作区
  - 低频说明回抽屉
  - 高级语气功能进入折叠区
- 当前页面比上一版更接近“单主区聚焦 + 低频说明收纳 + 密度统一”的产品形态，不再像很多模块同时抢首屏。

### 本轮仍未完全闭环的点

- Playwright 会话在后半段复测时中断，因此本轮没有把全部响应式截图矩阵补满。
- 语气功能的 UI 与链路已落地，但仍建议下一轮补一组更完整的“同题不同语气”可视化证据截图。
- `390x844`、`768x1024`、`1440x900` 的本轮新截图还没有全部补齐。

## 第11轮（2026-04-16，用户问题清单回归补验收）

### 本轮新增确认

- 已继续保持 `顶部栏 + 工作区标签页 + 左上角覆盖式抽屉` 主结构，没有推翻架构。
- 已把用户这轮点名的问题重新按“模型数量、切模保草稿、抽屉可达、知识页压缩、中文回答、连通性测试、黄字可读性、逐模型验收”逐项复核。

### 本轮代码与链路状态

- `server/src/index.mjs`
  - 强化文本与视觉系统提示词，要求始终使用简体中文。
  - 强制先回答“最可能的皮肤问题”，再给判断依据、补充信息、西医护理、中医辨证/中药方向和风险提示。
  - `buildChatMessages()` 已修复为优先用 `body.input.text` 覆盖最后一条 user 文本，前端隐藏临床提示现在能真正进服务端。
- `server/src/registry/curated-models.mjs`
  - 当前模型总数已扩到 26。
  - 本轮新增的 10 个模型已保留：`deepseek-v3-1`、`deepseek-r1-0528`、`qwen3-235b-a22b-instruct-2507`、`qwen3-235b-a22b-thinking-2507`、`kimi-k2-instruct`、`kimi-k2-thinking`、`qwen3-vl-32b-instruct`、`qwen3-vl-8b-instruct`、`qwen3-vl-30b-a3b-thinking`、`qwen3-vl-235b-a22b-instruct`。
  - `gpt-5.4-mini`、`gpt-5.4-nano` 已切到 `openai-responses`，解决之前正文空白问题。
- `web/src/features/chat/composer.tsx`
  - 草稿同步已改成即时回传，不再只靠延后 effect。
- `web/src/app/app-shell.tsx`
  - 切模型时文字草稿与图片草稿一起转移到新会话。
  - 模型页文案已明确为“每 5 秒自动检测一次，也可手动重测”。

### 本轮实际复测

- 浏览器复测确认：
  - 抽屉底部内容完整可达，`使用帮助`、`免责声明`、`产品介绍 / 使用方式` 都能滚到底。
  - 知识页当前显示 `全部内容 · 21`，没有再掉到 7 条。
  - 知识页导览区已压缩，`1366x768` 首屏能直接看到主知识卡片首排顶部。
  - 手动“连通性测试”按钮可用，实测时间从 `19:31:04` 更新到 `19:31:52`。
  - 浅色主题和柔和主题下的黄色 `notice-pill` 已重新截图确认，可读性正常。
  - 重新做了“输入文字 + 上传图片 + 切换到 GPT-5.4 mini”的回归，新会话里图片和文字草稿都保留。
- 本轮新增截图证据：
  - `light-theme-notice-1366.png`
  - `soft-theme-notice-1366.png`
  - `models-refresh-soft-1366.png`
  - `knowledge-soft-1366.png`
  - `drawer-top-soft-1366.png`
  - `drawer-bottom-soft-1366.png`

### 本轮模型逐测结果

- 已对当前 26 个模型全部跑完一轮本地 `/api/chat` 最小文本请求。
- 结果：
  - 26 / 26 可在前端选中
  - 26 / 26 请求返回 200
  - 26 / 26 返回非空正文
  - 17 / 26 来自真实上游
  - 9 / 26 触发 mock fallback
- 当前 fallback 模型：
  - `GPT-5.4`
  - `Qwen 3.6 Plus`
  - `DeepSeek R1`
  - `DeepSeek R1 0528`
  - `Qwen 3 235B Thinking`
  - `Qwen 3 VL 32B Thinking`
  - `Qwen 3 VL 235B Thinking`
  - `Llama 3.2 90B Vision`
  - `o3 Pro All`
- 结论：
  - 当前主要剩余风险在上游可用性波动，不在前端入口、滚动、切模保草稿或本地回退机制。

### 本轮文档更新

- 已更新 `audit/model-acceptance-table-2026-04-16.md` 为 26 模型真实结果。
- 已更新 `audit/verification-evidence-2026-04-16.md`，补进本轮截图、手动重测结论和主题可读性结论。

### 当前仍未完全闭环

- 11 个视觉模型还没有逐个喂图做满量图片回归，本轮做的是上传、handoff、切模保草稿和页面可达性复测。
- 响应式截图矩阵还没有全部按最新状态重新补齐。

## 第21轮（2026-04-16，剩余验收闭环补齐）

### 本轮执行范围

- 按用户要求，本轮没有继续改业务代码，只补剩余验收闭环、截图记录和 memory。
- 本轮继续以当前固定实例为准：
  - 前端：`http://127.0.0.1:4173`
  - 后端：`http://127.0.0.1:8787`

### 本轮新增闭环

- 已将 11 个 `supportsVision = true` 的视觉模型全部用同一张本地样图逐个请求 `POST /api/vision`。
- 样图固定为 `web/public/clinical-images/demo/eczema-dermatitis/cdc-phil-4506-eczema.jpg`。
- 结果见 `audit/vision-model-acceptance-table-2026-04-16.md`：
  - 11 / 11 请求成功
  - 11 / 11 返回非空正文
  - 4 / 11 为真实上游返回
  - 7 / 11 触发 mock fallback
- 结论：视觉模型“逐个喂图”这一项已经闭环，剩余风险收口为部分模型上游当前不可用，不是前端图片链路未验证。

### 本轮补齐的截图记录

- 已补记最新响应式截图矩阵：
  - `latest-chat-1440x900.png`
  - `latest-models-1440x900.png`
  - `latest-knowledge-1440x900.png`
  - `latest-chat-1920x1080.png`
  - `latest-knowledge-1920x1080.png`
  - `latest-chat-768x1024.png`
  - `latest-knowledge-768x1024.png`
  - `latest-chat-390x844.png`
  - `latest-drawer-390x844.png`
  - `latest-knowledge-390x844.png`
- 已同步补进 `audit/verification-evidence-2026-04-16.md`，把“视觉模型未逐个喂图”“响应式截图未补齐”两个旧未闭环项改为已闭环结论。

### 本轮额外复核

- 浏览器 console `error` 级别消息复查为 `0`。
- 当前剩余主要风险仍然是部分模型上游可用性波动，而不是前端入口、抽屉可达性、知识页条目数量、切模保草稿或图片显示链路。

## 第22轮（2026-04-17，运行实例识别闭环与浏览器真相核对）

### 本轮目标

- 不再盲目继续改 UI，先把“用户打开的是不是当前源码实例”查死。
- 继续遵守用户约束：
  - 没说的地方不要改
  - 只补实例识别、定向回归、验收证据和最后未闭环项

### 本轮完成

- 已确认并保留前端固定启动方式：
  - `vite --host 127.0.0.1 --port 5173 --strictPort`
- 已确认并保留后端固定监听：
  - `http://127.0.0.1:8787`
- 补做了最关键的“错实例排除”：
  - 浏览器 console 能看到 `[SkinCareAI runtime]`
  - `#root` 和 `html` 都带 `data-build-id="skin-runtime-2026-04-17-r1"`
  - `window.__SKINCAREAI_RUNTIME__` 中能读到：
    - `modelCount = 26`
    - `knowledgeCount = 21`
    - `routeMarker = chat-models-26 / knowledge-all-21`
- 复测了“5173 被占时不允许静默换端口”：
  - 在当前前端已启动的情况下再次执行 `npm run dev`
  - 直接返回 `Port 5173 is already in use`
  - 说明 README 当前启动约束和实际行为一致

### 本轮浏览器真相核对

- `http://127.0.0.1:5173/chat`
  - 顶部主导航直接可见 `聊天工作区 / 知识页`
  - dev 指纹浮层可见 `模型 26` 与 `skin-runtime-2026-04-17-r1`
- `http://127.0.0.1:5173/knowledge`
  - 首屏明确显示 `全部内容 · 21`
  - 当前知识条目没有回退到 7 条
- 模型工作台
  - 当前显示 `26 个模型`
  - 自动检测 6 秒内从 `最近检测 04:59:38` 更新到 `最近检测 05:00:06`
  - 手动点击后继续更新到 `最近检测 05:01:16`
  - 手动按钮文案这轮已收口为：
    - `连通性测试`
    - `连通性测试中`

### 本轮补充交互复测

- 新建会话后输入文字并上传 `cdc-phil-4506-eczema.jpg`
- 当前聊天输入文案：
  - `请根据这张皮肤图片判断最可能是什么病，并给出中医辨证和中药方向。`
- 切换到 `Qwen 3 VL Flash` 后实测：
  - 图片预览仍在
  - 文本草稿仍在
  - 新会话已切到视觉模型，没有丢失当前输入
- 上传图片后，聊天区仍保持为页面主交互区，没有被图片预览压到失去可读性

### 本轮提示词链路复测

- 在新会话中实际发送图文请求后，返回正文为简体中文。
- 回答结构中已明确出现：
  - `最可能的疾病或问题`
  - `判断依据`
  - `还需要确认的信息`
  - `西医护理建议`
- 结论：
  - 当前应以“新建会话 + 新请求”判断是否生效
  - 不能再用旧会话里的旧英文回复判断当前代码是否没更新

### 本轮工程校验

- `cd web && npm run build` 通过
- `cd web && npm run lint` 通过

### 本轮新增截图证据

- `runtime-chat-1366.png`
- `chat-uploaded-draft-1366.png`
- `chat-switch-model-preserve-draft-1366.png`
- `chat-vision-response-1366.png`
- `light-theme-notice-current.png`

### 本轮结论

- 当前最大根因已经收口为“用户之前大概率打开了旧实例、错实例或拿旧会话内容判断新代码”。
- 现在这份仓库跑起来的 `5173` 实例，已经能肉眼确认以下关键信号：
  - 顶部是新导航
  - `/knowledge` 是 21 条
  - 模型页是 26 个模型
  - 切模保当前文字和图片草稿
  - 新会话图文回答按中文医疗结构收口
- 本轮没有扩散改其他未点名功能，只补了：
  - 实例识别闭环
  - 手动重测按钮文案更直白
  - 审计证据和 memory 追加

## 第 12 轮（2026-04-17，聊天区扩容 + 全屏 + 单条问答导出 + 模型区继续放大）

### 本轮用户硬约束

- 默认继续用简体中文回复。
- 只改用户点名的区域，不扩散到其他未提功能。
- 本轮重点只围绕：
  - 聊天记录展示区变大
  - 输入区压缩
  - 聊天记录区右上角增加全屏按钮
  - 全屏后只保留聊天记录区和输入区
  - 每条 AI 回复右侧增加图标化导出按钮
  - 模型可选区继续放大、压缩上方说明
  - 通用模型分类加入 Claude / Gemini / Grok
  - 回复中加入更谨慎的中医配伍比例方向
  - 验证当前模型可用性

### 本轮实际代码改动

- 聊天区
  - `web/src/features/chat/composer.tsx`
    - 压缩了 composer padding、badge 间距、textarea 高度、动作按钮高度。
  - `web/src/features/chat/upload-preview.tsx`
    - 压缩了图片预览条尺寸，减少上传图片后对消息区的挤压。
  - `web/src/features/chat/message-list.tsx`
    - 在聊天记录面板右上角加入了全屏切换按钮。
    - 给消息列表加了更轻量的顶部信息条。
    - 接入了“当前 assistant 回复对应上一条 user 提问”的配对逻辑。
  - `web/src/features/chat/message-item.tsx`
    - 在每条 assistant 回复气泡右侧加入 icon-only 的 Markdown 导出按钮。
  - `web/src/lib/share-utils.ts`
    - 新增“单条问答对 Markdown 导出”内容构造与文件名生成函数。
  - `web/src/app/app-shell.tsx`
    - 新增 `isChatFullscreen` 局部状态。
    - 全屏模式下只保留 `MessageList + Composer`。
    - 隐藏 `TopBar / ChatWorkspaceDeck / ChatStatusStrip / DevRuntimeBadge`。
    - 新接入单条问答导出回调。

- 模型工作台
  - `web/src/features/topbar/model-selector.tsx`
    - 压缩了“先选分类，再选模型”文案和默认通用模型 banner。
    - 压缩了模型卡的上下 padding，提高首屏可见模型数量。
  - `web/src/app/app-shell.tsx`
    - 将桌面端模型页双列比例从更平均的布局，继续调整为“左列更宽、右列更窄”的比例。
    - 压缩了“模型工作台”摘要卡文案和垂直高度。

- 模型目录
  - `server/src/registry/curated-models.mjs`
    - 新增 `gemini-2.5-pro-all`
    - 新增 `grok-3`
  - `web/src/lib/model-config.ts`
    - 将 `claude-sonnet-4-6`
    - `gemini-2.5-pro-all`
    - `grok-3`
    - 收入通用模型优先集合，保证它们出现在通用模型分类。

- 提示词与回复结构
  - `server/src/index.mjs`
  - `web/src/lib/clinical-consult-prompt.ts`
  - `web/src/lib/mock-adapter.ts`
    - 文本 / 视觉提示词都补进了“中医配伍比例方向”的严格约束：
      - 只允许给方向性比例或配伍结构
      - 不给克数、剂量、煎服法
      - 信息不足时必须明确拒绝给比例

### 本轮工程验证

- `cd web && npm run build` 通过
- `cd web && npm run lint` 通过

### 本轮运行实例核对

- 继续确认前端固定运行在：
  - `http://127.0.0.1:5173`
- 后端固定运行在：
  - `http://127.0.0.1:8787`
- 本轮为了让新模型目录生效，主动重启了旧的 `8787` node 进程，再拉起当前仓库的后端实例。

### 本轮浏览器复测结果

- `http://127.0.0.1:5173/chat`
  - 聊天记录区右上角可见 `进入全屏聊天`
  - 点击后只剩：
    - 聊天记录区
    - 输入区
  - 顶栏、工作区标签、状态条都会退出视图
  - 可见 `退出全屏聊天`

- 单条 AI 回复导出
  - assistant 回复气泡右侧可见 `导出当前问答 Markdown` 图标按钮
  - Playwright 实测点击后已成功下载：
    - `请根据这张皮肤图片判断最可能是什么病，并给出中医-2026-04-16-20-58-40.md`

- 模型页
  - 当前页面已显示 `28 个模型`
  - 通用模型分类已显示 `6 个候选`
  - 浏览器实测可见：
    - `Claude Sonnet 4.6`
    - `Gemini 2.5 Pro All`
    - `Grok 3`

### 本轮模型可用性核对结论

- `/api/models?refresh=1` 当前返回总数：
  - `28`

- 当前在线或可测通过的关键新增 / 关键模型
  - `claude-sonnet-4-6`：在线
  - `grok-3`：在线
  - `gpt-5.4-mini`：在线
  - `gpt-5.4`：在线
  - 多数 Qwen 视觉模型：在线

- 当前确认离线或不可用的模型
  - `gemini-2.5-pro-all`：当前 upstream 不可用，显示离线
  - `qwen3.6-plus`：离线
  - `llama-3.2-90b-vision-instruct`：离线
  - `o3-pro-all`：离线

### 本轮进一步查清的根因

- `Gemini 2.5 Pro All` 当前离线的根因不是前端没加进去，而是当前上游真实模型列表与健康检查下，它并没有在本地这套网关配置里变成可用态。
- 视觉模型第一次 smoke test 大量 fallback 的根因，不是前端 UI：
  - 我最初用的是 `1x1` PNG 极小图做压测
  - `qwen3-vl-flash` 原始报错明确为：
    - `The image length and width do not meet the model restrictions. [height:1 or width:1 must be larger than 10]`
  - 换成项目里的真实演示图 `cdc-phil-4506-eczema.jpg` 后，大多数 Qwen 视觉模型都能直接出真实中文结果，不再 fallback。

- `gpt-4o-all` 之前在一次最小压测里出现英文，不是仓库提示词完全失效：
  - 复测时改成明确的 Unicode 中文提示后，`gpt-4o-all` 已能返回中文结构化结果，并会对“中医配伍比例方向”做谨慎拒绝或约束说明。

### 本轮仍然存在的真实限制

- `Gemini 2.5 Pro All` 已经加入模型目录和通用分类，但在当前上游配置下仍然离线。
- `qwen3-vl-32b-thinking` 对真实图片 smoke test 仍有 fallback 情况，需后续单独排查该具体模型的上游兼容性。

### 本轮结论

- 本轮已经把用户这次点名的核心闭环真正做完一轮：
  - 聊天记录区更大
  - 输入区更小
  - 聊天区右上角全屏
  - 全屏后只留两个部件
  - 单条 AI 回复右侧 Markdown 导出
  - 模型区继续放大
  - Claude / Gemini / Grok 进入通用模型分类
  - 后端与前端提示词补入更谨慎的中医配伍比例方向
  - 浏览器和接口层都做了真实验证

- 同时也明确留下了两条不能假装已经好的事实：
  - `Gemini 2.5 Pro All` 当前上游离线
  - 个别视觉模型仍会 fallback，需要后续按具体 model id 单独追

## 第23轮（2026-04-17，模型可用性清洗 + 模型区轻量放大）

### 本轮用户硬约束

- 默认继续使用简体中文回复。
- 只改用户点名范围，不扩散到其他布局和功能。
- 这轮重点是：
  - 查清“模型为什么有的不能用”。
  - 保证模型选择器里保留的模型都能真实访问、真实可用。
  - 如果某个模型在当前国内中转站下不通，就换成同级但可用的新模型。
  - 模型选择区只做轻量放大和提亮，不改主结构。
  - 顺带核对聊天、会话、图片上传、专家会诊是否还能正常走通。

### 本轮查清的根因

- 本机最开始只有前端 `5173` 在监听，`8787` 后端未运行；前端拿不到真实 `/api/models` 结果时，会回退到旧的前端状态或 mock 列表感知。
- `server/.env.local` 中存在真实 `IKUN_API_KEY`，因此不是“仓库根本没配置”，而是本轮最先遇到的是“后端实例没起来”。
- 当前模型页里的“离线”不全是真的模型不可用，还有一类是：
  - `/api/models?refresh=1` 会并发对整套模型做健康检查
  - 某些上游模型在高并发检查里会被打成假离线
  - 但单独真实请求时仍能返回正常中文结果
- 在当前 relay 下，确实不可用或不应继续保留的模型有：
  - `qwen3.6-plus`
  - `gemini-2.5-pro-all`
  - `llama-3.2-90b-vision-instruct`
  - `o3-pro-all`

### 本轮实际代码改动

- 模型目录替换：
  - `server/src/registry/curated-models.mjs`
  - 替换为当前 relay 下已实测可用的新模型：
    - `deepseek-v3.2`
    - `gpt-5-all`
    - `qwen3-vl-30b-a3b-instruct`
    - `grok-4-fast-reasoning`
- 前端模型分类与默认集合同步：
  - `web/src/lib/model-config.ts`
  - 把通用模型、图片模型、推理模型、低成本快速和主演示集合切到新的可用模型。
- 模型健康状态收口修复：
  - `server/src/services/model-catalog.mjs`
  - 对“上游模型存在但单次健康检查失败”的情况，不再直接标成 `offline`，改为收口成 `degraded`，避免把实际可用模型误报为离线。
- 模型区轻量优化：
  - `web/src/features/topbar/model-selector.tsx`
  - `web/src/app/app-shell.tsx`
  - 左列模型选择区继续放大，边界更亮一点，顶部说明继续压缩，并新增一个简短问号说明。

### 本轮真实验证结论

- 运行链路
  - 当前前端固定运行于 `http://127.0.0.1:5173`
  - 当前后端固定运行于 `http://127.0.0.1:8787`
  - 本轮已主动重启当前仓库的后端实例，使新模型目录生效
- 模型目录
  - `/api/models?refresh=1` 当前总数保持 `28`
  - 本轮替换进入的新模型：
    - `DeepSeek V3.2`
    - `GPT-5 All`
    - `Qwen 3 VL 30B Instruct`
    - `Grok 4 Fast Reasoning`
  - 本轮复测后，模型列表里不再有“真正离线 / 无渠道”的残留项
- 真实 smoke test
  - `deepseek-v3.2`：`/api/chat` 非 fallback，中文正常
  - `grok-4-fast-reasoning`：`/api/chat` 非 fallback，中文正常
  - `gpt-5-all`：`/api/vision` 非 fallback，图文可用
  - `qwen3-vl-30b-a3b-instruct`：`/api/vision` 非 fallback，图文可用
  - `gpt-4o-all`：单独文本与视觉复测都非 fallback，之前出现的“离线”属于健康检查误判，不是模型真的坏
- 浏览器回归
  - `/chat` 可正常加载，console 新增错误为 `0`
  - 模型页可见 `28` 个模型，新替换模型已出现在通用模型区
  - `更多工具 -> 专家会诊` 可以正常打开
  - 聊天区图片上传仍正常，上传后聊天区没有被异常压扁
  - 上传图片并发送后，消息区与输入区都能继续正常显示

### 本轮工程校验

- `cd web && npm run build` 通过
- `cd web && npm run lint` 通过

### 本轮结论

- 这轮的核心不是“再大改 UI”，而是把模型列表从“混有假可用和真不可用”清成“当前 relay 下真实能打的集合”。
- 目前保留在模型选择器里的新增替换模型都已经做了真实请求验证，不是只改了前端展示名。
- 模型区只做了轻量放大与提亮，没有改动用户没点名的主结构。
## 第14轮（2026-04-17，README 端口报错根因确认 + 模型选择区全屏闭环）

### 本轮用户硬约束

- 默认继续使用简体中文回复。
- 这轮不要乱动其他地方。
- 先解释 `README` 启动时为什么会报 `EADDRINUSE: address already in use 127.0.0.1:8787`。
- 只额外新增一个功能：
  - 给“分类与模型 / 模型工作台”区域增加和聊天区类似的全屏能力。
  - 目标是进入后能更完整对比更多模型，退出后仍回到原布局。

### 本轮查清的根因

- `README` 不是没更新，后端启动章节已经写了 `8787` 端口冲突时不要重复开第二个实例。
- 当前报错根因不是代码坏了，而是本机已经有后端实例在监听：
  - `127.0.0.1:8787 -> PID 4488`
  - 进程命令：`node src/index.mjs`
- 当前前端也已有唯一实例在监听：
  - `127.0.0.1:5173 -> PID 6336`
  - 启动命令：`vite --host 127.0.0.1 --port 5173 --strictPort`
- 因此用户在 `server` 目录里再次执行 `npm run dev`，才会触发第二个后端实例抢占 `8787` 失败。
- 用户在 `server` 目录下再次执行 `cd server` 导致 `server/server` 不存在，这也是路径重复进入，不是仓库损坏。
- 额外核对：
  - `http://127.0.0.1:8787/api/health` 当前返回 `status: ok`

### 本轮实际代码改动

- 只修改：
  - `web/src/app/app-shell.tsx`
- 改动内容严格收敛为模型区全屏：
  - 新增 `isModelFullscreen`
  - 新增 `toggleModelFullscreen`
  - 模型全屏与聊天全屏互斥
  - `Escape` 可退出模型全屏
  - 进入模型全屏时自动：
    - 切到 `models`
    - 关闭抽屉
    - 关闭会诊
  - 在模型摘要卡右上角增加图标按钮：
    - 进入：`进入全屏模型选择`
    - 退出：`退出全屏模型选择`
  - 新增 `fullscreenModelsPanel`
    - 放大左侧模型选择列表
    - 保留右侧说明栏
    - 隐藏顶栏与 runtime badge，形成更专注的模型对比视图

### 本轮验证结果

- 工程校验
  - `cd web && npm run build` 通过
  - `cd web && npm run lint` 通过
- 浏览器校验
  - 打开：`http://127.0.0.1:5173/chat`
  - 切到“模型”标签后，已看到新增按钮：`进入全屏模型选择`
  - 点击后进入模型全屏视图，顶部与其他干扰区被收起
  - 点击 `退出全屏模型选择` 后可正常回到原模型页
  - 本次浏览器当前会话无新增 console error

### 本轮结论

- 这轮已经按用户要求闭环：
  - 解释清楚 `8787` 报错不是 README 失效，而是重复启动
  - 只给模型选择区补了全屏功能，没有扩散改其他地方

## 第 15 轮（2026-04-17，外部视觉模型补入 + 模型页密度收尾）

### 本轮用户硬约束

- 默认继续使用简体中文回复。
- 只允许改用户点名范围，不扩散到其他聊天、知识页或抽屉功能。
- 本轮只围绕三件事：
  - 给图片/视觉模型补一些国外模型
  - 模型选择页更紧凑，一屏看到更多模型
  - 模型选择全屏再做大一点

### 本轮实际代码改动

- `server/src/registry/curated-models.mjs`
  - 保留并确认新增 3 个外部视觉模型入口：
    - `gemini-2.5-flash-all`
    - `gemini-2.5-pro-all`
    - `claude-sonnet-4-6-vision`
- `server/src/services/model-catalog.mjs`
  - 保留此前对原生 adapter 模型目录判定的修正，避免 `gemini-native / anthropic-messages` 因 upstream 列表缺口被直接误杀。
- `web/src/lib/model-config.ts`
  - 保留新视觉模型在 `DEFAULT_VISION_MODEL_IDS` 里的接入。
  - 保留 `Gemini / Anthropic` 厂商标签与“需代理 / 海外链路更稳”的提示文案。
- `web/src/features/topbar/model-selector.tsx`
  - 修复了上轮遗留的 JSX 闭合错误。
  - 继续压缩 inline 模式的头部高度、分类按钮高度、卡片 padding、说明行数和评分胶囊尺寸。
  - 让模型卡在同一屏内能看到更多条目。
- `web/src/app/app-shell.tsx`
  - 继续压缩模型摘要卡顶部文案和 badge 高度。
  - 把普通模型页左列再放大一点。
  - 把模型全屏视图的总宽度从 `1820px` 提到 `1960px`。
  - 把模型全屏左右列比例继续调成“左列更宽、右栏更窄”。

### 本轮运行实例与根因确认

- 本轮一开始 `5173` 前端已经是新实例，但 `8787` 后端仍在跑旧的 node 进程。
- 直接查 `http://127.0.0.1:8787/api/models?refresh=1` 时，新加的 3 个视觉模型最初没有出现在当前运行实例里。
- 已确认根因不是源码没改，而是：
  - 当前监听 `8787` 的旧进程没有重启
  - 所以浏览器拿到的还是旧模型目录
- 本轮已只重启当前仓库的后端实例，让新模型目录进入真实运行链路。

### 本轮真实验证结果

- 工程校验
  - `cd web && npm run build` 通过
  - `cd web && npm run lint` 通过
- 本地运行实例
  - `127.0.0.1:5173` 正常监听
  - `127.0.0.1:8787` 已重启到当前仓库实例
- 模型目录实测
  - 当前页面 runtime badge 已显示 `模型 31`
  - `/api/models?refresh=1` 已确认新增模型进入目录：
    - `claude-sonnet-4-6-vision`：`online`
    - `gemini-2.5-flash-all`：已在目录中，当前 relay 下显示 `offline`
    - `gemini-2.5-pro-all`：已在目录中，当前 relay 下显示 `offline`
  - 这和用户要求一致：
    - `Claude Vision` 真正接入并可用
    - `Gemini` 保留在列表中，并通过网络提示明确标注需代理 / 海外链路更稳
- 浏览器验收
  - `http://127.0.0.1:5173/chat` 可正常加载
  - 模型页现在显示 `31` 个模型
  - 图片模型分类现在显示 `14` 个候选
  - 页面文本中已可直接检索到：
    - `Claude Sonnet 4.6 Vision`
    - `Gemini 2.5 Flash All`
    - `Gemini 2.5 Pro All`
  - 模型全屏按钮可正常进入 / 退出
  - 全屏后顶栏收起，只保留模型主区与右侧说明，模型列表区域明显更大
  - 浏览器最新状态无新增 console error

### 本轮截图证据

- `model-page-updated-1366.png`
  - 已保存当前模型页全屏状态截图，用于人工肉眼复核模型区面积和列表密度。

### 本轮结论

- 本轮已经把用户这次点名的模型相关问题闭环到可运行状态：
  - 外部视觉模型已补入
  - 模型页 inline 列表更紧凑
  - 模型全屏更大
  - 运行实例已和源码重新对齐
- 当前仍需诚实保留的事实：
  - `Gemini` 两个视觉模型已经保留并展示，但在当前 relay/网络条件下依然显示 `offline`
  - `Claude Sonnet 4.6 Vision` 当前是这轮新增视觉模型里已经实测在线的外部模型

## 第 16 轮（2026-04-17，会话管理补全 + README 重写 + 演示讲稿收尾）

### 本轮用户硬约束

- 默认继续使用简体中文回复。
- 只补用户点名的缺口，不乱改其他区域。
- 重点补齐：
  - 按 `docs/前端要求(3).docx` 检查并补前端要求
  - 修复“生成中无法在侧边栏重命名”
  - 补会话标签与归档
  - 模型页全屏里增加 `去咨询`
  - 去掉两个不能用的 `Gemini`，换成两个当前链路可用的国外模型
  - 重写根目录 `README.md`
  - 生成录屏用 Word 讲稿
  - 清理本轮过程文件

### 本轮实际代码改动

- 会话数据结构与状态管理：
  - `web/src/types/chat.ts`
  - `web/src/stores/use-chat-store.ts`
  - 新增：
    - `tags`
    - `archived`
    - `archivedAt`
  - 新增 store 方法：
    - `updateConversationTags`
    - `archiveConversation`
    - `restoreConversation`
  - 持久化迁移与默认值同步补齐
- 抽屉会话树：
  - `web/src/features/sidebar/conversation-list.tsx`
  - `web/src/features/sidebar/conversation-list-item.tsx`
  - `web/src/features/layout/chat-sidebar-panel.tsx`
  - 新增：
    - `进行中 / 已归档` 视图切换
    - 标签搜索
    - 标签编辑入口
    - 归档 / 恢复入口
  - 修复：
    - 会话生成中重命名按钮不再被全局 `busy` 锁死
- 主壳层：
  - `web/src/app/app-shell.tsx`
  - 新增：
    - 归档/恢复/标签更新 handler
    - 模型全屏右上角 `去咨询`
  - 点击 `去咨询` 后会：
    - 关闭模型全屏
    - 切到 `chat`
    - 自动进入聊天全屏
- 模型清单：
  - `server/src/registry/curated-models.mjs`
  - `web/src/lib/model-config.ts`
  - 移除：
    - `gemini-2.5-flash-all`
    - `gemini-2.5-pro-all`
  - 新增：
    - `gpt-4.1`
    - `grok-4.1`

### 本轮文档与交付物

- 重写了根目录：
  - `README.md`
  - 新版 README 重点改成：
    - 快速开始优先
    - 前端要求对照表
    - 功能总览
    - 使用说明
    - 运行实例核对
    - 提交说明
- 新增根目录演示讲稿：
  - `SkinCareAI_demo_script.docx`
  - 内容按“我说的话 / 动作”编排
  - 不同事件块已用不同底色区分

### 本轮真实验证

- 工程校验
  - `cd web && npm run build` 通过
  - `cd web && npm run lint` 通过
- 浏览器验证
  - 预览页 `http://127.0.0.1:4173/chat` 可正常打开
  - console error = `0`
  - 抽屉内已看到：
    - `进行中`
    - `已归档`
    - 标签编辑入口
    - 归档入口
  - 点击标签按钮后，标签输入框可正常出现
  - 模型全屏右上角已出现 `去咨询`
  - 点击 `去咨询` 后，页面会自动切回聊天全屏
  - 生成中状态下，侧边栏 `重命名会话` 按钮未被禁用
- 源码级模型核对
  - 当前 `curatedModels.length = 31`
  - 当前 `supportsVision = true` 的模型数 = `12`
  - `gemini-2.5-flash-all` / `gemini-2.5-pro-all` 已不在当前源码 registry
  - `gpt-4.1` / `grok-4.1` 已进入当前源码 registry

### 本轮过程文件清理

- 已删除：
  - `docs/_frontend_requirements_extracted.txt`
  - `audit/vision-model-check-raw.json`
  - 多个 `.codex-*` 过程日志
- 临时预览目录 `.tmp-qa` 已清理完成。

### 本轮结论

- 这轮已经把“前端要求文档里缺的会话管理能力”和“模型页一键回聊天”的闭环补上。
- README 已切成更适合交接和答辩展示的结构。
- 演示讲稿已经落到根目录，可直接打开照着录屏。
