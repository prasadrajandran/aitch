const esbuild = require('esbuild');
const path = require('path');

const watch = process.argv[2] === '--watch';
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const entryPoints = [
  path.resolve(srcDir, 'index.ts'),
  path.resolve(srcDir, 'directives.ts'),
];
const buildOptions = {
  entryPoints,
  outdir: distDir,
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  platform: 'browser',
};

(async () => {
  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching build...');
  } else {
    const results = await esbuild.build(buildOptions);
    console.log(results);
  }
})();
