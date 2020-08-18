import chalk from 'chalk';
import moment from 'moment';

const time = () => '[' + moment(Date.now()).format('YYYY-MM-DD hh:mm:ss') + '] ';

function logspace(w: string) {
  console.log('    ' + w);
}

export function logger(message: string, ...logs: string[]) {
  console.log(time() + chalk.blue(message));
  logs.forEach(logspace);
}

logger.error = function (message: string, ...logs: string[]) {
  console.log(time() + chalk.red(message));
  logs.forEach(logspace);
};

logger.info = function (message: string, ...logs: string[]) {
  console.log(time() + chalk.cyan(message));
  logs.forEach(logspace);
};

logger.fatal = function (message: string, ...logs: string[]) {
  console.log(time() + chalk.cyan(message));
  logs.forEach(logspace);
  process.exit(0);
};
