notes = {};
async function genNotes(deckName, korean, english, audioUrl){
    let basic = 
    {
        "deckName": deckName,
        "modelName": "Basic",
        "fields": {
            "Front": korean,
            "Back": english
        },
        "audio": [{
            "url": audioUrl,
            "filename": `htsk${korean}.mp3`,
            "fields": [
                "Front"
            ]
        }]
    };
    let type = {
        "deckName": deckName,
        "modelName": "Basic (type in the answer)",
        "fields": {
            "Front": `${english} = `,
            "Back": korean
        },
        "audio": [{
            "url": audioUrl,
            "filename": `htsk${korean}.mp3`,
            "fields": [
                "Front"
            ]
        }]
    };
};