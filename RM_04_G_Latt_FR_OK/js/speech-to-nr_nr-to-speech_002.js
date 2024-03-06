//DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#IDmathResult');
const voiceSelect = document.querySelector('#IDvoiceSelect');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

const x = document.getElementById('IDValueX');
const y = document.getElementById('IDValueY');
const operator = document.getElementById('IDOperator');
const mathResult = document.getElementById('IDmathResult');

//Prefixed properties
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

//Defining the grammar
var numbers = Array(10000).fill().map((x, i) => i);
var grammar = '#JSGF V1.0; grammar numbers; public <numbers.digits> = ' + numbers.join(' | ') + ' ;';

//Instancing speech recognition and grammarlist
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

//Adding grammar list to the speech recognition
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

//Set speech recognition properties
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//Interface for speech synthesis
const synth = window.speechSynthesis;

//Loads in available voices into the drop-down menu
window.onload = fillVoicesList();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

//Listening event
document.getElementById('ButtonListen').addEventListener('click', () => {
    recognition.start();
    console.log('Listening...');
})

//Listening functions
recognition.onspeechend = () => {
    recognition.stop();
    console.log('Listening has stopped.')
};
recognition.onnomatch = () => {
    recognition.stop();
    document.getElementById("IDmathResult").innerHTML = "Je n'ai pas reconnu ce numéro. S'il vous plaît, donnez-moi un nouveau numéro !";
    //speak();
};
recognition.onerror = () => {
    recognition.stop();
    document.getElementById("IDmathResult").innerHTML = "Une erreur s'est produite lors de la reconnaissance.";
    textToSpeech();
    //speak();
};
recognition.onresult = (event) => {
    //catch results in variable
    const inputXStudent = event.results[0][0].transcript;

    //Select only the first index from the array
    let valueXStudent = inputXStudent.slice(0);

    //Result validation and filters
    valueXStudent.replace(',', '.');
    valueXStudent.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    //Pastes the X value into the formula
    document.getElementById('IDValueX').value = valueXStudent;


}

//Math functions
function calculateResult() {
    //Fetches the values from the input screen
    let valueX = parseFloat(x.value).toFixed(2);
    let valueY = parseFloat(y.value).toFixed(2);

    //Displaying result of the calculation
    mathResult.innerHTML = eval(valueX + operator.value + valueY);
    console.log(eval(valueX + operator.value + valueY));
}


//Text-to-speech
function textToSpeech() {
    //Get text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //catch speech error
    speakText.onerror = e => {
        console.error('Something went wrong');
    };

    //Apply selected voice
    let selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
        'data-name'
    );
    let selectedVoiceLang = voiceSelect.selectedOptions[0].getAttribute(
        'data-lang'
    );
    recognition.lang = selectedVoiceLang;

    // Loop through voices
    voices.forEach(voice => {
        if (voice.name === selectedVoice) {
            speakText.voice = voice;
        }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Speak
    synth.speak(speakText);

    console.log(voiceSelect.selectedOptions[0].getAttribute(
        'data-name'
    ));
}


//Get all available voices for text-to-speech
let voices = [];

//Functions for fetching all available voices from the current device
function getVoices() {
    return new Promise((resolve) => {
        setTimeout(() => {
            voices = synth.getVoices();
            resolve('resolved');
        }, 1000);
    });
}

async function fillVoicesList() {
    const result = await getVoices();

    // Loop through voices and create an option for each one
    voices.forEach(voice => {
        // Create option menu element
        const option = document.createElement('option');

        // Fill option menu with voice name and voice language
        option.textContent = voice.name + ' (' + voice.lang + ')';

        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });

    document.getElementById('IDvoiceSelect').selectedIndex = 138;

}



