const { mkdirSync, existsSync, rmSync, cpSync } = require('fs');
const { resolve: resolvePath } = require('path');
const esbuild = require('esbuild');

const watch = process.argv[2] === '--watch';
const rootDir = __dirname;
const srcDir = resolvePath(rootDir, 'src');
const distDir = resolvePath(rootDir, 'dist');
const entryPoints = [
  resolvePath(srcDir, 'index.ts'),
  resolvePath(srcDir, 'directives.ts'),
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
const packageFiles = ['LICENSE', 'README.md', 'package.json'];

(async () => {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true });
    mkdirSync(distDir);
  }

  packageFiles.forEach((file) => {
    cpSync(resolvePath(rootDir, file), resolvePath(distDir, file));
  });

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching build...');
  } else {
    const results = await esbuild.build(buildOptions);
    console.log(results);
  }
})();
