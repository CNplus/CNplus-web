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
