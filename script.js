import { sentences } from "./sentences3.js";

let multiplayerEnabled = false;
let timerEnabled = true;
let grammarEnabled = false;
let playerTurn = 1;
let playerScores = { 1: 0, 2: 0 };
let timeLeft = 120;
let timer;

let tenseCategories = {
        "Present": ["Present Simple", "Present Progressive", "Present Perfect", "Present Perfect Progressive"],
        "Past": ["Past Simple", "Past Progressive", "Past Perfect", "Past Perfect Progressive"],
        "Future": ["Future Simple", "Future Progressive", "Future Perfect", "Future Perfect Progressive"]
    };

document.getElementById("toggle-timer").addEventListener("change", (e) => {
    timerEnabled = e.target.checked;
});

document.getElementById("toggle-multiplayer").addEventListener("change", (e) => {
    multiplayerEnabled = e.target.checked;
    playerTurn = 1;
    playerScores = { 1: 0, 2: 0 };
    document.getElementById("turn").textContent = multiplayerEnabled ? `Player ${playerTurn}'s Turn` : "";
});

document.getElementById("toggle-grammar").addEventListener("change", (e) => {
    grammarEnabled = e.target.checked;
    document.querySelectorAll(".grammar").forEach(el => {
        el.style.display = grammarEnabled ? "inline" : "none";
    });
});

function getGrammarTags(sentence) {
    const words = sentence.split(" ");
    const grammarTags = {
        "I": "Pronoun",
        "he": "Pronoun", "she": "Pronoun", "they": "Pronoun",
        "plays": "Verb", "watch": "Verb", "cleans": "Verb", "paint": "Verb", "cooks": "Verb", "studies": "Verb", "listens": "Verb", "walk": "Verb",
        "the": "Article",
        "house": "Noun", "school": "Noun", "museum": "Noun", "party": "Noun", "piano": "Noun", "picture": "Noun", "dinner": "Noun", "music": "Noun",
    };

    return words.map(word => {
        const tag = grammarTags[word.toLowerCase()] || "Unknown";
        return `<span class="grammar">${word} (${tag})</span>`;
    }).join(" ");
}

function conjugateVerb(subject, verb) {
    let baseVerb = verb.toLowerCase(); 
    let past = baseVerb + "ed";
    let pastParticiple = past;
    let presentParticiple = baseVerb + "ing";
    
    // Adjust verb forms for special cases
    if (baseVerb.endsWith("e")) {
        presentParticiple = baseVerb.slice(0, -1) + "ing"; // remove "e" before "ing"
        past = baseVerb.slice(0, -1) + "ed"; // remove "e" before "ed"
    } else if (baseVerb.match(/[^aeiou]y$/)) {
        past = baseVerb.slice(0, -1) + "ied"; // "study" → "studied"
        pastParticiple = past;
    }

    // Present Simple: Add "s" for third-person singular (he, she, it)
    let presentSimple = baseVerb;
    if (["he", "she", "it"].includes(subject.toLowerCase())) {
        if (baseVerb.endsWith("y") && !["a", "e", "i", "o", "u"].includes(baseVerb[baseVerb.length - 2])) {
            presentSimple = baseVerb.slice(0, -1) + "ies"; // "cry" → "cries"
        } else if (baseVerb.endsWith("o") || baseVerb.endsWith("s") || baseVerb.endsWith("x") || baseVerb.endsWith("z") || baseVerb.endsWith("sh") || baseVerb.endsWith("ch")) {
            presentSimple = baseVerb + "es"; // "go" → "goes"
        } else {
            presentSimple = baseVerb + "s"; // "run" → "runs"
        }
    }

    return {
        base: baseVerb, 
        presentSimple: presentSimple,
        past: past,
        pastParticiple: pastParticiple,
        presentParticiple: presentParticiple
    };
}

function matchVerbToPronoun(subject, verb, tense) {
    let conjugation = conjugateVerb(subject, verb);

    switch (tense) {
        case "Present Simple":
            return (["he", "she", "it"].includes(subject.toLowerCase())) 
                ? conjugation.presentSimple 
                : conjugation.base;
        case "Present Progressive":
            return (["i"].includes(subject.toLowerCase())) 
                ? `am ${conjugation.presentParticiple}` 
                : (["he", "she", "it"].includes(subject.toLowerCase()))? `is ${conjugation.presentParticiple}` : `are ${conjugation.presentParticiple}`;
        case "Present Perfect":
            return (["he", "she", "it"].includes(subject.toLowerCase())) 
                ? `has ${conjugation.pastParticiple}` 
                : `have ${conjugation.pastParticiple}`;
        case "Present Perfect Progressive":
            return (["he", "she", "it"].includes(subject.toLowerCase())) 
                ? `has been ${conjugation.presentParticiple}` 
                : `have been ${conjugation.presentParticiple}`;

        case "Past Simple":
            return conjugation.past;
        case "Past Progressive":
            return (["i", "he", "she", "it"].includes(subject.toLowerCase())) 
                ? `was ${conjugation.presentParticiple}` 
                : `were ${conjugation.presentParticiple}`;
        case "Past Perfect":
        case "Past Perfect Progressive":
            return `had ${tense.includes("Progressive") ? "been " + conjugation.presentParticiple : conjugation.pastParticiple}`;

        case "Future Simple":
            return `will ${conjugation.base}`;
        case "Future Progressive":
            return `will be ${conjugation.presentParticiple}`;
        case "Future Perfect":
            return `will have ${conjugation.pastParticiple}`;
        case "Future Perfect Progressive":
            return `will have been ${conjugation.presentParticiple}`;

        default:
            return conjugation.base;
    }
}


function generateTenses(sentence, rootVerb="") {
  let words = sentence.split(" ");
    let subject = words[0];
    let verb = (rootVerb==""?words[1]:rootVerb);
    let object = words.slice(2).join(" ");
    let conjugation = conjugateVerb(subject, verb);

let generatedSentences = {};
Object.keys(tenseCategories).forEach((t)=>{
  tenseCategories[t].forEach((tense)=>{
    generatedSentences[tense] = `${subject} ${matchVerbToPronoun(subject, verb, tense)} ${object}`;  
  });
});
    console.log(generatedSentences);
  return generatedSentences;
}


function generateTensesOld(rootVerb="", sentence) {
    let words = sentence.split(" ");
    let subject = words[0];
    let verb = (rootVerb==""?words[1]:rootVerb);
    let object = words.slice(2).join(" ");

    let past = verb + "ed";
    let pastParticiple = past;
    let presentParticiple = verb + "ing";

    if (verb.endsWith("e")) {
        presentParticiple = verb.slice(0, -1) + "ing";
        past = verb.slice(0, -1) + "ed";
    } else if (verb.match(/[^aeiou]y$/)) {
        past = verb.slice(0, -1) + "ied";
        pastParticiple = past;
    }

    // Fix pronoun-verb agreement
    let baseVerb = verb.replace(/s$/, ""); // Remove incorrect "s"
    let singularVerb = baseVerb + (baseVerb.endsWith("s") ? "" : "s"); // He/she/it gets "s"
    let ingVerb = presentParticiple;

    //   // Fix pronoun-verb agreement
    // if (subject === "He" || subject === "She" || subject === "It") {
    //     verb = verb.endsWith("s") ? verb : verb + "s"; // Third-person singular adds "s"
    // } else if (subject === "I" || subject === "We" || subject === "They" || subject === "You") {
    //     verb = verb.replace(/s$/, ""); // Remove incorrect "s"
    // }

  
    return {
        "Present Simple": `${subject} <span class="highlight">${subject === "He" || subject === "She" || subject === "It" ? singularVerb : baseVerb}</span> ${object}.`,
        "Present Progressive": `${subject} is <span class="highlight">${ingVerb}</span> ${object}.`,
        "Present Perfect": `${subject} has <span class="highlight">${pastParticiple}</span> ${object}.`,
        "Present Perfect Progressive": `${subject} has been <span class="highlight">${ingVerb}</span> ${object}.`,

        "Past Simple": `${subject} <span class="highlight">${past}</span> ${object}.`,
        "Past Progressive": `${subject} was <span class="highlight">${ingVerb}</span> ${object}.`,
        "Past Perfect": `${subject} had <span class="highlight">${pastParticiple}</span> ${object}.`,
        "Past Perfect Progressive": `${subject} had been <span class="highlight">${ingVerb}</span> ${object}.`,

        "Future Simple": `${subject} will <span class="highlight">${baseVerb}</span> ${object}.`,
        "Future Progressive": `${subject} will be <span class="highlight">${ingVerb}</span> ${object}.`,
        "Future Perfect": `${subject} will have <span class="highlight">${pastParticiple}</span> ${object}.`,
        "Future Perfect Progressive": `${subject} will have been <span class="highlight">${ingVerb}</span> ${object}.`
    };
}


 

function startGame() {
  
    let randomSentenceObj = sentences[Math.floor(Math.random() * sentences.length)];
  // console.log(sentences, sentences[4], Math.floor(Math.random() * sentences.length), randomSentenceObj, randomSentenceObj["sentence"]);
    let randomSentence = randomSentenceObj["sentence"];
    let rootVerb = randomSentenceObj["rootVerb"];
  // console.log(randomSentence, rootVerb);
    let tenses = generateTenses(randomSentence, rootVerb);

    let sentenceContainer = document.getElementById("sentences-container");
    let tenseContainer = document.getElementById("tenses-container");

    sentenceContainer.innerHTML = "";
    tenseContainer.innerHTML = "";

    let shuffledSentences = Object.entries(tenses).sort(() => Math.random() - 0.5);

    shuffledSentences.forEach(([tense, sentence]) => {
        let sentenceDiv = document.createElement("div");
        sentenceDiv.className = "card droppable";
        sentenceDiv.dataset.tense = tense;
        sentenceDiv.innerHTML = `${sentence}<br>${getGrammarTags(randomSentence)}<br>`;
        sentenceDiv.ondrop = drop;
        sentenceDiv.ondragover = allowDrop;
        sentenceContainer.appendChild(sentenceDiv);
    });

    

    Object.entries(tenseCategories).forEach(([tenseGroup, tenses]) => {
        let categoryDiv = document.createElement("div");
        categoryDiv.className = "tense-category";
        categoryDiv.innerHTML = `<strong>${tenseGroup}</strong>`;

        tenses.forEach(fullTense => {
            let tenseDiv = document.createElement("div");
            tenseDiv.className = "card draggable tense-card";
            tenseDiv.textContent = fullTense;
            tenseDiv.draggable = true;
            tenseDiv.ondragstart = drag;
            tenseDiv.id = fullTense;
            categoryDiv.appendChild(tenseDiv);
        });

        tenseContainer.appendChild(categoryDiv);
    });
  document.querySelectorAll(".tense-card").forEach(makeDraggable);

    if (timerEnabled) {
        timeLeft = 120; // Set timer to 120 seconds
        document.getElementById("timer").style.display = "block";
        timer = setInterval(updateTimer, 1000);
    } else {
        document.getElementById("timer").style.display = "none";
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function dropNew(event) {
    event.preventDefault();

    let sentenceCard = event.target.closest(".sentence-card");
    let draggedElement = document.querySelector(".dragging");

    if (!sentenceCard || !draggedElement) return;

    let previousTenseCard = sentenceCard.querySelector(".tense-assigned");

    if (previousTenseCard) {
        // updateTenseCardHighlighting(previousTenseCard, draggedElement);
        previousTenseCard.classList.remove("tense-assigned");
    }

    // Assign new tense
    sentenceCard.appendChild(draggedElement);
    draggedElement.classList.add("tense-assigned");
    draggedElement.classList.remove("dragging");
}

function drop(event) {
    event.preventDefault();
  
  console.log("drop",event);
    let draggedTense = event.dataTransfer.getData("text");
  console.log('getData', draggedTense);
    let sentenceCard = event.target.closest(".droppable"); //previous card
  

    if (sentenceCard) {
        let previousTenseCard = sentenceCard.dataset.selectedTense;
        sentenceCard.classList.add("highlight"); // Highlight selection
        sentenceCard.dataset.selectedTense = draggedTense;

        let previousTense = sentenceCard.querySelector(".selected-tense");
        if (previousTense) {
            previousTense.remove();
          //
        }

        let tenseTag = document.createElement("span");
        tenseTag.className = "selected-tense";
        tenseTag.textContent = ` (${draggedTense})`;
        sentenceCard.appendChild(tenseTag);

        // Mark used tense card
        let usedTenseCard = document.getElementById(draggedTense);
        if (usedTenseCard) {
            usedTenseCard.classList.add("used-tense");
            if (previousTenseCard) {document.getElementById(previousTenseCard).classList.remove("used-tense")}
        }
    }
}

function drag(event) {event.dataTransfer.setData("text", event.target.id);}

function makeDraggable(element) {
    element.draggable = true;
    element.addEventListener("touchend", (event) => {
    console.log("Touch End", event);
    let draggedElement = document.querySelector(".dragging");
    let dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

    console.log("dropTarget", dropTarget);

    if (draggedElement.ghostElement) {
        document.body.removeChild(draggedElement.ghostElement);
    }

    if (dropTarget && dropTarget.classList.contains("droppable")) {
        // Remove previously assigned tense
        let previousTense = dropTarget.dataset.selectedTense;
        if (previousTense) {
            let previousTenseCard = document.getElementById(previousTense);
            if (previousTenseCard) previousTenseCard.classList.remove("used-tense");
        }

        // Assign new tense
        dropTarget.dataset.selectedTense = draggedElement.id;
        dropTarget.classList.add("highlight");

        // Add annotation
        let previousTenseTag = dropTarget.querySelector(".selected-tense");
        if (previousTenseTag) previousTenseTag.remove();

        let tenseTag = document.createElement("span");
        tenseTag.className = "selected-tense";
        tenseTag.textContent = ` (${draggedElement.id})`;
        dropTarget.appendChild(tenseTag);

        // Mark tense as used
        draggedElement.classList.add("used-tense");
    }

    draggedElement.classList.remove("dragging");
});
    // Mouse Drag Start
    element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text", event.target.id);
        event.target.classList.add("dragging");
    });

    // Touch Drag Start
    element.addEventListener("touchstart", (event) => {
        let touch = event.touches[0];
        let draggedElement = event.target;
        draggedElement.classList.add("dragging");

        // Store the ID for touch events
        draggedElement.setAttribute("data-drag-id", draggedElement.id);

        // Create a "ghost" element to simulate drag-and-drop behavior
        let ghost = draggedElement.cloneNode(true);
        ghost.style.position = "absolute";
        ghost.style.opacity = "0.7";
        ghost.style.pointerEvents = "none";
        ghost.style.zIndex = "9999";
        document.body.appendChild(ghost);
        draggedElement.ghostElement = ghost;
    });

    // Touch Move
    element.addEventListener("touchmove", (event) => {
        event.preventDefault(); // Prevent scrolling during drag

        let touch = event.touches[0];
        let draggedElement = document.querySelector(".dragging");
        let ghost = draggedElement.ghostElement;

        if (ghost) {
            ghost.style.left = `${touch.pageX - ghost.offsetWidth / 2}px`;
            ghost.style.top = `${touch.pageY - ghost.offsetHeight / 2}px`;
        }
    });

    // Touch End (Drop)
    element.addEventListener("touchend", (event) => {
      console.log("end", event);
      console.log("dragId", event.target.dataset.dragId);
        let draggedElement = document.querySelector(".dragging"); //why does this not exist?
        let dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

      console.log("dropTarget",dropTarget, draggedElement);
      
        if (draggedElement.ghostElement) {
            document.body.removeChild(draggedElement.ghostElement);
        }

        if (dropTarget && dropTarget.classList.contains("sentence-card")) {
            dropTarget.appendChild(draggedElement);
            draggedElement.classList.add("tense-assigned");
        }

        draggedElement.classList.remove("dragging");
      drop(event);
    });

    // Touch Cancel (For Edge Cases)
    element.addEventListener("touchcancel", () => {
        let draggedElement = document.querySelector(".dragging");
        if (draggedElement) draggedElement.classList.remove("dragging");
    });
}



function updateTimer() {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        checkAnswers();
    }
}


export function checkAnswers() {
  
//       let sentenceCards = document.querySelectorAll(".droppable");

//     sentenceCards.forEach(card => {
//         let correctTense = card.dataset.tense;
//         let selectedTense = card.dataset.selectedTense;
        
      
//       card.classList.remove("highlight");
//         if (selectedTense === correctTense) {
//             card.classList.add("correct");
//         } else {
//             card.classList.add("incorrect");
//         }
//     });

  
    if (timerEnabled) clearInterval(timer);

    let droppables = document.querySelectorAll(".droppable");
    let correctCount = 0;
    let correctAnswers = [];

    droppables.forEach(dropBox => {
        let correctTense = dropBox.dataset.tense;
        let selectedTense = dropBox.dataset.selectedTense;
dropBox.classList.remove("highlight");
        if (selectedTense === correctTense) {
            dropBox.classList.add("correct");
            correctCount++;
        } else {
            dropBox.classList.add("incorrect");
            correctAnswers.push(`${dropBox.innerHTML} → <b>${correctTense}</b>`);
        }

        // Annotate correct tense within the sentence card
        dropBox.innerHTML += `<strong>(${correctTense})</strong>`;
    });

    if (multiplayerEnabled) {
        playerScores[playerTurn] = correctCount;
        document.getElementById("score").textContent = `Player ${playerTurn} Score: ${correctCount}/8`;
        playerTurn = playerTurn === 1 ? 2 : 1;
        startGame();
    } else {
        document.getElementById("score").textContent = `Your Score: ${correctCount}/8`;
    }

    document.getElementById("correct-answers").innerHTML = `Correct Answers:<br>${correctAnswers.join("<br>")}`;
}

window.onload = startGame;

