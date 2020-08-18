const chalk = require('chalk');
const moment = require('moment');
const { execSync } = require('child_process');

exports.isNotNodeModulesWarning = function isNotNodeModulesWarning(location) {
  return !!(location && String(location.file).startsWith('node_modules'));
};

exports.log = function log(messages) {
  (messages || []).forEach((warning) => {
    const location = warning.location;
    console.log(
      chalk.bold(
        `\n${chalk.magentaBright('warning: ')}${location.file}:${location.line}:${
          location.column
        }: \n${warning.text}`,
      ),
    );
    const start = location.column;
    const end = location.column + location.length;
    const key = location.lineText.slice(start, end);
    console.log(
      location.lineText.slice(0, start) + chalk.bgRed(key) + location.lineText.slice(end),
    );
  });
};

exports.log.success = function success(...messages) {
  console.log(
    '[' + moment(Date.now()).format('YYYY-MM-DD hh:mm:ss') + '] ' + chalk.cyan(messages.join(' ')),
  );
};

exports.log.error = function error(...messages) {
  console.log(
    '[' +
      moment(Date.now()).format('YYYY-MM-DD hh:mm:ss') +
      ']: \n' +
      chalk.red(messages.join(' ')),
  );
};

function getExecOptions(cwd) {
  return cwd ? { stdio: 'pipe', cwd } : { stdio: 'pipe' };
}

exports.exec = function (app) {
  return function (opts, ...args) {
    const execOpts = typeof opts === 'string' ? getExecOptions(opts) : opts;
    const command = [app, ...args.filter(Boolean).map((a) => (a || '').trim())].join(' ');
    try {
      const out = execSync(command, execOpts);
      return [(out || '').toString().trim(), false];
    } catch (e) {
      return [`${e} (${command})`, true];
    }
  };
};
