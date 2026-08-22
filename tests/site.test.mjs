import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readPage = async (path = 'index.html') =>
  readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('首页使用中文并提供完整的主导航', async () => {
  const html = await readPage();

  assert.match(html, /<html[^>]+lang="zh-CN"/);
  assert.match(html, /<title>CNplus — 用中文表达程序<\/title>/);

  const expectedLinks = [
    ['首页', '/'],
    ['快速开始', 'https://wiki.cnplus.org/快速开始'],
    ['Wiki', 'https://wiki.cnplus.org/'],
    ['论坛', 'https://forum.cnplus.org/'],
    ['动态', 'https://forum.cnplus.org/category/2'],
    ['GitHub', 'https://github.com/CNplus/CNplus-lang'],
  ];

  for (const [label, href] of expectedLinks) {
    assert.match(html, new RegExp(`<a[^>]+href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>[^<]*${label}`));
  }
});

test('完整页面提供可核对的 CNplus 内容', async () => {
  const pages = ['download/index.html', 'learn/index.html', 'community/index.html', 'roadmap/index.html', 'about/index.html', '404.html'];
  for (const page of pages) assert.ok((await readPage(page)).includes('<main'));
  const home = await readPage();
  for (const fact of ['CNplus v0.7.2', 'Python 3.11+', 'Apache-2.0', 'lexer', 'parser', 'AST', '可插拔后端', 'Python 转译后端']) assert.ok(home.includes(fact), `缺少事实：${fact}`);
  for (const line of ['设 单价 = 15', '设 数量 = 4', '打印("总价：" + 文本(单价 * 数量) + " 元")']) assert.ok(home.includes(line), `缺少示例：${line}`);
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
  for (const route of ['download', 'learn', 'community', 'roadmap', 'about']) assert.ok(sitemap.includes(`https://cnplus.org/${route}/`));
  assert.ok((await readPage('robots.txt')).includes('Sitemap: https://cnplus.org/sitemap.xml'));
});

test('首屏中文标题保持平衡，主操作不会拉成整栏', async () => {
  const html = await readPage();
  const inlineCss = html.match(/<style>([\s\S]+?)<\/style>/);
  assert.ok(inlineCss, '首页应内联关键样式');
  assert.ok(inlineCss[1].includes('text-wrap:balance'));
  assert.ok(inlineCss[1].includes('white-space:nowrap'));
  assert.ok(inlineCss[1].includes('white-space:normal'));
  assert.ok(inlineCss[1].includes('width:fit-content'));
});
