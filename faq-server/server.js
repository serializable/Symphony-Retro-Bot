const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const nlp = require('./nlp');

const { archiveList, createCard, getBoardUrl } = require('./trello');

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

router.post('/publish', async (ctx) => {
  const { chatId } = ctx.request.body;

  if (!fs.existsSync('./model.nlp')) {
    ctx.throw(500, 'model should be trained first!');
  }
  const model = JSON.parse(fs.readFileSync('./model.nlp', 'utf8'));

  console.log(JSON.stringify(model));

  //const { responses: { en = {} } } = model;
  const { nluManager: { domainManagers: { en = {} }, extraSentences } } = model;


  // const list = en[chatId];

  // console.log(list);

  // await archiveList(chatId);

  // cards.forEach(async card => {
  //   await createCard(card);
  // });

  // const boardUrl = await getBoardUrl(chatId);

  // ctx.body = { boardUrl };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
