const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const nlp = require('./nlp');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/answer', async (ctx) => {
  const { question } = ctx.request.query;

  result = await nlp.askQuestion(question)
  console.log(result)
  if(result == "NA") {
      ctx.throw(404)
  }
  ctx.body = { question, answer: result };
});

router.post('/save', (ctx) => {
  const { question, answer } = ctx.request.body;

  // TODO train NLP

  ctx.body = { message: 'trained!' }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);