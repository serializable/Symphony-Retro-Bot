const fs = require('fs');
const data = require('./training-data.json')

async function initTrain(manager) {
  if (fs.existsSync('./model.nlp')) {
    manager.load('./model.nlp');
    return;
  }

  const keys = Object.keys( data )

  // Adding Document
  for (var i = 0; i < keys.length; i++ ){
    const questions = data[keys[i]]['questions']
    for(var j = 0; j < questions.length; j++) {
        manager.addDocument('en', questions[j], keys[i]);
    }
  }

  await train(manager)

  // Adding answers
  for (var i = 0; i < keys.length; i++ ){
    if(data[keys[i]]['answer'] != ""){
        manager.addAnswer('en',  keys[i], data[keys[i]]['answer'])
    }
  }
  manager.save('./model.nlp', true);
}

async function reTrain(manager, key, question, answer) {
   manager.addDocument('en', question, key);
   await train(manager)
   manager.addAnswer('en', key, answer);
   manager.save('./model.nlp');
}

async function train(manager) {
  console.log('Training, please wait..');
  const hrstart = process.hrtime();
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  console.log('Trained!');
}

module.exports = {
    initTrain,
    reTrain
}