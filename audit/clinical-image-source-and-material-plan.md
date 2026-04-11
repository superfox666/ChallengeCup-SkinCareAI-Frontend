# SkinCareAI 病例图片来源与素材方案

更新日期：2026-04-11

## 1. 使用原则

- 先确认来源可信，再谈是否可做演示素材候选。
- 能在线查看，不等于可以直接下载落库。
- 医学专业性、版权状态、隐私风险需要同时满足。
- Batch 2A 不默认完成批量采集，只完成来源分级、目录结构和元信息规范。

## 2. 来源分级

### A 类：更适合做演示素材候选

#### 1. CDC Public Health Image Library (PHIL)

- 网站：
  - https://wwwn.cdc.gov/phil/default.aspx
  - https://wwwn.cdc.gov/PHIL/FAQ.aspx
- 可信度：高，CDC 官方图库。
- 优势：
  - 可按 `Public Domain` 过滤。
  - 可明确区分 `Public Domain` 与 `Copyright Protected`。
  - 详情页可查看版权状态。
- 风险：
  - 图片带有“historic in nature”提示，不能默认视为最新医学实践示例。
  - 仍需逐张核对详情页是否为公有领域。
- 适合找：
  - 皮肤感染
  - 真菌感染
  - 接触性皮炎
  - 某些职业性或公共卫生相关皮损

#### 2. DermNet NZ

- 网站：
  - https://dermnetnz.org/image-catalogue
  - https://dermnetnz.org/image-application-form
- 可信度：高，国际常用皮肤科教学资源。
- 优势：
  - 典型皮损覆盖广。
  - 病种标签清晰，适合做医学参考与演示候选。
- 风险：
  - 图片使用受 DermNet Image Licence 约束。
  - 站点明确说明高分辨率无水印图片可能收费，且需遵循用途限制、来源署名、链接回原页等要求。
  - 不能默认视为可自由商用或可自由再分发。
- 适合找：
  - 痤疮
  - 湿疹 / 皮炎
  - 真菌感染
  - 银屑病
  - 酒糟鼻
  - 毛囊炎
  - 色素类问题

#### 3. HSE Work-related skin disease image library

- 网站：
  - https://www.hse.gov.uk/skin/imagelibrary.htm
  - https://www.hse.gov.uk/help/copyright.htm
- 可信度：高，英国 Health and Safety Executive 官方资源。
- 优势：
  - 职业性皮肤问题图片集中。
  - 页面明确标注未标记图片为 Crown copyright，并给出版权说明入口。
- 风险：
  - 页面也明确存在 Danderm、Global Skin Atlas 等第三方授权图片。
  - 需要逐张确认是否属于 Crown copyright，不能整站默认可复用。
- 适合找：
  - 接触性皮炎
  - 手部湿疹
  - 接触性荨麻疹
  - 化学灼伤

### B 类：更适合做医学参考，不适合直接下载使用

#### 1. AAD Clinical Image Collection

- 网站：
  - https://clinicalimagecollection.aad.org/Home
- 可信度：高，美国皮肤科学会官方图集。
- 说明：
  - 官方页面明确写有：`Watermarked images may be used for educational purposes only. Any commercial reproduction, redistribution, publication or otherwise is prohibited.`
- 结论：
  - 适合做病种形态参考。
  - 不适合默认下载进前端素材库。

#### 2. Mayo Clinic

- 网站：
  - https://www.mayoclinic.org/about-this-site/reprint-permissions
  - https://www.mayoclinic.org/about-this-site/terms-conditions-use-policy
- 可信度：高。
- 风险：
  - 官方明确写有 `print only (no online use)` 等限制。
  - 不适合作为网页图片素材来源。

#### 3. Cleveland Clinic

- 网站：
  - https://my.clevelandclinic.org/about/website/reprints-licensing
- 可信度：高。
- 风险：
  - 官方明确说明站内材料受版权保护，未经许可不可重用、展示、再发布。
- 结论：
  - 适合做医学内容参考，不适合直接落库。

#### 4. MedlinePlus

- 网站：
  - https://medlineplus.gov/about/using/usingcontent/
- 可信度：高，NLM / NIH 体系。
- 风险：
  - 官方明确说明部分图片、插图和照片可能受版权保护。
  - 无来源标注图片可能是仅授权给 MedlinePlus 的库存图，不可再分发。
- 结论：
  - 适合做内容参考，不适合默认抓取图片。

#### 5. Merck Manual

- 网站：
  - https://www.merckmanuals.com/home/content/termsofuse
- 可信度：高。
- 风险：
  - 内容属于版权内容，未经许可不可默认复制或重发。
- 结论：
  - 适合医学参考，不适合作为默认图片素材库。

### C 类：不建议使用

- 社交媒体、论坛、转载站
  - 例如：小红书、微博、知乎、贴吧、Pinterest、论坛图贴。
  - 原因：来源不清、授权不明、医学真实性不可控、隐私风险高。
- 搜索引擎图片结果页
  - 例如：Google Images、百度图片、必应图片。
  - 原因：只是索引入口，不是可直接复用的素材源。
- 生成式 AI 皮肤病例图
  - 原因：病损细节和医学真实性不稳定。
  - 仅可作概念草图，不适合作病例图展示。

## 3. 疾病分类与数量建议

第一阶段优先类目：

- `acne`
- `eczema`
- `fungal`
- `psoriasis`

每类建议：

- 最低演示集：3 张
- 稳妥演示集：5 到 8 张

第二阶段可补：

- `rosacea`
- `folliculitis`
- `pigmentation`

## 4. 素材质量要求

- 单一病种、单一焦点。
- 自然光或稳定补光，颜色失真小。
- 背景干净，无社交平台水印。
- 无可识别人脸或已做隐私处理。
- 不选过于血腥、破溃严重、易引发不适的图片做公开演示首选。

## 5. 命名规范

统一英文小写加下划线：

`disease_severity_bodypart_index.ext`

示例：

- `acne_mild_face_01.jpg`
- `eczema_moderate_arm_02.jpg`
- `psoriasis_moderate_elbow_01.jpg`
- `tinea_foot_01.jpg`

## 6. 目录结构

```text
materials/
  clinical-images/
    raw/
      acne/
      eczema/
      psoriasis/
      fungal/
    approved/
      acne/
      eczema/
      psoriasis/
      fungal/

web/
  public/
    clinical-images/
      acne/
      eczema/
      psoriasis/
      fungal/
  src/
    content/
      clinical-image-manifest.ts
```

说明：

- `raw/` 保存原始候选图，不直接给前端引用。
- `approved/` 保存已人工核验的可演示版本。
- `public/clinical-images/` 放前端使用的压缩版图片。
- `clinical-image-manifest.ts` 保存前端可用清单。

## 7. 元信息格式

每张图片建议配同名 `.json` 文件，而不是 `.txt`。

理由：

- 前端和脚本都能直接读取。
- 字段固定，后续方便批量生成 manifest。
- 能明确记录来源、权限说明和展示注意事项。

最小示例：

```json
{
  "id": "acne_mild_face_01",
  "disease": "acne",
  "title": "面部轻度痤疮示例",
  "source": "CDC PHIL",
  "sourceUrl": "https://wwwn.cdc.gov/PHIL/",
  "usagePermissionNote": "仅在确认详情页为 Public Domain 或取得对应授权后，才能进入 approved 目录。",
  "bodyPart": "face",
  "severity": "mild",
  "displayNote": "适合知识页和图片分析 mock 演示。",
  "summary": "以粉刺和少量炎性丘疹为主的轻度痤疮示意。"
}
```

## 8. Batch 2A 边界

- 本轮只完成来源方案、目录结构、元信息设计。
- 不默认完成批量下载。
- 不默认完成版权核验。
- 若需要示例图，只保留少量候选链接或占位，不做大规模落库。
