import { execSync, ExecSyncOptions } from 'child_process';

function getExecOptions(cwd?: string): ExecSyncOptions {
  return cwd ? { stdio: 'pipe', cwd } : { stdio: 'pipe' };
}

export function exec(app: string) {
  return function (
    opts?: ExecSyncOptions | string,
    ...args: (string | false | undefined)[]
  ): [string, boolean] {
    const execOpts = typeof opts === 'string' ? getExecOptions(opts) : opts;
    const command = [app, ...args.filter(Boolean).map((a) => (a || '').trim())].join(' ');
    try {
      const out = execSync(command, execOpts);
      return [(out || '').toString().trim(), false];
    } catch (e) {
      return [`${e} (${command})`, true];
    }
  };
}
