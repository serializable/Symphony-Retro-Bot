const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// sentiment.analyze(phrase, [options], [callback])
// options = {
//     extras: {
//         'cats': 5,
//         'amazing': 2
//     }
// }

const result = sentiment.analyze('Cats are stupid.');
// result = { 
//     score: -2,
//     comparative: -0.6666666666666666,
//     calculation: [ { stupid: -2 } ],
//     tokens: [ 'cats', 'are', 'stupid' ],
//     words: [ 'stupid' ],
//     positive: [],
//     negative: [ 'stupid' ] 
// }

// -5 < result.comparative < 5
console.log(result);

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
    .map(m => [m, sentiment.analyze(m).comparative])

console.log(result2)