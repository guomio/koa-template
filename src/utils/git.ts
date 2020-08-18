import { exec } from './exec';

export const git = exec('git');

export function isInGitRepository(cwd: string) {
  return !git(cwd, 'rev-parse', '--is-inside-work-tree');
}

export function isClean(cwd: string) {
  return git({ stdio: 'pipe', cwd }, 'status', '-s');
}

/**
 * @param cwd
 * @param name tag名称
 * @param message 备注
 */
export function tag(cwd: string, name: string, message: string) {
  const out = git(cwd, 'tag', name, '-a', '-m', message);
  if (out[1]) return out;
  return git(cwd, 'push', 'origin', name);
}

export function prefix(cwd: string) {
  return git(cwd, 'rev-parse', '--show-prefix');
}

export function init(cwd: string) {
  return git(cwd, 'init');
}

export function remote(cwd: string, repository: string, auth: string) {
  repository = repository.replace('https://', 'https://' + auth + '@');
  return git(cwd, 'remote', 'add', '-f', 'origin', repository);
}

export function checkout(cwd: string, commitid: string, path?: string) {
  return git(cwd, 'checkout', commitid, path && `-- ${path}`);
}

export function add(cwd: string, path = '.') {
  return git(cwd, 'add', path);
}

export function commit(cwd: string, message: string) {
  return git(cwd, 'commit', '-m', message);
}

export function push(cwd: string) {
  return git(cwd, 'push');
}
