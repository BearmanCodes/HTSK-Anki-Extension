import { getDeckNames, createDeck, createAllCards } from "./standReq.js";

async function nameCheck(deckName){
    const decks = await getDeckNames();
    if (decks.includes(deckName)) return;
    else return await createDeck(deckName);
}

async function escapedFunction(args){ //this is a function we can run within the bounds of the program and are not restricted to the html htsk page
   //args looks like [(str) deckName, (array) notesArray]
   await nameCheck(args[0]).catch(() => {
        alert("FAILED! Is Anki open with AnkiConnect installed?");
        return;
   }); //args[0] is the deckName.
   await createAllCards(args[1]).catch(() => {
        alert("FAILED! Is Anki open with AnkiConnect installed?");
        return;
    });; //args[1] is the master array of notes(cards)
   alert("Cards have been created!");
}

async function go(){
    $("#GO").click(() => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const tab = tabs[0];
            if (tab.url.indexOf("howtostudykorean.com") != -1){
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: () => {
                        var noteArray = [];
                        function genNotes(deckName, korean, english, audioUrl){
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
                                    "filename": `htsk(${korean}).mp3`,
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
                                    "filename": `htsk(${korean}).mp3`,
                                    "fields": [
                                        "Front"
                                    ]
                                }]
                            };
                            noteArray.push(basic);
                            noteArray.push(type);
                        };
                        let url = window.location.href;
                        var unit = url.split("/")[3] //Gets the unit name from the url of the page
                        var lesson = document.querySelector("#page-titlebar > div > h1").innerHTML; //Gets the lesson name from front heading on page
                        var deckName = `${unit}::${lesson}`;
                        let all_vocab = document.getElementsByClassName("play-button"); //Every piece of vocab has a play button next to it
                        for (let vocab of all_vocab){
                            let parentParagraph = vocab.parentNode; //Get every piece of vocab by the parent paragraph of the play button
                            if (parentParagraph.querySelector("a") != null && parentParagraph.querySelector("span") != null){ //Make sure the korean and english actually exist
                                var korean = parentParagraph.querySelector("a").textContent;
                                var english = parentParagraph.querySelector("span").textContent;
                                var audioUrl = parentParagraph.querySelector("a").href;
                                genNotes(deckName, korean, english, audioUrl); //So for each vocab word it generates a note template for the anki api to use, then adds it to a master noteArray which I return back to the main program
                            }
                        }
                        return [deckName, noteArray]; //These are the 2 things I want to return. The deckname for checking if the deck exists and either creating or not creating it, as well as the master noteArray which contains all of the cards that it needs to make.
                        //return `${deckName}, ${korean}, ${english}, ${audioUrl}`;
                    }, 
                    
                }, results => { //You can put a callback function here, HOW AM I JUST NOW FIGURING THIS OUT
                    let returnedVal = results[0].result; //So whatever you return in the injected function can be accessed from this.
                    /*You can probably return this to just use go() as a param. However for whatever voodoo reason I can't return it as normal so I'm just passing
                    this into another function since I can now operate within the file scope and not the html page*/
                    //nameCheck(returnedVal);
                    escapedFunction(returnedVal);
                })
            }
        })
    })
}

go();