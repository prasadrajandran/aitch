const esbuild = require('esbuild');
const path = require('path');

const watch = process.argv[2] === '--watch';
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const entryPoints = [
  path.resolve(srcDir, 'index.ts'),
  path.resolve(srcDir, 'h.ts'),
  path.resolve(srcDir, 'repeat.ts'),
  path.resolve(srcDir, 'style.ts'),
];

esbuild.build({
  entryPoints,
  outdir: distDir,
  bundle: false,
  minify: true,
  sourcemap: true,
  format: 'esm',
  platform: 'browser',
  watch,
});
