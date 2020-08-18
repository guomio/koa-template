import Koa from 'koa';
import router from './router';
import logger from 'koa-logger';
import body from 'koa-body';
import { init, settings } from './settings';

init();

const app = new Koa();

app
  .use(logger())
  .use(body({ multipart: true }))
  .use(router());

app.listen(settings().port);
