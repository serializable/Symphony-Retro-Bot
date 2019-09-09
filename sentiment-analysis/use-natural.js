const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;
const Tokenizer = require('natural').TreebankWordTokenizer;

const analyzer = new Analyzer('English', stemmer, 'afinn');
const tokenizer = new Tokenizer()

console.log(analyzer.getSentiment(tokenizer.tokenize('Cats are stupid')))

const messages = [
    "I'm glad we're using Symphony",
    'Can someone reply to Maria?',
    'Deploying to dev',
    'Arghhhhh! I hate how long these builds take',
    'Yeah they are really slow',
    'Good work with the UI Roger',
    'Yeah it looks awesome!',
    'Thanks for covering for me',
    'Sorry I was late, my dog ate my homework',
    'Feel free to help yourself to the doughnuts on the desk',
]

const result2 = messages
    .map(m => [m, analyzer.getSentiment(tokenizer.tokenize(m))])

console.log(result2)