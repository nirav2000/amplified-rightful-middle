// (async function() {
//     const nlp = await import("https://unpkg.com/compromise?module");
//     console.log(nlp.default("She rides a bike.").json());
// })();

// function loadScript(url, callback) {
//     let script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = url;

//     script.onload = function () {
//         console.log(`Script loaded: ${url}`);
//         if (callback) callback();
//     };
// console.log('loading script...');
//     document.head.appendChild(script);
// }


      let sentences;
      async function fetchSentences() {
  const response = await fetch('sentences.json');
  const data = await response.json();
  sentences = data.sentences;
  // console.log("await: ", sentences, data, data.sentences[1]);
}

      
        function identifyGrammar(sentence) {
            const doc = nlp(sentence);
            const words = sentence.split(" ");

            // Manual rules for missing words
            const manualRules = {
                prepositions: ["to", "in", "on", "at", "by", "with", "about", "against", "between", "into", "through"],
                conjunctions: ["and", "or", "but", "so", "yet", "for", "nor"],
                determiners: ["this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their"]
            };

            function getWordClass(word) {
                word = word.toLowerCase();
                
                if (doc.match(word).has("#Pronoun")) return "pronoun";
                if (doc.match(word).has("#Verb")) return "verb";
                if (doc.match(word).has("#Noun")) return "noun";
                if (doc.match(word).has("#Adjective")) return "adjective";
                if (doc.match(word).has("#Adverb")) return "adverb";
                if (["the", "a", "an"].includes(word)) return "article";
                
                // Manual classification for words not caught by NLP
                if (manualRules.prepositions.includes(word)) return "preposition";
                if (manualRules.conjunctions.includes(word)) return "conjunction";
                if (manualRules.determiners.includes(word)) return "determiner";

                return "unknown"; // Default
            }

            // Generate HTML with highlighted words
            const html = words.map(word => {
                let wordClass = getWordClass(word);
                return `<span class="word ${wordClass}" title="${wordClass}">${word}</span>`;
            }).join(" ");

            return `<div class="sentence">${html}</div>`;
        }

        // Function to check a single word
        function checkWord() {
            const inputWord = document.getElementById("word-input").value.trim();
            if (inputWord === "") {
                document.getElementById("grammar-type").textContent = "---";
                return;
            }

            const doc = nlp(inputWord);
            let grammarType = "unknown"; // Default category

            if (doc.has("#Pronoun")) grammarType = "Pronoun";
            else if (doc.has("#Verb")) grammarType = "Verb";
            else if (doc.has("#Noun")) grammarType = "Noun";
            else if (doc.has("#Adjective")) grammarType = "Adjective";
            else if (doc.has("#Adverb")) grammarType = "Adverb";
            else if (["the", "a", "an"].includes(inputWord.toLowerCase())) grammarType = "Article";
            else if (["to", "in", "on", "at", "by", "with", "about", "against", "between", "into", "through"].includes(inputWord.toLowerCase())) grammarType = "Preposition";
            else if (["and", "or", "but", "so", "yet", "for", "nor"].includes(inputWord.toLowerCase())) grammarType = "Conjunction";
            else if (["this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their"].includes(inputWord.toLowerCase())) grammarType = "Determiner";

            document.getElementById("grammar-type").textContent = grammarType;
        }

        // Example Sentence Output
        // const sentenceHtml = identifyGrammar("She walks to the park and enjoys the weather.");
        // document.getElementById("output").innerHTML = sentenceHtml;
      
      window.onload = async ()=> {
  await fetchSentences();
        // Example: Load Compromise.js dynamically
// loadScript("https://unpkg.com/compromise", function () {
//     console.log("Compromise.js is ready!");
//     let doc = nlp("She walks to the park.");
//     console.log(doc.json()); // Now you can use the library


let a = identifyGrammar(sentences[Math.floor(Math.random() * sentences.length)]);
  document.getElementById("output").innerHTML = a;//sentences[2];
  // });
};
 
