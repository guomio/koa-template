import { logger } from '../utils/logger';
import path from 'path';

export interface Setting {
  port: number;
}

let config = {} as Setting;
let inited = false;

export function init(argv: string[] = process.argv) {
  const options = parseOptions(argv);
  let configPath = options.config || process.env.ENV_CONFIG;

  if (!configPath) return logger.fatal('获取配置文件位置失败');

  try {
    logger.info('1/2 读取配置文件...');
    config = require(configPath);

    config.port = config.port || 80;

    logger.info('2/2 启动服务: ' + config.port);
    inited = true;
  } catch (err) {
    logger.fatal('配置文件未找到', configPath);
  }
}

export function settings() {
  return { ...config };
}

interface ParsedOptions {
  args: string[];
  config: string;
}

function parseOptions(argv: string[]): ParsedOptions {
  const args = argv.slice(0, 2);
  let config = '';

  const len = argv.length;

  for (let i = 2; i < len; i++) {
    const arg = argv[i];
    if (arg === '-c' || arg === '-config') {
      config = path.resolve(argv[++i]);
      continue;
    }
    if (!arg.startsWith('-')) {
      args.push(path.resolve(arg));
      continue;
    }
  }

  return { args, config };
}

export function isInited() {
  return inited;
}
