const { NlpManager } = require('node-nlp');
const trainnlp = require('./train-nlp');

const threshold = 0.5;
const nlpManager = new NlpManager({ languages: ['en'] });

trainnlp(nlpManager);

async function askQuestion(question) {
  const result = await nlpManager.process(question);
  const answer =
    result.score > threshold && result.answer
      ? result.answer
      : "NA";
  let sentiment = '';
  if (result.sentiment.score !== 0) {
    sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   (${
      result.sentiment.score
    })`;
  }
  return (`${answer}${sentiment}`);
}

module.exports = {
    askQuestion
}