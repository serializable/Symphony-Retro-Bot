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

const getAnswer = (question, callback) => {
    const url = `${baseUrl}/answer?question=${question}`;
    fetchUrl(
        url,
        (error, meta, body) => {
            console.log('error', error);
            console.log('meta', meta);
            console.log('body', body);
            if (meta.status === 404) {
                callback("Sorry, I can't help with this question");
                return;
            }
            let response = JSON.parse(body);
            if (response.answer === "NA") {
              const chat = faqChatMap[response.key];
              const hashtag = chat && chat.chatName;
              if (hashTag) {
                callback("I don't know the answer, but try asking this in the room #" + hashtag);
              }
              else {
                callback("I don't know the answer");
              }
            }
            else
              callback(response.answer);
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
        if (message.stream.streamType !== 'IM') {
            return;
        }

        currentQuestion = message.messageText;
        console.log("Message from user:", message.messageText);
        getAnswer(currentQuestion, sendMessage(message.stream.streamId));
    })
}

Symphony.initBot(__dirname + '/config.json')
    .then((symAuth) => {
        Symphony.getDatafeedEventsService(botHearsSomething)
    })
