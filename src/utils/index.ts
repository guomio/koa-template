import moment from 'moment';

export const time = (format = 'YYYY-MM-DD hh:mm:ss') => moment(Date.now()).format(format);

export const isProduction = process.env.NODE_ENV === 'production';

export function uuid(): string {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, function () {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
}

export function isAbsolutePath(p = '') {
  return p.startsWith('/');
}
