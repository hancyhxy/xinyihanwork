Templates overview

- two-column: 左右双栏，适合案例研究/产品设计叙述，左侧粘性标题，右侧内容。
- stacked: 单列上下叙述，适合艺术/可视化项目。

What gets generated
- index.html — 页面骨架（已内置 hero 占位回退，封面缺失时展示渐变色背景）。
- text.md — 内容源文件（YAML frontmatter + Markdown）。
- public/ — 放置 cover.png 与正文图片（body-1.png 等）。

Notes
- 模版内 hero <img> 带 onerror 回退，无封面图会自动切换到固定占位图：`../../logo/hero-placeholder.svg`。
- 首页卡片已内置图片加载失败回退（由 style/script.js 处理）。
- 生成脚手架会在 public/ 放置 README.txt 说明需要替换图片。
- 模板已包含 `.video-embed` CSS 样式，支持嵌入 Vimeo 和 YouTube 视频（参考 text.md 中的注释示例）。

Tokens
- {{TITLE}} {{DESCRIPTION}} {{DATE}} {{TAG}} {{COMPANY}}
- 脚手架会将 JSON 写入 ISO 日期（YYYY-MM-DD），显示层格式化为 YYYY.MM。
