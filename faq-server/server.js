const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const nlp = require('./nlp');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

let data = {
  'What is your name?': 'FAQ Bot!'
};

router.get('/answer', async (ctx) => {
  const { question } = ctx.request.query;

  if (!data[question]) {
    result = await nlp.askQuestion(question)
    console.log(result)
    if(result == "NA") {
        ctx.throw(404)
    }
    ctx.body = { question, answer: result };
    return;
  }

  ctx.body = { question, answer: data[question] };
});

router.post('/save', (ctx) => {
  const { question, answer } = ctx.request.body;

  data[question] = answer;

  console.log(data);

  ctx.body = { message: 'saved!' }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
