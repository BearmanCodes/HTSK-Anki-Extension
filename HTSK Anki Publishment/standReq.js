function invoke(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({action, version, params}));
    });
}

export async function getDeckNames(){
    let result = await invoke('deckNames', 6);
    return result;
}

export async function createDeck(deckName){
    let err = await invoke('createDeck', 6, {"deck": deckName});
    return err;
}

export async function createAllCards(notesArray){
    await invoke('addNotes', 6, {notes: notesArray});
}

var notesParams = {
    "notes": [
            {
                "deckName": ""/*grab unit from href and lesson from title*/,
                "modelName": "Basic",
                "fields": {
                    "Front": ""/*put korean word here*/,
                    "Back": /*put English translation here*/"back content"
                },
                "audio": [{
                    "url": /*put href of the korean word here*/"",
                    "filename": "htsk(koreanword).mp3",
                    "fields": [
                        "Front"
                    ]
                }]
            },
            {
                "deckName": ""/*grab unit from href and lesson from title*/,
                "modelName": "Basic (type in the answer)",
                "fields": {
                    "Front": ""/*put english translation  + = here*/,
                    "Back": /*put korean word  here*/"back content"
                },
                "audio": [{
                    "url": /*put href of the korean word here*/"",
                    "filename": "htsk(koreanword).mp3",
                    "fields": [
                        "Front"
                    ]
                }]
            }
        ]
    };

//getDeckNames();

//await invoke('addNotes', 6, {deck: 'test1'});
//const result = await invoke('deckNames', 6);
//console.log(`got list of decks: ${result}`);