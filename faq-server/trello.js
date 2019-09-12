const qs = require('qs');
const fetch = require('node-fetch');

const boards = {
    'tech': {
        id: '5d7a2bf2941b8728b268161b',
        lists: {
            'jetbrains': {
                name: 'Jet Brains'
            }
        }
    },
    'product': {
        id: '5d7a2c006f6095517737e1b0',
        lists: {
            'portfolio-management': {
                name: 'Portfolio Management'
            }
        }
    }
    // 'investment': '5d7a2c0ed6dd76786b74b3f0',
};

const key = 'baa5d62ea0e25cc45901033d82f4bf65';
const token = 'e9575fc6d20bb13d64266bab9288d11dad7f7a15a20fe61798239dbe3627a518';

const query = {
    key,
    token
};

const archiveList = async (boardKey, listKey) => {

    const boardId = boards[boardKey].id;

    const listResponse = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?${qs.stringify({ filter: 'open', cards: 'none', ...query })}`);

    if (!listResponse.ok) {
        console.error(listResponse);
    }

    const listBody = await listResponse.json();

    if (listBody.length === 0) {
        return;
    }

    const foundList = listBody.find(l => l.name === boards[boardKey].lists[listKey].name);

    const response = await fetch(`https://api.trello.com/1/lists/${foundList.id}/archiveAllCards?${qs.stringify(query)}`, {
        method: 'POST'
    });

    if (!response.ok) {
        console.error(response)
    }

    return foundList.id;
}

const createList = async (boardKey, listKey) => {

    // list:
    // {
    //     name: '',
    //     idBoard: ''
    // }

    const name = boards[boardKey].lists[listKey].name;
    const idBoard = boards[boardKey].id;
    const queryString = {
        ...query,
        name,
        idBoard
    };

    const response = await fetch(`https://api.trello.com/1/lists?${qs.stringify(queryString)}`, {
        method: 'POST'
    });

    if (!response.ok) {
        console.error(response);
    }

    const body = await response.json();

    return body.id;
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

    const response = await fetch(`https://api.trello.com/1/cards?${qs.stringify(queryString)}`, {
        method: 'POST'
    });

    if (!response.ok) {
        console.error(response);
    }
};

const getBoardUrl = async (boardKey) => {

    const url = `https://api.trello.com/1/boards/${boards[boardKey].id}?${qs.stringify(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
        console.error(response);
    }

    const body = await response.json();

    return body.url;
}

module.exports = {
    archiveList,
    createList,
    createCard,
    getBoardUrl,

};
