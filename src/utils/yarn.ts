import { exec } from './exec';

const yarn = exec('yarn');

export function install(cwd: string) {
  return yarn(cwd);
}

export function run(cwd: string, ...argv: string[]) {
  return yarn(cwd, ...argv);
}
