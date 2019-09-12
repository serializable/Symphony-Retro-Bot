const Symphony = require('symphony-api-client-node');
const {fetchUrl} = require('fetch');
const faqChatMap = require('../faq-chat-map.json');

Symphony.setDebugMode(true);

const baseUrl = 'http://localhost:3000';

const admins = [
  349026222348203 // Chris B
];

const encodeId = id => id
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')

let currentQuestion = null;
let currentKey = null;

const getAnswer = (question, callback) => {
  const url = `${baseUrl}/answer?question=${encodeURIComponent(question)}`;
  fetchUrl(
    url,
    (error, meta, body) => {
      console.log('error', error);
      console.log('meta', meta);
      console.log('body', body);
      if (meta.status === 404) {
         //callback('Someone will get back to you soon');
          // should train the model here
         return;
      }
      const msg = JSON.parse(body);
      const answer = msg.answer;
      if (answer === "NA") {
        currentKey = msg.key;
        console.log("Awaiting answer from admin...", currentKey);
        return;
      }
      callback(msg.answer);
  });
}

const saveAnswer = (question, answer) => {
  const url = `${baseUrl}/save`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify({
      question,
      answer,
      key: currentKey
    })
  };

  fetchUrl(
    url,
    options,
    (error, meta, body) => console.log('save status:', meta.status)
  )
}

const isCommand = messageText => messageText.startsWith('/')

const handleCommand = message => {
  const [command, ...rest] = message.messageText.split(' ');
  switch (command) {
    case '/publish':
      publish(message);
      return;
    case '/chatId':
      chatId(message);
      return;
    default:
      sendMessage(message.stream.streamId)("Sorry, I don't recognise that command");
      return;
  }
}

const publish = message => {
  const url = `${baseUrl}/publish`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify({
      chatId: encodeId(message.stream.streamId)
    })
  };

  fetchUrl(
    url,
    options,
    (error, meta, body) => console.log('publish status:', meta.status)
  )
  sendMessage(message.stream.streamId)('would publish');
}

const chatId = message => {
  const streamId = message.stream.streamId;
  sendMessage(streamId)(encodeId(streamId));
}

const sendMessage =
  streamId =>
    messageText =>
      Symphony.sendMessage(streamId, messageText, null, Symphony.MESSAGEML_FORMAT)

const botHearsSomething = (event, messages) => {
  messages.forEach((message, index) => {
  if (isCommand(message.messageText)) {
    handleCommand(message);
    return;
  }

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
