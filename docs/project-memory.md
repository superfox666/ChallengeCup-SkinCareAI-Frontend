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
