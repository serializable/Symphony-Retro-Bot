const Symphony = require('symphony-api-client-node');
const {fetchUrl} = require('fetch');

Symphony.setDebugMode(true);

const baseUrl = 'http://localhost:3000';

const admins = [
 349026222348203 // Chris B
];

let currentQuestion = null;

const getAnswer = (question, callback) => {
  const url = `${baseUrl}/answer?question=${question}`;
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
      callback(JSON.parse(body).answer);
  });
}

const saveAnswer = (question, answer) => {
  const url = `${baseUrl}/save`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify({ question, answer })
  };

  fetchUrl(
    url,
    options,
    (error, meta, body) => console.log('save status:', meta.status)
  )
}

const sendMessage = streamId => message => Symphony.sendMessage(streamId, message, null, Symphony.MESSAGEML_FORMAT)

const botHearsSomething = (event, messages) => {
  messages.forEach((message, index) => {
  if (admins.includes(message.user.userId)) {
    console.log("Got admin message")
    saveAnswer(currentQuestion, message.messageText);
  }
  else {
     currentQuestion = message.messageText;
     console.log("Message from user:", message.messageText);
     getAnswer(currentQuestion, sendMessage(message.stream.streamId));
  }
 })
}

Symphony.initBot(__dirname + '/config.json')
   .then((symAuth) => {
    Symphony.getDatafeedEventsService(botHearsSomething)
 })
