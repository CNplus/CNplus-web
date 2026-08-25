# CNplus Web

CNplus 官方网站，静态构建并部署到 Cloudflare Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 验证

```bash
npm test
```

## 架构

- `src/pages/`：官网页面
- `src/components/`：共享组件
- `src/layouts/`：页面布局
- `src/config/site.ts`：统一站点元数据、版本和外链
- `src/styles/`：设计 token 与全局样式
- `tests/`：构建产物验收测试

论坛和 Wiki 是独立系统；本仓库只保留它们的导航入口。

## 部署生产

Pages 项目 `cnplus-site` 为 Direct Upload 模式（Cloudflare 不允许转换为 Git 集成），push 到 main **不会**自动发布线上，需要手动部署：

```bash
npm test                       # 构建 + 验收测试，产物在 dist/
npx wrangler pages deploy dist --project-name=cnplus-site --branch=main
```

需要本机具备 Cloudflare 凭据（`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 环境变量，或 `wrangler login`）。

发布版本时的顺序约定：`npm test` 全绿 → commit/push → 立即执行上面的部署命令 → 抽查 `https://cnplus.org/` 版本号与关键外链。

