const esbuild = require('esbuild');
const { isNotNodeModulesWarning, log } = require('./lib');

const outfile = 'lib/index.js';

(async function run() {
  const builded = await esbuild.build({
    outfile,
    platform: 'node',
    entryPoints: ['src/index.ts'],
    logLevel: 'silent',
    format: 'cjs',
    bundle: true,
    minify: true,
    external: [],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  const warnings = builded.warnings.filter(isNotNodeModulesWarning);

  if (warnings.length) return log(warnings);
  log.success('编译完成!');
})();
