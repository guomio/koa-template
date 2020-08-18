import { createRouter, createMiddlewareFactory, response } from './util';

const commit = createRouter('/commit');
const createMiddleware = createMiddlewareFactory<CommitState>();

interface CommitBody {
  appid: string;
}
interface CommitState extends Required<CommitBody> {
  cwd: string;
  name: string;
}

const commitMiddleware = createMiddleware(async (ctx, next) => {
  console.log(ctx.request);
  console.log(ctx.request.body);

  response(ctx, 'ok');
});

commit.post('/', commitMiddleware);

commit.get('/', commitMiddleware);

commit.delete('/', commitMiddleware);

commit.put('/', commitMiddleware);

export default commit;
