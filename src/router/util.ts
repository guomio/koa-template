import Router, { IMiddleware, IRouterParamContext } from 'koa-router';
import { ParameterizedContext } from 'koa';
import { logger } from '../utils/logger';
import compose from 'koa-compose';
import { isInited } from '../settings';

export interface State extends Record<string, any> {
  token: string;
}

const prefixs = new Set<string>();

export function createRouter(prefix: string) {
  if (prefixs.has(prefix)) logger.error('存在相同的路由prefix: ' + prefix);
  prefixs.add(prefix);

  const router = new Router({ prefix });
  router.use(initMiddleware, authMiddleware);
  return router;
}

export function createBasicRouter(prefix: string) {
  if (prefixs.has(prefix)) logger.error('存在相同的路由prefix: ' + prefix);
  prefixs.add(prefix);

  const router = new Router({ prefix });
  router.use(initMiddleware);
  return router;
}

export function createMiddlewareFactory<StateT extends Record<string, any> = {}, CustomT = {}>() {
  return (fn: IMiddleware<StateT & State, CustomT>) => fn;
}

export function createMiddleware<StateT extends Record<string, any> = {}, CustomT = {}>(
  fn: IMiddleware<StateT & State, CustomT>,
) {
  return fn;
}

export function combineRouters(...routers: Router[]) {
  return () => {
    const middleware: compose.Middleware<any>[] = [];

    routers.forEach((router) => {
      middleware.push(router.routes());
      middleware.push(router.allowedMethods());
    });

    return compose(middleware);
  };
}

export function response(
  ctx: ParameterizedContext<any, IRouterParamContext<any, {}>>,
  data: any,
  message?: any,
  ...errors: string[]
) {
  if (message) logger.error(message, ...errors);
  ctx.body = { code: message ? 400 : 200, data, message };
}

response.error = function (
  ctx: ParameterizedContext<any, IRouterParamContext<any, {}>>,
  message: any,
  ...errors: string[]
) {
  logger.error(message, ...errors);
  ctx.body = { code: 400, data: undefined, message };
};

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const token = ctx.request.header.token;
  if (!token) {
    ctx.status = 403;
    return response.error(ctx, 'unauthorized', 'token 不存在');
  }

  ctx.state.token = token;
  await next();
});

export const initMiddleware = createMiddleware(async (ctx, next) => {
  if (!isInited()) return response.error(ctx, '初始化中...');
  await next();
});
