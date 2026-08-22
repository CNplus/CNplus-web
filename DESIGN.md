# CNplus Web 设计基线

## 页面类型

**Decide / Learn**：帮助第一次听说 CNplus 的人理解它是什么、为什么存在、如何开始。

## 视觉语言

- 背景：纯白 `#ffffff`
- 正文：墨黑 `#101828`，次级文字 `#475467`
- 强调：科技蓝 `#155eef` 与玉石绿 `#16a36a`
- 官方 Logo 自带的红蓝笔刷色不重新着色
- 线条：`rgba(23, 23, 23, 0.12)`
- 代码区：`#171717` 深色，不做彩虹语法色
- 圆角：功能元素 6–10px，不使用大面积胶囊卡片
- 阴影：只用 1px ring 与极轻环境阴影

## 字体

- 品牌主张：`"Songti SC", "STSong", "Noto Serif CJK SC", serif`
- 中文正文：`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
- 拉丁/数字：Geist 可作为增强，但页面不能依赖远程字体才能正确显示
- 代码：`"SFMono-Regular", Consolas, "Liberation Mono", monospace`

## 构图

- 首屏采用居中品牌舞台：大 Logo、CNplus、强主张、简介与双操作。
- 真实代码放在首屏下方成为“立即可读”的证据，不和品牌主张抢第一视觉。
- 后续采用错落叙事章节，不使用等权三卡功能网格。
- 用细线、编号和代码变化解释架构，而不是装饰插图。
- 宽屏最大内容宽度约 1180px；移动端单列。

## 统一导航

`首页｜快速开始｜Wiki｜论坛｜动态｜GitHub`

“动态”指向论坛受限板块，不创建独立博客。
