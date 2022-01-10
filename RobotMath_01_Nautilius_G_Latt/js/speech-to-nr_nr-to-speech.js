// ++++++++++++++++++++++++++++++ SPEECH TO NUMBER ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var numbers = [ '0', '1' , '2' , '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '45', '46', '47', '48'];
var grammar = '#JSGF V1.0; grammar numbers; public <numbers.digits> = ' + numbers.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
//// SEE AT LINE 276
//// recognition.lang = 'en-US';
//// recognition.lang = 'fr-FR';
//// recognize.lang = "en-GB";

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
numbers.forEach(function(v, i, a){
  //// console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});


function recognitionStart() {
  recognition.start();
  console.log('Ready to receive a number.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  var valueXstudentResult = event.results[0][0].transcript;
  valueXstudent = (valueXstudentResult.replace(",", "."));
  diagnostic.textContent = valueXstudent;
  bg.style.backgroundColor = valueXstudent;
  console.log('Confidence: ' + event.results[0][0].confidence);

  //// MATH - speech to math to result ////
  document.getElementById("IDvalueXstudentBig").innerHTML = valueXstudent;
  var operatorZteacher1 = document.getElementById('IDoperatorZteacher1').value;
  var valueZteacher1 = parseFloat(validate(document.getElementById("IDvalueZteacher1").value.trim()));
  var resultYrobot1 = operate1(valueXstudent, valueZteacher1, operatorZteacher1);

  var operatorZteacher2 = document.getElementById('IDoperatorZteacher2').value;
  var valueZteacher2 = parseFloat(validate(document.getElementById("IDvalueZteacher2").value.trim()));
  var resultYrobot1and2 = operate2(resultYrobot1, valueZteacher2, operatorZteacher2);
  var resultYrobot1and2Round = parseFloat(resultYrobot1and2).toFixed(2);
  //// verwijder .00 en .?0
  //// var a=strng.replace(/.00\s*$/, "");
  resultYrobot1and2Rounder = Math.round(((resultYrobot1and2Round * resultYrobot1and2Round) / resultYrobot1and2Round) * 100.) / 100.;
  //// console.log('line 58', resultYrobot1and2Round);
  
  /*
  function VoiceLangDetection(VoiceLangAction) {
  if (selectedVoiceLang === "fr-FR" || selectedVoiceLang === "nl-NL") {
  resultYrobot1and2RounderCorrect = (resultYrobot1and2Rounder.replace(".", ","));
  document.getElementById('IDtextInput').innerHTML = resultYrobot1and2RounderCorrect;
  setTimeout(function(){
  speak();
}, 2000);
} else if (selectedVoiceLang !== "fr-FR" || selectedVoiceLang !== "nl-NL") {
resultYrobot1and2RounderCorrect = resultYrobot1and2Rounder;
document.getElementById('IDtextInput').innerHTML = resultYrobot1and2RounderCorrect;
setTimeout(function(){
speak();
}, 2000);
}
VoiceLangAction();
}
*/

document.getElementById('IDtextInput').innerHTML = resultYrobot1and2Rounder;
setTimeout(function(){
  speak();
}, 2000);

}
/* ERROR [Deprecation] speechSynthesis.speak() without user activation is no longer allowed since M71, around December 2018. See https://www.chromestatus.com/feature/5687444770914304 for more details
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var beginText = "Hi, i am Nautilius, the first iteration from Robot Math. Please fill in the Operator and Number fields, then click Listen.";
document.getElementById('IDtextInput').innerHTML = beginText;
setTimeout(function(){
document.getElementById("ButtonSpeak").click();
}, 4000); // Wait x seconds
*/

recognition.onspeechend = function() {
  recognition.stop();
  document.getElementById("IDtextInput").innerHTML = "Please, give me a new number!";
  setTimeout(function(){
    speak();
    //// document.getElementById("ButtonSpeak").click();
    document.getElementById("ButtonListen").click();
  }, 2000); // Wait x seconds
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that number.";
  document.getElementById("IDtextInput").innerHTML = "I didn't recognise that number.";
  setTimeout(function(){
    speak();
    //// document.getElementById("ButtonSpeak").click();
  }, 2000); // Wait x seconds
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  document.getElementById("IDtextInput").innerHTML = 'Error occurred in recognition: ' + event.error;
  setTimeout(function(){
    speak();
    //// document.getElementById("ButtonSpeak").click();
  }, 2000); // Wait x seconds
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ SPEECH TO NUMBER ++++++++++++++++++++++++++++++++++ //


// ++++++++++++++++++++++++++++++ MATH ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
//// MATH operator 1 ////
// + before value is a way to convert a string to a number https://stackoverflow.com/questions/8377410/addition-is-not-working-in-javascript //
function operate1(valueXstudent, valueZteacher1, operatorZteacher1) {
  if (operatorZteacher1 == 'choose1') {
    alert("You must choose a first operator!");
  } else if (operatorZteacher1 == 'addition1') {
    return +valueXstudent + +valueZteacher1;
  } else if (operatorZteacher1 == 'subtraction1') {
    return +valueXstudent - +valueZteacher1;
  } else if (operatorZteacher1 == 'division1') {
    return +valueXstudent / +valueZteacher1;
  } else if (operatorZteacher1 == 'multiplication1') {
    return +valueXstudent * +valueZteacher1;
  }
}
//// MATH operator 2 ////
function operate2(resultYrobot1, valueZteacher2, operatorZteacher2) {
  if (operatorZteacher2 == 'choose2') {
    alert("You must choose a second operator!");
  } else if (operatorZteacher2 == 'addition2') {
    return +resultYrobot1 + +valueZteacher2;
  } else if (operatorZteacher2 == 'subtraction2') {
    return +resultYrobot1 - +valueZteacher2;
  }
}

//// VALIDATOR ////
function validate(value) {
  if (value == null || value == "") {
    alert("Required Field");
    return 0;
  } else if (isNaN(value)) {
    alert("Must be a Number");
    return 0;
  } else return value;
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ MATH ++++++++++++++++++++++++++++++++++ //


// ++++++++++++++++++++++++++++++ NUMBER TO SPEECH ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#IDtextInput');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

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
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    return;
  }
  if (textInput.value !== '') {
    // Add background animation
    body.style.background = 'url(./img/wave.gif)';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = '100% 160%';
    //// body.style.backgroundPosition = 'center 270px';
    body.style.background = 'rgb(24, 24, 24)';
    speech2number.style.backgroundColor = 'transparent';
    number2speech.style.backgroundColor = 'transparent';

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      //// body.style.backgroundImage = `linear-gradient(to right, #0acffe 0%, #495aff 100%)`;
      body.style.background = 'rgb(24, 24, 24)';
      speech2number.style.backgroundColor = 'rgb(47, 47, 47)';
      number2speech.style.backgroundColor = 'rgb(47, 47, 47)';
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );
    selectedVoiceLang = voiceSelect.selectedOptions[0].getAttribute(
      'data-lang'
    );
    recognition.lang = selectedVoiceLang;
    //// console.log('line 276', selectedVoiceLang);
    //// document.getElementById("voice=select").selectedIndex = 13; // Option Français

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
  }
};

// EVENT LISTENERS
//// HINTS ===> MAKEN IN ENGELS EN FRANS NAARGELANG DE GEKOZEN TAAL?
//// hints.innerHTML = 'Please fill in the "Operator" and "Number" fields, then click "Listen".';
IDtextInput.innerHTML = "Hi, i am a Robot that talks Math.";
setTimeout(function(){
  //// speak();
  //// document.getElementById("ButtonSpeak").click();
}, 4000); // Wait x seconds

// Text form submit
//// window.onload=function(){
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});
//// }

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ NUMBER TO SPEECH ++++++++++++++++++++++++++++++++++ //


// ++++++++++++++++++++++++++++++ TIPS ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ TIPS ++++++++++++++++++++++++++++++++++ //


// ++++++++++++++++++++++++++++++ TEST ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
//// AUTO CLICK TEST ! ////
/*
for ( let i = 0; i < 1; i++ ) {
document.getElementById("clickMe").click();
}

or

$(document).ready(function(){
$('#some-id').trigger('click');
});
*/
//// AUTO CLICK TEST ! ////
//// AUTO SPEAK TEST ! ////
//// https://stackoverflow.com/questions/1847893/js-events-hooking-on-value-change-event-on-IDtextInputs
// Put a first value
//////// document.getElementById("IDtextInput").value="Hi, i am Nautilius, the first iteration from Robot Math";
//// setTimeout(function(){
//// speak();
////}, 4000); // Wait x seconds

// Detect and 'remember' old value every x seconds
//// setInterval(function() { // Test if really needed
//// var oldVal = $('#IDtextInput').val();
//// //// setTimeout(function(){
// Your script that changes the value
// document.getElementById("IDtextInput").value="the first iteration from Robot Math";
////  if(oldVal != $('#IDtextInput').val())
////   {
// The value has changed, do something
//// console.log("Value was changed");
//// setTimeout(speak(), 2000);
//// }
//// }, 1000); // Wait x seconds
//// }, 2000); // Repeat every x seconds // Test if really needed

//// $("body").on('change propertychange input paste ', '#IDtextInput', function(){    // 3rd way
//// console.log("Value was changed again");
////  speak();
//// });

//// AUTO SPEAK TEST ! ////
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ TEST ++++++++++++++++++++++++++++++++++ //
