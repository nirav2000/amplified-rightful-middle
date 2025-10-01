const sentences = [
    "She plays the piano",
    "They watch a movie",
    "He cleans the house",
    "We visit the museum",
    "I paint a picture",
    "She cooks dinner",
    "They dance at the party",
    "He studies English",
    "We walk to school",
    "I listen to music"
];

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
        "Past Simple": `${subject} ${past} ${object}.`,
        "Past Progressive": `${subject} was ${presentParticiple} ${object}.`,
        "Present Progressive": `${subject} is ${presentParticiple} ${object}.`,
        "Present Perfect": `${subject} has ${pastParticiple} ${object}.`,
        "Past Perfect": `${subject} had ${pastParticiple} ${object}.`,
        "Future Simple": `${subject} will ${verb} ${object}.`,
        "Future Progressive": `${subject} will be ${presentParticiple} ${object}.`,
        "Future Perfect": `${subject} will have ${pastParticiple} ${object}.`
    };
}

function startGame() {
    let randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    let tenses = generateTenses(randomSentence);

    let sentenceContainer = document.getElementById("sentences-container");
    let tenseContainer = document.getElementById("tenses-container");

    sentenceContainer.innerHTML = "";
    tenseContainer.innerHTML = "";

    let shuffledTenses = Object.keys(tenses).sort(() => Math.random() - 0.5);

    Object.entries(tenses).forEach(([tense, sentence]) => {
        let sentenceDiv = document.createElement("div");
        sentenceDiv.className = "droppable";
        sentenceDiv.dataset.tense = tense;
        sentenceDiv.textContent = sentence;
        sentenceDiv.ondrop = drop;
        sentenceDiv.ondragover = allowDrop;
        sentenceContainer.appendChild(sentenceDiv);
    });

    shuffledTenses.forEach(tense => {
        let tenseDiv = document.createElement("div");
        tenseDiv.className = "draggable";
        tenseDiv.textContent = tense;
        tenseDiv.draggable = true;
        tenseDiv.ondragstart = drag;
        tenseDiv.id = tense;
        tenseContainer.appendChild(tenseDiv);
    });
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
    event.target.textContent += " (" + draggedTense + ")";
    event.target.dataset.selected = draggedTense;
}

function checkAnswers() {
    let droppables = document.querySelectorAll(".droppable");
    let correctCount = 0;

    droppables.forEach(dropBox => {
        if (dropBox.dataset.selected === dropBox.dataset.tense) {
            dropBox.style.backgroundColor = "lightgreen";
            correctCount++;
        } else {
            dropBox.style.backgroundColor = "lightcoral";
        }
    });

    document.getElementById("score").textContent = `Score: ${correctCount} / 8`;
}

window.onload = startGame;
