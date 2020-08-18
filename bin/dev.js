const chokidar = require('chokidar');
const esbuild = require('esbuild');
const spawn = require('child_process').spawn;
const { debounce } = require('lodash');
const package = require('../package.json');
const { isNotNodeModulesWarning, log } = require('./lib');

const outfile = 'lib/index.js';

/**
 * @type {ReturnType<typeof spawn>}
 */
let retult = undefined;

(async function run() {
  const service = await esbuild.startService();

  const watch = async () => {
    try {
      const builded = await service.build({
        outfile,
        platform: 'node',
        entryPoints: ['src/index.ts'],
        logLevel: 'silent',
        format: 'cjs',
        bundle: true,
        external: Object.keys({ ...package.dependencies, ...package.devDependencies }),
        define: {
          'process.env.NODE_ENV': '"development"',
        },
      });

      const warnings = builded.warnings.filter(isNotNodeModulesWarning);

      if (warnings.length) return log(warnings);

      log.success('编译成功,监听文件变动...');

      retult?.kill();

      retult = spawn('node', [outfile, '-c', './config'], { stdio: 'inherit' });
      retult.addListener('error', console.log);
    } catch (err) {
      log.error(err);
    }
  };

  chokidar.watch(['src']).on('all', debounce(watch, 500));
})();
