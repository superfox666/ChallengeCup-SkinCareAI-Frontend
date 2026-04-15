# SkinCareAI

一个面向皮肤健康咨询与科普展示的 Web 项目，支持文本问诊、图片问诊、会话管理、知识页浏览和演示级多模型切换。

## 项目简介

SkinCareAI 是一个前后端分离的皮肤健康问诊网页项目，重点放在以下三件事：

- 让用户可以用文本或图片发起皮肤相关咨询。
- 让问诊链路、会话历史和加载状态足够清楚，适合现场演示。
- 让知识页、病例图演示集和模型工作台形成完整的展示闭环。

## 功能总览

### 基础功能

- 文本问诊
- 图片问诊
- 消息流展示
- 多轮对话历史
- 明确加载状态

### 体验增强

- 新建对话
- 会话搜索
- 会话时间分组
- 会话重命名 / 删除
- 主题切换
- 图片粘贴 / 拖拽上传
- 非视觉模型自动 handoff 到视觉模型

### 展示加分项

- `/knowledge` 结构化知识页
- 轻量专家会诊
- 模型工作台
- 模型分层与推荐
- 人眼级提示与帮助问号

### 当前特色

- 一个模型一个会话
- 图文联合输入
- 会话与模型绑定
- 默认模型推荐
- 多模型策略
- 真实 API 路径 + mock fallback
- 可直接用于演示和录屏预演

## 技术栈

- 前端：React 19、TypeScript、Vite、React Router、Zustand、Tailwind CSS 4
- 后端：Node.js、原生 HTTP Server、ESM
- 模型接入：OpenAI Chat / Responses、Anthropic Messages、Gemini Native、统一 provider registry
- UI：Radix UI、Lucide、少量 Framer Motion

## 目录结构

```text
.
├─ audit/                         验收、QA、调研与集成说明
├─ docs/                          使用说明、演示说明、持续 memory
├─ server/                        后端服务与模型适配层
│  ├─ .env.example               后端环境变量模板
│  └─ src/
├─ web/                           前端应用
│  ├─ .env.example               前端环境变量模板
│  ├─ public/
│  │  └─ clinical-images/demo/   示例图片与真实病例图演示目录
│  └─ src/
├─ project_source/                原始材料保留目录
└─ unpacked_code/                 历史解包材料保留目录
```

## 如何启动前端

```bash
cd web
npm install
npm run dev
```

默认地址：

- `http://127.0.0.1:5173`

如果端口冲突：

- Vite 会尝试切到下一个可用端口。
- 如果前端端口变化，直接看终端输出中的本地访问地址。

## 如何启动后端

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

默认地址：

- `http://127.0.0.1:8787`

如果端口冲突：

- 修改 `server/.env` 中的 `PORT`
- 同时修改 `web/.env.example` 或本地前端环境中的 `VITE_API_BASE_URL`

后端常用环境变量：

- `PORT`
- `HOST`
- `IKUN_BASE_URL`
- `IKUN_API_KEY`
- `FALLBACK_TO_MOCK`
- `REQUEST_TIMEOUT_MS`

## 如何查看页面

前后端都启动后：

- 聊天页：`http://127.0.0.1:5173/chat`
- 知识页：`http://127.0.0.1:5173/knowledge`
- 后端健康检查：`http://127.0.0.1:8787/api/health`
- 模型列表：`http://127.0.0.1:8787/api/models`

## 示例图片放哪里

当前演示图片目录：

- `web/public/clinical-images/demo/acne/`
- `web/public/clinical-images/demo/eczema-dermatitis/`
- `web/public/clinical-images/demo/fungal/`
- `web/public/clinical-images/demo/psoriasis/`

当前已接入的真实 demo 图：

- `web/public/clinical-images/demo/eczema-dermatitis/cdc-phil-4506-eczema.jpg`
- `web/public/clinical-images/demo/fungal/cdc-phil-4811-ringworm.jpg`
- `web/public/clinical-images/demo/fungal/cdc-phil-17271-tinea-barbae.jpg`

如果以后补更多真图：

1. 把图片放进对应病种目录。
2. 更新 `web/src/content/clinical-images/manifest.ts`
3. 如有新来源，更新 `web/src/content/clinical-images/source-registry.json`
4. 回归 `/knowledge` 页面和聊天页图片问诊链路。

## 常见演示路径

### 文本问诊

推荐模型：

- 主演示：`Qwen 3 VL Flash`
- 稳定文本备选：`GPT-5.4 mini`
- 中文文本主备：`Qwen 3.6 Plus`

建议路径：

1. 进入聊天页。
2. 直接输入皮肤相关问题。
3. 观察消息流、加载状态和回复结构。
4. 再演示复制回答、复制会话和导出 Markdown。

### 图片问诊

推荐模型：

- 主演示：`Qwen 3 VL Flash`

建议路径：

1. 在聊天页上传 `web/public/clinical-images/demo/` 中的一张图片。
2. 补充一句简短问题。
3. 演示图片预览、图文回复和多轮追问。

### 非视觉模型 handoff

1. 先切到不支持图片的文本模型。
2. 再上传图片。
3. 系统会提示并自动切到推荐视觉模型的新会话。

### 知识页

1. 打开 `/knowledge`
2. 先看首屏导览
3. 再切精选 / 全部 / 分类
4. 最后看病例图区块

## 注意事项

- 项目只处理皮肤相关咨询与科普展示，不替代医生面诊、检查和处方。
- 一个模型一个会话，切模型会新建会话，不继续沿用旧上下文。
- 如果后端波动且 `FALLBACK_TO_MOCK=true`，前端仍可走 mock 演示链路。
- 演示时优先使用聊天页作为主路径，`/knowledge` 作为补充展示。

## 当前已知限制

- 系统分享已验证浏览器代码路径，但仍建议用真实移动设备确认原生分享面板。
- `/knowledge` 移动端已收短，但不适合作为长时间手机主讲页面。
- `qwen-plus-latest` 保留为低成本备选，不建议作为主演示文本模型。
- 当前真实病例图是首批演示集，不是完整图库。

## 推荐继续阅读

- [docs/final-usage-guide.md](/f:/ChallengeCup-SkinCareAI-Frontend/docs/final-usage-guide.md)
- [docs/demo-packaging-guide.md](/f:/ChallengeCup-SkinCareAI-Frontend/docs/demo-packaging-guide.md)
- [audit/final-qa-checklist.md](/f:/ChallengeCup-SkinCareAI-Frontend/audit/final-qa-checklist.md)
- [audit/clinical-image-demo-guide.md](/f:/ChallengeCup-SkinCareAI-Frontend/audit/clinical-image-demo-guide.md)
