# Symphony-Retro-Bot

## install and run

1. Add `/rsa/` directory inside `/echo/`.
The .pem files live inside the `rsa` dir

2. Install Dependencies
```sh
$ cd echo
$ npm i
```

3. Configure
Then setup a new .env file with the following properties:

```sh
BOT_PATH=./rsa/
BOT_NAME=
BOT_PASSWORD=
BOT_PRIVATE_KEY_PATH=./rsa/
BOT_PRIVATE_KEY_NAME=
BOT_USERNAME=
BOT_EMAIL_ADDRESS=
```

4. Start
```js
$ npm start
```

## faq-server

####Query for an answer:
```sh
curl "http://localhost:3000/answer?question=Why%20is%20the%20sky%20blue%3F"
```
response (200):
```js
{"key":"life.facts", "question":"Why is the sky blue?","answer":"I dont know"}
```

####Save a question/answer pair:
```sh
curl -d '{"key":"life.facts", "question":"Why is the sky blue?", "answer":"I dont know"}' -H "Content-Type: application/json" -X POST http://localhost:3000/save
```
response (201):
```js
{"message":"saved!"}
```


## Dev env dependencies

### Node
node: v10.13.0
npm: 4.6.1

### yoeman
```js
npm install -g yo
```

### symphony bot generator
```js
npm install -g generator-symphony --cli
```

## Creating a new bot
[https://developers.symphony.com/symphony-developer/docs/symphony-generator](https://developers.symphony.com/symphony-developer/docs/creating-a-room-provisioning-bot-using-nodejs)

```js
mkdir mybotapp
cd mybotapp
yo symphony
```

This was also a good reference:
[https://developers.symphony.com/symphony-developer/docs/creating-a-room-provisioning-bot-using-nodejs](https://developers.symphony.com/symphony-developer/docs/creating-a-room-provisioning-bot-using-nodejs)


