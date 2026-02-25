# mr_Tabs 项目说明（会话交接版）

`mr_Tabs` 是一个基于 Chromium 扩展规范（Manifest V3）的新标签页扩展，运行于 Edge/Chrome。

## 1. 项目定位
- 覆盖浏览器默认新标签页。
- 提供可定制搜索体验（多引擎 + 自定义引擎）。
- 提供个性化视觉与设置面板（背景、主题、语言、设置分栏）。
- 保持持续迭代开发，任务驱动方式为 `work_plan.md` + `task_work.md`。

## 2. 当前功能总览
- 新标签页覆盖：`manifest.json -> chrome_url_overrides.newtab`。
- 搜索栏：搜索引擎选择 + 输入 + 内嵌搜索按钮（一体化组件）。
- 搜索引擎：
  - 内置：Google / Bing / Baidu / Yandex。
  - 自定义：可在设置页新增（图标、名称、URL 模板）。
  - 设置页“当前搜索引擎”已为图标下拉（非纯文本）。
- 背景：本地上传、清除、持久化。
- 主题：浅色/深色切换，动画与状态持久化。
- 语言：简体中文 / English 切换并持久化。
- 设置面板：右侧弹出，支持拖拽宽度，左侧目录 + 右侧内容布局。
- 暗色模式背景问题已修复：避免缩放异常与背景重复平铺。

## 3. 设置页结构（当前）
- 目录项：
  - `个性化 / Personalization`
  - `搜索引擎 / Search Engines`
- 搜索引擎页包含：
  - 当前搜索引擎（图标下拉）
  - 添加搜索引擎（名称、图标、搜索 URL 模板）

## 4. 自定义搜索引擎规则
- URL 模板必须包含 `{query}`，例如：
  - `https://example.com/search?q={query}`
- 运行时会用用户输入替换 `{query}` 并跳转。

## 5. 持久化状态字段（chrome.storage.local）
- `engine`: 当前搜索引擎 key
- `theme`: `light` / `dark`
- `backgroundDataUrl`: 背景图 DataURL
- `language`: `zh-CN` / `en`
- `settingsWidth`: 设置面板宽度
- `settingsTab`: 当前设置页签（`personalization` / `engines`）
- `customEngines`: 自定义搜索引擎数组

## 6. 项目文件结构
- `manifest.json`: 扩展清单（MV3）
- `newtab.html`: 页面结构
- `styles/main.css`: 样式与主题
- `scripts/config.js`: 内置引擎与默认状态
- `scripts/storage.js`: 本地存储读写封装
- `scripts/newtab.js`: 页面核心交互逻辑
- `work_plan.md`: 需求池与计划
- `task_work.md`: 任务执行与完成记录

## 7. 已完成里程碑
- 第一阶段：扩展骨架与核心功能完成
- 第二阶段：视觉优化完成
- 第三阶段：结构/交互增强完成
- 第四阶段：布局与可读性修正完成
- 第五阶段：暗色背景异常修复完成
- 第六阶段：搜索按钮融合式改造完成
- 第七阶段：搜索引擎管理功能完成
- 第八阶段：搜索引擎设置页优化完成
- 第九阶段：当前搜索引擎图标显示问题修复完成

## 8. GitHub 与仓库信息
- 仓库名：`mr_Tabs1.0`
- 远程地址：`https://github.com/qcs176/mr_Tabs1.0.git`
- 分支：`main`
- 已做历史清理：`Tabs.pem` / `Tabs.crx` 已从历史移除，并在 `.gitignore` 忽略。

## 9. 本地运行（Edge）
1. 打开 `edge://extensions`
2. 开启开发者模式
3. 点击“加载已解压的扩展程序”
4. 选择本项目根目录

## 10. 下次对话快速入口（建议顺序）
1. `task_work.md`：读取当前最新需求
2. `work_plan.md`：确认长期目标与边界
3. `scripts/newtab.js`：看交互逻辑
4. `styles/main.css`：看视觉与布局
5. `newtab.html`：看结构与组件挂载点

## 11. 开发注意事项
- 新功能先更新 `task_work.md`，再实现。
- UI 调整优先保持现有视觉语言（玻璃质感 + 圆角 + 轻动效）。
- 涉及状态新增时，同步更新 `scripts/config.js` 默认状态。
- 任何新增用户可见功能，需同时考虑中英双语文案。
