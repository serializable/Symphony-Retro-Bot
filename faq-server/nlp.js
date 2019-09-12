const { NlpManager } = require('node-nlp');
const trainNlp = require('./train-nlp');

const threshold = 0.5;
const nlpManager = new NlpManager({ languages: ['en'] });

trainNlp.initTrain(nlpManager);

async function askQuestion(question) {
  const result = await nlpManager.process(question);
  const answer =
    result.score > threshold && result.answer
      ? result.answer
      : "NA";
  return (`${answer}`);
}

async function train(key, question, answer) {
    await trainNlp.reTrain(nlpManager, key, question, answer)
    return;
}

module.exports = {
    askQuestion,
    train
}