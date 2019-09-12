const Symphony = require('symphony-api-client-node')
Symphony.setDebugMode(true)

const admins = [
  349026222348203 // Chris B
];
const responses = {};

let currentQuestion = '';

const botHearsSomething = (event, messages) => {
  messages.forEach((message, index) => {
    if (admins.includes(message.user.userId)) {
      responses[currentQuestion] = message.messageText
    }
    else {
      currentQuestion = message.messageText
      console.log("Message from user:", message.messageText)
      if (responses[currentQuestion]) {
        Symphony.sendMessage(message.stream.streamId, responses[currentQuestion], null, Symphony.MESSAGEML_FORMAT)
      }
    }
  })
}

Symphony.initBot(__dirname + '/config.json')
  .then((symAuth) => {
    Symphony.getDatafeedEventsService(botHearsSomething)
  })
