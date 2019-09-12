const Symphony = require('symphony-api-client-node');
const {fetchUrl} = require('fetch');

Symphony.setDebugMode(true);

const baseUrl = 'http://localhost:3000';

const admins = [
 349026222348203 // Chris B
];

const sendAnswer = (question, callback) => {
  const url = `${baseUrl}/answer`;
  fetchUrl(
    url,
    (error, meta, body) => {
      console.log('error', error);
      console.log('meta', meta);
      console.log('body', body);
      if (meta.status === 404) {
         callback('Someone will get back to you soon');
         return;
      }
      callback(body.toString());
  });
}

const sendMessage = streamId => message => Symphony.sendMessage(streamId, message, null, Symphony.MESSAGEML_FORMAT)

const botHearsSomething = (event, messages) => {
  messages.forEach((message, index) => {
    if (admins.includes(message.user.userId)) {
      // TODO
    }
    else {
      currentQuestion = message.messageText;
      console.log("Message from user:", message.messageText);
      sendAnswer(currentQuestion, sendMessage(message.stream.streamId));
    }
  })
}

Symphony.initBot(__dirname + '/config.json')
   .then((symAuth) => {
    Symphony.getDatafeedEventsService(botHearsSomething)
 })
