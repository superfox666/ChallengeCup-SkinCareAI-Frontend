# SkinCareAI 前端项目审计报告

> 审计日期: 2026-04-11
> 审计人: 前端技术负责人
> 项目性质: **桌面端 PyQt5 原型 → 网页端前端** 全新构建

---

## 一、项目当前状态总结

### 核心结论
**当前不存在任何可运行的网页端前端代码。** 现有代码是一个 Python PyQt5 桌面应用原型，只能作为业务逻辑参考和素材来源。这是一个"从零搭建 Web 前端"的任务，不是"修补现有界面"。

### 现有资产
| 资产 | 位置 | 性质 |
|------|------|------|
| 需求文档 | `docs/前端要求(3).docx` | 明确需求，含参考 UI 截图 |
| PyQt5 原型代码 | `unpacked_code/SkinCareAI/SkinCareAI/` | 桌面端，不可直接用于 Web |
| AI 助手头像(无背景) | `assets/docx_image_1.png` | 鹅形 Logo，97KB，可直接用 |
| AI 助手头像(有背景) | `assets/docx_image_2.png` | 同上带底色，763KB |
| 参考 UI 截图 | `assets/docx_image_3.png` | GeoseAI 风格参考，深色主题 |
| 知识库文本 | `unpacked_code/.../data/中医皮肤科/` 等 | 科普内容素材，可直接复用 |
| RAG/LLM 配置 | `unpacked_code/.../config/config.py` | 后端接口参数参考 |

---

## 二、目录结构树

```
f:/ChallengeCup-SkinCareAI-Frontend/
├── .claude/                          # Claude Code 配置
├── assets/                           # 已提取的图片素材
│   ├── docx_image_1.png             # AI助手头像 (无背景, 97KB) → 用作 AI 头像
│   ├── docx_image_2.png             # AI助手头像 (有背景, 763KB) → 用作品牌区
│   └── docx_image_3.png             # GeoseAI 参考界面截图 → 设计参考
├── audit/                            # 审计报告 (本文件)
├── docs/                             # 需求文档
│   └── 前端要求(3).docx
├── project_source/                   # 原始压缩包备份
│   └── SkinCareAI石山代码(2).zip
├── unpacked_code/                    # 解压后的参考代码
│   └── SkinCareAI/SkinCareAI/
│       ├── config/config.py          # ★ Ollama 配置: 模型名、base_url、参数
│       ├── scripts/
│       │   ├── skin_care_ai.py       # ★ RAG 问答核心逻辑: prompt 模板、链式调用
│       │   ├── vector_store.py       # 向量库管理 (后端职责)
│       │   └── document_processor.py # 文档处理 (后端职责)
│       ├── utils/
│       │   └── rag_client.py         # ★ API 调用封装: initialize() + ask_question()
│       ├── ui/
│       │   ├── windows/main_window.py    # PyQt5 主窗口 (不可复用于 Web)
│       │   ├── windows/knowledge_window.py # PyQt5 知识库窗口 (不可复用)
│       │   ├── widgets/message_bubble.py  # PyQt5 消息气泡 (不可复用)
│       │   └── styles/main_style.qss     # Qt 样式表 (不可复用)
│       ├── data/                     # ★ 知识库文本内容
│       │   ├── 中医皮肤科/           # 基础理论.txt, 1.txt
│       │   ├── 西医皮肤科/           # 常见疾病.txt, 1.txt
│       │   └── 中西医结合/           # 综合治疗.txt, 1.txt
│       ├── chroma_db/               # ChromaDB 向量数据库文件
│       ├── main.py                  # PyQt5 入口 (简易版)
│       └── main_final.py           # PyQt5 入口 (完善版)
├── SkinCareAI石山代码(2).zip        # 原始文件 (未移动)
└── 前端要求(3).docx                 # 原始文件 (未移动)
```

---

## 三、需求完成度表

### 需求文档原文提炼

| # | 需求项 | 优先级 | 现有代码状态 | 网页端完成度 |
|---|--------|--------|-------------|-------------|
| **核心功能** | | | | |
| 1 | 文本对话输入框 | P0 | PyQt5 有 `QTextEdit` 输入框 | ❌ 0% - 需全新实现 |
| 2 | 图片上传入口 (按钮/拖拽) | P0 | PyQt5 有 `📎附件` 按钮但无实际上传逻辑 | ❌ 0% - 需全新实现 |
| 3 | 消息流展示 (区分用户/AI) | P0 | PyQt5 有 `MessageBubble` 和 HTML 气泡 | ❌ 0% - 需全新实现 |
| 4 | 多轮对话历史展示 | P0 | PyQt5 仅有单会话追加显示 | ❌ 0% - 需全新实现 |
| 5 | AI 回复加载状态 | P0 | PyQt5 有 "⏳正在分析..." 占位 | ❌ 0% - 需全新实现 |
| **扩展功能** | | | | |
| 6 | 科普知识板块 (独立页/面板) | P1 | PyQt5 `KnowledgeWindow` 是知识库管理,非科普展示 | ❌ 0% |
| 7 | 历史对话侧边栏 | P1 | PyQt5 左侧是功能菜单,非对话列表 | ❌ 0% |
| 8 | 新建对话按钮 | P1 | 无 | ❌ 0% |
| 9 | 对话重命名 | P2 | 无 | ❌ 0% |
| 10 | 对话标签/分组 | P2 | 无 | ❌ 0% |
| 11 | 对话归档/删除 | P2 | 无 | ❌ 0% |
| **视觉要求** | | | | |
| 12 | 商业化、正式的 UI | P0 | 参考图为 GeoseAI 深色科技风 | ❌ 0% |
| 13 | 统一设计系统 | P0 | 无 | ❌ 0% |

### 结论: 网页端完成度 = 0%，属于全新构建项目

---

## 四、现有代码可复用清单

### ✅ 可直接复用

| 内容 | 文件位置 | 复用方式 |
|------|---------|---------|
| 知识库文本 | `data/中医皮肤科/*.txt` `data/西医皮肤科/*.txt` `data/中西医结合/*.txt` | 科普板块的静态内容源，可直接读取展示 |
| AI 头像素材 | `assets/docx_image_1.png` | 直接作为 AI 助手头像 |
| 参考 UI | `assets/docx_image_3.png` | 设计参考 |

### 🔄 可参考改写

| 内容 | 文件位置 | 参考价值 |
|------|---------|---------|
| API 调用模式 | `utils/rag_client.py` | `initialize()` + `ask_question(question)` 的接口模式，Web 端 fetch 可参考 |
| Ollama 配置 | `config/config.py` | `base_url: http://localhost:11434`、`model: qwen3:8b`、prompt 模板 |
| RAG prompt 模板 | `scripts/skin_care_ai.py:42-83` | 完整的中西医结构化回答模板，Web 端如果直连 Ollama 可复用 |
| 消息类型区分 | `ui/widgets/message_bubble.py` | 用户消息 vs AI 消息的气泡逻辑，改写为 React 组件 |
| 侧边栏功能分类 | `ui/windows/main_window.py:105-113` | 功能列表结构可参考: 智能问答/知识库/产品展示 |

### ❌ 不建议复用

| 内容 | 原因 |
|------|------|
| 所有 PyQt5 UI 代码 (`ui/` 目录) | Qt Widget 布局/样式/事件与 Web 完全不同 |
| QSS 样式文件 (`main_style.qss`) | Qt 专有样式语法，无法用于 Web |
| QThread 线程模型 | Web 用 async/await + fetch |
| `main.py` / `main_final.py` | PyQt5 应用入口，与 Web 无关 |
| `venv/` | Python 虚拟环境 |
| `chroma_db/` | 后端向量库数据 |

---

## 五、网页端推荐技术方案

### 技术选型

| 层面 | 推荐方案 | 理由 |
|------|---------|------|
| 框架 | **React 18 + TypeScript** | 生态成熟、组件化强、展示效果库丰富 |
| 构建工具 | **Vite 5** | 极速 HMR，零配置开箱即用 |
| UI 组件库 | **Ant Design 5** 或 **shadcn/ui** | antd 成熟稳定适合快速出活; shadcn 更现代高级 |
| 样式 | **Tailwind CSS 3** | 快速搭建商业化 UI，间距/圆角/阴影一致性好 |
| 状态管理 | **Zustand** | 轻量，管理会话列表/当前对话/消息流 |
| HTTP 请求 | **fetch + React Query** | 处理 AI 流式响应 + 缓存 |
| 路由 | **React Router 6** | 聊天页/科普页切换 |
| Markdown 渲染 | **react-markdown** | AI 回复内容渲染 |
| 图片上传 | 原生 `<input type="file">` + 拖拽 | 无需额外库 |

### 后端对接方案

现有代码使用 Ollama 本地部署 (`http://localhost:11434`)，Web 前端有两种对接方式：

1. **方案 A: 前端直连 Ollama API** (推荐，最快)
   - 直接调 `POST http://localhost:11434/api/chat`
   - 优点：无需额外后端，开发最快
   - 缺点：跨域需配置，RAG 检索需另想办法

2. **方案 B: 加一层轻量 API 中间层**
   - 用 FastAPI / Express 包装现有 `SkinCareAI.ask()` 方法
   - 优点：RAG 检索完整保留，前端只管展示
   - 缺点：多一个服务要维护

**建议采用方案 A 快速出原型，后续需要 RAG 时加方案 B。**

---

## 六、页面与组件清单

### 页面结构 (2 页)

```
/                → 主聊天页 (默认)
/knowledge       → 科普知识页
```

### 组件拆分 (16 个核心组件)

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx            # 整体三栏布局壳
│   │   ├── Sidebar.tsx              # 左侧会话列表栏
│   │   ├── TopBar.tsx               # 顶部品牌区 + 导航
│   │   └── BrandLogo.tsx            # 品牌 Logo + 名称
│   │
│   ├── chat/
│   │   ├── ChatContainer.tsx        # 聊天页主容器
│   │   ├── MessageList.tsx          # 消息流列表 (虚拟滚动)
│   │   ├── MessageBubble.tsx        # 单条消息气泡 (用户/AI)
│   │   ├── AiAvatar.tsx             # AI 头像组件
│   │   ├── InputArea.tsx            # 输入区 (文本框 + 操作栏)
│   │   ├── ImageUpload.tsx          # 图片上传 (按钮 + 拖拽 + 预览)
│   │   ├── TypingIndicator.tsx      # AI 思考中加载动画
│   │   └── EmptyState.tsx           # 空对话占位 (引导语 + 快捷提问)
│   │
│   ├── sidebar/
│   │   ├── ConversationList.tsx     # 对话列表
│   │   ├── ConversationItem.tsx     # 单条对话 (标题 + 操作)
│   │   └── NewChatButton.tsx        # 新建对话按钮
│   │
│   └── knowledge/
│       ├── KnowledgePage.tsx        # 科普主页面
│       ├── KnowledgeCard.tsx        # 科普卡片
│       └── KnowledgeSearch.tsx      # 科普搜索
│
├── stores/
│   ├── chatStore.ts                 # 对话状态 (消息列表、当前会话)
│   └── conversationStore.ts         # 会话管理 (列表、新建、删除)
│
├── services/
│   └── api.ts                       # Ollama API 调用封装
│
├── types/
│   └── index.ts                     # TypeScript 类型定义
│
└── assets/
    ├── ai-avatar.png                # AI 头像
    └── logo.png                     # 品牌 Logo
```

---

## 七、视觉改造方向

### 设计关键词
**「轻医疗 AI 产品感」** — 科技蓝绿 + 毛玻璃 + 卡片层级

### 具体定义

| 维度 | 方向 | 参考值 |
|------|------|--------|
| 主色调 | 青绿色 (与鹅 Logo 一致) | `#2ABFBF` / `#0EA5A5` |
| 辅助色 | 深蓝灰 (背景/侧边栏) | `#1A1F2E` / `#0F1419` |
| 强调色 | 亮绿 (按钮/状态) | `#10B981` / `#34D399` |
| 背景模式 | **深色主题为主** (参考 GeoseAI 截图) | 侧边栏深色 + 聊天区微亮 |
| 圆角 | 大圆角，柔和感 | 卡片 `16px`，气泡 `20px`，按钮 `12px` |
| 阴影 | 微妙投影，层级分明 | `0 4px 24px rgba(0,0,0,0.12)` |
| 字体 | 系统字体栈 + 粗体层级 | `Inter` / `PingFang SC` / 系统回退 |
| 气泡样式 | 用户=青绿实色，AI=半透明深色卡片 | 参考 GeoseAI 截图的对话气泡 |
| 动效 | 消息淡入 + 打字机效果 + 按钮微交互 | `framer-motion` 或 CSS transition |
| 空状态 | 居中鹅 Logo + 引导文案 + 快捷提问按钮 | 类似 ChatGPT 空状态 |
| 侧边栏 | 深色，对话列表，顶部品牌区 | 参考截图左侧 |

### 不要做的
- ❌ 不要用纯白背景 + 蓝色按钮的"学生作业风"
- ❌ 不要用 Element UI 默认样式
- ❌ 不要密密麻麻的功能堆砌
- ❌ 不要 emoji 当图标 (原型代码里大量 emoji 做按钮，不可用于正式产品)

---

## 八、分阶段执行计划

### P0: 必须先完成 (骨架 + 核心对话)

| # | 任务 | 预期产出 |
|---|------|---------|
| 1 | **初始化 Vite + React + TS + Tailwind 项目** | 可运行的空白项目 |
| 2 | **搭建 AppLayout: 左侧栏 + 主内容区 + 顶部栏** | 三栏布局骨架，深色主题 |
| 3 | **实现 ChatContainer + MessageList + MessageBubble** | 可渲染用户/AI 消息的对话流 |
| 4 | **实现 InputArea + 发送逻辑** | 文本输入 + 发送，调用 Ollama API |
| 5 | **实现 TypingIndicator 加载态** | AI 回复时显示思考动画 |
| 6 | **实现 ImageUpload 图片上传入口** | 按钮 + 拖拽上传 + 缩略图预览 |
| 7 | **实现 EmptyState 空对话状态** | 鹅 Logo + 欢迎语 + 快捷提问 |
| 8 | **接入 Ollama API / 模拟数据** | 前端可跑通完整对话流程 |

### P1: 核心体验增强

| # | 任务 | 预期产出 |
|---|------|---------|
| 9 | **实现 ConversationList 会话管理** | 左侧会话列表 + 新建对话 |
| 10 | **实现多会话切换 + 本地存储** | 切换会话保留���史，localStorage 持久化 |
| 11 | **实现 KnowledgePage 科普板块** | 独立页面，卡片式科普内容展示 |
| 12 | **AI 回复 Markdown 渲染** | 结构化回答正确渲染标题/列表/加粗 |
| 13 | **对话重命名 + 删除** | 右键/hover 操作菜单 |
| 14 | **响应式适配** | 平板/大屏展示正常 |

### P2: 比赛展示加分项

| # | 任务 | 预期产出 |
|---|------|---------|
| 15 | **消息打字机动效** | AI 回复逐字显示，流式感 |
| 16 | **消息淡入动画** | 新消息滑入效果 |
| 17 | **科普搜索 (对接 RAG)** | 科普页搜索框，调用后端检索 |
| 18 | **对话标签/分组** | 标签筛选 |
| 19 | **深色/浅色主题切换** | 主题开关 |
| 20 | **品牌启动页/欢迎引导** | 首次打开的品牌感引导页 |

---

## 九、可执行结论

### 1. 建议: 直接新建 Web 前端项目

**不建议"基于现有代码迁移"**，理由：
- 现有代码是 PyQt5 桌面端，零 Web 代码
- UI 层完全无法复用 (QWidget / QSS / QThread 与 Web 技术栈无交集)
- 业务逻辑 (RAG 链) 属于后端职责，前端只需调 API
- 唯一可复用的是：接口调用模式 + 知识库文本 + 素材图片 + prompt 模板

### 2. 第一阶段最该做的 5 个动作

1. **`npm create vite@latest web -- --template react-ts`** — 在项目根目录创建 `web/` 子目录，初始化 Vite + React + TypeScript
2. **安装 Tailwind CSS + 基础配置** — 建立统一设计系统的基础
3. **创建 `AppLayout` 三栏布局** — 深色侧边栏 + 主内容区 + 顶栏，参考 GeoseAI 截图
4. **实现 `ChatContainer` + `MessageBubble`** — 搭出可渲染消息的对话流
5. **实现 `InputArea` + mock 数据** — 输入发送 → 模拟 AI 回复，跑通完整交互流

### 3. 需要你配合的事项 (最少量)

1. **确认后端对接方式**: 是直连 Ollama (`localhost:11434`) 还是你们会包一层 API？
2. **确认产品名称**: 叫 "SkinCareAI" / "皮肤AI助手" / "GeoseAI" / 其他？ (影响品牌区和标题)
3. **确认是否有额外设计稿**: 除了 docx 中的 GeoseAI 参考截图，是否有 Figma/蓝湖设计稿？

以上 3 点不阻塞开发启动，我可以先用 mock 数据 + 参考截图风格推进。
