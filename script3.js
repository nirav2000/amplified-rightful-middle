import { sentences } from "./sentences.js";

let multiplayerEnabled = true;
let timerEnabled = true;
let grammarEnabled = false;
let playerTurn = 1;
let playerScores = { 1: 0, 2: 0 };
let timeLeft = 60;
let timer;

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
    const grammarTags = ["Pronoun", "Verb", "Article", "Noun"];
    return words.map((word, index) => `<span class="grammar">${word} (${grammarTags[index % grammarTags.length]})</span>`).join(" ");
}

function generateTenses(sentence) {
    let words = sentence.split(" ");
    let subject = words[0];
    let verb = words[1];
    let object = words.slice(2).join(" ");

    let past = verb + "ed"; 
    let pastParticiple = past;
    let presentParticiple = verb + "ing";

    if (verb.endsWith("e")) {
        presentParticiple = verb.slice(0, -1) + "ing";
    } else if (verb.match(/[^aeiou]y$/)) {
        past = verb.slice(0, -1) + "ied";
        pastParticiple = past;
    }

    return {
        "Past Simple": `${subject} <span class="highlight">${past}</span> ${object}.`,
        "Past Progressive": `${subject} was <span class="highlight">${presentParticiple}</span> ${object}.`,
        "Present Progressive": `${subject} is <span class="highlight">${presentParticiple}</span> ${object}.`,
        "Present Perfect": `${subject} has <span class="highlight">${pastParticiple}</span> ${object}.`,
        "Past Perfect": `${subject} had <span class="highlight">${pastParticiple}</span> ${object}.`,
        "Future Simple": `${subject} will <span class="highlight">${verb}</span> ${object}.`,
        "Future Progressive": `${subject} will be <span class="highlight">${presentParticiple}</span> ${object}.`,
        "Future Perfect": `${subject} will have <span class="highlight">${pastParticiple}</span> ${object}.`
    };
}

function startGame() {
    let randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    let tenses = generateTenses(randomSentence);

    let sentenceContainer = document.getElementById("sentences-container");
    let tenseContainer = document.getElementById("tenses-container");

    sentenceContainer.innerHTML = "";
    tenseContainer.innerHTML = "";
    document.getElementById("turn").textContent = multiplayerEnabled ? `Player ${playerTurn}'s Turn` : "";

    Object.entries(tenses).forEach(([tense, sentence]) => {
        let sentenceDiv = document.createElement("div");
        sentenceDiv.className = "card droppable";
        sentenceDiv.dataset.tense = tense;
        sentenceDiv.innerHTML = `${sentence}<br>${getGrammarTags(randomSentence)}`;
        sentenceDiv.ondrop = drop;
        sentenceDiv.ondragover = allowDrop;
        sentenceContainer.appendChild(sentenceDiv);
    });

    Object.keys(tenses).sort(() => Math.random() - 0.5).forEach(tense => {
        let tenseDiv = document.createElement("div");
        tenseDiv.className = "card draggable";
        tenseDiv.textContent = tense;
        tenseDiv.draggable = true;
        tenseDiv.ondragstart = drag;
        tenseDiv.id = tense;
        tenseContainer.appendChild(tenseDiv);
    });

    if (timerEnabled) {
        timeLeft = 60;
        document.getElementById("timer").style.display = "block";
        timer = setInterval(updateTimer, 1000);
    } else {
        document.getElementById("timer").style.display = "none";
    }
}

function updateTimer() {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        checkAnswers();
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let draggedTense = event.dataTransfer.getData("text");
    event.target.innerHTML += ` <span class="highlight">(${draggedTense})</span>`;
    event.target.dataset.selected = draggedTense;
}

function checkAnswers() {
    if (timerEnabled) clearInterval(timer);

    let droppables = document.querySelectorAll(".droppable");
    let correctCount = 0;
    let correctAnswers = [];

    droppables.forEach(dropBox => {
        let correctTense = dropBox.dataset.tense;
        let selectedTense = dropBox.dataset.selected;

        if (selectedTense === correctTense) {
            dropBox.classList.add("correct");
            correctCount++;
        } else {
            dropBox.classList.add("wrong");
            correctAnswers.push(`${dropBox.innerHTML} → <b>${correctTense}</b>`);
        }

        // Annotate correct tense within the sentence card
        dropBox.innerHTML += `<br><strong>(${correctTense})</strong>`;
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
