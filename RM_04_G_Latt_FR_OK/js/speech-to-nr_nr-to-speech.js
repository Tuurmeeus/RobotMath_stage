// ++++++++++++++++++++++++++++++ SPEECH TO NUMBER ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


var numbers = Array(10000).fill().map((x,i)=>i);
var grammar = '#JSGF V1.0; grammar numbers; public <numbers.digits> = ' + numbers.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

///recognition.continuous = false;
//// SEE AT LINE 276
//recognition.lang = 'en-US';
////recognition.lang = 'fr-FR';
//// recognize.lang = "en-GB";

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

/** var colorHTML= '';
numbers.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
}); **/


function recognitionStart() {
  recognition.start();
  console.log('01', 'Ready to receive a number.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var valueXstudentResultWithPoint = event.results[0][0].transcript;
  valueXstudentResult = valueXstudentResultWithPoint.slice(0, -1);
  console.log('02', valueXstudentResult);

  diagnostic.textContent = valueXstudentResult;
  bg.style.backgroundColor = valueXstudentResult;
  console.log('Confidence: ' + event.results[0][0].confidence);

  document.getElementById("IDvalueXstudentBig").innerHTML = valueXstudentResult;

  // ++++ RESULT VALIDATION AND FILTERS ++++ //
  valueXstudent = (valueXstudentResult.replace(",", "."));
    console.log('03', valueXstudent);

  //// BEGIN zero/Zero/ZERO detection to 0 ////
  /// var stringResultLast = stringResultEval;
  //// zéro to zero OR other not good converted numbers
  var valueXstudentNormalise = valueXstudent.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  console.log('04', valueXstudentNormalise);

  //// var pattern1 = /zero/i;
  //// var stringResultLast1 = valueXstudentNormal.match(pattern1);
  var stringResultLast1 = valueXstudentNormalise;
  console.log('05', stringResultLast1);

if (stringResultLast1 == "zero" || stringResultLast1 == "Zéro" || stringResultLast1 == "Zero" || stringResultLast1 == "ZERO" || stringResultLast1 == "Nul") {
    stringResultLast2 = 0;
    } else if (stringResultLast1 == "one" || stringResultLast1 == "Un" || stringResultLast1 == "Une") {
      stringResultLast2 = 1;
      } else if (stringResultLast1 == "seven" || stringResultLast1 == "Sept" || stringResultLast1 == "C'est" || stringResultLast1 == "Cette") {
        stringResultLast2 = 7;
      } else if (stringResultLast1 == "twelve" || stringResultLast1 == "Douze" || stringResultLast1 == "Douce" || stringResultLast1 == "Douces" || stringResultLast1 == "Tous") {
        stringResultLast2 = 12;
      } else if (stringResultLast1 == "thirteen" || stringResultLast1 == "Treize" || stringResultLast1 == "Tresse" || stringResultLast1 == "Triste" || stringResultLast1 == "Très" || stringResultLast1 == "très") {
        stringResultLast2 = 13;
      } else if (stringResultLast1 == "seventeen" || stringResultLast1 == "Dix-sept" || stringResultLast1 == "Dis-sept") {
        stringResultLast2 = 17;
      } else if (stringResultLast1 == "eighteen" || stringResultLast1 == "Dix-huit" || stringResultLast1 == "Dis-huit") {
        stringResultLast2 = 18;
      } else if (stringResultLast1 == "nineteen" || stringResultLast1 == "Dix-neuf" || stringResultLast1 == "Dis-neuf") {
        stringResultLast2 = 19;
      } else if (stringResultLast1 == "seventy" || stringResultLast1 == "Soixante-dix" || stringResultLast1 == "Septante") {
        stringResultLast2 = 70;
      } else if (stringResultLast1 == "hundred" || stringResultLast1 == "Cent" || stringResultLast1 == "Son" || stringResultLast1 == "Sont" || stringResultLast1 == "Sans") {
        stringResultLast2 = 100;
      } else if (stringResultLast1 == "one hundred twelve" || stringResultLast1 == "Cent douze" || stringResultLast1 == "Sans douze" || stringResultLast1 == "Sans douce" || stringResultLast1 == "Sans douces") {
        stringResultLast2 = 112;
      } else if (stringResultLast1 == "point" || stringResultLast1 == "Point" || stringResultLast1 == " point " || stringResultLast1 == "Virgule") {
        stringResultLast2 = ".";
      } else {
        stringResultLast2 = stringResultLast1;
      }
      console.log('06', stringResultLast2);

 //// END zero/Zero/ZERO detection -> 0 ////

/*
function validateNan(stringResultLast2){
 if (stringResultLast2 == null || stringResultLast2 == "") {
     document.getElementById("IDmathResult").innerHTML = "Je n'ai pas reconnu ce numéro. S'il vous plaît, donnez-moi un nouveau numéro !";
     setTimeout(function(){
       //// recognition.stop();
     speak();
   }, 1000); // Wait x seconds
     setTimeout(function(){
       recognition.start();
   }, 2900); // Wait x seconds
 } else if (isNaN(stringResultLast2)) {
     document.getElementById("IDmathResult").innerHTML = "Je n'ai pas reconnu ce numéro. S'il vous plaît, donnez-moi un nouveau numéro !";
     setTimeout(function(){
       //// recognition.stop();
     speak();
   }, 1000); // Wait x seconds
     setTimeout(function(){
       recognition.start();
   }, 2900); // Wait x seconds
 } else return stringResultLast2;
 }
 console.log('07', stringResultLast2);

 validateNan();
*/


    // ++++ RESULT VALIDATION AND FILTERS ++++ //

  // ++++++++++++++++++++++++++++++ MATH ++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  function mathResult(){

    if (parseInt(stringResultLast2)) {
        console.log("It's a INT number");
        document.getElementById("IDmathResult").innerHTML = "It's a INT number";
        stringResultLastNumber = stringResultLast2;
    } else if (parseFloat(stringResultLast2)) {
      console.log("It's a FLOAT number");
      document.getElementById("IDmathResult").innerHTML = "It's a FLOAT number";
      stringResultLastNumber = stringResultLast2;
    } else {
        console.log("It's not a number");
        document.getElementById("IDmathResult").innerHTML = "It's not a number";
    }

    document.getElementById("IDvalueTeacher1").value = stringResultLastNumber;

    //// var valueTeacher1 = document.getElementById('IDvalueTeacher1').value;
    var valueTeacher1 = stringResultLastNumber;
    console.log('08', valueTeacher1);

    var operatorTeacher1 = document.getElementById('IDoperatorTeacher1').value;
    var valueTeacher2 = document.getElementById('IDvalueTeacher2').value;

    //// document.getElementById('result').innerHTML = parseFloat(value1) + parseFloat(value2);

    var valueTeacher1Num = parseFloat(valueTeacher1).toFixed(2);
    var valueTeacher2Num = parseFloat(valueTeacher2).toFixed(2);

    var mathResultResult = valueTeacher1Num + ' ' + operatorTeacher1 + ' ' + valueTeacher2Num;
    console.log(mathResultResult);

    //// take out anything other than digits, (), -+/* and . https://stackoverflow.com/questions/6479236/calculate-string-value-in-javascript-not-using-eval
   var mathResultReplace = mathResultResult.replace(/[^-()\d/*+.]/g, '');
   console.log('line 112', mathResultReplace);

   //// OUTPUT to SPEAK with "zero" detection
   var mathResultEvalParse = eval(mathResultReplace);
   console.log('line 128', mathResultEvalParse);

   var mathResultEval = parseFloat(mathResultEvalParse).toFixed(2).replace(/\.0+$/,'');
   console.log('line 131', mathResultEval);

   document.getElementById('IDmathResult').innerHTML = mathResultEval;

    //// MISSCHIEN NOG NODIG ////
    //// resultYrobot1and2Rounder = Math.round(((resultYrobot1and2Round * resultYrobot1and2Round) / resultYrobot1and2Round) * 100.) / 100.;
  }

  //// VALIDATOR //// ! OPNIEUW INSTELLEN INDIEN BOVENSTAANDE WERKT !
  /*
  function validate(value) {
    if (value == null || value == "") {
      alert("Required Field");
      return 0;
    } else if (isNaN(value)) {
      alert("Must be a Number");
      return 0;
    } else return value;
    }
  */
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++ MATH ++++++++++++++++++++++++++++++++++ //

  //// DO THE MATH (function) ////
  mathResult();

  //// document.getElementById('IDmathResult').innerHTML = stringResultEval;
  setTimeout(function(){
    speak();
  }, 1000);
  setTimeout(function(){
    recognitionStart();
  }, 4000);
}
/* ERROR [Deprecation] speechSynthesis.speak() without user activation is no longer allowed since M71, around December 2018. See https://www.chromestatus.com/feature/5687444770914304 for more details
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var beginText = "Hi, i am Nautilius, the first iteration from Robot Math. Please fill in the Operator and Number fields, then click Listen.";
document.getElementById('IDmathResult').innerHTML = beginText;
setTimeout(function(){
document.getElementById("ButtonSpeak").click();
}, 4000); // Wait x seconds
*/

recognition.onspeechend = function() {
  recognition.stop();
}
recognition.onnomatch = function(event) {
    recognition.stop();
  document.getElementById("IDmathResult").innerHTML = "Je n'ai pas reconnu ce numéro. S'il vous plaît, donnez-moi un nouveau numéro !";
  speak();
}
recognition.onerror = function(event) {
    recognition.stop();
  document.getElementById("IDmathResult").innerHTML = "Une erreur s'est produite lors de la reconnaissance." /* + event.error */;
  speak();
}

/* ***
recognition.onspeechend = function() {
  recognition.stop();
  setTimeout(function(){
    document.getElementById("IDmathResult").innerHTML = "S'il vous plaît, donnez-moi un nouveau numéro !";
    //////// speak();
    //// document.getElementById("ButtonSpeak").click();
    recognition.start();
  }, 8000); // Wait x seconds
}

recognition.onnomatch = function(event) {
  recognition.stop();
  diagnostic.textContent = "Je n'ai pas reconnu ce numéro.";
  setTimeout(function(){
    document.getElementById("IDmathResult").innerHTML = "Je n'ai pas reconnu ce numéro.";
    speak();
    //// document.getElementById("ButtonSpeak").click();
  }, 4000); // Wait x seconds
}

recognition.onerror = function(event) {
  recognition.stop();
  diagnostic.textContent = "Une erreur s'est produite lors de la reconnaissance : " + event.error;
  document.getElementById("IDmathResult").innerHTML = "Une erreur s'est produite lors de la reconnaissance : " + event.error;
  setTimeout(function(){
    speak();
    //// document.getElementById("ButtonSpeak").click();
  }, 4000); // Wait x seconds
}
*** */
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ SPEECH TO NUMBER ++++++++++++++++++++++++++++++++++ //



// ++++++++++++++++++++++++++++++ NUMBER TO SPEECH ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#IDmathResult');
const voiceSelect = document.querySelector('#IDvoiceSelect');
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
IDmathResult.innerHTML = "Bonjour, je suis un robot qui parle les maths.";
setTimeout(function(){
  document.getElementById('IDvoiceSelect').selectedIndex = 159;
  speak();
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
//// https://stackoverflow.com/questions/1847893/js-events-hooking-on-value-change-event-on-IDmathResults
// Put a first value
//////// document.getElementById("IDmathResult").value="Hi, i am Nautilius, the first iteration from Robot Math";
//// setTimeout(function(){
//// speak();
////}, 4000); // Wait x seconds

// Detect and 'remember' old value every x seconds
//// setInterval(function() { // Test if really needed
//// var oldVal = $('#IDmathResult').val();
//// //// setTimeout(function(){
// Your script that changes the value
// document.getElementById("IDmathResult").value="the first iteration from Robot Math";
////  if(oldVal != $('#IDmathResult').val())
////   {
// The value has changed, do something
//// console.log("Value was changed");
//// setTimeout(speak(), 2000);
//// }
//// }, 1000); // Wait x seconds
//// }, 2000); // Repeat every x seconds // Test if really needed

//// $("body").on('change propertychange input paste ', '#IDmathResult', function(){    // 3rd way
//// console.log("Value was changed again");
////  speak();
//// });

//// AUTO SPEAK TEST ! ////
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++ TEST ++++++++++++++++++++++++++++++++++ //
