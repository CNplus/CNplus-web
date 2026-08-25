import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('playground 页面已构建', async () => {
  const html = await readFile('dist/playground/index.html', 'utf8');
  assert.ok(html.includes('在线运行'), '页面标题');
  assert.ok(html.includes('id="code"'), '代码编辑区');
  assert.ok(html.includes('id="run"'), '运行按钮');
  assert.ok(html.includes('pyodide'), 'Pyodide 脚本引入');
});

test('playground 默认示例包含类语法', async () => {
  const html = await readFile('dist/playground/index.html', 'utf8');
  assert.ok(html.includes('类 学生'), '示例代码含类');
  assert.ok(html.includes('自己.分数'), '示例代码含自己');
});

test('cnplus wheel 已就位', async () => {
  const buf = await readFile('dist/pyodide/cnplus-1.0.0-py3-none-any.whl');
  assert.ok(buf.length > 50000, `wheel 太小: ${buf.length}`);
});

test('导航含在线运行入口', async () => {
  const html = await readFile('dist/playground/index.html', 'utf8');
  assert.ok(html.includes('/playground'), '导航链接');
});

async function readAllPlaygroundCss() {
  // playground.css 由 Astro 内联进页面 <style>；BaseLayout 的公共样式在外部 css
  const { readdir } = await import('node:fs/promises');
  let all = '';
  const html = await readFile('dist/playground/index.html', 'utf8');
  for (const m of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) all += m[1];
  const files = await readdir('dist/_astro');
  for (const f of files.filter(x => x.endsWith('.css'))) all += await readFile(`dist/_astro/${f}`, 'utf8');
  return all;
}

test('运行按钮具备点击反馈动画与运行态样式', async () => {
  const all = await readAllPlaygroundCss();
  assert.ok(/@keyframes\s+run-pulse/.test(all), '运行中呼吸光晕动画');
  assert.doesNotMatch(all, /@keyframes\s+spin/, '不应再有图标旋转动画');
  assert.ok(all.indexOf('run-icon') === -1, '不应再有 run-icon 旋转容器');
  assert.ok(/@keyframes\s+output-flash/.test(all), '输出区闪烁动画');
  assert.ok(all.includes('is-running'), '运行态类名');
  assert.ok(all.includes('is-fresh'), '输出刷新类名');
  assert.ok(all.includes('prefers-reduced-motion'), '动效尊重减少动画偏好');
});

test('输出区打字机效果', async () => {
  const html = await readFile('dist/playground/index.html', 'utf8');
  assert.ok(html.includes('打字输出'), '应包含打字输出函数');
  assert.ok(html.includes('prefers-reduced-motion'), '打字效果应尊重减少动画偏好');
});

test('首次加载用进度条占位编辑器，运行状态并入输出区', async () => {
  const html = await readFile('dist/playground/index.html', 'utf8');
  const all = await readAllPlaygroundCss();
  assert.ok(html.includes('id="loader"'), '应有加载占位区');
  assert.ok(html.includes('正在加载运行环境'), '加载占位区应有文案');
  assert.ok(/@keyframes\s+load-slide/.test(all), '进度条加载动画');
  assert.ok(/\.loader\[hidden\]\s*\{\s*display:\s*none/.test(all), 'hidden 时加载区必须隐藏');
  assert.ok(/\.panes\[hidden\]\s*\{\s*display:\s*none/.test(all), 'hidden 时编辑器面板必须隐藏（防 display:grid 压过 [hidden]）');
  assert.ok(html.includes('追加完成标记'), '完成提示应并入输出区');
  assert.ok(html.includes('class="run-done"') || html.includes("className = 'run-done'"), '完成标记样式钩子');
  assert.ok(!html.includes("状态.textContent = '运行中'"), '运行状态不再走工具栏状态条');
});

test('对不齐问题：hero 上下间距均匀且无分割线', async () => {
  const all = await readAllPlaygroundCss();
  const hero = all.match(/\.playground\s+\.hero\s*\{([^}]*)\}/);
  assert.ok(hero, 'playground hero 规则应存在');
  assert.ok(/padding-block:\s*24px/.test(hero[1]), 'hero 上下间距应拉匀为 24px');
  assert.ok(/border-bottom:\s*(none|0)/.test(hero[1]), 'hero 不应有底部分割线');
});

test('工具栏与编辑器布局紧凑且占满宽度', async () => {
  const all = await readAllPlaygroundCss();
  assert.ok(/\.panes\s*\{\s*grid-template-columns:\s*1fr\s+1fr/.test(all), '左右分栏保留');
  assert.ok(/min-height:\s*560px/.test(all), '编辑区更高（560px）');
  const hero = all.match(/\.playground\s+\.hero\s*\{([^}]*)\}/);
  assert.ok(hero, 'playground hero 规则应存在');
  assert.ok(all.includes('--play-w'), 'playground 布局变量');
});
