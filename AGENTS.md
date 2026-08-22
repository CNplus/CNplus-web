# CNplus Web 项目规则

## 产品边界

- 官网：`cnplus.org`，Astro 静态输出，部署到 Cloudflare Pages。
- 论坛：`forum.cnplus.org`，独立 NodeBB，不在本仓库实现。
- Wiki：`wiki.cnplus.org`，现有 Wiki.js，不在本仓库实现。
- 不建设独立博客；“动态”链接到论坛的“开发日志与博客”板块。

## 内容原则

- 面向中文母语者和零基础用户，大白话优先，不照抄英文技术宣传语。
- 不捏造用户数、下载量、性能、企业采用、发布日期或兼容性承诺。
- 当前稳定版本从 `src/config/site.ts` 读取；更新版本时同步来源链接。
- CNplus 的核心事实以 `github.com/CNplus/CNplus-lang` 当前 README 和规范为准。

## 设计原则

- 主表面是 Decide / Learn：一节只讲一个重点。
- 黑白为主，印章红只用于品牌强调和主操作。
- 不用紫蓝科技渐变、玻璃拟态、虚构指标、图库照片、emoji 图标墙。
- 不用等权三列功能卡代替内容层级。
- 中文正文优先系统中文字体；代码使用等宽字体。
- 所有交互目标至少 44px；支持键盘焦点和 `prefers-reduced-motion`。

## 工程规则

- TypeScript 严格模式，Astro 静态构建。
- 新行为严格测试先行：先看到失败，再写最小实现。
- `npm test` 必须构建并运行所有自动化检查。
- 外链集中在 `src/config/site.ts`，页面不得散落重复 URL。
- 不引入 React、Tailwind 或客户端框架，除非交互确有需要。
- 不提交 secrets、`.env`、构建产物或本机文件。
- 不 commit/push/deploy，除非用户明确授权（当前用户已授权搭建与部署，但仍须先验收 Preview）。
