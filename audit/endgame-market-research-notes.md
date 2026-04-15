# SkinCareAI 终局市场调研与逐功能收口

更新日期：2026-04-15

## 参考来源

- OpenAI Shared Links FAQ  
  `https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq`
- OpenAI File Uploads FAQ  
  `https://help.openai.com/en/articles/8555545-file-uploads-faq`
- Claude Projects  
  `https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects`
- Claude chat search and memory  
  `https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context`
- Anthropic sharing chats  
  `https://support.anthropic.com/en/articles/10593882-sharing-and-unsharing-chats`
- Perplexity Threads  
  `https://www.perplexity.ai/help-center/en/articles/10354769-what-is-a-thread`
- Perplexity file uploads privacy  
  `https://www.perplexity.ai/help-center/en/articles/10354810-security-and-privacy-with-file-uploads`
- Google Gemini conversation sharing  
  `https://cloud.google.com/gemini/enterprise/docs/share-conversations`
- Google Gemini privacy / data handling  
  `https://support.google.com/gemini/answer/13594961`

说明：

- 第一层交互规则主要参考 ChatGPT、Claude、Gemini、Perplexity 的官方说明与当前产品体验。
- 豆包、元宝作为中文产品的二级视觉参考，用于校正中文场景下的按钮密度与说明长度。

## 逐功能对标结论

| 功能 | 主要对标 | 成熟产品第一层显示什么 | 哪些信息默认收起 | 当前差距 | 这轮落地决策 |
|---|---|---|---|---|---|
| 模型选择器 | ChatGPT / Claude | 默认推荐模型、极少说明、清晰状态 | 高级分类、低频模型 | 之前模型工作台偏高 | 保留“通用优先 + 分类后置”，并把 `qwen-plus-latest` 降权到保留备选 |
| 模型工作台 | Claude | 默认模型、当前状态、少量提示 | 长说明、复杂参数 | 空会话时仍可能抢高度 | 保持紧凑结构，不再扩参数区 |
| 首屏空状态 | ChatGPT | 立刻可提问、功能一眼可见 | 大段教育文案 | 之前首屏偏高偏空 | 已压缩为空状态直达输入与默认模型 |
| 少消息状态 | ChatGPT / Claude | 下一个动作提示 | 多余说明卡 | 之前中间空白偏大 | 追问区改成紧凑按钮组 |
| 会话列表 | Claude / ChatGPT | 搜索、最近会话、清晰标题 | 花哨标签 | 同标题增多时辨识一般 | 保持搜索 + 时间分组优先，不扩标签系统 |
| 会话搜索 | ChatGPT / Claude | 直接输入、即筛即见 | 额外过滤器 | 无明显硬伤 | 保持单输入框，避免复杂检索 |
| 图片上传 / 粘贴 / 拖拽 | ChatGPT / Perplexity | 上传入口贴近输入框 | 复杂教学文本 | 说明曾偏长 | 保留三种输入方式，文案继续压短 |
| 非视觉 handoff | ChatGPT 类多模态产品 | 明确告诉用户为什么切模型 | 多余技术细节 | 需要足够自然 | 已固定为近场提示 + 新会话切换 |
| 帮助问号 | Claude / Gemini | 只出现在高认知成本处 | 全页散落问号 | 小屏曾越界 | 桌面 popover，移动端 drawer |
| 右 rail | Perplexity | 当前任务相关说明 | 品牌长解释 | 之前像说明墙 | 品牌卡、能力卡、免责声明全部压短 |
| `/knowledge` | Ada 类知识页 / Gemini | 顶部导览、分类、精选内容 | 长解释、次级说明 | 移动端仍偏长 | 顶部减负、精选收短、分类区压成更紧的 chips |
| 轻量专家会诊 | Claude / Perplexity 对比视图 | 打开即看到结果或加载中 | 二次确认步骤 | 之前曾停在待开始 | 修为展开即自动运行，避免半成品感 |
| 复制 / 导出 / 分享 | ChatGPT / Claude / Perplexity | 动作靠近当前会话 | 独立导出中心 | 系统分享受设备限制 | 会话级保留复制和导出，系统分享走支持设备路径 |
| 主题切换 | Gemini / ChatGPT | 少量主题、明显边界 | 复杂皮肤设置 | 浅色主题曾偏淡 | 提升 light / soft 的边界、阴影和对比 |
| 侧边栏收起 | ChatGPT / Claude | 收起后主区更满 | 额外动画说明 | 收起后曾不够满 | 已继续提高主区占比，不再让右 rail 抢宽度 |

## 逐功能落地决策补充

### 1. 模型选择器

- 第一层只保留默认推荐和清晰分类，不让用户先读长解释。
- `qwen-plus-latest` 不再进入主演示文本路径。
- 低频模型保留，但通过排序和标签降权。

### 2. 模型工作台

- 空状态优先露出“默认模型 + 在线状态 + 切换入口”。
- 不再扩复杂参数区。
- 解释性内容继续收在帮助入口里。

### 3. 首屏空状态

- 让用户第一眼看到输入、默认模型和上传能力。
- 不再增加新说明卡。
- 保持首屏“可直接开始”而不是“先被教育”。

### 4. 少消息状态

- 追问建议保留，但改成更紧凑按钮。
- 减少聊天容器最小高度造成的空洞。
- 主区视觉重心回到当前回复和输入框。

### 5. 会话列表

- 搜索和时间分组维持高优先级。
- 不新增复杂标签和过滤器。
- 让标题、时间、操作成为唯一重点。

### 6. 图片输入

- 上传、拖拽、粘贴都贴近输入区。
- 手把手说明只保留近场短句。
- 对图片不兼容模型直接 handoff，不让用户卡住。

### 7. 帮助入口

- 桌面端保留短 popover。
- 移动端统一底部 drawer。
- 继续只放在模型、知识页、上传、分享等高认知成本处。

### 8. 右 rail

- 只服务当前演示任务。
- 不再写成长段品牌介绍。
- 重点只保留当前模型定位、使用边界和免责提示。

### 9. `/knowledge`

- 顶部只留必要导览。
- 移动端精选卡数量压缩，长说明折叠。
- 第11轮把分类区再压成 chip 形态，继续削短移动端。

### 10. 轻量专家会诊

- 展开即跑，不再二次点击。
- 首屏必须是 loading 或结果，而不是“待开始”。
- 保留为增强项，不扩成大系统。

### 11. 复制 / 导出 / 分享

- `复制回答` 继续留在消息级。
- `复制当前会话 / 导出 Markdown / 系统分享` 放在会话级。
- 系统分享只在支持设备上走原生能力，不硬造云端分享。

### 12. 主题切换

- 轻主题也必须有足够边界和投屏层次。
- 不靠单色背景撑页面。
- 继续保持 dark / light / soft 三套可讲可用的状态。

### 13. 侧边栏收起

- 收起的收益必须是主区更满，而不是更空。
- 不再让右 rail 抢走收回来的空间。
- 答辩开场仍建议用展开态，收起态作为补充演示。

## 本轮后仍保留的诚实结论

- 系统分享仍缺真实移动设备原生面板确认。
- `/knowledge` 移动端已经明显收短，但仍不是聊天页同等级的主演示页面。
- 主链路收口已完成，后续不再扩新功能，只做验收和录屏准备。
