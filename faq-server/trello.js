
const fetch = require('node-fetch');

const boards = {
    'tech': '5d7a2bf2941b8728b268161b',
    'product-teams-support': '5d7a2c006f6095517737e1b0',
    'investment-staff-rooms': '5d7a2c0ed6dd76786b74b3f0',
};

const lists = {
    tech: {

    },
    product: {

    },
    staff: {

    }
};

const key = 'baa5d62ea0e25cc45901033d82f4bf65';
const token = 'e9575fc6d20bb13d64266bab9288d11dad7f7a15a20fe61798239dbe3627a518';

const query = {
    key,
    token
};

const archiveList = async (listId) => {
    const response = await fetch({
        method: 'POST',
        url: `https://api.trello.com/1/lists/${listId}/archiveAllCards${qs.stringify(query)}`
    });

    const body = await response.json();

    return body;
}

const createCard = async (listId, card) => {

    // card:
    // {
    //     name: '',
    //     desc: ''
    // }

    const queryString = {
        idList: listId || '5d7a19e97b7ae47c04e42690',
        keepFromSource: 'all',
        ...query,
        ...card
    };

    const response = await fetch({
        method: 'POST',
        url: `https://api.trello.com/1/cards${qs.stringify(queryString)}`
    });

    const body = await response.json();

    return body;
};

const getBoardUrl = async (boardsSlug) => {
    const response = await fetch({
        method: 'POST',
        url: `https://api.trello.com/1/boards/${boards[boardsSlug]}${qs.stringify(query)}`
    });

    const body = await reponse.json();

    return body.url;
}

module.exports = {
    archiveList,
    createCard,
    getBoardUrl,

};
