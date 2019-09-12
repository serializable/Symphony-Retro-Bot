const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const nlp = require('./nlp');

const faqChatMap = require('../faq-chat-map.json');

const { archiveList, createList, createCard, getBoardUrl } = require('./trello');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/answer', async (ctx) => {
  const { question } = ctx.request.query;

  result = await nlp.askQuestion(question)
  console.log(result)
  if(result.answer == "NA") {
      ctx.throw(404)
  }
  ctx.body = result;
});

const saveAddedData = (key, question, answer) => {
  if (!fs.existsSync('./added-data.json')) {
    const addedData = {
      [key]: {
        questions: [question],
        answer
      }
    }

    fs.writeFileSync('./added-data.json', JSON.stringify(addedData));
  }

  const addedData = JSON.parse(fs.readFileSync('./added-data.json', 'utf8'));
  addedData[key].questions.push(question);
  fs.writeFileSync('./added-data.json', JSON.stringify(addedData));
}

router.post('/save', async (ctx) => {
  const { key, question, answer } = ctx.request.body;

  await nlp.train(key, question, answer)

  saveAddedData(key, question, answer);

  ctx.body = { message: 'trained!' }
});

const capitalize = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
}

router.post('/publish', async (ctx) => {
  const { chatId } = ctx.request.body;

  const [ key ] = Object.entries(faqChatMap).find(([key, value]) => value.chatId === chatId);

  const [ board, list, _ ] = key.split('.');

  const hasAddedData = fs.existsSync('./addedData.json');

  const addedData = hasAddedData ? JSON.parse(fs.readFileSync('./addedData.json', 'utf8')) : {};
  const originalData = require('./training-data.json');

  const mergedData = Object.keys(addedData).reduce((acc, key) => {
    const added = addedData[key];

    if(acc[key]) {
      acc[key].questions = [ ...acc[key].questions, ...added[key].questions ];
      acc[key].answer = acc[key].answer || added[key].answer;
    }

    return acc;
  }, originalData);

  const l = Object.entries(mergedData).filter(([key, value]) => key.startsWith(`${board}.${list}`));

  await archiveList(board, list);

  const listId = await createList(board, list);

  const cards = l.map(([key, value]) => {
    return {
      name: capitalize(key.split('.')[2]),
      desc: `Answer: ${value.answer}\n\nQuestions: ${value.questions.join('\n\n')}`
    };
  });

  cards.forEach(async card => {
    await createCard(listId, card);
  });

  const boardUrl = await getBoardUrl(board);

  ctx.body = { boardUrl };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
