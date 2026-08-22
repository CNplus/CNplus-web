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
