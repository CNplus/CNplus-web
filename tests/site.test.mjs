import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readPage = async (path = 'index.html') =>
  readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('首页使用中文并提供完整的主导航', async () => {
  const html = await readPage();

  assert.match(html, /<html[^>]+lang="zh-CN"/);
  assert.match(html, /<title>CNplus — 让中文成为编程的第一语言<\/title>/);

  const nav = html.match(/<nav id="primary-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const expectedLinks = [
    ['首页', '/'],
    ['在线运行', '/playground'],
    ['Wiki', 'https://wiki.cnplus.org/'],
    ['论坛', 'https://forum.cnplus.org/'],
    ['动态', 'https://forum.cnplus.org/category/2'],
    ['GitHub', 'https://github.com/CNplus/CNplus-lang'],
  ];

  for (const [label, href] of expectedLinks) {
    assert.match(nav, new RegExp(`<a[^>]+href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>[^<]*${label}`));
  }
  assert.ok(!nav.includes('快速开始'), '主导航不应含快速开始');
  assert.ok(!nav.includes('下载'), '主导航不应含下载（下载页已删除）');
  assert.ok(!nav.includes('联系'), '主导航不应含联系');
});

test('完整页面提供可核对的 CNplus 内容', async () => {
  const pages = ['learn/index.html', 'community/index.html', 'roadmap/index.html', 'about/index.html', '404.html'];
  for (const page of pages) assert.ok((await readPage(page)).includes('<main'));
  await assert.rejects(readPage('download/index.html'), { code: 'ENOENT' }, '下载页已删除');
  const home = await readPage();
  const homeText = home.replace(/<[^>]+>/g, '');
  for (const fact of ['CNplus v1.2.0', 'Python 3.11+', 'Apache-2.0', 'lexer', 'parser', 'AST', '可插拔后端', 'Python 转译后端']) assert.ok(home.includes(fact), `缺少事实：${fact}`);
  for (const line of ['设 单价 = 15', '设 数量 = 4', '打印("总价：" + 文本(单价 * 数量) + " 元")']) assert.ok(homeText.includes(line), `缺少示例：${line}`);
  const roadmap = await readPage('roadmap/index.html');
  for (const fact of ['VM', 'JS', '2021', '2026']) assert.ok(roadmap.includes(fact), `路线页缺少：${fact}`);
});



test('共享外壳具备 SEO、无障碍与无框架移动导航', async () => {
  const html = await readPage();
  for (const marker of ['rel="canonical"', 'property="og:title"', 'name="description"', '跳到主要内容', '<footer', 'aria-expanded="false"', 'data-menu-toggle']) assert.ok(html.includes(marker), `缺少：${marker}`);
  assert.match(html, /<link[^>]+href="\/favicon\.svg"/);
  const inlineCss = html.match(/<style>([\s\S]+?)<\/style>/);
  const linkedCss = html.match(/href="\/_astro\/([^"]+\.css)"/);
  assert.ok(inlineCss || linkedCss, '构建产物应包含页面样式');
  const css = inlineCss ? inlineCss[1] : await readPage(`_astro/${linkedCss[1]}`);
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('min-height:44px'));
  assert.ok(css.includes(':focus-visible'));
  const sitemap = await readPage('sitemap.xml');
  for (const route of ['learn', 'community', 'roadmap', 'about', 'contact']) assert.ok(sitemap.includes(`https://cnplus.org/${route}/`));
  assert.ok((await readPage('robots.txt')).includes('Sitemap: https://cnplus.org/sitemap.xml'));
});

test('首屏中文标题保持平衡，主操作不会拉成整栏', async () => {
  const html = await readPage();
  const inlineCss = html.match(/<style>([\s\S]+?)<\/style>/);
  const linkedCss = html.match(/href="\/_astro\/([^"]+\.css)"/);
  assert.ok(inlineCss || linkedCss, '构建产物应包含页面样式');
  const css = inlineCss ? inlineCss[1] : await readPage(`_astro/${linkedCss[1]}`);
  assert.ok(css.includes('text-wrap:balance'));
  assert.ok(css.includes('white-space:nowrap'));
  assert.ok(css.includes('white-space:normal'));
  assert.ok(css.includes('width:fit-content'));
});

test('使用官方标志，同时保留小尺寸专用 favicon', async () => {
  const html = await readPage();
  assert.match(html, /<img[^>]+src="\/cnplus-logo-96\.jpg"[^>]+width="48"[^>]+height="48"/);
  assert.match(html, /<meta[^>]+property="og:image"[^>]+content="https:\/\/cnplus\.org\/cnplus-logo-640\.jpg"/);
  assert.match(html, /<link[^>]+href="\/favicon\.svg"/);
});

test('新版首屏以品牌和真实价值为中心', async () => {
  const html = await readPage();
  assert.ok(!html.includes('CNplus · 中文编程语言'));
  for (const marker of [
    'class="hero-v2"',
    '让中文，成为编程的第一语言',
    '十分钟写出第一个程序',
    '错误信息会说人话',
    '借用 Python 生态',
    '顺着中文的习惯写',
  ]) assert.ok(html.includes(marker), `新版首页缺少：${marker}`);
  assert.doesNotMatch(html, /class="hero-logo"/);
  assert.ok(html.includes('href="#why-cnplus"'));
});

test('居中首屏在移动端不会按内容宽度撑破视口', async () => {
  const html = await readPage();
  const linkedCss = html.match(/href="\/_astro\/([^"]+\.css)"/);
  assert.ok(linkedCss, '新版页面应输出样式文件');
  const css = await readPage(`_astro/${linkedCss[1]}`);
  assert.match(css, /main>section\.hero-v2 h1\{[^}]*width:100%/);
  assert.match(css, /\.hero-lead\{[^}]*width:min\(760px,100%\)/);
  assert.ok(css.includes('overflow-x:clip'));
});

test('联系我们页提供论坛、邮箱和 Issue 三个渠道', async () => {
  const html = await readPage('contact/index.html');
  assert.match(html, /<html[^>]+lang="zh-CN"/);
  assert.match(html, /<h1>联系我们<\/h1>/);
  assert.ok(html.includes('contact@cnplus.org'));
  assert.ok(html.includes('https://forum.cnplus.org/category/5'));
  assert.ok(html.includes('https://forum.cnplus.org/category/10'));
  assert.ok(html.includes('https://github.com/CNplus/CNplus-lang'));
  assert.ok(html.includes('class="doc-page"'));
  assert.ok(html.includes('class="forum-links"'), '论坛板块应为并排按钮组');
  assert.ok(!html.includes('contact-list'), '不应再使用卡片按钮布局');
});

test('页脚导航包含联系入口', async () => {
  const html = await readPage('index.html');
  assert.match(html, /<a href="\/contact\/">联系<\/a>/);
  assert.ok(!html.includes('<a href="/download/">下载</a>'), '页脚不应再含下载入口');
});

test('联系我们页在 sitemap 中', async () => {
  const xml = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(xml.includes('https://cnplus.org/contact/'));
});

test('vsix 直链与当前稳定版本一致', async () => {
  const { site } = await import('../src/config/site.ts');
  assert.ok(site.links.vsix.includes(`v${site.version}`), `vsix 链接应指向 v${site.version}：${site.links.vsix}`);
  assert.ok(site.links.vsix.includes(`cnplus-${site.version}.vsix`), 'vsix 文件名应与版本一致');
  const sitemap = await readPage('sitemap.xml');
  assert.ok(!sitemap.includes('cnplus.org/download/'), 'sitemap 不应再含下载页');
});

test('删除的下载页永久重定向到 Wiki 教程开始篇', async () => {
  const redirects = await readPage('_redirects');
  assert.ok(redirects.includes('/download/ https://wiki.cnplus.org/教程/00-开始 301'), '应有 /download/ 301 到新教程路径');
  assert.ok(!redirects.includes('快速开始'), '重定向不应再指向已失效的快速开始');
});

test('quickStart 外链指向 wiki 教程开始篇', async () => {
  const { site } = await import('../src/config/site.ts');
  assert.equal(site.links.quickStart, 'https://wiki.cnplus.org/教程/00-开始');
});

test('Pages 安全响应头不把 HSTS 扩散到其他子域', async () => {
  const headers = await readPage('_headers');
  assert.ok(headers.includes('Strict-Transport-Security: max-age=15552000'));
  assert.ok(!headers.includes('includeSubDomains'));
  assert.ok(headers.includes('X-Content-Type-Options: nosniff'));
  assert.ok(headers.includes('X-Frame-Options: DENY'));
});
