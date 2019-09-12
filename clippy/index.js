const Symphony = require('symphony-api-client-node')
Symphony.setDebugMode(true)

const botHearsSomething = (event, messages) => {
  messages.forEach((message, index) => {
    console.log('message', message.messageText);
    if (message.stream.streamType === 'IM') {
        let reply_message = 'Hello ' + message.user.firstName + ', you said, "' + message.messageText + '"';
        Symphony.sendMessage(message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT)
    }
  })
}

Symphony.initBot(__dirname + '/config.json')
  .then((symAuth) => {
    Symphony.getDatafeedEventsService(botHearsSomething)
  })



/*{ messageId: 'bJDA1pgxkgXJS-uyO9hP6n___pLa_OxDbQ',
    timestamp: 1568284021692,
    message:
    '<div data-format="PresentationML" data-version="2.0" class="wysiwyg"><p>test direct</p></div>',
        data: '{}',
        user:
    { userId: 349026222348202,
        firstName: 'dan',
        lastName: 'balla',
        displayName: 'dan balla',
        email: 'daniel_balla@troweprice.com',
        username: 'daniel_balla@troweprice.com' },
    stream:
    { streamId: 'tkRSRVbgj9OHvUAbP4ho6H___pLa_YDgdA',
        streamType: 'IM' },
    externalRecipients: false,
        userAgent: 'DESKTOP-40.0.0-10665-Windows-10-Chrome-75.0.3770.142',
        originalFormat: 'com.symphony.messageml.v2',
        messageText: 'test direct' }
*/