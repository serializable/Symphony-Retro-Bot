const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

let data = {
  'What is your name?': 'FAQ Bot!'
};

router.get('/answer', (ctx) => {
  const { question } = ctx.request.query;

  console.log(data);

  ctx.body = { question, answer: data[question] };
});

router.post('/save', (ctx) => {
  const { question, answer } = ctx.request.body;

  if (!data[question]) {
    data[question] = answer;
  }

  console.log(data);

  ctx.body = { message: 'saved!' }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
