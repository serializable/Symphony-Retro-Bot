require('dotenv').config();
const fs = require('fs');
const Mustache = require('mustache');

const template = fs.readFileSync('./config.json.mustache', 'utf8');

const data =  {
    botPath: process.env.BOT_PATH,
    botName: process.env.BOT_NAME,
    botPassword: process.env.BOT_PASSWORD,
    botPrivateKeyPath: process.env.BOT_PRIVATE_KEY_PATH,
    botPrivateKeyName: process.env.BOT_PRIVATE_KEY_NAME,
    botUsername: process.env.BOT_USERNAME,
    botEmailAddress: process.env.BOT_EMAIL_ADDRESS
}

const rendered = Mustache.render(template, data);

fs.writeFileSync('./config.json', rendered, 'utf8');

console.log('Build Successful!')

