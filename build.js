const esbuild = require('esbuild');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const entryPoints = [
  path.resolve(srcDir, 'index.ts'),
  path.resolve(srcDir, 'h.ts'),
  path.resolve(srcDir, 'h-repeat.ts'),
  path.resolve(srcDir, 'h-style.ts'),
];

esbuild.build({
  entryPoints,
  outdir: distDir,
  bundle: false,
  minify: true,
  sourcemap: true,
  format: 'esm',
  platform: 'browser',
});
