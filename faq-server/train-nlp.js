const fs = require('fs');
const data = require('./training-data.json')

module.exports = async function trainnlp(manager) {
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

  console.log('Training, please wait..');
  const hrstart = process.hrtime();
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  console.log('Trained!');

  // Adding answers
  for (var i = 0; i < keys.length; i++ ){
     manager.addAnswer('en',  keys[i], data[keys[i]]['answer'])
  }

  manager.save('./model.nlp', true);
}